---
title: Promise.allSettled Implementation
description: Learn how to implement Promise.allSettled from scratch, handling both fulfilled and rejected promises in parallel execution.
head:
  - - meta
    - name: keywords
      content: Promise.allSettled, promise implementation, parallel promises, JavaScript promises, TypeScript promises, async patterns, promise status
  - - meta
    - name: author
      content: Modern Web Development Patterns
  - - meta
    - property: og:title
      content: Promise.allSettled Implementation | Modern Web Development
  - - meta
    - property: og:description
      content: Deep dive into implementing Promise.allSettled from scratch, mastering promise status handling and result aggregation.
---

# Promise.allSettled Implementation

## Overview

`Promise.allSettled()` returns a promise that resolves after all of the given
promises have either fulfilled or rejected, with an array of objects that each
describes the outcome of each promise. This implementation includes performance
monitoring and enhanced error handling.

## Implementation

::: code-with-tooltips

```typescript
import { AsyncOperationError } from '../advanced/error-handling';
import { PerformanceMonitor } from '../advanced/performance-monitoring';

type SettledResult<T> =
  | { status: 'fulfilled'; value: T }
  | { status: 'rejected'; reason: any };

function promiseAllSettled<T>(
  promises: Array<Promise<T>>
): Promise<Array<SettledResult<T>>> {
  const monitor = PerformanceMonitor.getInstance();

  return monitor.trackOperation(
    'Promise.allSettled',
    () =>
      new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
          return reject(
            new AsyncOperationError(
              'Argument must be an array',
              'INVALID_ARGUMENT',
              'Promise.allSettled'
            )
          );
        }

        const results: SettledResult<T>[] = new Array(promises.length);
        let completed = 0;

        if (promises.length === 0) {
          resolve(results);
          return;
        }

        promises.forEach((promise, index) => {
          monitor
            .trackOperation(`Promise.allSettled.item[${index}]`, () =>
              Promise.resolve(promise)
            )
            .then(
              (value) => {
                results[index] = {
                  status: 'fulfilled',
                  value,
                };
                completed++;
                if (completed === promises.length) {
                  resolve(results);
                }
              },
              (reason) => {
                results[index] = {
                  status: 'rejected',
                  reason,
                };
                completed++;
                if (completed === promises.length) {
                  resolve(results);
                }
              }
            );
        });
      })
  );
}
```

:::

## Usage Examples

### Basic Usage

::: code-with-tooltips

```typescript
const promises = [
  Promise.resolve(1),
  Promise.reject('Error'),
  Promise.resolve(3),
];

promiseAllSettled(promises).then((results) => {
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Promise ${index} fulfilled with ${result.value}`);
    } else {
      console.log(`Promise ${index} rejected with ${result.reason}`);
    }
  });
});
```

:::

### Error Analysis

::: code-with-tooltips

```typescript
async function analyzeOperations(operations: Array<Promise<any>>) {
  const results = await promiseAllSettled(operations);

  const summary = {
    total: results.length,
    succeeded: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
    errors: results
      .filter(
        (r): r is { status: 'rejected'; reason: Error } =>
          r.status === 'rejected'
      )
      .map((r) => r.reason),
  };

  console.log('Operations Summary:', summary);
  return summary;
}

// Usage
analyzeOperations([
  fetch('api/data1'),
  fetch('api/data2'),
  fetch('api/data3'),
]).then((summary) => {
  if (summary.failed > 0) {
    console.error('Some operations failed:', summary.errors);
  }
});
```

:::

### Batch Processing

::: code-with-tooltips

```typescript
class BatchProcessor {
  async processBatch<T>(
    items: T[],
    operation: (item: T) => Promise<any>,
    batchSize: number = 5
  ) {
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchPromises = batch.map((item) => operation(item));

      const batchResults = await promiseAllSettled(batchPromises);
      results.push(...batchResults);

      // Analysis after each batch
      const failedInBatch = batchResults.filter((r) => r.status === 'rejected');
      if (failedInBatch.length > 0) {
        console.warn(
          `Batch ${i / batchSize} had ${failedInBatch.length} failures`
        );
      }
    }

    return results;
  }
}

