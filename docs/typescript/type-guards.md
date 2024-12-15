---
title: TypeScript Type Guards Guide
description: Master type guards in TypeScript. Learn about type narrowing, custom type guards, assertion functions, and type safety patterns.
date: 2024-12-01
author: Underwood Inc
tags:
  - TypeScript
  - Type Guards
  - Type Safety
  - Type Narrowing
  - Type System
  - Error Handling
image: /web-patterns/images/type-guards-banner.png
---

# Type Guards in TypeScript

This section covers TypeScript type guards and their practical applications in type narrowing.

## Overview

Type guards are expressions that perform runtime checks to guarantee the type of a value in a given scope. They help TypeScript narrow down the type of a variable within conditional blocks.

## Basic Type Guards

### typeof Type Guard

::: code-with-tooltips

```typescript
function processValue(value: string | number) {
  if (typeof value === 'string') {
    // TypeScript knows value is a string here
    return value.toLowerCase();
  } else {
    // TypeScript knows value is a number here
    return value.toFixed(2);
  }
}
```

:::

### instanceof Type Guard

::: code-with-tooltips

```typescript
class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends Error {
  fieldErrors: Record<string, string[]>;
  constructor(message: string, fieldErrors: Record<string, string[]>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

function handleError(error: Error) {
  if (error instanceof ApiError) {
    // TypeScript knows error is ApiError
    console.error(`API Error ${error.statusCode}: ${error.message}`);
  } else if (error instanceof ValidationError) {
    // TypeScript knows error is ValidationError
    console.error('Validation Error:', error.fieldErrors);
  } else {
    // TypeScript knows error is Error
    console.error('Generic Error:', error.message);
  }
}
```

:::

## Custom Type Guards

### User-Defined Type Guards

::: code-with-tooltips

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

function isAdmin(user: User): user is Admin {
  return 'role' in user && user.role === 'admin';
}

function handleUser(user: User) {
  if (isAdmin(user)) {
    // TypeScript knows user is Admin
    console.log(`Admin ${user.name} has permissions:`, user.permissions);
  } else {
    // TypeScript knows user is just User
    console.log(`User ${user.name}`);
  }
}
```

:::

### Array Type Guards

::: code-with-tooltips

```typescript
function isNonEmpty<T>(arr: T[]): arr is [T, ...T[]] {
  return arr.length > 0;
}

function isArrayOfStrings(arr: unknown[]): arr is string[] {
  return arr.every((item): item is string => typeof item === 'string');
}

function processItems<T>(items: T[]) {
  if (isNonEmpty(items)) {
    // TypeScript knows items has at least one element
    const [first, ...rest] = items;
    console.log('First item:', first);
  }

  if (isArrayOfStrings(items)) {
    // TypeScript knows items is string[]
    items.map((str) => str.toLowerCase());
  }
}
```

:::

## Advanced Patterns

### Discriminated Unions

::: code-with-tooltips

```typescript
type Result<T> =
  | { type: 'success'; data: T }
  | { type: 'error'; error: Error }
  | { type: 'loading' };

function handleResult<T>(result: Result<T>) {
  switch (result.type) {
    case 'success':
      // TypeScript knows result has data
      console.log('Success:', result.data);
      break;
    case 'error':
      // TypeScript knows result has error
      console.error('Error:', result.error.message);
      break;
    case 'loading':
      // TypeScript knows result has no additional properties
      console.log('Loading...');
      break;
  }
}
```

:::

### Assertion Functions

::: code-with-tooltips

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Value must be a string');
  }
}

function assertNonNull<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error('Value must not be null or undefined');
  }
}

function processData(data: unknown) {
  assertIsString(data);
  // TypeScript knows data is string
  console.log(data.toLowerCase());
}

function getUserName(user: { name: string } | null) {
  assertNonNull(user);
  // TypeScript knows user is not null
  return user.name;
}
```

:::

## Real-World Example

::: code-with-tooltips

```typescript
// API Response types
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

// Domain types
interface Product {
  id: string;
  name: string;
  price: number;
}

interface Order {
  id: string;
  items: Product[];
  total: number;
}

// Type guards
function isProduct(value: unknown): value is Product {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'price' in value &&
    typeof (value as Product).id === 'string' &&
    typeof (value as Product).name === 'string' &&
    typeof (value as Product).price === 'number'
  );
}

function isOrder(value: unknown): value is Order {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'items' in value &&
    'total' in value &&
    typeof (value as Order).id === 'string' &&
    Array.isArray((value as Order).items) &&
    (value as Order).items.every(isProduct) &&
    typeof (value as Order).total === 'number'
  );
}

// API handler with type guards
class ApiHandler {
  async fetchOrder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (!isOrder(data)) {
        return {
          status: 'error',
          error: 'Invalid order data received',
        };
      }

      return {
        status: 'success',
        data,
      };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  processApiResponse<T>(
    response: ApiResponse<T>,
    handlers: {
      onSuccess: (data: T) => void;
      onError: (error: string) => void;
      onLoading: () => void;
    }
  ) {
    switch (response.status) {
      case 'success':
        handlers.onSuccess(response.data);
        break;
      case 'error':
        handlers.onError(response.error);
        break;
      case 'loading':
        handlers.onLoading();
        break;
    }
  }
}

// Usage
const api = new ApiHandler();

async function displayOrder(orderId: string) {
  const response = await api.fetchOrder(orderId);

  api.processApiResponse(response, {
    onSuccess: (order) => {
      console.log('Order details:', {
        id: order.id,
        itemCount: order.items.length,
        total: order.total,
      });
    },
    onError: (error) => {
      console.error('Failed to fetch order:', error);
    },
    onLoading: () => {
      console.log('Loading order...');
    },
  });
}
```

:::

## Best Practices

1. Type Guard Design:

   - Keep type guards simple and focused
   - Use descriptive names that indicate the check
   - Return boolean for type predicates

2. Error Handling:

   - Use assertion functions for invariants
   - Provide descriptive error messages
   - Handle edge cases explicitly

3. Performance:
   - Avoid excessive type checking
   - Use discriminated unions when possible
   - Cache type guard results when appropriate

## References

- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Deep Dive - Type Guards](https://basarat.gitbook.io/typescript/type-system/typeguard)
