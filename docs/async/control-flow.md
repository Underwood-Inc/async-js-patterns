---
title: Async Control Flow Guide
description: Master asynchronous control flow patterns in JavaScript. Learn about timers, intervals, and advanced flow control techniques.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Async
  - Control Flow
  - Timers
  - Intervals
  - Best Practices
image: /web-patterns/images/async-control-flow-banner.png
---

# Control Flow

Learn how to manage asynchronous control flow in JavaScript.

## Sequential Flow

Execute operations in sequence:

```typescript:preview
async function sequentialFlow<T>(
  input: T,
  operations: ((data: T) => Promise<T>)[]
): Promise<T> {
  let result = input;
  for (const operation of operations) {
    result = await operation(result);
  }
  return result;
}

// Usage
const processUser = await sequentialFlow(userData, [
  validateUser,
  enrichUserData,
  saveToDatabase
]);
```

## Parallel Flow

Execute operations in parallel:

```typescript:preview
async function parallelFlow<T, R>(
  inputs: T[],
  operation: (input: T) => Promise<R>,
  maxConcurrent = Infinity
): Promise<R[]> {
  const results: R[] = new Array(inputs.length);
  const running = new Set<Promise<void>>();
  let nextIndex = 0;

  async function runTask(index: number) {
    try {
      results[index] = await operation(inputs[index]);
    } catch (error) {
      throw error;
    }
  }

  while (nextIndex < inputs.length || running.size > 0) {
    if (nextIndex < inputs.length && running.size < maxConcurrent) {
      const index = nextIndex++;
      const promise = runTask(index).finally(() => running.delete(promise));
      running.add(promise);
    } else if (running.size > 0) {
      await Promise.race(running);
    }
  }

  return results;
}

// Usage
const userIds = [1, 2, 3, 4, 5];
const users = await parallelFlow(userIds, fetchUser, 2); // Max 2 concurrent requests
```

## Race Conditions

Handle race conditions properly:

```typescript:preview
class RequestManager {
  private currentRequest: symbol | null = null;

  async fetch<T>(url: string): Promise<T> {
    const requestId = Symbol();
    this.currentRequest = requestId;

    try {
      const response = await fetch(url);

      // Check if this request is still valid
      if (this.currentRequest !== requestId) {
        throw new Error('Request superseded');
      }

      return await response.json();
    } finally {
      if (this.currentRequest === requestId) {
        this.currentRequest = null;
      }
    }
  }
}

// Usage
const manager = new RequestManager();
manager.fetch('/api/data').catch(error => {
  if (error.message === 'Request superseded') {
    console.log('Request was cancelled by a newer request');
  }
});
```

## State Machine

Implement an async state machine:

```typescript:preview
type State = 'idle' | 'loading' | 'success' | 'error';
type Transition = 'fetch' | 'success' | 'error' | 'reset';

class AsyncStateMachine {
  private state: State = 'idle';
  private listeners: ((state: State) => void)[] = [];

  private transitions: Record<State, Partial<Record<Transition, State>>> = {
    idle: { fetch: 'loading' },
    loading: {
      success: 'success',
      error: 'error'
    },
    success: { reset: 'idle' },
    error: { reset: 'idle', fetch: 'loading' }
  };

  getState(): State {
    return this.state;
  }

  transition(event: Transition): boolean {
    const nextState = this.transitions[this.state]?.[event];
    if (nextState) {
      this.state = nextState;
      this.notify();
      return true;
    }
    return false;
  }

  subscribe(listener: (state: State) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Usage with async operation
const machine = new AsyncStateMachine();
const unsubscribe = machine.subscribe(state =>
  console.log('State changed:', state)
);

async function fetchData() {
  machine.transition('fetch');
  try {
    const data = await fetch('/api/data');
    machine.transition('success');
    return data;
  } catch (error) {
    machine.transition('error');
    throw error;
  }
}
```

## Event Sequencing

Control event sequence and timing:

```typescript:preview
class EventSequencer {
  private events: Map<string, Promise<void>> = new Map();
  private completedEvents: Set<string> = new Set();

  async waitFor(eventName: string): Promise<void> {
    if (this.completedEvents.has(eventName)) {
      return;
    }

    const existingPromise = this.events.get(eventName);
    if (existingPromise) {
      return existingPromise;
    }

    const promise = new Promise<void>((resolve) => {
      const checkComplete = () => {
        if (this.completedEvents.has(eventName)) {
          resolve();
          this.events.delete(eventName);
        } else {
          requestAnimationFrame(checkComplete);
        }
      };
      checkComplete();
    });

    this.events.set(eventName, promise);
    return promise;
  }

  complete(eventName: string): void {
    this.completedEvents.add(eventName);
  }

  reset(eventName?: string): void {
    if (eventName) {
      this.completedEvents.delete(eventName);
      this.events.delete(eventName);
    } else {
      this.completedEvents.clear();
      this.events.clear();
    }
  }
}

// Usage
const sequencer = new EventSequencer();

async function initializeApp() {
  // Wait for required events
  await Promise.all([
    sequencer.waitFor('config_loaded'),
    sequencer.waitFor('user_authenticated')
  ]);

  // Continue with initialization
  await setupApplication();
}

// Trigger events when ready
loadConfig().then(() => sequencer.complete('config_loaded'));
authenticateUser().then(() => sequencer.complete('user_authenticated'));
```

## Best Practices

1. **Flow Control**

   - Choose appropriate execution patterns
   - Handle dependencies correctly
   - Manage concurrency effectively

2. **State Management**

   - Use state machines for complex flows
   - Handle transitions atomically
   - Maintain clear state boundaries

3. **Race Conditions**

   - Implement proper cancellation
   - Handle out-of-order responses
   - Use request identifiers

4. **Error Handling**

   - Implement proper error boundaries
   - Handle state transitions on errors
   - Provide meaningful error context

5. **Performance**
   - Control parallel execution
   - Implement proper timeouts
   - Monitor execution flow
