---
title: Memoization Pattern Implementation
description: Learn advanced memoization patterns for optimizing async operations. Master caching strategies, cache invalidation, and memory management.
date: 2024-01-01
author: Underwood Inc
tags:
  - Memoization
  - Caching
  - Performance
  - TypeScript
  - Memory Management
  - Optimization
category: examples
image: /web-patterns/images/memoization-banner.png
---

# Memoization Examples

Learn how to implement memoization patterns for caching and performance optimization.

## Basic Usage

```typescript
// Simple memoization
function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

// Async memoization
function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return async function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = await func(...args);
    cache.set(key, result as any);
    return result;
  };
}
```

## Advanced Patterns

### LRU Cache Memoization

```typescript
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private timestamps = new Map<K, number>();

  constructor(private maxSize: number) {}

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      this.timestamps.set(key, Date.now());
    }
    return value;
  }

  private evictOldest(): void {
    let oldestKey: K | null = null;
    let oldestTime = Infinity;

    for (const [key, time] of this.timestamps.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.timestamps.delete(oldestKey);
    }
  }

  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

function memoizeWithLRU<T extends (...args: any[]) => any>(
  func: T,
  maxSize: number = 100
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new LRUCache<string, ReturnType<T>>(maxSize);

  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached !== undefined) {
      return cached;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}
```

### Time-based Memoization

```typescript
interface TimedCacheOptions {
  ttl: number;
  maxSize?: number;
  onExpire?: (key: string) => void;
}

class TimedCache<T> {
  private cache = new Map<
    string,
    {
      value: T;
      expiry: number;
    }
  >();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private options: TimedCacheOptions) {
    this.cleanupInterval = setInterval(() => this.cleanup(), options.ttl / 2);
  }

  set(key: string, value: T): void {
    if (
      this.options.maxSize &&
      this.cache.size >= this.options.maxSize &&
      !this.cache.has(key)
    ) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + this.options.ttl,
    });
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      if (this.options.onExpire) {
        this.options.onExpire(key);
      }
      return undefined;
    }

    return entry.value;
  }

  private cleanup(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
        if (this.options.onExpire) {
          this.options.onExpire(key);
        }
      }
    }
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry < oldestTime) {
        oldestTime = entry.expiry;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

function memoizeWithTTL<T extends (...args: any[]) => any>(
  func: T,
  options: TimedCacheOptions
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new TimedCache<ReturnType<T>>(options);

  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached !== undefined) {
      return cached;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}
```

### Smart Memoization

```typescript
interface SmartMemoOptions<T> {
  maxSize: number;
  ttl: number;
  keyGenerator?: (...args: any[]) => string;
  shouldCache?: (result: T) => boolean;
  onEvict?: (key: string, value: T) => void;
}

class SmartMemoization<T extends (...args: any[]) => any> {
  private cache = new Map<
    string,
    {
      value: ReturnType<T>;
      expiry: number;
      hits: number;
      lastAccess: number;
    }
  >();

  constructor(
    private func: T,
    private options: SmartMemoOptions<ReturnType<T>>
  ) {}

  execute(...args: Parameters<T>): ReturnType<T> {
    const key = this.options.keyGenerator?.(args) ?? JSON.stringify(args);
    const now = Date.now();
    const entry = this.cache.get(key);

    if (entry && now < entry.expiry) {
      entry.hits++;
      entry.lastAccess = now;
      return entry.value;
    }

    const result = this.func(...args);

    if (!this.options.shouldCache || this.options.shouldCache(result)) {
      if (this.cache.size >= this.options.maxSize) {
        this.evict();
      }

      this.cache.set(key, {
        value: result,
        expiry: now + this.options.ttl,
        hits: 1,
        lastAccess: now,
      });
    }

    return result;
  }

  private evict(): void {
    let lowestScore = Infinity;
    let keyToEvict: string | null = null;

    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      // Score based on hits, recency, and remaining TTL
      const age = now - entry.lastAccess;
      const remainingTTL = entry.expiry - now;
      const score = (entry.hits / age) * (remainingTTL / this.options.ttl);

      if (score < lowestScore) {
        lowestScore = score;
        keyToEvict = key;
      }
    }

    if (keyToEvict) {
      const entry = this.cache.get(keyToEvict)!;
      this.cache.delete(keyToEvict);

      if (this.options.onEvict) {
        this.options.onEvict(keyToEvict, entry.value);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): {
    size: number;
    hitRates: Map<string, number>;
    averageHits: number;
  } {
    const hitRates = new Map<string, number>();
    let totalHits = 0;

    for (const [key, entry] of this.cache.entries()) {
      hitRates.set(key, entry.hits);
      totalHits += entry.hits;
    }

    return {
      size: this.cache.size,
      hitRates,
      averageHits: totalHits / Math.max(1, this.cache.size),
    };
  }
}
```
