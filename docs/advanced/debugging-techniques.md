---
title: Debugging Techniques
description: Advanced techniques and strategies for debugging asynchronous code in JavaScript and TypeScript applications.
head:
  - - meta
    - name: keywords
      content: debugging, async debugging, troubleshooting, JavaScript, TypeScript, development tools, error tracking, debugging techniques, console debugging, breakpoints
  - - meta
    - name: author
      content: Modern Web Development Patterns
  - - meta
    - property: og:title
      content: Debugging Techniques | Advanced Async Patterns
  - - meta
    - property: og:description
      content: Master advanced debugging techniques for asynchronous operations to efficiently troubleshoot and maintain modern web applications.
---

# Debugging Techniques

## Overview

Debugging asynchronous JavaScript requires specialized techniques to track execution flow, handle timing issues, and understand state changes across async boundaries. These techniques help developers identify and fix issues in async code effectively.

### Real-World Analogy

Think of async debugging like:

1. **Detective Work**

   - The detective (debugger) follows clues through time
   - Crime scene photos (stack traces) capture moments
   - The timeline (async execution) shows event sequence
   - The witnesses (logs) provide additional context
   - The evidence (state snapshots) reveals changes

2. **Medical Diagnosis**

   - Symptoms (errors) indicate problems
   - Medical tests (debugging tools) gather data
   - Patient history (logs) provides context
   - Vital signs (state) show current condition
   - Treatment monitoring (debugging) tracks progress

3. **Automotive Repair**

   - Diagnostic tools (debugger) identify issues
   - Service history (logs) shows patterns
   - Test drives (runtime analysis) verify fixes
   - Sensor readings (metrics) provide data
   - Repair manual (documentation) guides process

4. **Archaeological Dig**

   - Layer examination (stack analysis)
   - Artifact dating (timing analysis)
   - Site mapping (execution flow)
   - Field notes (logging)
   - Preservation (state capture)

5. **Weather Investigation**
   - Data collection (logging)
   - Pattern analysis (debugging)
   - Sensor networks (monitoring)
   - Historical records (state history)
   - Prediction models (behavior analysis)

### Common Use Cases

1. **Promise Chain Debugging**

   - Problem: Lost context in promise chains
   - Solution: Proper error handling and logging
   - Benefit: Clear error origin and flow

2. **Race Condition Detection**

   - Problem: Timing-dependent bugs
   - Solution: Execution timeline analysis
   - Benefit: Reliable reproduction of timing issues

3. **State Management Issues**
   - Problem: Unexpected state changes in async operations
   - Solution: State tracking and logging
   - Benefit: Clear understanding of state flow

### How It Works

1. **Error Tracking**

   - Stack trace analysis
   - Error propagation
   - Context preservation

2. **State Monitoring**

   - Variable watching
   - Scope analysis
   - Closure inspection

3. **Flow Control**

   - Breakpoint management
   - Step debugging
   - Execution pausing

4. **Tool Integration**
   - DevTools utilization
   - Logger configuration
   - Source mapping

## Implementation

### Console Methods

### 1. Enhanced Logging

```typescript:preview
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

```typescript:preview
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

```typescript:preview
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

```typescript:preview
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

```typescript:preview
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

```typescript:preview
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
