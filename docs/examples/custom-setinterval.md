---
title: Custom setInterval Examples
description: Implement custom interval timers in JavaScript. Learn about advanced timing patterns and interval management techniques.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Timers
  - Intervals
  - Custom Implementation
  - Examples
  - Best Practices
image: /web-patterns/images/custom-setinterval-banner.png
---

# Custom setInterval Examples

This page demonstrates practical examples of implementing and using custom setInterval functionality with enhanced features and better control.

## Basic Implementation

```typescript:preview
// Basic custom setInterval with cleanup
class IntervalTimer {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  setInterval(
    callback: () => void,
    interval: number,
    id: string = crypto.randomUUID()
  ): () => void {
    const intervalId = setInterval(callback, interval);
    this.intervals.set(id, intervalId);

    return () => {
      clearInterval(intervalId);
      this.intervals.delete(id);
    };
  }

  clearAll(): void {
    for (const [id, interval] of this.intervals) {
      clearInterval(interval);
      this.intervals.delete(id);
    }
  }
}

// Usage
const timer = new IntervalTimer();
const cleanup = timer.setInterval(() => {
  console.log('Interval executed');
}, 1000);

// Cancel when done
cleanup();
```

## Pausable Interval

```typescript:preview
class PausableInterval {
  private intervalId: NodeJS.Timeout | null = null;
  private lastExecutionTime: number = 0;
  private remainingTime: number = 0;
  private paused: boolean = false;

  constructor(
    private callback: () => void,
    private interval: number
  ) {}

  start(): void {
    if (this.intervalId) return;

    this.lastExecutionTime = Date.now();
    this.intervalId = setInterval(() => {
      this.callback();
      this.lastExecutionTime = Date.now();
    }, this.interval);
  }

  pause(): void {
    if (!this.intervalId || this.paused) return;

    clearInterval(this.intervalId);
    this.intervalId = null;
    this.remainingTime = this.interval - (Date.now() - this.lastExecutionTime);
    this.paused = true;
  }

  resume(): void {
    if (!this.paused) return;

    setTimeout(() => {
      this.callback();
      this.start();
    }, this.remainingTime);

    this.paused = false;
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.paused = false;
    this.remainingTime = 0;
  }

  isRunning(): boolean {
    return !!this.intervalId && !this.paused;
  }
}

// Usage
const interval = new PausableInterval(() => {
  console.log('Tick');
}, 1000);

interval.start(); // Start ticking
interval.pause(); // Pause
interval.resume(); // Resume from where it left off
interval.stop(); // Stop completely
```

## Dynamic Interval

```typescript:preview
class DynamicInterval {
  private intervalId: NodeJS.Timeout | null = null;
  private currentInterval: number;
  private lastExecutionTime: number = 0;

  constructor(
    private callback: () => void,
    initialInterval: number
  ) {
    this.currentInterval = initialInterval;
  }

  start(): void {
    if (this.intervalId) return;

    const scheduleNext = () => {
      this.lastExecutionTime = Date.now();
      this.intervalId = setTimeout(() => {
        this.callback();
        scheduleNext();
      }, this.currentInterval);
    };

    scheduleNext();
  }

  setInterval(newInterval: number): void {
    this.currentInterval = newInterval;

    if (this.intervalId) {
      this.restart();
    }
  }

  private restart(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    this.start();
  }

  stop(): void {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Usage
const dynamicInterval = new DynamicInterval(() => {
  console.log('Tick');
}, 1000);

dynamicInterval.start();

// Change interval dynamically
setTimeout(() => {
  dynamicInterval.setInterval(500); // Speed up
}, 5000);
```

## Real-World Example: Polling Service

