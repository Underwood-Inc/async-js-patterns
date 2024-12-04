# Promise.race Examples

Learn how to use `Promise.race` for implementing timeouts and racing conditions.

## Basic Usage

```typescript
// Basic timeout pattern
async function fetchWithTimeout(url: string, timeoutMs: number) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
    ),
  ]);
}

// First response wins pattern
async function fetchFromMultipleEndpoints(urls: string[]) {
  return Promise.race(urls.map((url) => fetch(url)));
}
```

## Advanced Patterns

### Timeout with Cleanup

```typescript
async function fetchWithTimeoutAndCleanup(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(new Error('Request timed out'));
    }, timeoutMs);
  });

  return Promise.race([fetch(url, { signal }), timeoutPromise]);
}
```

### Race with Fallback

```typescript
async function fetchWithFallback<T>(
  primaryFetch: () => Promise<T>,
  fallbackFetch: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  let fallbackTimer: NodeJS.Timeout;

  const primary = primaryFetch().catch((error) => {
    console.warn('Primary fetch failed:', error);
    throw error;
  });

  const fallback = new Promise<T>((resolve, reject) => {
    fallbackTimer = setTimeout(async () => {
      try {
        const result = await fallbackFetch();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([primary, fallback]);
    clearTimeout(fallbackTimer);
    return result;
  } catch (error) {
    clearTimeout(fallbackTimer);
    throw error;
  }
}
```

### Race with Progress Updates

```typescript
interface ProgressUpdate {
  type: 'progress';
  percent: number;
}

interface Result<T> {
  type: 'result';
  value: T;
}

type ProgressOrResult<T> = ProgressUpdate | Result<T>;

async function* fetchWithProgress<T>(
  fetcher: () => Promise<T>,
  progressInterval: number = 100
): AsyncGenerator<ProgressOrResult<T>, void, unknown> {
  let progress = 0;
  const progressPromise = (async function* () {
    while (progress < 100) {
      progress += Math.random() * 20;
      progress = Math.min(progress, 99);
      yield { type: 'progress', percent: progress };
      await new Promise((resolve) => setTimeout(resolve, progressInterval));
    }
  })();

  const resultPromise = (async function* () {
    const result = await fetcher();
    yield { type: 'result', value: result };
  })();

  const combined = async function* () {
    yield* progressPromise;
    yield* resultPromise;
  };

  for await (const update of combined()) {
    if (update.type === 'result') {
      progress = 100;
    }
    yield update;
  }
}
```
