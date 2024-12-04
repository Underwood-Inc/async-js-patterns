# Promise.any Examples

This page demonstrates practical examples of using `Promise.any` to handle multiple promises and take the first successful result.

## Basic Usage

```typescript:preview
// Basic example with multiple API endpoints
async function fetchFromAnyEndpoint<T>(endpoints: string[]): Promise<T> {
  try {
    return await Promise.any(
      endpoints.map((url) =>
        fetch(url).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
      )
    );
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('All endpoints failed:', error.errors);
    }
    throw error;
  }
}

// Usage
const endpoints = [
  'https://api1.example.com/data',
  'https://api2.example.com/data',
  'https://api3.example.com/data',
];

try {
  const data = await fetchFromAnyEndpoint(endpoints);
  console.log('First successful response:', data);
} catch (error) {
  console.error('All endpoints failed:', error);
}
```

## Fallback Mechanisms

```typescript:preview
// Implementing fallback mechanisms
class ServiceWithFallback {
  private primaryEndpoint: string;
  private fallbackEndpoints: string[];

  constructor(primary: string, fallbacks: string[]) {
    this.primaryEndpoint = primary;
    this.fallbackEndpoints = fallbacks;
  }

  async fetch<T>(path: string): Promise<T> {
    const endpoints = [this.primaryEndpoint, ...this.fallbackEndpoints].map(
      (base) => `${base}${path}`
    );

    try {
      // Try primary first with a short timeout
      const primaryResult = await Promise.race([
        fetch(endpoints[0]),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Primary timeout')), 1000)
        ),
      ]);
      return await primaryResult.json();
    } catch (primaryError) {
      console.warn('Primary endpoint failed, trying fallbacks');

      // If primary fails, try all endpoints with Promise.any
      try {
        const response = await Promise.any(
          endpoints.map((url) =>
            fetch(url).then((res) => {
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              return res.json();
            })
          )
        );
        return response;
      } catch (error) {
        if (error instanceof AggregateError) {
          console.error('All endpoints failed:', error.errors);
        }
        throw error;
      }
    }
  }
}
```

## Authentication System

```typescript:preview
// Multiple authentication providers
class MultiAuthSystem {
  private providers: AuthProvider[];

  constructor(providers: AuthProvider[]) {
    this.providers = providers;
  }

  async authenticate(credentials: Credentials): Promise<AuthToken> {
    try {
      const token = await Promise.any(
        this.providers.map((provider) =>
          provider.authenticate(credentials).catch((error) => {
            console.warn(`Auth failed for provider ${provider.name}:`, error);
            throw error;
          })
        )
      );
      return token;
    } catch (error) {
      if (error instanceof AggregateError) {
        throw new Error(
          'Authentication failed with all providers: ' +
            error.errors.map((e) => e.message).join(', ')
        );
      }
      throw error;
    }
  }
}

// Usage
const authSystem = new MultiAuthSystem([
  new OAuth2Provider(),
  new JWTProvider(),
  new BasicAuthProvider(),
]);

try {
  const token = await authSystem.authenticate({
    username: 'user',
    password: 'pass',
  });
  console.log('Authentication successful:', token);
} catch (error) {
  console.error('Authentication failed:', error);
}
```

## Resource Loading

```typescript:preview
// Loading resources from multiple sources
class ResourceLoader {
  async loadResource(
    resourceId: string,
    options: LoadOptions = {}
  ): Promise<Resource> {
    const sources = this.getResourceSources(resourceId);
    const loadPromises = sources.map(async (source) => {
      try {
        const resource = await this.loadFromSource(source, resourceId);
        if (this.validateResource(resource)) {
          return resource;
        }
        throw new Error('Invalid resource format');
      } catch (error) {
        console.warn(`Failed to load from ${source}:`, error);
        throw error;
      }
    });

    try {
      const resource = await Promise.any(loadPromises);
      if (options.cache) {
        await this.cacheResource(resourceId, resource);
      }
      return resource;
    } catch (error) {
      if (error instanceof AggregateError) {
        // Try to load from cache if all sources fail
        if (options.cache) {
          const cached = await this.loadFromCache(resourceId);
          if (cached) {
            console.warn('Using cached resource after all sources failed');
            return cached;
          }
        }
        throw new Error(
          'Failed to load resource from any source: ' +
            error.errors.map((e) => e.message).join(', ')
        );
      }
      throw error;
    }
  }

  private getResourceSources(resourceId: string): string[] {
    // Return list of possible sources for the resource
    return [
      `https://cdn1.example.com/resources/${resourceId}`,
      `https://cdn2.example.com/resources/${resourceId}`,
      `https://backup.example.com/resources/${resourceId}`,
    ];
  }
}
```

## Real-World Example: Service Discovery

```typescript:preview
class ServiceDiscoveryClient {
  private registries: string[];
  private cache: Map<string, ServiceInfo>;
  private ttl: number;

