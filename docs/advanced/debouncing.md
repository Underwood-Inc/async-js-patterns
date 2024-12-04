# Debouncing

## Overview

Debouncing is a programming practice that limits the rate at which a function can be called. Think of it like a "cooling-off period" for function calls. Instead of executing the function every time it's triggered, debouncing ensures the function only runs after a specified amount of time has passed since its last invocation.

### Real-World Analogy

Think of debouncing like an elevator:

- The action (closing doors) is delayed
- Multiple triggers (button presses) during the delay are ignored
- The action only happens after a period of no new triggers
- This prevents constant starting/stopping
- Resources are used efficiently

### Common Use Cases

1. **Search Input Fields**

   - Problem: Each keystroke triggers an API call
   - Solution: Wait until the user stops typing before making the call
   - Benefit: Reduces server load and improves performance

2. **Window Resize Events**

   - Problem: Resize calculations run hundreds of times during resizing
   - Solution: Only recalculate after the user finishes resizing
   - Benefit: Smoother user experience and better performance

3. **Form Validation**
   - Problem: Validation runs on every keystroke
   - Solution: Validate after user stops typing
   - Benefit: Less CPU usage and better UX

### How It Works

1. **Function Call**

   - Function is triggered
   - Timer starts or resets
   - Previous pending execution is canceled

2. **Waiting Period**

   - Additional calls reset the timer
   - Original call is delayed
   - No execution during wait time

3. **Execution**

   - Timer expires
   - Function executes once
   - System ready for new debounce cycle

4. **Cleanup**
   - Clear any pending timers
   - Reset internal state
   - Prepare for next sequence

## Implementation

```typescript
interface DebounceOptions {
  wait: number;
  immediate?: boolean;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel: () => void;
  flush: () => Promise<ReturnType<T> | undefined>;
  pending: () => boolean;
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  options: number | DebounceOptions
): DebouncedFunction<T> {
  const opts = typeof options === 'number' ? { wait: options } : options;

  const {
    wait,
    immediate = false,
    maxWait = 0,
    leading = false,
    trailing = true,
  } = opts;

  let timeout: NodeJS.Timeout | null = null;
  let maxTimeout: NodeJS.Timeout | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let result: ReturnType<T> | undefined;
  let pending = false;

  const invokeFunc = (time: number) => {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = lastThis = null;
    lastInvokeTime = time;
    pending = false;
    result = func.apply(thisArg, args);
    return result;
  };

  const startTimer = (pendingFunc: () => void, wait: number) => {
    timeout = setTimeout(pendingFunc, wait);
  };

  const cancelTimer = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (maxTimeout) {
      clearTimeout(maxTimeout);
      maxTimeout = null;
    }
  };

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = lastCallTime ? time - lastCallTime : 0;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      !lastCallTime ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait && timeSinceLastInvoke >= maxWait)
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

  const leadingEdge = (time: number) => {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  };

  const remainingWait = (time: number) => {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  };

  const timerExpired = () => {
    const time = Date.now();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    timeout = setTimeout(timerExpired, remainingWait(time));
  };

  const debounced = function (
    this: any,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    lastArgs = args;
    lastThis = this;
    lastCallTime = Date.now();
    pending = true;

    if (!timeout) {
      if (maxWait) {
        maxTimeout = setTimeout(() => {
          if (pending) {
            invokeFunc(lastCallTime!);
          }
        }, maxWait);
      }
      return Promise.resolve(leadingEdge(lastCallTime));
    }

    if (immediate && !timeout) {
      return Promise.resolve(invokeFunc(lastCallTime));
    }

    return new Promise((resolve) => {
      const callback = () => {
        if (pending) {
          resolve(invokeFunc(lastCallTime!));
        } else {
          resolve(result!);
        }
      };

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    });
  };

  debounced.cancel = () => {
    cancelTimer();
    lastInvokeTime = 0;
    timeout = lastArgs = lastCallTime = lastThis = null;
    pending = false;
  };

  debounced.flush = async () => {
    if (pending) {
      return invokeFunc(lastCallTime!);
    }
    return result;
  };

  debounced.pending = () => pending;

  return debounced;
}
```

## Usage Example

```typescript
// Basic usage
const debouncedSearch = debounce(async (query: string) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
}, 300);

// Advanced usage with options
const debouncedSave = debounce(
  async (data: any) => {
    await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  {
    wait: 1000,
    maxWait: 5000,
    leading: true,
    trailing: true,
  }
);

// With immediate execution
const debouncedValidate = debounce(
  (value: string) => {
    return value.length >= 3;
  },
  {
    wait: 300,
    immediate: true,
  }
);

// Usage in event handler
searchInput.addEventListener('input', async (e) => {
  const results = await debouncedSearch(e.target.value);
  updateResults(results);
});
```

## Key Concepts

1. **Wait Time**: Delay between last call and execution
2. **Immediate Execution**: Option to run on the leading edge
3. **Maximum Wait**: Limit total wait time
4. **Cancellation**: Ability to cancel pending execution
5. **Promise Support**: Async function handling

## Edge Cases

- Multiple rapid calls
- Function context preservation
- Promise rejection handling
- Timer cleanup
- Memory leaks

## Common Pitfalls

1. **Memory Leaks**: Not cleaning up timers
2. **Context Loss**: Not preserving this context
3. **Race Conditions**: Multiple async calls
4. **Promise Chains**: Incorrect promise handling

## Best Practices

1. Clean up when component unmounts
2. Use appropriate wait times
3. Consider immediate execution needs
4. Handle promise rejections
5. Implement proper cancellation

## Testing

```typescript
// Test basic debouncing
const basicTest = async () => {
  let callCount = 0;
  const debounced = debounce(() => {
    callCount++;
  }, 100);

  debounced();
  debounced();
  debounced();

  await new Promise((resolve) => setTimeout(resolve, 150));
  console.assert(callCount === 1, 'Should only execute once');
};

// Test immediate execution
const immediateTest = async () => {
  let callCount = 0;
  const debounced = debounce(
    () => {
      callCount++;
    },
    { wait: 100, immediate: true }
  );

  debounced();
  console.assert(callCount === 1, 'Should execute immediately');

  debounced();
  await new Promise((resolve) => setTimeout(resolve, 150));
  console.assert(callCount === 2, 'Should execute trailing call');
};
```

## Advanced Usage

```typescript
// With TypeScript generics
function createDebouncedApi<T, R>(
  apiCall: (data: T) => Promise<R>,
  options: DebounceOptions
) {
  return debounce(apiCall, options);
}

// Usage with type safety
interface SearchParams {
  query: string;
  filters: string[];
}

interface SearchResult {
  items: any[];
  total: number;
}

const debouncedSearch = createDebouncedApi<SearchParams, SearchResult>(
  async ({ query, filters }) => {
    const response = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
    return response.json();
  },
  { wait: 300, maxWait: 1000 }
);

// With cleanup utility
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: DebounceOptions
) {
  const debouncedFn = debounce(callback, options);

  // Cleanup on unmount (if using in React)
  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, []);

  return debouncedFn;
}
```
