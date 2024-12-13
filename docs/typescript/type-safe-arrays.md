---
title: TypeScript Type-Safe Arrays Guide
description: Learn type-safe array patterns in TypeScript. Master array operations, type guards, and best practices for array manipulation.
date: 2024-12-01
author: Underwood Inc
tags:
  - TypeScript
  - Arrays
  - Type Safety
  - Data Structures
  - Performance
  - Best Practices
image: /web-patterns/images/type-safe-arrays-banner.png
---

# Type-Safe Arrays in TypeScript

This section explores patterns and best practices for working with arrays in a type-safe manner using TypeScript.

## Overview

Type-safe arrays ensure that array operations maintain type safety and prevent runtime errors through static type checking.

## Basic Array Types

### Array Type Declarations

```typescript:preview
// Array type syntax
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ['a', 'b', 'c'];

// Readonly arrays
const readonlyNumbers: ReadonlyArray<number> = [1, 2, 3];
const readonlyStrings: readonly string[] = ['a', 'b', 'c'];

// Tuple types
const tuple: [string, number] = ['age', 25];
const namedTuple: [name: string, age: number] = ['John', 30];
```

### Array Type Inference

```typescript:preview
// Inferred array types
const inferredNumbers = [1, 2, 3]; // number[]
const inferredStrings = ['a', 'b', 'c']; // string[]
const inferredMixed = [1, 'a', true]; // (string | number | boolean)[]

// Const assertions
const constArray = [1, 2, 3] as const; // readonly [1, 2, 3]
const constTuple = ['name', 42] as const; // readonly ['name', 42]
```

## Advanced Patterns

### Type-Safe Array Operations

```typescript:preview
// Type-safe array methods
function typeSafeMap<T, U>(
  array: ReadonlyArray<T>,
  callback: (item: T, index: number) => U
): U[] {
  return array.map(callback);
}

function typeSafeFilter<T>(
  array: ReadonlyArray<T>,
  predicate: (item: T, index: number) => boolean
): T[] {
  return array.filter(predicate);
}

function typeSafeReduce<T, U>(
  array: ReadonlyArray<T>,
  callback: (accumulator: U, item: T, index: number) => U,
  initialValue: U
): U {
  return array.reduce(callback, initialValue);
}
```

### Array Type Guards

```typescript:preview
function isNonEmpty<T>(arr: T[]): arr is [T, ...T[]] {
  return arr.length > 0;
}

function isArrayOfType<T>(
  arr: unknown,
  typeGuard: (item: unknown) => item is T
): arr is T[] {
  return Array.isArray(arr) && arr.every(typeGuard);
}

// Usage
function processNumbers(arr: unknown) {
  if (isArrayOfType(arr, (x): x is number => typeof x === 'number')) {
    // arr is type number[]
    return arr.reduce((sum, n) => sum + n, 0);
  }
  throw new Error('Not an array of numbers');
}
```

## Real-World Example

```typescript:preview
// Domain types
interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

// Type-safe task list manager
class TaskList {
  private tasks: Task[] = [];

  add(task: Omit<Task, 'id'>): Task {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  remove(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  update(id: string, updates: Partial<Omit<Task, 'id'>>): Task {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
    };

    return this.tasks[index];
  }

  // Type-safe query methods
  findById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  findByPriority(priority: Task['priority']): Task[] {
    return this.tasks.filter((task) => task.priority === priority);
  }

  findByTag(tag: string): Task[] {
    return this.tasks.filter((task) => task.tags.includes(tag));
  }

  // Type-safe aggregation methods
  getTaskStats(): {
    total: number;
    completed: number;
    byPriority: Record<Task['priority'], number>;
    byTag: Record<string, number>;
  } {
    const stats = {
      total: this.tasks.length,
      completed: 0,
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
      },
      byTag: {} as Record<string, number>,
    };

    for (const task of this.tasks) {
      if (task.completed) {
        stats.completed++;
      }
      stats.byPriority[task.priority]++;

      for (const tag of task.tags) {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      }
    }

    return stats;
  }

  // Type-safe sorting
  sortByPriority(): Task[] {
    const priorityOrder: Task['priority'][] = ['high', 'medium', 'low'];
    return [...this.tasks].sort(
      (a, b) =>
        priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    );
  }

  // Type-safe batch operations
  batchUpdate(
    predicate: (task: Task) => boolean,
    updates: Partial<Omit<Task, 'id'>>
  ): Task[] {
    return this.tasks
      .filter(predicate)
      .map((task) => this.update(task.id, updates));
  }

  // Type-safe array transformations
  map<U>(callback: (task: Task) => U): U[] {
    return this.tasks.map(callback);
  }

  filter(predicate: (task: Task) => boolean): Task[] {
    return this.tasks.filter(predicate);
  }

  reduce<U>(callback: (accumulator: U, task: Task) => U, initialValue: U): U {
    return this.tasks.reduce(callback, initialValue);
  }
}

// Usage example
const taskList = new TaskList();

// Add tasks
const task1 = taskList.add({
  title: 'Complete documentation',
  completed: false,
  priority: 'high',
  tags: ['docs', 'urgent'],
});

const task2 = taskList.add({
  title: 'Review code',
  completed: false,
  priority: 'medium',
  tags: ['code', 'review'],
});

// Update task
taskList.update(task1.id, {
  completed: true,
});

// Get statistics
const stats = taskList.getTaskStats();
console.log('Task Statistics:', stats);

// Sort by priority
const prioritizedTasks = taskList.sortByPriority();
console.log('Prioritized Tasks:', prioritizedTasks);

// Batch update all high priority tasks
taskList.batchUpdate((task) => task.priority === 'high', {
  tags: ['high-priority', ...task1.tags],
});

// Type-safe transformations
const taskTitles = taskList.map((task) => task.title);
const incompleteTasks = taskList.filter((task) => !task.completed);
const tagCount = taskList.reduce((acc, task) => acc + task.tags.length, 0);
```

## Best Practices

1. Array Type Safety:

   - Use explicit type annotations
   - Leverage readonly arrays
   - Implement proper type guards

2. Array Operations:

   - Use type-safe array methods
   - Handle empty array cases
   - Validate array contents

3. Performance:
   - Avoid unnecessary array copies
   - Use appropriate array methods
   - Consider using Set for lookups

## References

- [TypeScript Handbook - Arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
- [TypeScript Deep Dive - Array Types](https://basarat.gitbook.io/typescript/type-system/type-assertion#array-type-assertion)
  </rewritten_file>
