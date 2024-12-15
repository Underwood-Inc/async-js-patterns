---
title: Throttling
description: Master the implementation of throttling patterns to control execution frequency in JavaScript and TypeScript applications.
head:
  - - meta
    - name: keywords
      content: throttling, rate limiting, performance optimization, JavaScript, TypeScript, async patterns, execution control, event handling
  - - meta
    - name: author
      content: Modern Web Development Patterns
  - - meta
    - property: og:title
      content: Throttling | Advanced Async Patterns
  - - meta
    - property: og:description
      content: Learn how to implement throttling patterns to optimize execution frequency and improve performance in modern web applications.
---

# Throttling

## Overview

Throttling is a rate-limiting technique that controls how many times a function can be called within a specified time period. Unlike debouncing which waits for a quiet period, throttling ensures a function executes at a regular interval, even if it's being called more frequently.

### Real-World Analogy

Think of throttling like a water faucet with a flow restrictor:

- Water (function calls) constantly tries to flow through
- The restrictor (throttle) limits the flow rate
- No matter how much pressure (how many calls), the flow remains constant
- Excess water (calls) is discarded
- The flow rate (execution rate) remains steady and predictable

### Common Use Cases

1. **Scroll Event Handlers**

   - Problem: Scroll events fire hundreds of times per second
   - Solution: Limit processing to every X milliseconds
   - Benefit: Smooth scrolling and better performance

2. **Game Input Processing**

   - Problem: Player actions happening too rapidly
   - Solution: Enforce minimum time between actions
   - Benefit: Fair gameplay and controlled response rate

3. **API Rate Limiting**
   - Problem: Too many API requests overwhelming servers
   - Solution: Limit requests to X per second/minute
   - Benefit: Server protection and fair resource usage

### How It Works

1. **Initial Call**

   - Function is called
   - Execution is allowed
   - Timer starts

2. **During Throttle Period**

   - Additional calls are received
   - Check if enough time has passed
   - Block or allow based on timing

3. **Timer Management**

   - Track last execution time
   - Calculate next allowed execution
   - Handle edge cases

4. **Options**
   - Leading edge execution
   - Trailing edge execution
   - Maximum wait time

## Implementation

::: code-with-tooltips

```typescript
interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel: () => void;
  flush: () => Promise<ReturnType<T> | undefined>;
}

function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: ThrottleOptions = {}
): ThrottledFunction<T> {
  const { leading = true, trailing = true, maxWait = wait } = options;

  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let lastCallTime: number | null = null;
  let lastExecuteTime = 0;
  let result: ReturnType<T>;

  const invokeFunc = (time: number) => {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = lastThis = null;
    lastExecuteTime = time;
    result = func.apply(thisArg, args);
    return result;
  };

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = lastCallTime ? time - lastCallTime : 0;
    const timeSinceLastExecute = time - lastExecuteTime;

    return (
      !lastCallTime ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait && timeSinceLastExecute >= maxWait)
    );
  };

  const trailingEdge = (time: number) => {
    timeout = null;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = null;
    return result;
  };

  const timerExpired = () => {
    const time = Date.now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    if (!timeout) {
      return result;
    }

    // Restart timer
    const timeWaiting = wait - (time - lastCallTime!);
    timeout = setTimeout(timerExpired, timeWaiting);
  };

  const throttled = function (
    this: any,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (!timeout) {
        lastExecuteTime = time;
        if (leading) {
          return Promise.resolve(invokeFunc(time));
        }
      }

      if (maxWait) {
        // Handle maxWait case
        timeout = setTimeout(timerExpired, maxWait);
      }
    }

    if (!timeout && trailing) {
      timeout = setTimeout(timerExpired, wait);
    }

    return Promise.resolve(result);
  };

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastArgs = lastThis = lastCallTime = null;
  };

  throttled.flush = async () => {
    if (timeout) {
      return trailingEdge(Date.now());
    }
    return result;
  };

  return throttled;
}
```

:::

## Usage Example

::: code-with-tooltips

```typescript
// Basic API rate limiting
const throttledApi = throttle(
  async (data: any) => {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  1000 // Max one call per second
);

// Scroll event handling
const throttledScroll = throttle(
  () => {
    console.log('Scroll position:', window.scrollY);
  },
  100,
  { leading: true, trailing: true }
);

window.addEventListener('scroll', throttledScroll);

// Real-time updates
const throttledUpdate = throttle(
  async (value: string) => {
    await fetch('/api/update', {
      method: 'POST',
      body: JSON.stringify({ value }),
    });
  },
  2000,
  { maxWait: 5000 }
);

// Usage in input handler
input.addEventListener('input', (e) => {
  throttledUpdate(e.target.value);
});
```

:::

## Key Concepts

1. **Time Window**: Fixed interval between executions
2. **Leading/Trailing**: Control execution timing
3. **Maximum Wait**: Guarantee execution frequency
4. **Cancellation**: Stop pending executions
5. **Promise Support**: Handle async operations

## Edge Cases

- Rapid successive calls
- Timer accuracy
- Function context
- Promise resolution order
- Memory management

## Common Pitfalls

1. **Lost Updates**: Missing trailing calls
2. **Memory Leaks**: Not cleaning up timers
3. **Context Issues**: This binding problems
4. **Race Conditions**: Async execution order

## Best Practices

1. Choose appropriate intervals
2. Clean up on component unmount
3. Consider leading/trailing needs
4. Handle promise rejections
5. Monitor performance impact

## Testing

::: code-with-tooltips

```typescript
// Test throttle timing
const timingTest = async () => {
  let callCount = 0;
  const throttled = throttle(() => {
    callCount++;
  }, 100);

  // Call multiple times rapidly
  throttled();
  throttled();
  throttled();

  await new Promise((resolve) => setTimeout(resolve, 50));
  console.assert(callCount === 1, 'Should execute immediately once');

  await new Promise((resolve) => setTimeout(resolve, 100));
  console.assert(callCount === 2, 'Should execute trailing call');
};

// Test with promises
const promiseTest = async () => {
  const results: number[] = [];
  const throttled = throttle(async (n: number) => {
    results.push(n);
    return n;
  }, 100);

  await Promise.all([throttled(1), throttled(2), throttled(3)]);

  console.assert(results.length === 2, 'Should throttle async calls');
};
```

:::

## Advanced Usage

::: code-with-tooltips

```typescript
// With request queue
class ThrottledQueue<T> {
  private queue: T[] = [];
  private processing = false;

  constructor(
    private processor: (item: T) => Promise<void>,
    private interval: number
  ) {}

  async add(item: T): Promise<void> {
    this.queue.push(item);
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      try {
        await this.processor(item);
      } catch (error) {
        console.error('Processing error:', error);
      }
      await new Promise((resolve) => setTimeout(resolve, this.interval));
    }

    this.processing = false;
  }
}

// Usage with queue
const requestQueue = new ThrottledQueue(
  async (request: Request) => {
    await fetch(request);
  },
  1000 // One request per second
);

// Add requests to queue
requestQueue.add(new Request('/api/endpoint1'));
requestQueue.add(new Request('/api/endpoint2'));
```

:::
