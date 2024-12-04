# Parallel Tasks Examples

This page demonstrates practical examples of executing tasks in parallel while managing concurrency and resources effectively.

## Basic Parallel Execution

```typescript
// Basic parallel task execution
async function executeInParallel<T>(
  tasks: Array<() => Promise<T>>
): Promise<T[]> {
  return Promise.all(tasks.map((task) => task()));
}

// Usage
const tasks = [
  async () => {
    await delay(1000);
    return 'Task 1';
  },
  async () => {
    await delay(500);
    return 'Task 2';
  },
  async () => {
    await delay(800);
    return 'Task 3';
  },
];

const results = await executeInParallel(tasks);
console.log('All tasks completed:', results);
```

## Concurrent Task Queue

```typescript
class TaskQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  private results: any[] = [];
  private concurrency: number;

  constructor(concurrency: number = 3) {
    this.concurrency = concurrency;
  }

  add(task: () => Promise<any>): void {
    this.queue.push(task);
  }

  async run(): Promise<any[]> {
    const taskPromises: Promise<void>[] = [];

    for (let i = 0; i < this.queue.length; i++) {
      const promise = this.runTask(i);
      taskPromises.push(promise);

      // Wait if we've hit the concurrency limit
      if (this.running >= this.concurrency) {
        await Promise.race(taskPromises);
      }
    }

    await Promise.all(taskPromises);
    return this.results;
  }

  private async runTask(index: number): Promise<void> {
    this.running++;

    try {
      const task = this.queue[index];
      const result = await task();
      this.results[index] = result;
    } catch (error) {
      this.results[index] = { error };
    } finally {
      this.running--;
    }
  }
}

// Usage
const queue = new TaskQueue(2);
queue.add(async () => fetchUserData('1'));
queue.add(async () => fetchUserData('2'));
queue.add(async () => fetchUserData('3'));
queue.add(async () => fetchUserData('4'));

const results = await queue.run();
```

## Batch Processing with Concurrency

```typescript
class BatchProcessor {
  constructor(private readonly concurrency: number = 3) {}

  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    options: {
      onProgress?: (completed: number, total: number) => void;
      onError?: (error: Error, item: T) => void;
    } = {}
  ): Promise<ProcessingResult<T, R>> {
    const results: ProcessingResult<T, R> = {
      successful: [],
      failed: [],
      total: items.length,
    };

    const chunks = this.chunkArray(items, this.concurrency);
    let completed = 0;

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (item) => {
        try {
          const result = await processor(item);
          results.successful.push({ item, result });
        } catch (error) {
          results.failed.push({ item, error: error as Error });
          options.onError?.(error as Error, item);
        } finally {
          completed++;
          options.onProgress?.(completed, items.length);
        }
      });

      await Promise.all(chunkPromises);
    }

    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// Usage
const processor = new BatchProcessor(3);
const items = ['item1', 'item2', 'item3', 'item4', 'item5'];

const results = await processor.processBatch(
  items,
  async (item) => {
    const result = await processItem(item);
    return result;
  },
  {
    onProgress: (completed, total) => {
      console.log(`Progress: ${completed}/${total}`);
    },
    onError: (error, item) => {
      console.error(`Failed to process ${item}:`, error);
    },
  }
);
```

## Real-World Example: Parallel Data Processing Pipeline

