# Throttling Examples

Learn how to implement throttling patterns for rate limiting and performance optimization.

## Basic Usage

```typescript
// Simple throttle function
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Throttle with trailing call
function throttleWithTrailing<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastArgs: Parameters<T> | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId === null) {
      func(...args);

      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}
```

## Advanced Patterns

### Promise-based Throttle

```typescript
interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel: () => void;
  flush: () => Promise<ReturnType<T> | undefined>;
}

function throttlePromise<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ThrottledFunction<T> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastResolve: ((value: ReturnType<T>) => void) | null = null;
  let lastReject: ((reason: any) => void) | null = null;

  const throttled = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (timeoutId === null) {
      return executeFunction(args);
    }

    return new Promise((resolve, reject) => {
      lastArgs = args;
      lastResolve = resolve;
      lastReject = reject;
    });
  };

  const executeFunction = async (
    args: Parameters<T>
  ): Promise<ReturnType<T>> => {
    try {
      const result = await func(...args);

      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (lastArgs) {
          const args = lastArgs;
          const resolve = lastResolve!;
          const reject = lastReject!;

          lastArgs = null;
          lastResolve = null;
          lastReject = null;

          executeFunction(args).then(resolve).catch(reject);
        }
      }, limit);

      return result;
    } catch (error) {
      timeoutId = null;
      throw error;
    }
  };

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (lastReject) {
      lastReject(new Error('Throttled function cancelled'));
      lastArgs = null;
      lastResolve = null;
      lastReject = null;
    }
  };

  throttled.flush = async () => {
    if (lastArgs) {
      const args = lastArgs;
      lastArgs = null;
      return func(...args);
    }
    return undefined;
  };

  return throttled;
}
```

### Rate Limiter

```typescript
interface RateLimiterOptions {
  maxRequests: number;
  interval: number;
  strategy: 'sliding' | 'fixed';
}

class RateLimiter {
  private timestamps: number[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(private options: RateLimiterOptions) {
    if (options.strategy === 'fixed') {
      this.resetPeriodically();
    }
  }

  async acquire(): Promise<void> {
    if (this.options.strategy === 'sliding') {
      await this.acquireSlidingWindow();
    } else {
      await this.acquireFixedWindow();
    }
  }

  private async acquireSlidingWindow(): Promise<void> {
    const now = Date.now();
    const windowStart = now - this.options.interval;

    this.timestamps = this.timestamps.filter((t) => t > windowStart);

    if (this.timestamps.length >= this.options.maxRequests) {
      const oldestTimestamp = this.timestamps[0];
      const waitTime = oldestTimestamp + this.options.interval - now;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.acquireSlidingWindow();
    }

    this.timestamps.push(now);
  }

  private async acquireFixedWindow(): Promise<void> {
    if (this.timestamps.length >= this.options.maxRequests) {
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.timestamps.length < this.options.maxRequests) {
            clearInterval(checkInterval);
            resolve(undefined);
          }
        }, 100);
      });
    }

    this.timestamps.push(Date.now());
  }

  private resetPeriodically(): void {
    this.timer = setInterval(() => {
      this.timestamps = [];
    }, this.options.interval);
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getAvailableTokens(): number {
    return this.options.maxRequests - this.timestamps.length;
  }
}
```

### Adaptive Throttle

```typescript
interface AdaptiveThrottleOptions {
  initialLimit: number;
  minLimit: number;
  maxLimit: number;
  adaptationFactor: number;
  targetLoad: number;
  measurementWindow: number;
}

class AdaptiveThrottle {
  private currentLimit: number;
  private executionTimes: number[] = [];
  private lastExecutionStart: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(private options: AdaptiveThrottleOptions) {
    this.currentLimit = options.initialLimit;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.timeoutId) {
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.timeoutId) {
            clearInterval(checkInterval);
            resolve(undefined);
          }
        }, 10);
      });
    }

    this.lastExecutionStart = Date.now();

    try {
      const result = await operation();
      this.recordExecution();
      return result;
    } catch (error) {
      this.increaseLimit();
      throw error;
    } finally {
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
      }, this.currentLimit);
    }
  }

  private recordExecution(): void {
    const executionTime = Date.now() - this.lastExecutionStart;
    this.executionTimes.push(executionTime);

    if (this.executionTimes.length > this.options.measurementWindow) {
      this.executionTimes.shift();
    }

    this.adjustLimit();
  }

  private adjustLimit(): void {
    if (this.executionTimes.length < this.options.measurementWindow) {
      return;
    }

    const avgExecutionTime =
      this.executionTimes.reduce((a, b) => a + b) / this.executionTimes.length;
    const load = avgExecutionTime / this.currentLimit;

    if (load > this.options.targetLoad) {
      this.increaseLimit();
    } else if (load < this.options.targetLoad * 0.8) {
      this.decreaseLimit();
    }
  }

  private increaseLimit(): void {
    this.currentLimit = Math.min(
      this.options.maxLimit,
      this.currentLimit * this.options.adaptationFactor
    );
  }

  private decreaseLimit(): void {
    this.currentLimit = Math.max(
      this.options.minLimit,
      this.currentLimit / this.options.adaptationFactor
    );
  }

  getCurrentLimit(): number {
    return this.currentLimit;
  }

  getAverageExecutionTime(): number {
    if (this.executionTimes.length === 0) return 0;
    return (
      this.executionTimes.reduce((a, b) => a + b) / this.executionTimes.length
    );
  }
}
```
