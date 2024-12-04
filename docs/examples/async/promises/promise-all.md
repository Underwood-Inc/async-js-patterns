# Promise.all Examples

Learn how to use `Promise.all` for parallel execution patterns.

## Basic Usage

```typescript
// Fetch multiple resources in parallel
async function fetchMultipleUrls(urls: string[]) {
  try {
    const responses = await Promise.all(urls.map((url) => fetch(url)));
    return await Promise.all(responses.map((response) => response.json()));
  } catch (error) {
    console.error('One or more requests failed:', error);
    throw error;
  }
}

// Process multiple items in parallel
async function processItems<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  return Promise.all(items.map(processor));
}
```

## Advanced Patterns

### Parallel with Concurrency Limit

```typescript
async function parallelWithLimit<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  const inProgress = new Set<Promise<void>>();

  for (let i = 0; i < items.length; i++) {
    const processPromise = (async () => {
      const result = await processor(items[i]);
      results[i] = result;
    })();

    inProgress.add(processPromise);
    processPromise.then(() => inProgress.delete(processPromise));

    if (inProgress.size >= concurrency) {
      await Promise.race(inProgress);
    }
  }

  await Promise.all(inProgress);
  return results;
}
```

### Batch Processing

```typescript
async function processBatches<T, R>(
  items: T[],
  processor: (items: T[]) => Promise<R[]>,
  batchSize: number
): Promise<R[]> {
  const batches: T[][] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  const batchResults = await Promise.all(
    batches.map((batch) => processor(batch))
  );

  return batchResults.flat();
}
```

### Error Handling with Partial Results

```typescript
async function processWithPartialResults<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>
): Promise<{ results: R[]; errors: Error[] }> {
  const promises = items.map(async (item, index) => {
    try {
      const result = await processor(item);
      return { success: true, value: result, index };
    } catch (error) {
      return { success: false, error, index };
    }
  });

  const outcomes = await Promise.all(promises);
  const results: R[] = new Array(items.length);
  const errors: Error[] = [];

  outcomes.forEach((outcome) => {
    if (outcome.success) {
      results[outcome.index] = outcome.value;
    } else {
      errors.push(outcome.error);
    }
  });

  return { results, errors };
}
```
