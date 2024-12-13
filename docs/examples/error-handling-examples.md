---
title: Error Handling Examples
description: Learn robust error handling patterns in JavaScript. Master error recovery, graceful degradation, and error boundary implementation.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Error Handling
  - Exception Handling
  - Error Recovery
  - Examples
  - Best Practices
image: /web-patterns/images/error-handling-examples-banner.png
---

# Error Handling Examples

This page demonstrates practical examples of implementing and using error handling patterns for asynchronous operations.

## Basic Error Handling

```typescript:preview
// Basic error handling with custom errors
class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'ApplicationError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

class NetworkError extends ApplicationError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

// Usage
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new NetworkError('Failed to fetch user data', {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const data = await response.json();

    if (!data.id || !data.name) {
      throw new ValidationError('Invalid user data format', { data });
    }

    return data;
  } catch (error) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new ApplicationError('Unexpected error', 'UNKNOWN_ERROR', error);
  }
}
```

## Advanced Error Handling

```typescript:preview
class ErrorBoundary {
  private errorHandlers: Map<
    string,
    (error: ApplicationError) => Promise<void>
  > = new Map();

  private fallbackHandler?: (error: ApplicationError) => Promise<void>;

  registerHandler(
    errorCode: string,
    handler: (error: ApplicationError) => Promise<void>
  ): void {
    this.errorHandlers.set(errorCode, handler);
  }

  setFallbackHandler(
    handler: (error: ApplicationError) => Promise<void>
  ): void {
    this.fallbackHandler = handler;
  }

  async handleError(error: unknown): Promise<void> {
    const appError = this.normalizeError(error);
    const handler = this.errorHandlers.get(appError.code);

    if (handler) {
      await handler(appError);
    } else if (this.fallbackHandler) {
      await this.fallbackHandler(appError);
    } else {
      console.error('Unhandled error:', appError);
      throw appError;
    }
  }

  private normalizeError(error: unknown): ApplicationError {
    if (error instanceof ApplicationError) {
      return error;
    }

    if (error instanceof Error) {
      return new ApplicationError(error.message, 'UNKNOWN_ERROR', error);
    }

    return new ApplicationError(
      'Unknown error occurred',
      'UNKNOWN_ERROR',
      error
    );
  }
}

// Usage
const errorBoundary = new ErrorBoundary();

errorBoundary.registerHandler('VALIDATION_ERROR', async (error) => {
  console.error('Validation failed:', error.details);
  await notifyUser('Invalid input provided');
});

errorBoundary.registerHandler('NETWORK_ERROR', async (error) => {
  console.error('Network error:', error.details);
  await retryOperation();
});

errorBoundary.setFallbackHandler(async (error) => {
  console.error('Unexpected error:', error);
  await notifySupport(error);
});

try {
  await fetchUserData('123');
} catch (error) {
  await errorBoundary.handleError(error);
}
```

## Real-World Example: API Error Handling

```typescript:preview
class ApiErrorHandler {
  private retryableStatusCodes = new Set([
    408, // Request Timeout
    429, // Too Many Requests
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ]);

  private errorBoundary = new ErrorBoundary();
  private metrics: ErrorMetrics = {
    errors: new Map(),
    retries: new Map(),
  };

  constructor(
    private readonly options: {
      maxRetries?: number;
      retryDelay?: number;
      onError?: (error: ApplicationError) => void;
      onRetry?: (error: ApplicationError, attempt: number) => void;
    } = {}
  ) {
    this.setupErrorHandlers();
  }

  private setupErrorHandlers(): void {
    this.errorBoundary.registerHandler('NETWORK_ERROR', async (error) => {
      const details = error.details as {
        status: number;
        statusText: string;
      };

      if (this.retryableStatusCodes.has(details.status)) {
        await this.handleRetryableError(error);
      } else {
        await this.handleNonRetryableError(error);
      }
    });

    this.errorBoundary.registerHandler('VALIDATION_ERROR', async (error) => {
      this.recordError(error);
      this.options.onError?.(error);
      throw error; // Non-retryable
    });

    this.errorBoundary.setFallbackHandler(async (error) => {
      this.recordError(error);
      this.options.onError?.(error);
      await this.notifyError(error);
    });
  }

  private async handleRetryableError(error: ApplicationError): Promise<void> {
    const retryCount = this.getRetryCount(error);

    if (retryCount < (this.options.maxRetries ?? 3)) {
      await this.retryWithBackoff(error, retryCount);
    } else {
      await this.handleMaxRetriesExceeded(error);
    }
  }

  private async retryWithBackoff(
    error: ApplicationError,
    retryCount: number
  ): Promise<void> {
    const delay = this.calculateBackoff(retryCount);
    this.recordRetry(error);
    this.options.onRetry?.(error, retryCount + 1);

    await new Promise((resolve) => setTimeout(resolve, delay));

    throw new RetryableError(error.message, error.code, {
      ...error.details,
      retryCount: retryCount + 1,
    });
  }

  private calculateBackoff(retryCount: number): number {
    const baseDelay = this.options.retryDelay ?? 1000;
    const maxDelay = 30000; // 30 seconds

    return Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
  }

  private async handleNonRetryableError(
    error: ApplicationError
  ): Promise<void> {
    this.recordError(error);
    this.options.onError?.(error);
    await this.notifyError(error);
    throw error;
  }

  private async handleMaxRetriesExceeded(
    error: ApplicationError
  ): Promise<void> {
    const maxRetriesError = new ApplicationError(
      'Max retries exceeded',
      'MAX_RETRIES_ERROR',
      {
        originalError: error,
        maxRetries: this.options.maxRetries,
      }
    );

    this.recordError(maxRetriesError);
    this.options.onError?.(maxRetriesError);
    await this.notifyError(maxRetriesError);
    throw maxRetriesError;
  }

  private getRetryCount(error: ApplicationError): number {
    return this.metrics.retries.get(error.code) ?? 0;
  }

  private recordError(error: ApplicationError): void {
    const count = this.metrics.errors.get(error.code) ?? 0;
    this.metrics.errors.set(error.code, count + 1);
  }

  private recordRetry(error: ApplicationError): void {
    const count = this.metrics.retries.get(error.code) ?? 0;
    this.metrics.retries.set(error.code, count + 1);
  }

  private async notifyError(error: ApplicationError): Promise<void> {
    // Implement error notification logic
    console.error('Critical error:', error);
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      await this.errorBoundary.handleError(error);
      throw error; // Re-throw if not handled
    }
  }

  getMetrics(): ErrorMetrics {
    return {
      errors: new Map(this.metrics.errors),
      retries: new Map(this.metrics.retries),
    };
  }
}

// Usage
const apiHandler = new ApiErrorHandler({
  maxRetries: 3,
  retryDelay: 1000,
  onError: (error) => {
    console.error('API error:', error);
  },
  onRetry: (error, attempt) => {
    console.log(`Retrying operation (${attempt}):`, error.message);
  },
});

try {
  const result = await apiHandler.execute(async () => {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new NetworkError('API request failed', {
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response.json();
  });
  console.log('Operation successful:', result);
} catch (error) {
  console.error('Operation failed:', error);
}
```

