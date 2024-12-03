# Promise.any Implementation

## Overview

`Promise.any()` returns a promise that fulfills when any of the input promises
fulfills, with the value of the fulfilled promise. If all promises are rejected,
it rejects with an AggregateError containing all rejection reasons. This
implementation includes performance monitoring and enhanced error handling.

## Implementation

```typescript
import { AsyncOperationError } from '../advanced/error-handling';
import { PerformanceMonitor } from '../advanced/performance-monitoring';

function promiseAny<T>(promises: Array<Promise<T>>): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();

  return monitor.trackOperation(
    'Promise.any',
    () =>
      new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
          return reject(
            new AsyncOperationError(
              'Argument must be an array',
              'INVALID_ARGUMENT',
              'Promise.any'
            )
          );
        }

        if (promises.length === 0) {
          reject(new AggregateError([], 'All promises were rejected'));
          return;
        }

        let rejectedCount = 0;
        const errors: any[] = new Array(promises.length);

        promises.forEach((promise, index) => {
          monitor
            .trackOperation(`Promise.any.item[${index}]`, () =>
              Promise.resolve(promise)
            )
            .then(
              (value) => resolve(value),
              (error) => {
                errors[index] = error;
                rejectedCount++;

                if (rejectedCount === promises.length) {
                  reject(
                    new AggregateError(errors, 'All promises were rejected')
                  );
                }
              }
            );
        });
      })
  );
}
```

## Usage Examples

### Basic Usage

```typescript
const promises = [
  Promise.reject(new Error('First failure')),
  Promise.resolve('Success!'),
  Promise.reject(new Error('Second failure')),
];

promiseAny(promises)
  .then((result) => console.log(result)) // Logs: 'Success!'
  .catch((error) => {
    if (error instanceof AggregateError) {
      console.error('All promises failed:', error.errors);
    }
  });
```

### Fallback Pattern

```typescript
const fetchWithFallback = async (urls: string[]) => {
  try {
    const response = await promiseAny(
      urls.map((url) =>
        fetch(url).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r;
        })
      )
    );
    return await response.json();
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('All endpoints failed:', error.errors);
    }
    throw error;
  }
};

// Usage
fetchWithFallback([
  'https://api1.example.com/data',
  'https://api2.example.com/data',
  'https://api3.example.com/data',
])
  .then((data) => console.log('Data from first successful endpoint:', data))
  .catch((error) => console.error('All endpoints failed:', error));
```

### Error Aggregation

```typescript
class RetryError extends Error {
  constructor(public readonly attempts: Error[]) {
    super('All retry attempts failed');
    this.name = 'RetryError';
  }
}

async function withRetry<T>(
  operation: () => Promise<T>,
  attempts: number
): Promise<T> {
  const promises = Array(attempts)
    .fill(null)
    .map(() => operation());

  try {
    return await promiseAny(promises);
  } catch (error) {
    if (error instanceof AggregateError) {
      throw new RetryError(error.errors);
    }
    throw error;
  }
}

// Usage
const fetchWithRetry = withRetry(
  () => fetch('https://api.example.com/data'),
  3
);
```

## Key Features

1. **Success Prioritization**

   - Returns first successful result
   - Ignores rejections if any success
   - Continues execution until success

2. **Error Aggregation**

   - Collects all rejection reasons
   - AggregateError support
   - Detailed error context

3. **Performance Monitoring**

   - Tracks individual promises
   - Measures success/failure rates
   - Resource usage monitoring

4. **Resource Management**
   - Proper cleanup after success
   - Memory leak prevention
   - Efficient error collection

## Best Practices

1. **Error Handling**

   ```typescript
   try {
     const result = await promiseAny(promises);
     console.log('First success:', result);
   } catch (error) {
     if (error instanceof AggregateError) {
       console.error('All attempts failed:', error.errors);
     }
   }
   ```

2. **Resource Cleanup**

   ```typescript
   const withCleanup = (promises: Promise<any>[]) => {
     const cleanups = new Set<() => void>();
     return promiseAny(promises).finally(() =>
       cleanups.forEach((cleanup) => cleanup())
     );
   };
   ```

