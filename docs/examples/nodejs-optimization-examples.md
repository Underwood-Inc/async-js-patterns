---
title: Node.js Optimization Examples
description: Learn Node.js optimization techniques and patterns. Master performance tuning, memory management, and server-side optimizations.
date: 2024-12-01
author: Underwood Inc
tags:
  - Node.js
  - JavaScript
  - Performance
  - Optimization
  - Examples
  - Best Practices
image: /web-patterns/images/nodejs-optimization-examples-banner.png
---

# Node.js Optimization Examples

This page demonstrates practical examples of optimizing asynchronous operations in Node.js environments.

## Stream Processing

```typescript:preview
// Efficient stream processing
import { Transform, pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

class ChunkProcessor extends Transform {
  constructor(
    private readonly processor: (chunk: any) => Promise<any>,
    options: any = {}
  ) {
    super({
      ...options,
      objectMode: true,
    });
  }

  async _transform(
    chunk: any,
    encoding: string,
    callback: Function
  ): Promise<void> {
    try {
      const processed = await this.processor(chunk);
      this.push(processed);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

// Usage
async function processLargeFile(
  inputStream: NodeJS.ReadableStream,
  outputStream: NodeJS.WritableStream,
  processor: (chunk: any) => Promise<any>
): Promise<void> {
  await pipelineAsync(inputStream, new ChunkProcessor(processor), outputStream);
}

// Example: Process large JSON file
import { createReadStream, createWriteStream } from 'fs';
import { parse } from 'JSONStream';

const inputStream = createReadStream('large-file.json').pipe(parse('*'));

const outputStream = createWriteStream('output.json');

await processLargeFile(inputStream, outputStream, async (record) => {
  // Process each record
  return {
    ...record,
    processed: true,
    timestamp: Date.now(),
  };
});
```

## Worker Threads Pool

```typescript:preview
import { Worker } from 'worker_threads';
import { cpus } from 'os';

class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    task: any;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];
  private activeWorkers = new Set<Worker>();

  constructor(
    private readonly workerScript: string,
    private readonly poolSize: number = cpus().length
  ) {
    this.initialize();
  }

  private initialize(): void {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);

      worker.on('message', (result) => {
        this.handleWorkerMessage(worker, result);
      });

      worker.on('error', (error) => {
        this.handleWorkerError(worker, error);
      });

      worker.on('exit', (code) => {
        this.handleWorkerExit(worker, code);
      });

      this.workers.push(worker);
    }
  }

  private handleWorkerMessage(worker: Worker, result: any): void {
    this.activeWorkers.delete(worker);
    const nextTask = this.queue.shift();

    if (nextTask) {
      this.assignTaskToWorker(worker, nextTask);
    }

    nextTask?.resolve(result);
  }

  private handleWorkerError(worker: Worker, error: Error): void {
    this.activeWorkers.delete(worker);
    const nextTask = this.queue.shift();
    nextTask?.reject(error);
  }

  private handleWorkerExit(worker: Worker, code: number): void {
    this.workers = this.workers.filter((w) => w !== worker);
    this.activeWorkers.delete(worker);

    if (code !== 0) {
      console.error(`Worker exited with code ${code}`);
      // Replace the worker
      const newWorker = new Worker(this.workerScript);
      this.workers.push(newWorker);
    }
  }

  private assignTaskToWorker(
    worker: Worker,
    task: {
      task: any;
      resolve: (value: any) => void;
      reject: (reason: any) => void;
    }
  ): void {
    this.activeWorkers.add(worker);
    worker.postMessage(task.task);
  }

  async execute<T>(task: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(
        (worker) => !this.activeWorkers.has(worker)
      );

      if (availableWorker) {
        this.assignTaskToWorker(availableWorker, { task, resolve, reject });
      } else {
        this.queue.push({ task, resolve, reject });
      }
    });
  }

  async shutdown(): Promise<void> {
    await Promise.all(this.workers.map((worker) => worker.terminate()));
    this.workers = [];
    this.activeWorkers.clear();
  }
}

// Worker script (worker.ts)
import { parentPort } from 'worker_threads';

parentPort?.on('message', async (task) => {
  try {
    const result = await processTask(task);
    parentPort?.postMessage(result);
  } catch (error) {
    parentPort?.postMessage({
      error: error.message,
    });
  }
});

async function processTask(task: any): Promise<any> {
  // CPU-intensive task
  return task.data.map((x: number) => x * 2);
}

// Usage
const pool = new WorkerPool('./worker.js');

const results = await Promise.all([
  pool.execute({ data: [1, 2, 3] }),
  pool.execute({ data: [4, 5, 6] }),
  pool.execute({ data: [7, 8, 9] }),
]);

await pool.shutdown();
```

