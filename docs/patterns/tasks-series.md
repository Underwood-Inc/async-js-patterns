# Implementing N Async Tasks in Series

## Overview

Running async tasks in series means executing them one after another, where each
task waits for the previous task to complete before starting. This pattern is
useful when tasks depend on each other or need to be executed in a specific
order.

## Implementation

```typescript:preview
type AsyncTask<T, R> = (input: T) => Promise<R>;

async function executeInSeries<T, R>(
  tasks: AsyncTask<T, R>[],
  initialInput: T
): Promise<R[]> {
  const results: R[] = [];
  let currentInput: T = initialInput;

  for (const task of tasks) {
    try {
      const result = await task(currentInput);
      results.push(result);
      currentInput = result as unknown as T; // For tasks that chain inputs
    } catch (error) {
      throw new Error(`Task failed: ${error}`);
    }
  }

  return results;
}

// Version with input transformation
async function executeInSeriesWithTransform<T, R, U>(
  tasks: AsyncTask<T, R>[],
  initialInput: T,
  transform: (result: R) => T
): Promise<R[]> {
  const results: R[] = [];
  let currentInput: T = initialInput;

  for (const task of tasks) {
    const result = await task(currentInput);
    results.push(result);
    currentInput = transform(result);
  }

  return results;
}
```

## Usage Example

```typescript:preview
// Example tasks
const tasks: AsyncTask<number, number>[] = [
  async (n: number) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return n + 1;
  },
  async (n: number) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return n * 2;
  },
  async (n: number) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return n ** 2;
  },
];

// Execute tasks in series
executeInSeries(tasks, 1)
  .then((results) => {
    console.log(results); // [2, 4, 16]
  })
  .catch((error) => {
    console.error('Series execution failed:', error);
  });

// With transformation
const tasksWithTransform: AsyncTask<string, number>[] = [
  async (s: string) => parseInt(s) + 1,
  async (s: string) => parseInt(s) * 2,
  async (s: string) => parseInt(s) ** 2,
];

executeInSeriesWithTransform(tasksWithTransform, '1', (result) =>
  result.toString()
).then((results) => {
  console.log(results); // [2, 4, 16]
});
```

## Key Concepts

1. **Sequential Execution**: Tasks run one after another
2. **Input/Output Chaining**: Each task can use previous task's output
3. **Error Propagation**: Series stops on first error
4. **Type Safety**: Maintains types between tasks

## Edge Cases

- Empty task array
- Task throws error
- Task never resolves
- Invalid input type
- Memory leaks in long series

## Common Pitfalls

1. **Error Handling**: Not properly catching task errors
2. **Memory Management**: Accumulating results for long series
3. **Type Mismatches**: Incorrect input/output types
4. **Infinite Series**: Tasks that never complete

## Best Practices

1. Include proper error handling
2. Consider memory usage for long series
3. Implement timeouts for tasks
4. Maintain type safety
5. Consider cancellation mechanisms

## Testing

```typescript:preview
// Test successful series
const successTasks: AsyncTask<number, number>[] = [
  async (n) => n + 1,
  async (n) => n * 2,
];

const successTest = executeInSeries(successTasks, 1).then((results) => {
  console.assert(
    JSON.stringify(results) === '[2,4]',
    'Should execute in correct order'
  );
});

// Test error handling
const errorTasks: AsyncTask<number, number>[] = [
  async (n) => n + 1,
  async () => {
    throw new Error('Task failed');
  },
  async (n) => n * 2,
];

const errorTest = executeInSeries(errorTasks, 1).catch((error) => {
  console.assert(
    error.message.includes('Task failed'),
    'Should handle task errors'
  );
});

// Test empty series
const emptyTest = executeInSeries([], 1).then((results) => {
  console.assert(results.length === 0, 'Should handle empty task array');
});
```

## Advanced Usage

```typescript:preview
// With progress tracking
async function executeInSeriesWithProgress<T, R>(
  tasks: AsyncTask<T, R>[],
  initialInput: T,
  onProgress: (completed: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  let currentInput: T = initialInput;
  const total = tasks.length;

  for (let i = 0; i < tasks.length; i++) {
    const result = await tasks[i](currentInput);
    results.push(result);
    currentInput = result as unknown as T;
    onProgress(i + 1, total);
  }

  return results;
}

// With timeout and cancellation
async function executeInSeriesWithTimeout<T, R>(
  tasks: AsyncTask<T, R>[],
  initialInput: T,
  timeout: number,
  signal?: AbortSignal
): Promise<R[]> {
  const results: R[] = [];
  let currentInput: T = initialInput;

  for (const task of tasks) {
    if (signal?.aborted) {
      throw new Error('Series execution aborted');
    }

    const result = await Promise.race([
      task(currentInput),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Task timeout')), timeout)
      ),
    ]);

    results.push(result);
    currentInput = result as unknown as T;
  }

  return results;
}

// Usage with progress and timeout
const controller = new AbortController();

executeInSeriesWithTimeout(tasks, 1, 1000, controller.signal)
  .then((results) => console.log('Completed:', results))
  .catch((error) => console.error('Failed:', error));

// Abort after 2 seconds
setTimeout(() => controller.abort(), 2000);
```
