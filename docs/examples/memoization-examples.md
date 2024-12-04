# Memoization Examples

This page demonstrates practical examples of implementing and using memoization patterns to cache function results for better performance.

## Basic Memoization

```typescript
// Basic memoize implementation
function memoize<T extends (...args: any[]) => any>(
  func: T,
  options: {
    maxSize?: number;
    ttl?: number;
  } = {}
): T {
  const cache = new Map<
    string,
    {
      value: ReturnType<T>;
      timestamp: number;
    }
  >();

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached) {
      if (!options.ttl || Date.now() - cached.timestamp < options.ttl) {
        return cached.value;
      }
      cache.delete(key);
    }

    const result = func.apply(this, args);
    cache.set(key, {
      value: result,
      timestamp: Date.now(),
    });

    if (options.maxSize && cache.size > options.maxSize) {
      const oldestKey = Array.from(cache.keys())[0];
      cache.delete(oldestKey);
    }

    return result;
  } as T;
}

// Usage
const expensiveOperation = memoize(
  (n: number): number => {
    console.log('Computing...');
    return n * n;
  },
  {
    maxSize: 100,
    ttl: 60000, // 1 minute
  }
);

console.log(expensiveOperation(5)); // Computes
console.log(expensiveOperation(5)); // Uses cache
```

## Advanced Memoization

```typescript
class MemoizedFunction<T extends (...args: any[]) => any> {
  private cache: Map<
    string,
    {
      value: ReturnType<T>;
      timestamp: number;
      hits: number;
    }
  > = new Map();

  constructor(
    private readonly func: T,
    private readonly options: {
      maxSize?: number;
      ttl?: number;
      keyGenerator?: (...args: Parameters<T>) => string;
      onCacheHit?: (key: string) => void;
      onCacheMiss?: (key: string) => void;
    } = {}
  ) {}

  execute(...args: Parameters<T>): ReturnType<T> {
    const key = this.options.keyGenerator?.(...args) ?? JSON.stringify(args);

    const cached = this.cache.get(key);
    if (cached) {
      if (
        !this.options.ttl ||
        Date.now() - cached.timestamp < this.options.ttl
      ) {
        cached.hits++;
        this.options.onCacheHit?.(key);
        return cached.value;
      }
      this.cache.delete(key);
    }

    this.options.onCacheMiss?.(key);
    const result = this.func.apply(this, args);

    this.cache.set(key, {
      value: result,
      timestamp: Date.now(),
      hits: 1,
    });

    if (this.options.maxSize && this.cache.size > this.options.maxSize) {
      this.evictLeastUsed();
    }

    return result;
  }

  private evictLeastUsed(): void {
    let leastUsedKey: string | undefined;
    let leastHits = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < leastHits) {
        leastHits = entry.hits;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): CacheStats {
    let totalHits = 0;
    let oldestTimestamp = Date.now();

    for (const entry of this.cache.values()) {
      totalHits += entry.hits;
      oldestTimestamp = Math.min(oldestTimestamp, entry.timestamp);
    }

    return {
      size: this.cache.size,
      totalHits,
      oldestEntry: oldestTimestamp,
      hitRate: totalHits / (totalHits + this.cache.size),
    };
  }
}

// Usage
const memoizedFib = new MemoizedFunction(
  (n: number): number => {
    if (n <= 1) return n;
    return memoizedFib.execute(n - 1) + memoizedFib.execute(n - 2);
  },
  {
    maxSize: 1000,
    ttl: 3600000, // 1 hour
    keyGenerator: (n: number) => `fib_${n}`,
    onCacheHit: (key) => {
      console.log(`Cache hit for ${key}`);
    },
    onCacheMiss: (key) => {
      console.log(`Cache miss for ${key}`);
    },
  }
);

console.log(memoizedFib.execute(10));
console.log(memoizedFib.getCacheStats());
```

## Real-World Example: API Response Caching