3. **Validation**

   ```typescript
   const validateResult = <T>(
     promises: Promise<T>[],
     isValid: (result: T) => boolean
   ) => {
     return promiseAny(
       promises.map((p) =>
         p.then((result) => {
           if (!isValid(result)) {
             throw new Error('Invalid result');
           }
           return result;
         })
       )
     );
   };
   ```

## Common Pitfalls

1. **Not Handling AggregateError**

   ```typescript
   // Bad: Generic error handling
   try {
     const result = await Promise.any(promises);
   } catch (error) {
     console.error('Failed');
   }

   // Good: Handle AggregateError specifically
   try {
     const result = await Promise.any(promises);
   } catch (error) {
     if (error instanceof AggregateError) {
       console.error('All promises failed:', error.errors);
       // Handle individual errors if needed
       error.errors.forEach((err) => handleError(err));
     }
   }
   ```

2. **Assuming First Success is Best**

   ```typescript
   // Bad: Taking first success without validation
   const result = await Promise.any([fetch('api1/data'), fetch('api2/data')]);

   // Good: Validate successful responses
   const result = await Promise.any([
     fetch('api1/data').then(validateResponse),
     fetch('api2/data').then(validateResponse),
   ]);
   ```

3. **Not Handling Empty Arrays**

   ```typescript
   // Bad: No empty array check
   const result = await Promise.any([]); // AggregateError

   // Good: Check array length
   if (promises.length === 0) {
     throw new Error('At least one promise is required');
   }
   const result = await Promise.any(promises);
   ```

4. **Resource Cleanup**

   ```typescript
   // Bad: Not cleaning up resources after first success
   const result = await Promise.any([
     expensiveOperation1(),
     expensiveOperation2(),
   ]);

   // Good: Cleanup remaining operations
   const controllers = [new AbortController(), new AbortController()];
   const result = await Promise.any([
     expensiveOperation1({ signal: controllers[0].signal }),
     expensiveOperation2({ signal: controllers[1].signal }),
   ]).finally(() => {
     controllers.forEach((c) => c.abort());
   });
   ```

5. **Ignoring Timing Issues**

   ```typescript
   // Bad: Not considering timing of rejections
   const result = await Promise.any([slowOperation(), fastOperation()]);

   // Good: Add timeouts to prevent long waits
   const withTimeout = (promise, ms) =>
     Promise.race([
       promise,
       new Promise((_, reject) =>
         setTimeout(() => reject(new Error('Timeout')), ms)
       ),
     ]);

   const result = await Promise.any([
     withTimeout(slowOperation(), 5000),
     withTimeout(fastOperation(), 5000),
   ]);
   ```

## Performance Considerations

1. **Memory Management**

   - Error collection optimization
   - Resource cleanup strategies
   - WeakRef for cleanup references
   - Efficient error aggregation

2. **Execution Efficiency**

   - Early success optimization
   - Proper promise resolution
   - Microtask queue management
   - Event loop impact

3. **Resource Usage**

   - Network connection pooling
   - File handle management
   - Database connection handling
   - System resource monitoring

4. **Error Handling Performance**
   - AggregateError creation efficiency
   - Stack trace management
   - Error collection strategies
   - Logging optimization

## Testing

```typescript
describe('Promise.any', () => {
  it('should resolve with first success', async () => {
    const result = await promiseAny([
      Promise.reject('Error 1'),
      Promise.resolve('Success'),
      Promise.reject('Error 2'),
    ]);
    expect(result).toBe('Success');
  });

  it('should reject with AggregateError when all fail', async () => {
    try {
      await promiseAny([Promise.reject('Error 1'), Promise.reject('Error 2')]);
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(AggregateError);
      expect(error.errors).toEqual(['Error 1', 'Error 2']);
    }
  });

  it('should handle empty array', async () => {
    try {
      await promiseAny([]);
      fail('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(AggregateError);
      expect(error.errors).toEqual([]);
    }
  });
});
```
