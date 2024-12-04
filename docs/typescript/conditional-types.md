# Conditional Types in TypeScript

This section explores TypeScript's conditional types and their applications in creating flexible type definitions.

## Overview

Conditional types help you create type definitions that depend on other types, similar to if statements but at the type level.

## Basic Conditional Types

### Type Conditions

```typescript:preview
type IsString<T> = T extends string ? true : false;
type IsNumber<T> = T extends number ? true : false;

// Usage
type StringCheck = IsString<'hello'>; // true
type NumberCheck = IsString<42>; // false
type ObjectCheck = IsNumber<{ x: number }>; // false
```

### Type Distribution

```typescript:preview
type ToArray<T> = T extends any ? T[] : never;

// Distribution over union types
type StringOrNumber = string | number;
type ArraysOfStringOrNumber = ToArray<StringOrNumber>;
// Result: string[] | number[]

// Prevent distribution
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;
```

## Advanced Patterns

### Type Inference in Conditional Types

```typescript:preview
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Usage
type StringReturn = GetReturnType<() => string>; // string
type NumberReturn = GetReturnType<() => number>; // number
type VoidReturn = GetReturnType<() => void>; // void

// Multiple infer
type FirstArgument<T> = T extends (first: infer F, ...args: any[]) => any
  ? F
  : never;

type SecondArgument<T> = T extends (
  first: any,
  second: infer S,
  ...args: any[]
) => any
  ? S
  : never;

// Usage
type Func = (name: string, age: number, active: boolean) => void;
type First = FirstArgument<Func>; // string
type Second = SecondArgument<Func>; // number
```

### Recursive Conditional Types

```typescript:preview
type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;

interface NestedObject {
  name: string;
  settings: {
    theme: {
      dark: boolean;
      colors: string[];
    };
    notifications: boolean;
  };
}

type ReadonlyNested = DeepReadonly<NestedObject>;
// All properties and nested properties are readonly
```

## Real-World Example

```typescript:preview
// API Response handling with conditional types
type ApiResponse<T> = {
  data: T;
  status: number;
  headers: Record<string, string>;
};

type ApiError = {
  message: string;
  code: string;
};

// Conditional response type based on status
type ApiResult<T> =
  ApiResponse<T> extends { status: infer S }
    ? S extends 200
      ? { success: true; data: T }
      : { success: false; error: ApiError }
    : never;

// Extract success/error types
type ExtractSuccess<T> = T extends { success: true; data: infer D } ? D : never;

type ExtractError<T> = T extends { success: false; error: infer E } ? E : never;

// API client implementation
class ApiClient {
  private async request<T>(
    method: string,
    url: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  async get<T>(url: string): Promise<ApiResult<T>> {
    const response = await this.request<T>('GET', url);

    return response.status === 200
      ? { success: true, data: response.data }
      : {
          success: false,
          error: {
            message: 'Request failed',
            code: response.status.toString(),
          },
        };
  }

  async post<T>(url: string, body: unknown): Promise<ApiResult<T>> {
    const response = await this.request<T>('POST', url, body);

    return response.status === 200
      ? { success: true, data: response.data }
      : {
          success: false,
          error: {
            message: 'Request failed',
            code: response.status.toString(),
          },
        };
  }
}

// Domain types
interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

// Type-safe API usage
async function createUser(
  client: ApiClient,
  userData: CreateUserRequest
): Promise<User | ApiError> {
  const result = await client.post<User>('/users', userData);

  if (result.success) {
    return result.data;
  } else {
    return result.error;
  }
}

async function getUser(
  client: ApiClient,
  userId: string
): Promise<User | ApiError> {
  const result = await client.get<User>(`/users/${userId}`);

  return result.success ? result.data : result.error;
}

// Type utilities for API responses
type UnwrapApiResult<T> = T extends ApiResult<infer U> ? U : never;
type ApiSuccessResult<T> = Extract<ApiResult<T>, { success: true }>;
type ApiErrorResult = Extract<ApiResult<any>, { success: false }>;

// Response handlers
function handleSuccess<T>(result: ApiSuccessResult<T>): T {
  return result.data;
}

function handleError(result: ApiErrorResult): never {
  throw new Error(`API Error: ${result.error.message} (${result.error.code})`);
}

// Generic response processor
function processApiResult<T>(
  result: ApiResult<T>,
  handlers: {
    onSuccess: (data: T) => void;
    onError: (error: ApiError) => void;
  }
): void {
  if (result.success) {
    handlers.onSuccess(result.data);
  } else {
    handlers.onError(result.error);
  }
}
```

## Best Practices

1. Type Design:

   - Keep conditions simple and focused
   - Use type inference when possible
   - Document complex conditional types

2. Error Handling:

   - Use union types for error cases
   - Provide meaningful error types
   - Handle all possible conditions

3. Performance:
   - Avoid deeply nested conditions
   - Cache complex type computations
   - Use type aliases for readability

## References

- [TypeScript Handbook - Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TypeScript Deep Dive - Advanced Types](https://basarat.gitbook.io/typescript/type-system/conditional-types)
