---
title: Batch Throttling Examples
description: Explore batch processing and throttling techniques in JavaScript. Learn how to optimize performance with batched operations and rate limiting.
date: 2024-01-01
author: Underwood Inc
tags:
  - JavaScript
  - Batch Processing
  - Throttling
  - Performance
  - Examples
  - Best Practices
image: /web-patterns/images/batch-throttling-examples-banner.png
---

# Batch Throttling Examples

This page demonstrates practical examples of implementing and using batch throttling patterns for efficient API calls and resource management.

## Basic Batch Processor

```typescript:preview
// Basic batch processor with throttling
class BatchProcessor<T, R> {
  private queue: T[] = [];
  private processing = false;
  private results: Map<T, R> = new Map();
  private errors: Map<T, Error> = new Map();

  constructor(
    private readonly processor: (items: T[]) => Promise<R[]>,
    private readonly options: {
      batchSize: number;
      intervalMs: number;
    }
  ) {}

  async add(item: T): Promise<R> {
    this.queue.push(item);
    this.startProcessing();

    return new Promise((resolve, reject) => {
      const checkResult = () => {
        if (this.results.has(item)) {
          resolve(this.results.get(item)!);
          return;
        }
        if (this.errors.has(item)) {
          reject(this.errors.get(item));
          return;
        }
        setTimeout(checkResult, 100);
      };
      checkResult();
    });
  }

  private async startProcessing(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.options.batchSize);

      try {
        const results = await this.processor(batch);
        batch.forEach((item, index) => {
          this.results.set(item, results[index]);
        });
      } catch (error) {
        batch.forEach((item) => {
          this.errors.set(item, error as Error);
        });
      }

      await new Promise((resolve) =>
        setTimeout(resolve, this.options.intervalMs)
      );
    }

    this.processing = false;
  }
}

// Usage
const batchProcessor = new BatchProcessor(
  async (items: number[]) => {
    const response = await fetch('/api/batch', {
      method: 'POST',
      body: JSON.stringify(items),
    });
    return response.json();
  },
  {
    batchSize: 10,
    intervalMs: 1000,
  }
);

// Process items
const results = await Promise.all([
  batchProcessor.add(1),
  batchProcessor.add(2),
  batchProcessor.add(3),
]);
```

## Advanced Batch Throttling

```typescript:preview
class ThrottledBatchProcessor<T, R> {
  private queue: Array<{
    item: T;
    resolve: (result: R) => void;
    reject: (error: Error) => void;
  }> = [];
  private processing = false;
  private lastBatchTime = 0;

  constructor(
    private readonly processor: (items: T[]) => Promise<R[]>,
    private readonly options: {
      batchSize: number;
      minInterval: number;
      maxInterval: number;
      maxQueueSize?: number;
      onQueueFull?: (droppedItem: T) => void;
      onBatchComplete?: (results: R[], duration: number) => void;
      onBatchError?: (error: Error, items: T[]) => void;
    }
  ) {}

  async submit(item: T): Promise<R> {
    if (
      this.options.maxQueueSize &&
      this.queue.length >= this.options.maxQueueSize
    ) {
      this.options.onQueueFull?.(item);
      throw new Error('Queue is full');
    }

    return new Promise<R>((resolve, reject) => {
      this.queue.push({ item, resolve, reject });
      this.startProcessing();
    });
  }

  private async startProcessing(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const timeSinceLastBatch = Date.now() - this.lastBatchTime;
      const waitTime = Math.max(
        0,
        this.options.minInterval - timeSinceLastBatch
      );

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      const batch = this.queue.splice(0, this.options.batchSize);
      const items = batch.map((b) => b.item);

      const startTime = Date.now();
      try {
        const results = await this.processor(items);
        batch.forEach((b, i) => b.resolve(results[i]));

        const duration = Date.now() - startTime;
        this.options.onBatchComplete?.(results, duration);

        // Adjust interval based on processing time
        const processingTime = duration / items.length;
        this.adjustInterval(processingTime);
      } catch (error) {
        batch.forEach((b) => b.reject(error as Error));
        this.options.onBatchError?.(error as Error, items);
      }

      this.lastBatchTime = Date.now();
    }

    this.processing = false;
  }

  private adjustInterval(processingTime: number): void {
    const newInterval = Math.min(
      Math.max(processingTime * 2, this.options.minInterval),
      this.options.maxInterval
    );

    this.options.minInterval = newInterval;
  }
}

// Usage
const batchProcessor = new ThrottledBatchProcessor(
  async (items: number[]) => {
    const response = await fetch('/api/batch', {
      method: 'POST',
      body: JSON.stringify(items),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  },
  {
    batchSize: 10,
    minInterval: 1000,
    maxInterval: 5000,
    maxQueueSize: 1000,
    onQueueFull: (item) => {
      console.warn('Queue full, dropping item:', item);
    },
    onBatchComplete: (results, duration) => {
      console.log(`Batch processed in ${duration}ms:`, results.length, 'items');
    },
    onBatchError: (error, items) => {
      console.error('Batch processing failed:', error, 'Items:', items);
    },
  }
);
```

