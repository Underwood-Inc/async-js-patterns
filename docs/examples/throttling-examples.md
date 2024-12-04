# Throttling Examples

This page demonstrates practical examples of implementing and using throttling patterns to limit the rate of function execution.

## Basic Throttling

```typescript:preview
// Basic throttle implementation
function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastTime = 0;

  return function (this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      lastTime = now;
      func.apply(this, args);
    } else if (!timeoutId && options.trailing !== false) {
      lastArgs = args;
      timeoutId = setTimeout(() => {
        lastTime = Date.now();
        timeoutId = undefined;
        func.apply(this, lastArgs!);
      }, remaining);
    }
  };
}

// Usage
const handleScroll = throttle(
  () => {
    console.log('Scroll position:', window.scrollY);
  },
  200,
  { trailing: true }
);

window.addEventListener('scroll', handleScroll);
```

## Advanced Throttling

```typescript:preview
class ThrottledFunction<T extends (...args: any[]) => any> {
  private timeoutId?: NodeJS.Timeout;
  private lastArgs?: Parameters<T>;
  private lastTime = 0;
  private queuedPromise?: {
    resolve: (value: ReturnType<T>) => void;
    reject: (reason: any) => void;
  };

  constructor(
    private readonly func: T,
    private readonly wait: number,
    private readonly options: {
      leading?: boolean;
      trailing?: boolean;
      maxWait?: number;
    } = {}
  ) {}

  async execute(...args: Parameters<T>): Promise<ReturnType<T>> {
    const now = Date.now();
    const remaining = this.wait - (now - this.lastTime);

    if (remaining <= 0 || remaining > this.wait) {
      return this.executeNow(args);
    }

    return this.queueExecution(args, remaining);
  }

  private async executeNow(args: Parameters<T>): Promise<ReturnType<T>> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.lastTime = Date.now();
    return this.func.apply(this, args);
  }

  private queueExecution(
    args: Parameters<T>,
    delay: number
  ): Promise<ReturnType<T>> {
    this.lastArgs = args;

    // If there's already a queued execution, return its promise
    if (this.queuedPromise) {
      return new Promise((resolve, reject) => {
        this.queuedPromise = { resolve, reject };
      });
    }

    return new Promise((resolve, reject) => {
      this.queuedPromise = { resolve, reject };

      this.timeoutId = setTimeout(async () => {
        try {
          const result = await this.executeNow(this.lastArgs!);
          this.queuedPromise?.resolve(result);
        } catch (error) {
          this.queuedPromise?.reject(error);
        } finally {
          this.queuedPromise = undefined;
          this.timeoutId = undefined;
        }
      }, delay);
    });
  }

  cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    if (this.queuedPromise) {
      this.queuedPromise.reject(new Error('Throttled operation cancelled'));
      this.queuedPromise = undefined;
    }
  }
}

// Usage
const throttledAPI = new ThrottledFunction(
  async (data: any) => {
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  1000,
  { trailing: true }
);

// Event handler
async function handleDataUpdate(data: any): Promise<void> {
  try {
    const result = await throttledAPI.execute(data);
    console.log('Update successful:', result);
  } catch (error) {
    console.error('Update failed:', error);
  }
}
```

## Real-World Example: Rate Limited API Client

