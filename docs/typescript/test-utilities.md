---
title: TypeScript Test Utilities Guide
description: Explore comprehensive test utilities and patterns in TypeScript. Learn about test factories, mock data generation, and testing best practices.
date: 2024-01-01
author: Underwood Inc
tags:
  - TypeScript
  - Testing
  - Test Utilities
  - Mock Data
  - Test Patterns
  - Code Quality
image: /web-patterns/images/test-utilities-banner.png
---

# Test Utilities in TypeScript

This section provides a collection of type-safe test utilities and patterns for writing better tests in TypeScript.

## Overview

Test utilities help you write more maintainable and type-safe tests while reducing boilerplate code.

## Basic Test Utilities

### Type-Safe Test Factory

```typescript:preview
type Factory<T> = {
  build(overrides?: Partial<T>): T;
  buildList(count: number, overrides?: Partial<T>): T[];
};

function createFactory<T>(defaults: T): Factory<T> {
  return {
    build(overrides = {}) {
      return { ...defaults, ...overrides };
    },
    buildList(count, overrides = {}) {
      return Array.from({ length: count }, () => this.build(overrides));
    },
  };
}

// Usage
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const userFactory = createFactory<User>({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
});

const user = userFactory.build({ role: 'admin' });
const users = userFactory.buildList(3, { role: 'user' });
```

### Mock Data Generator

```typescript:preview
class MockDataGenerator {
  private static counter = 0;

  static uniqueId(): string {
    return (++this.counter).toString();
  }

  static email(name?: string): string {
    const base = name?.toLowerCase().replace(/\s+/g, '.') || 'user';
    return `${base}.${this.uniqueId()}@example.com`;
  }

  static date(
    options: {
      min?: Date;
      max?: Date;
    } = {}
  ): Date {
    const min = options.min?.getTime() ?? new Date(2000, 0).getTime();
    const max = options.max?.getTime() ?? Date.now();
    const timestamp = min + Math.random() * (max - min);
    return new Date(timestamp);
  }

  static pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  static shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }
}
```

## Advanced Utilities

### Test Context Manager

```typescript:preview
interface TestContext<T> {
  setup(): Promise<T>;
  teardown(): Promise<void>;
}

class TestContextManager<T> {
  private context: T | null = null;

  constructor(private contextFactory: TestContext<T>) {}

  async setup(): Promise<T> {
    this.context = await this.contextFactory.setup();
    return this.context;
  }

  async teardown(): Promise<void> {
    if (this.context) {
      await this.contextFactory.teardown();
      this.context = null;
    }
  }

  getContext(): T {
    if (!this.context) {
      throw new Error('Context not initialized');
    }
    return this.context;
  }
}

// Usage with Jest
describe('User Tests', () => {
  const ctx = new TestContextManager({
    async setup() {
      const db = await createTestDatabase();
      const user = await db.users.create({
        name: 'Test User',
        email: MockDataGenerator.email(),
      });
      return { db, user };
    },
    async teardown() {
      await db.close();
    },
  });

  beforeEach(() => ctx.setup());
  afterEach(() => ctx.teardown());

  test('user operations', () => {
    const { db, user } = ctx.getContext();
    // Test implementation
  });
});
```

### Mock Service Generator

```typescript:preview
type MockMethod<T> = T extends (...args: any[]) => any
  ? jest.Mock<ReturnType<T>, Parameters<T>>
  : T;

type MockService<T> = {
  [K in keyof T]: MockMethod<T[K]>;
};

function createMockService<T extends object>(
  service: new (...args: any[]) => T
): MockService<T> {
  const prototype = service.prototype;
  const methods = Object.getOwnPropertyNames(prototype).filter(
    (name) => name !== 'constructor'
  );

  return methods.reduce((mock, method) => {
    mock[method] = jest.fn();
    return mock;
  }, {} as MockService<T>);
}

// Usage
class UserService {
  async getUser(id: string): Promise<User> {
    // Implementation
  }

  async createUser(data: Omit<User, 'id'>): Promise<User> {
    // Implementation
  }
}

const mockUserService = createMockService(UserService);
mockUserService.getUser.mockResolvedValue({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
});
```

