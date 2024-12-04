# Testing Patterns in TypeScript

This section explores patterns and best practices for testing TypeScript code, including type testing and test utilities.

## Overview

TypeScript testing combines runtime behavior testing with compile-time type checking to ensure both functional correctness and type safety.

## Basic Testing Patterns

### Unit Testing with Jest

```typescript:preview
// Function to test
function add(a: number, b: number): number {
  return a + b;
}

// Test suite
describe('add function', () => {
  test('adds two positive numbers', () => {
    expect(add(1, 2)).toBe(3);
  });

  test('adds positive and negative numbers', () => {
    expect(add(1, -2)).toBe(-1);
  });

  test('adds two negative numbers', () => {
    expect(add(-1, -2)).toBe(-3);
  });
});
```

### Async Testing

```typescript:preview
// Async function to test
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}

// Test suite
describe('fetchUser', () => {
  test('fetches user successfully', async () => {
    const user = await fetchUser('123');
    expect(user).toHaveProperty('id', '123');
  });

  test('handles user not found', async () => {
    await expect(fetchUser('999')).rejects.toThrow('User not found');
  });
});
```

## Advanced Testing Patterns

### Type Testing

```typescript:preview
import { expectType, expectError } from 'tsd';

// Type definitions
type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

// Type tests
describe('Result type', () => {
  it('allows access to data when success is true', () => {
    const result: Result<number> = {
      success: true,
      data: 42,
    };

    expectType<number>(result.data);
    // @ts-expect-error
    expectError(result.error);
  });

  it('allows access to error when success is false', () => {
    const result: Result<number> = {
      success: false,
      error: 'Failed',
    };

    expectType<string>(result.error);
    // @ts-expect-error
    expectError(result.data);
  });
});
```

### Mock Testing

```typescript:preview
// Service to mock
interface UserService {
  getUser(id: string): Promise<User>;
  createUser(data: CreateUserData): Promise<User>;
}

// Test implementation
class MockUserService implements UserService {
  private users = new Map<string, User>();

  async getUser(id: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async createUser(data: CreateUserData): Promise<User> {
    const user: User = {
      id: Math.random().toString(),
      ...data,
    };
    this.users.set(user.id, user);
    return user;
  }
}

// Test suite
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new MockUserService();
  });

  test('creates and retrieves user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const created = await service.createUser(userData);
    const retrieved = await service.getUser(created.id);

    expect(retrieved).toEqual(created);
  });
});
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

// Service interfaces
interface UserService {
  getUser(id: string): Promise<User>;
  createUser(data: Omit<User, 'id'>): Promise<User>;
  updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

interface PostService {
  getPost(id: string): Promise<Post>;
  getUserPosts(userId: string): Promise<Post[]>;
  createPost(data: Omit<Post, 'id'>): Promise<Post>;
  updatePost(id: string, data: Partial<Omit<Post, 'id'>>): Promise<Post>;
  deletePost(id: string): Promise<void>;
}

// Mock implementations
class MockUserService implements UserService {
  private users = new Map<string, User>();

  async getUser(id: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async createUser(data: Omit<User, 'id'>): Promise<User> {
    const user: User = {
      id: Math.random().toString(),
      ...data,
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User> {
    const user = await this.getUser(id);
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.users.delete(id)) {
      throw new Error('User not found');
    }
  }
}

class MockPostService implements PostService {
  private posts = new Map<string, Post>();

  async getPost(id: string): Promise<Post> {
    const post = this.posts.get(id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(
      (post) => post.authorId === userId
    );
  }

  async createPost(data: Omit<Post, 'id'>): Promise<Post> {
    const post: Post = {
      id: Math.random().toString(),
      ...data,
    };
    this.posts.set(post.id, post);
    return post;
  }

  async updatePost(id: string, data: Partial<Omit<Post, 'id'>>): Promise<Post> {
    const post = await this.getPost(id);
    const updated = { ...post, ...data };
    this.posts.set(id, updated);
    return updated;
  }

  async deletePost(id: string): Promise<void> {
    if (!this.posts.delete(id)) {
      throw new Error('Post not found');
    }
  }
}

// Test suites
describe('User Management', () => {
  let userService: UserService;
  let postService: PostService;

  beforeEach(() => {
    userService = new MockUserService();
    postService = new MockPostService();
  });

  describe('User CRUD operations', () => {
    test('creates user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user' as const,
      };

      const user = await userService.createUser(userData);
      expect(user).toMatchObject(userData);
      expect(user.id).toBeDefined();
    });

    test('updates user successfully', async () => {
      const user = await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });

      const updated = await userService.updateUser(user.id, {
        name: 'Jane Doe',
      });

      expect(updated.id).toBe(user.id);
      expect(updated.name).toBe('Jane Doe');
      expect(updated.email).toBe(user.email);
    });

    test('deletes user successfully', async () => {
      const user = await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });

      await userService.deleteUser(user.id);
      await expect(userService.getUser(user.id)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('Post Management', () => {
    let author: User;

    beforeEach(async () => {
      author = await userService.createUser({
        name: 'Author',
        email: 'author@example.com',
        role: 'user',
      });
    });

    test('creates post successfully', async () => {
      const postData = {
        title: 'Test Post',
        content: 'Test Content',
        authorId: author.id,
      };

      const post = await postService.createPost(postData);
      expect(post).toMatchObject(postData);
      expect(post.id).toBeDefined();
    });

    test('retrieves user posts', async () => {
      const posts = await Promise.all([
        postService.createPost({
          title: 'Post 1',
          content: 'Content 1',
          authorId: author.id,
        }),
        postService.createPost({
          title: 'Post 2',
          content: 'Content 2',
          authorId: author.id,
        }),
      ]);

      const userPosts = await postService.getUserPosts(author.id);
      expect(userPosts).toHaveLength(posts.length);
      expect(userPosts).toEqual(expect.arrayContaining(posts));
    });
  });

  describe('Error Handling', () => {
    test('handles non-existent user', async () => {
      await expect(userService.getUser('invalid-id')).rejects.toThrow(
        'User not found'
      );
    });

    test('handles non-existent post', async () => {
      await expect(postService.getPost('invalid-id')).rejects.toThrow(
        'Post not found'
      );
    });
  });
});
```

## Best Practices

1. Test Organization:

   - Group related tests
   - Use descriptive names
   - Follow AAA pattern (Arrange, Act, Assert)

2. Type Testing:

   - Test type constraints
   - Verify type inference
   - Test edge cases

3. Mock Testing:
   - Create type-safe mocks
   - Test error conditions
   - Verify state changes

## References

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Testing Documentation](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html#testing)
