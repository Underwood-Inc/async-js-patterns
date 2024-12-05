---
title: Async Error Handling Guide
description: Master error handling in asynchronous JavaScript. Learn about error patterns, recovery strategies, and robust error management.
date: 2024-01-01
author: Underwood Inc
tags:
  - JavaScript
  - Async
  - Error Handling
  - Exception Handling
  - Error Recovery
  - Best Practices
image: /web-patterns/images/async-error-handling-banner.png
---

# Error Handling

Learn how to effectively handle errors in asynchronous JavaScript code.

## Custom Error Types

Create specific error types for better error handling:

```typescript:preview
class NetworkError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response?: Response
  ) {
    super(message);
    this.name = 'NetworkError';
    // Restore prototype chain
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

class TimeoutError extends Error {
  constructor(message = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
```

## Error Boundaries

Implement error boundaries for async operations:

```typescript:preview
class AsyncBoundary {
  private errorHandler: (error: Error) => void;
  private retryCount: number;
  private retryDelay: number;

  constructor(options: {
    onError: (error: Error) => void;
    retryCount?: number;
    retryDelay?: number;
  }) {
    this.errorHandler = options.onError;
    this.retryCount = options.retryCount ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;
  }

  async wrap<T>(operation: () => Promise<T>): Promise<T | undefined> {
    let lastError: Error;

    for (let attempt = 0; attempt < this.retryCount; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        this.errorHandler(lastError);

        if (attempt < this.retryCount - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, this.retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError!;
  }
}

// Usage
const boundary = new AsyncBoundary({
  onError: error => {
    console.error('Operation failed:', error);
    notifyUser('An error occurred, retrying...');
  },
  retryCount: 3,
  retryDelay: 1000
});

try {
  const data = await boundary.wrap(async () => {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new NetworkError(
        'Failed to fetch data',
        response.status,
        response
      );
    }
    return response.json();
  });
} catch (error) {
  if (error instanceof NetworkError) {
    handleNetworkError(error);
  } else {
    handleUnexpectedError(error);
  }
}
```

## Error Recovery

Implement graceful error recovery:

```typescript:preview
async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
  shouldTryFallback: (error: Error) => boolean
): Promise<T> {
  try {
    return await primary();
  } catch (error) {
    if (error instanceof Error && shouldTryFallback(error)) {
      return await fallback();
    }
    throw error;
  }
}

// Usage
const data = await withFallback(
  () => fetchFromPrimaryAPI(),
  () => fetchFromBackupAPI(),
  error => error instanceof NetworkError
);
```

## Circuit Breaker

Implement a circuit breaker pattern:

```typescript:preview
class CircuitBreaker {
  private failures = 0;
  private lastFailure: number = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000,
    private onStateChange?: (state: 'closed' | 'open' | 'half-open') => void
  ) {}

  private setState(state: 'closed' | 'open' | 'half-open'): void {
    this.state = state;
    this.onStateChange?.(state);
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure >= this.timeout) {
        this.setState('half-open');
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      if (this.state === 'half-open') {
        this.setState('closed');
        this.failures = 0;
      }
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailure = Date.now();

      if (this.failures >= this.threshold) {
        this.setState('open');
      }

      throw error;
    }
  }

  reset(): void {
    this.failures = 0;
    this.setState('closed');
  }
}

// Usage
const breaker = new CircuitBreaker(5, 60000, state => {
  console.log(`Circuit breaker state changed to: ${state}`);
});

async function fetchWithBreaker() {
  try {
    return await breaker.execute(async () => {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new NetworkError(
          'Failed to fetch data',
          response.status,
          response
        );
      }
      return response.json();
    });
  } catch (error) {
    if (error.message === 'Circuit breaker is open') {
      return await fetchFromFallbackService();
    }
    throw error;
  }
}
```

## Error Aggregation

Handle multiple errors gracefully:

```typescript:preview
class AggregateError extends Error {
  constructor(
    message: string,
    public readonly errors: Error[]
  ) {
    super(message);
    this.name = 'AggregateError';
    Object.setPrototypeOf(this, AggregateError.prototype);
  }
}

async function executeAll<T>(
  tasks: (() => Promise<T>)[],
  options = { continueOnError: false }
): Promise<T[]> {
  const results: T[] = [];
  const errors: Error[] = [];

  for (const task of tasks) {
    try {
      results.push(await task());
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error(String(error)));
      if (!options.continueOnError) {
        throw new AggregateError(
          'Task execution failed',
          errors
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new AggregateError(
      'Some tasks failed to execute',
      errors
    );
  }

  return results;
}

// Usage
try {
  const results = await executeAll(
    [task1, task2, task3],
    { continueOnError: true }
  );
} catch (error) {
  if (error instanceof AggregateError) {
    error.errors.forEach(handleIndividualError);
  } else {
    handleUnexpectedError(error);
  }
}
```

## Best Practices

1. **Error Types**

   - Create specific error classes
   - Include relevant error details
   - Maintain proper prototype chain

2. **Error Recovery**

   - Implement retry mechanisms
   - Provide fallback options
   - Use circuit breakers for unstable services

3. **Error Boundaries**

   - Contain error propagation
   - Implement proper cleanup
   - Log errors appropriately

4. **Error Context**

   - Include relevant error details
   - Maintain error stack traces
   - Add debugging information

5. **User Experience**
   - Show meaningful error messages
   - Provide recovery options
   - Maintain application state
