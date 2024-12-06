---
title: Timer Management Patterns
description: Learn advanced timer management patterns in TypeScript. Master timer coordination, cleanup, and resource management strategies.
date: 2024-01-01
author: Underwood Inc
tags:
  - Timer Management
  - Resource Cleanup
  - TypeScript
  - Event Loop
  - Performance
  - Memory Management
category: examples
image: /web-patterns/images/timer-management-banner.png
---

# Timer Management Examples

Learn how to effectively manage timers in asynchronous JavaScript applications.

## Basic Usage

```typescript:preview
// Basic timer wrapper
class Timer {
  private timerId: NodeJS.Timeout | null = null;

  start(callback: () => void, delay: number): void {
    this.stop();
    this.timerId = setTimeout(callback, delay);
  }

  stop(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  isRunning(): boolean {
    return this.timerId !== null;
  }
}

// Promise-based delay
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Cancellable delay
const cancellableDelay = (ms: number) => {
  let timeoutId: NodeJS.Timeout;

  const promise = new Promise<void>((resolve) => {
    timeoutId = setTimeout(resolve, ms);
  });

  return {
    promise,
    cancel: () => clearTimeout(timeoutId),
  };
};
```

## Advanced Patterns

### Timer Manager

```typescript:preview
class TimerManager {
  private timers = new Map<string, NodeJS.Timeout>();

  setTimeout(id: string, callback: () => void, delay: number): void {
    this.clearTimeout(id);
    this.timers.set(
      id,
      setTimeout(() => {
        this.timers.delete(id);
        callback();
      }, delay)
    );
  }

  clearTimeout(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  clearAll(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }

  hasTimer(id: string): boolean {
    return this.timers.has(id);
  }

  get activeTimers(): number {
    return this.timers.size;
  }
}
```

### Interval Manager

```typescript:preview
class IntervalManager {
  private intervals = new Map<string, NodeJS.Timeout>();
  private counters = new Map<string, number>();

  setInterval(
    id: string,
    callback: () => void,
    interval: number,
    maxExecutions?: number
  ): void {
    this.clearInterval(id);
    this.counters.set(id, 0);

    this.intervals.set(
      id,
      setInterval(() => {
        const count = this.counters.get(id)! + 1;
        this.counters.set(id, count);

        if (maxExecutions && count >= maxExecutions) {
          this.clearInterval(id);
        }

        callback();
      }, interval)
    );
  }

  clearInterval(id: string): void {
    const interval = this.intervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(id);
      this.counters.delete(id);
    }
  }

  clearAll(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
    this.counters.clear();
  }

  getExecutionCount(id: string): number {
    return this.counters.get(id) || 0;
  }
}
```

### Debounced Timer

```typescript:preview
class DebouncedTimer {
  private timerId: NodeJS.Timeout | null = null;
  private lastArgs: any[] = [];

  constructor(
    private callback: (...args: any[]) => void,
    private delay: number
  ) {}

  schedule(...args: any[]): void {
    this.lastArgs = args;

    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.timerId = setTimeout(() => {
      this.callback(...this.lastArgs);
      this.timerId = null;
    }, this.delay);
  }

  cancel(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  flush(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.callback(...this.lastArgs);
      this.timerId = null;
    }
  }
}
```

### Progressive Timer

```typescript:preview
interface ProgressiveTimerOptions {
  initialDelay: number;
  maxDelay: number;
  factor: number;
  onTick: () => void;
  maxTicks?: number;
}

class ProgressiveTimer {
  private currentDelay: number;
  private timer: NodeJS.Timeout | null = null;
  private tickCount = 0;

  constructor(private options: ProgressiveTimerOptions) {
    this.currentDelay = options.initialDelay;
  }

  start(): void {
    this.stop();
    this.scheduleNextTick();
  }

  private scheduleNextTick(): void {
    if (this.options.maxTicks && this.tickCount >= this.options.maxTicks) {
      return;
    }

    this.timer = setTimeout(() => {
      this.tickCount++;
      this.options.onTick();

      this.currentDelay = Math.min(
        this.currentDelay * this.options.factor,
        this.options.maxDelay
      );

      this.scheduleNextTick();
    }, this.currentDelay);
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  reset(): void {
    this.stop();
    this.currentDelay = this.options.initialDelay;
    this.tickCount = 0;
  }
}
```
