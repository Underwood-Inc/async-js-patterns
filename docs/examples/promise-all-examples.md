---
title: Promise.all Examples
description: Master Promise.all usage in JavaScript. Learn about parallel promise execution, error handling, and performance optimization.
date: 2024-01-01
author: Underwood Inc
tags:
  - JavaScript
  - Promises
  - Async
  - Parallel Execution
  - Examples
  - Best Practices
image: /web-patterns/images/promise-all-examples-banner.png
---

# Promise.all Examples

This page demonstrates practical examples of using `Promise.all` for parallel execution.

## Basic Usage

```typescript:preview
// Basic Promise.all with multiple fetch requests
const fetchMultipleUsers = async (userIds: string[]) => {
  const promises = userIds.map((id) =>
    fetch(`/api/users/${id}`).then((res) => res.json())
  );

  try {
    const users = await Promise.all(promises);
    return users;
  } catch (error) {
    console.error('One or more requests failed:', error);
    throw error;
  }
};
```

## Error Handling

```typescript:preview
// Handling errors in Promise.all
const validateUsers = async (users: User[]) => {
  try {
    await Promise.all(
      users.map(
        (user) =>
          new Promise((resolve, reject) => {
            if (!user.email) {
              reject(new Error(`User ${user.id} missing email`));
            }
            if (!user.name) {
              reject(new Error(`User ${user.id} missing name`));
            }
            resolve(user);
          })
      )
    );
    return true; // All validations passed
  } catch (error) {
    console.error('Validation failed:', error);
    return false;
  }
};
```

## Data Aggregation

```typescript:preview
// Aggregating data from multiple sources
interface UserData {
  user: User;
  posts: Post[];
  comments: Comment[];
}

async function getUserData(userId: string): Promise<UserData> {
  const [user, posts, comments] = await Promise.all([
    fetch(`/api/users/${userId}`).then((res) => res.json()),
    fetch(`/api/users/${userId}/posts`).then((res) => res.json()),
    fetch(`/api/users/${userId}/comments`).then((res) => res.json()),
  ]);

  return { user, posts, comments };
}
```

## Batch Processing

```typescript:preview
// Processing data in batches
async function processBatch<T>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(processor));
    console.log(`Processed batch ${i / batchSize + 1}`);
  }
}

// Example usage
const processUser = async (user: User) => {
  await validateUser(user);
  await updateUserStatus(user);
  await notifyUser(user);
};

// Process users in batches of 5
await processBatch(users, 5, processUser);
```

## Resource Management

```typescript:preview
// Managing multiple resources
class ResourceManager {
  private connections: Map<string, Connection> = new Map();

  async initializeResources(configs: ConnectionConfig[]) {
    const connectionPromises = configs.map(async (config) => {
      const connection = await this.createConnection(config);
      this.connections.set(config.id, connection);
      return connection;
    });

    try {
      await Promise.all(connectionPromises);
      console.log('All resources initialized');
    } catch (error) {
      console.error('Resource initialization failed:', error);
      await this.cleanup();
      throw error;
    }
  }

  private async cleanup() {
    const cleanupPromises = Array.from(this.connections.values()).map((conn) =>
      conn.close()
    );
    await Promise.all(cleanupPromises);
    this.connections.clear();
  }
}
```

## Real-World Example: Data Synchronization

```typescript:preview
class DataSynchronizer {
  private api: APIClient;
  private db: Database;

  async syncData(entities: Entity[]): Promise<SyncResult> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Error[],
    };

    // Group entities by type
    const grouped = this.groupByType(entities);

    // Sync each type in parallel, but entities of the same type in sequence
    await Promise.all(
      Object.entries(grouped).map(async ([type, items]) => {
        try {
          // Sync items of the same type sequentially
          for (const item of items) {
            try {
              await this.syncEntity(type, item);
              results.success++;
            } catch (error) {
              results.failed++;
              results.errors.push(error as Error);
            }
          }
        } catch (error) {
          console.error(`Failed to sync ${type}:`, error);
        }
      })
    );

    return results;
  }

  private async syncEntity(type: string, entity: Entity): Promise<void> {
    const [localData, remoteData] = await Promise.all([
      this.db.get(type, entity.id),
      this.api.fetch(type, entity.id),
    ]);

    if (this.needsUpdate(localData, remoteData)) {
      await this.db.update(type, entity.id, remoteData);
    }
  }

  private groupByType(entities: Entity[]): Record<string, Entity[]> {
    return entities.reduce(
      (acc, entity) => {
        acc[entity.type] = acc[entity.type] || [];
        acc[entity.type].push(entity);
        return acc;
      },
      {} as Record<string, Entity[]>
    );
  }

  private needsUpdate(local: any, remote: any): boolean {
    return JSON.stringify(local) !== JSON.stringify(remote);
  }
}

// Usage example
const syncer = new DataSynchronizer();
const result = await syncer.syncData([
  { type: 'user', id: '1' },
  { type: 'post', id: '1' },
  { type: 'user', id: '2' },
  { type: 'comment', id: '1' },
]);
```

## Best Practices

1. Error handling:

   ```typescript:preview
   Promise.all(promises)
     .then(handleSuccess)
     .catch((error) => {
       // Handle any error from any promise
       console.error('Operation failed:', error);
     });
   ```

2. Progress tracking:

   ```typescript:preview
   async function trackProgress<T>(
     promises: Promise<T>[],
     onProgress: (completed: number, total: number) => void
   ): Promise<T[]> {
     let completed = 0;
     const total = promises.length;

     const trackedPromises = promises.map(async (promise) => {
       const result = await promise;
       completed++;
       onProgress(completed, total);
       return result;
     });

     return Promise.all(trackedPromises);
   }
   ```

3. Resource cleanup:

   ```typescript:preview
   try {
     const results = await Promise.all(operations);
     return results;
   } catch (error) {
     // Clean up any partially completed operations
     await cleanup();
     throw error;
   }
   ```

4. Timeout handling:

   ```typescript:preview
   function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
     const timeout = new Promise<never>((_, reject) =>
       setTimeout(() => reject(new Error('Timeout')), ms)
     );
     return Promise.race([promise, timeout]);
   }

   // Usage with Promise.all
   const results = await Promise.all(
     promises.map((promise) => withTimeout(promise, 5000))
   );
   ```
