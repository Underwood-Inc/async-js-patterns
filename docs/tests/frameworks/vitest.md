---
title: Vitest Guide
description: Guide to using Vitest for testing
---

# Vitest Guide

Vitest is a next-generation testing framework designed for Vite-based applications. It provides a modern, fast, and feature-rich testing experience.

## Key Features

- Native ESM support
- TypeScript support out of the box
- Watch mode with smart file detection
- Jest-compatible API
- Snapshot testing
- Code coverage
- Multi-threading

## Getting Started

```bash
# Install Vitest
npm install -D vitest
```

## Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('calculator', () => {
  it('adds two numbers correctly', () => {
    expect(1 + 2).toBe(3);
  });
});
```

## Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
    },
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
});
```

## Advanced Features

### Mocking

```typescript
import { vi } from 'vitest';

const mock = vi.fn();
mock.mockImplementation(() => 42);

// Spy on object method
const spy = vi.spyOn(object, 'method');

// Mock module
vi.mock('./path/to/module', () => {
  return {
    default: vi.fn(),
    namedExport: vi.fn(),
  };
});
```

### Snapshot Testing

```typescript
it('matches snapshot', () => {
  const user = {
    name: 'John',
    age: 30,
  };
  expect(user).toMatchSnapshot();
});
```

### Test Coverage

```bash
# Run tests with coverage
vitest run --coverage

# Watch mode with coverage
vitest --coverage
```

### Custom Matchers

```typescript
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        `expected ${received} to be within range ${floor} - ${ceiling}`,
    };
  },
});

test('custom matcher', () => {
  expect(100).toBeWithinRange(90, 110);
});
```

## Integration with Other Tools

### TypeScript

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    typecheck: {
      tsconfig: './tsconfig.json',
    },
  },
});
```

### React Testing

```typescript
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import MyComponent from './MyComponent'

test('renders component', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### Vue Testing

```typescript
import { mount } from '@vue/test-utils';
import { test, expect } from 'vitest';
import MyComponent from './MyComponent.vue';

test('renders component', () => {
  const wrapper = mount(MyComponent);
  expect(wrapper.text()).toContain('Hello');
});
```

## Best Practices

### 1. Test Organization

```typescript
describe('UserService', () => {
  describe('authentication', () => {
    it('logs in user', async () => {
      // Test implementation
    });

    it('handles invalid credentials', async () => {
      // Test implementation
    });
  });

  describe('profile', () => {
    it('updates user profile', async () => {
      // Test implementation
    });
  });
});
```

### 2. Setup and Teardown

```typescript
describe('Database tests', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  beforeEach(async () => {
    await db.clear();
  });

  it('saves data', async () => {
    // Test implementation
  });
});
```

### 3. Async Testing

```typescript
test('async operations', async () => {
  await expect(Promise.resolve(42)).resolves.toBe(42);
  await expect(Promise.reject('error')).rejects.toBe('error');
});
```

### 4. Test Isolation

```typescript
test.each([
  { input: 1, expected: 2 },
  { input: 2, expected: 4 },
  { input: 3, expected: 6 },
])('doubles $input to be $expected', ({ input, expected }) => {
  expect(double(input)).toBe(expected);
});
```

## Performance Tips

### 1. Parallel Execution

```bash
vitest --threads false  # Disable threading
vitest --pool threads  # Use thread pool
vitest --pool forks   # Use process pool
```

### 2. Test Filtering

```bash
# Run specific tests
vitest basic.test.ts
vitest "test name"
vitest -t "test pattern"
```

### 3. Watch Mode Optimization

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    watchExclude: ['**/node_modules/**', '**/dist/**'],
    chaiConfig: {
      truncateThreshold: 200,
    },
  },
});
```

## Debugging

### Using Debug Mode

```bash
# Start in debug mode
vitest --debug

# With specific port
vitest --debug --port 9229
```

### Console Output

```typescript
test('debugging', () => {
  console.log('Debug info:', someValue);
  expect(someValue).toBeDefined();
});
```

### Browser Debugging

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome', // browser name
      headless: false, // headed mode
    },
  },
});
```
