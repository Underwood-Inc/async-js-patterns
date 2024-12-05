---
title: Racing Tasks Examples
description: Master task racing patterns in JavaScript. Learn about competitive task execution and handling the first completion.
date: 2024-01-01
author: Underwood Inc
tags:
  - JavaScript
  - Tasks
  - Async
  - Race Conditions
  - Examples
  - Best Practices
image: /web-patterns/images/racing-tasks-banner.png
---

# Racing Tasks Examples

This page demonstrates practical examples of executing tasks in a racing pattern, where the first task to complete determines the outcome.

## Basic Racing Pattern

```typescript:preview
// Basic racing pattern with timeout
async function raceWithTimeout<T>(
  task: () => Promise<T>,
  timeout: number
): Promise<T> {
  return Promise.race([
    task(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Task timeout')), timeout)
    ),
  ]);
}

// Usage
try {
  const result = await raceWithTimeout(
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    5000 // 5 second timeout
  );
  console.log('Task completed:', result);
} catch (error) {
  console.error('Task failed or timed out:', error);
}
```

## Multiple Data Sources

```typescript:preview
class RedundantDataFetcher {
  private sources: DataSource[];

  constructor(sources: DataSource[]) {
    this.sources = sources;
  }

  async fetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const fetchPromises = this.sources.map(async (source) => {
      try {
        const startTime = Date.now();
        const response = await source.fetch(path);
        const duration = Date.now() - startTime;

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return {
          data: await response.json(),
          source: source.name,
          duration,
        };
      } catch (error) {
        console.warn(`Failed to fetch from ${source.name}:`, error);
        throw error;
      }
    });

    try {
      const { data, source, duration } = await Promise.race(fetchPromises);
      console.log(`Data fetched from ${source} in ${duration}ms`);
      return data;
    } catch (error) {
      throw new Error('All data sources failed');
    }
  }
}

// Usage
const fetcher = new RedundantDataFetcher([
  new PrimaryDataSource(),
  new BackupDataSource(),
  new FallbackDataSource(),
]);

const data = await fetcher.fetch('/api/critical-data');
```

## Service Discovery

```typescript:preview
class ServiceDiscovery {
  private registries: ServiceRegistry[];
  private cache: Map<string, ServiceInfo>;

  constructor(registries: ServiceRegistry[]) {
    this.registries = registries;
    this.cache = new Map();
  }

  async discoverService(
    serviceName: string,
    options: DiscoveryOptions = {}
  ): Promise<ServiceInfo> {
    // Check cache first
    const cached = this.cache.get(serviceName);
    if (cached && !this.isExpired(cached)) {
      return cached;
    }

    const discoveryPromises = this.registries.map(async (registry) => {
      const startTime = Date.now();

      try {
        const info = await registry.lookup(serviceName);
        return {
          ...info,
          registry: registry.name,
          latency: Date.now() - startTime,
        };
      } catch (error) {
        console.warn(`Discovery failed for ${registry.name}:`, error);
        throw error;
      }
    });

    try {
      const result = await Promise.race(discoveryPromises);
      this.cache.set(serviceName, {
        ...result,
        timestamp: Date.now(),
      });
      return result;
    } catch (error) {
      throw new Error(`Service ${serviceName} not found in any registry`);
    }
  }

  private isExpired(info: ServiceInfo): boolean {
    return Date.now() - info.timestamp > 60000; // 1 minute TTL
  }
}
```

## Real-World Example: Load Balancer

