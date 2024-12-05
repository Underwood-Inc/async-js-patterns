---
title: Custom setInterval Implementation
description: Create your own setInterval implementation in TypeScript. Master recurring timer patterns, drift compensation, and advanced interval management.
date: 2024-01-01
author: Underwood Inc
tags:
  - setInterval
  - Timer Implementation
  - TypeScript
  - Event Loop
  - Performance
  - System Design
category: examples
image: /web-patterns/images/custom-setinterval-banner.png
---

# Custom setInterval Examples

Learn how to create and use custom setInterval implementations with advanced features.

## Basic Usage

```typescript
// Promise-based interval
function setIntervalAsync(
  callback: () => Promise<void>,
  ms: number
): () => void {
  let active = true;

  (async () => {
    while (active) {
      await callback();
      await new Promise((resolve) => setTimeout(resolve, ms));
    }
  })();

  return () => {
    active = false;
  };
}

// Cancellable interval
function setIntervalCancellable(callback: () => void, ms: number): () => void {
  const intervalId = setInterval(callback, ms);
  return () => clearInterval(intervalId);
}

// Interval with max executions
function setIntervalWithLimit(
  callback: () => void,
  ms: number,
  maxExecutions: number
): () => void {
  let count = 0;
  const intervalId = setInterval(() => {
    callback();
    count++;
    if (count >= maxExecutions) {
      clearInterval(intervalId);
    }
  }, ms);

  return () => clearInterval(intervalId);
}
```

## Advanced Patterns

### Dynamic Interval

```typescript
class DynamicInterval {
  private intervalId: NodeJS.Timeout | null = null;
  private currentDelay: number;
  private lastExecutionTime: number = 0;

  constructor(
    private callback: () => void,
    private getNextDelay: () => number,
    initialDelay: number
  ) {
    this.currentDelay = initialDelay;
  }

  start(): void {
    if (this.intervalId) return;
    this.scheduleNext();
  }

  private scheduleNext(): void {
    this.intervalId = setTimeout(() => {
      const now = Date.now();
      this.callback();
      this.lastExecutionTime = now;

      this.currentDelay = this.getNextDelay();
      this.scheduleNext();
    }, this.currentDelay);
  }

  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  getTimeSinceLastExecution(): number {
    return this.lastExecutionTime ? Date.now() - this.lastExecutionTime : 0;
  }

  getCurrentDelay(): number {
    return this.currentDelay;
  }
}

// Usage example
const interval = new DynamicInterval(
  () => console.log('Tick'),
  () => Math.random() * 1000 + 500, // Random delay between 500-1500ms
  1000
);
```

### Precise Interval

```typescript
class PreciseInterval {
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private executionCount: number = 0;

  constructor(
    private callback: () => void,
    private delay: number
  ) {}

  start(): void {
    if (this.intervalId) return;

    this.startTime = Date.now();
    this.executionCount = 0;
    this.scheduleNext();
  }

  private scheduleNext(): void {
    const nextExecutionTime =
      this.startTime + (this.executionCount + 1) * this.delay;
    const now = Date.now();
    const adjustment = nextExecutionTime - now;

    this.intervalId = setTimeout(() => {
      this.callback();
      this.executionCount++;
      this.scheduleNext();
    }, adjustment);
  }

  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  getDrift(): number {
    if (!this.startTime) return 0;

    const expectedTime = this.startTime + this.executionCount * this.delay;
    return Date.now() - expectedTime;
  }
}
```

### Throttled Interval

```typescript
interface ThrottleOptions {
  minDelay: number;
  maxDelay: number;
  targetLoad: number;
}

class ThrottledInterval {
  private intervalId: NodeJS.Timeout | null = null;
  private currentDelay: number;
  private loadHistory: number[] = [];
  private readonly historySize = 10;

  constructor(
    private callback: () => Promise<void>,
    private options: ThrottleOptions
  ) {
    this.currentDelay = options.minDelay;
  }

  start(): void {
    if (this.intervalId) return;
    this.scheduleNext();
  }

  private async scheduleNext(): Promise<void> {
    this.intervalId = setTimeout(async () => {
      const startTime = Date.now();

      try {
        await this.callback();
      } catch (error) {
        console.error('Execution error:', error);
      }

      const executionTime = Date.now() - startTime;
      this.updateDelay(executionTime);

      this.scheduleNext();
    }, this.currentDelay);
  }

  private updateDelay(executionTime: number): void {
    // Calculate load as ratio of execution time to total time
    const load = executionTime / (executionTime + this.currentDelay);

    this.loadHistory.push(load);
    if (this.loadHistory.length > this.historySize) {
      this.loadHistory.shift();
    }

    // Calculate average load
    const avgLoad =
      this.loadHistory.reduce((a, b) => a + b) / this.loadHistory.length;

    // Adjust delay based on load
    if (avgLoad > this.options.targetLoad) {
      // Increase delay if load is too high
      this.currentDelay = Math.min(
        this.options.maxDelay,
        this.currentDelay * 1.2
      );
    } else if (avgLoad < this.options.targetLoad * 0.8) {
      // Decrease delay if load is too low
      this.currentDelay = Math.max(
        this.options.minDelay,
        this.currentDelay * 0.8
      );
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  getCurrentDelay(): number {
    return this.currentDelay;
  }

  getAverageLoad(): number {
    if (this.loadHistory.length === 0) return 0;
    return this.loadHistory.reduce((a, b) => a + b) / this.loadHistory.length;
  }
}
```

### Batch Interval

```typescript
interface BatchIntervalOptions<T> {
  delay: number;
  maxBatchSize: number;
  onBatch: (items: T[]) => Promise<void>;
}

class BatchInterval<T> {
  private intervalId: NodeJS.Timeout | null = null;
  private batch: T[] = [];
  private processing = false;

  constructor(private options: BatchIntervalOptions<T>) {}

  start(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(async () => {
      await this.processBatch();
    }, this.options.delay);
  }

  async add(item: T): Promise<void> {
    this.batch.push(item);

    if (this.batch.length >= this.options.maxBatchSize) {
      await this.processBatch();
    }
  }

  private async processBatch(): Promise<void> {
    if (this.processing || this.batch.length === 0) return;

    this.processing = true;
    const items = this.batch.splice(0, this.options.maxBatchSize);

    try {
      await this.options.onBatch(items);
    } catch (error) {
      console.error('Batch processing error:', error);
      // Re-add items to the batch
      this.batch.unshift(...items);
    } finally {
      this.processing = false;
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async flush(): Promise<void> {
    await this.processBatch();
  }

  getBatchSize(): number {
    return this.batch.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }
}
```
