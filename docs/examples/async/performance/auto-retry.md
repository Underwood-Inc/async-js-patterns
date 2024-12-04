# Auto-Retry Examples

Learn how to implement robust retry mechanisms for handling transient failures.

## Basic Usage

```typescript
// Simple retry with fixed delay
async function retryWithDelay<T>(
  operation: () => Promise<T>,
  retries: number,
  delay: number
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Should not reach here');
}

// Retry with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Should not reach here');
}
```

## Advanced Patterns

### Configurable Retry Strategy

```typescript
interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  timeout?: number;
  retryableErrors?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

class RetryStrategy {
  constructor(private options: RetryOptions) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
      try {
        const result = await this.executeWithTimeout(operation);
        return result;
      } catch (error) {
        lastError = error as Error;

        if (
          this.options.retryableErrors &&
          !this.options.retryableErrors(lastError)
        ) {
          throw lastError;
        }

        if (attempt === this.options.maxRetries) {
          throw lastError;
        }

        if (this.options.onRetry) {
          this.options.onRetry(lastError, attempt);
        }

        await this.delay(attempt);
      }
    }

    throw lastError!;
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    if (!this.options.timeout) {
      return operation();
    }

    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Operation timed out'));
      }, this.options.timeout);

      operation()
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  }

  private async delay(attempt: number): Promise<void> {
    const delay = Math.min(
      this.options.baseDelay *
        Math.pow(this.options.backoffFactor, attempt - 1),
      this.options.maxDelay
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
```

### Circuit Breaker with Retry

```typescript
interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  retryOptions: RetryOptions;
}

class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private retryStrategy: RetryStrategy;

  constructor(private options: CircuitBreakerOptions) {
    this.retryStrategy = new RetryStrategy(options.retryOptions);
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    await this.checkState();

    try {
      const result = await this.retryStrategy.execute(operation);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private async checkState(): Promise<void> {
    if (this.state === 'OPEN') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;

      if (timeSinceLastFailure >= this.options.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (
      this.state === 'HALF_OPEN' ||
      this.failures >= this.options.failureThreshold
    ) {
      this.state = 'OPEN';
    }
  }

  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failures;
  }
}
```

### Retry Queue

```typescript
interface QueuedRetryOptions<T> {
  operation: () => Promise<T>;
  maxRetries: number;
  baseDelay: number;
  priority?: number;
  timeout?: number;
}

class RetryQueue {
  private queue: Map<string, QueuedRetryOptions<any>> = new Map();
  private processing = false;

  async add<T>(id: string, options: QueuedRetryOptions<T>): Promise<T> {
    this.queue.set(id, {
      ...options,
      priority: options.priority || 0,
    });

    if (!this.processing) {
      this.processQueue();
    }

    return new Promise((resolve, reject) => {
      const checkResult = setInterval(() => {
        if (!this.queue.has(id)) {
          clearInterval(checkResult);
          resolve(this.results.get(id));
          this.results.delete(id);
        }
      }, 100);
    });
  }

  private results = new Map<string, any>();

  private async processQueue(): Promise<void> {
    this.processing = true;

    while (this.queue.size > 0) {
      const [id, options] = this.getNextOperation();

      try {
        const result = await this.executeWithRetries(options);
        this.results.set(id, result);
      } catch (error) {
        this.results.set(id, error);
      }

      this.queue.delete(id);
    }

    this.processing = false;
  }

  private getNextOperation(): [string, QueuedRetryOptions<any>] {
    let highestPriority = -Infinity;
    let selectedId: string | null = null;

    for (const [id, options] of this.queue.entries()) {
      if (options.priority! > highestPriority) {
        highestPriority = options.priority!;
        selectedId = id;
      }
    }

    const options = this.queue.get(selectedId!)!;
    return [selectedId!, options];
  }

  private async executeWithRetries<T>(
    options: QueuedRetryOptions<T>
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < options.maxRetries; attempt++) {
      try {
        return await this.executeWithTimeout(options);
      } catch (error) {
        lastError = error as Error;
        await new Promise((resolve) =>
          setTimeout(resolve, options.baseDelay * Math.pow(2, attempt))
        );
      }
    }

    throw lastError!;
  }

  private async executeWithTimeout<T>(
    options: QueuedRetryOptions<T>
  ): Promise<T> {
    if (!options.timeout) {
      return options.operation();
    }

    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Operation timed out'));
      }, options.timeout);

      options
        .operation()
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  }
}
```