```typescript:preview
class LoadBalancer {
  private servers: ServerInstance[];
  private healthChecks: Map<string, HealthStatus>;
  private readonly healthCheckInterval: number;

  constructor(servers: ServerInstance[], healthCheckInterval: number = 30000) {
    this.servers = servers;
    this.healthChecks = new Map();
    this.healthCheckInterval = healthCheckInterval;
    this.startHealthChecks();
  }

  async handleRequest<T>(request: Request): Promise<T> {
    const healthyServers = this.getHealthyServers();
    if (healthyServers.length === 0) {
      throw new Error('No healthy servers available');
    }

    const serverPromises = healthyServers.map(async (server) => {
      const startTime = Date.now();

      try {
        const response = await server.handleRequest(request);
        return {
          response,
          server,
          latency: Date.now() - startTime,
        };
      } catch (error) {
        this.markServerUnhealthy(server);
        throw error;
      }
    });

    try {
      const { response, server, latency } = await Promise.race(serverPromises);

      this.updateServerMetrics(server, latency);
      return response;
    } catch (error) {
      throw new Error('All servers failed to handle request');
    }
  }

  private startHealthChecks(): void {
    setInterval(async () => {
      const checks = this.servers.map(async (server) => {
        try {
          const startTime = Date.now();
          await server.healthCheck();

          this.healthChecks.set(server.id, {
            healthy: true,
            lastCheck: Date.now(),
            latency: Date.now() - startTime,
          });
        } catch (error) {
          this.healthChecks.set(server.id, {
            healthy: false,
            lastCheck: Date.now(),
            error: error as Error,
          });
        }
      });

      await Promise.all(checks);
    }, this.healthCheckInterval);
  }

  private getHealthyServers(): ServerInstance[] {
    return this.servers.filter((server) => {
      const health = this.healthChecks.get(server.id);
      return health?.healthy ?? false;
    });
  }

  private markServerUnhealthy(server: ServerInstance): void {
    this.healthChecks.set(server.id, {
      healthy: false,
      lastCheck: Date.now(),
      error: new Error('Request failed'),
    });
  }

  private updateServerMetrics(server: ServerInstance, latency: number): void {
    // Update server metrics for load balancing decisions
    server.metrics.recordLatency(latency);
    server.metrics.incrementRequestCount();
  }
}

// Usage
const loadBalancer = new LoadBalancer([
  new ServerInstance('server1', 'http://server1.example.com'),
  new ServerInstance('server2', 'http://server2.example.com'),
  new ServerInstance('server3', 'http://server3.example.com'),
]);

try {
  const response = await loadBalancer.handleRequest({
    method: 'GET',
    path: '/api/data',
  });
  console.log('Request handled successfully:', response);
} catch (error) {
  console.error('Request failed:', error);
}
```

## Best Practices

1. Timeout handling:

   ```typescript:preview
   function withTimeout<T>(
     promise: Promise<T>,
     timeoutMs: number,
     errorMessage: string = 'Operation timed out'
   ): Promise<T> {
     let timeoutId: NodeJS.Timeout;

     const timeoutPromise = new Promise<never>((_, reject) => {
       timeoutId = setTimeout(() => {
         reject(new Error(errorMessage));
       }, timeoutMs);
     });

     return Promise.race([promise, timeoutPromise]).finally(() => {
       clearTimeout(timeoutId);
     });
   }
   ```

2. Cancellation support:

   ```typescript:preview
   class RaceController {
     private abortController = new AbortController();

     async raceWithCancellation<T>(tasks: Array<() => Promise<T>>): Promise<T> {
       const { signal } = this.abortController;

       const racingTasks = tasks.map(async (task) => {
         if (signal.aborted) {
           throw new Error('Operation cancelled');
         }

         return await task();
       });

       try {
         return await Promise.race(racingTasks);
       } finally {
         this.cleanup();
       }
     }

     cancel(): void {
       this.abortController.abort();
     }

     private cleanup(): void {
       // Cleanup resources
     }
   }
   ```

3. Error handling:

   ```typescript:preview
   async function raceWithErrorBoundary<T>(
     tasks: Array<() => Promise<T>>,
     options: {
       timeout?: number;
       errorHandler?: (error: Error) => void;
     } = {}
   ): Promise<T> {
     const errors: Error[] = [];

     const wrappedTasks = tasks.map(async (task) => {
       try {
         return await task();
       } catch (error) {
         errors.push(error as Error);
         options.errorHandler?.(error as Error);
         throw error;
       }
     });

     if (options.timeout) {
       wrappedTasks.push(
         new Promise<never>((_, reject) =>
           setTimeout(() => reject(new Error('Timeout')), options.timeout)
         )
       );
     }

     try {
       return await Promise.race(wrappedTasks);
     } catch (error) {
       if (errors.length === tasks.length) {
         throw new AggregateError(errors, 'All tasks failed');
       }
       throw error;
     }
   }
   ```

4. Resource cleanup:

   ```typescript:preview
   class ResourceManager {
     private resources: Set<Resource> = new Set();

     async raceWithResources<T>(
       operations: Array<(resource: Resource) => Promise<T>>
     ): Promise<T> {
       const acquiredResources: Resource[] = [];

       try {
         // Acquire resources
         for (const resource of this.resources) {
           await resource.acquire();
           acquiredResources.push(resource);
         }

         // Race operations
         return await Promise.race(
           operations.map((op) =>
             this.executeWithResource(op, acquiredResources[0])
           )
         );
       } finally {
         // Release resources
         for (const resource of acquiredResources) {
           try {
             await resource.release();
           } catch (error) {
             console.error('Resource cleanup failed:', error);
           }
         }
       }
     }

     private async executeWithResource<T>(
       operation: (resource: Resource) => Promise<T>,
       resource: Resource
     ): Promise<T> {
       try {
         return await operation(resource);
       } catch (error) {
         console.error('Operation failed:', error);
         throw error;
       }
     }
   }
   ```
