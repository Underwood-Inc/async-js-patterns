---
title: JavaScript Timer Patterns
description: Master JavaScript timers with advanced patterns and best practices. Learn about setTimeout, setInterval, and custom timer implementations.
date: 2024-01-01
author: Underwood Inc
tags:
  - Timers
  - JavaScript
  - setTimeout
  - setInterval
  - Performance
  - Event Loop
  - Scheduling
image: /web-patterns/images/timers-banner.png
---

# Timer Patterns

Learn how to effectively work with timers and intervals in JavaScript.

## Promise-based Delay

Create a delay using Promises:

```ts
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Usage
async function example() {
  console.log('Start');
  await delay(1000);
  console.log('1 second later');
}
```

## Cancellable Timer

Create a cancellable timer:

```ts
interface Timer {
  promise: Promise<void>;
  cancel: () => void;
}

function createTimer(ms: number): Timer {
  let timeoutId: NodeJS.Timeout;
  const promise = new Promise<void>((resolve, reject) => {
    timeoutId = setTimeout(resolve, ms);
  });

  return {
    promise,
    cancel: () => clearTimeout(timeoutId),
  };
}

// Usage
const timer = createTimer(5000);
timer.promise.then(() => console.log('Timer completed'));
// Cancel if needed
timer.cancel();
```

## Interval Handler

Create a manageable interval:

```ts
interface IntervalHandler {
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
}

function createInterval(callback: () => void, ms: number): IntervalHandler {
  let intervalId: NodeJS.Timeout | null = null;

  return {
    start: () => {
      if (!intervalId) {
        intervalId = setInterval(callback, ms);
      }
    },
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
    isRunning: () => intervalId !== null,
  };
}

// Usage
const ticker = createInterval(() => console.log('Tick'), 1000);

ticker.start(); // Start ticking
ticker.stop(); // Stop ticking
```

## Debounce Timer

Implement a debounce function:

```ts
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Usage
const debouncedSearch = debounce(
  (query: string) => fetchSearchResults(query),
  300
);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

## Throttle Timer

Implement a throttle function:

```ts
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage
const throttledScroll = throttle(() => calculateScrollPosition(), 100);

window.addEventListener('scroll', throttledScroll);
```

## Best Practices

1. **Timer Management**

   - Always clean up timers when they're no longer needed
   - Use appropriate intervals to avoid performance issues
   - Consider using requestAnimationFrame for animations

2. **Error Handling**

   - Handle timer cancellation gracefully
   - Implement proper cleanup in error cases
   - Consider edge cases like browser tab visibility

3. **Performance**

   - Use debounce for high-frequency events
   - Use throttle for continuous events
   - Avoid creating unnecessary timers

4. **Memory Management**
   - Clear intervals and timeouts to prevent memory leaks
   - Remove event listeners when components unmount
   - Use weak references when appropriate
