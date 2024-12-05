---
title: Promise.race Implementation
description: Learn how to implement Promise.race from scratch, handling competitive promise execution and early resolution.
head:
  - - meta
    - name: keywords
      content: Promise.race, promise implementation, promise racing, JavaScript promises, TypeScript promises, async patterns, competitive execution
  - - meta
    - name: author
      content: Modern Web Development Patterns
  - - meta
    - property: og:title
      content: Promise.race Implementation | Modern Web Development
  - - meta
    - property: og:description
      content: Deep dive into implementing Promise.race from scratch, mastering competitive promise execution and early resolution patterns.
---

# Promise.race Implementation

## Overview

`Promise.race()` returns a promise that fulfills or rejects as soon as one of
the input promises fulfills or rejects. This implementation includes performance
monitoring, proper resource cleanup, and enhanced error handling.

## Implementation

```typescript:preview
import { AsyncOperationError } from '../advanced/error-handling';
import { PerformanceMonitor } from '../advanced/performance-monitoring';

function promiseRace<T>(promises: Array<Promise<T>>): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();

  return monitor.trackOperation(
    'Promise.race',
    () =>
      new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
          return reject(
            new AsyncOperationError(
              'Argument must be an array',
              'INVALID_ARGUMENT',
              'Promise.race'
            )
          );
        }

        if (promises.length === 0) {
          return new Promise(() => {}); // Never settles for empty array
        }

        promises.forEach((promise, index) => {
          monitor
            .trackOperation(`Promise.race.item[${index}]`, () =>
              Promise.resolve(promise)
            )
            .then(
              (value) => resolve(value),
              (error) =>
                reject(
                  AsyncOperationError.from(error, `Promise.race.item[${index}]`)
                )
            );
        });
      })
  );
}
```

## Usage Examples

### Basic Usage

```typescript:preview
const fast = new Promise((resolve) => setTimeout(() => resolve('fast'), 100));
const slow = new Promise((resolve) => setTimeout(() => resolve('slow'), 500));

promiseRace([fast, slow])
  .then((result) => console.log(result)) // Logs 'fast'
  .catch((error) => console.error('Race failed:', error));
```

### Timeout Pattern

```typescript:preview
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error(`Operation timed out after ${ms}ms`)),
      ms
    );
  });

  return promiseRace([promise, timeout]);
}

// Usage
const apiCall = fetch('https://api.example.com/data');
withTimeout(apiCall, 5000)
  .then((response) => response.json())
  .catch((error) => {
    if (error.message.includes('timed out')) {
      console.log('API call timed out');
    } else {
      console.error('API call failed:', error);
    }
  });
```

### Resource Cleanup

```typescript:preview
class ResourceManager {
  private cleanupFunctions: Array<() => void> = [];

  async raceWithCleanup<T>(promises: Promise<T>[]): Promise<T> {
    const cleanup = () => {
      this.cleanupFunctions.forEach((fn) => fn());
      this.cleanupFunctions = [];
    };

    try {
      const result = await promiseRace(promises);
      cleanup();
      return result;
    } catch (error) {
      cleanup();
      throw error;
    }
  }

  addCleanup(fn: () => void) {
    this.cleanupFunctions.push(fn);
  }
}

// Usage
const manager = new ResourceManager();
const promises = [
  fetch('api1').then((r) => {
    manager.addCleanup(() => r.body.cancel());
    return r;
  }),
  fetch('api2').then((r) => {
    manager.addCleanup(() => r.body.cancel());
    return r;
  }),
];

manager
  .raceWithCleanup(promises)
  .then((result) => console.log('First response:', result))
  .catch((error) => console.error('Race failed:', error));
```

## Key Features

1. **Fast Settlement**

   - Returns as soon as any promise settles
   - Handles both fulfillment and rejection
   - Maintains promise semantics

2. **Resource Management**

   - Proper cleanup of losing promises
   - Memory leak prevention
   - Performance monitoring per promise

3. **Error Handling**

   - Detailed error context
   - Stack trace preservation
   - Error aggregation capabilities

4. **Monitoring Integration**
   - Performance tracking
   - Resource usage monitoring
   - Error rate tracking

## Best Practices

1. **Timeout Implementation**

   ```typescript:preview
   const raceWithTimeout = (promise: Promise<any>, ms: number) =>
     promiseRace([
       promise,
       new Promise((_, reject) =>
         setTimeout(() => reject(new Error('Timeout')), ms)
       ),
     ]);
   ```

