# Type Inference in TypeScript

This section explores TypeScript's type inference capabilities and best practices for leveraging them effectively.

## Overview

Type inference is TypeScript's ability to automatically determine types based on context. Understanding how inference works helps write more concise and maintainable code.

## Basic Type Inference

### Variable Initialization

```typescript
// Type: string
let name = 'John';

// Type: number
let age = 30;

// Type: boolean
let isActive = true;

// Type: string[]
let fruits = ['apple', 'banana', 'orange'];

// Type: { name: string, age: number }
let person = {
  name: 'John',
  age: 30,
};
```

### Function Return Types

```typescript
// Return type: number
function add(a: number, b: number) {
  return a + b;
}

// Return type: string
function greet(name: string) {
  return `Hello, ${name}!`;
}

// Return type: boolean
function isEven(num: number) {
  return num % 2 === 0;
}
```

## Advanced Inference

### Generic Type Inference

```typescript
// Type parameter T is inferred
function identity<T>(value: T): T {
  return value;
}

// Type: string
const str = identity('hello');

// Type: number
const num = identity(42);

// Type: { name: string }
const obj = identity({ name: 'John' });
```

### Array Method Inference

```typescript
const numbers = [1, 2, 3, 4, 5];

// Type: number[]
const doubled = numbers.map((n) => n * 2);

// Type: number[]
const evenNumbers = numbers.filter((n) => n % 2 === 0);

// Type: number
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Type: { value: number }[]
const objects = numbers.map((n) => ({ value: n }));
```

## Contextual Typing

### Event Handlers

```typescript
const button = document.querySelector('button');

button?.addEventListener('click', (event) => {
  // event is inferred as MouseEvent
  console.log(event.clientX, event.clientY);
});

window.addEventListener('keydown', (event) => {
  // event is inferred as KeyboardEvent
  console.log(event.key, event.code);
});
```

### Promise Callbacks

```typescript
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  // result is inferred as any
  const result = await response.json();
  return result;
}

// Better type inference with generics
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  // result is inferred as T
  const result = await response.json();
  return result;
}
```

## Real-World Example

```typescript
// Domain types
interface User {
  id: string;
  name: string;
  email: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

// Service class with inferred types
class DataService {
  private cache = new Map<string, unknown>();

  // Method with inferred return type
  async fetchOne<T>(resource: string, id: string) {
    const cacheKey = `${resource}:${id}`;

    if (this.cache.has(cacheKey)) {
      // Type is inferred from Map's value type
      return this.cache.get(cacheKey) as T;
    }

    const response = await fetch(`/api/${resource}/${id}`);
    const data = await response.json();

    this.cache.set(cacheKey, data);
    return data as T;
  }

  // Method with inferred array type
  async fetchMany<T>(resource: string, query = {}) {
    const params = new URLSearchParams(query as Record<string, string>);
    const response = await fetch(`/api/${resource}?${params}`);
    const data = await response.json();
    return data as T[];
  }

  // Method with inferred mapped type
  async fetchRelated<T, R>(resource: string, id: string, relation: string) {
    const response = await fetch(`/api/${resource}/${id}/${relation}`);
    const data = await response.json();
    return data as R[];
  }
}

// Usage with type inference
async function getUserWithPosts(userId: string) {
  const service = new DataService();

  // user is inferred as User
  const user = await service.fetchOne<User>('users', userId);

  // posts is inferred as Post[]
  const posts = await service.fetchRelated<User, Post>(
    'users',
    userId,
    'posts'
  );

  return {
    user,
    posts,
    // postCount is inferred as number
    postCount: posts.length,
    // hasPublished is inferred as boolean
    hasPublished: posts.length > 0,
    // latestPost is inferred as Post | undefined
    latestPost: posts.sort(
      (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()
    )[0],
  };
}

// Type inference with array methods
function processUserData(users: User[]) {
  // emailMap is inferred as Map<string, User>
  const emailMap = new Map(users.map((user) => [user.email, user]));

  // usersByDomain is inferred as Map<string, User[]>
  const usersByDomain = users.reduce((acc, user) => {
    const domain = user.email.split('@')[1];
    return acc.set(domain, [...(acc.get(domain) || []), user]);
  }, new Map<string, User[]>());

  // stats is inferred as { domain: string, count: number }[]
  const stats = Array.from(usersByDomain.entries()).map(([domain, users]) => ({
    domain,
    count: users.length,
  }));

  return {
    emailMap,
    usersByDomain,
    stats,
  };
}
```

## Best Practices

1. Type Inference Usage:

   - Let TypeScript infer simple types
   - Explicitly type complex structures
   - Use type annotations for clarity

2. Generic Type Inference:

   - Leverage generic type parameters
   - Use constraints when needed
   - Provide type hints when inference fails

3. Return Type Inference:
   - Allow inference for simple functions
   - Explicitly type complex return types
   - Use type annotations for public APIs

## References

- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [TypeScript Deep Dive - Type Inference](https://basarat.gitbook.io/typescript/type-system/type-inference)