  constructor(registries: string[], ttl: number = 60000) {
    this.registries = registries;
    this.cache = new Map();
    this.ttl = ttl;
  }

  async discoverService(
    serviceName: string,
    required: boolean = true
  ): Promise<ServiceInfo | null> {
    // Check cache first
    const cached = this.cache.get(serviceName);
    if (cached && !this.isExpired(cached)) {
      return cached;
    }

    const discoveryPromises = this.registries.map(async (registry) => {
      try {
        const response = await fetch(`${registry}/discover/${serviceName}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const info = await response.json();
        return this.validateServiceInfo(info);
      } catch (error) {
        console.warn(`Service discovery failed for ${registry}:`, error);
        throw error;
      }
    });

    try {
      const serviceInfo = await Promise.any(discoveryPromises);
      this.cache.set(serviceName, {
        ...serviceInfo,
        timestamp: Date.now(),
      });
      return serviceInfo;
    } catch (error) {
      if (error instanceof AggregateError) {
        if (!required) return null;
        throw new Error(`Service ${serviceName} not found in any registry`);
      }
      throw error;
    }
  }

  private isExpired(info: ServiceInfo): boolean {
    return Date.now() - info.timestamp > this.ttl;
  }

  private validateServiceInfo(info: any): ServiceInfo {
    if (!info.host || !info.port) {
      throw new Error('Invalid service info format');
    }
    return info as ServiceInfo;
  }
}

// Usage
const discovery = new ServiceDiscoveryClient([
  'https://registry1.example.com',
  'https://registry2.example.com',
  'https://registry3.example.com',
]);

try {
  const service = await discovery.discoverService('auth-service');
  console.log('Service discovered:', service);
} catch (error) {
  console.error('Service discovery failed:', error);
}
```

## Best Practices

1. Always handle AggregateError:

   ```typescript:preview
   try {
     const result = await Promise.any(promises);
     return result;
   } catch (error) {
     if (error instanceof AggregateError) {
       console.error('All promises failed:', error.errors);
       // Handle individual errors if needed
       error.errors.forEach((e) => console.error(e));
     }
     throw error;
   }
   ```

2. Implement proper logging:

   ```typescript:preview
   const promises = endpoints.map(async (endpoint, index) => {
     try {
       const result = await fetch(endpoint);
       console.log(`Endpoint ${index} succeeded`);
       return result;
     } catch (error) {
       console.warn(`Endpoint ${index} failed:`, error);
       throw error;
     }
   });
   ```

3. Consider timeouts:

   ```typescript:preview
   function withTimeout(promise: Promise<any>, ms: number) {
     return Promise.race([
       promise,
       new Promise((_, reject) =>
         setTimeout(() => reject(new Error('Timeout')), ms)
       ),
     ]);
   }

   // Usage with Promise.any
   Promise.any(promises.map((p) => withTimeout(p, 5000)));
   ```

4. Implement fallback mechanisms:
   ```typescript:preview
   async function withFallback<T>(
     primary: Promise<T>,
     fallbacks: Promise<T>[]
   ): Promise<T> {
     try {
       return await primary;
     } catch (error) {
       console.warn('Primary failed, trying fallbacks:', error);
       return Promise.any(fallbacks);
     }
   }
   ```