## Real-World Example: Batch Processing Service

```typescript:preview
class BatchProcessor {
  private workerPool: WorkerPool;
  private streamProcessor: ChunkProcessor;
  private metrics: {
    processedItems: number;
    errors: number;
    startTime: number;
  };

  constructor(
    private readonly options: {
      workerPoolSize?: number;
      batchSize?: number;
      flushInterval?: number;
    } = {}
  ) {
    this.workerPool = new WorkerPool('./worker.js', options.workerPoolSize);

    this.streamProcessor = new ChunkProcessor(this.processBatch.bind(this));

    this.metrics = {
      processedItems: 0,
      errors: 0,
      startTime: Date.now(),
    };
  }

  async processBatch(items: any[]): Promise<ProcessingResult[]> {
    const batches = this.splitIntoBatches(
      items,
      this.options.batchSize ?? 1000
    );

    const results = await Promise.all(
      batches.map((batch) =>
        this.workerPool.execute({
          type: 'process',
          data: batch,
        })
      )
    );

    this.updateMetrics(results);
    return results.flat();
  }

  private splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private updateMetrics(results: ProcessingResult[]): void {
    const flatResults = results.flat();
    this.metrics.processedItems += flatResults.length;
    this.metrics.errors += flatResults.filter((r) => r.error).length;
  }

  async processFile(inputPath: string, outputPath: string): Promise<void> {
    const inputStream = createReadStream(inputPath).pipe(parse('*'));

    const outputStream = createWriteStream(outputPath);

    await processLargeFile(
      inputStream,
      outputStream,
      this.processBatch.bind(this)
    );
  }

  async processStream(
    inputStream: NodeJS.ReadableStream,
    outputStream: NodeJS.WritableStream
  ): Promise<void> {
    await pipelineAsync(inputStream, this.streamProcessor, outputStream);
  }

  getMetrics(): ProcessingMetrics {
    const duration = Date.now() - this.metrics.startTime;
    return {
      ...this.metrics,
      duration,
      itemsPerSecond: this.metrics.processedItems / (duration / 1000),
      errorRate: this.metrics.errors / this.metrics.processedItems,
    };
  }

  async shutdown(): Promise<void> {
    await this.workerPool.shutdown();
  }
}

// Usage
const processor = new BatchProcessor({
  workerPoolSize: 4,
  batchSize: 1000,
  flushInterval: 5000,
});

// Process file
await processor.processFile('input.json', 'output.json');

// Process stream
const source = getDataSource(); // Some data source
const destination = getDataDestination(); // Some destination

await processor.processStream(source, destination);

// Get metrics
console.log('Processing metrics:', processor.getMetrics());

await processor.shutdown();
```

## Best Practices

1. Memory management:

   ```typescript:preview
   class MemoryManager {
     private readonly maxHeapSize: number;
     private readonly threshold: number;

     constructor(
       options: {
         maxHeapSize?: number;
         threshold?: number;
       } = {}
     ) {
       this.maxHeapSize =
         options.maxHeapSize ?? process.memoryUsage().heapTotal * 0.9;
       this.threshold = options.threshold ?? 0.8;
     }

     async checkMemory(): Promise<void> {
       const { heapUsed } = process.memoryUsage();

       if (heapUsed > this.maxHeapSize * this.threshold) {
         // Force garbage collection if available
         if (global.gc) {
           global.gc();
         }

         // Wait for next tick to allow GC to complete
         await new Promise((resolve) => setImmediate(resolve));
       }
     }

     async withMemoryCheck<T>(operation: () => Promise<T>): Promise<T> {
       await this.checkMemory();
       const result = await operation();
       await this.checkMemory();
       return result;
     }
   }
   ```