```typescript
class CachedApiClient {
  private memoizedRequests: Map<string, MemoizedFunction<any>> = new Map();

  constructor(
    private readonly baseUrl: string,
    private readonly options: {
      defaultTTL?: number;
      maxCacheSize?: number;
      onCacheHit?: (endpoint: string) => void;
      onCacheMiss?: (endpoint: string) => void;
    } = {}
  ) {}

  async request<T>(
    endpoint: string,
    options: RequestOptions & {
      ttl?: number;
      bypassCache?: boolean;
    } = {}
  ): Promise<T> {
    if (options.bypassCache) {
      return this.fetchData<T>(endpoint, options);
    }

    const memoized = this.getOrCreateMemoized<T>(endpoint);
    return memoized.execute(options);
  }

  private getOrCreateMemoized<T>(endpoint: string): MemoizedFunction<any> {
    if (!this.memoizedRequests.has(endpoint)) {
      this.memoizedRequests.set(
        endpoint,
        new MemoizedFunction(
          async (options: RequestOptions) =>
            this.fetchData<T>(endpoint, options),
          {
            ttl: this.options.defaultTTL,
            maxSize: this.options.maxCacheSize,
            keyGenerator: (options) => this.generateCacheKey(endpoint, options),
            onCacheHit: () => this.options.onCacheHit?.(endpoint),
            onCacheMiss: () => this.options.onCacheMiss?.(endpoint),
          }
        )
      );
    }

    return this.memoizedRequests.get(endpoint)!;
  }

  private async fetchData<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  private generateCacheKey(endpoint: string, options: RequestOptions): string {
    return JSON.stringify({
      endpoint,
      method: options.method || 'GET',
      body: options.body,
      headers: options.headers,
    });
  }

  clearCache(endpoint?: string): void {
    if (endpoint) {
      this.memoizedRequests.get(endpoint)?.clearCache();
    } else {
      this.memoizedRequests.forEach((memoized) => memoized.clearCache());
    }
  }

  getCacheStats(endpoint?: string): CacheStats {
    if (endpoint) {
      return (
        this.memoizedRequests.get(endpoint)?.getCacheStats() ?? {
          size: 0,
          totalHits: 0,
          oldestEntry: 0,
          hitRate: 0,
        }
      );
    }

    const stats = Array.from(this.memoizedRequests.values()).map((memoized) =>
      memoized.getCacheStats()
    );

    return {
      size: stats.reduce((sum, s) => sum + s.size, 0),
      totalHits: stats.reduce((sum, s) => sum + s.totalHits, 0),
      oldestEntry: Math.min(...stats.map((s) => s.oldestEntry)),
      hitRate: stats.reduce((sum, s) => sum + s.hitRate, 0) / stats.length,
    };
  }
}

// Usage
const apiClient = new CachedApiClient('https://api.example.com', {
  defaultTTL: 300000, // 5 minutes
  maxCacheSize: 1000,
  onCacheHit: (endpoint) => {
    console.log(`Cache hit for ${endpoint}`);
  },
  onCacheMiss: (endpoint) => {
    console.log(`Cache miss for ${endpoint}`);
  },
});

// Make requests
const users = await apiClient.request<User[]>('/users');
const cachedUsers = await apiClient.request<User[]>('/users');
const freshUsers = await apiClient.request<User[]>('/users', {
  bypassCache: true,
});

console.log('Cache stats:', apiClient.getCacheStats());
```

## Best Practices

1. Async memoization:

   ```typescript
   class AsyncMemoized<T extends (...args: any[]) => Promise<any>> {
     private cache = new Map<string, Promise<ReturnType<T>>>();
     private pending = new Set<string>();

     constructor(
       private readonly func: T,
       private readonly options: {
         ttl?: number;
         maxSize?: number;
       } = {}
     ) {}

     async execute(...args: Parameters<T>): Promise<ReturnType<T>> {
       const key = JSON.stringify(args);

       if (this.pending.has(key)) {
         return this.cache.get(key)!;
       }

       if (this.cache.has(key)) {
         return this.cache.get(key)!;
       }

       this.pending.add(key);
       const promise = this.func.apply(this, args).finally(() => {
         this.pending.delete(key);
         if (this.options.ttl) {
           setTimeout(() => {
             this.cache.delete(key);
           }, this.options.ttl);
         }
       });

       this.cache.set(key, promise);
       return promise;
     }
   }
   ```

2. Weak reference caching:

   ```typescript
   class WeakMemoized<T extends (...args: any[]) => any> {
     private cache = new WeakMap<object, ReturnType<T>>();

     constructor(private readonly func: T) {}

     execute(obj: object, ...args: Parameters<T>): ReturnType<T> {
       if (!this.cache.has(obj)) {
         const result = this.func.apply(this, [obj, ...args]);
         this.cache.set(obj, result);
       }
       return this.cache.get(obj)!;
     }
   }
   ```

3. Composite key generation:

   ```typescript
   class CompositeKeyMemoized<T extends (...args: any[]) => any> {
     private cache = new Map<string, ReturnType<T>>();

     constructor(
       private readonly func: T,
       private readonly keyExtractor: (
         ...args: Parameters<T>
       ) => Array<string | number>
     ) {}

     execute(...args: Parameters<T>): ReturnType<T> {
       const keyParts = this.keyExtractor(...args);
       const key = keyParts.join('::');

       if (!this.cache.has(key)) {
         const result = this.func.apply(this, args);
         this.cache.set(key, result);
       }

       return this.cache.get(key)!;
     }
   }
   ```

4. Selective caching:

   ```typescript
   class SelectiveMemoized<T extends (...args: any[]) => any> {
     private cache = new Map<string, ReturnType<T>>();

     constructor(
       private readonly func: T,
       private readonly shouldCache: (
         result: ReturnType<T>,
         ...args: Parameters<T>
       ) => boolean
     ) {}

     execute(...args: Parameters<T>): ReturnType<T> {
       const key = JSON.stringify(args);

       if (this.cache.has(key)) {
         return this.cache.get(key)!;
       }

       const result = this.func.apply(this, args);

       if (this.shouldCache(result, ...args)) {
         this.cache.set(key, result);
       }

       return result;
     }
   }
   ```
