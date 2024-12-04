# Promise.allSettled Examples

This page demonstrates practical examples of using `Promise.allSettled` to handle multiple promises and get all their results, regardless of success or failure.

## Basic Usage

```typescript:preview
// Basic example with multiple API calls
async function fetchAllUserData(userIds: string[]) {
  const promises = userIds.map((id) =>
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => ({ id, data }))
  );

  const results = await Promise.allSettled(promises);

  return {
    successful: results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map((r) => r.value),
    failed: results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => ({
        id: userIds[results.indexOf(r)],
        error: r.reason,
      })),
  };
}

// Usage
const results = await fetchAllUserData(['1', '2', '3']);
console.log('Successful fetches:', results.successful);
console.log('Failed fetches:', results.failed);
```

## Batch Processing with Status

```typescript:preview
// Processing items in batches with status tracking
class BatchProcessor {
  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 5
  ) {
    const results = {
      processed: [] as R[],
      failed: [] as { item: T; error: any }[],
      total: items.length,
      successCount: 0,
      failureCount: 0,
    };

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchPromises = batch.map((item) =>
        processor(item)
          .then((result) => ({ status: 'fulfilled' as const, item, result }))
          .catch((error) => ({ status: 'rejected' as const, item, error }))
      );

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { status, item, result: processedResult } = result.value;
          if (status === 'fulfilled') {
            results.processed.push(processedResult);
            results.successCount++;
          } else {
            results.failed.push({ item, error: processedResult });
            results.failureCount++;
          }
        }
      });

      // Progress update
      console.log(`Processed ${i + batchSize} of ${items.length} items`);
    }

    return results;
  }
}

// Usage
const processor = new BatchProcessor();
const items = ['item1', 'item2', 'item3', 'item4', 'item5'];

const results = await processor.processBatch(items, async (item) => {
  if (Math.random() > 0.5) {
    throw new Error(`Processing failed for ${item}`);
  }
  return `Processed ${item}`;
});
```

## Data Validation System

```typescript:preview
// Validating multiple data sources
class DataValidator {
  async validateDataSources(sources: DataSource[]) {
    const validations = sources.map(async (source) => {
      const results = {
        source: source.name,
        checks: [] as ValidationCheck[],
      };

      try {
        // Run multiple validation checks
        const checks = await Promise.allSettled([
          this.validateSchema(source),
          this.validateConnectivity(source),
          this.validatePermissions(source),
          this.validateDataQuality(source),
        ]);

        results.checks = checks.map((check, index) => ({
          name: this.getCheckName(index),
          status: check.status,
          result: check.status === 'fulfilled' ? check.value : check.reason,
        }));

        return results;
      } catch (error) {
        console.error(`Validation failed for ${source.name}:`, error);
        throw error;
      }
    });

    return Promise.allSettled(validations);
  }

  private getCheckName(index: number): string {
    const checks = [
      'Schema Validation',
      'Connectivity Check',
      'Permissions Check',
      'Data Quality Check',
    ];
    return checks[index];
  }
}
```

## Real-World Example: System Health Check

