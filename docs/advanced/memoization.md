# Memoization

## Overview

Memoization is an optimization technique that speeds up applications by storing the results of expensive function calls and returning the cached result when the same inputs occur again. This technique trades memory space for improved performance by eliminating redundant computations.

### Real-World Analogy

Think of memoization like a chef's mise en place (prepared ingredients):

- Instead of chopping vegetables every time they're needed, the chef preps them once
- The prepped ingredients (cached results) are stored and ready to use
- When the same ingredient is needed again, it's immediately available
- If a new ingredient is needed, it's prepared and added to the collection
- Old, unused preparations might be discarded to save space (cache invalidation)

### Common Use Cases

1. **Complex Calculations**

   - Problem: Expensive mathematical computations being repeated
   - Solution: Cache results based on input parameters
   - Benefit: Significant performance improvement for repeated calculations

2. **API Response Caching**

   - Problem: Frequent identical API calls wasting bandwidth
   - Solution: Cache responses for a set period
   - Benefit: Reduced server load and faster response times

3. **UI Component Rendering**
   - Problem: Expensive re-renders with same props
   - Solution: Memoize component based on props
   - Benefit: Smoother UI performance and reduced computation

### How It Works

1. **Function Call**

   - Function receives arguments
   - Cache key is generated from arguments

2. **Cache Check**

   - Check if result exists in cache
   - If found, return cached result
   - If not, execute function

3. **Result Storage**

   - Store new result in cache
   - Associate with arguments key
   - Handle cache size limits

4. **Cache Management**
   - Implement expiration strategy
   - Handle cache invalidation
   - Manage memory usage

## Implementation

```typescript
interface MemoizeOptions<T> {
  maxSize?: number;
  maxAge?: number;
  keyGenerator?: (...args: any[]) => string;
  onEvict?: (key: string, value: T) => void;
  shouldCache?: (value: T) => boolean;
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hits: number;
}

class Memoizer<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private readonly options: Required<MemoizeOptions<T>>;

  constructor(options: MemoizeOptions<T> = {}) {
    this.options = {
      maxSize: options.maxSize || 1000,
      maxAge: options.maxAge || 5 * 60 * 1000, // 5 minutes
      keyGenerator: options.keyGenerator || JSON.stringify,
      onEvict: options.onEvict || (() => {}),
      shouldCache: options.shouldCache || (() => true),
    };
  }

  async memoize(
    fn: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> {
    const key = this.options.keyGenerator(...args);

    // Check cache and validate age
    const cached = this.cache.get(key);
    if (cached) {
      const age = Date.now() - cached.timestamp;
      if (age < this.options.maxAge) {
        cached.hits++;
        return cached.value;
      }
      this.evict(key);
    }

    // Execute function and cache result
    const result = await fn(...args);

    if (this.options.shouldCache(result)) {
      this.set(key, result);
    }

    return result;
  }

  private set(key: string, value: T): void {
    // Ensure cache size limit
    if (this.cache.size >= this.options.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 1,
    });
  }

  private evict(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.options.onEvict(key, entry.value);
      this.cache.delete(key);
    }
  }

  private evictLeastUsed(): void {
    let leastUsedKey: string | null = null;
    let leastHits = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < leastHits) {
        leastHits = entry.hits;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.evict(leastUsedKey);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheStats(): { size: number; hits: number } {
    let totalHits = 0;
    this.cache.forEach((entry) => {
      totalHits += entry.hits;
    });
    return {
      size: this.cache.size,
      hits: totalHits,
    };
  }
}
```

## Usage Example

```typescript
// Basic API caching
const apiMemoizer = new Memoizer<any>({
  maxAge: 60000, // 1 minute cache
  maxSize: 100, // Max 100 cached responses
});

const fetchUserData = async (userId: string) => {
  return apiMemoizer.memoize(async (id) => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }, userId);
};

// With custom key generation
const searchMemoizer = new Memoizer<any>({
  keyGenerator: (query, filters) =>
    `${query}-${Object.entries(filters).sort().join('-')}`,
});

const searchApi = async (query: string, filters: object) => {
  return searchMemoizer.memoize(
    async (q, f) => {
      const response = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query: q, filters: f }),
      });
      return response.json();
    },
    query,
    filters
  );
};

// With selective caching
const dataMemoizer = new Memoizer<any>({
  shouldCache: (result) => {
    return result.status === 'success' && !result.error;
  },
  onEvict: (key, value) => {
    console.log(`Evicting cache for key: ${key}`);
  },
});
```

## Key Concepts

1. **Cache Management**: Size and age limits
2. **Key Generation**: Custom key creation
3. **Eviction Policies**: LRU-based removal
4. **Cache Statistics**: Usage tracking
5. **Selective Caching**: Conditional storage

## Edge Cases

- Race conditions
- Memory limitations
- Cache invalidation
- Error handling
- Stale data

## Common Pitfalls

1. **Memory Leaks**: Unbounded cache growth
2. **Stale Data**: Outdated cached values
3. **Key Collisions**: Improper key generation
4. **Promise Handling**: Async edge cases

## Best Practices

1. Set appropriate cache limits
2. Implement proper key generation
3. Handle cache invalidation
4. Monitor cache statistics
5. Consider memory constraints

## Testing

```typescript
// Test basic caching
const cachingTest = async () => {
  let callCount = 0;
  const memoizer = new Memoizer<number>();

  const expensive = async (n: number) => {
    callCount++;
    return n * 2;
  };

  // First call
  const result1 = await memoizer.memoize(expensive, 5);
  // Second call (should use cache)
  const result2 = await memoizer.memoize(expensive, 5);

  console.assert(callCount === 1, 'Should only call function once');
  console.assert(result1 === result2, 'Should return same result');
};

// Test cache expiration
const expirationTest = async () => {
  const memoizer = new Memoizer<number>({
    maxAge: 100, // 100ms cache
  });

  const value = await memoizer.memoize(async () => Date.now(), 'key');

  await new Promise((resolve) => setTimeout(resolve, 150));

  const newValue = await memoizer.memoize(async () => Date.now(), 'key');

  console.assert(value !== newValue, 'Should refresh after expiration');
};
```

## Advanced Usage

```typescript
// With cache warming
class PreloadingMemoizer<T> extends Memoizer<T> {
  async preload(
    fn: (...args: any[]) => Promise<T>,
    argsList: any[][]
  ): Promise<void> {
    await Promise.all(argsList.map((args) => this.memoize(fn, ...args)));
  }
}

// Usage with preloading
const userMemoizer = new PreloadingMemoizer<any>();

// Warm cache with common user IDs
await userMemoizer.preload(fetchUserData, [['user1'], ['user2'], ['user3']]);

// With batch cache invalidation
class BatchMemoizer<T> extends Memoizer<T> {
  private patterns: Map<string, RegExp> = new Map();

  invalidatePattern(pattern: string): void {
    const regex = this.patterns.get(pattern) || new RegExp(pattern);
    this.patterns.set(pattern, regex);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.evict(key);
      }
    }
  }
}

// Usage with pattern invalidation
const batchMemoizer = new BatchMemoizer();
batchMemoizer.invalidatePattern('user.*');
```
