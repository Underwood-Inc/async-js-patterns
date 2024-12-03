---
title: Examples
---

## Overview

This section provides practical examples of using the async patterns library.

## Basic Examples

### Promise Patterns

```typescript
// Custom Promise usage
const myPromise = new CustomPromise((resolve, reject) => {
  setTimeout(() => resolve('Success!'), 1000);
});

// Promise.all example
const results = await Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments'),
]);
```

### Timer Patterns

```typescript
// Custom setTimeout with cleanup
const timer = new Timer();
const cleanup = timer.setTimeout(() => {
  console.log('Executed after 1 second');
}, 1000);

// Cleanup when done
cleanup();
```

### Advanced Patterns

```typescript
// Auto-retry with exponential backoff
const result = await withRetry(
  async () => {
    return await fetch('/api/data');
  },
  {
    maxAttempts: 3,
    backoffFactor: 2,
    initialDelay: 1000,
  }
);

// Memoization with TTL
const memoized = memoize(
  async (id: string) => {
    return await fetch(`/api/user/${id}`);
  },
  {
    ttl: 60000, // 1 minute
    maxSize: 100,
  }
);
```

## Real-World Examples

### API Client

```typescript
class APIClient {
  private memoizer = new Memoizer({ maxAge: 60000 });

  async fetchUser(id: string) {
    return this.memoizer.memoize(
      () =>
        withRetry(
          async () => {
            const response = await fetch(`/api/users/${id}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
          },
          { maxAttempts: 3 }
        ),
      id
    );
  }
}
```

### Rate Limiter

```typescript
const rateLimiter = new RateLimiter({
  maxRequests: 100,
  timeWindow: 60000,
});

const api = {
  async makeRequest() {
    await rateLimiter.acquire();
    try {
      return await fetch('/api/endpoint');
    } finally {
      rateLimiter.release();
    }
  },
};
```

### Performance Monitoring

```typescript
const monitor = new PerformanceMonitor();

monitor.onMetric(({ operationName, duration }) => {
  if (duration > 1000) {
    console.warn(`Slow operation: ${operationName}`);
  }
});

await monitor.track('fetchData', async () => {
  return await fetch('/api/data');
});
```
