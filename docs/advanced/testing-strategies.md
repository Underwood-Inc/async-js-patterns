# Testing Strategies for Async Code

## Overview

Testing asynchronous code requires special consideration and techniques. This
guide covers best practices and patterns for testing async JavaScript code.

## Unit Testing

### 1. Promise Testing

```typescript
describe('Promise Operations', () => {
  it('should resolve with correct value', async () => {
    const result = await someAsyncOperation();
    expect(result).toBe(expectedValue);
  });

  it('should reject with error', async () => {
    await expect(failingAsyncOperation()).rejects.toThrow(
      'Expected error message'
    );
  });
});
```

### 2. Timer Mocking

```typescript
describe('Timer Operations', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should execute after delay', () => {
    const callback = jest.fn();

    setTimeout(callback, 1000);

    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalled();
  });
});
```

## Integration Testing

### 1. API Testing

```typescript
class APITester {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async testEndpoint(path: string, method: string, body?: any) {
    const response = await fetch(`${this.baseURL}${path}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      status: response.status,
      data: await response.json(),
    };
  }
}
```

### 2. Mock Services

```typescript
class MockService {
  private responses: Map<string, any> = new Map();

  setResponse(key: string, response: any) {
    this.responses.set(key, response);
  }

  async get(key: string) {
    const response = this.responses.get(key);
    if (!response) {
      throw new Error(`No mock response for key: ${key}`);
    }
    return response;
  }
}
```

## Performance Testing

### 1. Load Testing

```typescript
class LoadTester {
  async runConcurrent(operation: () => Promise<any>, concurrency: number) {
    const start = Date.now();
    const promises = Array(concurrency)
      .fill(null)
      .map(() => operation());

    const results = await Promise.all(promises);
    const duration = Date.now() - start;

    return {
      totalTime: duration,
      averageTime: duration / concurrency,
      successCount: results.filter((r) => r).length,
    };
  }
}
```

### 2. Memory Leak Testing

```typescript
class MemoryTester {
  private snapshots: any[] = [];

  takeSnapshot() {
    if (global.gc) {
      global.gc();
    }
    this.snapshots.push(process.memoryUsage());
  }

  async testMemoryUsage(operation: () => Promise<void>, iterations: number) {
    this.takeSnapshot(); // Initial snapshot

    for (let i = 0; i < iterations; i++) {
      await operation();
      this.takeSnapshot();
    }

    return this.analyzeSnapshots();
  }

  private analyzeSnapshots() {
    return this.snapshots.map((snapshot, index) => ({
      iteration: index,
      heapUsed: snapshot.heapUsed / 1024 / 1024, // MB
      heapTotal: snapshot.heapTotal / 1024 / 1024, // MB
    }));
  }
}
```

## Mocking Strategies

### 1. Network Mocking

```typescript
class NetworkMocker {
  private interceptors: Map<string, Function> = new Map();

  intercept(url: string, response: any) {
    this.interceptors.set(url, () => Promise.resolve(response));
  }

  async fetch(url: string) {
    const interceptor = this.interceptors.get(url);
    if (interceptor) {
      return await interceptor();
    }
    throw new Error(`No mock for URL: ${url}`);
  }
}
```

### 2. Time Control

```typescript
class TimeController {
  private currentTime: number = Date.now();

  setTime(time: number) {
    this.currentTime = time;
  }

  advanceTime(ms: number) {
    this.currentTime += ms;
  }

  now() {
    return this.currentTime;
  }
}
```
