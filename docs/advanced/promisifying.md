# Promisifying

## Overview

Promisifying is the process of converting callback-based functions into Promise-based ones, enabling better async flow control and error handling. This technique helps modernize legacy code and provides a more consistent async programming model.

### Real-World Analogy

Think of promisifying like modernizing an old factory:

- Old machines (callbacks) work but are hard to coordinate
- New control systems (promises) provide better oversight
- The upgrade process (promisifying) maintains functionality
- Modern interfaces (async/await) make operations smoother
- Better error handling prevents production issues

### Common Use Cases

1. **Legacy API Integration**

   - Problem: Callback-based APIs in modern async code
   - Solution: Wrap callbacks in promises
   - Benefit: Consistent async/await usage

2. **Event to Promise Conversion**

   - Problem: Event-based APIs needing promise interfaces
   - Solution: Event wrapper promises
   - Benefit: Simplified async flow control

3. **Node.js API Modernization**
   - Problem: Callback-style Node.js functions
   - Solution: Util.promisify and custom wrappers
   - Benefit: Modern async/await syntax

### How It Works

1. **Function Wrapping**

   - Callback identification
   - Promise creation
   - Error handling setup

2. **Parameter Handling**

   - Argument processing
   - Context preservation
   - Type checking

3. **Error Management**

   - Error propagation
   - Type conversion
   - Stack trace preservation

4. **Result Processing**
   - Value transformation
   - Type conversion
   - Multi-value handling

## Implementation

```typescript:preview
type Callback<T> = (error: Error | null, result?: T) => void;
type AsyncFunction<T> = (callback: Callback<T>) => void;

function promisify<T>(fn: AsyncFunction<T>): () => Promise<T> {
  return function (): Promise<T> {
    return new Promise((resolve, reject) => {
      fn((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!);
        }
      });
    });
  };
}

// Version with parameters
function promisifyWithParams<T, P extends any[]>(
  fn: (...args: [...P, Callback<T>]) => void
): (...args: P) => Promise<T> {
  return function (...args: P): Promise<T> {
    return new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!);
        }
      });
    });
  };
}
```

## Usage Example

```typescript:preview
// Example with simple callback
function readFileCallback(callback: Callback<string>) {
  setTimeout(() => {
    callback(null, 'file contents');
  }, 1000);
}

const readFilePromise = promisify(readFileCallback);

// Usage
readFilePromise()
  .then((contents) => console.log(contents))
  .catch((error) => console.error(error));

// Example with parameters
function queryDatabaseCallback(
  query: string,
  params: any[],
  callback: Callback<any[]>
) {
  setTimeout(() => {
    callback(null, [{ id: 1, name: 'test' }]);
  }, 1000);
}

const queryDatabase = promisifyWithParams(queryDatabaseCallback);

// Usage
queryDatabase('SELECT * FROM users WHERE id = ?', [1])
  .then((results) => console.log(results))
  .catch((error) => console.error(error));
```

## Key Concepts

1. **Error-First Pattern**: Handles Node.js-style callbacks
2. **Type Safety**: Maintains TypeScript types through conversion
3. **Parameter Preservation**: Supports functions with multiple parameters
4. **Single Responsibility**: Each promisified function returns one promise

## Edge Cases

- Multiple callback invocations
- Callback with multiple success parameters
- Synchronous callbacks
- Memory leaks in long-running operations
- Error handling in the original function

## Common Pitfalls

1. **Memory Management**: Not cleaning up event listeners
2. **Error Propagation**: Lost stack traces
3. **Type Definition**: Incorrect TypeScript types
4. **Context Binding**: Lost `this` context

## Best Practices

1. Handle cleanup for long-running operations
2. Preserve error stack traces
3. Maintain proper typing
4. Document transformed APIs
5. Consider cancellation mechanisms

## Testing

```typescript:preview
// Test successful case
const successFn = (callback: Callback<number>) => {
  setTimeout(() => callback(null, 42), 100);
};

const promiseSuccess = promisify(successFn);
promiseSuccess().then((result) => {
  console.assert(result === 42, 'Should resolve with correct value');
});

// Test error case
const errorFn = (callback: Callback<never>) => {
  setTimeout(() => callback(new Error('Failed')), 100);
};

const promiseError = promisify(errorFn);
promiseError().catch((error) => {
  console.assert(error.message === 'Failed', 'Should reject with error');
});

// Test with parameters
const paramFn = (x: number, y: number, callback: Callback<number>) => {
  setTimeout(() => callback(null, x + y), 100);
};

const promiseParam = promisifyWithParams(paramFn);
promiseParam(2, 3).then((result) => {
  console.assert(result === 5, 'Should handle parameters correctly');
});
```

## Advanced Usage

```typescript:preview
// With cancellation support
interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}

function promisifyWithCancel<T>(
  fn: (callback: Callback<T>) => () => void
): () => CancellablePromise<T> {
  return function (): CancellablePromise<T> {
    let cleanup: (() => void) | null = null;

    const promise = new Promise<T>((resolve, reject) => {
      cleanup = fn((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!);
        }
      });
    }) as CancellablePromise<T>;

    promise.cancel = () => {
      if (cleanup) {
        cleanup();
      }
    };

    return promise;
  };
}

// Usage with cancellation
const longOperation = (callback: Callback<string>) => {
  const timeoutId = setTimeout(() => {
    callback(null, 'completed');
  }, 5000);

  return () => clearTimeout(timeoutId);
};

const promisifiedOp = promisifyWithCancel(longOperation);
const promise = promisifiedOp();

// Cancel after 2 seconds
setTimeout(() => {
  promise.cancel();
}, 2000);
```

## Utility Functions

```typescript:preview
// Promisify all methods of an object
function promisifyAll<T extends object>(obj: T): PromisifiedObject<T> {
  const result: any = {};

  for (const key of Object.keys(obj)) {
    const value = (obj as any)[key];
    if (typeof value === 'function') {
      result[`${key}Async`] = promisifyWithParams(value.bind(obj));
    }
  }

  return result as PromisifiedObject<T>;
}

type PromisifiedObject<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => void
    ? (
        ...args: A extends [...infer P, Callback<infer R>] ? P : never
      ) => Promise<R>
    : never;
};
```
