---
title: Sequential Tasks Examples
description: Learn sequential task execution patterns in JavaScript. Master ordered task processing and dependency management.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Tasks
  - Async
  - Sequential Processing
  - Examples
  - Best Practices
image: /web-patterns/images/sequential-tasks-banner.png
---

# Sequential Tasks Examples

This page demonstrates practical examples of executing tasks in sequence, ensuring each task completes before the next begins.

## Basic Sequential Execution

```typescript:preview
// Basic sequential task execution
async function executeSequentially<T>(
  tasks: Array<() => Promise<T>>
): Promise<T[]> {
  const results: T[] = [];

  for (const task of tasks) {
    const result = await task();
    results.push(result);
  }

  return results;
}

// Usage
const tasks = [
  async () => {
    await delay(1000);
    return 'Task 1';
  },
  async () => {
    await delay(500);
    return 'Task 2';
  },
  async () => {
    await delay(800);
    return 'Task 3';
  },
];

const results = await executeSequentially(tasks);
console.log('Results:', results);
```

## Data Pipeline Processing

```typescript:preview
// Sequential data pipeline
class DataPipeline<T> {
  private steps: Array<(data: T) => Promise<T>> = [];

  addStep(step: (data: T) => Promise<T>) {
    this.steps.push(step);
    return this;
  }

  async process(initialData: T): Promise<T> {
    let data = initialData;

    for (const step of this.steps) {
      try {
        data = await step(data);
      } catch (error) {
        console.error('Pipeline step failed:', error);
        throw error;
      }
    }

    return data;
  }
}

// Usage
interface UserData {
  id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
  permissions?: UserPermissions;
}

const pipeline = new DataPipeline<UserData>()
  .addStep(async (user) => {
    // Load user preferences
    const preferences = await fetchUserPreferences(user.id);
    return { ...user, preferences };
  })
  .addStep(async (user) => {
    // Load user permissions
    const permissions = await fetchUserPermissions(user.id);
    return { ...user, permissions };
  })
  .addStep(async (user) => {
    // Validate complete user data
    if (!user.preferences || !user.permissions) {
      throw new Error('Incomplete user data');
    }
    return user;
  });

const enrichedUser = await pipeline.process({
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
});
```

## Dependency Resolution

```typescript:preview
// Sequential dependency resolver
class DependencyResolver {
  private dependencies = new Map<string, string[]>();
  private resolved = new Set<string>();

  addDependency(module: string, deps: string[]) {
    this.dependencies.set(module, deps);
  }

  async resolve(module: string): Promise<string[]> {
    const resolution: string[] = [];
    await this.resolveModule(module, resolution);
    return resolution;
  }

  private async resolveModule(
    module: string,
    resolution: string[]
  ): Promise<void> {
    if (this.resolved.has(module)) return;

    const deps = this.dependencies.get(module) || [];
    for (const dep of deps) {
      await this.resolveModule(dep, resolution);
    }

    resolution.push(module);
    this.resolved.add(module);
  }
}

// Usage
const resolver = new DependencyResolver();
resolver.addDependency('app', ['database', 'auth']);
resolver.addDependency('database', ['config']);
resolver.addDependency('auth', ['config']);
resolver.addDependency('config', []);

const loadOrder = await resolver.resolve('app');
console.log('Load order:', loadOrder);
// Output: ['config', 'database', 'auth', 'app']
```

## Real-World Example: User Registration Flow