## Real-World Example: Rate-Limited API Client

```typescript:preview
class RateLimitedApiClient {
  private batchProcessor: ThrottledBatchProcessor<ApiRequest, ApiResponse>;
  private rateLimits: Map<string, RateLimit> = new Map();

  constructor(
    private readonly baseUrl: string,
    private readonly options: {
      defaultRateLimit: number;
      defaultBatchSize: number;
      maxQueueSize: number;
      retryOptions?: RetryOptions;
    }
  ) {
    this.batchProcessor = new ThrottledBatchProcessor(
      this.processBatch.bind(this),
      {
        batchSize: options.defaultBatchSize,
        minInterval: 1000 / options.defaultRateLimit,
        maxInterval: 5000,
        maxQueueSize: options.maxQueueSize,
        onBatchComplete: this.updateRateLimits.bind(this),
        onBatchError: this.handleBatchError.bind(this),
      }
    );
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const request: ApiRequest = {
      endpoint,
      options,
      id: crypto.randomUUID(),
    };

    try {
      const response = await this.batchProcessor.submit(request);
      return response.data as T;
    } catch (error) {
      if (this.shouldRetry(error as Error)) {
        return this.retryRequest<T>(endpoint, options);
      }
      throw error;
    }
  }

  private async processBatch(requests: ApiRequest[]): Promise<ApiResponse[]> {
    const batchRequest = {
      requests: requests.map((r) => ({
        method: r.options.method || 'GET',
        endpoint: r.endpoint,
        body: r.options.body,
      })),
    };

    const response = await fetch(`${this.baseUrl}/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchRequest),
    });

    if (!response.ok) {
      throw new BatchError(response.status, response.statusText, requests);
    }

    const results = await response.json();
    return results.map((result: any, index: number) => ({
      id: requests[index].id,
      data: result,
      timestamp: Date.now(),
    }));
  }

  private updateRateLimits(response: ApiResponse[], duration: number): void {
    // Update rate limits based on response headers
    const rateLimit = this.extractRateLimit(response[0]);
    if (rateLimit) {
      this.rateLimits.set('default', rateLimit);
      this.adjustBatchSize(rateLimit, duration);
    }
  }

  private adjustBatchSize(rateLimit: RateLimit, duration: number): void {
    const requestsPerSecond = (1000 / duration) * this.options.defaultBatchSize;

    if (requestsPerSecond > rateLimit.limit) {
      this.options.defaultBatchSize = Math.max(
        1,
        Math.floor(this.options.defaultBatchSize * 0.8)
      );
    } else if (requestsPerSecond < rateLimit.limit * 0.8) {
      this.options.defaultBatchSize = Math.min(
        100,
        Math.ceil(this.options.defaultBatchSize * 1.2)
      );
    }
  }

  private async retryRequest<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    const retryStrategy = new RetryStrategy(
      this.options.retryOptions || {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 5000,
        backoffFactor: 2,
      }
    );

    return retryStrategy.execute(async () => {
      return this.request<T>(endpoint, options);
    });
  }

  private shouldRetry(error: Error): boolean {
    if (error instanceof BatchError) {
      return error.status >= 500 || error.status === 429;
    }
    return false;
  }

  private extractRateLimit(response: ApiResponse): RateLimit | null {
    // Extract rate limit from response headers
    return {
      limit: 100,
      remaining: 95,
      reset: Date.now() + 60000,
    };
  }
}

