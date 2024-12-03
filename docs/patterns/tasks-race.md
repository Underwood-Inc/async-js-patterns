# Implementing N Async Tasks in Race

## Overview

Running async tasks in race means executing multiple tasks simultaneously and taking the result of the first task that completes successfully. This pattern is useful when you have multiple ways to accomplish the same goal and want the fastest result.

## Implementation

```typescript
type AsyncTask<T> = () => Promise<T>;

async function executeInRace<T>(
  tasks: AsyncTask<T>[],
  options: {
    timeout?: number;
    onTaskComplete?: (result: T, index: number) => void;
    onTaskError?: (error: Error, index: number) => void;
  } = {}
): Promise<T> {
  const { timeout, onTaskComplete, onTaskError } = options;

  if (tasks.length === 0) {
    throw new Error('No tasks provided');
  }

  return new Promise<T>((resolve, reject) => {
    let isResolved = false;
    let completedCount = 0;
    const errors: Error[] = [];

    // Create timeout promise if needed
    const timeoutPromise = timeout
      ? new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Race timeout')), timeout)
        )
      : null;

    // Execute each task
    const racingPromises = tasks.map((task, index) =>
      task()
        .then(result => {
          if (!isResolved) {
            isResolved = true;
            onTaskComplete?.(result, index);
            resolve(result);
          }
        })
        .catch(error => {
          errors.push(error);
          onTaskError?.(error, index);
          completedCount++;

          // If all tasks failed, reject with aggregate error
          if (completedCount === tasks.length) {
            reject(new AggregateError(errors, 'All tasks failed'));
          }
        })
    );

    // Add timeout to the race if specified
    if (timeoutPromise) {
      racingPromises.push(timeoutPromise);
    }

    // Start the race
    Promise.race(racingPromises).catch(reject);
  });
}
```

## Usage Example

```typescript
// Example tasks
const tasks: AsyncTask<string>[] = [
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Fast API';
  },
  async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return 'Slow API';
  },
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Failed API');
  }
];

// Execute tasks in race
executeInRace(tasks, {
  timeout: 3000,
  onTaskComplete: (result, index) => {
    console.log(`Task ${index} completed first with: ${result}`);
  },
  onTaskError: (error, index) => {
    console.log(`Task ${index} failed with: ${error.message}`);
  }
})
  .then(result => {
    console.log('Winner:', result);
  })
  .catch(error => {
    if (error instanceof AggregateError) {
      console.error('All tasks failed:', error.errors);
    } else {
      console.error('Race failed:', error);
    }
  });
```

## Key Concepts

1. **First Success Wins**: Takes result of first successful completion
2. **Error Handling**: Continues on individual failures
3. **Timeout Support**: Optional time limit for race
4. **Progress Tracking**: Optional callbacks for task completion

## Edge Cases

- Empty task array
- All tasks fail
- Timeout occurs
- Tasks complete simultaneously
- Resource cleanup for losing tasks

## Common Pitfalls

1. **Resource Leaks**: Not cancelling losing tasks
2. **Error Handling**: Not handling individual task failures
3. **Timeout Management**: Not cleaning up after timeout
4. **Memory Management**: Not limiting concurrent tasks

## Best Practices

1. Implement proper task cancellation
2. Include timeout mechanisms
3. Handle all error cases
4. Clean up resources
5. Monitor task progress

## Testing

```typescript
// Test first success wins
const successTasks: AsyncTask<number>[] = [
  async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return 1;
  },
  async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return 2;
  }
];

const raceTest = executeInRace(successTasks)
  .then(result => {
    console.assert(result === 2, 'Faster task should win');
  });

// Test timeout
const timeoutTasks: AsyncTask<number>[] = [
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 1;
  }
];

const timeoutTest = executeInRace(timeoutTasks, { timeout: 500 })
  .catch(error => {
    console.assert(
      error.message === 'Race timeout',
      'Should timeout correctly'
    );
  });

// Test all failures
const failTasks: AsyncTask<number>[] = [
  async () => { throw new Error('Error 1'); },
  async () => { throw new Error('Error 2'); }
];

const failTest = executeInRace(failTasks)
  .catch(error => {
    console.assert(
      error instanceof AggregateError,
      'Should collect all errors'
    );
  });
```

## Advanced Usage

```typescript
// With cancellation support
interface CancellableTask<T> {
  execute: () => Promise<T>;
  cancel: () => void;
}

async function executeInRaceWithCancellation<T>(
  tasks: CancellableTask<T>[],
  timeout?: number
): Promise<T> {
  const cleanup = () => {
    tasks.forEach(task => task.cancel());
  };

  try {
    const result = await executeInRace(
      tasks.map(task => task.execute),
      { timeout }
    );
    cleanup();
    return result;
  } catch (error) {
    cleanup();
    throw error;
  }
}

// Example usage with fetch
function createCancellableRequest(url: string): CancellableTask<Response> {
  const controller = new AbortController();
  
  return {
    execute: () => fetch(url, { signal: controller.signal }),
    cancel: () => controller.abort()
  };
}

// Race multiple API endpoints
const endpoints = [
  'https://api1.example.com',
  'https://api2.example.com',
  'https://api3.example.com'
];

const tasks = endpoints.map(url => createCancellableRequest(url));

executeInRaceWithCancellation(tasks, 5000)
  .then(response => response.json())
  .then(data => console.log('First response:', data))
  .catch(error => console.error('All requests failed:', error));
```
