---
title: Auto-Retry Examples
description: Learn how to implement automatic retry mechanisms in JavaScript. Explore exponential backoff, retry strategies, and error handling patterns.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Retry Patterns
  - Error Handling
  - Async
  - Examples
  - Best Practices
image: /web-patterns/images/auto-retry-examples-banner.png
---

# Auto-Retry Examples

This page demonstrates practical examples of implementing and using auto-retry patterns for handling transient failures.

## Basic Retry Implementation

```typescript:preview
// Basic retry with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    retryableErrors?: Array<new (...args: any[]) => Error>;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryableErrors = [Error],
  } = options;

  let attempt = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      attempt++;

      if (
        attempt >= maxAttempts ||
        !retryableErrors.some((errorType) => error instanceof errorType)
      ) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(delay, maxDelay))
      );

      delay *= backoffFactor;
    }
  }
}

// Usage
try {
  const result = await withRetry(
    async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
      backoffFactor: 2,
      retryableErrors: [
        Error,
        TypeError, // For network errors
      ],
    }
  );
  console.log('Operation successful:', result);
} catch (error) {
  console.error('Operation failed after retries:', error);
}
```

## Advanced Retry Strategy

```typescript:preview
class RetryStrategy {
  private attempts = 0;
  private totalDelay = 0;

  constructor(
    private readonly options: {
      maxAttempts: number;
      initialDelay: number;
      maxDelay: number;
      backoffFactor: number;
      timeout?: number;
      onRetry?: (attempt: number, error: Error) => void;
      retryDecision?: (error: Error) => boolean;
    }
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    while (true) {
      try {
        return await this.executeWithTimeout(operation);
      } catch (error) {
        if (!this.shouldRetry(error as Error)) {
          throw error;
        }

        await this.handleRetry(error as Error);
      }
    }
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    if (!this.options.timeout) {
      return operation();
    }

    return Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Operation timeout')),
          this.options.timeout
        )
      ),
    ]);
  }

  private shouldRetry(error: Error): boolean {
    if (this.attempts >= this.options.maxAttempts) {
      return false;
    }

    if (this.options.retryDecision) {
      return this.options.retryDecision(error);
    }

    return true;
  }

  private async handleRetry(error: Error): Promise<void> {
    this.attempts++;
    this.options.onRetry?.(this.attempts, error);

    const delay = Math.min(
      this.options.initialDelay *
        Math.pow(this.options.backoffFactor, this.attempts - 1),
      this.options.maxDelay
    );

    this.totalDelay += delay;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  getMetrics() {
    return {
      attempts: this.attempts,
      totalDelay: this.totalDelay,
    };
  }
}

// Usage
const strategy = new RetryStrategy({
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 2,
  timeout: 3000,
  onRetry: (attempt, error) => {
    console.log(`Retry attempt ${attempt} after error:`, error.message);
  },
  retryDecision: (error) => {
    // Only retry on network or 5xx errors
    return (
      error instanceof TypeError ||
      (error instanceof Error && error.message.includes('HTTP 5'))
    );
  },
});

try {
  const result = await strategy.execute(async () => {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  });
  console.log('Operation successful:', result);
} catch (error) {
  console.error('Operation failed:', error);
  console.log('Retry metrics:', strategy.getMetrics());
}
```

## Real-World Example: Resilient API Client

```typescript:preview
class ResilientApiClient {
  private retryStrategies: Map<string, RetryStrategy> = new Map();

  constructor(
    private readonly baseUrl: string,
    private readonly defaultOptions: RetryOptions = {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2,
      timeout: 5000,
    }
  ) {}

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const strategy = this.getRetryStrategy(endpoint);

    return strategy.execute(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        options.timeout ?? this.defaultOptions.timeout
      );

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new HttpError(response.status, response.statusText);
        }

        return response.json();
      } finally {
        clearTimeout(timeoutId);
      }
    });
  }

  private getRetryStrategy(endpoint: string): RetryStrategy {
    if (!this.retryStrategies.has(endpoint)) {
      this.retryStrategies.set(
        endpoint,
        new RetryStrategy({
          ...this.defaultOptions,
          retryDecision: this.shouldRetry.bind(this),
          onRetry: (attempt, error) => {
            this.logRetry(endpoint, attempt, error);
          },
        })
      );
    }

    return this.retryStrategies.get(endpoint)!;
  }

  private shouldRetry(error: Error): boolean {
    if (error instanceof HttpError) {
      // Retry on server errors and specific client errors
      return (
        error.status >= 500 ||
        error.status === 429 || // Too Many Requests
        error.status === 408 // Request Timeout
      );
    }

    // Retry on network errors
    return error instanceof TypeError;
  }

  private logRetry(endpoint: string, attempt: number, error: Error): void {
    console.warn(`Retry attempt ${attempt} for ${endpoint}:`, error.message);
  }
}

class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = 'HttpError';
  }
}

// Usage
const api = new ResilientApiClient('https://api.example.com', {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 2,
  timeout: 3000,
});

try {
  const data = await api.request<UserData>('/users/123', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('User data:', data);
} catch (error) {
  console.error('Failed to fetch user data:', error);
}
```

## Best Practices

1. Circuit breaker pattern:

   ```typescript:preview
   class CircuitBreaker {
     private failures = 0;
     private lastFailureTime = 0;
     private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

     constructor(
       private readonly threshold: number = 5,
       private readonly resetTimeout: number = 60000
     ) {}

     async execute<T>(operation: () => Promise<T>): Promise<T> {
       if (this.state === 'OPEN') {
         if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
           this.state = 'HALF_OPEN';
         } else {
           throw new Error('Circuit breaker is OPEN');
         }
       }

       try {
         const result = await operation();
         this.onSuccess();
         return result;
       } catch (error) {
         this.onFailure();
         throw error;
       }
     }

     private onSuccess(): void {
       this.failures = 0;
       this.state = 'CLOSED';
     }

     private onFailure(): void {
       this.failures++;
       this.lastFailureTime = Date.now();

       if (this.failures >= this.threshold) {
         this.state = 'OPEN';
       }
     }
   }
   ```

2. Retry with jitter:

   ```typescript:preview
   function calculateDelay(attempt: number, options: RetryOptions): number {
     const baseDelay = Math.min(
       options.initialDelay * Math.pow(options.backoffFactor, attempt - 1),
       options.maxDelay
     );

     // Add random jitter (±25%)
     const jitter = baseDelay * 0.25;
     return baseDelay + (Math.random() * 2 - 1) * jitter;
   }
   ```

3. Retry budget:

   ```typescript:preview
   class RetryBudget {
     private retryCount = 0;
     private lastResetTime = Date.now();

     constructor(
       private readonly maxRetries: number,
       private readonly windowMs: number
     ) {}

     canRetry(): boolean {
       this.resetIfNeeded();
       return this.retryCount < this.maxRetries;
     }

     recordRetry(): void {
       this.resetIfNeeded();
       this.retryCount++;
     }

     private resetIfNeeded(): void {
       const now = Date.now();
       if (now - this.lastResetTime >= this.windowMs) {
         this.retryCount = 0;
         this.lastResetTime = now;
       }
     }
   }
   ```

4. Retry with fallback:

   ```typescript:preview
   async function retryWithFallback<T>(
     primary: () => Promise<T>,
     fallback: () => Promise<T>,
     options: RetryOptions
   ): Promise<T> {
     try {
       return await withRetry(primary, options);
     } catch (error) {
       console.warn('Primary operation failed, using fallback:', error);
       return fallback();
     }
   }
   ```
