# String Manipulation in TypeScript

This section covers type-safe string operations and template literal types.

## Overview

TypeScript provides powerful features for string manipulation, including template literal types and type-safe string operations.

## Template Literal Types

### Basic Template Literals

```typescript
type EventName<T extends string> = `${T}Changed`;

// Usage
type UserEvents = EventName<'user'>; // type is 'userChanged'
type DataEvents = EventName<'data'>; // type is 'dataChanged'
```

### Combining Template Literals

```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type APIEndpoint = '/users' | '/posts' | '/comments';
type APIRoute = `${HTTPMethod} ${APIEndpoint}`;

// Results in union type:
// 'GET /users' | 'GET /posts' | 'GET /comments' |
// 'POST /users' | 'POST /posts' | 'POST /comments' |
// 'PUT /users' | 'PUT /posts' | 'PUT /comments' |
// 'DELETE /users' | 'DELETE /posts' | 'DELETE /comments'
```

### Extracting String Parts

```typescript
type ExtractEventName<T extends string> = T extends `${infer Name}Changed`
  ? Name
  : never;

// Usage
type Event = 'userChanged';
type Name = ExtractEventName<Event>; // type is 'user'
```

## Type-Safe String Operations

### String Validation

```typescript
type EmailString = string & { __brand: 'email' };
type URLString = string & { __brand: 'url' };

function validateEmail(email: string): email is EmailString {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateURL(url: string): url is URLString {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function sendEmail(to: EmailString, content: string) {
  // Type-safe email operations
}

// Usage
const email = 'user@example.com';
if (validateEmail(email)) {
  sendEmail(email, 'Hello!'); // email is now EmailString
}
```

### String Transformations

```typescript
type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>;

type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Uppercase<T> ? '_' : ''}${Lowercase<T>}${SnakeCase<U>}`
  : S;

// Usage
type UserName = CamelCase<'user_name'>; // type is 'userName'
type APIKey = SnakeCase<'APIKey'>; // type is 'api_key'
```

## String Utility Functions

### Safe Substring

```typescript
function safeSubstring(str: string, start: number, end?: number): string {
  const normalizedStart = Math.max(0, start);
  const normalizedEnd =
    end !== undefined ? Math.min(str.length, end) : str.length;

  return str.substring(normalizedStart, normalizedEnd);
}

// Usage
const text = 'Hello, World!';
const safe = safeSubstring(text, 0, 100); // No out-of-bounds error
```

### String Format

```typescript
function format<T extends Record<string, unknown>>(
  template: string,
  params: T
): string {
  return template.replace(/\${(\w+)}/g, (_, key) => String(params[key] ?? ''));
}

// Usage
const template = 'Hello, ${name}! You have ${count} messages.';
const result = format(template, {
  name: 'John',
  count: 5,
}); // "Hello, John! You have 5 messages."
```

## Best Practices

1. Type-Safe String Literals:

   ```typescript
   type Direction = 'north' | 'south' | 'east' | 'west';

   function move(direction: Direction, steps: number) {
     // Type-safe direction handling
   }

   move('north', 5); // OK
   move('up', 5); // Type error
   ```

2. String Enum Alternatives:

   ```typescript
   const HttpStatus = {
     OK: 200,
     Created: 201,
     BadRequest: 400,
     NotFound: 404,
   } as const;

   type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
   ```

3. String Pattern Matching:

   ```typescript
   type RouteParams<T extends string> =
     T extends `${string}:${infer Param}/${infer Rest}`
       ? Param | RouteParams<Rest>
       : T extends `${string}:${infer Param}`
         ? Param
         : never;

   // Usage
   type Params = RouteParams<'/users/:id/posts/:postId'>;
   // type is 'id' | 'postId'
   ```

## Real-World Example

```typescript
// API Route Builder
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Version = 'v1' | 'v2';
type Resource = 'users' | 'posts' | 'comments';
type ID = ':id';
type Nested = 'comments' | 'likes';

type APIPath =
  | `/${Version}/${Resource}`
  | `/${Version}/${Resource}/${ID}`
  | `/${Version}/${Resource}/${ID}/${Nested}`;

class APIBuilder {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  buildURL(
    method: Method,
    path: APIPath,
    params: Record<string, string> = {}
  ): string {
    let url = `${this.baseURL}${path}`;

    // Replace path parameters
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });

    return url;
  }

  validatePath(path: string): path is APIPath {
    const validPaths = [
      /^\/v[12]\/(?:users|posts|comments)$/,
      /^\/v[12]\/(?:users|posts|comments)\/:\w+$/,
      /^\/v[12]\/(?:users|posts|comments)\/:\w+\/(?:comments|likes)$/,
    ];

    return validPaths.some((pattern) => pattern.test(path));
  }
}

// Usage
const api = new APIBuilder('https://api.example.com');

const userURL = api.buildURL('GET', '/v1/users/:id', { id: '123' });

const postsURL = api.buildURL('GET', '/v2/posts/:postId/comments', {
  postId: '456',
});
```

## References

- [TypeScript Handbook - Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [TypeScript Deep Dive - String Literal Types](https://basarat.gitbook.io/typescript/type-system/string-literal-types)
