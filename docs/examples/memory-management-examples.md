---
title: Memory Management Examples
description: Master memory management techniques in JavaScript. Learn about memory leaks, garbage collection, and efficient resource handling.
date: 2024-01-01
author: Underwood Inc
tags:
  - JavaScript
  - Memory Management
  - Performance
  - Resource Handling
  - Examples
  - Best Practices
image: /web-patterns/images/memory-management-examples-banner.png
---

# Memory Management Examples

This page demonstrates practical examples of managing memory efficiently in asynchronous operations.

## Object Pool

```typescript:preview
// Generic object pool implementation
class ObjectPool<T> {
  private available: T[] = [];
  private inUse = new Set<T>();
  private factory: () => T;
  private reset: (obj: T) => void;

  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize: number = 10
  ) {
    this.factory = factory;
    this.reset = reset;
    this.initialize(initialSize);
  }

  private initialize(size: number): void {
    for (let i = 0; i < size; i++) {
      this.available.push(this.factory());
    }
  }

  acquire(): T {
    let obj: T;

    if (this.available.length > 0) {
      obj = this.available.pop()!;
    } else {
      obj = this.factory();
    }

    this.inUse.add(obj);
    return obj;
  }

  release(obj: T): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      this.reset(obj);
      this.available.push(obj);
    }
  }

  clear(): void {
    this.available = [];
    this.inUse.clear();
  }

  get size(): number {
    return this.available.length + this.inUse.size;
  }
}

// Usage with buffers
const bufferPool = new ObjectPool<Buffer>(
  () => Buffer.allocUnsafe(1024),
  (buffer) => buffer.fill(0),
  100
);

async function processData(data: Buffer): Promise<void> {
  const buffer = bufferPool.acquire();

  try {
    // Process data using the buffer
    data.copy(buffer);
    await someAsyncOperation(buffer);
  } finally {
    bufferPool.release(buffer);
  }
}
```

## WeakRef Cache

```typescript:preview
class WeakCache<K extends object, V> {
  private cache = new Map<
    WeakRef<K>,
    {
      value: V;
      ref: FinalizationRegistry<WeakRef<K>>;
    }
  >();

  private registry = new FinalizationRegistry((ref: WeakRef<K>) => {
    this.cache.delete(ref);
  });

  set(key: K, value: V): void {
    const ref = new WeakRef(key);
    this.cache.set(ref, {
      value,
      ref: this.registry.register(key, ref, ref),
    });
  }

  get(key: K): V | undefined {
    for (const [ref, entry] of this.cache) {
      const obj = ref.deref();
      if (obj === key) {
        return entry.value;
      }
      if (!obj) {
        this.cache.delete(ref);
      }
    }
    return undefined;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Usage
class ExpensiveResource {
  constructor(
    public readonly id: string,
    public readonly data: Buffer
  ) {}
}

const resourceCache = new WeakCache<ExpensiveResource, ComputedData>();

async function processResource(
  resource: ExpensiveResource
): Promise<ComputedData> {
  let result = resourceCache.get(resource);

  if (!result) {
    result = await computeExpensiveOperation(resource);
    resourceCache.set(resource, result);
  }

  return result;
}
```

## Real-World Example: Memory-Efficient Data Processing

```typescript:preview
class DataProcessor {
  private bufferPool: ObjectPool<Buffer>;
  private cache: WeakCache<DataChunk, ProcessedResult>;
  private metrics: ProcessingMetrics;

  constructor(
    private readonly options: {
      bufferSize?: number;
      poolSize?: number;
      maxConcurrent?: number;
    } = {}
  ) {
    this.bufferPool = new ObjectPool<Buffer>(
      () => Buffer.allocUnsafe(options.bufferSize ?? 16384),
      (buffer) => buffer.fill(0),
      options.poolSize ?? 100
    );

    this.cache = new WeakCache();
    this.metrics = {
      processedChunks: 0,
      cachedResults: 0,
      totalMemoryUsed: 0,
    };
  }

  async processChunks(chunks: DataChunk[]): Promise<ProcessedResult[]> {
    const semaphore = new Semaphore(this.options.maxConcurrent ?? 10);

    return Promise.all(
      chunks.map((chunk) => semaphore.execute(() => this.processChunk(chunk)))
    );
  }

  private async processChunk(chunk: DataChunk): Promise<ProcessedResult> {
    // Check cache first
    const cached = this.cache.get(chunk);
    if (cached) {
      this.metrics.cachedResults++;
      return cached;
    }

    // Acquire buffer from pool
    const buffer = this.bufferPool.acquire();

    try {
      // Process the chunk
      const result = await this.processWithBuffer(chunk, buffer);

      // Update metrics
      this.metrics.processedChunks++;
      this.metrics.totalMemoryUsed += buffer.length;

      // Cache the result
      this.cache.set(chunk, result);

      return result;
    } finally {
      // Release buffer back to pool
      this.bufferPool.release(buffer);
    }
  }

  private async processWithBuffer(
    chunk: DataChunk,
    buffer: Buffer
  ): Promise<ProcessedResult> {
    // Copy chunk data to buffer
    chunk.data.copy(buffer);

    // Process data in buffer
    const processed = await this.transform(buffer);

    return {
      id: chunk.id,
      result: processed,
      timestamp: Date.now(),
    };
  }

  private async transform(buffer: Buffer): Promise<Buffer> {
    // Simulate some data transformation
    return Buffer.from(buffer.reverse());
  }

  getMetrics(): ProcessingMetrics {
    const { heapUsed } = process.memoryUsage();

    return {
      ...this.metrics,
      currentHeapUsed: heapUsed,
      bufferPoolSize: this.bufferPool.size,
    };
  }
}

// Usage
const processor = new DataProcessor({
  bufferSize: 16384, // 16KB
  poolSize: 100,
  maxConcurrent: 10,
});

const chunks = generateDataChunks(1000); // Some data source
const results = await processor.processChunks(chunks);

console.log('Processing metrics:', processor.getMetrics());
```

