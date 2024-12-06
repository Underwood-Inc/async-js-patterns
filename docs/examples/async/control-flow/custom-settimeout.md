---
title: Custom setTimeout Implementation
description: Build your own setTimeout implementation in TypeScript. Learn about timer internals, event loop interaction, and advanced timing patterns.
date: 2024-01-01
author: Underwood Inc
tags:
  - setTimeout
  - Timer Implementation
  - TypeScript
  - Event Loop
  - Performance
  - System Design
category: examples
image: /web-patterns/images/custom-settimeout-banner.png
---

# Custom setTimeout Examples

Learn how to create and use custom setTimeout implementations with advanced features.

## Basic Usage

```typescript:preview
// Promise-based setTimeout
function setTimeoutAsync(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Cancellable setTimeout
function setTimeoutCancellable(callback: () => void, ms: number): () => void {
  const timeoutId = setTimeout(callback, ms);
  return () => clearTimeout(timeoutId);
}

// Async setTimeout with cleanup
async function withTimeout<T>(
  operation: () => Promise<T>,
  ms: number
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, ms);
  });

  try {
    return await Promise.race([operation(), timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}
```

## Advanced Patterns

### Recursive setTimeout

```typescript:preview
class RecursiveTimeout {
  private timeoutId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private remainingTime: number = 0;
  private isPaused: boolean = false;

  constructor(
    private callback: () => void,
    private delay: number,
    private maxExecutions: number = Infinity
  ) {}

  start(): void {
    if (this.timeoutId) return;

    this.startTime = Date.now();
    this.remainingTime = this.delay;
    this.scheduleNext();
  }

  private scheduleNext(): void {
    if (this.maxExecutions <= 0) return;

    this.timeoutId = setTimeout(() => {
      this.callback();
      this.maxExecutions--;
      this.remainingTime = this.delay;
      this.startTime = Date.now();
      this.scheduleNext();
    }, this.remainingTime);
  }

  pause(): void {
    if (!this.timeoutId || this.isPaused) return;

    clearTimeout(this.timeoutId);
    this.remainingTime -= Date.now() - this.startTime;
    this.isPaused = true;
  }

  resume(): void {
    if (!this.isPaused) return;

    this.startTime = Date.now();
    this.isPaused = false;
    this.scheduleNext();
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.remainingTime = this.delay;
    this.isPaused = false;
  }
}
```

### Priority Queue Timeout

```typescript:preview
interface TimeoutTask {
  id: string;
  callback: () => void;
  delay: number;
  priority: number;
  createdAt: number;
}

class PriorityTimeout {
  private tasks = new Map<string, TimeoutTask>();
  private timeouts = new Map<string, NodeJS.Timeout>();

  schedule(
    id: string,
    callback: () => void,
    delay: number,
    priority: number = 0
  ): void {
    this.cancel(id);

    const task: TimeoutTask = {
      id,
      callback,
      delay,
      priority,
      createdAt: Date.now(),
    };

    this.tasks.set(id, task);
    this.scheduleTask(task);
  }

  private scheduleTask(task: TimeoutTask): void {
    const timeoutId = setTimeout(() => {
      this.tasks.delete(task.id);
      this.timeouts.delete(task.id);
      task.callback();
    }, task.delay);

    this.timeouts.set(task.id, timeoutId);
  }

  cancel(id: string): void {
    const timeoutId = this.timeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(id);
      this.tasks.delete(id);
    }
  }

  rescheduleAll(): void {
    const tasks = Array.from(this.tasks.values());

    // Clear all existing timeouts
    this.timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timeouts.clear();

    // Sort by priority (higher first) and creation time
    tasks.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.createdAt - b.createdAt;
    });

    // Reschedule with staggered delays
    tasks.forEach((task, index) => {
      const adjustedDelay = Math.max(
        0,
        task.delay - (Date.now() - task.createdAt)
      );
      const staggerDelay = index * 100; // Add 100ms between each task

      const timeoutId = setTimeout(() => {
        this.tasks.delete(task.id);
        this.timeouts.delete(task.id);
        task.callback();
      }, adjustedDelay + staggerDelay);

      this.timeouts.set(task.id, timeoutId);
    });
  }
}
```

### Adaptive Timeout

```typescript:preview
interface AdaptiveTimeoutOptions {
  initialDelay: number;
  minDelay: number;
  maxDelay: number;
  factor: number;
  successThreshold: number;
  failureThreshold: number;
}

class AdaptiveTimeout {
  private currentDelay: number;
  private successCount: number = 0;
  private failureCount: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(
    private callback: () => Promise<boolean>,
    private options: AdaptiveTimeoutOptions
  ) {
    this.currentDelay = options.initialDelay;
  }

  start(): void {
    this.schedule();
  }

  private schedule(): void {
    this.timeoutId = setTimeout(async () => {
      try {
        const success = await this.callback();

        if (success) {
          this.successCount++;
          this.failureCount = 0;

          if (this.successCount >= this.options.successThreshold) {
            this.decreaseDelay();
          }
        } else {
          this.failureCount++;
          this.successCount = 0;

          if (this.failureCount >= this.options.failureThreshold) {
            this.increaseDelay();
          }
        }
      } catch (error) {
        this.failureCount++;
        this.successCount = 0;

        if (this.failureCount >= this.options.failureThreshold) {
          this.increaseDelay();
        }
      }

      this.schedule();
    }, this.currentDelay);
  }

  private decreaseDelay(): void {
    this.currentDelay = Math.max(
      this.options.minDelay,
      this.currentDelay / this.options.factor
    );
    this.successCount = 0;
  }

  private increaseDelay(): void {
    this.currentDelay = Math.min(
      this.options.maxDelay,
      this.currentDelay * this.options.factor
    );
    this.failureCount = 0;
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  reset(): void {
    this.stop();
    this.currentDelay = this.options.initialDelay;
    this.successCount = 0;
    this.failureCount = 0;
  }
}
```
