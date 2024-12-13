---
title: Debouncing Examples
description: Master debouncing techniques in JavaScript. Learn how to optimize event handling and control function execution frequency.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Debouncing
  - Performance
  - Event Handling
  - Examples
  - Best Practices
image: /web-patterns/images/debouncing-examples-banner.png
---

# Debouncing Examples

This page demonstrates practical examples of implementing and using debouncing patterns to handle rapid-fire events efficiently.

## Basic Debouncing

```typescript:preview
// Basic debounce implementation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;
  let lastArgs: Parameters<T> | undefined;

  return function (this: any, ...args: Parameters<T>): void {
    const later = () => {
      timeoutId = undefined;
      if (options.trailing !== false && lastArgs) {
        func.apply(this, lastArgs);
        lastArgs = undefined;
      }
    };

    if (!timeoutId && options.leading !== false) {
      func.apply(this, args);
    } else {
      lastArgs = args;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
}

// Usage
const handleSearch = debounce(
  (query: string) => {
    console.log('Searching for:', query);
  },
  300,
  { trailing: true }
);

// Rapid-fire events
handleSearch('a');
handleSearch('ap');
handleSearch('app');
handleSearch('appl');
handleSearch('apple');
// Only 'apple' will be logged after 300ms
```

## Advanced Debouncing

```typescript:preview
class DebouncedFunction<T extends (...args: any[]) => any> {
  private timeoutId?: NodeJS.Timeout;
  private lastArgs?: Parameters<T>;
  private lastResult?: ReturnType<T>;
  private pending = false;

  constructor(
    private readonly func: T,
    private readonly wait: number,
    private readonly options: {
      leading?: boolean;
      trailing?: boolean;
      maxWait?: number;
    } = {}
  ) {}

  execute(...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise((resolve, reject) => {
      const later = async () => {
        this.timeoutId = undefined;

        if (this.options.trailing !== false && this.lastArgs) {
          try {
            this.lastResult = await this.func.apply(this, this.lastArgs);
            resolve(this.lastResult);
          } catch (error) {
            reject(error);
          } finally {
            this.lastArgs = undefined;
            this.pending = false;
          }
        }
      };

      if (!this.timeoutId && !this.pending && this.options.leading !== false) {
        this.pending = true;
        Promise.resolve(this.func.apply(this, args))
          .then((result) => {
            this.lastResult = result;
            resolve(result);
          })
          .catch(reject)
          .finally(() => {
            this.pending = false;
          });
      } else {
        this.lastArgs = args;
        if (this.lastResult) {
          resolve(this.lastResult);
        }
      }

      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(later, this.wait);

      // Handle maxWait
      if (this.options.maxWait && this.lastArgs) {
        setTimeout(() => {
          if (this.lastArgs) {
            later();
          }
        }, this.options.maxWait);
      }
    });
  }

  cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
    this.lastArgs = undefined;
    this.pending = false;
  }

  flush(): Promise<ReturnType<T> | undefined> {
    return new Promise((resolve, reject) => {
      if (this.timeoutId && this.lastArgs) {
        clearTimeout(this.timeoutId);
        Promise.resolve(this.func.apply(this, this.lastArgs))
          .then(resolve)
          .catch(reject);
      } else {
        resolve(this.lastResult);
      }
    });
  }
}

// Usage
const searchAPI = new DebouncedFunction(
  async (query: string) => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },
  300,
  {
    leading: false,
    trailing: true,
    maxWait: 1000,
  }
);

// Event handler
async function handleSearchInput(event: InputEvent): Promise<void> {
  const query = (event.target as HTMLInputElement).value;
  try {
    const results = await searchAPI.execute(query);
    displayResults(results);
  } catch (error) {
    console.error('Search failed:', error);
  }
}
```

## Real-World Example: Form Validation

```typescript:preview
class FormValidator {
  private validators: Map<string, DebouncedFunction<any>> = new Map();
  private formState: Map<string, any> = new Map();
  private errors: Map<string, string> = new Map();

  constructor(
    private readonly options: {
      debounceWait?: number;
      maxWait?: number;
      onValidationStart?: (field: string) => void;
      onValidationComplete?: (
        field: string,
        isValid: boolean,
        error?: string
      ) => void;
    } = {}
  ) {}

  registerField(
    fieldName: string,
    validator: (value: any) => Promise<void>
  ): void {
    this.validators.set(
      fieldName,
      new DebouncedFunction(
        async (value: any) => {
          this.options.onValidationStart?.(fieldName);
          try {
            await validator(value);
            this.errors.delete(fieldName);
            this.options.onValidationComplete?.(fieldName, true);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Validation failed';
            this.errors.set(fieldName, errorMessage);
            this.options.onValidationComplete?.(fieldName, false, errorMessage);
            throw error;
          }
        },
        this.options.debounceWait ?? 300,
        {
          leading: false,
          trailing: true,
          maxWait: this.options.maxWait ?? 1000,
        }
      )
    );
  }

  async validateField(fieldName: string, value: any): Promise<void> {
    this.formState.set(fieldName, value);
    const validator = this.validators.get(fieldName);

    if (validator) {
      await validator.execute(value);
    }
  }

  async validateForm(): Promise<boolean> {
    const validations = Array.from(this.formState.entries()).map(
      ([fieldName, value]) => this.validateField(fieldName, value)
    );

    try {
      await Promise.all(validations);
      return this.errors.size === 0;
    } catch (error) {
      return false;
    }
  }

  getErrors(): Map<string, string> {
    return new Map(this.errors);
  }
}

// Usage
const validator = new FormValidator({
  debounceWait: 300,
  maxWait: 1000,
  onValidationStart: (field) => {
    showLoadingIndicator(field);
  },
  onValidationComplete: (field, isValid, error) => {
    hideLoadingIndicator(field);
    updateFieldStatus(field, isValid, error);
  },
});

// Register validators
validator.registerField('email', async (email: string) => {
  if (!email.includes('@')) {
    throw new Error('Invalid email format');
  }
  // Check if email is available
  const response = await fetch(
    `/api/check-email?email=${encodeURIComponent(email)}`
  );
  if (!response.ok) {
    throw new Error('Email already taken');
  }
});

validator.registerField('username', async (username: string) => {
  if (username.length < 3) {
    throw new Error('Username too short');
  }
  // Check username availability
  const response = await fetch(
    `/api/check-username?username=${encodeURIComponent(username)}`
  );
  if (!response.ok) {
    throw new Error('Username already taken');
  }
});

// Form event handlers
const form = document.querySelector('form');
form?.addEventListener('input', async (event) => {
  const input = event.target as HTMLInputElement;
  await validator.validateField(input.name, input.value);
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (await validator.validateForm()) {
    submitForm();
  }
});
```

