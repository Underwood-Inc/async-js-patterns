---
title: JavaScript Promise Patterns
description: Deep dive into Promise patterns and best practices. Learn about Promise chaining, error handling, and advanced Promise combinators with practical examples.
date: 2024-12-01
author: Underwood Inc
tags:
  - Promises
  - JavaScript
  - Async Programming
  - Error Handling
  - Promise Chaining
  - Promise Combinators
  - Web Development
  - Frontend Development
image: /web-patterns/images/promises-banner.png
---

# Promise Patterns

Learn how to effectively work with Promises in JavaScript.

## Basic Promise Usage

Create and work with Promises:

::: code-with-tooltips

```typescript
// Creating a Promise
const promise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('Operation completed');
    } else {
      reject(new Error('Operation failed'));
    }
  }, 1000);
});

// Using a Promise
promise
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Async/await syntax
async function example() {
  try {
    const result = await promise;
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

:::

## Promise Combinators

Using Promise combination methods:

::: code-with-tooltips

```typescript
// Promise.all - Wait for all promises
async function fetchAllUsers(ids: number[]) {
  const promises = ids.map(id => fetchUser(id));
  const users = await Promise.all(promises);
  return users;
}

// Promise.race - First to complete
async function fetchWithTimeout(url: string, timeout: number) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// Promise.any - First to succeed
async function fetchFromMirrors(urls: string[]) {
  return Promise.any(
    urls.map(url => fetch(url))
  );
}

// Promise.allSettled - Wait for all to complete
async function attemptAll(tasks: Promise<any>[]) {
  const results = await Promise.allSettled(tasks);
  return results.map(result => ({
    status: result.status,
    value: result.status === 'fulfilled' ? result.value : result.reason
  }));
}
```

:::

## Promise Chaining

Chain multiple operations:

::: code-with-tooltips

```typescript
function processUser(userId: number) {
  return fetchUser(userId)
    .then(user => {
      // Transform user data
      return {
        ...user,
        lastAccess: new Date()
      };
    })
    .then(user => {
      // Save to database
      return saveUser(user);
    })
    .then(user => {
      // Notify other services
      return Promise.all([
        notifyProfile(user),
        notifyAnalytics(user)
      ]);
    })
    .catch(error => {
      // Handle any error in the chain
      console.error('Processing failed:', error);
      throw error;
    });
}
```

:::

## Custom Promise Wrappers

Create reusable Promise patterns:

::: code-with-tooltips

```typescript
// Retry wrapper
function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    function attempt(attemptsLeft: number) {
      operation()
        .then(resolve)
        .catch(error => {
          if (attemptsLeft === 0) {
            reject(error);
          } else {
            setTimeout(() => attempt(attemptsLeft - 1), delay);
          }
        });
    }
    attempt(retries);
  });
}

// Timeout wrapper
function withTimeout<T>(
  promise: Promise<T>,
  timeout: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// Cache wrapper
function withCache<T>(
  key: string,
  operation: () => Promise<T>,
  ttl = 60000
): Promise<T> {
  const cache = new Map<string, { value: T; expires: number }>();

  return new Promise((resolve, reject) => {
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expires) {
      resolve(cached.value);
      return;
    }

    operation()
      .then(value => {
        cache.set(key, {
          value,
          expires: Date.now() + ttl
        });
        resolve(value);
      })
      .catch(reject);
  });
}
```

:::

## Error Handling

Handle Promise errors effectively:

::: code-with-tooltips

```typescript
async function robustOperation() {
  try {
    // Operation that might fail
    const result = await riskyOperation();
    return result;
  } catch (error) {
    // Specific error handling
    if (error instanceof NetworkError) {
      // Retry network operations
      return withRetry(() => riskyOperation());
    }
    if (error instanceof ValidationError) {
      // Handle validation errors
      return fallbackOperation();
    }
    // Unexpected errors
    console.error('Unexpected error:', error);
    throw error;
  } finally {
    // Cleanup
    await cleanup();
  }
}
```

:::

## Best Practices

1. **Promise Creation**

   - Only create new Promises when wrapping async operations
   - Avoid unnecessary Promise wrapping
   - Use async/await for cleaner code

2. **Error Handling**

   - Always handle Promise rejections
   - Use specific error types
   - Implement proper error recovery

3. **Performance**

   - Use appropriate Promise combinators
   - Avoid unnecessary Promise chains
   - Consider caching Promise results

4. **Code Organization**
   - Keep Promise chains readable
   - Break down complex operations
   - Document async behavior
