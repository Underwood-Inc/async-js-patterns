# Parallel Task Execution Examples

Learn how to execute multiple tasks in parallel while managing concurrency and resources.

## Basic Usage

```typescript
// Simple parallel execution
async function executeParallel<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
  return Promise.all(tasks.map((task) => task()));
}

// Parallel with concurrency limit
async function executeWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const inProgress = new Set<Promise<void>>();

  for (let i = 0; i < tasks.length; i++) {
    const processPromise = (async () => {
      const result = await tasks[i]();
      results[i] = result;
    })();

    inProgress.add(processPromise);
    processPromise.then(() => inProgress.delete(processPromise));

    if (inProgress.size >= concurrency) {
      await Promise.race(inProgress);
    }
  }

  await Promise.all(inProgress);
  return results;
}
```

## Advanced Patterns

### Task Pool

```typescript
class TaskPool {
  private queue: (() => Promise<any>)[] = [];
  private running = new Set<Promise<void>>();
  private concurrency: number;

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    if (this.running.size < this.concurrency) {
      return this.runTask(task);
    }

    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await task());
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private async runTask<T>(task: () => Promise<T>): Promise<T> {
    const promise = (async () => {
      try {
        return await task();
      } finally {
        this.running.delete(promise);
        if (this.queue.length > 0) {
          const nextTask = this.queue.shift()!;
          this.running.add(this.runTask(nextTask));
        }
      }
    })();

    this.running.add(promise);
    return promise;
  }

  async waitForAll(): Promise<void> {
    if (this.running.size === 0) return;
    await Promise.all(this.running);
  }
}

// Usage example
const pool = new TaskPool(3);

async function processItems<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  return Promise.all(items.map((item) => pool.add(() => processor(item))));
}
```

### Resource-Aware Parallel Execution

```typescript
interface Resource<T> {
  acquire(): Promise<T>;
  release(resource: T): Promise<void>;
}

class ResourcePool<T> implements Resource<T> {
  private available: T[] = [];
  private inUse = new Set<T>();
  private waitQueue: ((resource: T) => void)[] = [];

  constructor(resources: T[]) {
    this.available = [...resources];
  }

  async acquire(): Promise<T> {
    if (this.available.length > 0) {
      const resource = this.available.pop()!;
      this.inUse.add(resource);
      return resource;
    }

    return new Promise<T>((resolve) => {
      this.waitQueue.push(resolve);
    });
  }

  async release(resource: T): Promise<void> {
    this.inUse.delete(resource);

    if (this.waitQueue.length > 0) {
      const next = this.waitQueue.shift()!;
      next(resource);
    } else {
      this.available.push(resource);
    }
  }
}

async function executeWithResources<T, R>(
  tasks: ((resource: T) => Promise<R>)[],
  resourcePool: Resource<T>
): Promise<R[]> {
  const results: R[] = [];
  const executing = new Set<Promise<void>>();

  for (let i = 0; i < tasks.length; i++) {
    const task = async () => {
      const resource = await resourcePool.acquire();
      try {
        results[i] = await tasks[i](resource);
      } finally {
        await resourcePool.release(resource);
      }
    };

    const promise = task();
    executing.add(promise);
    promise.then(() => executing.delete(promise));
  }

  await Promise.all(executing);
  return results;
}
```

### Parallel with Progress Tracking

```typescript
interface ProgressUpdate {
  completed: number;
  total: number;
  percentage: number;
  results: any[];
}

async function executeWithProgress<T>(
  tasks: (() => Promise<T>)[],
  onProgress: (progress: ProgressUpdate) => void,
  concurrency: number = Infinity
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let completed = 0;

  const updateProgress = () => {
    completed++;
    onProgress({
      completed,
      total: tasks.length,
      percentage: (completed / tasks.length) * 100,
      results: results.filter((r) => r !== undefined),
    });
  };

  const executor = async (index: number) => {
    results[index] = await tasks[index]();
    updateProgress();
  };

  const executing = new Set<Promise<void>>();

  for (let i = 0; i < tasks.length; i++) {
    const promise = executor(i);
    executing.add(promise);
    promise.then(() => executing.delete(promise));

    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}
```