2. Event loop monitoring:

   ```typescript:preview
   class EventLoopMonitor {
     private samples: number[] = [];
     private timer?: NodeJS.Timer;
     private threshold: number;

     constructor(threshold: number = 100) {
       this.threshold = threshold;
     }

     start(): void {
       if (this.timer) return;

       let lastCheck = process.hrtime.bigint();

       this.timer = setInterval(() => {
         const now = process.hrtime.bigint();
         const lag = Number(now - lastCheck) / 1_000_000;

         this.samples.push(lag);
         if (this.samples.length > 100) {
           this.samples.shift();
         }

         if (lag > this.threshold) {
           this.handleHighLatency(lag);
         }

         lastCheck = now;
       }, 1000);
     }

     stop(): void {
       if (this.timer) {
         clearInterval(this.timer);
         this.timer = undefined;
       }
     }

     private handleHighLatency(lag: number): void {
       console.warn(`Event loop lag detected: ${lag.toFixed(2)}ms`);
     }

     getMetrics(): EventLoopMetrics {
       return {
         currentLag: this.samples[this.samples.length - 1],
         averageLag:
           this.samples.reduce((a, b) => a + b, 0) / this.samples.length,
         maxLag: Math.max(...this.samples),
         samples: [...this.samples],
       };
     }
   }
   ```

3. Resource pooling:

   ```typescript:preview
   class ResourcePool<T> {
     private available: T[] = [];
     private inUse = new Set<T>();
     private waitQueue: Array<{
       resolve: (resource: T) => void;
       reject: (error: Error) => void;
     }> = [];

     constructor(
       private readonly factory: () => Promise<T>,
       private readonly validate: (resource: T) => Promise<boolean>,
       private readonly cleanup: (resource: T) => Promise<void>,
       private readonly options: {
         maxSize: number;
         minSize: number;
         acquireTimeout?: number;
       }
     ) {
       this.initialize();
     }

     private async initialize(): Promise<void> {
       for (let i = 0; i < this.options.minSize; i++) {
         const resource = await this.factory();
         this.available.push(resource);
       }
     }

     async acquire(): Promise<T> {
       if (this.available.length > 0) {
         const resource = this.available.pop()!;

         if (await this.validate(resource)) {
           this.inUse.add(resource);
           return resource;
         }

         await this.cleanup(resource);
         return this.acquire();
       }

       if (this.inUse.size + this.available.length < this.options.maxSize) {
         const resource = await this.factory();
         this.inUse.add(resource);
         return resource;
       }

       return new Promise((resolve, reject) => {
         const timeout = this.options.acquireTimeout;

         if (timeout) {
           setTimeout(() => {
             const index = this.waitQueue.findIndex(
               (w) => w.resolve === resolve
             );
             if (index !== -1) {
               this.waitQueue.splice(index, 1);
               reject(new Error('Acquire timeout'));
             }
           }, timeout);
         }

         this.waitQueue.push({ resolve, reject });
       });
     }

     async release(resource: T): Promise<void> {
       if (!this.inUse.has(resource)) return;

       this.inUse.delete(resource);

       if (this.waitQueue.length > 0) {
         const { resolve } = this.waitQueue.shift()!;
         resolve(resource);
       } else if (await this.validate(resource)) {
         this.available.push(resource);
       } else {
         await this.cleanup(resource);

         if (this.available.length < this.options.minSize) {
           const newResource = await this.factory();
           this.available.push(newResource);
         }
       }
     }

     async drain(): Promise<void> {
       const resources = [...this.available, ...this.inUse];

       this.available = [];
       this.inUse.clear();

       await Promise.all(resources.map((r) => this.cleanup(r)));

       this.waitQueue.forEach(({ reject }) => {
         reject(new Error('Pool drained'));
       });
       this.waitQueue = [];
     }
   }
   ```

4. Graceful shutdown:

   ```typescript:preview
   class ShutdownManager {
     private handlers: Set<() => Promise<void>> = new Set();
     private shuttingDown = false;

     register(handler: () => Promise<void>): void {
       this.handlers.add(handler);
     }

     unregister(handler: () => Promise<void>): void {
       this.handlers.delete(handler);
     }

     async shutdown(): Promise<void> {
       if (this.shuttingDown) return;
       this.shuttingDown = true;

       console.log('Starting graceful shutdown...');

       try {
         await Promise.all(
           Array.from(this.handlers).map((handler) =>
             handler().catch((error) => {
               console.error('Shutdown handler error:', error);
             })
           )
         );
       } finally {
         process.exit(0);
       }
     }

     setupSignalHandlers(): void {
       process.on('SIGTERM', () => this.shutdown());
       process.on('SIGINT', () => this.shutdown());
     }
   }
   ```
