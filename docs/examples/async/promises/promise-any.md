---
title: Promise.any Pattern Examples
description: Learn how to use Promise.any for handling multiple async operations and selecting the first successful result. Includes TypeScript examples and best practices.
date: 2024-01-01
author: Underwood Inc
tags:
  - Promise.any
  - Async Patterns
  - TypeScript
  - Error Handling
  - Race Conditions
  - Fallback Patterns
category: examples
image: /web-patterns/images/promise-any-banner.png
---

# Promise.any Examples

Learn how to use `Promise.any` for handling the first successful promise resolution.

## Basic Usage

```typescript:preview
// Basic first success pattern
async function fetchFirstAvailable(urls: string[]) {
  try {
    const response = await Promise.any(urls.map((url) => fetch(url)));
    return await response.json();
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('All requests failed:', error.errors);
    }
    throw error;
  }
}

// First successful validation
async function validateWithMultipleSchemas<T>(
  data: T,
  validators: ((data: T) => Promise<boolean>)[]
) {
  try {
    await Promise.any(validators.map((validator) => validator(data)));
    return true;
  } catch {
    return false;
  }
}
```

## Advanced Patterns

### Service Discovery

```typescript:preview
interface ServiceEndpoint {
  url: string;
  priority: number;
}

async function discoverService(endpoints: ServiceEndpoint[]) {
  const sortedEndpoints = [...endpoints].sort(
    (a, b) => b.priority - a.priority
  );
  const checks = sortedEndpoints.map(async (endpoint) => {
    try {
      const response = await fetch(`${endpoint.url}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return endpoint;
    } catch {
      throw new Error(`Service at ${endpoint.url} unavailable`);
    }
  });

  try {
    return await Promise.any(checks);
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('All endpoints failed:', error.errors);
    }
    throw new Error('No services available');
  }
}
```

### Resource Loading with Fallbacks

```typescript:preview
interface Resource {
  type: 'cdn' | 'local' | 'backup';
  url: string;
}

async function loadResourceWithFallback(resources: Resource[]) {
  const loadAttempts = resources.map(async (resource) => {
    try {
      const response = await fetch(resource.url);
      if (!response.ok) throw new Error(`Failed to load from ${resource.type}`);

      const data = await response.blob();
      return { type: resource.type, data };
    } catch (error) {
      console.warn(`Failed to load from ${resource.type}:`, error);
      throw error;
    }
  });

  try {
    const result = await Promise.any(loadAttempts);
    console.log(`Successfully loaded from ${result.type}`);
    return result.data;
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('All resource loading attempts failed:', error.errors);
    }
    throw new Error('Failed to load resource from any source');
  }
}
```

### Authentication with Multiple Providers

```typescript:preview
interface AuthProvider {
  name: string;
  authenticate: () => Promise<string>; // Returns auth token
}

async function authenticateWithAnyProvider(providers: AuthProvider[]) {
  const authAttempts = providers.map(async (provider) => {
    try {
      const token = await provider.authenticate();
      return { provider: provider.name, token };
    } catch (error) {
      console.warn(`Authentication failed for ${provider.name}:`, error);
      throw error;
    }
  });

  try {
    const result = await Promise.any(authAttempts);
    console.log(`Successfully authenticated with ${result.provider}`);
    return result.token;
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('All authentication attempts failed:', error.errors);
    }
    throw new Error('Authentication failed with all providers');
  }
}
```
