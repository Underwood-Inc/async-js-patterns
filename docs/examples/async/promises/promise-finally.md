---
title: Promise.finally Pattern Examples
description: Master Promise.finally patterns for proper cleanup and resource management in async operations. Learn TypeScript implementations and best practices.
date: 2024-01-01
author: Underwood Inc
tags:
  - Promise.finally
  - Cleanup Patterns
  - TypeScript
  - Resource Management
  - Error Handling
  - Async Patterns
category: examples
image: /web-patterns/images/promise-finally-banner.png
---

# Promise.finally Examples

Learn how to use `Promise.finally` for cleanup and resource management.

## Basic Usage

```typescript:preview
// Basic cleanup pattern
async function fetchWithCleanup(url: string) {
  const controller = new AbortController();
  const { signal } = controller;

  try {
    return await fetch(url, { signal });
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  } finally {
    controller.abort();
  }
}

// Resource management
async function useResource<T, R>(
  resource: T,
  work: (resource: T) => Promise<R>,
  cleanup: (resource: T) => Promise<void>
): Promise<R> {
  try {
    return await work(resource);
  } finally {
    await cleanup(resource);
  }
}
```

## Advanced Patterns

### Database Connection Management

```typescript:preview
interface Connection {
  query: (sql: string) => Promise<any>;
  close: () => Promise<void>;
}

class ConnectionPool {
  private connections: Connection[] = [];
  private inUse = new Set<Connection>();

  async acquire(): Promise<Connection> {
    // Implementation details...
    return {} as Connection;
  }

  release(connection: Connection): void {
    this.inUse.delete(connection);
    this.connections.push(connection);
  }
}

async function withConnection<T>(
  pool: ConnectionPool,
  work: (connection: Connection) => Promise<T>
): Promise<T> {
  const connection = await pool.acquire();

  try {
    return await work(connection);
  } finally {
    pool.release(connection);
  }
}
```

### Timer Management

```typescript:preview
class Timer {
  private timers: Set<NodeJS.Timeout> = new Set();

  setTimeout(callback: () => void, ms: number): NodeJS.Timeout {
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, ms);
    this.timers.add(timer);
    return timer;
  }

  clearAll(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}

async function withTimers<T>(work: (timer: Timer) => Promise<T>): Promise<T> {
  const timer = new Timer();
  try {
    return await work(timer);
  } finally {
    timer.clearAll();
  }
}
```

### File Handle Management

```typescript:preview
interface FileHandle {
  write: (data: string) => Promise<void>;
  close: () => Promise<void>;
}

async function withFile<T>(
  path: string,
  work: (file: FileHandle) => Promise<T>
): Promise<T> {
  const file: FileHandle = await openFile(path);

  try {
    return await work(file);
  } finally {
    await file.close();
  }
}

// Usage example
async function processFile(path: string): Promise<string> {
  return withFile(path, async (file) => {
    // Work with file...
    return 'processed content';
  });
}
```

### Mutex Lock Management

```typescript:preview
class Mutex {
  private locked = false;
  private queue: (() => void)[] = [];

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      next();
    } else {
      this.locked = false;
    }
  }
}

async function withMutex<T>(mutex: Mutex, work: () => Promise<T>): Promise<T> {
  await mutex.acquire();
  try {
    return await work();
  } finally {
    mutex.release();
  }
}
```
