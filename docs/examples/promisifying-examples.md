# Promisifying Examples

This page demonstrates practical examples of converting callback-based APIs to Promise-based APIs.

## Basic Promisification

```typescript
// Basic promisify implementation
function promisify<T>(
  fn: (...args: any[]) => void
): (...args: any[]) => Promise<T> {
  return function (...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      fn(...args, (error: Error | null, result: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Usage with Node.js fs module
import { readFile } from 'fs';

const readFileAsync = promisify<string>(readFile);

try {
  const content = await readFileAsync('file.txt', 'utf8');
  console.log('File content:', content);
} catch (error) {
  console.error('Error reading file:', error);
}
```

## Advanced Promisification

```typescript
class Promisifier {
  private static defaultOptions: PromisifyOptions = {
    multiArgs: false,
    thisArg: undefined,
    preserveName: true,
  };

  static promisify<T>(
    fn: Function,
    options: Partial<PromisifyOptions> = {}
  ): (...args: any[]) => Promise<T> {
    const opts = { ...this.defaultOptions, ...options };

    const promisified = function (this: any, ...args: any[]): Promise<T> {
      const ctx = opts.thisArg ?? this;

      return new Promise((resolve, reject) => {
        const callback = (error: Error | null, ...results: any[]) => {
          if (error) {
            reject(error);
            return;
          }

          if (opts.multiArgs) {
            resolve(results as any);
          } else {
            resolve(results[0]);
          }
        };

        try {
          fn.apply(ctx, [...args, callback]);
        } catch (error) {
          reject(error);
        }
      });
    };

    if (opts.preserveName) {
      Object.defineProperty(promisified, 'name', {
        value: `${fn.name}Async`,
        configurable: true,
      });
    }

    return promisified;
  }

  static promisifyAll(obj: any, options: Partial<PromisifyOptions> = {}): void {
    const props = Object.getOwnPropertyNames(obj);

    for (const prop of props) {
      const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      if (descriptor && typeof obj[prop] === 'function') {
        obj[`${prop}Async`] = this.promisify(obj[prop], options);
      }
    }
  }
}

// Usage with event emitter
import { EventEmitter } from 'events';

class DatabaseClient extends EventEmitter {
  query(
    sql: string,
    callback: (error: Error | null, result: any) => void
  ): void {
    // Simulate database query
    setTimeout(() => {
      if (sql.toLowerCase().includes('error')) {
        callback(new Error('Query failed'), null);
      } else {
        callback(null, { rows: [{ id: 1, name: 'Test' }] });
      }
    }, 100);
  }

  transaction(
    operations: string[],
    callback: (error: Error | null, results: any[]) => void
  ): void {
    // Simulate transaction
    setTimeout(() => {
      const results = operations.map((op) => ({
        operation: op,
        status: 'success',
      }));
      callback(null, results);
    }, 200);
  }
}

// Promisify individual method
const db = new DatabaseClient();
const queryAsync = Promisifier.promisify<any>(db.query.bind(db));

// Promisify all methods
Promisifier.promisifyAll(db);

// Usage
try {
  const result = await queryAsync('SELECT * FROM users');
  console.log('Query result:', result);

  const transactionResults = await db.transactionAsync([
    'INSERT INTO users',
    'UPDATE users',
  ]);
  console.log('Transaction results:', transactionResults);
} catch (error) {
  console.error('Database error:', error);
}
```

## Real-World Example: Legacy API Wrapper

