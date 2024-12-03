# Memory Management

## Overview

Memory management is crucial for long-running JavaScript applications. This
guide covers best practices and patterns for managing memory in async
operations.

## Memory Leaks in Async Code

### Common Sources

- Uncancelled timers
- Unresolved Promises
- Event listeners
- Closure references

### Prevention Strategies

1. Timer cleanup
2. Promise cancellation
3. Proper event listener removal
4. WeakMap/WeakSet usage

## Best Practices

### 1. Timer Management

```typescript
class Timer {
  private timers = new Set<number>();

  setTimeout(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      fn();
    }, ms);
    this.timers.add(id);
    return () => {
      window.clearTimeout(id);
      this.timers.delete(id);
    };
  }

  clearAll() {
    this.timers.forEach((id) => {
      window.clearTimeout(id);
    });
    this.timers.clear();
  }
}
```

### 2. Resource Cleanup

```typescript
class ResourceManager {
  private resources = new WeakMap();

  acquire(key: object, resource: any) {
    this.resources.set(key, resource);
  }

  release(key: object) {
    this.resources.delete(key);
  }
}
```

### 3. Event Handler Management

```typescript
class EventManager {
  private handlers = new Map();

  on(event: string, handler: Function) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event).add(handler);

    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  cleanup() {
    this.handlers.clear();
  }
}
```

## Memory Profiling

### Using Chrome DevTools

1. Take heap snapshots
2. Compare snapshots
3. Analyze retention paths
4. Identify memory leaks

### Automated Memory Monitoring

```typescript
class MemoryMonitor {
  private static instance: MemoryMonitor;
  private warnings = new Set<string>();

  static getInstance() {
    if (!this.instance) {
      this.instance = new MemoryMonitor();
    }
    return this.instance;
  }

  trackMemoryUsage(operation: string) {
    if (performance.memory) {
      const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
      const usage = (usedJSHeapSize / jsHeapSizeLimit) * 100;

      if (usage > 80 && !this.warnings.has(operation)) {
        console.warn(
          `High memory usage (${usage.toFixed(2)}%) in ${operation}`
        );
        this.warnings.add(operation);
      }
    }
  }
}
```
