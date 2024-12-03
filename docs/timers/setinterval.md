# Custom setInterval Implementation

## Overview

A custom implementation of setInterval that provides enhanced features like
pause/resume, dynamic interval adjustment, and proper cleanup. This
implementation also includes drift correction and precise timing options.

## Implementation

```typescript
interface IntervalTimer {
  id: number;
  delay: number;
  callback: () => void;
  startTime: number;
  expectedTicks: number;
  isPaused: boolean;
  lastTickTime: number;
}

class CustomInterval {
  private static counter = 0;
  private intervals: Map<number, IntervalTimer> = new Map();

  setInterval(
    callback: () => void,
    delay: number,
    options: {
      precise?: boolean;
      driftCorrection?: boolean;
    } = {}
  ): number {
    const { precise = false, driftCorrection = true } = options;
    const id = ++CustomInterval.counter;
    const now = Date.now();

    const timer: IntervalTimer = {
      id,
      delay,
      callback,
      startTime: now,
      expectedTicks: 0,
      isPaused: false,
      lastTickTime: now,
    };

    const executeInterval = () => {
      if (timer.isPaused) return;

      const currentTime = Date.now();
      timer.expectedTicks++;

      if (precise) {
        // Precise timing: Schedule next tick based on start time
        const nextTick = timer.startTime + timer.expectedTicks * delay;
        const adjustment = nextTick - currentTime;

        (timer as any).nativeId = window.setTimeout(
          executeInterval,
          delay + adjustment
        );
      } else if (driftCorrection) {
        // Drift correction: Adjust for execution time
        const drift = currentTime - timer.lastTickTime - delay;
        const adjustedDelay = Math.max(0, delay - drift);

        (timer as any).nativeId = window.setTimeout(
          executeInterval,
          adjustedDelay
        );
      } else {
        // Simple interval
        (timer as any).nativeId = window.setTimeout(executeInterval, delay);
      }

      timer.lastTickTime = currentTime;
      callback();
    };

    this.intervals.set(id, timer);
    (timer as any).nativeId = window.setTimeout(executeInterval, delay);

    return id;
  }

  clearInterval(id: number): void {
    const timer = this.intervals.get(id);
    if (timer) {
      window.clearTimeout((timer as any).nativeId);
      this.intervals.delete(id);
    }
  }

  pause(id: number): void {
    const timer = this.intervals.get(id);
    if (timer && !timer.isPaused) {
      window.clearTimeout((timer as any).nativeId);
      timer.isPaused = true;
    }
  }

  resume(id: number): void {
    const timer = this.intervals.get(id);
    if (timer && timer.isPaused) {
      timer.isPaused = false;
      timer.lastTickTime = Date.now();
      this.setInterval(timer.callback, timer.delay);
    }
  }

  adjustInterval(id: number, newDelay: number): void {
    const timer = this.intervals.get(id);
    if (timer) {
      window.clearTimeout((timer as any).nativeId);
      timer.delay = newDelay;
      timer.startTime = Date.now();
      timer.expectedTicks = 0;
      this.setInterval(timer.callback, newDelay);
    }
  }

  // Clear all intervals
  clearAll(): void {
    this.intervals.forEach((timer) => {
      window.clearTimeout((timer as any).nativeId);
    });
    this.intervals.clear();
  }
}
```

## Usage Example

```typescript
const interval = new CustomInterval();

// Basic usage
const intervalId = interval.setInterval(() => {
  console.log('Tick!');
}, 1000);

// With precise timing
const preciseId = interval.setInterval(
  () => {
    console.log('Precise tick!');
  },
  1000,
  { precise: true }
);

// With pause/resume
const pausableId = interval.setInterval(() => {
  console.log('Pausable tick!');
}, 1000);

// Pause after 3 seconds
setTimeout(() => {
  interval.pause(pausableId);
  console.log('Interval paused');

  // Resume after 2 seconds
  setTimeout(() => {
    interval.resume(pausableId);
    console.log('Interval resumed');
  }, 2000);
}, 3000);

// Dynamic interval adjustment
const adjustableId = interval.setInterval(() => {
  console.log('Adjustable tick!');
}, 1000);

// Change interval after 5 seconds
setTimeout(() => {
  interval.adjustInterval(adjustableId, 500);
  console.log('Interval adjusted to 500ms');
}, 5000);
```

## Key Concepts

1. **Drift Correction**: Compensate for execution time drift
2. **Precise Timing**: Option for more accurate intervals
3. **Dynamic Adjustment**: Change interval duration on the fly
4. **State Management**: Pause/resume functionality
5. **Resource Cleanup**: Proper interval cleanup

## Edge Cases

- Very short intervals (<16ms)
- Very long intervals (>MAX_INT)
- Browser throttling
- System sleep/wake
- Heavy CPU load

## Common Pitfalls

1. **Timer Drift**: Accumulated timing errors
2. **Memory Leaks**: Uncleaned intervals
3. **CPU Usage**: Too frequent intervals
4. **Browser Limitations**: Minimum interval times

## Best Practices

1. Use appropriate interval times (>16ms)
2. Clean up intervals when done
3. Consider browser throttling
4. Implement error handling
5. Monitor performance impact

## Testing

```typescript
// Test interval accuracy
const accuracyTest = async () => {
  let count = 0;
  const start = Date.now();

  return new Promise<void>((resolve) => {
    const id = interval.setInterval(
      () => {
        count++;
        if (count === 5) {
          interval.clearInterval(id);
          const duration = Date.now() - start;
          console.assert(
            Math.abs(duration - 500) < 50,
            'Should maintain timing accuracy'
          );
          resolve();
        }
      },
      100,
      { precise: true }
    );
  });
};

// Test pause/resume
const pauseTest = async () => {
  let count = 0;
  const id = interval.setInterval(() => count++, 100);

  await new Promise((resolve) => setTimeout(resolve, 250));
  interval.pause(id);
  const pausedCount = count;

  await new Promise((resolve) => setTimeout(resolve, 200));
  console.assert(count === pausedCount, 'Should not increment while paused');

  interval.resume(id);
  await new Promise((resolve) => setTimeout(resolve, 250));
  console.assert(count > pausedCount, 'Should resume incrementing');

  interval.clearInterval(id);
};
```

## Advanced Usage

```typescript
// With rate limiting
class RateLimitedInterval extends CustomInterval {
  private maxExecutionsPerMinute: number;
  private executionTimes: number[] = [];

  constructor(maxExecutionsPerMinute: number) {
    super();
    this.maxExecutionsPerMinute = maxExecutionsPerMinute;
  }

  setInterval(callback: () => void, delay: number): number {
    const wrappedCallback = () => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;

      // Clean up old execution times
      this.executionTimes = this.executionTimes.filter(
        (time) => time > oneMinuteAgo
      );

      if (this.executionTimes.length < this.maxExecutionsPerMinute) {
        this.executionTimes.push(now);
        callback();
      }
    };

    return super.setInterval(wrappedCallback, delay);
  }
}

// Usage with rate limiting
const rateLimited = new RateLimitedInterval(30); // max 30 executions per minute

const rateLimitedId = rateLimited.setInterval(() => {
  console.log('Rate-limited tick!');
}, 1000);
```
