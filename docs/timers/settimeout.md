# Custom setTimeout Implementation

## Overview

A custom implementation of setTimeout that uses promises and provides additional
features like cancellation, pause/resume, and better type safety. This
implementation also provides a way to track and manage multiple timeouts.

## Implementation

```typescript:preview
interface Timer {
  id: number;
  start: number;
  remaining: number;
  callback: () => void;
  isPaused: boolean;
}

class CustomTimeout {
  private static counter = 0;
  private timers: Map<number, Timer> = new Map();

  setTimeout(callback: () => void, delay: number): number {
    const id = ++CustomTimeout.counter;

    this.timers.set(id, {
      id,
      start: Date.now(),
      remaining: delay,
      callback,
      isPaused: false,
    });

    const timeoutId = window.setTimeout(() => {
      this.executeAndClean(id);
    }, delay);

    // Store the native timeout ID with our timer
    (this.timers.get(id) as any).nativeId = timeoutId;

    return id;
  }

  clearTimeout(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      window.clearTimeout((timer as any).nativeId);
      this.timers.delete(id);
    }
  }

  pause(id: number): void {
    const timer = this.timers.get(id);
    if (timer && !timer.isPaused) {
      window.clearTimeout((timer as any).nativeId);
      timer.remaining -= Date.now() - timer.start;
      timer.isPaused = true;
    }
  }

  resume(id: number): void {
    const timer = this.timers.get(id);
    if (timer && timer.isPaused) {
      timer.isPaused = false;
      timer.start = Date.now();

      const timeoutId = window.setTimeout(() => {
        this.executeAndClean(id);
      }, timer.remaining);

      (timer as any).nativeId = timeoutId;
    }
  }

  private executeAndClean(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      timer.callback();
      this.timers.delete(id);
    }
  }

  // Promise-based version
  setTimeoutPromise(delay: number): Promise<void> & { timerId: number } {
    let timerId: number;

    const promise = new Promise<void>((resolve) => {
      timerId = this.setTimeout(resolve, delay);
    }) as Promise<void> & { timerId: number };

    promise.timerId = timerId!;
    return promise;
  }

  // Get remaining time
  getTimeRemaining(id: number): number {
    const timer = this.timers.get(id);
    if (!timer) return 0;

    if (timer.isPaused) {
      return timer.remaining;
    }

    return timer.remaining - (Date.now() - timer.start);
  }

  // Clear all timeouts
  clearAll(): void {
    this.timers.forEach((timer) => {
      window.clearTimeout((timer as any).nativeId);
    });
    this.timers.clear();
  }
}
```

## Usage Example

```typescript:preview
const timeout = new CustomTimeout();

// Basic usage
const timerId = timeout.setTimeout(() => {
  console.log('Timeout completed!');
}, 2000);

// Promise-based usage
const timeoutPromise = timeout.setTimeoutPromise(2000);
timeoutPromise.then(() => {
  console.log('Promise timeout completed!');
});

// With pause/resume
const pausableId = timeout.setTimeout(() => {
  console.log('Pausable timeout completed!');
}, 5000);

// Pause after 2 seconds
setTimeout(() => {
  timeout.pause(pausableId);
  console.log('Timeout paused');

  // Resume after 1 more second
  setTimeout(() => {
    timeout.resume(pausableId);
    console.log('Timeout resumed');
  }, 1000);
}, 2000);
```

## Key Concepts

1. **Timer Management**: Track all active timeouts
2. **Pause/Resume**: Ability to pause and resume timeouts
3. **Promise Integration**: Promise-based API
4. **Cleanup**: Proper resource management
5. **Type Safety**: TypeScript support

## Edge Cases

- Multiple pause/resume calls
- Clearing already completed timeout
- Negative delay values
- Maximum timeout value
- Browser tab inactive

## Common Pitfalls

1. **Memory Leaks**: Not clearing unused timeouts
2. **Timer Accuracy**: JavaScript timing limitations
3. **Resource Management**: Too many concurrent timeouts
4. **State Management**: Complex pause/resume states

## Best Practices

1. Always clear timeouts when done
2. Use promise-based version for modern code
3. Implement proper error handling
4. Consider browser limitations
5. Track and manage timeout resources

## Testing

```typescript:preview
// Test basic timeout
const basicTest = async () => {
  const start = Date.now();
  await timeout.setTimeoutPromise(100);
  const duration = Date.now() - start;
  console.assert(duration >= 100, 'Should wait at least 100ms');
};

// Test pause/resume
const pauseTest = async () => {
  let completed = false;
  const id = timeout.setTimeout(() => {
    completed = true;
  }, 300);

  await timeout.setTimeoutPromise(100);
  timeout.pause(id);

  await timeout.setTimeoutPromise(100);
  console.assert(!completed, 'Should not complete while paused');

  timeout.resume(id);
  await timeout.setTimeoutPromise(200);
  console.assert(completed, 'Should complete after resume');
};

// Test cleanup
const cleanupTest = () => {
  const id = timeout.setTimeout(() => {}, 1000);
  timeout.clearTimeout(id);
  console.assert(!timeout.getTimeRemaining(id), 'Should clean up timer');
};
```

## Advanced Usage

```typescript:preview
// With retry mechanism
async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  const timeout = new CustomTimeout();

  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === retries - 1) throw error;
      await timeout.setTimeoutPromise(delay * Math.pow(2, i));
    }
  }

  throw new Error('Should not reach here');
}

// With progress tracking
class ProgressTimeout extends CustomTimeout {
  onProgress?: (remaining: number, total: number) => void;

  setTimeoutWithProgress(
    callback: () => void,
    delay: number,
    onProgress?: (remaining: number, total: number) => void
  ): number {
    this.onProgress = onProgress;
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, delay - elapsed);
      this.onProgress?.(remaining, delay);

      if (remaining === 0) {
        clearInterval(progressInterval);
      }
    }, 100);

    const id = this.setTimeout(() => {
      clearInterval(progressInterval);
      callback();
    }, delay);

    return id;
  }
}
```