// Usage
const processor = new BatchProcessor();
const items = ['item1', 'item2', 'item3', 'item4', 'item5'];
processor.processBatch(items, (item) =>
  fetch(`api/${item}`).then((r) => r.json())
);
```

:::

## Key Features

1. **Complete Resolution**

   - Waits for all promises to settle
   - Collects both successes and failures
   - Maintains promise order

2. **Result Tracking**

   - Detailed status for each promise
   - Type-safe result handling
   - Comprehensive error collection

3. **Performance Monitoring**

   - Individual promise tracking
   - Batch completion metrics
   - Resource usage monitoring

4. **Error Handling**
   - Never rejects
   - Preserves all error contexts
   - Structured error reporting

## Best Practices

1. **Type Safety**

   ```typescript
   type Result<T> = SettledResult<T>;

   function processResults<T>(results: Result<T>[]) {
     const successes = results
       .filter(
         (r): r is { status: 'fulfilled'; value: T } => r.status === 'fulfilled'
       )
       .map((r) => r.value);

     const failures = results
       .filter(
         (r): r is { status: 'rejected'; reason: any } =>
           r.status === 'rejected'
       )
       .map((r) => r.reason);

     return { successes, failures };
   }
   ```

2. **Resource Management**

   ```typescript
   async function withResources<T>(
     promises: Promise<T>[],
     cleanup: (results: SettledResult<T>[]) => void
   ) {
     const results = await promiseAllSettled(promises);
     try {
       return processResults(results);
     } finally {
       cleanup(results);
     }
   }
   ```

3. **Progress Tracking**

   ```typescript
   function withProgress<T>(promises: Promise<T>[]) {
     let completed = 0;
     const total = promises.length;

     return promiseAllSettled(
       promises.map((p) =>
         p.finally(() => {
           completed++;
           console.log(`Progress: ${completed}/${total}`);
         })
       )
     );
   }
   ```

## Common Pitfalls

1. **Not Checking Result Status**

   ```typescript
   // Bad: Assuming all results are fulfilled
   const results = await Promise.allSettled(promises);
   results.forEach((result) => console.log(result.value));

   // Good: Check status before accessing value
   const results = await Promise.allSettled(promises);
   results.forEach((result) => {
     if (result.status === 'fulfilled') {
       console.log(result.value);
     } else {
       console.error(result.reason);
     }
   });
   ```

2. **Memory Management with Large Arrays**

   ```typescript
   // Bad: Processing all results at once
   const results = await Promise.allSettled(largeArrayOfPromises);
   const processedResults = results.map(processResult);

   // Good: Process in chunks
   const results = await Promise.allSettled(largeArrayOfPromises);
   for (let i = 0; i < results.length; i += 100) {
     const chunk = results.slice(i, i + 100);
     await processResultsChunk(chunk);
   }
   ```

3. **Not Handling Empty Arrays**

   ```typescript
   // Bad: No validation for empty input
   const results = await Promise.allSettled([]);

   // Good: Validate input
   if (promises.length === 0) {
     console.warn('No promises to settle');
     return [];
   }
   const results = await Promise.allSettled(promises);
   ```

4. **Incorrect Error Aggregation**

   ```typescript
   // Bad: Lost error context
   const results = await Promise.allSettled(promises);
   const errors = results
     .filter((r) => r.status === 'rejected')
     .map((r) => r.reason);

   // Good: Preserve error context
   const results = await Promise.allSettled(promises);
   const errors = results
     .filter((r) => r.status === 'rejected')
     .map((r) => ({
       error: r.reason,
       index: results.indexOf(r),
       timestamp: new Date(),
     }));
   ```

5. **Resource Management**

   ```typescript
   // Bad: Not cleaning up resources
   const results = await Promise.allSettled([fetch(url1), fetch(url2)]);

   // Good: Proper resource cleanup
   const controllers = [new AbortController(), new AbortController()];
   try {
     const results = await Promise.allSettled([
       fetch(url1, { signal: controllers[0].signal }),
       fetch(url2, { signal: controllers[1].signal }),
     ]);
   } finally {
     controllers.forEach((c) => c.abort());
   }
   ```

## Performance Considerations

1. **Memory Management**

   - Results array pre-allocation
   - Efficient status tracking
   - Resource cleanup strategies
   - Memory usage monitoring

2. **Execution Efficiency**

   - Parallel promise execution
   - Status tracking optimization
   - Result collection efficiency
   - Error handling performance

3. **Resource Usage**

   - Network connection pooling
   - File handle management
   - Database connection handling
   - System resource monitoring

4. **Monitoring and Metrics**
   - Success/failure ratios
   - Execution time tracking
   - Resource usage patterns
   - Error frequency analysis

## Testing

::: code-with-tooltips

```typescript
describe('Promise.allSettled', () => {
  it('should handle mixed success and failure', async () => {
    const results = await promiseAllSettled([
      Promise.resolve(1),
      Promise.reject('error'),
      Promise.resolve(3),
    ]);

    expect(results).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: 'error' },
      { status: 'fulfilled', value: 3 },
    ]);
  });

  it('should handle empty array', async () => {
    const results = await promiseAllSettled([]);
    expect(results).toEqual([]);
  });

  it('should preserve order', async () => {
    const results = await promiseAllSettled([
      new Promise((resolve) => setTimeout(() => resolve(1), 100)),
      Promise.resolve(2),
    ]);

    expect(results[0].status).toBe('fulfilled');
    expect(results[0].value).toBe(1);
    expect(results[1].status).toBe('fulfilled');
    expect(results[1].value).toBe(2);
  });
});
```

:::
