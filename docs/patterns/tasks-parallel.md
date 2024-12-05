---
title: Parallel Task Execution Patterns
description: Learn how to implement efficient parallel task execution patterns in JavaScript and TypeScript applications.
head:
  - - meta
    - name: keywords
      content: parallel tasks, concurrent execution, async patterns, JavaScript, TypeScript, task management, performance optimization
  - - meta
    - name: author
      content: Modern Web Development Patterns
  - - meta
    - property: og:title
      content: Parallel Task Execution Patterns | Modern Web Development
  - - meta
    - property: og:description
      content: Master parallel task execution patterns to optimize performance and resource utilization in modern web applications.
---

# Parallel Task Execution Patterns

## Overview

Running async tasks in parallel means executing multiple tasks simultaneously without waiting for each other. This pattern is useful when tasks are independent and you want to maximize throughput.

## Implementation

```typescript:preview
type AsyncTask<T> = () => Promise<T>;

async function executeInParallel<T>(
  tasks: AsyncTask<T>[],
  concurrency: number = Infinity
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let currentIndex = 0;

  async function executeTask(taskIndex: number): Promise<void> {
    try {
      const result = await tasks[taskIndex]();
      results[taskIndex] = result;
    } catch (error) {
      throw new Error(`Task ${taskIndex} failed: ${error}`);
    }
  }

  const executeBatch = async (): Promise<void> => {
    const batch: Promise<void>[] = [];

    while (currentIndex < tasks.length && batch.length < concurrency) {
      batch.push(executeTask(currentIndex));
      currentIndex++;
    }

    if (batch.length > 0) {
      await Promise.all(batch);
    }
  };

  while (currentIndex < tasks.length) {
    await executeBatch();
  }

  return results;
}

// Version with progress tracking
async function executeInParallelWithProgress<T>(
  tasks: AsyncTask<T>[],
  concurrency: number = Infinity,
  onProgress?: (completed: number, total: number) => void
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let completed = 0;
  const total = tasks.length;

  const executeTask = async (
    task: AsyncTask<T>,
    index: number
  ): Promise<void> => {
    try {
      results[index] = await task();
      completed++;
      onProgress?.(completed, total);
    } catch (error) {
      throw new Error(`Task ${index} failed: ${error}`);
    }
  };

  const taskPromises = tasks.map((task, index) => executeTask(task, index));

  // Execute tasks in batches based on concurrency
  for (let i = 0; i < taskPromises.length; i += concurrency) {
    const batch = taskPromises.slice(i, i + concurrency);
    await Promise.all(batch);
  }

  return results;
}
```

## Usage Example

```typescript:preview
// Example tasks
const tasks: AsyncTask<number>[] = [
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 1;
  },
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return 2;
  },
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return 3;
  },
];

// Execute all tasks in parallel
executeInParallel(tasks)
  .then((results) => {
    console.log(results); // [1, 2, 3] (after ~2000ms)
  })
  .catch((error) => {
    console.error('Parallel execution failed:', error);
  });

// Execute with concurrency limit and progress tracking
executeInParallelWithProgress(
  tasks,
  2, // Max 2 concurrent tasks
  (completed, total) => {
    console.log(`Progress: ${completed}/${total}`);
  }
).then((results) => {
  console.log('All tasks completed:', results);
});
```

## Key Concepts

1. **Concurrent Execution**: Tasks run simultaneously
2. **Concurrency Control**: Optional limit on parallel tasks
3. **Progress Tracking**: Monitor completion status
4. **Resource Management**: Control system load

## Edge Cases

- Empty task array
- Task throws error
- Concurrency limit exceeded
- Memory constraints
- System resource limits

## Common Pitfalls

1. **Resource Exhaustion**: Too many concurrent tasks
2. **Memory Leaks**: Not cleaning up resources
3. **Error Handling**: Lost error contexts
4. **Race Conditions**: Unmanaged shared resources

## Best Practices

1. Set appropriate concurrency limits
2. Monitor system resources
3. Implement proper error handling
4. Consider task priorities
5. Include progress tracking

## Testing

```typescript:preview
// Test concurrent execution
const timedTasks: AsyncTask<number>[] = [
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return 1;
  },
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return 2;
  },
];

const startTime = Date.now();
const concurrencyTest = executeInParallel(timedTasks).then((results) => {
  const duration = Date.now() - startTime;
  console.assert(duration < 150, 'Tasks should execute concurrently');
  console.assert(results.length === 2, 'Should complete all tasks');
});

// Test error handling
const errorTasks: AsyncTask<number>[] = [
  async () => 1,
  async () => {
    throw new Error('Task failed');
  },
  async () => 3,
];

const errorTest = executeInParallel(errorTasks).catch((error) => {
  console.assert(
    error.message.includes('Task failed'),
    'Should handle task errors'
  );
});

// Test concurrency limit
const concurrentTasks = Array.from({ length: 5 }, (_, i) => async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return i;
});

const limitTest = executeInParallelWithProgress(
  concurrentTasks,
  2,
  (completed, total) => {
    console.assert(completed <= total, 'Should respect concurrency limit');
  }
);
```

## Advanced Usage

```typescript:preview
// With resource pool
class ResourcePool<T> {
  private resources: T[];
  private inUse: Set<T> = new Set();

  constructor(createResource: () => T, size: number) {
    this.resources = Array.from({ length: size }, () => createResource());
  }

  async acquire(): Promise<T> {
    const available = this.resources.find((r) => !this.inUse.has(r));
    if (available) {
      this.inUse.add(available);
      return available;
    }
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const resource = this.resources.find((r) => !this.inUse.has(r));
        if (resource) {
          clearInterval(interval);
          this.inUse.add(resource);
          resolve(resource);
        }
      }, 100);
    });
  }

  release(resource: T): void {
    this.inUse.delete(resource);
  }
}

// Usage with resource pool
const pool = new ResourcePool(() => new Worker('./worker.js'), 3);

async function executeWithPool<T>(
  tasks: AsyncTask<T>[],
  pool: ResourcePool<Worker>
): Promise<T[]> {
  return executeInParallel(
    tasks.map((task) => async () => {
      const worker = await pool.acquire();
      try {
        return await task();
      } finally {
        pool.release(worker);
      }
    }),
    pool.size
  );
}
```
