# TypeScript State Management

This section covers TypeScript-specific state management patterns and best practices.

## Overview

State management in TypeScript applications requires careful consideration of type safety, immutability, and reactivity. This guide explores various patterns and implementations.

## Basic State Management

### Simple State Container

```typescript
class State<T> {
  private listeners: Set<(state: T) => void> = new Set();

  constructor(private state: T) {}

  getState(): Readonly<T> {
    return Object.freeze({ ...this.state });
  }

  setState(newState: Partial<T>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}
```

### Type-Safe Actions

```typescript
type Action<T extends string = string, P = any> = {
  type: T;
  payload?: P;
};

type ActionCreator<T extends string, P> = {
  type: T;
  (payload: P): Action<T, P>;
};

function createAction<T extends string, P>(type: T): ActionCreator<T, P> {
  const actionCreator = (payload: P): Action<T, P> => ({ type, payload });
  actionCreator.type = type;
  return actionCreator;
}
```

## Advanced Patterns

### Immutable State Updates

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

class ImmutableState<T extends object> {
  private state: DeepReadonly<T>;

  constructor(initialState: T) {
    this.state = Object.freeze(initialState) as DeepReadonly<T>;
  }

  getState(): DeepReadonly<T> {
    return this.state;
  }

  update<K extends keyof T>(key: K, value: T[K]): void {
    this.state = Object.freeze({
      ...this.state,
      [key]: value,
    }) as DeepReadonly<T>;
  }

  updateNested<K extends keyof T>(path: (string | number)[], value: any): void {
    const newState = { ...this.state };
    let current: any = newState;

    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]] = { ...current[path[i]] };
      current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    this.state = Object.freeze(newState) as DeepReadonly<T>;
  }
}
```

### Observable State

```typescript
interface Observer<T> {
  update(value: T): void;
}

class Observable<T> {
  private observers: Set<Observer<T>> = new Set();
  private value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    observer.update(this.value);
    return () => this.observers.delete(observer);
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    this.value = newValue;
    this.notify();
  }

  private notify(): void {
    this.observers.forEach((observer) => observer.update(this.value));
  }
}
```

## Real-World Example

```typescript
// Application state types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

// Actions
const setUser = createAction<'SET_USER', User>('SET_USER');
const setLoading = createAction<'SET_LOADING', boolean>('SET_LOADING');
const setError = createAction<'SET_ERROR', string | null>('SET_ERROR');
const updatePreferences = createAction<
  'UPDATE_PREFERENCES',
  Partial<AppState['preferences']>
>('UPDATE_PREFERENCES');

// State manager
class AppStateManager {
  private state: ImmutableState<AppState>;
  private observable: Observable<AppState>;

  constructor() {
    const initialState: AppState = {
      user: null,
      isLoading: false,
      error: null,
      preferences: {
        theme: 'light',
        notifications: true,
      },
    };

    this.state = new ImmutableState(initialState);
    this.observable = new Observable(initialState);
  }

  dispatch(action: Action): void {
    switch (action.type) {
      case 'SET_USER':
        this.state.update('user', action.payload);
        break;
      case 'SET_LOADING':
        this.state.update('isLoading', action.payload);
        break;
      case 'SET_ERROR':
        this.state.update('error', action.payload);
        break;
      case 'UPDATE_PREFERENCES':
        this.state.updateNested(['preferences'], {
          ...this.state.getState().preferences,
          ...action.payload,
        });
        break;
    }

    this.observable.setValue(this.state.getState());
  }

  subscribe(observer: Observer<AppState>): () => void {
    return this.observable.subscribe(observer);
  }

  getState(): DeepReadonly<AppState> {
    return this.state.getState();
  }
}

// Usage example
const stateManager = new AppStateManager();

const userObserver: Observer<AppState> = {
  update(state: AppState) {
    console.log('User state changed:', state.user);
  },
};

// Subscribe to state changes
const unsubscribe = stateManager.subscribe(userObserver);

// Dispatch actions
stateManager.dispatch(setLoading(true));
stateManager.dispatch(
  setUser({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  })
);
stateManager.dispatch(setLoading(false));

// Update preferences
stateManager.dispatch(
  updatePreferences({
    theme: 'dark',
  })
);

// Unsubscribe when done
unsubscribe();
```

## Best Practices

1. Type Safety:

   - Use strict TypeScript configurations
   - Leverage type inference
   - Define explicit action types

2. Immutability:

   - Use readonly modifiers
   - Implement deep immutability
   - Return new state objects

3. Performance:
   - Implement memoization
   - Use shallow equality checks
   - Batch state updates

## References

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Deep Dive - Immutability](https://basarat.gitbook.io/typescript/future-javascript/immutable)
