---
title: Timer Management Examples
description: Learn timer management patterns in JavaScript. Master timeout handling, interval control, and timer optimization.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Timers
  - Async
  - Performance
  - Examples
  - Best Practices
image: /web-patterns/images/timer-management-banner.png
---

# Timer Management Examples

This page demonstrates practical examples of managing multiple timers, including cleanup, synchronization, and resource management.

## Timer Registry

```typescript:preview
class TimerRegistry {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private cleanupHandlers: Map<string, () => void> = new Map();

  setTimeout(
    callback: () => void,
    delay: number,
    id: string = crypto.randomUUID()
  ): string {
    const timeoutId = setTimeout(() => {
      callback();
      this.timeouts.delete(id);
      this.cleanupHandlers.delete(id);
    }, delay);

    this.timeouts.set(id, timeoutId);
    return id;
  }

  setInterval(
    callback: () => void,
    interval: number,
    id: string = crypto.randomUUID()
  ): string {
    const intervalId = setInterval(callback, interval);
    this.intervals.set(id, intervalId);
    return id;
  }

  clear(id: string): void {
    if (this.timeouts.has(id)) {
      clearTimeout(this.timeouts.get(id)!);
      this.timeouts.delete(id);
    }
    if (this.intervals.has(id)) {
      clearInterval(this.intervals.get(id)!);
      this.intervals.delete(id);
    }
    if (this.cleanupHandlers.has(id)) {
      this.cleanupHandlers.get(id)!();
      this.cleanupHandlers.delete(id);
    }
  }

  clearAll(): void {
    for (const id of this.timeouts.keys()) {
      this.clear(id);
    }
    for (const id of this.intervals.keys()) {
      this.clear(id);
    }
  }

  registerCleanup(id: string, cleanup: () => void): void {
    this.cleanupHandlers.set(id, cleanup);
  }

  isActive(id: string): boolean {
    return this.timeouts.has(id) || this.intervals.has(id);
  }

  getActiveTimers(): string[] {
    return [
      ...Array.from(this.timeouts.keys()),
      ...Array.from(this.intervals.keys()),
    ];
  }
}

// Usage
const registry = new TimerRegistry();

// Register a timeout
const timeoutId = registry.setTimeout(() => {
  console.log('Timeout executed');
}, 1000);

// Register an interval
const intervalId = registry.setInterval(() => {
  console.log('Interval executed');
}, 1000);

// Register cleanup
registry.registerCleanup(intervalId, () => {
  console.log('Cleaning up interval resources');
});

// Clear specific timer
registry.clear(timeoutId);

// Clear all timers
registry.clearAll();
```

## Timer Group Management

```typescript:preview
class TimerGroup {
  private registry = new TimerRegistry();
  private groupTimers: Map<string, Set<string>> = new Map();

  createGroup(groupId: string): void {
    if (!this.groupTimers.has(groupId)) {
      this.groupTimers.set(groupId, new Set());
    }
  }

  setTimeout(groupId: string, callback: () => void, delay: number): string {
    this.ensureGroupExists(groupId);

    const timerId = this.registry.setTimeout(callback, delay);
    this.groupTimers.get(groupId)!.add(timerId);

    return timerId;
  }

  setInterval(groupId: string, callback: () => void, interval: number): string {
    this.ensureGroupExists(groupId);

    const timerId = this.registry.setInterval(callback, interval);
    this.groupTimers.get(groupId)!.add(timerId);

    return timerId;
  }

  clearGroup(groupId: string): void {
    const timers = this.groupTimers.get(groupId);
    if (timers) {
      for (const timerId of timers) {
        this.registry.clear(timerId);
      }
      timers.clear();
    }
  }

  clearTimer(groupId: string, timerId: string): void {
    const timers = this.groupTimers.get(groupId);
    if (timers?.has(timerId)) {
      this.registry.clear(timerId);
      timers.delete(timerId);
    }
  }

  private ensureGroupExists(groupId: string): void {
    if (!this.groupTimers.has(groupId)) {
      this.createGroup(groupId);
    }
  }
}

// Usage
const timerGroup = new TimerGroup();

// Create groups for different features
timerGroup.createGroup('polling');
timerGroup.createGroup('animation');

// Add timers to groups
timerGroup.setInterval(
  'polling',
  () => {
    console.log('Polling data...');
  },
  5000
);

timerGroup.setTimeout(
  'animation',
  () => {
    console.log('Animation complete');
  },
  2000
);

// Clear specific group
timerGroup.clearGroup('polling');
```

## Real-World Example: Task Scheduler

