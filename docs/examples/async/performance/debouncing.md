---
title: Debouncing Pattern Implementation
description: Master debouncing patterns for handling high-frequency events. Learn about event throttling, timing control, and performance optimization.
date: 2024-01-01
author: Underwood Inc
tags:
  - Debouncing
  - Event Handling
  - Performance
  - TypeScript
  - User Input
  - Optimization
category: examples
image: /web-patterns/images/debouncing-banner.png
---

# Debouncing Examples

Learn how to implement debouncing patterns for rate limiting and performance optimization.

## Basic Usage

```typescript:preview
// Simple debounce function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Debounce with immediate option
function debounceWithImmediate<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    const callNow = immediate && !timeoutId;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null!;
      if (!immediate) func(...args);
    }, wait);

    if (callNow) func(...args);
  };
}
```

## Advanced Patterns

### Promise-based Debounce

```typescript:preview
interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel: () => void;
  flush: () => Promise<ReturnType<T> | undefined>;
}

function debouncePromise<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout;
  let latestResolve: ((value: ReturnType<T>) => void) | null = null;
  let latestReject: ((reason: any) => void) | null = null;
  let latestArgs: Parameters<T> | null = null;

  const debouncedFunction = (
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> => {
    latestArgs = args;

    return new Promise((resolve, reject) => {
      latestResolve = resolve;
      latestReject = reject;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          latestResolve!(result);
        } catch (error) {
          latestReject!(error);
        }
      }, wait);
    });
  };

  debouncedFunction.cancel = () => {
    clearTimeout(timeoutId);
    if (latestReject) {
      latestReject(new Error('Debounced function cancelled'));
    }
  };

  debouncedFunction.flush = async () => {
    if (!latestArgs) return undefined;

    clearTimeout(timeoutId);
    return func(...latestArgs);
  };

  return debouncedFunction;
}
```

### Debounce with Queue

```typescript:preview
interface QueuedDebounceOptions {
  wait: number;
  maxQueueSize?: number;
  onQueueFull?: () => void;
}

class QueuedDebounce<T> {
  private queue: T[] = [];
  private timeoutId: NodeJS.Timeout | null = null;
  private processing = false;

  constructor(
    private processor: (items: T[]) => Promise<void>,
    private options: QueuedDebounceOptions
  ) {}

  add(item: T): void {
    if (
      this.options.maxQueueSize &&
      this.queue.length >= this.options.maxQueueSize
    ) {
      if (this.options.onQueueFull) {
        this.options.onQueueFull();
      }
      return;
    }

    this.queue.push(item);
    this.scheduleProcessing();
  }

  private scheduleProcessing(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => this.processQueue(), this.options.wait);
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const items = [...this.queue];
    this.queue = [];

    try {
      await this.processor(items);
    } catch (error) {
      console.error('Queue processing error:', error);
      // Re-queue failed items
      this.queue.unshift(...items);
    } finally {
      this.processing = false;

      if (this.queue.length > 0) {
        this.scheduleProcessing();
      }
    }
  }

  flush(): Promise<void> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    return this.processQueue();
  }

  clear(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.queue = [];
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }
}
```

### Adaptive Debounce

```typescript:preview
interface AdaptiveDebounceOptions {
  initialWait: number;
  minWait: number;
  maxWait: number;
  adaptationFactor: number;
  sampleSize: number;
}

class AdaptiveDebounce<T extends (...args: any[]) => any> {
  private timeoutId: NodeJS.Timeout | null = null;
  private currentWait: number;
  private executionTimes: number[] = [];
  private lastExecutionStart: number = 0;

  constructor(
    private func: T,
    private options: AdaptiveDebounceOptions
  ) {
    this.currentWait = options.initialWait;
  }

  execute(...args: Parameters<T>): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(async () => {
      this.lastExecutionStart = Date.now();

      try {
        await this.func(...args);
        this.recordExecutionTime();
      } catch (error) {
        console.error('Execution error:', error);
        this.increaseWait();
      }
    }, this.currentWait);
  }

  private recordExecutionTime(): void {
    const executionTime = Date.now() - this.lastExecutionStart;
    this.executionTimes.push(executionTime);

    if (this.executionTimes.length > this.options.sampleSize) {
      this.executionTimes.shift();
    }

    this.adjustWait();
  }

  private adjustWait(): void {
    if (this.executionTimes.length < this.options.sampleSize) {
      return;
    }

    const avgExecutionTime =
      this.executionTimes.reduce((a, b) => a + b) / this.executionTimes.length;

    if (avgExecutionTime > this.currentWait * 0.8) {
      this.increaseWait();
    } else if (avgExecutionTime < this.currentWait * 0.2) {
      this.decreaseWait();
    }
  }

  private increaseWait(): void {
    this.currentWait = Math.min(
      this.options.maxWait,
      this.currentWait * this.options.adaptationFactor
    );
  }

  private decreaseWait(): void {
    this.currentWait = Math.max(
      this.options.minWait,
      this.currentWait / this.options.adaptationFactor
    );
  }

  cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  getCurrentWait(): number {
    return this.currentWait;
  }

  getAverageExecutionTime(): number {
    if (this.executionTimes.length === 0) return 0;
    return (
      this.executionTimes.reduce((a, b) => a + b) / this.executionTimes.length
    );
  }
}
```
