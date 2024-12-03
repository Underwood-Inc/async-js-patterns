# Promise.resolve and Promise.reject Implementation

## Overview

`Promise.resolve()` and `Promise.reject()` are static methods that create
resolved or rejected promises respectively. This implementation includes
performance monitoring, proper error handling, and support for thenable objects.

## Implementation

```typescript
import { AsyncOperationError } from '../advanced/error-handling';
import { PerformanceMonitor } from '../advanced/performance-monitoring';

function promiseResolve<T>(value?: T | PromiseLike<T>): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();

  return monitor.trackOperation('Promise.resolve', () => {
    if (value instanceof Promise) {
      return value;
    }

    if (value && typeof value === 'object' && 'then' in value) {
      return new Promise((resolve, reject) => {
        try {
          (value as PromiseLike<T>).then(resolve, reject);
        } catch (error) {
          reject(AsyncOperationError.from(error, 'Promise.resolve.thenable'));
        }
      });
    }

    return new Promise((resolve) => resolve(value as T));
  });
}

function promiseReject<T = never>(reason?: any): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();

  return monitor.trackOperation(
    'Promise.reject',
    () =>
      new Promise((_, reject) => {
        reject(
          reason instanceof Error
            ? AsyncOperationError.from(reason, 'Promise.reject')
            : new AsyncOperationError(
                String(reason),
                'REJECTION',
                'Promise.reject'
              )
        );
      })
  );
}
```

## Usage Examples

### Basic Usage

```typescript
// Promise.resolve examples
const immediate = Promise.resolve(42);
const deferred = Promise.resolve(Promise.resolve('nested'));
const thenable = Promise.resolve({
  then(resolve) {
    setTimeout(() => resolve('delayed'), 1000);
  },
});

// Promise.reject examples
const error = Promise.reject(new Error('Failed'));
const reason = Promise.reject('Invalid input');
```

### Error Handling

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

async function validateData(data: any) {
  if (!data) {
    return Promise.reject(
      new ValidationError('Data is required', 'MISSING_DATA')
    );
  }

  if (typeof data !== 'object') {
    return Promise.reject(
      new ValidationError('Data must be an object', 'INVALID_TYPE')
    );
  }

  return Promise.resolve(data);
}

// Usage
validateData(null)
  .then((data) => console.log('Valid:', data))
  .catch((error) => {
    if (error instanceof ValidationError) {
      console.error(`Validation failed (${error.code}):`, error.message);
    } else {
      console.error('Unknown error:', error);
    }
  });
```

### Thenable Objects

```typescript
class AsyncResult<T> {
  constructor(
    private value: T,
    private delay: number = 0
  ) {}

  then<TResult>(
    onFulfilled: (value: T) => TResult | PromiseLike<TResult>
  ): Promise<TResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(onFulfilled(this.value));
      }, this.delay);
    });
  }
}

// Usage
const result = new AsyncResult('Hello', 1000);
Promise.resolve(result).then((value) => console.log(value)); // Logs 'Hello' after 1 second
```

## Key Features

1. **Value Resolution**

   - Immediate value wrapping
   - Promise passthrough
   - Thenable object support
   - Type preservation

2. **Error Handling**

   - Error wrapping
   - Type checking
   - Context preservation
   - Stack trace maintenance

3. **Performance Monitoring**

   - Resolution timing
   - Error tracking
   - Resource usage
   - Chain optimization

4. **Type Safety**
   - Generic type support
   - Thenable type checking
   - Error type preservation
   - Chain type inference

## Best Practices

1. **Error Creation**

   ```typescript
   // Create specific error types
   class DomainError extends Error {
     constructor(
       message: string,
       public readonly domain: string
     ) {
       super(message);
       this.name = 'DomainError';
     }
   }

   // Use specific errors
   function handleError(domain: string, message: string) {
     return Promise.reject(new DomainError(message, domain));
   }
   ```

2. **Value Wrapping**

   ```typescript
   // Safe value wrapping
   function wrapValue<T>(value: T | PromiseLike<T>): Promise<T> {
     try {
       return Promise.resolve(value);
     } catch (error) {
       return Promise.reject(error);
     }
   }
   ```

3. **Type Safety**
   ```typescript
   // Type-safe promise creation
   function createTypedPromise<T>(
     value: T,
     validate: (value: T) => boolean
   ): Promise<T> {
     return validate(value)
       ? Promise.resolve(value)
       : Promise.reject(new Error('Validation failed'));
   }
   ```

## Common Pitfalls

1. **Not Handling Thenable Errors**

   ```typescript
   // Bad: Unsafe thenable handling
   const thenable = {
     then(resolve) {
       throw new Error('Unexpected');
     },
   };
   Promise.resolve(thenable); // Uncaught error

   // Good: Safe thenable handling
   const thenable = {
     then(resolve) {
       throw new Error('Unexpected');
     },
   };
   Promise.resolve(thenable).catch((error) =>
     console.error('Thenable failed:', error)
   );
   ```

2. **Incorrect Error Types**

   ```typescript
   // Bad: Using non-error objects
   Promise.reject('something went wrong');

   // Good: Using proper error objects
   Promise.reject(new Error('something went wrong'));
   ```

3. **Double Wrapping**

   ```typescript
   // Bad: Unnecessary promise wrapping
   const promise = Promise.resolve(Promise.resolve(value));

   // Good: Direct resolution
   const promise = Promise.resolve(value);
   ```

4. **Lost Error Context**

   ```typescript
   // Bad: Error context lost
   Promise.reject(new Error('Failed')).catch(() => Promise.reject('Failed'));

   // Good: Error context preserved
   Promise.reject(new Error('Failed')).catch((error) => Promise.reject(error));
   ```

5. **Async Function Confusion**

   ```typescript
   // Bad: Mixing async/await with Promise.resolve
   async function getData() {
     return Promise.resolve(await fetchData());
   }

   // Good: Simplified async/await
   async function getData() {
     return await fetchData();
   }
   ```

## Performance Considerations

1. **Memory Management**

   - Value wrapping efficiency
   - Error object creation
   - Context preservation
   - Chain optimization

2. **Execution Efficiency**

   - Resolution timing
   - Error handling costs
   - Chain maintenance
   - Type checking overhead

3. **Resource Usage**

   - Error stack traces
   - Memory allocation
   - Chain length
   - Context tracking

4. **Error Handling**
   - Stack trace generation
   - Error wrapping costs
   - Context preservation
   - Type checking

## Testing

```typescript
describe('Promise.resolve and Promise.reject', () => {
  describe('Promise.resolve', () => {
    it('should resolve with value', async () => {
      const result = await Promise.resolve(42);
      expect(result).toBe(42);
    });

    it('should handle thenables', async () => {
      const thenable = {
        then(resolve) {
          resolve('thenable');
        },
      };
      const result = await Promise.resolve(thenable);
      expect(result).toBe('thenable');
    });

    it('should pass through promises', async () => {
      const original = Promise.resolve('original');
      const result = await Promise.resolve(original);
      expect(result).toBe('original');
    });
  });

  describe('Promise.reject', () => {
    it('should reject with error', async () => {
      try {
        await Promise.reject(new Error('Failed'));
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failed');
      }
    });

    it('should wrap non-error values', async () => {
      try {
        await Promise.reject('Failed');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failed');
      }
    });
  });
});
```
