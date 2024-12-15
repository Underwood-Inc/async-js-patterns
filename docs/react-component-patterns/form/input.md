---
title: Input Component
description: Single-line text input component for forms with support for various input types, validation states, and additional features
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Input
  - Text
  - React
---

# Input Component

## Overview

The Input component provides a versatile single-line text input field for forms. It supports various input types, validation states, and additional features like prefix/suffix elements and clear button functionality. This component is fundamental for collecting user input in a consistent and accessible way.

## Key Features

A comprehensive set of features for text input handling:

- Multiple input types (text, password, email, number, etc.)
- Validation states with error messages
- Prefix/suffix elements for additional context
- Clear button for quick input clearing
- Password visibility toggle
- Character limit with counter
- Custom styling support

## Usage Guidelines

This section demonstrates how to implement the Input component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the Input component:

```tsx
import * as React from 'react';
import { Input } from '@/components/form';

function BasicInputExample() {
  return (
    <Input
      label="Username"
      placeholder="Enter username"
      onChange={(e) => console.log(e.target.value)}
    />
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedInputExample() {
  const [value, setValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsValid(validateInput(newValue));
  };

  return (
    <Input
      type="email"
      label="Email Address"
      value={value}
      onChange={handleChange}
      error={!isValid}
      errorMessage="Please enter a valid email address"
      prefix={<EmailIcon />}
      clearable
      required
    />
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | Input type |
| value | `string \| number` | - | Input value |
| onChange | `(event: React.ChangeEvent<HTMLInputElement>) => void` | - | Change handler |
| prefix | `React.ReactNode` | - | Element to show before input |
| suffix | `React.ReactNode` | - | Element to show after input |
| clearable | `boolean` | `false` | Whether to show clear button |
| error | `boolean` | `false` | Error state |
| errorMessage | `string` | - | Error message text |
| label | `string` | - | Input label |
| required | `boolean` | `false` | Whether field is required |

## Accessibility

Ensuring the Input component is accessible to all users.

### Keyboard Navigation

How users can interact with the input using a keyboard:

- Tab to focus the input
- Enter/Space to trigger clear button
- Escape to clear input value
- Arrow keys for number inputs

### Screen Readers

How the component communicates with assistive technologies:

- Proper input labeling
- Error state announcements
- Required field indication
- Clear button description

### Best Practices

Guidelines for maintaining accessibility:

- Always provide visible labels
- Use proper error messaging
- Maintain sufficient color contrast
- Support keyboard interactions

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual input functionality:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import '@testing-library/jest-dom';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input label="Test Input" />);
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const handleChange = jest.fn();
    render(<Input label="Test" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Test');
    await userEvent.type(input, 'Hello');
    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it('shows error state', () => {
    render(
      <Input 
        label="Test" 
        error 
        errorMessage="Invalid input" 
      />
    );
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });
});
```

### Integration Tests

Testing input behavior with form validation:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Input } from './components';
import '@testing-library/jest-dom';

describe('Input Integration', () => {
  it('works with form validation', async () => {
    render(
      <Form onSubmit={jest.fn()}>
        <Input 
          label="Email"
          type="email"
          required
        />
      </Form>
    );
    
    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'invalid-email');
    await userEvent.tab();
    
    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });
});
```

### E2E Tests

Testing input behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Input', () => {
  test('handles user input and validation', async ({ page }) => {
    await page.goto('/input-demo');
    
    // Test basic input
    const input = page.getByLabel('Email');
    await input.fill('test@example.com');
    await expect(input).toHaveValue('test@example.com');
    
    // Test validation
    await input.fill('invalid-email');
    await input.blur();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
    
    // Test clear button
    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(input).toHaveValue('');
  });

  test('supports keyboard navigation', async ({ page }) => {
    await page.goto('/input-demo');
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Email')).toBeFocused();
    
    await page.keyboard.type('test');
    await page.keyboard.press('Escape');
    await expect(page.getByLabel('Email')).toHaveValue('');
  });
});
```

## Design Guidelines

Best practices for implementing the Input component.

### Visual Design

Core visual principles:

- Consistent height and padding
- Clear focus states
- Visible placeholder text
- Error state styling
- Prefix/suffix alignment

### Layout Considerations

How to handle different layout scenarios:

- Full-width vs. fixed-width inputs
- Input groups and alignment
- Label placement options
- Error message positioning

## Performance Considerations

Guidelines for optimal input performance:

- Debounce change handlers for search inputs
- Optimize validation timing
- Handle large datasets efficiently
- Clean up event listeners

## Related Components

Components commonly used with Input:

- [FormField](/react-component-patterns/form/form-field.md) - Wrapper for form inputs
- [FormLabel](/react-component-patterns/form/form-label.md) - Label component
- [FormHelperText](/react-component-patterns/form/form-helper-text.md) - Helper text
- [Textarea](/react-component-patterns/form/textarea.md) - Multi-line input

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Input Validation Patterns](#)
