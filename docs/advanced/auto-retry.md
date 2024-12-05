---
title: Auto-Retry Pattern
description: Learn how to implement automatic retry mechanisms with exponential backoff for handling transient failures in asynchronous operations.
head:
  - - meta
    - name: keywords
      content: auto-retry, exponential backoff, error recovery, resilience pattern, async operations, fault tolerance, TypeScript, JavaScript
  - - meta
    - name: author
      content: Modern Web Development Patterns
  - - meta
    - property: og:title
      content: Auto-Retry Pattern | Advanced Async Patterns
  - - meta
    - property: og:description
      content: Implement robust auto-retry mechanisms with exponential backoff to handle transient failures in your async operations.
---

# Auto-Retry

## Overview

Auto-retry is a resilience pattern that automatically attempts to recover from failed operations by repeating them based on configurable strategies. This pattern helps applications handle transient failures gracefully and maintain reliability in unreliable environments.

### Real-World Analogy

Think of auto-retry like trying to make a phone call in an area with poor reception:

- The first call attempt fails (operation failure)
- You wait a moment before trying again (delay strategy)
- Each subsequent attempt might wait longer (exponential backoff)
- After several attempts, you might give up (maximum retries)
- You might try alternative numbers (fallback mechanisms)

### Common Use Cases

1. **Network Requests**

   - Problem: Temporary network connectivity issues
   - Solution: Retry failed requests with increasing delays
   - Benefit: Higher success rate for critical operations

2. **Database Operations**

   - Problem: Temporary database connection losses
   - Solution: Automatic retry with connection pool refresh
   - Benefit: Resilient data operations

3. **Resource Access**
   - Problem: Race conditions or temporary locks
   - Solution: Retry with conflict resolution
   - Benefit: Reliable resource acquisition

### How It Works

1. **Failure Detection**

   - Identify retryable errors
   - Capture error context
   - Track attempt count

2. **Retry Strategy**

   - Calculate delay interval
   - Apply backoff algorithm
   - Consider jitter

3. **Execution Control**

   - Maximum attempts
   - Timeout handling
   - Success criteria

4. **Recovery Mechanisms**
   - Circuit breaking
   - Fallback options
   - State recovery

## Implementation

```typescript:preview
interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableErrors?: Array<new (...args: any[]) => Error>;
  onRetry?: (error: Error, attempt: number) => void;
  shouldRetry?: (error: Error) => boolean;
  timeout?: number;
}

class RetryError extends Error {
  constructor(
    public originalError: Error,
    public attempts: number
  ) {
    super(`Failed after ${attempts} attempts: ${originalError.message}`);
    this.name = 'RetryError';
  }
}

async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    retryableErrors = [Error],
    onRetry = () => {},
    shouldRetry = (error: Error) =>
      retryableErrors.some((errorType) => error instanceof errorType),
    timeout,
  } = options;

  let attempt = 1;
  let lastError: Error;

  while (attempt <= maxAttempts) {
    try {
      // Wrap operation with timeout if specified
      const operationWithTimeout = timeout
        ? Promise.race([
            operation(),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Operation timeout')), timeout)
            ),
          ])
        : operation();

      return await operationWithTimeout;
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        break;
      }

      onRetry(lastError, attempt);

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      );

      // Add jitter to prevent thundering herd
      const jitteredDelay = delay * (0.8 + Math.random() * 0.4);

      await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
      attempt++;
    }
  }

  throw new RetryError(lastError!, attempt);
}
```

## Usage Example

```typescript:preview
// Basic usage
const fetchWithRetry = async (url: string) => {
  return withRetry(() => fetch(url), {
    maxAttempts: 3,
    initialDelay: 1000,
    onRetry: (error, attempt) => {
      console.log(`Retry attempt ${attempt} after error: ${error.message}`);
    },
  });
};

// With custom retry conditions
const customRetry = async () => {
  return withRetry(
    async () => {
      const response = await fetch('api/data');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    },
    {
      shouldRetry: (error) => {
        if (error.message.includes('429')) {
          return true; // Retry on rate limit
        }
        if (error.message.includes('503')) {
          return true; // Retry on service unavailable
        }
        return false;
      },
      backoffFactor: 3,
      maxDelay: 5000,
    }
  );
};
```

## Key Concepts

1. **Exponential Backoff**: Increasing delays between retries
2. **Jitter**: Random delay variation to prevent thundering herd
3. **Configurable Policies**: Flexible retry conditions
4. **Error Filtering**: Selective retry based on error types
5. **Progress Tracking**: Retry attempt monitoring

## Edge Cases

- Network timeouts
- Rate limiting responses
- Partial success states
- Infinite retry loops
- Resource cleanup between retries

## Common Pitfalls

1. **Retry Storm**: Too many concurrent retries
2. **Resource Exhaustion**: Not cleaning up between attempts
3. **State Management**: Not handling partial success
4. **Timeout Handling**: Not implementing proper timeouts

## Best Practices

1. Use exponential backoff with jitter
2. Implement proper timeout handling
3. Clean up resources between retries
4. Monitor and log retry attempts
5. Set reasonable maximum attempts

## Testing

```typescript:preview
// Test successful retry
const successTest = async () => {
  let attempts = 0;
  const operation = async () => {
    attempts++;
    if (attempts < 2) throw new Error('Temporary error');
    return 'success';
  };

  const result = await withRetry(operation);
  console.assert(
    result === 'success' && attempts === 2,
    'Should succeed after retry'
  );
};

// Test max attempts
const maxAttemptsTest = async () => {
  const operation = async () => {
    throw new Error('Persistent error');
  };

  try {
    await withRetry(operation, { maxAttempts: 3 });
  } catch (error) {
    console.assert(
      error instanceof RetryError && error.attempts === 3,
      'Should fail after max attempts'
    );
  }
};

// Test backoff timing
const backoffTest = async () => {
  const timestamps: number[] = [];
  const operation = async () => {
    timestamps.push(Date.now());
    throw new Error('Error');
  };

  try {
    await withRetry(operation, {
      maxAttempts: 3,
      initialDelay: 100,
      backoffFactor: 2,
    });
  } catch (error) {
    const intervals = timestamps
      .slice(1)
      .map((time, i) => time - timestamps[i]);
    console.assert(
      intervals[1] > intervals[0],
      'Should implement exponential backoff'
    );
  }
};
```

## Advanced Usage

```typescript:preview
// With circuit breaker pattern
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private readonly threshold = 5;
  private readonly resetTimeout = 60000;

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await operation();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private isOpen(): boolean {
    if (this.failures >= this.threshold) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      return timeSinceLastFailure < this.resetTimeout;
    }
    return false;
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
  }

  private reset(): void {
    this.failures = 0;
    this.lastFailureTime = 0;
  }
}

// Usage with circuit breaker
const circuitBreaker = new CircuitBreaker();

const retryWithCircuitBreaker = async <T>(
  operation: () => Promise<T>,
  retryOptions: Partial<RetryOptions> = {}
): Promise<T> => {
  return withRetry(() => circuitBreaker.execute(operation), {
    ...retryOptions,
    shouldRetry: (error) => {
      if (error.message === 'Circuit breaker is open') {
        return false;
      }
      return true;
    },
  });
};
```