```typescript
class LegacyApiWrapper {
  private api: LegacyApi;
  private promisified: Map<string, Function> = new Map();

  constructor(api: LegacyApi) {
    this.api = api;
    this.promisifyMethods();
  }

  private promisifyMethods(): void {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this.api)
    );

    for (const name of methodNames) {
      if (name === 'constructor') continue;

      const method = this.api[name];
      if (typeof method === 'function') {
        this.promisified.set(name, this.promisifyMethod(name, method));
      }
    }
  }

  private promisifyMethod(name: string, method: Function): Function {
    return async (...args: any[]): Promise<any> => {
      return new Promise((resolve, reject) => {
        const callback = (error: Error | null, ...results: any[]) => {
          if (error) {
            // Enhance error with context
            const enhancedError = new ApiError(error.message, {
              method: name,
              arguments: args,
              originalError: error,
            });
            reject(enhancedError);
            return;
          }

          // Transform results if needed
          const transformed = this.transformResults(name, results);
          resolve(transformed);
        };

        try {
          method.apply(this.api, [...args, callback]);
        } catch (error) {
          reject(
            new ApiError('Method invocation failed', {
              method: name,
              arguments: args,
              originalError: error,
            })
          );
        }
      });
    };
  }

  private transformResults(method: string, results: any[]): any {
    // Apply method-specific transformations
    switch (method) {
      case 'getUsers':
        return this.transformUsers(results[0]);
      case 'getOrders':
        return this.transformOrders(results[0]);
      default:
        return results[0];
    }
  }

  private transformUsers(users: any[]): User[] {
    return users.map((user) => ({
      id: user.user_id,
      name: user.user_name,
      email: user.user_email,
      createdAt: new Date(user.created_timestamp),
    }));
  }

  private transformOrders(orders: any[]): Order[] {
    return orders.map((order) => ({
      id: order.order_id,
      userId: order.user_id,
      amount: parseFloat(order.amount),
      status: order.status.toLowerCase(),
      createdAt: new Date(order.created_timestamp),
    }));
  }

  async call<T>(method: string, ...args: any[]): Promise<T> {
    const promisified = this.promisified.get(method);
    if (!promisified) {
      throw new Error(`Method ${method} not found`);
    }
    return promisified(...args);
  }
}

// Usage
class LegacyApi {
  getUsers(callback: (error: Error | null, users: any[]) => void): void {
    // Simulate legacy API call
    setTimeout(() => {
      callback(null, [
        {
          user_id: 1,
          user_name: 'John Doe',
          user_email: 'john@example.com',
          created_timestamp: '2023-01-01T00:00:00Z',
        },
      ]);
    }, 100);
  }

  getOrders(
    userId: number,
    callback: (error: Error | null, orders: any[]) => void
  ): void {
    // Simulate legacy API call
    setTimeout(() => {
      callback(null, [
        {
          order_id: 1,
          user_id: userId,
          amount: '99.99',
          status: 'COMPLETED',
          created_timestamp: '2023-01-02T00:00:00Z',
        },
      ]);
    }, 100);
  }
}

const legacyApi = new LegacyApi();
const wrapper = new LegacyApiWrapper(legacyApi);

// Modern async/await usage
async function getUserData(userId: number) {
  try {
    const users = await wrapper.call<User[]>('getUsers');
    const orders = await wrapper.call<Order[]>('getOrders', userId);

    return {
      user: users.find((u) => u.id === userId),
      orders,
    };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}
```

## Best Practices

1. Error handling:

   ```typescript
   class PromiseError extends Error {
     constructor(
       message: string,
       public readonly context: {
         method: string;
         args: any[];
         originalError?: Error;
       }
     ) {
       super(message);
       this.name = 'PromiseError';
     }

     toJSON() {
       return {
         name: this.name,
         message: this.message,
         context: this.context,
       };
     }
   }

   function promisifyWithErrors<T>(
     fn: Function,
     errorMap: Map<string, typeof Error>
   ): (...args: any[]) => Promise<T> {
     return function (...args: any[]): Promise<T> {
       return new Promise((resolve, reject) => {
         fn(...args, (error: Error | null, result: T) => {
           if (error) {
             const ErrorClass = errorMap.get(error.name) ?? PromiseError;
             reject(
               new ErrorClass(error.message, {
                 method: fn.name,
                 args,
                 originalError: error,
               })
             );
           } else {
             resolve(result);
           }
         });
       });
     };
   }
   ```

2. Timeout handling:

   ```typescript
   function promisifyWithTimeout<T>(
     fn: Function,
     timeout: number
   ): (...args: any[]) => Promise<T> {
     return function (...args: any[]): Promise<T> {
       return new Promise((resolve, reject) => {
         const timeoutId = setTimeout(() => {
           reject(new Error('Operation timed out'));
         }, timeout);

         fn(...args, (error: Error | null, result: T) => {
           clearTimeout(timeoutId);
           if (error) {
             reject(error);
           } else {
             resolve(result);
           }
         });
       });
     };
   }
   ```

3. Resource cleanup:

   ```typescript
   function promisifyWithCleanup<T>(
     fn: Function,
     cleanup: () => void
   ): (...args: any[]) => Promise<T> {
     return function (...args: any[]): Promise<T> {
       return new Promise((resolve, reject) => {
         fn(...args, (error: Error | null, result: T) => {
           try {
             cleanup();
           } catch (cleanupError) {
             console.error('Cleanup failed:', cleanupError);
           }

           if (error) {
             reject(error);
           } else {
             resolve(result);
           }
         });
       });
     };
   }
   ```

4. Event handling:

   ```typescript
   function promisifyEvent<T>(
     emitter: EventEmitter,
     eventName: string
   ): Promise<T> {
     return new Promise((resolve, reject) => {
       function handler(data: T) {
         cleanup();
         resolve(data);
       }

       function errorHandler(error: Error) {
         cleanup();
         reject(error);
       }

       function cleanup() {
         emitter.removeListener(eventName, handler);
         emitter.removeListener('error', errorHandler);
       }

       emitter.once(eventName, handler);
       emitter.once('error', errorHandler);
     });
   }
   ```