```typescript:preview
class UserRegistrationFlow {
  private steps: RegistrationStep[] = [];
  private rollbackSteps: Map<string, () => Promise<void>> = new Map();

  constructor(private readonly db: Database) {
    this.initializeSteps();
  }

  private initializeSteps() {
    this.addStep('validateInput', {
      execute: async (data: RegistrationData) => {
        if (!this.isValidEmail(data.email)) {
          throw new Error('Invalid email');
        }
        if (data.password.length < 8) {
          throw new Error('Password too short');
        }
        return data;
      },
    });

    this.addStep('checkExistingUser', {
      execute: async (data: RegistrationData) => {
        const existing = await this.db.users.findByEmail(data.email);
        if (existing) {
          throw new Error('User already exists');
        }
        return data;
      },
    });

    this.addStep('createUser', {
      execute: async (data: RegistrationData) => {
        const user = await this.db.users.create({
          email: data.email,
          passwordHash: await this.hashPassword(data.password),
        });
        this.rollbackSteps.set('createUser', async () => {
          await this.db.users.delete(user.id);
        });
        return { ...data, userId: user.id };
      },
    });

    this.addStep('createProfile', {
      execute: async (data: RegistrationData) => {
        const profile = await this.db.profiles.create({
          userId: data.userId!,
          name: data.name,
        });
        this.rollbackSteps.set('createProfile', async () => {
          await this.db.profiles.delete(profile.id);
        });
        return data;
      },
    });

    this.addStep('sendWelcomeEmail', {
      execute: async (data: RegistrationData) => {
        await this.emailService.sendWelcome(data.email);
        return data;
      },
    });
  }

  async register(data: RegistrationData): Promise<User> {
    let currentStep = '';

    try {
      for (const step of this.steps) {
        currentStep = step.name;
        data = await step.execute(data);
      }

      return await this.db.users.findById(data.userId!);
    } catch (error) {
      console.error(`Registration failed at step ${currentStep}:`, error);

      // Rollback in reverse order
      const stepsToRollback = this.steps
        .slice(0, this.steps.findIndex((s) => s.name === currentStep) + 1)
        .reverse();

      for (const step of stepsToRollback) {
        const rollback = this.rollbackSteps.get(step.name);
        if (rollback) {
          try {
            await rollback();
          } catch (rollbackError) {
            console.error(
              `Rollback failed for step ${step.name}:`,
              rollbackError
            );
          }
        }
      }

      throw error;
    }
  }
}

// Usage
const registrationFlow = new UserRegistrationFlow(database);

try {
  const user = await registrationFlow.register({
    email: 'user@example.com',
    password: 'securepass123',
    name: 'John Doe',
  });
  console.log('Registration successful:', user);
} catch (error) {
  console.error('Registration failed:', error);
}
```

## Best Practices

1. Error handling with partial completion:

   ```typescript:preview
   async function executeWithRollback<T>(
     tasks: Array<{
       execute: () => Promise<T>;
       rollback: () => Promise<void>;
     }>
   ): Promise<T[]> {
     const results: T[] = [];
     const completed: number[] = [];

     try {
       for (let i = 0; i < tasks.length; i++) {
         results[i] = await tasks[i].execute();
         completed.push(i);
       }
       return results;
     } catch (error) {
       // Rollback completed tasks in reverse order
       for (const index of completed.reverse()) {
         try {
           await tasks[index].rollback();
         } catch (rollbackError) {
           console.error('Rollback failed:', rollbackError);
         }
       }
       throw error;
     }
   }
   ```

2. Progress tracking:

   ```typescript:preview
   async function executeWithProgress<T>(
     tasks: Array<() => Promise<T>>,
     onProgress: (completed: number, total: number) => void
   ): Promise<T[]> {
     const results: T[] = [];
     const total = tasks.length;

     for (let i = 0; i < tasks.length; i++) {
       results[i] = await tasks[i]();
       onProgress(i + 1, total);
     }

     return results;
   }
   ```

3. Timeout handling:

   ```typescript:preview
   async function executeWithTimeout<T>(
     task: () => Promise<T>,
     timeout: number
   ): Promise<T> {
     return Promise.race([
       task(),
       new Promise<never>((_, reject) =>
         setTimeout(() => reject(new Error('Task timeout')), timeout)
       ),
     ]);
   }

   // Usage with sequential execution
   async function executeSequentiallyWithTimeout<T>(
     tasks: Array<() => Promise<T>>,
     timeout: number
   ): Promise<T[]> {
     return Promise.all(tasks.map((task) => executeWithTimeout(task, timeout)));
   }
   ```

4. Resource management:

   ```typescript:preview
   class ResourceManager {
     private resources: Resource[] = [];

     async executeWithResources<T>(
       task: (resources: Resource[]) => Promise<T>
     ): Promise<T> {
       try {
         // Acquire resources sequentially
         for (const resource of this.requiredResources) {
           this.resources.push(await resource.acquire());
         }

         return await task(this.resources);
       } finally {
         // Release resources in reverse order
         for (const resource of this.resources.reverse()) {
           await resource.release();
         }
       }
     }
   }
   ```
