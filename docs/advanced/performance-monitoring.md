# Performance Monitoring

## Overview

A comprehensive performance monitoring system for async operations, including timing, memory usage, and operation tracking.

## Implementation

```typescript
interface OperationMetrics {
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: Error;
  metadata?: Record<string, any>;
}

interface PerformanceMetrics {
  operations: OperationMetrics[];
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  averageDuration: number;
  maxDuration: number;
  minDuration: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private operations: Map<string, OperationMetrics> = new Map();
  private listeners: Set<(metrics: OperationMetrics) => void> = new Set();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  async trackOperation<T>(
    operationName: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const metrics: OperationMetrics = {
      operationName,
      startTime: Date.now(),
      success: false,
      metadata
    };

    const operationId = `${operationName}-${metrics.startTime}`;
    this.operations.set(operationId, metrics);

    try {
      const result = await operation();
      metrics.success = true;
      return result;
    } catch (error) {
      metrics.error = error as Error;
      throw error;
    } finally {
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      this.notifyListeners(metrics);
    }
  }

  getMetrics(): PerformanceMetrics {
    const operations = Array.from(this.operations.values());
    const completed = operations.filter(op => op.endTime);
    const successful = completed.filter(op => op.success);
    const durations = completed.map(op => op.duration!);

    return {
      operations,
      totalOperations: operations.length,
      successfulOperations: successful.length,
      failedOperations: completed.length - successful.length,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations)
    };
  }

  addListener(listener: (metrics: OperationMetrics) => void): void {
    this.listeners.add(listener);
  }

  removeListener(listener: (metrics: OperationMetrics) => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(metrics: OperationMetrics): void {
    this.listeners.forEach(listener => listener(metrics));
  }

  clearMetrics(): void {
    this.operations.clear();
  }
}

// Performance decorators
function monitored(operationName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const monitor = PerformanceMonitor.getInstance();

    descriptor.value = function (...args: any[]) {
      const name = operationName || `${target.constructor.name}.${propertyKey}`;
      return monitor.trackOperation(
        name,
        () => originalMethod.apply(this, args),
        { args }
      );
    };

    return descriptor;
  };
}

// Memory usage tracking
class MemoryMonitor {
  private static instance: MemoryMonitor;
  private snapshots: Map<string, number> = new Map();

  static getInstance(): MemoryMonitor {
    if (!this.instance) {
      this.instance = new MemoryMonitor();
    }
    return this.instance;
  }

  takeSnapshot(label: string): void {
    if (typeof process !== 'undefined') {
      // Node.js
      this.snapshots.set(label, process.memoryUsage().heapUsed);
    } else if (typeof window !== 'undefined' && window.performance) {
      // Browser
      this.snapshots.set(
        label,
        (window.performance as any).memory?.usedJSHeapSize || 0
      );
    }
  }

  compareSnapshots(label1: string, label2: string): number {
    const snapshot1 = this.snapshots.get(label1) || 0;
    const snapshot2 = this.snapshots.get(label2) || 0;
    return snapshot2 - snapshot1;
  }
}
```

## Usage Example

```typescript
// Basic operation tracking
const monitor = PerformanceMonitor.getInstance();

async function fetchData() {
  return monitor.trackOperation(
    'fetchData',
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    { endpoint: '/api/data' }
  );
}

// Using decorator
class DataService {
  @monitored('fetchUserData')
  async fetchUser(id: string) {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
}

// Memory tracking
const memoryMonitor = MemoryMonitor.getInstance();

async function processLargeData() {
  memoryMonitor.takeSnapshot('start');
  
  // Process data
  const data = new Array(1000000).fill(0);
  await someOperation(data);
  
  memoryMonitor.takeSnapshot('end');
  
  const memoryUsed = memoryMonitor.compareSnapshots('start', 'end');
  console.log(`Memory used: ${memoryUsed} bytes`);
}

// Performance metrics listener
monitor.addListener((metrics) => {
  if (metrics.duration! > 1000) {
    console.warn(
      `Slow operation detected: ${metrics.operationName}`,
      `took ${metrics.duration}ms`
    );
  }
});
```
