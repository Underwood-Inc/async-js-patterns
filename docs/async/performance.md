---
title: Async Performance Guide
description: Master performance optimization in asynchronous JavaScript. Learn about throttling, debouncing, caching, and performance best practices.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Async
  - Performance
  - Optimization
  - Throttling
  - Best Practices
image: /web-patterns/images/async-performance-banner.png
---

# Performance

Learn how to optimize asynchronous operations for better performance.

## Caching Results

Implement efficient caching for async operations:

::: code-with-tooltips

```typescript
interface CacheOptions {
  ttl: number;  // Time to live in milliseconds
  maxSize?: number;  // Maximum cache size
  staleWhileRevalidate?: boolean;  // Allow stale data while fetching
}

class AsyncCache<T> {
  private cache = new Map<string, {
    value: T;
    expires: number;
    promise?: Promise<T>;
  }>();

  constructor(private options: CacheOptions) {}

  async get(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const now = Date.now();
    const cached = this.cache.get(key);

    // Return valid cached value
    if (cached && now < cached.expires) {
      return cached.value;
    }

    // Handle stale-while-revalidate
    if (cached && this.options.staleWhileRevalidate) {
      this.revalidate(key, fetcher);
      return cached.value;
    }

    // Prevent duplicate requests
    if (cached?.promise) {
      return cached.promise;
    }

    // Fetch new value
    const promise = fetcher().then(value => {
      this.set(key, value);
      return value;
    });

    this.cache.set(key, {
      ...cached,
      promise
    });

    return promise;
  }

  private set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + this.options.ttl
    });

    // Enforce max size
    if (this.options.maxSize && this.cache.size > this.options.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  private async revalidate(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<void> {
    try {
      const value = await fetcher();
      this.set(key, value);
    } catch (error) {
      console.error('Revalidation failed:', error);
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

// Usage
const cache = new AsyncCache<User>({
  ttl: 60000,  // 1 minute
  maxSize: 1000,
  staleWhileRevalidate: true
});

const user = await cache.get(
  `user:${id}`,
  () => fetchUser(id)
);
```

:::

## Request Batching

Batch multiple requests for better performance:

::: code-with-tooltips

```typescript
class BatchProcessor<T, R> {
  private batch: T[] = [];
  private promises: Array<{
    resolve: (value: R) => void;
    reject: (error: Error) => void;
  }> = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private processor: (items: T[]) => Promise<R[]>,
    private options: {
      maxSize: number;
      maxWait: number;
    }
  ) {}

  async add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.batch.push(item);
      this.promises.push({ resolve, reject });

      if (this.batch.length >= this.options.maxSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(
          () => this.flush(),
          this.options.maxWait
        );
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const items = [...this.batch];
    const promises = [...this.promises];
    this.batch = [];
    this.promises = [];

    try {
      const results = await this.processor(items);
      results.forEach((result, i) => promises[i].resolve(result));
    } catch (error) {
      promises.forEach(({ reject }) => reject(error));
    }
  }
}

// Usage
const batchProcessor = new BatchProcessor(
  async (ids: number[]) => {
    const response = await fetch('/api/users/batch', {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
    return response.json();
  },
  { maxSize: 100, maxWait: 50 }
);

// Automatically batches requests
const [user1, user2] = await Promise.all([
  batchProcessor.add(1),
  batchProcessor.add(2)
]);
```

:::

## Resource Pooling

Manage resource pools for better performance:

::: code-with-tooltips

