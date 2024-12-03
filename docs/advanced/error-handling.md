# Error Handling Strategies

## Overview

Comprehensive error handling strategies for async JavaScript patterns, including error types, error propagation, and recovery mechanisms.

## Implementation

```typescript
// Base error class for all async operations
class AsyncOperationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly operation: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'AsyncOperationError';
    Error.captureStackTrace(this, AsyncOperationError);
  }

  static from(error: unknown, operation: string): AsyncOperationError {
    if (error instanceof AsyncOperationError) {
      return error;
    }

    if (error instanceof Error) {
      return new AsyncOperationError(
        error.message,
        'UNKNOWN_ERROR',
        operation,
        error
      );
    }

    return new AsyncOperationError(String(error), 'UNKNOWN_ERROR', operation);
  }
}

// Specific error types
class TimeoutError extends AsyncOperationError {
  constructor(operation: string, timeoutMs: number) {
    super(`Operation timed out after ${timeoutMs}ms`, 'TIMEOUT', operation);
    this.name = 'TimeoutError';
  }
}

class RetryError extends AsyncOperationError {
  constructor(
    operation: string,
    public readonly attempts: number,
    originalError: Error
  ) {
    super(
      `Failed after ${attempts} attempts`,
      'MAX_RETRIES_EXCEEDED',
      operation,
      originalError
    );
    this.name = 'RetryError';
  }
}

// Error handling utilities
const errorHandlers = {
  async withTimeout<T>(
    operation: () => Promise<T>,
    timeoutMs: number,
    operationName: string
  ): Promise<T> {
    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new TimeoutError(operationName, timeoutMs)),
            timeoutMs
          )
        ),
      ]);
      return result;
    } catch (error) {
      throw AsyncOperationError.from(error, operationName);
    }
  },

  async withRetry<T>(
    operation: () => Promise<T>,
    options: {
      maxAttempts: number;
      operationName: string;
      onRetry?: (error: Error, attempt: number) => void;
    }
  ): Promise<T> {
    const { maxAttempts, operationName, onRetry } = options;
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = AsyncOperationError.from(error, operationName);
        if (attempt < maxAttempts && onRetry) {
          onRetry(lastError, attempt);
        }
      }
    }

    throw new RetryError(operationName, maxAttempts, lastError!);
  },

  async withCleanup<T>(
    operation: () => Promise<T>,
    cleanup: () => Promise<void>,
    operationName: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw AsyncOperationError.from(error, operationName);
    } finally {
      await cleanup().catch((error) => {
        console.error('Cleanup failed:', error);
      });
    }
  },
};

// Error recovery strategies
const recoveryStrategies = {
  async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      console.warn(`Primary operation failed: ${error}`);
      return fallback();
    }
  },

  async withCircuitBreaker<T>(
    operation: () => Promise<T>,
    options: {
      maxFailures: number;
      resetTimeoutMs: number;
      operationName: string;
    }
  ): Promise<T> {
    const { maxFailures, resetTimeoutMs, operationName } = options;
    const state = {
      failures: 0,
      lastFailureTime: 0,
    };

    if (
      state.failures >= maxFailures &&
      Date.now() - state.lastFailureTime < resetTimeoutMs
    ) {
      throw new AsyncOperationError(
        'Circuit breaker is open',
        'CIRCUIT_OPEN',
        operationName
      );
    }

    try {
      const result = await operation();
      state.failures = 0;
      return result;
    } catch (error) {
      state.failures++;
      state.lastFailureTime = Date.now();
      throw AsyncOperationError.from(error, operationName);
    }
  },
};
```

## Usage Example

```typescript
// Using timeout with retry and cleanup
async function fetchWithSafety(url: string): Promise<Response> {
  return errorHandlers.withCleanup(
    async () => {
      return errorHandlers.withRetry(
        () =>
          errorHandlers.withTimeout(() => fetch(url), 5000, 'fetchWithSafety'),
        {
          maxAttempts: 3,
          operationName: 'fetchWithSafety',
          onRetry: (error, attempt) => {
            console.warn(`Retry ${attempt} after error:`, error);
          },
        }
      );
    },
    async () => {
      // Cleanup resources
      console.log('Cleaning up resources...');
    },
    'fetchWithSafety'
  );
}

// Using circuit breaker with fallback
async function fetchWithCircuitBreaker(
  primaryUrl: string,
  fallbackUrl: string
): Promise<Response> {
  return recoveryStrategies.withFallback(
    () =>
      recoveryStrategies.withCircuitBreaker(() => fetch(primaryUrl), {
        maxFailures: 5,
        resetTimeoutMs: 60000,
        operationName: 'fetchWithCircuitBreaker',
      }),
    () => fetch(fallbackUrl),
    'fetchWithCircuitBreaker'
  );
}
```
