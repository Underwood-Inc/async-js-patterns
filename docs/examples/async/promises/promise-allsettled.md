---
title: Promise.allSettled Pattern Examples
description: Explore Promise.allSettled patterns for handling multiple async operations with comprehensive result tracking. Learn TypeScript implementations and error handling strategies.
date: 2024-12-01
author: Underwood Inc
tags:
  - Promise.allSettled
  - Async Patterns
  - TypeScript
  - Error Handling
  - Result Tracking
  - Batch Processing
category: examples
image: /web-patterns/images/promise-allsettled-banner.png
---

# Promise.allSettled Examples

Learn how to use `Promise.allSettled` for handling multiple promises regardless of their outcome.

## Basic Usage

```typescript:preview
// Basic usage with mixed results
async function fetchMultipleUrlsSafely(urls: string[]) {
  const results = await Promise.allSettled(urls.map((url) => fetch(url)));

  return results.map((result, index) => ({
    url: urls[index],
    status: result.status,
    value: result.status === 'fulfilled' ? result.value : undefined,
    error: result.status === 'rejected' ? result.reason : undefined,
  }));
}

// Processing with status tracking
async function processItemsWithStatus<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>
) {
  const results = await Promise.allSettled(items.map(processor));

  return {
    successful: results
      .filter((r): r is PromiseFulfilledResult<R> => r.status === 'fulfilled')
      .map((r) => r.value),
    failed: results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => r.reason),
  };
}
```

## Advanced Patterns

### Batch Processing with Results Analysis

```typescript:preview
interface ProcessingResult<T, R> {
  successful: { input: T; output: R }[];
  failed: { input: T; error: Error }[];
  summary: {
    total: number;
    successCount: number;
    failureCount: number;
    successRate: number;
  };
}

async function processBatchWithAnalysis<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>
): Promise<ProcessingResult<T, R>> {
  const results = await Promise.allSettled(
    items.map((item) => processor(item))
  );

  const successful: { input: T; output: R }[] = [];
  const failed: { input: T; error: Error }[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successful.push({
        input: items[index],
        output: result.value,
      });
    } else {
      failed.push({
        input: items[index],
        error: result.reason,
      });
    }
  });

  const total = items.length;
  const successCount = successful.length;
  const failureCount = failed.length;

  return {
    successful,
    failed,
    summary: {
      total,
      successCount,
      failureCount,
      successRate: successCount / total,
    },
  };
}
```

### Retry Failed Operations

```typescript:preview
async function retryFailedOperations<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  maxRetries: number = 3
): Promise<R[]> {
  let currentItems = [...items];
  const results: R[] = new Array(items.length);
  const itemIndices = new Map(items.map((item, index) => [item, index]));

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (currentItems.length === 0) break;

    const attemptResults = await Promise.allSettled(
      currentItems.map((item) => processor(item))
    );

    // Process results and collect failed items for retry
    const failedItems: T[] = [];

    attemptResults.forEach((result, index) => {
      const originalIndex = itemIndices.get(currentItems[index])!;

      if (result.status === 'fulfilled') {
        results[originalIndex] = result.value;
      } else {
        if (attempt < maxRetries - 1) {
          failedItems.push(currentItems[index]);
        } else {
          throw new Error(
            `Failed to process item after ${maxRetries} attempts`
          );
        }
      }
    });

    currentItems = failedItems;

    if (failedItems.length > 0 && attempt < maxRetries - 1) {
      // Exponential backoff before retry
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  return results;
}
```

### Progress Tracking

```typescript:preview
interface ProgressUpdate<T> {
  completed: number;
  total: number;
  successful: T[];
  failed: Error[];
  percentage: number;
}

async function processWithProgress<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  onProgress: (progress: ProgressUpdate<R>) => void
): Promise<{ successful: R[]; failed: Error[] }> {
  const results = await Promise.allSettled(
    items.map(async (item, index) => {
      const result = await processor(item);

      const successful = results
        .slice(0, index + 1)
        .filter((r): r is PromiseFulfilledResult<R> => r.status === 'fulfilled')
        .map((r) => r.value);

      const failed = results
        .slice(0, index + 1)
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r) => r.reason);

      onProgress({
        completed: index + 1,
        total: items.length,
        successful,
        failed,
        percentage: ((index + 1) / items.length) * 100,
      });

      return result;
    })
  );

  return {
    successful: results
      .filter((r): r is PromiseFulfilledResult<R> => r.status === 'fulfilled')
      .map((r) => r.value),
    failed: results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => r.reason),
  };
}
```