```typescript
class ResourcePool<T> {
  private available: T[] = [];
  private inUse = new Set<T>();
  private waitQueue: Array<{
    resolve: (resource: T) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor(
    private factory: () => Promise<T>,
    private options: {
      minSize: number;
      maxSize: number;
      acquireTimeout?: number;
    }
  ) {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    for (let i = 0; i < this.options.minSize; i++) {
      const resource = await this.factory();
      this.available.push(resource);
    }
  }

  async acquire(): Promise<T> {
    if (this.available.length > 0) {
      const resource = this.available.pop()!;
      this.inUse.add(resource);
      return resource;
    }

    if (this.size < this.options.maxSize) {
      const resource = await this.factory();
      this.inUse.add(resource);
      return resource;
    }

    return new Promise((resolve, reject) => {
      const timeout = this.options.acquireTimeout;
      const timer = timeout && setTimeout(() => {
        const index = this.waitQueue.findIndex(p => p.resolve === resolve);
        if (index !== -1) {
          this.waitQueue.splice(index, 1);
          reject(new Error('Resource acquisition timed out'));
        }
      }, timeout);

      this.waitQueue.push({
        resolve: (resource: T) => {
          if (timer) clearTimeout(timer);
          resolve(resource);
        },
        reject
      });
    });
  }

  release(resource: T): void {
    this.inUse.delete(resource);

    if (this.waitQueue.length > 0) {
      const { resolve } = this.waitQueue.shift()!;
      this.inUse.add(resource);
      resolve(resource);
    } else {
      this.available.push(resource);
    }
  }

  get size(): number {
    return this.available.length + this.inUse.size;
  }
}

// Usage
const connectionPool = new ResourcePool(
  () => createDatabaseConnection(),
  {
    minSize: 5,
    maxSize: 20,
    acquireTimeout: 5000
  }
);

async function executeQuery(sql: string): Promise<any> {
  const connection = await connectionPool.acquire();
  try {
    return await connection.query(sql);
  } finally {
    connectionPool.release(connection);
  }
}
```

:::

## Memory Management

Implement memory-efficient processing:

::: code-with-tooltips

```typescript
async function* streamProcessor<T, R>(
  items: AsyncIterable<T>,
  operation: (item: T) => Promise<R>,
  options = { batchSize: 100 }
): AsyncGenerator<R> {
  let batch: T[] = [];

  for await (const item of items) {
    batch.push(item);

    if (batch.length >= options.batchSize) {
      const results = await Promise.all(
        batch.map(operation)
      );
      yield* results;
      batch = [];
    }
  }

  if (batch.length > 0) {
    const results = await Promise.all(
      batch.map(operation)
    );
    yield* results;
  }
}

// Usage
for await (const result of streamProcessor(
  fetchDataStream(),
  processItem,
  { batchSize: 50 }
)) {
  console.log(result);
}
```

:::

## Performance Monitoring

Monitor async operation performance:

::: code-with-tooltips

```typescript
interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: Error;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private listeners: ((metric: PerformanceMetrics) => void)[] = [];

  async measure<T>(
    operation: string,
    task: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    let success = true;
    let error: Error | undefined;

    try {
      return await task();
    } catch (e) {
      success = false;
      error = e instanceof Error ? e : new Error(String(e));
      throw e;
    } finally {
      const metric: PerformanceMetrics = {
        operation,
        duration: performance.now() - start,
        timestamp: Date.now(),
        success,
        error
      };

      this.metrics.push(metric);
      this.notify(metric);
    }
  }

  subscribe(listener: (metric: PerformanceMetrics) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify(metric: PerformanceMetrics): void {
    this.listeners.forEach(listener => listener(metric));
  }

  getMetrics(operation?: string): PerformanceMetrics[] {
    return operation
      ? this.metrics.filter(m => m.operation === operation)
      : [...this.metrics];
  }

  getAverageTime(operation: string): number {
    const metrics = this.getMetrics(operation);
    if (metrics.length === 0) return 0;

    const total = metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / metrics.length;
  }
}

// Usage
const monitor = new PerformanceMonitor();

monitor.subscribe(metric => {
  if (!metric.success || metric.duration > 1000) {
    console.warn('Slow operation:', metric);
  }
});

const result = await monitor.measure(
  'fetchUserData',
  () => fetchUser(id)
);
```

:::

## Best Practices

1. **Caching Strategy**

   - Implement appropriate TTL
   - Use stale-while-revalidate
   - Monitor cache hit rates

2. **Resource Management**

   - Pool expensive resources
   - Implement proper cleanup
   - Monitor resource usage

3. **Batch Processing**

   - Group related operations
   - Set appropriate batch sizes
   - Handle partial failures

4. **Memory Efficiency**

   - Use streaming for large datasets
   - Implement proper cleanup
   - Monitor memory usage

5. **Performance Monitoring**
   - Track operation timings
   - Monitor error rates
   - Set performance budgets
