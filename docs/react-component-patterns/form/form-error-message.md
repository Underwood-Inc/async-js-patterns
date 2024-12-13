---
title: FormErrorMessage Component
description: Error message component for displaying form validation errors with support for various error states and animations
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Error
  - Validation
  - React
---

# FormErrorMessage Component

## Overview

The FormErrorMessage component provides clear and accessible error feedback for form fields. It supports various error states, animations, and icons while maintaining accessibility standards. This component is essential for communicating validation errors effectively to users.

## Key Features

A comprehensive set of features for form error messaging:

- Error message display
- Error state handling
- Icon support
- Animations
- Accessibility support
- Custom styling
- Error grouping
- Error persistence

## Usage Guidelines

This section demonstrates how to implement the FormErrorMessage component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the FormErrorMessage component:

```tsx
import * as React from 'react';
import { FormErrorMessage } from '@/components/form';

function BasicFormErrorMessageExample() {
  return (
    <FormErrorMessage>
      This field is required
    </FormErrorMessage>
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedFormErrorMessageExample() {
  const [errors, setErrors] = React.useState([]);

  return (
    <>
      <FormErrorMessage
        icon={<ErrorIcon />}
        animate
        id="password-error"
      >
        Password must contain at least:
        <ul>
          <li>8 characters</li>
          <li>One uppercase letter</li>
          <li>One number</li>
          <li>One special character</li>
        </ul>
      </FormErrorMessage>

      <FormErrorMessage
        errors={errors}
        group
        persistent
        role="alert"
      >
        {errors.map((error, index) => (
          <div key={index} className="error-item">
            {error.message}
          </div>
        ))}
      </FormErrorMessage>

      <FormErrorMessage
        error={isInvalid}
        icon={<WarningIcon />}
        variant="warning"
      >
        This value may cause performance issues
      </FormErrorMessage>
    </>
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | Required | Error message content |
| error | `boolean` | `true` | Show error state |
| icon | `ReactNode` | - | Error icon |
| animate | `boolean` | `false` | Enable animations |
| persistent | `boolean` | `false` | Always show message |
| id | `string` | - | Unique identifier |
| role | `string` | `'alert'` | ARIA role |
| variant | `'error' \| 'warning'` | `'error'` | Message variant |
| group | `boolean` | `false` | Group multiple errors |
| errors | `Error[]` | - | List of errors |

## Accessibility

Ensuring the FormErrorMessage component is accessible to all users.

### Keyboard Navigation

How users can interact with error messages:

- Tab to focusable elements
- Arrow keys for lists
- Escape to dismiss
- Space/Enter for actions

### Screen Readers

How the component communicates with assistive technologies:

- Error announcements
- Role descriptions
- Live regions
- Focus management

### Best Practices

Guidelines for maintaining accessibility:

- Clear messaging
- Proper ARIA roles
- Color contrast
- Focus indication

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual error message functionality:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormErrorMessage } from './FormErrorMessage';
import '@testing-library/jest-dom';

describe('FormErrorMessage', () => {
  it('renders correctly', () => {
    render(
      <FormErrorMessage>Error message</FormErrorMessage>
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('shows icon', () => {
    render(
      <FormErrorMessage icon={<span data-testid="error-icon" />}>
        Error message
      </FormErrorMessage>
    );
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('handles multiple errors', () => {
    const errors = [
      { message: 'Error 1' },
      { message: 'Error 2' }
    ];
    
    render(
      <FormErrorMessage errors={errors} group>
        {errors.map((error, index) => (
          <div key={index}>{error.message}</div>
        ))}
      </FormErrorMessage>
    );
    
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
  });
});
```

### Integration Tests

Testing error message behavior with form fields:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, FormErrorMessage, Input } from './components';
import '@testing-library/jest-dom';

describe('FormErrorMessage Integration', () => {
  it('associates with input field', async () => {
    render(
      <Form>
        <Input 
          id="email"
          name="email"
          aria-describedby="email-error"
          aria-invalid={true}
        />
        <FormErrorMessage id="email-error">
          Invalid email address
        </FormErrorMessage>
      </Form>
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows on validation error', async () => {
    render(
      <Form>
        <Input 
          id="password"
          name="password"
          type="password"
          aria-describedby="password-error"
        />
        <FormErrorMessage 
          id="password-error"
          error={!isValid}
        >
          Password is too weak
        </FormErrorMessage>
      </Form>
    );
    
    await userEvent.type(screen.getByRole('textbox'), 'weak');
    expect(screen.getByText('Password is too weak')).toBeVisible();
  });
});
```

### E2E Tests

Testing error message behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('FormErrorMessage', () => {
  test('handles validation errors', async ({ page }) => {
    await page.goto('/form-error-demo');
    
    // Test required field
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('This field is required')).toBeVisible();
    
    // Test invalid input
    await page.getByRole('textbox').fill('invalid');
    await expect(page.getByText('Invalid format')).toBeVisible();
    
    // Test error dismissal
    await page.getByRole('textbox').fill('valid@email.com');
    await expect(page.getByText('Invalid format')).not.toBeVisible();
  });
});
```

## Design Guidelines

Best practices for implementing the FormErrorMessage component.

### Visual Design

Core visual principles:

- Error colors
- Icon usage
- Text contrast
- Animation timing
- Message spacing

### Layout Considerations

How to handle different layout scenarios:

- Message placement
- Icon alignment
- Multi-line text
- Error groups
- Responsive behavior

## Performance Considerations

Guidelines for optimal error message performance:

- Animation performance
- State updates
- Event handler cleanup
- Memory management
- DOM updates minimization

## Related Components

Components commonly used with FormErrorMessage:

- Form Validation - For validation logic
- Icon - For error icons
- [FormField](/react-component-patterns/form/form-field.md) - For field wrapper
- [FormHelperText](/react-component-patterns/form/form-helper-text.md) - For help text

## Resources

Additional documentation and references:

- [Form Validation Guidelines](#)
- [Error Message Patterns](#)
- [Accessibility Best Practices](#)