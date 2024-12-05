---
title: TypeScript Template Literals Guide
description: Master template literal types in TypeScript. Learn about type-safe string patterns, string manipulation, and advanced type system features.
date: 2024-01-01
author: Underwood Inc
tags:
  - TypeScript
  - Template Literals
  - Type System
  - String Patterns
  - Advanced Types
  - Type Safety
image: /web-patterns/images/template-literals-banner.png
---

# Template Literals in TypeScript

This section explores TypeScript's template literal types and their applications in type-safe string manipulation.

## Overview

Template literal types combine literal types and string manipulation to create powerful type-safe string patterns.

## Basic Template Literals

### String Literals

```typescript:preview
type Greeting = 'Hello';
type Name = 'World';
type Message = `${Greeting}, ${Name}!`; // type is "Hello, World!"

type ID = `user_${number}`; // type is `user_${number}`
type Status = `${boolean}_status`; // type is "true_status" | "false_status"

// Usage
let message: Message = 'Hello, World!'; // OK
let id: ID = 'user_123'; // OK
let status: Status = 'true_status'; // OK
```

### Union Types in Template Literals

```typescript:preview
type Color = 'red' | 'blue' | 'green';
type Size = 'small' | 'medium' | 'large';
type ColorSize = `${Color}-${Size}`; // All combinations

// Result type is:
// "red-small" | "red-medium" | "red-large" |
// "blue-small" | "blue-medium" | "blue-large" |
// "green-small" | "green-medium" | "green-large"

type Status = 'success' | 'error' | 'pending';
type EventName = `on${Capitalize<Status>}`; // "onSuccess" | "onError" | "onPending"
```

## Advanced Patterns

### Intrinsic String Manipulation Types

```typescript:preview
type Greeting = 'hello world';

type Caps = Uppercase<Greeting>; // "HELLO WORLD"
type Lower = Lowercase<Greeting>; // "hello world"
type Cap = Capitalize<Greeting>; // "Hello world"
type Uncap = Uncapitalize<Greeting>; // "hello world"

// Combining manipulations
type EventHandler<T extends string> = `on${Capitalize<T>}`;
type MouseEvents = 'click' | 'mouseup' | 'mousedown';
type MouseHandlers = EventHandler<MouseEvents>;
// "onClick" | "onMouseup" | "onMousedown"
```

### Pattern Matching with Template Literals

```typescript:preview
type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};

declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;

// Usage
const person = makeWatchedObject({
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
});

// OK
person.on('firstNameChanged', (newName) => {
  console.log(`new name is ${newName.toUpperCase()}`);
});

// Error: 'firstName' is not 'firstNameChanged'
person.on('firstName', () => {});

// Error: 'age' is number, not string
person.on('ageChanged', (newAge) => {
  console.log(`new age is ${newAge.toUpperCase()}`);
});
```

## Real-World Example

```typescript:preview
// API Route Type Generator
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Version = 'v1' | 'v2';

// Base path generator
type APIPath<V extends Version, Resource extends string> =
  `/api/${V}/${Resource}`;

// Route parameter types
type ID = string | number;
type QueryParam = string | number | boolean;
type QueryParams = Record<string, QueryParam>;

// Route builder types
type RouteWithID<Route extends string> = `${Route}/${ID}`;
type RouteWithAction<Route extends string, Action extends string> =
  `${Route}/${Action}`;

// API endpoint configuration
interface EndpointConfig<
  Method extends HTTPMethod,
  Path extends string,
  Req = unknown,
  Res = unknown
> {
  method: Method;
  path: Path;
  request?: Req;
  response?: Res;
}

// API implementation
class APIBuilder<V extends Version> {
  private version: V;
  private endpoints: Map<string, EndpointConfig<any, any>> = new Map();

  constructor(version: V) {
    this.version = version;
  }

  addEndpoint<
    Method extends HTTPMethod,
    Resource extends string,
    Path extends APIPath<V, Resource>,
    Req = unknown,
    Res = unknown
  >(config: EndpointConfig<Method, Path, Req, Res>) {
    this.endpoints.set(config.path, config);
    return this;
  }

  getEndpoint<Path extends string>(
    path: Path
  ): EndpointConfig<HTTPMethod, Path> | undefined {
    return this.endpoints.get(path);
  }
}

// Domain types
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// API routes type
type UserRoutes = {
  base: APIPath<'v1', 'users'>;
  withId: RouteWithID<APIPath<'v1', 'users'>>;
  action: RouteWithAction<APIPath<'v1', 'users'>, 'verify'>;
};

// API configuration
const api = new APIBuilder('v1')
  .addEndpoint({
    method: 'GET',
    path: '/api/v1/users',
    response: User[]
  })
  .addEndpoint({
    method: 'POST',
    path: '/api/v1/users',
    request: CreateUserRequest,
    response: User
  })
  .addEndpoint({
    method: 'GET',
    path: '/api/v1/users/123',
    response: User
  })
  .addEndpoint({
    method: 'PUT',
    path: '/api/v1/users/123',
    request: UpdateUserRequest,
    response: User
  })
  .addEndpoint({
    method: 'DELETE',
    path: '/api/v1/users/123'
  })
  .addEndpoint({
    method: 'POST',
    path: '/api/v1/users/verify',
    request: { token: string },
    response: { verified: boolean }
  });

// Type-safe route builder
function createRoute<
  V extends Version,
  Resource extends string
>(version: V, resource: Resource): APIPath<V, Resource> {
  return `/api/${version}/${resource}`;
}

function withId<Route extends string>(
  route: Route,
  id: ID
): RouteWithID<Route> {
  return `${route}/${id}`;
}

function withAction<Route extends string, Action extends string>(
  route: Route,
  action: Action
): RouteWithAction<Route, Action> {
  return `${route}/${action}`;
}

// Usage
const usersRoute = createRoute('v1', 'users');
const userRoute = withId(usersRoute, 123);
const verifyRoute = withAction(usersRoute, 'verify');

// Type-safe API client
async function fetchAPI<
  Method extends HTTPMethod,
  Path extends string
>(
  config: EndpointConfig<Method, Path>
): Promise<unknown> {
  const response = await fetch(config.path, {
    method: config.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: config.request ? JSON.stringify(config.request) : undefined
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return config.response ? response.json() : undefined;
}

// Example usage
async function example() {
  const endpoint = api.getEndpoint('/api/v1/users/123');
  if (endpoint) {
    const result = await fetchAPI(endpoint);
    console.log(result);
  }
}
```

## Best Practices

1. Type Design:

   - Keep template literals simple
   - Use union types effectively
   - Consider type inference

2. Pattern Matching:

   - Use specific patterns
   - Handle edge cases
   - Validate inputs

3. Performance:
   - Avoid complex unions
   - Cache type computations
   - Use type aliases

## References

- [TypeScript Handbook - Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [TypeScript Release Notes - Template Literal Types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#template-literal-types)
