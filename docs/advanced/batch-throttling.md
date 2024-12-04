# Batch Throttling

## Overview

Batch throttling is an advanced rate-limiting technique that groups multiple function calls or requests into batches and processes them together. This approach optimizes resource usage by reducing the total number of operations while still handling all requests efficiently.

### Real-World Analogy

Think of batch throttling like a postal service's mail sorting system:

- Individual letters (requests) arrive continuously
- The sorting facility (batch processor) collects letters for a period
- When enough letters accumulate or time elapses, they're processed together
- Each batch is delivered efficiently as one unit
- Resources are optimized by handling multiple items at once

### Common Use Cases

1. **Bulk API Operations**

   - Problem: Many individual API calls causing network congestion
   - Solution: Group related calls into single batch request
   - Benefit: Reduced network overhead and better throughput

2. **Database Operations**

   - Problem: High frequency of individual database writes
   - Solution: Batch multiple writes into single transaction
   - Benefit: Improved database performance and reduced load

3. **Analytics Events**
   - Problem: High volume of individual event tracking calls
   - Solution: Collect events and send in batches
   - Benefit: Efficient data transmission and processing

### How It Works

1. **Collection Phase**

   - Incoming requests are queued
   - Queue size is monitored
   - Timer tracks collection period

2. **Batch Processing**

   - Triggered by size threshold
   - Triggered by time threshold
   - Process all queued items

3. **Resource Management**

   - Optimize batch size
   - Handle timeouts
   - Manage memory usage

4. **Error Handling**
   - Batch failure recovery
   - Individual item retry
   - Error reporting

## Implementation

```typescript
interface BatchOptions<T, R> {
  maxBatchSize: number;
  maxWaitTime: number;
  batchProcessor: (items: T[]) => Promise<R[]>;
  errorHandler?: (error: Error, items: T[]) => void;
  retryOptions?: {
    maxAttempts: number;
    backoffMs: number;
  };
}

class BatchProcessor<T, R> {
  private queue: T[] = [];
  private pending: Map<
    T,
    { resolve: (value: R) => void; reject: (error: Error) => void }
  > = new Map();
  private timeoutId: NodeJS.Timeout | null = null;
  private processing = false;

  constructor(private options: BatchOptions<T, R>) {}

  async add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.queue.push(item);
      this.pending.set(item, { resolve, reject });
      this.scheduleProcessing();
    });
  }

  private scheduleProcessing(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (this.queue.length >= this.options.maxBatchSize) {
      this.processBatch();
    } else {
      this.timeoutId = setTimeout(
        () => this.processBatch(),
        this.options.maxWaitTime
      );
    }
  }

  private async processBatch(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const batch = this.queue.splice(0, this.options.maxBatchSize);
    const pendingItems = batch.map((item) => this.pending.get(item)!);

    try {
      const results = await this.processWithRetry(batch);

      // Resolve individual promises
      results.forEach((result, index) => {
        const item = batch[index];
        const { resolve } = this.pending.get(item)!;
        this.pending.delete(item);
        resolve(result);
      });
    } catch (error) {
      // Handle batch failure
      this.options.errorHandler?.(error as Error, batch);
      batch.forEach((item) => {
        const { reject } = this.pending.get(item)!;
        this.pending.delete(item);
        reject(error as Error);
      });
    } finally {
      this.processing = false;
      if (this.queue.length > 0) {
        this.scheduleProcessing();
      }
    }
  }

  private async processWithRetry(batch: T[]): Promise<R[]> {
    const { maxAttempts = 3, backoffMs = 1000 } =
      this.options.retryOptions || {};
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        return await this.options.batchProcessor(batch);
      } catch (error) {
        attempt++;
        if (attempt === maxAttempts) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, backoffMs * Math.pow(2, attempt))
        );
      }
    }

    throw new Error('Should not reach here');
  }
}
```

## Usage Example

