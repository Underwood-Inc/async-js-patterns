---
title: Promise.finally Examples
description: Learn Promise.finally patterns in JavaScript. Master cleanup operations and guaranteed execution after promise resolution.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Promises
  - Async
  - Cleanup
  - Examples
  - Best Practices
image: /web-patterns/images/promise-finally-examples-banner.png
---

# Promise.finally Examples

This page demonstrates practical examples of using `Promise.finally` for cleanup and guaranteed execution scenarios.

## Basic Usage

```typescript:preview
// Basic loading state management
class DataLoader {
  private loading = false;

  async loadData() {
    this.loading = true;

    try {
      const response = await fetch('/api/data');
      return await response.json();
    } catch (error) {
      console.error('Failed to load data:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }
}

// Usage
const loader = new DataLoader();
try {
  const data = await loader.loadData();
  console.log('Data loaded:', data);
} catch (error) {
  console.error('Error:', error);
}
```

## Resource Management

```typescript:preview
// Database connection management
class DatabaseConnection {
  private connection: Connection | null = null;

  async query<T>(sql: string, params: any[] = []): Promise<T> {
    if (!this.connection) {
      this.connection = await this.connect();
    }

    const transaction = await this.connection.beginTransaction();

    try {
      const result = await transaction.execute(sql, params);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      // Always release the connection back to the pool
      await this.connection.release();
      this.connection = null;
    }
  }
}
```

## UI State Management

```typescript:preview
class UIStateManager {
  private loadingStates = new Map<string, boolean>();
  private errorStates = new Map<string, Error | null>();

  async performAction(actionId: string, action: () => Promise<void>) {
    this.setLoading(actionId, true);
    this.setError(actionId, null);

    try {
      await action();
    } catch (error) {
      this.setError(actionId, error as Error);
      throw error;
    } finally {
      this.setLoading(actionId, false);
      this.notifyStateChange(actionId);
    }
  }

  private setLoading(actionId: string, loading: boolean) {
    this.loadingStates.set(actionId, loading);
  }

  private setError(actionId: string, error: Error | null) {
    this.errorStates.set(actionId, error);
  }

  private notifyStateChange(actionId: string) {
    const event = new CustomEvent('uiStateChange', {
      detail: {
        actionId,
        loading: this.loadingStates.get(actionId),
        error: this.errorStates.get(actionId),
      },
    });
    window.dispatchEvent(event);
  }
}
```

## File Handling

```typescript:preview
class FileProcessor {
  private tempFiles: Set<string> = new Set();

  async processFile(file: File): Promise<ProcessedResult> {
    const tempPath = await this.createTempFile(file);
    this.tempFiles.add(tempPath);

    try {
      // Process the file
      const processed = await this.processFileContent(tempPath);
      return processed;
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      throw error;
    } finally {
      // Clean up temporary file
      await this.deleteTempFile(tempPath);
      this.tempFiles.delete(tempPath);
    }
  }

  async cleanup() {
    // Clean up any remaining temporary files
    const cleanupPromises = Array.from(this.tempFiles).map(async (tempPath) => {
      try {
        await this.deleteTempFile(tempPath);
        this.tempFiles.delete(tempPath);
      } catch (error) {
        console.error(`Failed to delete temp file ${tempPath}:`, error);
      }
    });

    await Promise.all(cleanupPromises);
  }
}
```

## Real-World Example: API Request Handler

```typescript:preview
class APIRequestHandler {
  private metrics: MetricsCollector;
  private cache: Cache;
  private rateLimiter: RateLimiter;

  constructor(
    metrics: MetricsCollector,
    cache: Cache,
    rateLimiter: RateLimiter
  ) {
    this.metrics = metrics;
    this.cache = cache;
    this.rateLimiter = rateLimiter;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const requestId = crypto.randomUUID();
    const startTime = performance.now();

    // Acquire rate limit token
    await this.rateLimiter.acquire();

    try {
      // Check cache first
      if (options.useCache) {
        const cached = await this.cache.get(endpoint);
        if (cached) {
          this.metrics.recordCacheHit(endpoint);
          return cached as T;
        }
      }

      // Make the request
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'X-Request-ID': requestId,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the response if needed
      if (options.useCache) {
        await this.cache.set(endpoint, data, options.cacheTTL);
      }

      return data as T;
    } catch (error) {
      // Record error metrics
      this.metrics.recordError(endpoint, error as Error);
      throw error;
    } finally {
      // Always execute these cleanup/logging operations
      this.rateLimiter.release();
      this.metrics.recordRequestDuration(
        endpoint,
        performance.now() - startTime
      );
      this.metrics.recordRequestComplete(requestId);
    }
  }

  async batchRequest<T>(
    endpoints: string[],
    options: RequestOptions = {}
  ): Promise<T[]> {
    const results: T[] = [];
    const errors: Error[] = [];

    for (const endpoint of endpoints) {
      try {
        const result = await this.request<T>(endpoint, options);
        results.push(result);
      } catch (error) {
        errors.push(error as Error);
      } finally {
        // Track progress
        this.metrics.recordBatchProgress(
          endpoints.length,
          results.length + errors.length
        );
      }
    }

    if (errors.length > 0) {
      throw new BatchRequestError(errors, results);
    }

    return results;
  }
}

// Usage
const api = new APIRequestHandler(
  new MetricsCollector(),
  new Cache(),
  new RateLimiter()
);

try {
  const data = await api.request<UserData>('/api/users/123', {
    useCache: true,
    cacheTTL: 60000,
  });
  console.log('User data:', data);
} catch (error) {
  console.error('Request failed:', error);
} finally {
  // Additional cleanup if needed
  console.log('Request complete');
}
```

## Best Practices

1. Always use finally for cleanup:

   ```typescript:preview
   let resource;
   try {
     resource = await acquireResource();
     return await useResource(resource);
   } catch (error) {
     console.error('Error using resource:', error);
     throw error;
   } finally {
     if (resource) {
       await releaseResource(resource);
     }
   }
   ```

2. Handle nested resources:

   ```typescript:preview
   async function processWithResources() {
     const resources = [];
     try {
       // Acquire resources
       resources.push(await acquireResource1());
       resources.push(await acquireResource2());

       // Use resources
       return await processResources(resources);
     } finally {
       // Release all resources in reverse order
       for (const resource of resources.reverse()) {
         try {
           await releaseResource(resource);
         } catch (error) {
           console.error('Error releasing resource:', error);
         }
       }
     }
   }
   ```

3. Combine with other Promise methods:

   ```typescript:preview
   Promise.all(promises)
     .then(handleSuccess)
     .catch(handleError)
     .finally(() => {
       cleanup();
       updateUI();
       resetState();
     });
   ```

4. State management:

   ```typescript:preview
   class StateManager {
     private states = new Map();

     async performAction(id: string, action: () => Promise<void>) {
       this.states.set(id, 'processing');

       try {
         await action();
         this.states.set(id, 'completed');
       } catch (error) {
         this.states.set(id, 'error');
         throw error;
       } finally {
         this.notifyStateChange(id);
         if (this.isLastAction(id)) {
           this.resetState();
         }
       }
     }
   }
   ```
