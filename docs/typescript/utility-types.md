# TypeScript Utility Types

This section covers essential TypeScript utility types and their practical applications.

## Overview

TypeScript provides several built-in utility types to facilitate common type transformations. This guide covers both built-in utilities and custom implementations.

## Built-in Utility Types

### Partial\<T\>

Makes all properties in T optional:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// All properties are optional
type PartialUser = Partial<User>;

function updateUser(userId: number, updates: PartialUser) {
  // Only update provided fields
}
```

### Required\<T>

Makes all properties in T required:

```typescript
interface Config {
  cache?: boolean;
  timeout?: number;
  retries?: number;
}

// All properties are required
type RequiredConfig = Required<Config>;

function initializeWithConfig(config: RequiredConfig) {
  // All config properties are guaranteed to exist
}
```

### Pick\<T, K>

Creates a type by picking the specified properties K from T:

```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  tags: string[];
  published: boolean;
}

// Only includes title and content
type ArticlePreview = Pick<Article, 'title' | 'content'>;

function renderPreview(preview: ArticlePreview) {
  // Work with title and content only
}
```

## Custom Utility Types

### DeepPartial\<T>

Makes all properties in T optional recursively:

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface NestedConfig {
  server: {
    port: number;
    host: string;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  database: {
    url: string;
    pool: {
      max: number;
      idle: number;
    };
  };
}

// All nested properties are optional
type PartialConfig = DeepPartial<NestedConfig>;

function updateConfig(updates: PartialConfig) {
  // Update only provided nested fields
}
```

### NonNullable\<T>

Removes null and undefined from type T:

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined');
  }
  return value as NonNullable<T>;
}
```

## Best Practices

1. Type Composition:

```typescript
// Combine utility types for complex transformations
type ReadonlyPartial<T> = Readonly<Partial<T>>;
```

2. Type Guards with Utility Types:

```typescript
function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
```

3. Conditional Types:

```typescript
type NonEmptyArray<T> = T[] & { 0: T };

function ensureNonEmpty<T>(arr: T[]): NonEmptyArray<T> {
  if (arr.length === 0) {
    throw new Error('Array cannot be empty');
  }
  return arr as NonEmptyArray<T>;
}
```

## Real-World Example

```typescript
// API Response Types
interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: number;
    requestId: string;
  };
}

interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Utility types for API handling
type SuccessResponse<T> = ApiResponse<T> & { error?: never };
type FailureResponse = ApiResponse<null> & { error: ErrorResponse };
type ApiResult<T> = SuccessResponse<T> | FailureResponse;

// Type guard
function isSuccessResponse<T>(
  response: ApiResult<T>
): response is SuccessResponse<T> {
  return !('error' in response);
}

// Usage
async function fetchData<T>(url: string): Promise<T> {
  const response: ApiResult<T> = await fetch(url).then((r) => r.json());

  if (isSuccessResponse(response)) {
    return response.data;
  }

  throw new Error(response.error.message);
}
```

## References

- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript Deep Dive - Advanced Types](https://basarat.gitbook.io/typescript/type-system/advanced-types)
