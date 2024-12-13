---
title: Custom setTimeout Examples
description: Create custom timeout implementations in JavaScript. Master advanced timing patterns and timeout management strategies.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Timers
  - Timeouts
  - Custom Implementation
  - Examples
  - Best Practices
image: /web-patterns/images/custom-settimeout-banner.png
---

# Custom setTimeout Examples

This page demonstrates practical examples of implementing and using custom setTimeout functionality with enhanced features and better control.

## Basic Implementation

```typescript:preview
// Basic custom setTimeout with cleanup
class Timer {
  private timers: Map<string, NodeJS.Timeout> = new Map();

  setTimeout(
    callback: () => void,
    delay: number,
    id: string = crypto.randomUUID()
  ): () => void {
    const timeoutId = setTimeout(() => {
      callback();
      this.timers.delete(id);
    }, delay);

    this.timers.set(id, timeoutId);

    return () => {
      clearTimeout(timeoutId);
      this.timers.delete(id);
    };
  }

  clearAll(): void {
    for (const [id, timer] of this.timers) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }
}

// Usage
const timer = new Timer();
const cleanup = timer.setTimeout(() => {
  console.log('Timer executed');
}, 1000);

// Cancel if needed
cleanup();
```

## Promise-based Timer

```typescript:preview
class PromiseTimer {
  private timers: Map<
    string,
    {
      timeout: NodeJS.Timeout;
      reject: (reason?: any) => void;
    }
  > = new Map();

  wait(
    delay: number,
    options: {
      id?: string;
      signal?: AbortSignal;
    } = {}
  ): Promise<void> {
    const id = options.id || crypto.randomUUID();

    return new Promise((resolve, reject) => {
      // Handle abort signal
      if (options.signal?.aborted) {
        reject(new Error('Timer aborted'));
        return;
      }

      const timeout = setTimeout(() => {
        resolve();
        this.timers.delete(id);
      }, delay);

      this.timers.set(id, { timeout, reject });

      // Listen for abort signal
      options.signal?.addEventListener('abort', () => {
        this.cancel(id);
        reject(new Error('Timer aborted'));
      });
    });
  }

  cancel(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer.timeout);
      timer.reject(new Error('Timer cancelled'));
      this.timers.delete(id);
    }
  }

  cancelAll(): void {
    for (const [id] of this.timers) {
      this.cancel(id);
    }
  }
}

// Usage
const promiseTimer = new PromiseTimer();

try {
  await promiseTimer.wait(1000, {
    id: 'operation1',
    signal: abortController.signal,
  });
  console.log('Timer completed');
} catch (error) {
  console.error('Timer cancelled or aborted:', error);
}
```

## Retry Timer

```typescript:preview
class RetryTimer {
  async withRetry<T>(
    operation: () => Promise<T>,
    options: {
      initialDelay: number;
      maxAttempts: number;
      backoffFactor: number;
      maxDelay?: number;
      onRetry?: (attempt: number, delay: number) => void;
    }
  ): Promise<T> {
    let attempt = 0;
    let delay = options.initialDelay;

    while (true) {
      try {
        return await operation();
      } catch (error) {
        attempt++;

        if (attempt >= options.maxAttempts) {
          throw new Error(
            `Operation failed after ${attempt} attempts: ${error}`
          );
        }

        options.onRetry?.(attempt, delay);

        await new Promise((resolve) => setTimeout(resolve, delay));

        delay = Math.min(
          delay * options.backoffFactor,
          options.maxDelay ?? Infinity
        );
      }
    }
  }
}

// Usage
const retryTimer = new RetryTimer();

try {
  const result = await retryTimer.withRetry(
    async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    {
      initialDelay: 1000,
      maxAttempts: 3,
      backoffFactor: 2,
      maxDelay: 5000,
      onRetry: (attempt, delay) => {
        console.log(`Retry attempt ${attempt} after ${delay}ms`);
      },
    }
  );
  console.log('Operation successful:', result);
} catch (error) {
  console.error('Operation failed:', error);
}
```

## Real-World Example: Rate Limited API Client