```typescript
class DataProcessingPipeline {
  private readonly stages: ProcessingStage[];
  private readonly maxConcurrency: number;
  private metrics: MetricsCollector;

  constructor(
    stages: ProcessingStage[],
    maxConcurrency: number = 5,
    metrics: MetricsCollector
  ) {
    this.stages = stages;
    this.maxConcurrency = maxConcurrency;
    this.metrics = metrics;
  }

  async process<T>(
    items: T[],
    options: ProcessingOptions = {}
  ): Promise<ProcessingResults<T>> {
    const results = new ProcessingResults<T>();
    const startTime = Date.now();

    try {
      // Process items in parallel with concurrency limit
      await this.processItems(items, results, options);
    } finally {
      // Record metrics
      const duration = Date.now() - startTime;
      this.recordMetrics(results, duration);
    }

    return results;
  }

  private async processItems<T>(
    items: T[],
    results: ProcessingResults<T>,
    options: ProcessingOptions
  ): Promise<void> {
    const queue = new Queue<T>(this.maxConcurrency);
    const processing = new Set<Promise<void>>();

    for (const item of items) {
      if (processing.size >= this.maxConcurrency) {
        await Promise.race(processing);
      }

      const promise = this.processItem(item, results, options).finally(() =>
        processing.delete(promise)
      );

      processing.add(promise);
    }

    await Promise.all(processing);
  }

  private async processItem<T>(
    item: T,
    results: ProcessingResults<T>,
    options: ProcessingOptions
  ): Promise<void> {
    const context = new ProcessingContext(item);

    try {
      for (const stage of this.stages) {
        const stageStartTime = Date.now();

        try {
          await stage.process(context);
          this.metrics.recordStageSuccess(stage.name);
        } catch (error) {
          this.metrics.recordStageFailure(stage.name, error as Error);

          if (stage.critical) {
            throw error;
          }

          context.addError(stage.name, error as Error);
        } finally {
          this.metrics.recordStageDuration(
            stage.name,
            Date.now() - stageStartTime
          );
        }
      }

      if (context.hasErrors() && options.failOnAnyError) {
        throw new AggregateError(
          context.errors,
          'Processing completed with errors'
        );
      }

      results.addSuccess(item, context);
    } catch (error) {
      results.addFailure(item, error as Error);

      if (options.stopOnError) {
        throw error;
      }
    }
  }

  private recordMetrics(
    results: ProcessingResults<any>,
    duration: number
  ): void {
    this.metrics.record({
      duration,
      totalItems: results.total,
      successfulItems: results.successful.length,
      failedItems: results.failed.length,
      averageItemDuration: duration / results.total,
    });
  }
}

// Usage
const pipeline = new DataProcessingPipeline(
  [
    new ValidationStage(),
    new TransformationStage(),
    new EnrichmentStage(),
    new PersistenceStage(),
  ],
  3,
  new MetricsCollector()
);

try {
  const results = await pipeline.process(items, {
    failOnAnyError: false,
    stopOnError: false,
  });

  console.log('Processing completed:', {
    successful: results.successful.length,
    failed: results.failed.length,
    total: results.total,
  });
} catch (error) {
  console.error('Pipeline failed:', error);
}
```

## Best Practices

1. Resource management:

   ```typescript
   class ResourcePool {
     private available: Resource[] = [];
     private inUse = new Set<Resource>();

     async withResource<T>(
       operation: (resource: Resource) => Promise<T>
     ): Promise<T> {
       const resource = await this.acquire();
       try {
         return await operation(resource);
       } finally {
         await this.release(resource);
       }
     }

     async withConcurrentResources<T>(
       count: number,
       operation: (resources: Resource[]) => Promise<T>
     ): Promise<T> {
       const resources: Resource[] = [];
       try {
         for (let i = 0; i < count; i++) {
           resources.push(await this.acquire());
         }
         return await operation(resources);
       } finally {
         await Promise.all(resources.map((r) => this.release(r)));
       }
     }
   }
   ```

2. Error handling:

   ```typescript
   async function executeWithErrorBoundary<T>(
     tasks: Array<() => Promise<T>>,
     options: {
       stopOnError?: boolean;
       errorHandler?: (error: Error) => void;
     } = {}
   ): Promise<T[]> {
     const results: T[] = [];
     const errors: Error[] = [];

     await Promise.all(
       tasks.map(async (task, index) => {
         try {
           results[index] = await task();
         } catch (error) {
           errors.push(error as Error);
           options.errorHandler?.(error as Error);

           if (options.stopOnError) {
             throw error;
           }
         }
       })
     );

     if (errors.length > 0) {
       throw new AggregateError(errors, `${errors.length} tasks failed`);
     }

     return results;
   }
   ```

3. Progress monitoring:

   ```typescript
   class ProgressTracker {
     private completed = 0;
     private readonly total: number;
     private readonly onProgress: (progress: Progress) => void;

     constructor(total: number, onProgress: (progress: Progress) => void) {
       this.total = total;
       this.onProgress = onProgress;
     }

     increment(): void {
       this.completed++;
       this.notifyProgress();
     }

     private notifyProgress(): void {
       this.onProgress({
         completed: this.completed,
         total: this.total,
         percentage: (this.completed / this.total) * 100,
       });
     }
   }
   ```

4. Cancellation support:

   ```typescript
   class CancellableTaskRunner {
     private abortController = new AbortController();

     async runTasks<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
       const { signal } = this.abortController;

       return Promise.all(
         tasks.map(async (task) => {
           if (signal.aborted) {
             throw new Error('Operation cancelled');
           }

           const result = await task();

           if (signal.aborted) {
             throw new Error('Operation cancelled');
           }

           return result;
         })
       );
     }

     cancel(): void {
       this.abortController.abort();
     }
   }
   ```