## Best Practices

1. Memory monitoring:

   ```typescript:preview
   class MemoryMonitor {
     private samples: MemorySample[] = [];
     private readonly maxSamples: number;
     private timer?: NodeJS.Timer;

     constructor(
       private readonly options: {
         sampleInterval?: number;
         maxSamples?: number;
         threshold?: number;
         onThresholdExceeded?: (usage: number) => void;
       } = {}
     ) {
       this.maxSamples = options.maxSamples ?? 100;
     }

     start(): void {
       if (this.timer) return;

       this.timer = setInterval(() => {
         this.recordSample();
       }, this.options.sampleInterval ?? 1000);
     }

     stop(): void {
       if (this.timer) {
         clearInterval(this.timer);
         this.timer = undefined;
       }
     }

     private recordSample(): void {
       const usage = process.memoryUsage();
       const sample: MemorySample = {
         timestamp: Date.now(),
         heapUsed: usage.heapUsed,
         heapTotal: usage.heapTotal,
         external: usage.external,
         rss: usage.rss,
       };

       this.samples.push(sample);
       if (this.samples.length > this.maxSamples) {
         this.samples.shift();
       }

       const threshold = this.options.threshold ?? 0.9;
       const usageRatio = usage.heapUsed / usage.heapTotal;

       if (usageRatio > threshold) {
         this.options.onThresholdExceeded?.(usageRatio);
       }
     }

     getMetrics(): MemoryMetrics {
       const current = this.samples[this.samples.length - 1];
       const average = {
         heapUsed: 0,
         heapTotal: 0,
         external: 0,
         rss: 0,
       };

       for (const sample of this.samples) {
         average.heapUsed += sample.heapUsed;
         average.heapTotal += sample.heapTotal;
         average.external += sample.external;
         average.rss += sample.rss;
       }

       const count = this.samples.length;
       return {
         current,
         average: {
           heapUsed: average.heapUsed / count,
           heapTotal: average.heapTotal / count,
           external: average.external / count,
           rss: average.rss / count,
         },
         samples: [...this.samples],
       };
     }
   }
   ```

2. Garbage collection hooks:

   ```typescript:preview
   class GCHooks {
     private listeners = new Set<(stats: GCStats) => void>();

     constructor() {
       this.setupHooks();
     }

     private setupHooks(): void {
       if (global.gc) {
         const originalGc = global.gc;

         global.gc = () => {
           const before = process.memoryUsage();
           const startTime = performance.now();

           originalGc();

           const after = process.memoryUsage();
           const duration = performance.now() - startTime;

           const stats: GCStats = {
             duration,
             freed: before.heapUsed - after.heapUsed,
             timestamp: Date.now(),
           };

           this.notifyListeners(stats);
         };
       }
     }

     onGC(listener: (stats: GCStats) => void): void {
       this.listeners.add(listener);
     }

     removeListener(listener: (stats: GCStats) => void): void {
       this.listeners.delete(listener);
     }

     private notifyListeners(stats: GCStats): void {
       for (const listener of this.listeners) {
         try {
           listener(stats);
         } catch (error) {
           console.error('GC listener error:', error);
         }
       }
     }
   }
   ```

3. Memory leak detection:

   ```typescript:preview
   class LeakDetector {
     private snapshots: HeapSnapshot[] = [];
     private growing = new Set<string>();

     async takeSnapshot(): Promise<void> {
       const snapshot = await this.captureHeap();
       this.snapshots.push(snapshot);

       if (this.snapshots.length > 3) {
         this.snapshots.shift();
         this.analyzeGrowth();
       }
     }

     private async captureHeap(): Promise<HeapSnapshot> {
       return new Promise((resolve) => {
         const snapshot = require('v8').getHeapSnapshot();
         resolve(this.processSnapshot(snapshot));
       });
     }

     private processSnapshot(raw: any): HeapSnapshot {
       const nodes = new Map<string, number>();

       for (const node of raw.nodes) {
         const type = node.type;
         const size = node.selfSize;

         nodes.set(type, (nodes.get(type) ?? 0) + size);
       }

       return {
         timestamp: Date.now(),
         nodes,
       };
     }

     private analyzeGrowth(): void {
       const [prev, curr] = this.snapshots.slice(-2);

       for (const [type, size] of curr.nodes) {
         const prevSize = prev.nodes.get(type) ?? 0;

         if (size > prevSize * 1.5) {
           this.growing.add(type);
         } else {
           this.growing.delete(type);
         }
       }
     }

     getLeaks(): string[] {
       return Array.from(this.growing);
     }
   }
   ```

4. Resource limits:

   ```typescript:preview
   class ResourceLimiter {
     private limits: Map<string, number> = new Map();
     private usage: Map<string, number> = new Map();

     setLimit(resource: string, limit: number): void {
       this.limits.set(resource, limit);
     }

     async acquire(resource: string, amount: number): Promise<void> {
       const limit = this.limits.get(resource);
       if (!limit) return;

       const current = this.usage.get(resource) ?? 0;
       if (current + amount > limit) {
         throw new Error(`Resource limit exceeded: ${resource}`);
       }

       this.usage.set(resource, current + amount);
     }

     release(resource: string, amount: number): void {
       const current = this.usage.get(resource) ?? 0;
       this.usage.set(resource, Math.max(0, current - amount));
     }

     getUsage(resource: string): number {
       return this.usage.get(resource) ?? 0;
     }

     getLimit(resource: string): number {
       return this.limits.get(resource) ?? Infinity;
     }
   }
   ```
