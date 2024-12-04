# Promise.finally Implementation

## Overview

`Promise.finally()` returns a Promise that will execute a specified function
when the promise is settled (either fulfilled or rejected). This implementation
includes proper resource cleanup, error handling, and performance monitoring.

## Implementation

```typescript:preview
import { AsyncOperationError } from '../advanced/error-handling';
import { PerformanceMonitor } from '../advanced/performance-monitoring';

function promiseFinally<T>(
  promise: Promise<T>,
  onFinally: () => void | Promise<void>
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();

  return monitor.trackOperation('Promise.finally', () =>
    promise.then(
      (value) => Promise.resolve(onFinally()).then(() => value),
      (reason) =>
        Promise.resolve(onFinally()).then(() => Promise.reject(reason))
    )
  );
}

// Extension method
declare global {
  interface Promise<T> {
    finally(onFinally: () => void | Promise<void>): Promise<T>;
  }
}

if (!Promise.prototype.finally) {
  Promise.prototype.finally = function <T>(
    this: Promise<T>,
    onFinally: () => void | Promise<void>
  ): Promise<T> {
    return promiseFinally(this, onFinally);
  };
}
```

## Usage Examples

### Basic Usage

```typescript:preview
function fetchData() {
  let connection;

  return connectToDatabase()
    .then((conn) => {
      connection = conn;
      return conn.query('SELECT * FROM users');
    })
    .finally(() => {
      if (connection) {
        connection.close();
      }
    });
}
```

### Resource Cleanup

```typescript:preview
class ResourceManager {
  private resources: Set<{ cleanup: () => Promise<void> }> = new Set();

  async withCleanup<T>(
    operation: () => Promise<T>,
    cleanup: () => Promise<void>
  ): Promise<T> {
    const resource = { cleanup };
    this.resources.add(resource);

    try {
      return await operation();
    } finally {
      await cleanup();
      this.resources.delete(resource);
    }
  }

  async cleanupAll(): Promise<void> {
    await Promise.all(Array.from(this.resources).map((r) => r.cleanup()));
    this.resources.clear();
  }
}

// Usage
const manager = new ResourceManager();
await manager.withCleanup(
  () => fetch('https://api.example.com/data'),
  async () => {
    console.log('Cleaning up resources...');
  }
);
```

### Error Handling

```typescript:preview
async function robustOperation() {
  let resource;
  try {
    resource = await acquireResource();
    return await performOperation(resource);
  } catch (error) {
    console.error('Operation failed:', error);
    throw error;
  } finally {
    if (resource) {
      try {
        await resource.release();
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
        // Don't throw from finally
      }
    }
  }
}
```

## Key Features

1. **Guaranteed Execution**

   - Runs regardless of promise state
   - Handles both success and failure
   - Preserves original result/error

2. **Resource Management**

   - Safe cleanup operations
   - Error handling in cleanup
   - Resource tracking

3. **Chain Preservation**

   - Maintains promise chain
   - Proper error propagation
   - Return value handling

4. **Error Handling**
   - Cleanup error management
   - Original error preservation
   - Error context maintenance

## Best Practices

1. **Error Handling**

   ```typescript:preview
   // Always catch potential errors
   promise
     .then(handleSuccess)
     .catch(handleError)
     .finally(() => {
       try {
         cleanup();
       } catch (error) {
         console.error('Cleanup failed:', error);
       }
     });
   ```

2. **Resource Cleanup**

   ```typescript:preview
   // Use finally for cleanup operations
   const connection = await connect();
   processData(connection).finally(() => {
     connection.close();
   });
   ```

3. **Async Cleanup**

   ```typescript:preview
   // Handle async cleanup properly
   async function withAsyncCleanup() {
     const resource = await acquire();
     try {
       return await process(resource);
     } finally {
       await resource.cleanup();
     }
   }
   ```

## Common Pitfalls