## Real-World Example

```typescript:preview
// Test utilities for a full application
class TestUtils {
  // Database utilities
  static async createTestDatabase() {
    const db = await Database.connect({
      url: process.env.TEST_DATABASE_URL,
      logging: false,
    });

    await db.migrate();
    return db;
  }

  static async clearDatabase(db: Database) {
    const tables = await db.getTables();
    for (const table of tables) {
      await db.truncate(table);
    }
  }

  // HTTP utilities
  static createTestServer(
    options: {
      auth?: boolean;
      middlewares?: Middleware[];
    } = {}
  ) {
    const app = express();

    if (options.auth) {
      app.use(authMiddleware);
    }

    if (options.middlewares) {
      app.use(options.middlewares);
    }

    return app;
  }

  static async request(
    app: Express,
    options: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      url: string;
      body?: unknown;
      token?: string;
    }
  ) {
    const req = supertest(app)[options.method.toLowerCase()](options.url);

    if (options.token) {
      req.set('Authorization', `Bearer ${options.token}`);
    }

    if (options.body) {
      req.send(options.body);
    }

    return req;
  }

  // Mock factories
  static createUserFactory() {
    return createFactory<User>({
      id: MockDataGenerator.uniqueId(),
      name: 'Test User',
      email: MockDataGenerator.email(),
      role: 'user',
    });
  }

  static createPostFactory(authorId: string) {
    return createFactory<Post>({
      id: MockDataGenerator.uniqueId(),
      title: 'Test Post',
      content: 'Test Content',
      authorId,
    });
  }

  // Test context
  static createTestContext() {
    return new TestContextManager({
      async setup() {
        const db = await TestUtils.createTestDatabase();
        const app = TestUtils.createTestServer({ auth: true });
        const userFactory = TestUtils.createUserFactory();
        const user = await db.users.create(userFactory.build());
        const token = generateToken(user);

        return {
          db,
          app,
          user,
          token,
          factories: {
            user: userFactory,
            post: TestUtils.createPostFactory(user.id),
          },
        };
      },
      async teardown() {
        await TestUtils.clearDatabase(this.db);
        await this.db.close();
      },
    });
  }
}

// Usage in tests
describe('API Tests', () => {
  const ctx = TestUtils.createTestContext();

  beforeEach(() => ctx.setup());
  afterEach(() => ctx.teardown());

  describe('POST /api/posts', () => {
    test('creates post successfully', async () => {
      const { app, token, factories } = ctx.getContext();
      const postData = factories.post.build();

      const response = await TestUtils.request(app, {
        method: 'POST',
        url: '/api/posts',
        body: postData,
        token,
      });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: postData.title,
        content: postData.content,
      });
    });

    test('handles validation errors', async () => {
      const { app, token } = ctx.getContext();
      const invalidData = { title: '' };

      const response = await TestUtils.request(app, {
        method: 'POST',
        url: '/api/posts',
        body: invalidData,
        token,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/posts', () => {
    test('lists user posts', async () => {
      const { app, token, db, factories } = ctx.getContext();
      const posts = await Promise.all(
        factories.post.buildList(3).map((post) => db.posts.create(post))
      );

      const response = await TestUtils.request(app, {
        method: 'GET',
        url: '/api/posts',
        token,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(posts.length);
    });
  });
});
```

## Best Practices

1. Test Utilities:

   - Keep utilities type-safe
   - Make utilities reusable
   - Document utility behavior

2. Test Data:

   - Use factories for test data
   - Generate unique values
   - Clean up test data

3. Test Context:
   - Manage test lifecycle
   - Share common setup
   - Handle cleanup properly

## References

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Testing Documentation](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html#testing)