```typescript:preview
class RateLimitedClient {
  private throttledRequests: Map<string, ThrottledFunction<any>> = new Map();
  private rateLimits: Map<string, RateLimit> = new Map();

  constructor(
    private readonly baseUrl: string,
    private readonly options: {
      defaultRateLimit: number;
      maxRetries?: number;
      onRateLimitExceeded?: (endpoint: string) => void;
    }
  ) {}

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const throttled = this.getOrCreateThrottled(endpoint);

    try {
      return await throttled.execute(options);
    } catch (error) {
      if (this.isRateLimitError(error)) {
        this.updateRateLimit(endpoint, error as Error);
        this.options.onRateLimitExceeded?.(endpoint);
        return this.retryWithBackoff(endpoint, options);
      }
      throw error;
    }
  }

  private getOrCreateThrottled(endpoint: string): ThrottledFunction<any> {
    if (!this.throttledRequests.has(endpoint)) {
      const rateLimit =
        this.rateLimits.get(endpoint)?.limit ?? this.options.defaultRateLimit;

      this.throttledRequests.set(
        endpoint,
        new ThrottledFunction(
          async (options: RequestOptions) => {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);

            if (!response.ok) {
              throw new HttpError(response.status, response.statusText);
            }

            this.updateRateLimitHeaders(endpoint, response.headers);
            return response.json();
          },
          1000 / rateLimit,
          { trailing: true }
        )
      );
    }

    return this.throttledRequests.get(endpoint)!;
  }

  private updateRateLimitHeaders(endpoint: string, headers: Headers): void {
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');

    if (limit && remaining && reset) {
      this.rateLimits.set(endpoint, {
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        reset: parseInt(reset),
      });
    }
  }

  private async retryWithBackoff<T>(
    endpoint: string,
    options: RequestOptions,
    attempt: number = 1
  ): Promise<T> {
    if (attempt > (this.options.maxRetries ?? 3)) {
      throw new Error('Max retries exceeded');
    }

    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.request<T>(endpoint, options);
  }

  private isRateLimitError(error: any): boolean {
    return error instanceof HttpError && error.status === 429;
  }

  private updateRateLimit(endpoint: string, error: Error): void {
    // Update rate limit based on error response
    const rateLimit = this.extractRateLimit(error);
    if (rateLimit) {
      this.rateLimits.set(endpoint, rateLimit);
      this.recreateThrottled(endpoint);
    }
  }

  private recreateThrottled(endpoint: string): void {
    const throttled = this.throttledRequests.get(endpoint);
    if (throttled) {
      throttled.cancel();
      this.throttledRequests.delete(endpoint);
    }
  }

  private extractRateLimit(error: Error): RateLimit | null {
    // Extract rate limit information from error
    // Implementation depends on API error format
    return null;
  }
}

// Usage
const client = new RateLimitedClient('https://api.example.com', {
  defaultRateLimit: 10,
  maxRetries: 3,
  onRateLimitExceeded: (endpoint) => {
    console.warn(`Rate limit exceeded for ${endpoint}`);
  },
});

// Make requests
try {
  const [users, posts] = await Promise.all([
    client.request<User[]>('/users'),
    client.request<Post[]>('/posts'),
  ]);
  console.log('Data fetched:', { users, posts });
} catch (error) {
  console.error('Failed to fetch data:', error);
}
```

## Best Practices

1. Window-based throttling:

   ```typescript:preview
   class WindowThrottle<T extends (...args: any[]) => any> {
     private window: Array<{
       timestamp: number;
       result: ReturnType<T>;
     }> = [];

     constructor(
       private readonly func: T,
       private readonly maxRequests: number,
       private readonly windowMs: number
     ) {}

     async execute(...args: Parameters<T>): Promise<ReturnType<T>> {
       this.cleanWindow();

       if (this.window.length >= this.maxRequests) {
         const oldestTimestamp = this.window[0].timestamp;
         const waitTime = this.windowMs - (Date.now() - oldestTimestamp);

         if (waitTime > 0) {
           await new Promise((resolve) => setTimeout(resolve, waitTime));
         }
       }

       const result = await this.func.apply(this, args);
       this.window.push({
         timestamp: Date.now(),
         result,
       });

       return result;
     }

     private cleanWindow(): void {
       const now = Date.now();
       while (
         this.window.length > 0 &&
         now - this.window[0].timestamp >= this.windowMs
       ) {
         this.window.shift();
       }
     }
   }
   ```

2. Resource-aware throttling:

   ```typescript:preview
   class ResourceThrottle<T extends (...args: any[]) => any> {
     private resourceUsage: number = 0;
     private readonly maxResources: number;
     private queue: Array<{
       args: Parameters<T>;
       resolve: (value: ReturnType<T>) => void;
       reject: (reason: any) => void;
     }> = [];

     constructor(
       private readonly func: T,
       maxResources: number
     ) {
       this.maxResources = maxResources;
     }

     async execute(...args: Parameters<T>): Promise<ReturnType<T>> {
       if (this.resourceUsage < this.maxResources) {
         return this.executeNow(args);
       }

       return new Promise((resolve, reject) => {
         this.queue.push({ args, resolve, reject });
       });
     }

     private async executeNow(args: Parameters<T>): Promise<ReturnType<T>> {
       this.resourceUsage++;
       try {
         const result = await this.func.apply(this, args);
         return result;
       } finally {
         this.resourceUsage--;
         this.processQueue();
       }
     }

     private processQueue(): void {
       if (this.queue.length > 0 && this.resourceUsage < this.maxResources) {
         const next = this.queue.shift()!;
         this.executeNow(next.args).then(next.resolve).catch(next.reject);
       }
     }
   }
   ```