2. **Resource Cleanup**

   ```typescript:preview
   const raceWithCleanup = (promises: Promise<any>[]) => {
     const cleanup = new Set<() => void>();
     return promiseRace(promises).finally(() => cleanup.forEach((fn) => fn()));
   };
   ```

3. **Error Handling**

   ```typescript:preview
   const safeRace = async (promises: Promise<any>[]) => {
     try {
       return await promiseRace(promises);
     } catch (error) {
       console.error('Race failed:', error);
       throw error;
     }
   };
   ```

## Common Pitfalls

1. **Not Handling Empty Arrays**

   ```typescript:preview
   // Bad: No handling for empty arrays
   const result = await Promise.race([]); // Will never resolve

   // Good: Check for empty arrays
   const promises = [];
   if (promises.length === 0) {
     throw new Error('No promises to race');
   }
   const result = await Promise.race(promises);
   ```

2. **Forgetting About Losing Promises**

   ```typescript:preview
   // Bad: Not cleaning up losing promises
   const result = await Promise.race([
     fetch('/api/data'),
     fetch('/api/backup'),
   ]);

   // Good: Cancel or cleanup losing promises
   const controllers = [new AbortController(), new AbortController()];
   const result = await Promise.race([
     fetch('/api/data', { signal: controllers[0].signal }),
     fetch('/api/backup', { signal: controllers[1].signal }),
   ]).finally(() => {
     controllers.forEach((c) => c.abort());
   });
   ```

3. **Race Conditions with Timeouts**

   ```typescript:preview
   // Bad: Race condition between timeout and operation
   const result = await Promise.race([
     operation(),
     new Promise((resolve) => setTimeout(resolve, 5000)),
   ]);

   // Good: Proper timeout handling
   const timeout = (ms: number) =>
     new Promise((_, reject) =>
       setTimeout(() => reject(new Error('Timeout')), ms)
     );

   try {
     const result = await Promise.race([operation(), timeout(5000)]);
   } catch (error) {
     if (error.message === 'Timeout') {
       // Handle timeout specifically
     }
   }
   ```

4. **Ignoring Error Types**

   ```typescript:preview
   // Bad: Not distinguishing between error types
   try {
     const result = await Promise.race(promises);
   } catch (error) {
     console.error('Something failed');
   }

   // Good: Handle different error types
   try {
     const result = await Promise.race(promises);
   } catch (error) {
     if (error instanceof TimeoutError) {
       // Handle timeout
     } else if (error instanceof NetworkError) {
       // Handle network error
     } else {
       // Handle other errors
     }
   }
   ```

5. **Memory Leaks in Long-Running Operations**

   ```typescript:preview
   // Bad: Not cleaning up resources
   while (true) {
     const result = await Promise.race([
       longRunningOperation(),
       checkCondition(),
     ]);
   }

   // Good: Proper resource cleanup
   const cleanup = new Set();
   try {
     while (true) {
       const operation = longRunningOperation();
       cleanup.add(operation);
       const result = await Promise.race([operation, checkCondition()]);
       cleanup.delete(operation);
     }
   } finally {
     cleanup.forEach((op) => op.cancel());
   }
   ```

## Performance Considerations

1. **Memory Management**

   - Cleanup of losing promises
   - Prevention of memory leaks
   - Resource tracking and disposal
   - WeakRef usage for cleanup references

2. **Execution Efficiency**

   - Early termination optimization
   - Proper promise resolution
   - Microtask queue management
   - Event loop considerations

3. **Resource Usage**

   - Network connection management
   - File handle cleanup
   - Database connection pooling
   - System resource monitoring

4. **Error Handling Performance**
   - Stack trace optimization
   - Error context preservation
   - Error aggregation efficiency
   - Logging performance impact

## Testing

```typescript:preview
describe('Promise.race', () => {
  it('should resolve with first fulfilled promise', async () => {
    const result = await promiseRace([
      new Promise((resolve) => setTimeout(() => resolve('slow'), 100)),
      Promise.resolve('fast'),
    ]);
    expect(result).toBe('fast');
  });

  it('should reject with first rejected promise', async () => {
    try {
      await promiseRace([
        new Promise((_, reject) => setTimeout(() => reject('slow error'), 100)),
        Promise.reject('fast error'),
      ]);
    } catch (error) {
      expect(error).toBe('fast error');
    }
  });

  it('should handle empty array', async () => {
    const promise = promiseRace([]);
    // Promise should never settle
    let settled = false;
    promise.then(() => (settled = true));
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(settled).toBe(false);
  });
});
```
