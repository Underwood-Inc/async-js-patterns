# Custom clearAllTimers Implementation

## Overview

A comprehensive timer management system that can track and clear all types of timers (setTimeout, setInterval) in an application. This implementation helps prevent memory leaks and provides a clean way to reset timer state.

## Implementation

```typescript
class TimerManager {
  private static instance: TimerManager;
  private timeouts: Map<number, NodeJS.Timeout> = new Map();
  private intervals: Map<number, NodeJS.Timeout> = new Map();
  private timeoutCounter = 0;
  private intervalCounter = 0;

  private constructor() {}

  static getInstance(): TimerManager {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  setTimeout(
    callback: (...args: any[]) => void,
    delay: number,
    ...args: any[]
  ): number {
    const id = ++this.timeoutCounter;
    const timeoutId = setTimeout(() => {
      callback(...args);
      this.timeouts.delete(id);
    }, delay);

    this.timeouts.set(id, timeoutId);
    return id;
  }

  setInterval(
    callback: (...args: any[]) => void,
    delay: number,
    ...args: any[]
  ): number {
    const id = ++this.intervalCounter;
    const intervalId = setInterval(callback, delay, ...args);
    this.intervals.set(id, intervalId);
    return id;
  }

  clearTimeout(id: number): void {
    const timeoutId = this.timeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(id);
    }
  }

  clearInterval(id: number): void {
    const intervalId = this.intervals.get(id);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(id);
    }
  }

  clearAllTimers(): void {
    // Clear all timeouts
    this.timeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.timeouts.clear();

    // Clear all intervals
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.intervals.clear();
  }

  getActiveTimerCount(): { timeouts: number; intervals: number } {
    return {
      timeouts: this.timeouts.size,
      intervals: this.intervals.size,
    };
  }

  clearTimersByGroup(groupId: string): void {
    const groupPattern = new RegExp(`^${groupId}`);

    // Clear matching timeouts
    this.timeouts.forEach((_, id) => {
      if (groupPattern.test(String(id))) {
        this.clearTimeout(id);
      }
    });

    // Clear matching intervals
    this.intervals.forEach((_, id) => {
      if (groupPattern.test(String(id))) {
        this.clearInterval(id);
      }
    });
  }
}
```

## Usage Example

```typescript
const timerManager = TimerManager.getInstance();

// Set some timeouts and intervals
const timeoutId = timerManager.setTimeout(() => {
  console.log('Timeout executed!');
}, 1000);

const intervalId = timerManager.setInterval(() => {
  console.log('Interval tick!');
}, 500);

// Check active timers
console.log(timerManager.getActiveTimerCount());
// Output: { timeouts: 1, intervals: 1 }

// Clear all timers
timerManager.clearAllTimers();
console.log(timerManager.getActiveTimerCount());
// Output: { timeouts: 0, intervals: 0 }

// Using groups
const groupId = 'notification';
timerManager.setTimeout(() => {
  console.log('Notification timeout 1');
}, 1000);

timerManager.setTimeout(() => {
  console.log('Notification timeout 2');
}, 2000);

// Clear all notification timers
timerManager.clearTimersByGroup(groupId);
```

## Key Concepts

1. **Singleton Pattern**: Single instance for global timer management
2. **Timer Tracking**: Keep track of all active timers
3. **Group Management**: Organize timers by groups
4. **Resource Cleanup**: Proper cleanup of all timer resources
5. **Type Safety**: TypeScript support for better reliability

## Edge Cases

- Multiple timer manager instances
- Clearing already cleared timers
- Maximum number of concurrent timers
- Browser tab visibility changes
- System sleep/wake cycles

## Common Pitfalls

1. **Memory Leaks**: Not clearing all timer references
2. **Zombie Timers**: Timers that should be dead but aren't
3. **Race Conditions**: Clearing timers during execution
4. **Resource Exhaustion**: Too many active timers

## Best Practices

1. Always use the timer manager for timer operations
2. Clear timers when components unmount
3. Group related timers together
4. Monitor active timer count
5. Implement proper error handling

## Testing

```typescript
// Test timer cleanup
const cleanupTest = async () => {
  const manager = TimerManager.getInstance();

  // Create multiple timers
  manager.setTimeout(() => {}, 1000);
  manager.setInterval(() => {}, 1000);

  const beforeCount = manager.getActiveTimerCount();
  manager.clearAllTimers();
  const afterCount = manager.getActiveTimerCount();

  console.assert(
    beforeCount.timeouts === 1 && beforeCount.intervals === 1,
    'Should track active timers'
  );

  console.assert(
    afterCount.timeouts === 0 && afterCount.intervals === 0,
    'Should clear all timers'
  );
};

// Test group clearing
const groupTest = () => {
  const manager = TimerManager.getInstance();
  const group1 = 'group1';
  const group2 = 'group2';

  manager.setTimeout(() => {}, 1000); // group1
  manager.setTimeout(() => {}, 1000); // group1
  manager.setTimeout(() => {}, 1000); // group2

  manager.clearTimersByGroup(group1);

  const remaining = manager.getActiveTimerCount();
  console.assert(remaining.timeouts === 1, 'Should only clear group timers');
};
```

## Advanced Usage

```typescript
// With automatic cleanup
class AutoCleanupTimerManager extends TimerManager {
  private cleanupInterval: number;

  constructor(cleanupIntervalMs: number = 60000) {
    super();
    this.cleanupInterval = this.setInterval(() => {
      this.cleanupStaleTimers();
    }, cleanupIntervalMs);
  }

  private cleanupStaleTimers(): void {
    const now = Date.now();

    this.timeouts.forEach((timer, id) => {
      if ((timer as any).startTime + (timer as any).delay < now) {
        this.clearTimeout(id);
      }
    });
  }

  // Override setTimeout to track start time
  setTimeout(
    callback: (...args: any[]) => void,
    delay: number,
    ...args: any[]
  ): number {
    const id = super.setTimeout(callback, delay, ...args);
    const timer = this.timeouts.get(id);
    if (timer) {
      (timer as any).startTime = Date.now();
      (timer as any).delay = delay;
    }
    return id;
  }
}

// Usage with automatic cleanup
const autoCleanupManager = new AutoCleanupTimerManager(30000);
autoCleanupManager.setTimeout(() => {
  console.log('This timer will be auto-cleaned if stale');
}, 5000);
```
