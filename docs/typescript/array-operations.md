---
title: TypeScript Array Operations Guide
description: Master type-safe array operations in TypeScript. Learn about array manipulation, transformation patterns, and advanced array type utilities.
date: 2024-12-01
author: Underwood Inc
tags:
  - TypeScript
  - Arrays
  - Data Structures
  - Type Safety
  - Performance
  - Algorithms
image: /web-patterns/images/array-operations-banner.png
---

# Array Operations in TypeScript

This section covers type-safe array operations and utility functions for array manipulation.

## Overview

TypeScript provides powerful type checking for array operations. This guide covers common patterns and utilities for working with arrays in a type-safe manner.

## Type-Safe Array Methods

### Filter with Type Predicates

::: code-with-tooltips

```typescript
// Type predicate for non-null values
function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// Usage
const items: (string | null)[] = ['a', null, 'b', undefined, 'c'];
const nonNullItems: string[] = items.filter(isNonNull);
```

:::

### Map with Type Inference

::: code-with-tooltips

```typescript
// Type-safe mapper
function mapToNumbers<T>(array: T[], mapper: (item: T) => number): number[] {
  return array.map(mapper);
}

// Usage
const strings = ['1', '2', '3'];
const numbers = mapToNumbers(strings, (str) => parseInt(str, 10));
```

:::

### Reduce with Accumulator Types

::: code-with-tooltips

```typescript
interface GroupedItems<T> {
  [key: string]: T[];
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): GroupedItems<T> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    return {
      ...acc,
      [key]: [...(acc[key] || []), item],
    };
  }, {} as GroupedItems<T>);
}
```

:::

## Array Utility Functions

### Safe Array Access

::: code-with-tooltips

```typescript
function safeGet<T>(array: T[], index: number, defaultValue: T): T {
  return index >= 0 && index < array.length ? array[index] : defaultValue;
}

// Usage
const arr = [1, 2, 3];
const value = safeGet(arr, 5, 0); // Returns 0
```

:::

### Chunk Array

::: code-with-tooltips

```typescript
function chunk<T>(array: T[], size: number): T[][] {
  return array.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);

    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = [];
    }

    chunks[chunkIndex].push(item);
    return chunks;
  }, [] as T[][]);
}

// Usage
const items = [1, 2, 3, 4, 5];
const chunks = chunk(items, 2); // [[1, 2], [3, 4], [5]]
```

:::

### Unique Values

::: code-with-tooltips

```typescript
function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// With custom comparator
function uniqueBy<T>(array: T[], comparator: (a: T, b: T) => boolean): T[] {
  return array.reduce((uniques, item) => {
    const exists = uniques.some((unique) => comparator(unique, item));
    return exists ? uniques : [...uniques, item];
  }, [] as T[]);
}
```

:::

## Type-Safe Array Transformations

### Tuple Types

::: code-with-tooltips

```typescript
type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

// Usage
function createArray<T>(value: T, length: number): T[] {
  return Array.from({ length }, () => value);
}

function createTuple<T, N extends number>(value: T, length: N): Tuple<T, N> {
  return createArray(value, length) as Tuple<T, N>;
}

// Type-safe fixed-length array
const tuple = createTuple('x', 3); // type is [string, string, string]
```

:::

### Array Element Types

::: code-with-tooltips

```typescript
type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Usage
type Numbers = number[];
type Number = ArrayElement<Numbers>; // type is number

type Mixed = (string | number)[];
type MixedElement = ArrayElement<Mixed>; // type is string | number
```

:::

## Best Practices

1. Type Guards with Arrays:

   ```typescript
   function isArrayOfType<T>(
     value: unknown,
     typeGuard: (item: unknown) => item is T
   ): value is T[] {
     return Array.isArray(value) && value.every((item) => typeGuard(item));
   }
   ```

2. Immutable Array Operations:

   ```typescript
   function insertAt<T>(array: readonly T[], index: number, item: T): T[] {
     return [...array.slice(0, index), item, ...array.slice(index)];
   }
   ```

3. Type-Safe Array Sorting:

   ```typescript
   function typeSafeSort<T>(
     array: T[],
     compareFn: (a: T, b: T) => number
   ): T[] {
     return [...array].sort(compareFn);
   }
   ```

## Real-World Example

::: code-with-tooltips

```typescript
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  lastActive?: Date;
}

class UserCollection {
  private users: User[] = [];

  add(user: User): void {
    this.users.push(user);
  }

  findById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  filterByRole(role: User['role']): User[] {
    return this.users.filter((user) => user.role === role);
  }

  getActiveUsers(): User[] {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return this.users.filter(
      (user) => user.lastActive && user.lastActive > dayAgo
    );
  }

  groupByRole(): Record<User['role'], User[]> {
    return groupBy(this.users, (user) => user.role);
  }

  sortByLastActive(): User[] {
    return typeSafeSort(this.users, (a, b) => {
      const dateA = a.lastActive?.getTime() ?? 0;
      const dateB = b.lastActive?.getTime() ?? 0;
      return dateB - dateA;
    });
  }
}
```

:::

## References

- [TypeScript Handbook - Arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
- [TypeScript Deep Dive - Array Types](https://basarat.gitbook.io/typescript/type-system/type-assertion#array-type-assertion)
