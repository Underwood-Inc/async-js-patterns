# Sequential Task Execution Examples

Learn how to execute tasks in sequence with proper error handling and state management.

## Basic Usage

```typescript
// Simple sequential execution
async function executeSequential<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

// Sequential with intermediate results
async function executeWithIntermediateResults<T>(
  tasks: (() => Promise<T>)[],
  onResult: (result: T, index: number) => void
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < tasks.length; i++) {
    const result = await tasks[i]();
    results.push(result);
    onResult(result, i);
  }
  return results;
}
```

## Advanced Patterns

### Pipeline Processing

```typescript
type PipelineStage<T, R> = (input: T) => Promise<R>;

class Pipeline<T> {
  private stages: PipelineStage<any, any>[] = [];

  addStage<R>(stage: PipelineStage<T, R>): Pipeline<R> {
    this.stages.push(stage);
    return this as unknown as Pipeline<R>;
  }

  async execute(input: T): Promise<any> {
    let current = input;
    for (const stage of this.stages) {
      current = await stage(current);
    }
    return current;
  }
}

// Usage example
const dataPipeline = new Pipeline<string>()
  .addStage(async (text) => text.toUpperCase())
  .addStage(async (text) => text.split(''))
  .addStage(async (chars) => chars.reverse())
  .addStage(async (chars) => chars.join(''));
```

### State Machine Execution

```typescript
interface State {
  name: string;
  execute: () => Promise<string>;
}

class StateMachine {
  private states: Map<string, State> = new Map();
  private transitions: Map<string, Set<string>> = new Map();

  addState(state: State): this {
    this.states.set(state.name, state);
    return this;
  }

  addTransition(from: string, to: string): this {
    if (!this.transitions.has(from)) {
      this.transitions.set(from, new Set());
    }
    this.transitions.get(from)!.add(to);
    return this;
  }

  async execute(initialState: string): Promise<string[]> {
    const history: string[] = [];
    let currentState = initialState;

    while (true) {
      const state = this.states.get(currentState);
      if (!state) throw new Error(`Invalid state: ${currentState}`);

      history.push(currentState);
      const nextState = await state.execute();

      if (!nextState) break;

      const allowedTransitions = this.transitions.get(currentState);
      if (!allowedTransitions?.has(nextState)) {
        throw new Error(`Invalid transition: ${currentState} -> ${nextState}`);
      }

      currentState = nextState;
    }

    return history;
  }
}
```

### Dependency-Based Execution

```typescript
interface Task<T> {
  id: string;
  execute: () => Promise<T>;
  dependencies: string[];
}

class DependencyExecutor<T> {
  private tasks = new Map<string, Task<T>>();
  private results = new Map<string, T>();
  private completed = new Set<string>();

  addTask(task: Task<T>): this {
    this.tasks.set(task.id, task);
    return this;
  }

  private async executeTask(taskId: string): Promise<T> {
    if (this.completed.has(taskId)) {
      return this.results.get(taskId)!;
    }

    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task not found: ${taskId}`);

    // Execute dependencies first
    await Promise.all(
      task.dependencies.map((depId) => this.executeTask(depId))
    );

    const result = await task.execute();
    this.results.set(taskId, result);
    this.completed.add(taskId);

    return result;
  }

  async execute(): Promise<Map<string, T>> {
    for (const taskId of this.tasks.keys()) {
      await this.executeTask(taskId);
    }
    return this.results;
  }
}

// Usage example
const executor = new DependencyExecutor<string>()
  .addTask({
    id: 'fetch',
    dependencies: [],
    execute: async () => 'data',
  })
  .addTask({
    id: 'process',
    dependencies: ['fetch'],
    execute: async () => 'processed',
  })
  .addTask({
    id: 'save',
    dependencies: ['process'],
    execute: async () => 'saved',
  });
```

### Retry with Backoff

```typescript
interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

async function executeWithRetry<T>(
  task: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let delay = options.initialDelay;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (attempt === options.maxAttempts) throw error;

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);

      await new Promise((resolve) => setTimeout(resolve, delay));

      delay = Math.min(delay * options.backoffFactor, options.maxDelay);
    }
  }

  throw new Error('Should not reach here');
}
```