## Best Practices

1. Error aggregation:

   ```typescript:preview
   class ErrorAggregator {
     private errors: ApplicationError[] = [];

     collect(error: ApplicationError): void {
       this.errors.push(error);
     }

     hasErrors(): boolean {
       return this.errors.length > 0;
     }

     throwIfErrors(): void {
       if (this.hasErrors()) {
         throw new AggregateError(this.errors, 'Multiple errors occurred');
       }
     }

     async executeAll<T>(operations: Array<() => Promise<T>>): Promise<T[]> {
       const results: T[] = [];

       for (const op of operations) {
         try {
           results.push(await op());
         } catch (error) {
           if (error instanceof ApplicationError) {
             this.collect(error);
           } else {
             this.collect(
               new ApplicationError(
                 'Operation failed',
                 'OPERATION_ERROR',
                 error
               )
             );
           }
         }
       }

       this.throwIfErrors();
       return results;
     }
   }
   ```

2. Context preservation:

   ```typescript:preview
   class ErrorContext {
     private context: Map<string, any> = new Map();

     addContext(key: string, value: any): void {
       this.context.set(key, value);
     }

     enrichError(error: ApplicationError): ApplicationError {
       return new ApplicationError(error.message, error.code, {
         ...error.details,
         context: Object.fromEntries(this.context),
       });
     }

     async execute<T>(operation: () => Promise<T>): Promise<T> {
       try {
         return await operation();
       } catch (error) {
         if (error instanceof ApplicationError) {
           throw this.enrichError(error);
         }
         throw error;
       }
     }
   }
   ```

3. Error recovery:

   ```typescript:preview
   class ErrorRecovery {
     private recoveryStrategies: Map<
       string,
       (error: ApplicationError) => Promise<void>
     > = new Map();

     registerStrategy(
       errorCode: string,
       strategy: (error: ApplicationError) => Promise<void>
     ): void {
       this.recoveryStrategies.set(errorCode, strategy);
     }

     async recover(error: ApplicationError): Promise<void> {
       const strategy = this.recoveryStrategies.get(error.code);
       if (strategy) {
         await strategy(error);
       }
     }

     async execute<T>(
       operation: () => Promise<T>,
       fallback?: () => Promise<T>
     ): Promise<T> {
       try {
         return await operation();
       } catch (error) {
         if (error instanceof ApplicationError) {
           await this.recover(error);
           if (fallback) {
             return fallback();
           }
         }
         throw error;
       }
     }
   }
   ```

4. Error monitoring:

   ```typescript:preview
   class ErrorMonitor {
     private errorCounts: Map<string, number> = new Map();
     private errorThresholds: Map<string, number> = new Map();
     private alertHandlers: Set<(error: ApplicationError) => void> = new Set();

     setThreshold(errorCode: string, threshold: number): void {
       this.errorThresholds.set(errorCode, threshold);
     }

     onThresholdExceeded(handler: (error: ApplicationError) => void): void {
       this.alertHandlers.add(handler);
     }

     monitor(error: ApplicationError): void {
       const count = (this.errorCounts.get(error.code) ?? 0) + 1;
       this.errorCounts.set(error.code, count);

       const threshold = this.errorThresholds.get(error.code);
       if (threshold && count >= threshold) {
         this.alertHandlers.forEach((handler) => handler(error));
       }
     }

     getStats(): Map<string, number> {
       return new Map(this.errorCounts);
     }
   }
   ```
