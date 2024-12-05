---
title: Batch Throttling Pattern Implementation
description: Learn advanced batch throttling patterns for optimizing bulk operations. Master request batching, rate limiting, and efficient resource utilization.
date: 2024-01-01
author: Underwood Inc
tags:
  - Batch Processing
  - Throttling
  - Performance
  - TypeScript
  - Rate Limiting
  - Resource Management
category: examples
image: /web-patterns/images/batch-throttling-banner.png
---

# Batch Throttling Examples

Learn how to implement batch processing with throttling for better performance and resource management.

## Basic Usage

```typescript
// Simple batch processor
async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
  }

  return results;
}

// Batch processor with delay
async function processBatchWithDelay<T, R>(
  items: T[],
  batchSize: number,
  delayMs: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
  }

  return results;
}
```

## Advanced Patterns

### Throttled Batch Processor

```typescript
interface ThrottledBatchOptions<T, R> {
  batchSize: number;
  minDelay: number;
  maxDelay: number;
  processor: (batch: T[]) => Promise<R[]>;
  onBatchComplete?: (results: R[], timing: number) => void;
  onBatchError?: (error: Error, batch: T[]) => void;
}

class ThrottledBatchProcessor<T, R> {
  private queue: T[] = [];
  private processing = false;
  private currentDelay: number;
  private lastProcessTime: number = 0;
  private processingTimes: number[] = [];

  constructor(private options: ThrottledBatchOptions<T, R>) {
    this.currentDelay = options.minDelay;
  }

  async add(items: T[]): Promise<void> {
    this.queue.push(...items);

    if (!this.processing) {
      this.processing = true;
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const timeSinceLastProcess = Date.now() - this.lastProcessTime;
      const timeToWait = Math.max(0, this.currentDelay - timeSinceLastProcess);

      if (timeToWait > 0) {
        await new Promise((resolve) => setTimeout(resolve, timeToWait));
      }

      const batch = this.queue.splice(0, this.options.batchSize);
      const startTime = Date.now();

      try {
        const results = await this.options.processor(batch);
        const processingTime = Date.now() - startTime;

        this.updateProcessingMetrics(processingTime);

        if (this.options.onBatchComplete) {
          this.options.onBatchComplete(results, processingTime);
        }
      } catch (error) {
        if (this.options.onBatchError) {
          this.options.onBatchError(error as Error, batch);
        }
        // Re-queue failed items
        this.queue.unshift(...batch);
        // Increase delay on error
        this.increaseDelay();
      }

      this.lastProcessTime = Date.now();
    }

    this.processing = false;
  }

  private updateProcessingMetrics(processingTime: number): void {
    this.processingTimes.push(processingTime);
    if (this.processingTimes.length > 10) {
      this.processingTimes.shift();
    }

    const avgProcessingTime =
      this.processingTimes.reduce((a, b) => a + b) /
      this.processingTimes.length;
    this.adjustDelay(avgProcessingTime);
  }

  private adjustDelay(avgProcessingTime: number): void {
    if (avgProcessingTime > this.currentDelay) {
      this.increaseDelay();
    } else if (avgProcessingTime < this.currentDelay / 2) {
      this.decreaseDelay();
    }
  }

  private increaseDelay(): void {
    this.currentDelay = Math.min(
      this.options.maxDelay,
      this.currentDelay * 1.5
    );
  }

  private decreaseDelay(): void {
    this.currentDelay = Math.max(
      this.options.minDelay,
      this.currentDelay * 0.8
    );
  }

  getCurrentDelay(): number {
    return this.currentDelay;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}
```

### Concurrent Batch Processor

```typescript
interface ConcurrentBatchOptions<T, R> {
  batchSize: number;
  concurrency: number;
  processor: (batch: T[]) => Promise<R[]>;
  onBatchComplete?: (results: R[]) => void;
  onBatchError?: (error: Error, batch: T[]) => void;
}

class ConcurrentBatchProcessor<T, R> {
  private queue: T[] = [];
  private activeProcessors = 0;
  private processing = false;

  constructor(private options: ConcurrentBatchOptions<T, R>) {}

  async add(items: T[]): Promise<void> {
    this.queue.push(...items);

    if (!this.processing) {
      this.processing = true;
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      if (this.activeProcessors >= this.options.concurrency) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        continue;
      }

      const batch = this.queue.splice(0, this.options.batchSize);
      this.activeProcessors++;

      this.processBatch(batch).finally(() => {
        this.activeProcessors--;
      });
    }

    // Wait for all processors to complete
    while (this.activeProcessors > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.processing = false;
  }

  private async processBatch(batch: T[]): Promise<void> {
    try {
      const results = await this.options.processor(batch);

      if (this.options.onBatchComplete) {
        this.options.onBatchComplete(results);
      }
    } catch (error) {
      if (this.options.onBatchError) {
        this.options.onBatchError(error as Error, batch);
      }
      // Re-queue failed items
      this.queue.unshift(...batch);
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  getActiveProcessors(): number {
    return this.activeProcessors;
  }
}
```

### Priority Batch Processor

```typescript
interface PriorityBatchItem<T> {
  data: T;
  priority: number;
}

interface PriorityBatchOptions<T, R> {
  batchSize: number;
  processor: (batch: T[]) => Promise<R[]>;
  maxDelay: number;
  priorityLevels: number;
}

class PriorityBatchProcessor<T, R> {
  private queues: T[][] = [];
  private processing = false;
  private lastProcessTime: number = 0;

  constructor(private options: PriorityBatchOptions<T, R>) {
    this.queues = Array.from({ length: options.priorityLevels }, () => []);
  }

  add(item: PriorityBatchItem<T>): void {
    this.queues[item.priority].push(item.data);

    if (!this.processing) {
      this.processing = true;
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    while (this.hasItems()) {
      const timeSinceLastProcess = Date.now() - this.lastProcessTime;
      const timeToWait = Math.max(
        0,
        this.options.maxDelay - timeSinceLastProcess
      );

      if (timeToWait > 0) {
        await new Promise((resolve) => setTimeout(resolve, timeToWait));
      }

      const batch = this.collectNextBatch();

      try {
        await this.options.processor(batch);
      } catch (error) {
        // Re-queue failed items at the same priority level
        const priority = this.findHighestPriorityWithItems();
        this.queues[priority].unshift(...batch);
      }

      this.lastProcessTime = Date.now();
    }

    this.processing = false;
  }

  private hasItems(): boolean {
    return this.queues.some((queue) => queue.length > 0);
  }

  private findHighestPriorityWithItems(): number {
    for (let i = this.queues.length - 1; i >= 0; i--) {
      if (this.queues[i].length > 0) {
        return i;
      }
    }
    return 0;
  }

  private collectNextBatch(): T[] {
    const batch: T[] = [];
    let remaining = this.options.batchSize;

    // Start from highest priority queue
    for (let i = this.queues.length - 1; i >= 0 && remaining > 0; i--) {
      const queue = this.queues[i];
      const itemsToTake = Math.min(remaining, queue.length);

      if (itemsToTake > 0) {
        batch.push(...queue.splice(0, itemsToTake));
        remaining -= itemsToTake;
      }
    }

    return batch;
  }

  getQueueLengths(): number[] {
    return this.queues.map((queue) => queue.length);
  }

  getTotalItems(): number {
    return this.queues.reduce((sum, queue) => sum + queue.length, 0);
  }
}
```