class BatchError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly requests: ApiRequest[]
  ) {
    super(`Batch request failed: ${status} ${statusText}`);
    this.name = 'BatchError';
  }
}

// Usage
const api = new RateLimitedApiClient('https://api.example.com', {
  defaultRateLimit: 100,
  defaultBatchSize: 10,
  maxQueueSize: 1000,
  retryOptions: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 5000,
    backoffFactor: 2,
  },
});

// Make requests
const [users, posts] = await Promise.all([
  api.request<User[]>('/users'),
  api.request<Post[]>('/posts'),
]);
```

## Best Practices

1. Dynamic batch sizing:

   ```typescript:preview
   class DynamicBatchSizer {
     private successRates: number[] = [];
     private currentSize: number;

     constructor(
       private readonly minSize: number,
       private readonly maxSize: number,
       private readonly targetSuccessRate: number = 0.95
     ) {
       this.currentSize = minSize;
     }

     updateMetrics(successCount: number, totalCount: number): void {
       const successRate = successCount / totalCount;
       this.successRates.push(successRate);

       if (this.successRates.length >= 10) {
         this.adjustBatchSize();
         this.successRates = [];
       }
     }

     private adjustBatchSize(): void {
       const averageSuccessRate =
         this.successRates.reduce((a, b) => a + b) / this.successRates.length;

       if (averageSuccessRate >= this.targetSuccessRate) {
         this.currentSize = Math.min(
           this.maxSize,
           Math.ceil(this.currentSize * 1.2)
         );
       } else {
         this.currentSize = Math.max(
           this.minSize,
           Math.floor(this.currentSize * 0.8)
         );
       }
     }

     getCurrentSize(): number {
       return this.currentSize;
     }
   }
   ```

2. Priority queuing:

   ```typescript:preview
   class PriorityBatchProcessor<T> {
     private queues: Map<Priority, T[]> = new Map();

     constructor(
       private readonly processor: (items: T[]) => Promise<void>,
       private readonly options: {
         batchSize: number;
         interval: number;
       }
     ) {
       this.queues.set('high', []);
       this.queues.set('medium', []);
       this.queues.set('low', []);
     }

     add(item: T, priority: Priority = 'medium'): void {
       this.queues.get(priority)!.push(item);
     }

     private async processBatch(): Promise<void> {
       const batch: T[] = [];

       for (const priority of ['high', 'medium', 'low']) {
         const queue = this.queues.get(priority as Priority)!;
         while (batch.length < this.options.batchSize && queue.length > 0) {
           batch.push(queue.shift()!);
         }
       }

       if (batch.length > 0) {
         await this.processor(batch);
       }
     }
   }
   ```

3. Resource monitoring:

   ```typescript:preview
   class ResourceAwareBatchProcessor<T> {
     private readonly monitor = new ResourceMonitor();

     async processBatch(items: T[]): Promise<void> {
       const metrics = await this.monitor.getMetrics();

       if (metrics.cpuUsage > 80 || metrics.memoryUsage > 80) {
         // Reduce batch size or increase interval
         this.adjustForHighLoad();
         return;
       }

       // Process normally
       await this.processor(items);
     }

     private adjustForHighLoad(): void {
       this.options.batchSize = Math.max(
         1,
         Math.floor(this.options.batchSize * 0.5)
       );
       this.options.interval *= 2;
     }
   }
   ```

4. Circuit breaking:

   ```typescript:preview
   class BatchCircuitBreaker {
     private failures = 0;
     private lastFailureTime = 0;
     private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

     constructor(
       private readonly threshold: number = 5,
       private readonly resetTimeout: number = 60000
     ) {}

     async executeBatch<T>(
       batch: T[],
       processor: (items: T[]) => Promise<void>
     ): Promise<void> {
       if (this.state === 'OPEN') {
         if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
           this.state = 'HALF_OPEN';
         } else {
           throw new Error('Circuit breaker is OPEN');
         }
       }

       try {
         await processor(batch);
         if (this.state === 'HALF_OPEN') {
           this.state = 'CLOSED';
         }
         this.failures = 0;
       } catch (error) {
         this.failures++;
         this.lastFailureTime = Date.now();

         if (this.failures >= this.threshold) {
           this.state = 'OPEN';
         }
         throw error;
       }
     }
   }
   ```
