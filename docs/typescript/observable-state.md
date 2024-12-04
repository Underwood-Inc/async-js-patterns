# Observable State in TypeScript

This section explores patterns and best practices for implementing observable state in TypeScript applications.

## Overview

Observable state patterns allow for reactive state management where components can subscribe to state changes and react accordingly.

## Core Concepts

### 1. Basic Observable

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

### 2. Event Emitter

```typescript
type EventHandler<T> = (data: T) => void;

class EventEmitter<T extends string> {
  private handlers: Map<T, Set<EventHandler<any>>> = new Map();

  on<K extends T>(event: K, handler: EventHandler<any>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    this.handlers.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off<K extends T>(event: K, handler: EventHandler<any>): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit<K extends T>(event: K, data: any): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}
```

## Advanced Patterns

### 1. Observable Store

```typescript
type Subscriber<T> = (state: T) => void;
type Selector<T, R> = (state: T) => R;

class Store<T extends object> {
  private state: T;
  private subscribers: Set<Subscriber<T>> = new Set();
  private computedCache: Map<Selector<T, any>, any> = new Map();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): Readonly<T> {
    return Object.freeze({ ...this.state });
  }

  select<R>(selector: Selector<T, R>): R {
    if (this.computedCache.has(selector)) {
      return this.computedCache.get(selector)!;
    }

    const result = selector(this.state);
    this.computedCache.set(selector, result);
    return result;
  }

  setState(partial: Partial<T>): void {
    const newState = { ...this.state, ...partial };
    if (!this.isEqual(this.state, newState)) {
      this.state = newState;
      this.computedCache.clear();
      this.notify();
    }
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.state);
    return () => this.subscribers.delete(subscriber);
  }

  private notify(): void {
    this.subscribers.forEach((subscriber) => subscriber(this.state));
  }

  private isEqual(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
```

### 2. Computed Observables

```typescript
class ComputedObservable<T, R> implements Observer<T> {
  private value: R;
  private observers: Set<Observer<R>> = new Set();

  constructor(
    private source: Observable<T>,
    private compute: (value: T) => R
  ) {
    this.value = this.compute(source.getValue());
    source.subscribe(this);
  }

  update(value: T): void {
    const newValue = this.compute(value);
    if (!this.isEqual(this.value, newValue)) {
      this.value = newValue;
      this.notify();
    }
  }

  subscribe(observer: Observer<R>): () => void {
    this.observers.add(observer);
    observer.update(this.value);
    return () => this.observers.delete(observer);
  }

  getValue(): R {
    return this.value;
  }

  private notify(): void {
    this.observers.forEach((observer) => observer.update(this.value));
  }

  private isEqual(a: R, b: R): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
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

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assigneeId: string;
}

interface AppState {
  users: User[];
  tasks: Task[];
  selectedUserId: string | null;
}

// Application store
class TaskManager {
  private store: Store<AppState>;

  constructor() {
    this.store = new Store<AppState>({
      users: [],
      tasks: [],
      selectedUserId: null,
    });
  }

  // Selectors
  private readonly getSelectedUserId = (state: AppState) =>
    state.selectedUserId;
  private readonly getTasks = (state: AppState) => state.tasks;
  private readonly getUsers = (state: AppState) => state.users;

  readonly getSelectedUserTasks = (state: AppState) => {
    const selectedUserId = this.getSelectedUserId(state);
    return selectedUserId
      ? this.getTasks(state).filter(
          (task) => task.assigneeId === selectedUserId
        )
      : [];
  };

  readonly getTaskStats = (state: AppState) => {
    const tasks = this.getTasks(state);
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length,
    };
  };

  // State updates
  addUser(user: User): void {
    this.store.setState({
      users: [...this.store.getState().users, user],
    });
  }

  addTask(task: Task): void {
    this.store.setState({
      tasks: [...this.store.getState().tasks, task],
    });
  }

  setSelectedUser(userId: string | null): void {
    this.store.setState({ selectedUserId: userId });
  }

  toggleTaskCompletion(taskId: string): void {
    this.store.setState({
      tasks: this.store
        .getState()
        .tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
    });
  }

  // Subscriptions
  subscribeToSelectedUserTasks(callback: (tasks: Task[]) => void): () => void {
    return this.store.subscribe((state) => {
      callback(this.getSelectedUserTasks(state));
    });
  }

  subscribeToTaskStats(
    callback: (stats: ReturnType<typeof this.getTaskStats>) => void
  ): () => void {
    return this.store.subscribe((state) => {
      callback(this.getTaskStats(state));
    });
  }
}

// Usage
const taskManager = new TaskManager();

// Add users
taskManager.addUser({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
});

// Subscribe to task stats
const unsubscribeStats = taskManager.subscribeToTaskStats((stats) => {
  console.log('Task Stats:', stats);
});

// Add tasks
taskManager.addTask({
  id: '1',
  title: 'Complete project',
  completed: false,
  assigneeId: '1',
});

// Select user and subscribe to their tasks
taskManager.setSelectedUser('1');
const unsubscribeTasks = taskManager.subscribeToSelectedUserTasks((tasks) => {
  console.log('Selected User Tasks:', tasks);
});

// Toggle task completion
taskManager.toggleTaskCompletion('1');

// Cleanup
unsubscribeStats();
unsubscribeTasks();
```

## Best Practices

1. State Management:

   - Keep state immutable
   - Use selectors for derived state
   - Implement proper cleanup

2. Performance:

   - Use memoization for computed values
   - Implement shallow equality checks
   - Clean up subscriptions

3. Type Safety:
   - Define strict interfaces
   - Use discriminated unions
   - Leverage generic constraints

## References

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [RxJS Documentation](https://rxjs.dev/guide/overview)
