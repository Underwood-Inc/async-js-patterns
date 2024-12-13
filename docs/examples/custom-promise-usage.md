---
title: Custom Promise Usage Examples
description: Learn how to create and use custom Promise implementations. Explore advanced Promise patterns and custom async behavior.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Promises
  - Async
  - Custom Implementation
  - Examples
  - Best Practices
image: /web-patterns/images/custom-promise-usage-banner.png
---

# Custom Promise Usage Examples

This page demonstrates practical examples of using our custom Promise implementation.

## Basic Usage

```typescript:preview
// Creating and using a custom Promise
const myPromise = new CustomPromise<string>((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('Success!');
    } else {
      reject(new Error('Random failure'));
    }
  }, 1000);
});

// Using the promise
myPromise
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

## Chaining Operations

```typescript:preview
// Example of promise chaining
const fetchUserData = (userId: string) =>
  new CustomPromise<User>((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: 'John Doe' });
    }, 1000);
  });

const fetchUserPosts = (user: User) =>
  new CustomPromise<Post[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', userId: user.id, title: 'Post 1' },
        { id: '2', userId: user.id, title: 'Post 2' },
      ]);
    }, 1000);
  });

// Chain the operations
fetchUserData('123')
  .then((user) => fetchUserPosts(user))
  .then((posts) => console.log(posts))
  .catch((error) => console.error('Error:', error));
```

## Error Handling

```typescript:preview
// Demonstrating error propagation
const validateUser = (user: User) =>
  new CustomPromise<User>((resolve, reject) => {
    if (!user.name) {
      reject(new Error('User name is required'));
    }
    if (!user.id) {
      reject(new Error('User ID is required'));
    }
    resolve(user);
  });

const processUser = (user: User) =>
  validateUser(user)
    .then((validUser) => {
      console.log('Valid user:', validUser);
      return validUser;
    })
    .catch((error) => {
      console.error('Validation failed:', error);
      throw error; // Re-throwing for further catch handlers
    });
```

## Async/Await Usage

```typescript:preview
// Using custom Promise with async/await
async function processUserData(userId: string) {
  try {
    const user = await fetchUserData(userId);
    const validUser = await validateUser(user);
    const posts = await fetchUserPosts(validUser);
    return { user: validUser, posts };
  } catch (error) {
    console.error('Processing failed:', error);
    throw error;
  }
}
```

## Real-World Example: API Client

```typescript:preview
class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  fetch<T>(endpoint: string, options: RequestInit = {}): CustomPromise<T> {
    return new CustomPromise((resolve, reject) => {
      fetch(`${this.baseUrl}${endpoint}`, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => resolve(data as T))
        .catch((error) => reject(error));
    });
  }

  // Example usage with TypeScript types
  getUser(id: string): CustomPromise<User> {
    return this.fetch<User>(`/users/${id}`);
  }

  createPost(userId: string, post: Omit<Post, 'id'>): CustomPromise<Post> {
    return this.fetch<Post>('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...post, userId }),
    });
  }
}

// Using the API client
const api = new APIClient('https://api.example.com');

async function example() {
  try {
    const user = await api.getUser('123');
    const newPost = await api.createPost(user.id, {
      title: 'New Post',
      content: 'Post content',
    });
    console.log('Created post:', newPost);
  } catch (error) {
    console.error('API operation failed:', error);
  }
}
```

## Testing Custom Promises

```typescript:preview
// Example of testing promise behavior
describe('CustomPromise', () => {
  it('should resolve with correct value', (done) => {
    const promise = new CustomPromise<string>((resolve) => {
      setTimeout(() => resolve('test'), 100);
    });

    promise.then((value) => {
      expect(value).toBe('test');
      done();
    });
  });

  it('should handle rejections', (done) => {
    const error = new Error('test error');
    const promise = new CustomPromise<string>((_, reject) => {
      setTimeout(() => reject(error), 100);
    });

    promise.catch((err) => {
      expect(err).toBe(error);
      done();
    });
  });
});
```

## Best Practices

1. Always handle rejections:

   ```typescript:preview
   myPromise.then(handleSuccess).catch(handleError).finally(cleanup);
   ```

2. Use TypeScript for better type safety:

   ```typescript:preview
   const typedPromise = new CustomPromise<User>((resolve) => {
     resolve({ id: '1', name: 'John' });
   });
   ```

3. Chain promises appropriately:

   ```typescript:preview
   // Good
   return promise.then(transform1).then(transform2);

   // Avoid
   promise.then((value) => {
     transform1(value).then(transform2);
   });
   ```

4. Proper error propagation:

   ```typescript:preview
   promise
     .then((value) => {
       if (!value) throw new Error('Invalid value');
       return process(value);
     })
     .catch((error) => {
       logError(error);
       throw error; // Re-throw if needed
     });
   ```