```typescript:preview
class RateLimitedApiClient {
  private queue: Array<{
    operation: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];
  private processing = false;
  private lastRequestTime = 0;
  private timer: Timer;

  constructor(
    private readonly minRequestInterval: number,
    private readonly maxQueueSize: number = 100
  ) {
    this.timer = new Timer();
  }

  async request<T>(operation: () => Promise<T>): Promise<T> {
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error('Request queue is full');
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ operation, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      const delay = Math.max(0, this.minRequestInterval - timeSinceLastRequest);

      if (delay > 0) {
        await new Promise((resolve) => this.timer.setTimeout(resolve, delay));
      }

      const { operation, resolve, reject } = this.queue.shift()!;

      try {
        const result = await operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }

      this.lastRequestTime = Date.now();
    }

    this.processing = false;
  }

  clearQueue(): void {
    const error = new Error('Request queue cleared');
    this.queue.forEach(({ reject }) => reject(error));
    this.queue = [];
  }
}

// Usage
const apiClient = new RateLimitedApiClient(1000); // 1 request per second

async function fetchUserData(userId: string) {
  return apiClient.request(async () => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  });
}

// Multiple requests will be automatically rate limited
const userIds = ['1', '2', '3', '4', '5'];
const results = await Promise.all(userIds.map((id) => fetchUserData(id)));
```

## Best Practices

1. Cleanup handling:

   ```typescript:preview
   class CleanupTimer {
     private cleanupFns: Set<() => void> = new Set();

     setTimeout(
       callback: () => void,
       delay: number,
       cleanup?: () => void
     ): () => void {
       const timeoutId = setTimeout(() => {
         callback();
         if (cleanup) {
           this.cleanupFns.delete(cleanup);
         }
       }, delay);

       if (cleanup) {
         this.cleanupFns.add(cleanup);
       }

       return () => {
         clearTimeout(timeoutId);
         if (cleanup) {
           cleanup();
           this.cleanupFns.delete(cleanup);
         }
       };
     }

     cleanup(): void {
       for (const cleanup of this.cleanupFns) {
         cleanup();
       }
       this.cleanupFns.clear();
     }
   }
   ```

2. Error handling:

   ```typescript:preview
   class SafeTimer {
     setTimeout<T>(
       operation: () => Promise<T>,
       delay: number,
       errorHandler?: (error: Error) => void
     ): Promise<T> {
       return new Promise((resolve, reject) => {
         const timeoutId = setTimeout(async () => {
           try {
             const result = await operation();
             resolve(result);
           } catch (error) {
             errorHandler?.(error as Error);
             reject(error);
           }
         }, delay);

         return () => {
           clearTimeout(timeoutId);
           reject(new Error('Timer cancelled'));
         };
       });
     }
   }
   ```

3. Resource management:

   ```typescript:preview
   class ResourceTimer {
     private resources: Set<Resource> = new Set();

     async withTimeout<T>(
       resource: Resource,
       operation: () => Promise<T>,
       timeout: number
     ): Promise<T> {
       this.resources.add(resource);

       try {
         return await Promise.race([
           operation(),
           new Promise<never>((_, reject) =>
             setTimeout(() => reject(new Error('Timeout')), timeout)
           ),
         ]);
       } finally {
         this.resources.delete(resource);
         await resource.release();
       }
     }
   }
   ```

4. Debounce utility:

   ```typescript:preview
   function createDebouncedTimer(delay: number) {
     let timeoutId: NodeJS.Timeout;
     let cleanup: (() => void) | null = null;

     return {
       schedule(callback: () => void, newDelay: number = delay): void {
         if (cleanup) {
           cleanup();
         }

         if (timeoutId) {
           clearTimeout(timeoutId);
         }

         timeoutId = setTimeout(() => {
           callback();
           cleanup = null;
         }, newDelay);

         cleanup = () => {
           clearTimeout(timeoutId);
           cleanup = null;
         };
       },

       cancel(): void {
         if (cleanup) {
           cleanup();
         }
       },
     };
   }
   ```