1. **Returning Values from Finally**

   ```typescript:preview
   // Bad: Trying to modify the result in finally
   promise
     .then((result) => result * 2)
     .finally(() => 'new value') // This return value is ignored
     .then((result) => console.log(result)); // Still gets the doubled result

   // Good: Understand that finally can't modify the result
   promise
     .then((result) => result * 2)
     .finally(() => {
       // Perform cleanup only
       cleanup();
     })
     .then((result) => console.log(result));
   ```

2. **Error Handling in Finally**

   ```typescript:preview
   // Bad: Swallowing errors in finally
   promise.finally(() => {
     try {
       riskyCleanup();
     } catch (error) {
       // Error silently swallowed
     }
   });

   // Good: Proper error handling
   promise.finally(() => {
     try {
       riskyCleanup();
     } catch (error) {
       console.error('Cleanup failed:', error);
       throw error; // Re-throw if cleanup is critical
     }
   });
   ```

3. **Async Operations in Finally**

   ```typescript:preview
   // Bad: Unhandled async operations
   promise.finally(async () => {
     await cleanup(); // This async operation is not waited for
   });

   // Good: Handle async operations properly
   promise.finally(() => {
     return cleanup() // Return the promise
       .catch((error) => {
         console.error('Cleanup failed:', error);
         throw error;
       });
   });
   ```

4. **Resource Cleanup Order**

   ```typescript:preview
   // Bad: Unclear cleanup order
   let resource;
   promise
     .then((result) => {
       resource = acquire();
       return process(resource);
     })
     .finally(() => {
       if (resource) cleanup(resource);
     });

   // Good: Ensure proper cleanup order
   let resource;
   promise
     .then((result) => {
       resource = acquire();
       return process(resource);
     })
     .finally(() => {
       if (resource) {
         cleanup(resource);
         resource = null;
       }
     });
   ```

5. **Chain Breaking**

   ```typescript:preview
   // Bad: Breaking the promise chain
   promise
     .finally(() => {
       throw new Error('Cleanup failed');
     })
     .then(
       (result) => console.log(result), // Never called
       (error) => console.error(error) // Gets the cleanup error
     );

   // Good: Maintain the promise chain
   promise
     .finally(() => {
       try {
         cleanup();
       } catch (error) {
         console.error('Cleanup failed:', error);
         // Only throw if cleanup is critical
       }
     })
     .then(
       (result) => console.log(result), // Gets the original result
       (error) => console.error(error) // Gets the original error
     );
   ```

## Performance Considerations

1. **Memory Management**

   - Cleanup reference tracking
   - Resource disposal timing
   - Memory leak prevention
   - WeakRef usage for cleanup

2. **Execution Order**

   - Promise resolution timing
   - Cleanup operation scheduling
   - Error propagation efficiency
   - Chain optimization

3. **Resource Usage**

   - Cleanup operation costs
   - Error handling overhead
   - Chain maintenance impact
   - State tracking efficiency

4. **Error Handling Performance**
   - Error context preservation
   - Stack trace management
   - Error propagation costs
   - Logging performance

## Testing

```typescript:preview
describe('Promise.finally', () => {
  it('should execute cleanup on success', async () => {
    let cleaned = false;
    const result = await Promise.resolve('success').finally(() => {
      cleaned = true;
    });

    expect(result).toBe('success');
    expect(cleaned).toBe(true);
  });

  it('should execute cleanup on error', async () => {
    let cleaned = false;
    try {
      await Promise.reject(new Error('fail')).finally(() => {
        cleaned = true;
      });
    } catch (error) {
      expect(error.message).toBe('fail');
      expect(cleaned).toBe(true);
    }
  });

  it('should handle async cleanup', async () => {
    let cleaned = false;
    const result = await Promise.resolve('success').finally(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      cleaned = true;
    });

    expect(result).toBe('success');
    expect(cleaned).toBe(true);
  });
});
```
