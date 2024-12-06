---
title: Jest Guide
description: Guide to using Jest for JavaScript testing
---

# Jest Guide

Jest is a delightful JavaScript testing framework with a focus on simplicity and support for large web applications. It works with projects using Babel, TypeScript, Node, React, Angular, Vue, and more.

## Key Features

- Zero config for most JavaScript projects
- Snapshots for UI testing
- Built-in code coverage reporting
- Interactive mode for development
- Isolated test execution
- Powerful mocking capabilities
- Rich matcher API

## Getting Started

```bash:preview
# Install Jest
npm install --save-dev jest
```

## Basic Test Structure

```javascript:preview
describe('string utilities', () => {
  test('concatenates strings correctly', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
  });

  test('string length is calculated correctly', () => {
    expect('test string').toHaveLength(11);
  });
});
```

## Common Matchers

```javascript:preview
// Exact equality
expect(2 + 2).toBe(4);

// Object matching
expect({ name: 'test' }).toEqual({ name: 'test' });

// Truthiness
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect(true).toBeTruthy();

// Numbers
expect(4).toBeGreaterThan(3);
expect(4).toBeLessThan(5);

// Strings
expect('team').toMatch(/tea/);

// Arrays
expect(['apple', 'banana']).toContain('apple');
```

## Configuration

### Jest Configuration File

```javascript:preview
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
};
```

## Advanced Features

### Mock Functions

```javascript:preview
test('mock implementation', () => {
  const mock = jest
    .fn()
    .mockImplementation((x) => x * 2)
    .mockName('double');

  expect(mock(4)).toBe(8);
  expect(mock).toHaveBeenCalledWith(4);
});

// Mock return values
const mock = jest.fn();
mock.mockReturnValueOnce(true).mockReturnValueOnce(false);

// Mock modules
jest.mock('./math', () => ({
  add: jest.fn((a, b) => a + b),
  subtract: jest.fn((a, b) => a - b),
}));
```

### Async Testing

```javascript:preview
// Promises
test('resolves to user', () => {
  return expect(fetchUser(1)).resolves.toEqual({
    id: 1,
    name: 'John',
  });
});

// Async/Await
test('async/await', async () => {
  const data = await fetchData();
  expect(data).toBe('data');
});

// Callbacks
test('callbacks', (done) => {
  function callback(data) {
    try {
      expect(data).toBe('data');
      done();
    } catch (error) {
      done(error);
    }
  }
  fetchData(callback);
});
```

### Snapshot Testing

```javascript:preview
test('renders correctly', () => {
  const tree = renderer.create(<Component />).toJSON();
  expect(tree).toMatchSnapshot();
});

// Inline snapshots
test('inline snapshot', () => {
  expect({ name: 'John' }).toMatchInlineSnapshot(`
    Object {
      "name": "John",
    }
  `);
});
```

## Testing React Components

### Component Testing

```javascript:preview
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button click', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  userEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('form submission', async () => {
  render(<Form onSubmit={handleSubmit} />);

  await userEvent.type(screen.getByLabelText('Username'), 'john');
  await userEvent.type(screen.getByLabelText('Password'), 'password');

  fireEvent.submit(screen.getByRole('form'));
  expect(handleSubmit).toHaveBeenCalled();
});
```

### Custom Hooks Testing

```javascript:preview
import { renderHook, act } from '@testing-library/react-hooks';

test('useCounter', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Test Organization

### Test Suites

```javascript:preview
describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('add', () => {
    test('adds positive numbers', () => {
      expect(calculator.add(1, 2)).toBe(3);
    });

    test('adds negative numbers', () => {
      expect(calculator.add(-1, -2)).toBe(-3);
    });
  });

  describe('subtract', () => {
    test('subtracts numbers', () => {
      expect(calculator.subtract(5, 2)).toBe(3);
    });
  });
});
```

### Test Lifecycle

```javascript:preview
beforeAll(() => {
  // Setup before all tests
  return initializeDatabase();
});

afterAll(() => {
  // Cleanup after all tests
  return closeDatabase();
});

beforeEach(() => {
  // Setup before each test
  return populateDatabase();
});

afterEach(() => {
  // Cleanup after each test
  return clearDatabase();
});
```

## Performance Optimization

### Test Filtering

```bash:preview
# Run specific tests
jest path/to/test.js
jest -t "test name"

# Update snapshots
jest --updateSnapshot

# Run only changed files
jest --onlyChanged
```

### Parallel Execution

```bash:preview
# Run tests in parallel
jest --maxWorkers=4

# Run in band
jest --runInBand
```

## Debugging

### Interactive Mode

```bash:preview
# Watch mode
jest --watch

# Watch all files
jest --watchAll
```

### Debugging Tests

```javascript:preview
test('debug example', () => {
  debugger;
  const result = someFunction();
  expect(result).toBe(42);
});

// Using console
test('console debug', () => {
  console.log('Debug info:', someValue);
  expect(someValue).toBeDefined();
});
```

## Best Practices

### 1. Test Structure

- Arrange: Set up test data
- Act: Execute the code being tested
- Assert: Verify the results

### 2. Naming Conventions

```javascript:preview
describe('ProductService', () => {
  test('should create new product with valid data', () => {
    // Test implementation
  });

  test('should throw error when creating product with invalid data', () => {
    // Test implementation
  });
});
```

### 3. Mocking Best Practices

```javascript:preview
// Mock specific methods
jest.spyOn(object, 'method').mockImplementation(() => 'mocked');

// Restore mocks
afterEach(() => {
  jest.restoreAllMocks();
});

// Clear mock state
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 4. Coverage Goals

```bash:preview
# Generate coverage report
jest --coverage

# Set coverage thresholds
jest --coverage --coverageThreshold='{
  "global": {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  }
}'
```
