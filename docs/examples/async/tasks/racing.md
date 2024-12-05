---
title: Racing Task Execution Patterns
description: Master racing task execution patterns in TypeScript. Learn how to handle competitive task execution, timeouts, and cancellation strategies.
date: 2024-01-01
author: Underwood Inc
tags:
  - Racing Tasks
  - Task Competition
  - TypeScript
  - Timeouts
  - Cancellation
  - Performance
category: examples
image: /web-patterns/images/racing-tasks-banner.png
---

# Racing Task Execution Examples

Learn how to implement racing patterns for competitive task execution.

## Basic Usage

```typescript
// Simple racing with timeout
async function executeWithTimeout<T>(
  task: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Task timed out')), timeoutMs)
  );

  return Promise.race([task(), timeoutPromise]);
}

// First successful result
async function executeUntilSuccess<T>(tasks: (() => Promise<T>)[]): Promise<T> {
  return Promise.any(tasks.map((task) => task()));
}
```

## Advanced Patterns

### Race with Cleanup

```typescript
interface RaceResult<T> {
  result: T;
  winner: number;
  cleanup: () => Promise<void>;
}

async function raceWithCleanup<T>(
  tasks: (() => Promise<T>)[]
): Promise<RaceResult<T>> {
  const cleanups: (() => Promise<void>)[] = [];

  const racingTasks = tasks.map(async (task, index) => {
    try {
      const result = await task();
      return {
        result,
        winner: index,
        cleanup: async () => {
          await Promise.all(cleanups.map((cleanup) => cleanup()));
        },
      };
    } catch (error) {
      if (cleanups[index]) {
        await cleanups[index]();
      }
      throw error;
    }
  });

  return Promise.race(racingTasks);
}

// Usage example
const result = await raceWithCleanup([
  async () => {
    const controller = new AbortController();
    cleanups[0] = async () => controller.abort();
    return fetch(url1, { signal: controller.signal });
  },
  async () => {
    const controller = new AbortController();
    cleanups[1] = async () => controller.abort();
    return fetch(url2, { signal: controller.signal });
  },
]);
```

### Progressive Racing

```typescript
interface ProgressiveRaceOptions<T> {
  tasks: (() => Promise<T>)[];
  validateResult: (result: T) => boolean;
  timeout: number;
  maxAttempts: number;
}

async function progressiveRace<T>({
  tasks,
  validateResult,
  timeout,
  maxAttempts,
}: ProgressiveRaceOptions<T>): Promise<T> {
  const attempts = new Set<number>();
  let currentTimeout = timeout;

  while (attempts.size < Math.min(tasks.length, maxAttempts)) {
    // Select next task that hasn't been attempted
    const availableTasks = tasks
      .map((task, index) => ({ task, index }))
      .filter(({ index }) => !attempts.has(index));

    if (availableTasks.length === 0) break;

    const { task, index } = availableTasks[0];
    attempts.add(index);

    try {
      const result = await executeWithTimeout(task, currentTimeout);
      if (validateResult(result)) {
        return result;
      }
    } catch (error) {
      console.warn(`Task ${index} failed:`, error);
    }

    // Increase timeout for next attempt
    currentTimeout *= 1.5;
  }

  throw new Error('All racing attempts failed');
}
```

### Competitive Racing

```typescript
interface Competitor<T> {
  execute: () => Promise<T>;
  priority: number;
  timeout: number;
}

async function competitiveRace<T>(competitors: Competitor<T>[]): Promise<T> {
  // Sort by priority (higher priority starts first)
  const sorted = [...competitors].sort((a, b) => b.priority - a.priority);

  const results = new Map<number, Promise<T>>();
  const timeouts = new Map<number, NodeJS.Timeout>();

  for (let i = 0; i < sorted.length; i++) {
    const competitor = sorted[i];

    // Start execution after delay based on priority
    const startDelay = i * 100; // 100ms between each competitor

    const competitorPromise = new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(async () => {
        try {
          const result = await competitor.execute();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, startDelay);

      timeouts.set(i, timeout);
    });

    results.set(i, competitorPromise);

    // Set competitor timeout
    const timeoutPromise = new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Competitor ${i} timed out`));
      }, competitor.timeout + startDelay);
    });

    // Race between completion and timeout
    results.set(i, Promise.race([competitorPromise, timeoutPromise]));
  }

  try {
    // Wait for first successful result
    const result = await Promise.any(Array.from(results.values()));

    // Cleanup remaining timeouts
    timeouts.forEach((timeout) => clearTimeout(timeout));

    return result;
  } catch (error) {
    timeouts.forEach((timeout) => clearTimeout(timeout));
    throw error;
  }
}

// Usage example
const result = await competitiveRace([
  {
    priority: 3,
    timeout: 5000,
    execute: async () => fetch('primary-endpoint'),
  },
  {
    priority: 2,
    timeout: 3000,
    execute: async () => fetch('secondary-endpoint'),
  },
  {
    priority: 1,
    timeout: 2000,
    execute: async () => fetch('fallback-endpoint'),
  },
]);
```
