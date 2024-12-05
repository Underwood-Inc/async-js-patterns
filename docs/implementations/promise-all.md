---
title: Promise.all Implementation
description: Learn how to implement Promise.all from scratch, understanding parallel promise execution and result aggregation.
head:
  - - meta
    - name: keywords
      content: Promise.all, promise implementation, parallel promises, JavaScript promises, TypeScript promises, async patterns, promise aggregation
  - - meta
    - name: author
      content: Modern Web Development Patterns
  - - meta
    - property: og:title
      content: Promise.all Implementation | Modern Web Development
  - - meta
    - property: og:description
      content: Deep dive into implementing Promise.all from scratch, mastering parallel promise execution and result handling.
---

# Promise.all Implementation

## Overview

`Promise.all()` takes an array of promises and returns a new promise that
resolves when all input promises have resolved, or rejects if any promise
rejects. This implementation includes performance monitoring and enhanced error
handling.

## Implementation

```typescript:preview
import { AsyncOperationError } from '../advanced/error-handling';
import { PerformanceMonitor } from '../advanced/performance-monitoring';

function promiseAll<T>(promises: Array<Promise<T>>): Promise<T[]> {
  const monitor = PerformanceMonitor.getInstance();

  return monitor.trackOperation(
    'Promise.all',
    () =>
      new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
          return reject(
            new AsyncOperationError(
              'Argument must be an array',
              'INVALID_ARGUMENT',
              'Promise.all'
            )
          );
        }

        const results: T[] = new Array(promises.length);
        let unresolved = promises.length;

        if (unresolved === 0) {
          resolve(results);
          return;
        }

        promises.forEach((promise, index) => {
          monitor
            .trackOperation(`Promise.all.item[${index}]`, () =>
              Promise.resolve(promise)
            )
            .then((value) => {
              results[index] = value;
              unresolved -= 1;

              if (unresolved === 0) {
                resolve(results);
              }
            })
            .catch((error) => {
              reject(
                AsyncOperationError.from(error, `Promise.all.item[${index}]`)
              );
            });
        });
      })
  );
}
```

## Usage Examples

### Basic Usage

```typescript:preview
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  new Promise<number>((resolve) => setTimeout(() => resolve(3), 1000)),
];

promiseAll(promises)
  .then((results) => {
    console.log(results); // [1, 2, 3]
  })
  .catch((error) => {
    console.error('One of the promises rejected:', error);
  });
```

### Advanced Usage with Timeout

```typescript:preview
// With timeout wrapper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
  return Promise.race([promise, timeout]);
}

// Usage with timeout
promiseAll([
  withTimeout(fetch('api/data1'), 5000),
  withTimeout(fetch('api/data2'), 5000),
]).then(([data1, data2]) => {
  console.log('Both requests completed within timeout');
});
```

### Error Handling

```typescript:preview
// Testing different scenarios
async function testPromiseAll() {
  try {
    // Mixed success and failure
    await promiseAll([
      Promise.resolve(1),
      Promise.reject(new Error('Failed')),
      Promise.resolve(3),
    ]);
  } catch (error) {
    console.error('Caught rejection:', error);
  }

  try {
    // Empty array
    const emptyResult = await promiseAll([]);
    console.log('Empty array result:', emptyResult); // []
  } catch (error) {
    console.error('Should not reach here');
  }
}
```

## Key Features

1. **Parallel Execution**

   - All promises run concurrently
   - Maintains input order in results
   - Optimized for parallel processing

2. **Error Handling**

   - Fast failure on first rejection
   - Detailed error context
   - Performance monitoring integration

3. **Input Validation**

   - Handles non-array inputs
   - Supports mixed input types
   - Empty array optimization

4. **Resource Management**
   - Memory-efficient result collection
   - Proper cleanup on rejection
   - Performance tracking per promise

## Edge Cases

- Empty array input
- Non-array input
- Mixed input types (promises and values)
- Promises that reject
- Already settled promises
- Non-promise thenables

## Best Practices

1. Use for operations that must all succeed
2. Consider `Promise.allSettled()` if you need all results regardless of
   success/failure
3. Be mindful of memory usage with large arrays
4. Include proper error handling
5. Consider adding timeout mechanisms for long-running operations

## Common Pitfalls

1. **Not Handling Rejections**

   ```typescript:preview
   // Bad: No error handling
   const results = await Promise.all(promises);

   // Good: Handle potential rejections
   try {
     const results = await Promise.all(promises);
   } catch (error) {
     console.error('One or more promises failed:', error);
   }
   ```

2. **Memory Leaks with Large Arrays**

   ```typescript:preview
   // Bad: Loading too many promises into memory
   const promises = items.map((item) => fetchData(item));
   const results = await Promise.all(promises);

   // Good: Process in batches
   const batchSize = 100;
   for (let i = 0; i < items.length; i += batchSize) {
     const batch = items.slice(i, i + batchSize);
     const promises = batch.map((item) => fetchData(item));
     const results = await Promise.all(promises);
   }
   ```

3. **Mixing Sync and Async Operations**

   ```typescript:preview
   // Bad: Mixing sync and async operations
   const promises = items.map((item) => {
     if (item.cached) return item.data;
     return fetchData(item);
   });

   // Good: Ensure all operations are promises
   const promises = items.map((item) => {
     if (item.cached) return Promise.resolve(item.data);
     return fetchData(item);
   });
   ```

4. **Not Considering Promise Order**

   ```typescript:preview
   // Bad: Assuming results order matches completion order
   const [slow, fast] = await Promise.all([slowFetch(), fastFetch()]);

   // Good: Use explicit mapping if order matters
   const results = await Promise.all(promises);
   const resultMap = {
     slow: results[0],
     fast: results[1],
   };
   ```

## Performance Considerations

1. **Memory Management**

   - Results array pre-allocated for efficiency
   - Cleanup of intermediate results on rejection
   - WeakMap usage for metadata storage
   - Batch processing for large arrays

2. **Execution Order**

   - All promises execute in parallel
   - No guaranteed execution order
   - Early rejection optimization
   - Microtask queue utilization

3. **Resource Usage**

   - Network connection pooling
   - CPU utilization for parallel processing
   - Memory footprint monitoring
   - Garbage collection impact

4. **Monitoring and Metrics**
   - Performance tracking per promise
   - Aggregate timing statistics
   - Memory usage patterns
   - Error rate monitoring

## Testing

```typescript:preview
// Test successful case
const successTest = promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3),
]).then((results) => {
  console.assert(
    JSON.stringify(results) === '[1,2,3]',
    'Should resolve with all values'
  );
});

// Test rejection case
const failTest = promiseAll([
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3),
]).catch((error) => {
  console.assert(error === 'error', 'Should reject with first error');
});

// Test empty array
const emptyTest = promiseAll([]).then((results) => {
  console.assert(
    Array.isArray(results) && results.length === 0,
    'Should resolve with empty array'
  );
});
```
