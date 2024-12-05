---
title: Custom Promise Implementation
description: Learn how to implement a custom Promise class from scratch in JavaScript and TypeScript, understanding the internals of Promises.
head:
  - - meta
    - name: keywords
      content: custom promise, promise implementation, JavaScript promises, TypeScript promises, async patterns, promise internals, promise mechanics
  - - meta
    - name: author
      content: Modern Web Development Patterns
  - - meta
    - property: og:title
      content: Custom Promise Implementation | Modern Web Development
  - - meta
    - property: og:description
      content: Deep dive into implementing a custom Promise class from scratch, understanding Promise mechanics and internals.
---

# Custom Promise Implementation

## Overview

Learn how to build your own Promise implementation from scratch. This guide
covers the core functionality of Promises, including state management, chaining,
and error handling.

## Implementation

```typescript:preview
class CustomPromise<T> {
  private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  private value: T | null = null;
  private error: any = null;
  private thenCallbacks: Array<(value: T) => any> = [];
  private catchCallbacks: Array<(error: any) => any> = [];
  private finallyCallbacks: Array<() => any> = [];

  constructor(
    executor: (
      resolve: (value: T) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    try {
      executor(
        (value) => this.resolve(value),
        (reason) => this.reject(reason)
      );
    } catch (error) {
      this.reject(error);
    }
  }

  private resolve(value: T): void {
    if (this.state !== 'pending') return;

    this.state = 'fulfilled';
    this.value = value;
    this.executeThenCallbacks();
    this.executeFinallyCallbacks();
  }

  private reject(reason: any): void {
    if (this.state !== 'pending') return;

    this.state = 'rejected';
    this.error = reason;
    this.executeCatchCallbacks();
    this.executeFinallyCallbacks();
  }

  private executeThenCallbacks(): void {
    if (this.state !== 'fulfilled') return;

    this.thenCallbacks.forEach((callback) => {
      try {
        callback(this.value!);
      } catch (error) {
        // Handle errors in callbacks
        console.error('Error in then callback:', error);
      }
    });
    this.thenCallbacks = [];
  }

  private executeCatchCallbacks(): void {
    if (this.state !== 'rejected') return;

    this.catchCallbacks.forEach((callback) => {
      try {
        callback(this.error);
      } catch (error) {
        console.error('Error in catch callback:', error);
      }
    });
    this.catchCallbacks = [];
  }

  private executeFinallyCallbacks(): void {
    this.finallyCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error('Error in finally callback:', error);
      }
    });
    this.finallyCallbacks = [];
  }

  then<U>(onFulfilled: (value: T) => U | PromiseLike<U>): CustomPromise<U> {
    return new CustomPromise<U>((resolve, reject) => {
      const callback = (value: T) => {
        try {
          const result = onFulfilled(value);
          if (result instanceof CustomPromise) {
            result
              .then((value) => resolve(value))
              .catch((error) => reject(error));
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === 'fulfilled') {
        callback(this.value!);
      } else {
        this.thenCallbacks.push(callback as any);
      }
    });
  }

  catch<U>(onRejected: (error: any) => U | PromiseLike<U>): CustomPromise<U> {
    return new CustomPromise<U>((resolve, reject) => {
      const callback = (error: any) => {
        try {
          const result = onRejected(error);
          if (result instanceof CustomPromise) {
            result
              .then((value) => resolve(value))
              .catch((error) => reject(error));
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === 'rejected') {
        callback(this.error);
      } else {
        this.catchCallbacks.push(callback as any);
      }
    });
  }

  finally(onFinally: () => void): CustomPromise<T> {
    if (this.state !== 'pending') {
      onFinally();
      return this;
    }

    this.finallyCallbacks.push(onFinally);
    return this;
  }

  // Static methods
  static resolve<U>(value: U): CustomPromise<U> {
    return new CustomPromise<U>((resolve) => resolve(value));
  }

  static reject<U>(reason: any): CustomPromise<U> {
    return new CustomPromise<U>((_, reject) => reject(reason));
  }
}
```

