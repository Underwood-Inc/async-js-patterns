---
title: Testing Library Guide
description: Guide to using Testing Library for testing UI components
---

# Testing Library Guide

Testing Library is a family of packages that help you test UI components in a way that resembles how users interact with your app. It encourages better testing practices by focusing on testing behavior rather than implementation details.

## Key Features

- User-centric testing approach
- Framework agnostic (works with React, Vue, Angular, etc.)
- Built-in accessibility checks
- Powerful querying capabilities
- Async utilities
- Event simulation
- Semantic queries

## Getting Started

```bash
# For React
npm install --save-dev @testing-library/react
# For Vue
npm install --save-dev @testing-library/vue
# For Angular
npm install --save-dev @testing-library/angular
```

## Basic Test Structure

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('calls onClick handler when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);

  const button = screen.getByText('Click Me');
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Common Queries

```javascript
// By role (preferred)
const button = screen.getByRole('button', { name: 'Submit' });

// By label text
const input = screen.getByLabelText('Username');

// By placeholder
const search = screen.getByPlaceholderText('Search...');

// By text content
const element = screen.getByText('Hello, World');

// By test ID (last resort)
const container = screen.getByTestId('custom-element');
```

## User Events

```javascript
import userEvent from '@testing-library/user-event';

test('typing in an input field', async () => {
  const user = userEvent.setup();
  render(<Input />);

  const input = screen.getByRole('textbox');
  await user.type(input, 'Hello, World');

  expect(input).toHaveValue('Hello, World');
});
```

## Advanced Queries

### Priority Order

```javascript
// Best to worst query methods:
getByRole('button', { name: 'Submit' }); // 1. Accessible Roles
getByLabelText('Username'); // 2. Labels
getByPlaceholderText('Enter username'); // 3. Placeholder
getByText('Submit'); // 4. Text Content
getByDisplayValue('John'); // 5. Form Values
getByAltText('Profile picture'); // 6. Alt Text
getByTitle('Close'); // 7. Title Attribute
getByTestId('submit-button'); // 8. Test IDs
```

### Query Variants

```javascript
// Single Element
getBy...    // Throws error if not found or multiple found
queryBy...  // Returns null if not found
findBy...   // Returns promise, waits for element

// Multiple Elements
getAllBy...    // Throws error if none found
queryAllBy...  // Returns empty array if none found
findAllBy...   // Returns promise, waits for elements
```

## Testing Patterns

### Form Testing

```javascript
test('form submission', async () => {
  const handleSubmit = jest.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  await userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'password123');

  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'user@example.com',
    password: 'password123',
  });
});
```

### Async Operations

```javascript
test('loads and displays data', async () => {
  render(<UserProfile userId="1" />);

  // Wait for loading to finish
  expect(await screen.findByText('User Profile')).toBeInTheDocument();

  // Verify loaded content
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});
```

### Event Handling

```javascript
test('menu toggle', async () => {
  render(<Dropdown />);

  const button = screen.getByRole('button', { name: /open menu/i });
  const menu = screen.getByRole('menu', { hidden: true });

  // Initial state
  expect(menu).not.toBeVisible();

  // Click to open
  await userEvent.click(button);
  expect(menu).toBeVisible();

  // Click to close
  await userEvent.click(button);
  expect(menu).not.toBeVisible();
});
```

## Framework Integration

### React Testing

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('counter increments', async () => {
  render(<Counter initialCount={0} />);

  const button = screen.getByRole('button', { name: /increment/i });
  const count = screen.getByText('Count: 0');

  await userEvent.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### Vue Testing

```javascript
import { render, fireEvent } from '@testing-library/vue';

test('emits update event', async () => {
  const { emitted, getByRole } = render(CustomInput);

  const input = getByRole('textbox');
  await fireEvent.update(input, 'new value');

  expect(emitted()['update:modelValue'][0]).toEqual(['new value']);
});
```

### Angular Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/angular';

test('button click', async () => {
  await render(ButtonComponent, {
    componentProperties: {
      label: 'Click Me',
      onClick: () => {},
    },
  });

  const button = screen.getByRole('button');
  await fireEvent.click(button);

  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

## Custom Queries

### Creating Custom Queries

```javascript
const getByDataCy = (container, id) => getByAttribute('data-cy', id, container);

const queryByDataCy = (container, id) =>
  queryByAttribute('data-cy', id, container);

const getAllByDataCy = (container, id) =>
  getAllByAttribute('data-cy', id, container);

const queryAllByDataCy = (container, id) =>
  queryAllByAttribute('data-cy', id, container);

const findByDataCy = async (container, id) =>
  findByAttribute('data-cy', id, container);

const findAllByDataCy = async (container, id) =>
  findAllByAttribute('data-cy', id, container);

const customQueries = {
  getByDataCy,
  queryByDataCy,
  getAllByDataCy,
  queryAllByDataCy,
  findByDataCy,
  findAllByDataCy,
};

const customRender = (ui, options) =>
  render(ui, { queries: { ...queries, ...customQueries }, ...options });
```

## Best Practices

### 1. Query Selection

```javascript
// ❌ Avoid
getByTestId('submit-button');
getByClassName('submit-btn');
container.querySelector('.submit-btn');

// ✅ Prefer
getByRole('button', { name: /submit/i });
getByLabelText('Submit form');
```

### 2. Async Operations

```javascript
// ❌ Avoid
await wait(() => {
  expect(getByText('Loaded')).toBeInTheDocument();
});

// ✅ Prefer
expect(await findByText('Loaded')).toBeInTheDocument();
```

### 3. User Interactions

```javascript
// ❌ Avoid
fireEvent.change(input, { target: { value: 'test' } });

// ✅ Prefer
await userEvent.type(input, 'test');
```

### 4. Accessibility Testing

```javascript
test('form is accessible', async () => {
  const { container } = render(<Form />);

  // Check for ARIA attributes
  expect(screen.getByRole('form')).toHaveAttribute('aria-label');

  // Check for proper labels
  expect(screen.getByLabelText('Email')).toBeInTheDocument();

  // Check focus management
  const submitButton = screen.getByRole('button');
  submitButton.focus();
  expect(submitButton).toHaveFocus();
});
```

## Debugging

### Screen Debug

```javascript
test('debugging example', () => {
  render(<Component />);

  // Print current DOM state
  screen.debug();

  // Print specific element
  screen.debug(screen.getByRole('button'));

  // Print with depth limit
  screen.debug(undefined, 2);
});
```

### Logging Queries

```javascript
import { prettyDOM } from '@testing-library/dom';

test('logging example', () => {
  const { container } = render(<Component />);

  // Log specific element
  console.log(prettyDOM(container.querySelector('.element')));

  // Log with maxLength
  console.log(prettyDOM(container, 10000));
});
```

### Error Messages

```javascript
test('error handling', () => {
  render(<Component />);

  // Will show helpful error message with suggestions
  expect(() => screen.getByRole('button', { name: /submit/i })).toThrow();
});
```