## Best Practices

1. Cancellable debounce:

   ```typescript:preview
   class CancellableDebounce<T extends (...args: any[]) => any> {
     private controller = new AbortController();

     constructor(
       private readonly func: T,
       private readonly wait: number
     ) {}

     execute(...args: Parameters<T>): Promise<ReturnType<T>> {
       this.controller.abort();
       this.controller = new AbortController();
       const { signal } = this.controller;

       return new Promise((resolve, reject) => {
         const timeoutId = setTimeout(() => {
           if (!signal.aborted) {
             Promise.resolve(this.func.apply(this, args))
               .then(resolve)
               .catch(reject);
           }
         }, this.wait);

         signal.addEventListener('abort', () => {
           clearTimeout(timeoutId);
           reject(new Error('Debounced operation cancelled'));
         });
       });
     }

     cancel(): void {
       this.controller.abort();
     }
   }
   ```

2. Resource cleanup:

   ```typescript:preview
   class ResourceAwareDebounce<T extends (...args: any[]) => any> {
     private cleanup?: () => void;

     constructor(
       private readonly func: T,
       private readonly wait: number,
       private readonly resourceManager: ResourceManager
     ) {}

     async execute(...args: Parameters<T>): Promise<ReturnType<T>> {
       // Clean up previous resources
       if (this.cleanup) {
         this.cleanup();
       }

       // Acquire new resources
       const resources = await this.resourceManager.acquire();
       this.cleanup = () => {
         this.resourceManager.release(resources);
       };

       try {
         return await new Promise((resolve, reject) => {
           setTimeout(async () => {
             try {
               const result = await this.func.apply(this, args);
               resolve(result);
             } catch (error) {
               reject(error);
             } finally {
               this.cleanup?.();
             }
           }, this.wait);
         });
       } catch (error) {
         this.cleanup();
         throw error;
       }
     }
   }
   ```

3. Performance monitoring:

   ```typescript:preview
   class MonitoredDebounce<T extends (...args: any[]) => any> {
     private metrics = {
       calls: 0,
       executedCalls: 0,
       totalDelay: 0,
       lastExecutionTime: 0,
     };

     constructor(
       private readonly func: T,
       private readonly wait: number
     ) {}

     async execute(...args: Parameters<T>): Promise<ReturnType<T>> {
       this.metrics.calls++;
       const startTime = Date.now();

       return new Promise((resolve, reject) => {
         setTimeout(async () => {
           try {
             const result = await this.func.apply(this, args);
             this.recordMetrics(startTime);
             resolve(result);
           } catch (error) {
             reject(error);
           }
         }, this.wait);
       });
     }

     private recordMetrics(startTime: number): void {
       this.metrics.executedCalls++;
       this.metrics.totalDelay += Date.now() - startTime;
       this.metrics.lastExecutionTime = Date.now();
     }

     getMetrics() {
       return {
         ...this.metrics,
         averageDelay: this.metrics.totalDelay / this.metrics.executedCalls,
         executionRate: this.metrics.executedCalls / this.metrics.calls,
       };
     }
   }
   ```

4. Error boundaries:

   ```typescript:preview
   class ErrorBoundaryDebounce<T extends (...args: any[]) => any> {
     private errorHandler?: (error: Error) => void;
     private retryCount = 0;
     private readonly maxRetries = 3;

     constructor(
       private readonly func: T,
       private readonly wait: number
     ) {}

     setErrorHandler(handler: (error: Error) => void): void {
       this.errorHandler = handler;
     }

     async execute(...args: Parameters<T>): Promise<ReturnType<T>> {
       return new Promise((resolve, reject) => {
         setTimeout(async () => {
           try {
             const result = await this.func.apply(this, args);
             this.retryCount = 0;
             resolve(result);
           } catch (error) {
             this.handleError(error as Error, args)
               .then(resolve)
               .catch(reject);
           }
         }, this.wait);
       });
     }

     private async handleError(
       error: Error,
       args: Parameters<T>
     ): Promise<ReturnType<T>> {
       this.errorHandler?.(error);

       if (this.retryCount < this.maxRetries) {
         this.retryCount++;
         return this.execute(...args);
       }

       throw error;
     }
   }
   ```