```typescript:preview
class SystemHealthChecker {
  private services: ServiceCheck[];
  private notifier: HealthNotifier;

  constructor(services: ServiceCheck[], notifier: HealthNotifier) {
    this.services = services;
    this.notifier = notifier;
  }

  async performHealthCheck(): Promise<HealthReport> {
    const startTime = Date.now();
    const checks = this.services.map(async (service) => {
      const serviceCheck = {
        name: service.name,
        type: service.type,
        checks: [] as CheckResult[],
      };

      try {
        // Perform multiple health checks for each service
        const checkResults = await Promise.allSettled([
          this.checkAvailability(service),
          this.checkLatency(service),
          this.checkErrorRate(service),
          this.checkDependencies(service),
        ]);

        serviceCheck.checks = checkResults.map((result, index) => ({
          name: this.getCheckName(index),
          status: result.status,
          details:
            result.status === 'fulfilled'
              ? result.value
              : { error: result.reason },
        }));

        return serviceCheck;
      } catch (error) {
        console.error(`Health check failed for ${service.name}:`, error);
        return serviceCheck;
      }
    });

    const results = await Promise.allSettled(checks);
    const endTime = Date.now();

    const report = this.generateReport(results, endTime - startTime);
    await this.notifyIfNeeded(report);

    return report;
  }

  private generateReport(
    results: PromiseSettledResult<ServiceHealthCheck>[],
    duration: number
  ): HealthReport {
    return {
      timestamp: new Date().toISOString(),
      duration,
      services: results.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return {
          name: 'Unknown Service',
          type: 'unknown',
          checks: [
            {
              name: 'System Check',
              status: 'rejected',
              details: { error: result.reason },
            },
          ],
        };
      }),
      summary: this.generateSummary(results),
    };
  }

  private async notifyIfNeeded(report: HealthReport) {
    const failedServices = report.services.filter((service) =>
      service.checks.some(
        (check) =>
          check.status === 'rejected' ||
          (check.status === 'fulfilled' && !check.details.healthy)
      )
    );

    if (failedServices.length > 0) {
      await this.notifier.alert({
        level: 'error',
        message: 'System health check failed',
        services: failedServices,
      });
    }
  }

  private getCheckName(index: number): string {
    const checks = ['Availability', 'Latency', 'Error Rate', 'Dependencies'];
    return checks[index];
  }
}

// Usage
const healthChecker = new SystemHealthChecker(
  [
    {
      name: 'Authentication Service',
      type: 'critical',
      endpoint: 'https://auth.example.com/health',
    },
    {
      name: 'Payment Service',
      type: 'critical',
      endpoint: 'https://payments.example.com/health',
    },
    {
      name: 'Notification Service',
      type: 'non-critical',
      endpoint: 'https://notifications.example.com/health',
    },
  ],
  new SlackNotifier()
);

const report = await healthChecker.performHealthCheck();
console.log('Health Check Report:', JSON.stringify(report, null, 2));
```

## Best Practices

1. Type handling:

   ```typescript:preview
   function isPromiseFulfilled<T>(
     result: PromiseSettledResult<T>
   ): result is PromiseFulfilledResult<T> {
     return result.status === 'fulfilled';
   }

   function isPromiseRejected(
     result: PromiseSettledResult<unknown>
   ): result is PromiseRejectedResult {
     return result.status === 'rejected';
   }

   // Usage
   const results = await Promise.allSettled(promises);
   const successful = results.filter(isPromiseFulfilled);
   const failed = results.filter(isPromiseRejected);
   ```

2. Error aggregation:

   ```typescript:preview
   function aggregateErrors(results: PromiseSettledResult<unknown>[]) {
     return results
       .filter(isPromiseRejected)
       .map((result) => result.reason)
       .reduce(
         (errors, error) => {
           if (error instanceof Error) {
             errors[error.name] = errors[error.name] || [];
             errors[error.name].push(error.message);
           }
           return errors;
         },
         {} as Record<string, string[]>
       );
   }
   ```

3. Progress tracking:

   ```typescript:preview
   async function trackProgress<T>(
     promises: Promise<T>[],
     onProgress: (progress: ProgressInfo) => void
   ): Promise<PromiseSettledResult<T>[]> {
     let completed = 0;
     const total = promises.length;

     const wrappedPromises = promises.map((promise) =>
       promise
         .then((value) => {
           completed++;
           onProgress({
             completed,
             total,
             status: 'fulfilled',
           });
           return value;
         })
         .catch((error) => {
           completed++;
           onProgress({
             completed,
             total,
             status: 'rejected',
           });
           throw error;
         })
     );

     return Promise.allSettled(wrappedPromises);
   }
   ```

4. Cleanup handling:

   ```typescript:preview
   async function withCleanup<T>(
     operations: Array<() => Promise<T>>,
     cleanup: (results: PromiseSettledResult<T>[]) => Promise<void>
   ): Promise<PromiseSettledResult<T>[]> {
     const results = await Promise.allSettled(operations.map((op) => op()));

     try {
       await cleanup(results);
     } catch (error) {
       console.error('Cleanup failed:', error);
     }

     return results;
   }
   ```