```typescript
// Example with API calls
interface User {
  id: number;
  name: string;
}

const batchProcessor = new BatchProcessor<number, User>({
  maxBatchSize: 50,
  maxWaitTime: 100,
  batchProcessor: async (ids: number[]) => {
    const response = await fetch('/api/users/batch', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
    return response.json();
  },
  errorHandler: (error, items) => {
    console.error(`Batch processing failed for ${items.length} items:`, error);
  },
});

// Individual calls get automatically batched
const user1Promise = batchProcessor.add(1);
const user2Promise = batchProcessor.add(2);
const user3Promise = batchProcessor.add(3);

// All requests are combined into one API call
Promise.all([user1Promise, user2Promise, user3Promise]).then((users) =>
  console.log('Fetched users:', users)
);
```

## Key Concepts

1. **Request Batching**: Combine multiple requests into one
2. **Queue Management**: Handle incoming requests efficiently
3. **Timeout Control**: Balance between latency and batch size
4. **Error Handling**: Manage failures at batch and individual levels
5. **Retry Logic**: Handle transient failures

## Edge Cases

- Queue overflow
- Timeout race conditions
- Partial batch success
- Request cancellation
- Server rate limits

## Common Pitfalls

1. **Memory Leaks**: Not cleaning up pending requests
2. **Starvation**: Long wait times for small batches
3. **Error Propagation**: Incorrect error handling
4. **Batch Size**: Inefficient batch sizes

## Best Practices

1. Choose appropriate batch sizes
2. Implement request timeouts
3. Handle partial failures
4. Monitor queue size
5. Implement circuit breaking

## Testing

```typescript
// Test batch grouping
const batchTest = async () => {
  let batchCount = 0;
  const processor = new BatchProcessor<number, number>({
    maxBatchSize: 3,
    maxWaitTime: 50,
    batchProcessor: async (items) => {
      batchCount++;
      return items.map((x) => x * 2);
    },
  });

  const results = await Promise.all([
    processor.add(1),
    processor.add(2),
    processor.add(3),
    processor.add(4),
  ]);

  console.assert(
    batchCount === 2,
    'Should process items in correct batch sizes'
  );
  console.assert(
    JSON.stringify(results) === '[2,4,6,8]',
    'Should return correct results'
  );
};

// Test error handling
const errorTest = async () => {
  let errorHandled = false;
  const processor = new BatchProcessor<number, number>({
    maxBatchSize: 2,
    maxWaitTime: 50,
    batchProcessor: async () => {
      throw new Error('Batch failed');
    },
    errorHandler: () => {
      errorHandled = true;
    },
  });

  try {
    await processor.add(1);
  } catch (error) {
    console.assert(errorHandled, 'Should call error handler');
  }
};
```

## Advanced Usage

```typescript
// With priority queues
class PriorityBatchProcessor<T, R> extends BatchProcessor<T, R> {
  private highPriorityQueue: T[] = [];
  private lowPriorityQueue: T[] = [];

  async addWithPriority(item: T, highPriority: boolean): Promise<R> {
    const queue = highPriority ? this.highPriorityQueue : this.lowPriorityQueue;
    return new Promise((resolve, reject) => {
      queue.push(item);
      this.pending.set(item, { resolve, reject });
      this.scheduleProcessing();
    });
  }

  protected override processBatch(): void {
    const highPriorityBatch = this.highPriorityQueue.splice(
      0,
      this.options.maxBatchSize
    );

    const remainingSpace = this.options.maxBatchSize - highPriorityBatch.length;
    const lowPriorityBatch = this.lowPriorityQueue.splice(0, remainingSpace);

    const batch = [...highPriorityBatch, ...lowPriorityBatch];
    super.processBatch(batch);
  }
}

// Usage with priorities
const priorityProcessor = new PriorityBatchProcessor<number, User>({
  maxBatchSize: 50,
  maxWaitTime: 100,
  batchProcessor: async (ids) => {
    const response = await fetch('/api/users/batch', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
    return response.json();
  },
});

// High priority request
priorityProcessor.addWithPriority(1, true);

// Low priority request
priorityProcessor.addWithPriority(2, false);
```