```typescript:preview
class PollingService {
  private interval: DynamicInterval;
  private retryCount: number = 0;
  private readonly maxRetries: number;
  private readonly baseInterval: number;
  private readonly maxInterval: number;

  constructor(
    private readonly endpoint: string,
    options: {
      baseInterval?: number;
      maxInterval?: number;
      maxRetries?: number;
      onSuccess?: (data: any) => void;
      onError?: (error: Error) => void;
      onMaxRetriesReached?: () => void;
    } = {}
  ) {
    this.baseInterval = options.baseInterval ?? 1000;
    this.maxInterval = options.maxInterval ?? 30000;
    this.maxRetries = options.maxRetries ?? 5;

    this.interval = new DynamicInterval(async () => {
      try {
        const data = await this.poll();
        this.handleSuccess(data);
        options.onSuccess?.(data);
      } catch (error) {
        this.handleError(error as Error);
        options.onError?.(error as Error);
      }
    }, this.baseInterval);
  }

  private async poll(): Promise<any> {
    const response = await fetch(this.endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  private handleSuccess(data: any): void {
    this.retryCount = 0;
    this.interval.setInterval(this.baseInterval);
  }

  private handleError(error: Error): void {
    this.retryCount++;

    if (this.retryCount >= this.maxRetries) {
      this.stop();
      this.options.onMaxRetriesReached?.();
      return;
    }

    // Exponential backoff
    const newInterval = Math.min(
      this.baseInterval * Math.pow(2, this.retryCount),
      this.maxInterval
    );

    this.interval.setInterval(newInterval);
  }

  start(): void {
    this.interval.start();
  }

  stop(): void {
    this.interval.stop();
  }
}

// Usage
const pollingService = new PollingService('https://api.example.com/status', {
  baseInterval: 1000,
  maxInterval: 30000,
  maxRetries: 5,
  onSuccess: (data) => {
    console.log('Poll successful:', data);
  },
  onError: (error) => {
    console.error('Poll failed:', error);
  },
  onMaxRetriesReached: () => {
    console.error('Max retries reached, stopping polling');
  },
});

pollingService.start();
```

## Best Practices

1. Memory leak prevention:

   ```typescript:preview
   class SafeInterval {
     private intervals = new WeakMap<object, NodeJS.Timeout>();

     setInterval(target: object, callback: () => void, interval: number): void {
       this.clearInterval(target);
       const id = setInterval(callback, interval);
       this.intervals.set(target, id);
     }

     clearInterval(target: object): void {
       const id = this.intervals.get(target);
       if (id) {
         clearInterval(id);
         this.intervals.delete(target);
       }
     }
   }
   ```

2. Error handling:

   ```typescript:preview
   class ResilientInterval {
     setInterval(
       callback: () => void,
       interval: number,
       errorHandler?: (error: Error) => void
     ): () => void {
       const id = setInterval(async () => {
         try {
           await callback();
         } catch (error) {
           errorHandler?.(error as Error);
         }
       }, interval);

       return () => clearInterval(id);
     }
   }
   ```

3. Performance monitoring:

   ```typescript:preview
   class MonitoredInterval {
     private metrics = {
       executionCount: 0,
       totalDuration: 0,
       errors: 0,
     };

     setInterval(callback: () => void, interval: number): () => void {
       const wrappedCallback = async () => {
         const start = performance.now();
         try {
           await callback();
           this.metrics.executionCount++;
         } catch (error) {
           this.metrics.errors++;
           throw error;
         } finally {
           this.metrics.totalDuration += performance.now() - start;
         }
       };

       const id = setInterval(wrappedCallback, interval);
       return () => clearInterval(id);
     }

     getMetrics() {
       return {
         ...this.metrics,
         averageDuration:
           this.metrics.totalDuration / this.metrics.executionCount,
       };
     }
   }
   ```

4. Resource management:

   ```typescript:preview
   class ResourceAwareInterval {
     private resources = new Set<Resource>();

     async setInterval(
       callback: () => Promise<void>,
       interval: number,
       requiredResources: Resource[]
     ): Promise<() => void> {
       // Acquire resources
       for (const resource of requiredResources) {
         await resource.acquire();
         this.resources.add(resource);
       }

       const id = setInterval(async () => {
         try {
           await callback();
         } catch (error) {
           console.error('Interval execution failed:', error);
         }
       }, interval);

       return () => {
         clearInterval(id);
         // Release resources
         for (const resource of this.resources) {
           resource.release().catch((error) => {
             console.error('Failed to release resource:', error);
           });
         }
         this.resources.clear();
       };
     }
   }
   ```
