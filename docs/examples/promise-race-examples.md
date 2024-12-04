# Promise.race Examples

This page demonstrates practical examples of using `Promise.race` for competitive execution.

## Basic Usage

```typescript
// Basic timeout example
async function fetchWithTimeout<T>(url: string, timeout: number): Promise<T> {
  return Promise.race([
    fetch(url).then((res) => res.json()),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
}

// Usage
try {
  const data = await fetchWithTimeout('/api/data', 5000);
  console.log('Data received:', data);
} catch (error) {
  if (error.message === 'Request timeout') {
    console.error('Request took too long');
  } else {
    console.error('Request failed:', error);
  }
}
```

## Multiple Data Sources

```typescript
// Fetching from multiple sources, using the fastest response
async function fetchFromMirrors<T>(urls: string[]): Promise<T> {
  const fetchPromises = urls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      // Reject with both error and url for debugging
      return Promise.reject({ error, url });
    }
  });

  try {
    return await Promise.race(fetchPromises);
  } catch (error) {
    console.error(`Failed to fetch from ${error.url}:`, error.error);
    throw error;
  }
}

// Usage
const mirrors = [
  'https://api1.example.com/data',
  'https://api2.example.com/data',
  'https://api3.example.com/data',
];

try {
  const data = await fetchFromMirrors(mirrors);
  console.log('Data received from fastest mirror:', data);
} catch (error) {
  console.error('All mirrors failed:', error);
}
```

## Resource Management

```typescript
// Managing resource allocation with timeouts
class ResourcePool {
  private resources: Set<Resource> = new Set();
  private maxWaitTime: number;

  constructor(maxWaitTime: number = 5000) {
    this.maxWaitTime = maxWaitTime;
  }

  async acquire(): Promise<Resource> {
    return Promise.race([this.waitForResource(), this.timeoutPromise()]);
  }

  private async waitForResource(): Promise<Resource> {
    while (true) {
      const resource = this.findAvailableResource();
      if (resource) {
        return resource;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  private timeoutPromise(): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Resource acquisition timeout')),
        this.maxWaitTime
      )
    );
  }

  private findAvailableResource(): Resource | null {
    for (const resource of this.resources) {
      if (resource.isAvailable()) {
        resource.acquire();
        return resource;
      }
    }
    return null;
  }
}
```

## User Interaction Timeouts

```typescript
// Handling user interaction with timeouts
class UserInteractionHandler {
  async waitForUserAction(prompt: string, timeoutMs: number): Promise<boolean> {
    console.log(prompt);

    return Promise.race([
      this.waitForUserInput(),
      new Promise<boolean>((resolve) =>
        setTimeout(() => {
          console.log('No user response, proceeding with default');
          resolve(false);
        }, timeoutMs)
      ),
    ]);
  }

  private async waitForUserInput(): Promise<boolean> {
    return new Promise((resolve) => {
      const handler = (event: KeyboardEvent) => {
        if (event.key === 'y') {
          resolve(true);
        } else if (event.key === 'n') {
          resolve(false);
        }
      };

      document.addEventListener('keypress', handler);
      return () => document.removeEventListener('keypress', handler);
    });
  }
}
```

## Real-World Example: Service Discovery

```typescript
class ServiceDiscovery {
  private registries: string[];
  private cache: Map<string, ServiceInfo> = new Map();
  private timeoutMs: number;

  constructor(registries: string[], timeoutMs: number = 3000) {
    this.registries = registries;
    this.timeoutMs = timeoutMs;
  }

  async discoverService(serviceName: string): Promise<ServiceInfo> {
    // Check cache first
    const cached = this.cache.get(serviceName);
    if (cached && !this.isExpired(cached)) {
      return cached;
    }

    const discoveryPromises = this.registries.map(async (registry) => {
      try {
        const response = await fetch(`${registry}/services/${serviceName}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const info = await response.json();
        return { ...info, registry };
      } catch (error) {
        return Promise.reject({
          registry,
          error: `Failed to fetch from ${registry}: ${error}`,
        });
      }
    });

    try {
      // Add timeout to each discovery attempt
      const withTimeout = discoveryPromises.map((promise) =>
        Promise.race([
          promise,
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error('Discovery timeout')),
              this.timeoutMs
            )
          ),
        ])
      );

      const serviceInfo = await Promise.race(withTimeout);
      this.cache.set(serviceName, {
        ...serviceInfo,
        timestamp: Date.now(),
      });
      return serviceInfo;
    } catch (error) {
      throw new Error(`Service discovery failed for ${serviceName}: ${error}`);
    }
  }

  private isExpired(info: ServiceInfo): boolean {
    const TTL = 60000; // 1 minute
    return Date.now() - info.timestamp > TTL;
  }
}

// Usage
const discovery = new ServiceDiscovery([
  'https://registry1.example.com',
  'https://registry2.example.com',
  'https://registry3.example.com',
]);

try {
  const service = await discovery.discoverService('auth-service');
  console.log('Found service:', service);
} catch (error) {
  console.error('Service discovery failed:', error);
}
```

## Best Practices

1. Always include timeouts:

   ```typescript
   function withTimeout<T>(
     promise: Promise<T>,
     ms: number,
     errorMsg: string = 'Operation timed out'
   ): Promise<T> {
     const timeout = new Promise<never>((_, reject) =>
       setTimeout(() => reject(new Error(errorMsg)), ms)
     );
     return Promise.race([promise, timeout]);
   }
   ```

2. Handle errors appropriately:

   ```typescript
   Promise.race(promises)
     .then(handleSuccess)
     .catch((error) => {
       if (error.message === 'Operation timed out') {
         handleTimeout();
       } else {
         handleOtherError(error);
       }
     });
   ```

3. Clean up resources:

   ```typescript
   let cleanup: (() => void) | null = null;

   try {
     const result = await Promise.race([
       operation().finally(() => {
         if (cleanup) cleanup();
       }),
       timeout,
     ]);
     return result;
   } catch (error) {
     if (cleanup) cleanup();
     throw error;
   }
   ```

4. Consider cancellation:

   ```typescript
   class CancellableOperation {
     private abortController = new AbortController();

     async execute<T>(
       operation: () => Promise<T>,
       timeoutMs: number
     ): Promise<T> {
       try {
         return await Promise.race([operation(), this.timeout(timeoutMs)]);
       } catch (error) {
         this.abortController.abort();
         throw error;
       }
     }

     private timeout(ms: number): Promise<never> {
       return new Promise((_, reject) =>
         setTimeout(() => {
           reject(new Error('Operation cancelled'));
           this.abortController.abort();
         }, ms)
       );
     }
   }
   ```
