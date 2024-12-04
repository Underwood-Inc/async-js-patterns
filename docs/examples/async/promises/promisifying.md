# Promisifying Examples

Learn how to convert callback-based APIs into Promise-based ones.

## Basic Usage

```typescript
// Basic promisification
function promisify<T>(
  fn: (callback: (error: Error | null, result?: T) => void) => void
): () => Promise<T> {
  return () =>
    new Promise((resolve, reject) => {
      fn((error, result) => {
        if (error) reject(error);
        else resolve(result!);
      });
    });
}

// Example with setTimeout
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Example with Node.js fs
const readFileAsync = (path: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
```

## Advanced Patterns

### Generic Promisification

```typescript
type Callback<T> = (error: Error | null, result?: T) => void;

function promisifyGeneric<T, A extends any[]>(
  fn: (...args: [...A, Callback<T>]) => void
): (...args: A) => Promise<T> {
  return (...args: A) =>
    new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) reject(error);
        else resolve(result!);
      });
    });
}

// Usage example
const readFile = promisifyGeneric(fs.readFile);
const writeFile = promisifyGeneric(fs.writeFile);
```

### Class Method Promisification

```typescript
function promisifyMethod<T, A extends any[]>(
  target: any,
  method: string
): (...args: A) => Promise<T> {
  const original = target[method];

  return (...args: A) =>
    new Promise((resolve, reject) => {
      original.call(target, ...args, (error: Error | null, result?: T) => {
        if (error) reject(error);
        else resolve(result!);
      });
    });
}

// Usage example
class Database {
  query(
    sql: string,
    callback: (error: Error | null, results?: any[]) => void
  ): void {
    // Implementation...
  }
}

const db = new Database();
const queryAsync = promisifyMethod(db, 'query');
```

### Event Emitter Promisification

```typescript
function promisifyEvent(
  emitter: EventEmitter,
  eventName: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    function handler(data: any) {
      cleanup();
      resolve(data);
    }

    function errorHandler(error: Error) {
      cleanup();
      reject(error);
    }

    function cleanup() {
      emitter.removeListener(eventName, handler);
      emitter.removeListener('error', errorHandler);
    }

    emitter.on(eventName, handler);
    emitter.on('error', errorHandler);
  });
}

// Usage example
async function waitForEvent(emitter: EventEmitter, event: string) {
  try {
    const data = await promisifyEvent(emitter, event);
    console.log(`Event ${event} occurred with data:`, data);
  } catch (error) {
    console.error(`Error waiting for ${event}:`, error);
  }
}
```

### Batch Promisification

```typescript
type AsyncFunction<T> = (...args: any[]) => Promise<T>;

function promisifyAll<T extends object>(
  obj: T,
  suffix: string = 'Async'
): T & Record<string, AsyncFunction<any>> {
  const result = { ...obj } as T & Record<string, AsyncFunction<any>>;

  Object.getOwnPropertyNames(obj).forEach((key) => {
    const value = (obj as any)[key];

    if (typeof value === 'function' && !key.endsWith(suffix)) {
      result[`${key}${suffix}`] = promisifyGeneric(value);
    }
  });

  return result;
}

// Usage example
const fs = require('fs');
const fsAsync = promisifyAll(fs);

async function example() {
  const data = await fsAsync.readFileAsync('file.txt', 'utf8');
  await fsAsync.writeFileAsync('output.txt', data.toUpperCase());
}
```

### Promisification with Cancellation

```typescript
interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}

function promisifyWithCancel<T>(
  fn: (callback: (error: Error | null, result?: T) => void) => () => void
): () => CancellablePromise<T> {
  return () => {
    let cleanup: (() => void) | null = null;

    const promise = new Promise<T>((resolve, reject) => {
      cleanup = fn((error, result) => {
        if (error) reject(error);
        else resolve(result!);
      });
    }) as CancellablePromise<T>;

    promise.cancel = () => {
      if (cleanup) cleanup();
    };

    return promise;
  };
}

// Usage example
const cancellableTimeout = promisifyWithCancel<void>((callback) => {
  const timeoutId = setTimeout(() => callback(null), 1000);
  return () => clearTimeout(timeoutId);
});
```
