---
title: Task Management in JavaScript
description: Learn effective patterns for managing multiple asynchronous tasks. Master parallel execution, sequential processing, and task coordination strategies.
date: 2024-01-01
author: Underwood Inc
tags:
  - Task Management
  - Async Tasks
  - Parallel Processing
  - Sequential Tasks
  - JavaScript
  - Performance
  - Concurrency
image: /web-patterns/images/tasks-banner.png
---

# Task Management

Learn how to effectively manage multiple asynchronous tasks in JavaScript.

## Sequential Tasks

Execute tasks one after another:

```typescript:preview
async function runSequentially<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

// Usage
const tasks = [
  () => fetchUserData(1),
  () => fetchUserData(2),
  () => fetchUserData(3)
];

const results = await runSequentially(tasks);
```

## Parallel Tasks

Execute tasks concurrently with control:

```typescript:preview
async function runParallel<T>(
  tasks: (() => Promise<T>)[],
  maxConcurrent = Infinity
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  const running = new Set<Promise<void>>();
  let nextIndex = 0;

  async function runTask(index: number) {
    try {
      results[index] = await tasks[index]();
    } catch (error) {
      throw error;
    }
  }

  while (nextIndex < tasks.length || running.size > 0) {
    if (nextIndex < tasks.length && running.size < maxConcurrent) {
      const index = nextIndex++;
      const promise = runTask(index).finally(() => running.delete(promise));
      running.add(promise);
    } else if (running.size > 0) {
      await Promise.race(running);
    }
  }

  return results;
}

// Usage with concurrency limit
const tasks = urls.map(url => () => fetch(url));
const results = await runParallel(tasks, 3); // Max 3 concurrent tasks
```

## Task Batching

Process tasks in batches:

```typescript:preview
async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>,
  options = { maxConcurrent: Infinity }
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await runParallel(
      batch.map(item => () => processor(item)),
      options.maxConcurrent
    );
    results.push(...batchResults);
  }

  return results;
}

// Usage
const users = await processBatch(
  userIds,
  10, // Process 10 items per batch
  fetchUserData,
  { maxConcurrent: 3 } // Max 3 concurrent requests
);
```

## Task Cancellation

Implement cancellable tasks:

```typescript:preview
interface CancellableTask<T> {
  promise: Promise<T>;
  cancel: () => void;
}

function createCancellableTask<T>(
  task: () => Promise<T>
): CancellableTask<T> {
  let isCancelled = false;
  let cleanup: (() => void) | undefined;

  const promise = new Promise<T>((resolve, reject) => {
    task()
      .then(result => {
        if (!isCancelled) resolve(result);
      })
      .catch(error => {
        if (!isCancelled) reject(error);
      })
      .finally(() => {
        if (cleanup) cleanup();
      });
  });

  return {
    promise,
    cancel: () => {
      isCancelled = true;
      if (cleanup) cleanup();
    }
  };
}

// Usage with cleanup
const task = createCancellableTask(async () => {
  const controller = new AbortController();
  cleanup = () => controller.abort();

  const response = await fetch('/api/data', {
    signal: controller.signal
  });
  return response.json();
});

// Cancel after timeout
setTimeout(() => task.cancel(), 5000);
```

## Task Queue

Implement a task queue with priorities:

```typescript:preview
interface QueuedTask<T> {
  task: () => Promise<T>;
  priority: number;
}

class TaskQueue {
  private queue: QueuedTask<any>[] = [];
  private running = false;
  private concurrency: number;

  constructor(concurrency = 1) {
    this.concurrency = concurrency;
  }

  enqueue<T>(
    task: () => Promise<T>,
    priority = 0
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task: () => task().then(resolve).catch(reject),
        priority
      });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.concurrency);
      await Promise.all(batch.map(item => item.task()));
    }

    this.running = false;
  }
}

// Usage
const queue = new TaskQueue(2); // Process 2 tasks concurrently

queue.enqueue(
  () => fetchImportantData(),
  1 // High priority
);

queue.enqueue(
  () => fetchRegularData(),
  0 // Normal priority
);
```

## Best Practices

1. **Task Organization**

   - Group related tasks logically
   - Consider task dependencies
   - Implement proper error boundaries

2. **Resource Management**

   - Control concurrency levels
   - Implement proper cancellation
   - Clean up resources after completion

3. **Error Handling**

   - Handle individual task failures
   - Implement retry strategies
   - Provide meaningful error context

4. **Performance**

   - Balance concurrency vs resources
   - Use appropriate batch sizes
   - Monitor task execution times

5. **Monitoring**
   - Track task progress
   - Log important events
   - Measure performance metrics
