---
title: Custom Promise Implementation Guide
description: Learn how to create and implement custom Promise wrappers. Master advanced Promise patterns with practical TypeScript examples.
date: 2024-12-01
author: Underwood Inc
tags:
  - Promises
  - Custom Implementations
  - TypeScript
  - Async Programming
  - Error Handling
  - Advanced JavaScript
category: examples
image: /web-patterns/images/custom-promises-banner.png
---

# Custom Promise Usage Examples

Learn how to create and use custom Promise wrappers for better control over asynchronous operations.

```typescript:preview
// Custom Promise wrapper for timeout
class TimeoutPromise extends Promise<void> {
  private timeoutId: number | null = null;

  constructor(timeout: number) {
    super((resolve, reject) => {
      this.timeoutId = setTimeout(() => {
        resolve();
        this.timeoutId = null;
      }, timeout);
    });
  }

  cancel() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// Usage example
const timeout = new TimeoutPromise(1000);
timeout.then(() => console.log('Timeout completed'));
// Can be cancelled before completion
// timeout.cancel();
```

## Additional Examples

### Cancellable Promise

```typescript:preview
class CancellablePromise<T> {
  private promise: Promise<T>;
  private reject: ((reason?: any) => void) | null = null;

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      executor(resolve, reject);
    });
  }

  cancel(reason = 'Promise cancelled') {
    if (this.reject) {
      this.reject(new Error(reason));
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<T | TResult> {
    return this.promise.catch(onrejected);
  }
}
```

### Retryable Promise

```typescript:preview
class RetryablePromise<T> {
  constructor(
    private executor: () => Promise<T>,
    private maxRetries: number = 3,
    private delay: number = 1000
  ) {}

  async execute(): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await this.executor();
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.delay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError;
  }
}
```
