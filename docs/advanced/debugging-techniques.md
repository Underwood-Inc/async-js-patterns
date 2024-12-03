# Debugging Techniques for Async Code

## Overview

Debugging asynchronous code presents unique challenges. This guide covers
effective techniques and tools for debugging async JavaScript.

## Console Methods

### 1. Enhanced Logging

```typescript
class AsyncLogger {
  private static instance: AsyncLogger;
  private logs: any[] = [];

  static getInstance() {
    if (!this.instance) {
      this.instance = new AsyncLogger();
    }
    return this.instance;
  }

  async log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      stack: new Error().stack,
    };

    this.logs.push(logEntry);
    console[level](JSON.stringify(logEntry, null, 2));
  }

  getLogs() {
    return this.logs;
  }
}
```

### 2. Promise State Tracking

```typescript
class PromiseTracker {
  private promises: Map<
    string,
    {
      status: 'pending' | 'fulfilled' | 'rejected';
      startTime: number;
      endTime?: number;
      result?: any;
      error?: any;
    }
  > = new Map();

  track<T>(id: string, promise: Promise<T>): Promise<T> {
    const entry = {
      status: 'pending' as const,
      startTime: Date.now(),
    };

    this.promises.set(id, entry);

    return promise
      .then((result) => {
        this.promises.set(id, {
          ...entry,
          status: 'fulfilled',
          endTime: Date.now(),
          result,
        });
        return result;
      })
      .catch((error) => {
        this.promises.set(id, {
          ...entry,
          status: 'rejected',
          endTime: Date.now(),
          error,
        });
        throw error;
      });
  }

  getStatus(id: string) {
    return this.promises.get(id);
  }
}
```

## Breakpoint Strategies

### 1. Async Breakpoints

```typescript
class AsyncDebugger {
  private breakpoints: Set<string> = new Set();

  async setBreakpoint(id: string, condition?: () => boolean) {
    this.breakpoints.add(id);

    return async <T>(value: T): Promise<T> => {
      if (this.breakpoints.has(id) && (!condition || condition())) {
        console.log(`Breakpoint hit: ${id}`, { value });
        // Simulate debugger pause
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      return value;
    };
  }

  removeBreakpoint(id: string) {
    this.breakpoints.delete(id);
  }
}
```

### 2. Stack Trace Enhancement

```typescript
class StackTraceEnhancer {
  static enhance(error: Error) {
    if (error.stack) {
      return {
        ...error,
        enhancedStack: error.stack
          .split('\n')
          .map((line) => {
            if (line.includes('async')) {
              return `${line} [ASYNC]`;
            }
            return line;
          })
          .join('\n'),
      };
    }
    return error;
  }
}
```

## Performance Debugging

### 1. Timing Profiler

```typescript
class AsyncProfiler {
  private operations: Map<
    string,
    {
      count: number;
      totalTime: number;
      maxTime: number;
    }
  > = new Map();

  async profile<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      return await operation();
    } finally {
      const duration = performance.now() - start;
      this.recordTiming(name, duration);
    }
  }

  private recordTiming(name: string, duration: number) {
    const existing = this.operations.get(name) || {
      count: 0,
      totalTime: 0,
      maxTime: 0,
    };

    this.operations.set(name, {
      count: existing.count + 1,
      totalTime: existing.totalTime + duration,
      maxTime: Math.max(existing.maxTime, duration),
    });
  }

  getStats() {
    const stats: Record<
      string,
      {
        avgTime: number;
        maxTime: number;
        count: number;
      }
    > = {};

    this.operations.forEach((data, name) => {
      stats[name] = {
        avgTime: data.totalTime / data.count,
        maxTime: data.maxTime,
        count: data.count,
      };
    });

    return stats;
  }
}
```

### 2. Memory Usage Tracker

```typescript
class MemoryTracker {
  private snapshots: Array<{
    timestamp: number;
    usage: NodeJS.MemoryUsage;
  }> = [];

  takeSnapshot() {
    this.snapshots.push({
      timestamp: Date.now(),
      usage: process.memoryUsage(),
    });
  }

  getLeaks() {
    return this.snapshots
      .map((snapshot, index) => {
        if (index === 0) return null;

        const prev = this.snapshots[index - 1];
        const diff = {
          heapUsed: snapshot.usage.heapUsed - prev.usage.heapUsed,
          heapTotal: snapshot.usage.heapTotal - prev.usage.heapTotal,
          external: snapshot.usage.external - prev.usage.external,
          timeDiff: snapshot.timestamp - prev.timestamp,
        };

        return {
          timestamp: snapshot.timestamp,
          diff,
        };
      })
      .filter(Boolean);
  }
}
```