```typescript:preview
class TaskScheduler {
  private registry = new TimerRegistry();
  private tasks = new Map<string, ScheduledTask>();

  scheduleTask(task: ScheduledTask, options: ScheduleOptions = {}): string {
    const taskId = crypto.randomUUID();
    this.tasks.set(taskId, task);

    if (options.recurring) {
      this.scheduleRecurringTask(taskId, task, options);
    } else {
      this.scheduleOneTimeTask(taskId, task, options);
    }

    return taskId;
  }

  private scheduleOneTimeTask(
    taskId: string,
    task: ScheduledTask,
    options: ScheduleOptions
  ): void {
    const timerId = this.registry.setTimeout(async () => {
      try {
        await this.executeTask(task);
      } finally {
        this.cleanup(taskId);
      }
    }, this.calculateDelay(options));

    this.registry.registerCleanup(timerId, () => {
      this.tasks.delete(taskId);
    });
  }

  private scheduleRecurringTask(
    taskId: string,
    task: ScheduledTask,
    options: ScheduleOptions
  ): void {
    const timerId = this.registry.setInterval(async () => {
      try {
        await this.executeTask(task);
      } catch (error) {
        console.error(`Task ${taskId} failed:`, error);
        if (options.stopOnError) {
          this.cancelTask(taskId);
        }
      }
    }, options.interval!);

    this.registry.registerCleanup(timerId, () => {
      this.tasks.delete(taskId);
    });
  }

  private async executeTask(task: ScheduledTask): Promise<void> {
    const startTime = performance.now();

    try {
      await task.execute();
      this.recordMetrics(task.name, {
        duration: performance.now() - startTime,
        status: 'success',
      });
    } catch (error) {
      this.recordMetrics(task.name, {
        duration: performance.now() - startTime,
        status: 'error',
        error,
      });
      throw error;
    }
  }

  cancelTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      this.registry.clear(taskId);
      this.tasks.delete(taskId);
    }
  }

  private calculateDelay(options: ScheduleOptions): number {
    if (options.timestamp) {
      return options.timestamp.getTime() - Date.now();
    }
    return options.delay ?? 0;
  }

  private cleanup(taskId: string): void {
    this.registry.clear(taskId);
    this.tasks.delete(taskId);
  }

  private recordMetrics(taskName: string, metrics: TaskMetrics): void {
    // Record task execution metrics
    console.log(`Task ${taskName} metrics:`, metrics);
  }
}

// Usage
const scheduler = new TaskScheduler();

// Schedule one-time task
const taskId = scheduler.scheduleTask(
  {
    name: 'data-cleanup',
    execute: async () => {
      await cleanupOldData();
    },
  },
  {
    delay: 60000, // 1 minute
    stopOnError: true,
  }
);

// Schedule recurring task
const recurringTaskId = scheduler.scheduleTask(
  {
    name: 'health-check',
    execute: async () => {
      await checkSystemHealth();
    },
  },
  {
    recurring: true,
    interval: 300000, // 5 minutes
    stopOnError: false,
  }
);

// Cancel task if needed
scheduler.cancelTask(taskId);
```

## Best Practices

1. Resource cleanup:

   ```typescript:preview
   class ResourceTimer {
     private resources = new WeakMap<object, Resource>();
     private registry = new TimerRegistry();

     async withResource<T>(
       resource: Resource,
       operation: () => Promise<T>,
       timeout: number
     ): Promise<T> {
       this.resources.set(operation, resource);

       try {
         return await Promise.race([
           operation(),
           new Promise((_, reject) => {
             this.registry.setTimeout(() => {
               reject(new Error('Operation timeout'));
             }, timeout);
           }),
         ]);
       } finally {
         await resource.release();
         this.resources.delete(operation);
       }
     }
   }
   ```

2. Error boundaries:

   ```typescript:preview
   class SafeTimer {
     private registry = new TimerRegistry();

     setTimer(
       operation: () => Promise<void>,
       options: {
         timeout: number;
         retry?: boolean;
         maxRetries?: number;
         onError?: (error: Error) => void;
       }
     ): string {
       let attempts = 0;

       const execute = async () => {
         try {
           await operation();
         } catch (error) {
           options.onError?.(error as Error);

           if (options.retry && attempts < (options.maxRetries ?? 3)) {
             attempts++;
             return this.setTimer(operation, options);
           }

           throw error;
         }
       };

       return this.registry.setTimeout(execute, options.timeout);
     }
   }
   ```

3. Performance tracking:

   ```typescript:preview
   class MetricsTimer {
     private metrics = {
       totalExecutions: 0,
       totalDuration: 0,
       errors: 0,
       lastExecutionTime: 0,
     };

     async executeWithMetrics<T>(
       operation: () => Promise<T>,
       timeout: number
     ): Promise<T> {
       const start = performance.now();

       try {
         const result = await Promise.race([
           operation(),
           new Promise<never>((_, reject) =>
             setTimeout(() => reject(new Error('Timeout')), timeout)
           ),
         ]);

         this.recordSuccess(performance.now() - start);
         return result;
       } catch (error) {
         this.recordError(performance.now() - start);
         throw error;
       }
     }

     private recordSuccess(duration: number): void {
       this.metrics.totalExecutions++;
       this.metrics.totalDuration += duration;
       this.metrics.lastExecutionTime = Date.now();
     }

     private recordError(duration: number): void {
       this.metrics.errors++;
       this.metrics.totalDuration += duration;
       this.metrics.lastExecutionTime = Date.now();
     }

     getMetrics() {
       return {
         ...this.metrics,
         averageDuration:
           this.metrics.totalDuration / this.metrics.totalExecutions,
         errorRate: this.metrics.errors / this.metrics.totalExecutions,
       };
     }
   }
   ```

4. Memory management:

   ```typescript:preview
   class MemoryAwareTimer {
     private registry = new TimerRegistry();
     private memoryThreshold = 0.9; // 90% of available memory

     async scheduleWithMemoryCheck<T>(
       operation: () => Promise<T>,
       interval: number
     ): Promise<string> {
       const checkMemory = () => {
         const usage = process.memoryUsage();
         const ratio = usage.heapUsed / usage.heapTotal;

         if (ratio > this.memoryThreshold) {
           console.warn('Memory threshold exceeded');
           this.registry.clearAll();
           return false;
         }
         return true;
       };

       const wrappedOperation = async () => {
         if (checkMemory()) {
           await operation();
         }
       };

       return this.registry.setInterval(wrappedOperation, interval);
     }
   }
   ```
