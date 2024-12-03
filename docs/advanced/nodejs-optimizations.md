# Node.js Optimizations

## Overview

This guide covers optimization techniques specific to Node.js environments,
focusing on async operations and performance.

## Event Loop Optimization

### 1. Microtasks vs Macrotasks

```typescript
class TaskScheduler {
  scheduleImmediate(task: () => void) {
    process.nextTick(task);
  }

  scheduleLater(task: () => void) {
    setImmediate(task);
  }

  scheduleAsync(task: () => Promise<void>) {
    return new Promise<void>((resolve) => {
      setImmediate(async () => {
        await task();
        resolve();
      });
    });
  }
}
```

### 2. Worker Threads

```typescript
import { Worker, isMainThread, parentPort } from 'worker_threads';

class WorkerThreadPool {
  private workers: Worker[] = [];
  private taskQueue: Array<{
    task: Function;
    resolve: Function;
    reject: Function;
  }> = [];

  constructor(workerScript: string, numWorkers: number = 4) {
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(workerScript);
      worker.on('message', this.handleMessage.bind(this));
      worker.on('error', this.handleError.bind(this));
      this.workers.push(worker);
    }
  }

  async executeTask(task: Function) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ task, resolve, reject });
      this.processQueue();
    });
  }

  private processQueue() {
    const availableWorker = this.workers.find((w) => !w.busy);
    if (availableWorker && this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()!;
      availableWorker.busy = true;
      availableWorker.postMessage(task);
    }
  }

  private handleMessage(result: any) {
    // Implementation
  }

  private handleError(error: Error) {
    // Implementation
  }
}
```

## Stream Processing

### 1. Pipeline Pattern

```typescript
import { pipeline, Transform } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

class StreamProcessor {
  async process(
    readStream: NodeJS.ReadableStream,
    writeStream: NodeJS.WritableStream
  ) {
    const transform = new Transform({
      transform(chunk, encoding, callback) {
        // Process chunk
        callback(null, chunk);
      },
    });

    try {
      await pipelineAsync(readStream, transform, writeStream);
    } catch (error) {
      console.error('Pipeline failed', error);
      throw error;
    }
  }
}
```

### 2. Backpressure Handling

```typescript
class BackpressureAwareStream extends Transform {
  constructor(options = {}) {
    super({
      ...options,
      highWaterMark: 1024 * 1024, // 1MB
    });
  }

  _transform(chunk: any, encoding: string, callback: Function) {
    if (this.push(chunk)) {
      // If backpressure is building up, wait before processing more
      setImmediate(callback);
    } else {
      // Process immediately if no backpressure
      callback();
    }
  }
}
```

## Memory Management

### 1. Garbage Collection Hints

```typescript
class MemoryOptimizer {
  static scheduleGC() {
    if (global.gc) {
      setImmediate(() => {
        global.gc();
      });
    }
  }

  static async withGC<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } finally {
      this.scheduleGC();
    }
  }
}
```

### 2. Buffer Pooling

```typescript
class BufferPool {
  private pool: Buffer[] = [];
  private size: number;

  constructor(poolSize: number = 10, bufferSize: number = 1024) {
    this.size = bufferSize;
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(Buffer.alloc(bufferSize));
    }
  }

  acquire(): Buffer {
    return this.pool.pop() || Buffer.alloc(this.size);
  }

  release(buffer: Buffer) {
    if (this.pool.length < 10) {
      buffer.fill(0);
      this.pool.push(buffer);
    }
  }
}
```

## Performance Monitoring

### APM Integration

```typescript
class NodePerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  trackOperation(name: string, duration: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
  }

  async measure<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const start = process.hrtime();
    try {
      return await operation();
    } finally {
      const [seconds, nanoseconds] = process.hrtime(start);
      const duration = seconds * 1000 + nanoseconds / 1e6;
      this.trackOperation(name, duration);
    }
  }

  getMetrics() {
    const result: Record<string, { avg: number; max: number }> = {};

    this.metrics.forEach((durations, name) => {
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const max = Math.max(...durations);
      result[name] = { avg, max };
    });

    return result;
  }
}
```
