# Array Utilities in TypeScript

This section provides a collection of type-safe array utility functions and patterns for common array operations.

## Overview

Array utilities help you perform common array operations in a type-safe manner while maintaining code readability and reusability.

## Basic Utilities

### Array Creation

```typescript
function createArray<T>(length: number, defaultValue: T): T[] {
  return Array(length).fill(defaultValue);
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// Usage
const zeros = createArray(5, 0); // [0, 0, 0, 0, 0]
const numbers = range(1, 5); // [1, 2, 3, 4]
const uniqueValues = unique([1, 2, 2, 3, 3, 4]); // [1, 2, 3, 4]
```

### Array Manipulation

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

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function rotate<T>(array: T[], offset: number): T[] {
  const normalizedOffset = offset % array.length;
  return [
    ...array.slice(normalizedOffset),
    ...array.slice(0, normalizedOffset),
  ];
}

// Usage
const chunks = chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
const shuffled = shuffle([1, 2, 3, 4, 5]); // Random order
const rotated = rotate([1, 2, 3, 4, 5], 2); // [3, 4, 5, 1, 2]
```

## Advanced Utilities

### Array Type Checking

```typescript
function isArrayOf<T>(
  array: unknown,
  typeGuard: (item: unknown) => item is T
): array is T[] {
  return Array.isArray(array) && array.every(typeGuard);
}

function hasMinLength<T>(array: T[], minLength: number): array is [T, ...T[]] {
  return array.length >= minLength;
}

function isUnique<T>(array: T[]): boolean {
  return new Set(array).size === array.length;
}

// Usage
const numbers = [1, 2, 3];
if (isArrayOf(numbers, (x): x is number => typeof x === 'number')) {
  // numbers is type number[]
}

const nonEmpty = [1, 2, 3];
if (hasMinLength(nonEmpty, 1)) {
  // nonEmpty is type [number, ...number[]]
}

console.log(isUnique([1, 2, 3])); // true
console.log(isUnique([1, 2, 2, 3])); // false
```

### Array Transformations

```typescript
function groupBy<T, K extends string | number | symbol>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = getKey(item);
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    },
    {} as Record<K, T[]>
  );
}

function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  return array.reduce(
    ([pass, fail], item) => {
      return predicate(item)
        ? [[...pass, item], fail]
        : [pass, [...fail, item]];
    },
    [[], []] as [T[], T[]]
  );
}

function zip<T, U>(first: T[], second: U[]): [T, U][] {
  const length = Math.min(first.length, second.length);
  return Array.from({ length }, (_, i) => [first[i], second[i]]);
}

// Usage
const users = [
  { id: 1, role: 'admin' },
  { id: 2, role: 'user' },
  { id: 3, role: 'admin' },
];

const byRole = groupBy(users, (user) => user.role);
// {
//   admin: [{ id: 1, role: 'admin' }, { id: 3, role: 'admin' }],
//   user: [{ id: 2, role: 'user' }]
// }

const [admins, nonAdmins] = partition(users, (user) => user.role === 'admin');
const pairs = zip([1, 2, 3], ['a', 'b', 'c']); // [[1, 'a'], [2, 'b'], [3, 'c']]
```

## Real-World Example

```typescript
// Array utility class with common operations
class ArrayUtils<T> {
  constructor(private readonly items: T[]) {}

  // Basic operations
  get length(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }

  // Transformations
  map<U>(fn: (item: T) => U): ArrayUtils<U> {
    return new ArrayUtils(this.items.map(fn));
  }

  filter(predicate: (item: T) => boolean): ArrayUtils<T> {
    return new ArrayUtils(this.items.filter(predicate));
  }

  // Aggregations
  reduce<U>(fn: (acc: U, item: T) => U, initial: U): U {
    return this.items.reduce(fn, initial);
  }

  // Utility methods
  chunk(size: number): ArrayUtils<T[]> {
    return new ArrayUtils(chunk(this.items, size));
  }

  shuffle(): ArrayUtils<T> {
    return new ArrayUtils(shuffle(this.items));
  }

  unique(comparator?: (a: T, b: T) => boolean): ArrayUtils<T> {
    if (comparator) {
      return new ArrayUtils(
        this.items.filter(
          (item, index) =>
            this.items.findIndex((other) => comparator(item, other)) === index
        )
      );
    }
    return new ArrayUtils(unique(this.items));
  }

  groupBy<K extends string | number | symbol>(
    getKey: (item: T) => K
  ): Record<K, T[]> {
    return groupBy(this.items, getKey);
  }

  partition(predicate: (item: T) => boolean): [ArrayUtils<T>, ArrayUtils<T>] {
    const [pass, fail] = partition(this.items, predicate);
    return [new ArrayUtils(pass), new ArrayUtils(fail)];
  }

  // Statistics (for numeric arrays)
  sum(this: ArrayUtils<number>): number {
    return this.items.reduce((sum, n) => sum + n, 0);
  }

  average(this: ArrayUtils<number>): number {
    if (this.length === 0) throw new Error('Cannot average empty array');
    return this.sum() / this.length;
  }

  min(this: ArrayUtils<number>): number {
    if (this.length === 0) throw new Error('Cannot get min of empty array');
    return Math.min(...this.items);
  }

  max(this: ArrayUtils<number>): number {
    if (this.length === 0) throw new Error('Cannot get max of empty array');
    return Math.max(...this.items);
  }
}

// Usage example
interface User {
  id: number;
  name: string;
  age: number;
  role: 'admin' | 'user';
}

const users: User[] = [
  { id: 1, name: 'John', age: 30, role: 'admin' },
  { id: 2, name: 'Jane', age: 25, role: 'user' },
  { id: 3, name: 'Bob', age: 35, role: 'admin' },
  { id: 4, name: 'Alice', age: 28, role: 'user' },
];

const utils = new ArrayUtils(users);

// Get unique roles
const roles = utils
  .map((user) => user.role)
  .unique()
  .toArray();

// Group users by role
const usersByRole = utils.groupBy((user) => user.role);

// Get admin and non-admin users
const [admins, nonAdmins] = utils.partition((user) => user.role === 'admin');

// Get average age
const averageAge = utils.map((user) => user.age).average();

// Get users in random order, chunked by 2
const randomPairs = utils.shuffle().chunk(2).toArray();

console.log({
  roles,
  usersByRole,
  adminCount: admins.length,
  nonAdminCount: nonAdmins.length,
  averageAge,
  randomPairs,
});
```

## Best Practices

1. Type Safety:

   - Use generic type parameters
   - Implement proper type guards
   - Validate array contents

2. Performance:

   - Minimize array copies
   - Use appropriate data structures
   - Consider lazy evaluation

3. Reusability:
   - Create composable utilities
   - Document edge cases
   - Handle error conditions

## References

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Deep Dive - Array Types](https://basarat.gitbook.io/typescript/type-system/type-assertion#array-type-assertion)