3. Priority throttling:

   ```typescript:preview
   class PriorityThrottle<T extends (...args: any[]) => any> {
     private queues: Map<
       Priority,
       Array<{
         args: Parameters<T>;
         resolve: (value: ReturnType<T>) => void;
         reject: (reason: any) => void;
       }>
     > = new Map();
     private processing = false;

     constructor(
       private readonly func: T,
       private readonly requestsPerSecond: number
     ) {
       this.queues.set('high', []);
       this.queues.set('medium', []);
       this.queues.set('low', []);
     }

     async execute(
       priority: Priority,
       ...args: Parameters<T>
     ): Promise<ReturnType<T>> {
       return new Promise((resolve, reject) => {
         this.queues.get(priority)!.push({
           args,
           resolve,
           reject,
         });
         this.processQueues();
       });
     }

     private async processQueues(): Promise<void> {
       if (this.processing) return;
       this.processing = true;

       while (true) {
         const next = this.getNextRequest();
         if (!next) break;

         try {
           const result = await this.func.apply(this, next.args);
           next.resolve(result);
         } catch (error) {
           next.reject(error);
         }

         await new Promise((resolve) =>
           setTimeout(resolve, 1000 / this.requestsPerSecond)
         );
       }

       this.processing = false;
     }

     private getNextRequest() {
       for (const priority of ['high', 'medium', 'low']) {
         const queue = this.queues.get(priority as Priority)!;
         if (queue.length > 0) {
           return queue.shift()!;
         }
       }
       return null;
     }
   }
   ```

4. Adaptive throttling:

   ```typescript:preview
   class AdaptiveThrottle<T extends (...args: any[]) => any> {
     private metrics: {
       successCount: number;
       errorCount: number;
       totalLatency: number;
       windowStart: number;
     } = {
       successCount: 0,
       errorCount: 0,
       totalLatency: 0,
       windowStart: Date.now(),
     };

     constructor(
       private readonly func: T,
       private readonly options: {
         initialRate: number;
         minRate: number;
         maxRate: number;
         windowMs: number;
         targetLatency: number;
       }
     ) {}

     async execute(...args: Parameters<T>): Promise<ReturnType<T>> {
       this.updateMetrics();

       const currentRate = this.calculateRate();
       const delay = 1000 / currentRate;

       await new Promise((resolve) => setTimeout(resolve, delay));

       const startTime = Date.now();
       try {
         const result = await this.func.apply(this, args);
         this.recordSuccess(Date.now() - startTime);
         return result;
       } catch (error) {
         this.recordError();
         throw error;
       }
     }

     private updateMetrics(): void {
       const now = Date.now();
       if (now - this.metrics.windowStart >= this.options.windowMs) {
         this.metrics = {
           successCount: 0,
           errorCount: 0,
           totalLatency: 0,
           windowStart: now,
         };
       }
     }

     private calculateRate(): number {
       const totalRequests =
         this.metrics.successCount + this.metrics.errorCount;

       if (totalRequests === 0) {
         return this.options.initialRate;
       }

       const avgLatency = this.metrics.totalLatency / this.metrics.successCount;
       const errorRate = this.metrics.errorCount / totalRequests;

       let rate = this.options.initialRate;

       if (avgLatency > this.options.targetLatency) {
         rate *= 0.8; // Decrease rate
       } else if (errorRate < 0.1) {
         rate *= 1.2; // Increase rate
       }

       return Math.min(
         Math.max(rate, this.options.minRate),
         this.options.maxRate
       );
     }

     private recordSuccess(latency: number): void {
       this.metrics.successCount++;
       this.metrics.totalLatency += latency;
     }

     private recordError(): void {
       this.metrics.errorCount++;
     }
   }
   ```