## Usage Examples

### Basic Usage

```typescript:preview
const promise = new CustomPromise<string>((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('Success!');
    } else {
      reject(new Error('Failed!'));
    }
  }, 1000);
});

promise
  .then((result) => {
    console.log('Success:', result);
    return result.toUpperCase();
  })
  .catch((error) => {
    console.error('Error:', error);
    return 'Recovered';
  })
  .finally(() => {
    console.log('Cleanup operations');
  });
```

### Chaining Promises

```typescript:preview
const fetchUser = (id: string) =>
  new CustomPromise<{ id: string; name: string }>((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'John Doe' });
    }, 1000);
  });

const fetchUserPosts = (userId: string) =>
  new CustomPromise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(['Post 1', 'Post 2', 'Post 3']);
    }, 1000);
  });

fetchUser('123')
  .then((user) => {
    console.log('User:', user);
    return fetchUserPosts(user.id);
  })
  .then((posts) => {
    console.log('Posts:', posts);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

### Error Handling

```typescript:preview
const validateUser = (user: { age: number }) =>
  new CustomPromise<string>((resolve, reject) => {
    if (user.age < 18) {
      reject(new Error('User must be 18 or older'));
    } else {
      resolve('User is valid');
    }
  });

validateUser({ age: 16 })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Validation failed:', error.message);
    // Handle the error gracefully
    return 'Invalid user';
  });
```

## Key Features

1. **State Management**

   - Maintains promise state (pending, fulfilled, rejected)
   - Ensures state transitions are one-way only
   - Stores resolved value or rejection reason

2. **Callback Handling**

   - Supports multiple then/catch/finally callbacks
   - Executes callbacks in order of registration
   - Handles errors in callbacks gracefully

3. **Promise Chaining**

   - Supports return values from then/catch callbacks
   - Handles nested promises automatically
   - Maintains proper error propagation

4. **Error Handling**
   - Catches synchronous errors in executor function
   - Supports error recovery in catch callbacks
   - Provides stack trace preservation

## Best Practices

1. **Error Handling**

   ```typescript:preview
   // Always catch potential errors
   promise.then(handleSuccess).catch(handleError).finally(cleanup);
   ```

2. **Type Safety**

   ```typescript:preview
   // Use TypeScript generics for type safety
   const promise = new CustomPromise<number>((resolve) => {
     resolve(42);
   });
   ```

3. **Resource Cleanup**

   ```typescript:preview
   // Use finally for cleanup operations
   const connection = await connect();
   processData(connection).finally(() => {
     connection.close();
   });
   ```

## Common Pitfalls

1. **Forgetting Error Handling**

   ```typescript:preview
   // Bad: No error handling
   promise.then(handleSuccess);

   // Good: With error handling
   promise.then(handleSuccess).catch(handleError);
   ```

2. **Nested Promise Chains**

   ```typescript:preview
   // Bad: Promise nesting
   promise.then((result) => {
     return anotherPromise().then((newResult) => {
       // More nesting
     });
   });

   // Good: Flat promise chain
   promise
     .then((result) => anotherPromise())
     .then((newResult) => {
       // Handle result
     });
   ```

3. **Losing Error Context**

   ```typescript:preview
   // Bad: Error context lost
   promise.catch(() => 'Error occurred');

   // Good: Preserve error context
   promise.catch((error) => {
     console.error('Original error:', error);
     return 'Error occurred';
   });
   ```

## Performance Considerations

1. **Memory Management**

   - Clear callback references after execution
   - Avoid storing unnecessary state
   - Use WeakMap for storing metadata if needed

2. **Execution Order**

   - Promises are always asynchronous
   - Use microtasks for better performance
   - Consider batching multiple promise resolutions

3. **Error Handling Overhead**
   - Balance between error handling and performance
   - Use error boundaries for groups of operations
   - Consider error sampling in production
