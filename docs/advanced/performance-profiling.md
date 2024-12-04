# Performance Profiling

## Overview

Performance profiling in async JavaScript involves analyzing and measuring code execution to identify bottlenecks, optimize resource usage, and improve overall application performance. This systematic approach helps developers make data-driven optimization decisions.

### Real-World Analogy

Think of performance profiling like analyzing an athlete's training:

- The stopwatch (timing) measures execution duration
- The heart rate monitor (CPU usage) tracks system load
- The video analysis (call stack) shows technique details
- The training log (metrics) records all activities
- The coach (profiler) identifies improvement areas

### Common Use Cases

1. **Bottleneck Identification**

   - Problem: Unknown performance bottlenecks
   - Solution: Systematic profiling and analysis
   - Benefit: Data-driven optimization targets

2. **Memory Leak Detection**

   - Problem: Gradual memory growth
   - Solution: Heap snapshots and allocation tracking
   - Benefit: Early detection of memory issues

3. **Runtime Optimization**
   - Problem: Slow execution in critical paths
   - Solution: CPU profiling and execution analysis
   - Benefit: Targeted performance improvements

### How It Works

1. **Data Collection**

   - Execution timing
   - Memory sampling
   - CPU profiling
   - Event tracking

2. **Analysis**

   - Hot path identification
   - Memory pattern analysis
   - Call stack examination
   - Bottleneck detection

3. **Visualization**

   - Timeline views
   - Flame charts
   - Memory graphs
   - Statistical reports

4. **Optimization**
   - Code improvements
   - Resource management
   - Caching strategies
   - Algorithm refinement

## Implementation

### CPU Profiling

### 1. Async Operation Profiler

```typescript:preview
class AsyncProfiler {
  private traces: Map<
    string,
    {
      count: number;
      totalTime: number;
      samples: number[];
    }
  > = new Map();

  async profile<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      return await operation();
    } finally {
      const duration = performance.now() - start;
      this.recordTrace(name, duration);
    }
  }

  private recordTrace(name: string, duration: number) {
    const existing = this.traces.get(name) || {
      count: 0,
      totalTime: 0,
      samples: [],
    };

    existing.count++;
    existing.totalTime += duration;
    existing.samples.push(duration);

    this.traces.set(name, existing);
  }

  getStats() {
    const stats: Record<
      string,
      {
        avg: number;
        p95: number;
        p99: number;
        count: number;
      }
    > = {};

    this.traces.forEach((trace, name) => {
      const sorted = [...trace.samples].sort((a, b) => a - b);
      stats[name] = {
        avg: trace.totalTime / trace.count,
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)],
        count: trace.count,
      };
    });

    return stats;
  }
}
```

### 2. Stack Sampling

```typescript:preview
class StackSampler {
  private samples: Array<{
    timestamp: number;
    stack: string;
  }> = [];

  startSampling(intervalMs: number = 10) {
    const interval = setInterval(() => {
      const stack = new Error().stack;
      this.samples.push({
        timestamp: performance.now(),
        stack: stack || '',
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }

  analyzeSamples() {
    const stackFrequency: Record<string, number> = {};

    this.samples.forEach((sample) => {
      const frames = sample.stack.split('\n').map((frame) => frame.trim());

      frames.forEach((frame) => {
        stackFrequency[frame] = (stackFrequency[frame] || 0) + 1;
      });
    });

    return Object.entries(stackFrequency)
      .sort(([, a], [, b]) => b - a)
      .map(([frame, count]) => ({
        frame,
        frequency: count / this.samples.length,
      }));
  }
}
```

## Memory Profiling

### 1. Heap Snapshot Analysis

```typescript:preview
class HeapAnalyzer {
  private snapshots: Array<{
    timestamp: number;
    usage: NodeJS.MemoryUsage;
    generation: number;
  }> = [];

  takeSnapshot() {
    if (global.gc) {
      global.gc();
    }

    this.snapshots.push({
      timestamp: Date.now(),
      usage: process.memoryUsage(),
      generation: this.snapshots.length,
    });
  }

  compareSnapshots(gen1: number, gen2: number) {
    const snapshot1 = this.snapshots[gen1];
    const snapshot2 = this.snapshots[gen2];

    if (!snapshot1 || !snapshot2) {
      throw new Error('Invalid snapshot generation');
    }

    return {
      heapDiff: {
        used: snapshot2.usage.heapUsed - snapshot1.usage.heapUsed,
        total: snapshot2.usage.heapTotal - snapshot1.usage.heapTotal,
      },
      timeDiff: snapshot2.timestamp - snapshot1.timestamp,
    };
  }
}
```

### 2. Memory Leak Detection

```typescript:preview
class LeakDetector {
  private samples: Array<{
    timestamp: number;
    size: number;
    objects: WeakRef<object>[];
  }> = [];

  private registry = new FinalizationRegistry((heldValue: any) => {
    console.log('Object finalized:', heldValue);
  });

  trackObject(obj: object, metadata?: any) {
    const ref = new WeakRef(obj);
    this.registry.register(obj, metadata);

    this.samples.push({
      timestamp: Date.now(),
      size: this.approximateSize(obj),
      objects: [...(this.samples[this.samples.length - 1]?.objects || []), ref],
    });
  }

  private approximateSize(obj: object): number {
    return JSON.stringify(obj).length;
  }

  detectLeaks() {
    return this.samples
      .map((sample, index) => {
        if (index === 0) return null;

        const prevSample = this.samples[index - 1];
        const survivingObjects = sample.objects.filter((ref) => ref.deref());

        return {
          timestamp: sample.timestamp,
          survivingObjects: survivingObjects.length,
          totalSize: survivingObjects.reduce((sum, ref) => {
            const obj = ref.deref();
            return sum + (obj ? this.approximateSize(obj) : 0);
          }, 0),
        };
      })
      .filter(Boolean);
  }
}
```

## Network Profiling

### Request Analyzer

```typescript:preview
class NetworkProfiler {
  private requests: Map<
    string,
    {
      start: number;
      end?: number;
      size?: number;
      status?: number;
    }
  > = new Map();

  trackRequest(url: string) {
    const id = `${url}-${Date.now()}`;
    this.requests.set(id, { start: performance.now() });

    return {
      complete: (status: number, size: number) => {
        const request = this.requests.get(id);
        if (request) {
          request.end = performance.now();
          request.status = status;
          request.size = size;
        }
      },
    };
  }

  getStats() {
    const stats: Record<
      string,
      {
        count: number;
        avgDuration: number;
        totalSize: number;
        successRate: number;
      }
    > = {};

    this.requests.forEach((request, id) => {
      const [url] = id.split('-');
      const duration = request.end ? request.end - request.start : 0;

      if (!stats[url]) {
        stats[url] = {
          count: 0,
          avgDuration: 0,
          totalSize: 0,
          successRate: 0,
        };
      }

      stats[url].count++;
      stats[url].avgDuration =
        (stats[url].avgDuration * (stats[url].count - 1) + duration) /
        stats[url].count;
      stats[url].totalSize += request.size || 0;
      stats[url].successRate =
        (stats[url].successRate * (stats[url].count - 1) +
          (request.status && request.status < 400 ? 1 : 0)) /
        stats[url].count;
    });

    return stats;
  }
}
```
