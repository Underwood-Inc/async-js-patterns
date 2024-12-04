# Type Testing in TypeScript

This section explores techniques and patterns for testing TypeScript types to ensure type-level correctness.

## Overview

Type testing verifies that your type definitions work as expected and catch type errors at compile time.

## Basic Type Testing

### Type Assertions

```typescript:preview
import { expectType, expectError } from 'tsd';

// Type to test
type NumberOrString = number | string;

// Type assertions
const value1: NumberOrString = 42; // OK
const value2: NumberOrString = 'hello'; // OK
expectError(const value3: NumberOrString = true);

// Function type testing
function identity<T>(value: T): T {
  return value;
}

expectType<string>(identity('hello'));
expectType<number>(identity(42));
expectError(identity<string>(42));
```

### Type Equality Testing

```typescript:preview
type Assert<T, Expected> = T extends Expected
  ? Expected extends T
    ? true
    : false
  : false;

type IsExact<T, U> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
    ? true
    : false;

// Usage
type NumberArray = number[];
type Result1 = Assert<NumberArray, Array<number>>; // true
type Result2 = Assert<string, number>; // false

type Exact1 = IsExact<{ a: string }, { a: string }>; // true
type Exact2 = IsExact<{ a: string }, { a: string; b?: number }>; // false
```

## Advanced Type Testing

### Generic Type Testing

```typescript:preview
// Generic type to test
type Container<T> = {
  value: T;
  map<U>(fn: (value: T) => U): Container<U>;
};

// Test cases
type NumberContainer = Container<number>;
type StringContainer = Container<string>;

type TestNumberContainer = Assert<
  NumberContainer,
  {
    value: number;
    map<U>(fn: (value: number) => U): Container<U>;
  }
>;

// Test generic constraints
type NonNullable<T> = T extends null | undefined ? never : T;
type TestNonNullable1 = Assert<NonNullable<string>, string>; // true
type TestNonNullable2 = Assert<NonNullable<null>, never>; // true
```

### Conditional Type Testing

```typescript:preview
// Conditional type to test
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Test cases
type Test1 = Assert<UnwrapPromise<Promise<string>>, string>; // true
type Test2 = Assert<UnwrapPromise<number>, number>; // true

// Complex conditional type
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

interface NestedObject {
  a: {
    b: {
      c: string;
    };
    d: number;
  };
}

type TestDeepPartial = Assert<
  DeepPartial<NestedObject>,
  {
    a?: {
      b?: {
        c?: string;
      };
      d?: number;
    };
  }
>;
```

## Real-World Example

```typescript:preview
// Domain types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

// Type utilities to test
type RequiredKeys<T> = {
  [K in keyof T]: T extends Record<K, T[K]> ? K : never;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]: T extends Record<K, T[K]> ? never : K;
}[keyof T];

type PickRequired<T> = Pick<T, RequiredKeys<T>>;
type PickOptional<T> = Pick<T, OptionalKeys<T>>;

// API response types
type ApiResponse<T> = {
  data: T;
  meta: {
    timestamp: number;
    requestId: string;
  };
};

type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

type ApiResult<T> =
  | { success: true; response: ApiResponse<T> }
  | { success: false; error: ApiError };

// Type tests
describe('Type Testing', () => {
  describe('RequiredKeys', () => {
    interface TestType {
      required: string;
      optional?: number;
      nullable: string | null;
    }

    type Test = Assert<RequiredKeys<TestType>, 'required' | 'nullable'>;
  });

  describe('OptionalKeys', () => {
    interface TestType {
      required: string;
      optional?: number;
      nullable: string | null;
    }

    type Test = Assert<OptionalKeys<TestType>, 'optional'>;
  });

  describe('ApiResult', () => {
    // Success case
    type SuccessResult = ApiResult<User>;
    type TestSuccess = Assert<
      Extract<SuccessResult, { success: true }>['response']['data'],
      User
    >;

    // Error case
    type TestError = Assert<
      Extract<SuccessResult, { success: false }>['error'],
      ApiError
    >;
  });

  describe('Complex Type Transformations', () => {
    // Create request type
    type CreateRequest<T> = Omit<T, 'id'>;
    type TestCreateUser = Assert<
      CreateRequest<User>,
      {
        name: string;
        email: string;
        role: 'admin' | 'user';
      }
    >;

    // Update request type
    type UpdateRequest<T> = Partial<Omit<T, 'id'>>;
    type TestUpdateUser = IsExact<
      UpdateRequest<User>,
      {
        name?: string;
        email?: string;
        role?: 'admin' | 'user';
      }
    >;

    // Response type
    type ListResponse<T> = ApiResponse<T[]>;
    type TestUserList = Assert<ListResponse<User>['data'], User[]>;
  });

  describe('Type Guards', () => {
    // Type guard
    function isUser(value: unknown): value is User {
      return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'name' in value &&
        'email' in value &&
        'role' in value
      );
    }

    // Type guard test
    const testValue: unknown = {
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      role: 'user' as const,
    };

    if (isUser(testValue)) {
      expectType<User>(testValue);
    }
  });

  describe('Generic Constraints', () => {
    // Generic constraint
    type WithID = { id: string };
    function findById<T extends WithID>(items: T[], id: string): T | undefined {
      return items.find((item) => item.id === id);
    }

    // Test with User
    const users: User[] = [];
    const user = findById(users, '1');
    expectType<User | undefined>(user);

    // Test with Post
    const posts: Post[] = [];
    const post = findById(posts, '1');
    expectType<Post | undefined>(post);

    // Should not work with non-WithID types
    type NoID = { name: string };
    const invalid: NoID[] = [];
    expectError(findById(invalid, '1'));
  });
});
```

## Best Practices

1. Type Testing Strategy:

   - Test type constraints
   - Verify type inference
   - Test edge cases

2. Type Assertions:

   - Use explicit type assertions
   - Test both positive and negative cases
   - Verify type relationships

3. Test Organization:
   - Group related type tests
   - Use descriptive names
   - Document complex type tests

## References

- [TypeScript Handbook - Type Testing](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [tsd - Type Testing Tool](https://github.com/SamVerschueren/tsd)
