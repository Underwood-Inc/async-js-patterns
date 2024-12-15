---
title: Form Component
description: Base form container component with built-in state management, validation, and submission handling
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Container
  - Validation
  - React
---

# Form Component

## Overview

The Form component serves as a container for form elements, providing built-in state management, validation, and submission handling. It offers a consistent way to manage form data, handle user input, and validate form submissions while maintaining accessibility and performance.

## Key Features

A comprehensive set of features for form management:

- Form state management
- Field validation
- Submission handling
- Error handling
- Reset functionality
- Auto-save support
- Loading states
- Custom layouts

## Usage Guidelines

This section demonstrates how to implement the Form component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the Form component:

```tsx
import * as React from 'react';
import { Form, Input, Button } from '@/components/form';

function BasicFormExample() {
  const handleSubmit = async (values: any) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form
      initialValues={{ username: '', password: '' }}
      onSubmit={handleSubmit}
    >
      <Input name="username" label="Username" required />
      <Input 
        name="password" 
        type="password" 
        label="Password" 
        required 
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedFormExample() {
  const [loading, setLoading] = React.useState(false);

  const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required()
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await registerUser(values);
      showSuccessMessage('Registration successful');
    } catch (error) {
      showErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      showErrorSummary
      loading={loading}
    >
      <Input 
        name="email" 
        type="email" 
        label="Email" 
        required 
      />
      <Input 
        name="password" 
        type="password" 
        label="Password" 
        required 
      />
      <Input 
        name="confirmPassword" 
        type="password" 
        label="Confirm Password" 
        required 
      />
      <Button type="submit" loading={loading}>
        Register
      </Button>
    </Form>
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialValues | `Record<string, any>` | `{}` | Initial form values |
| validationSchema | `any` | - | Validation schema |
| onSubmit | `(values: any) => void \| Promise<void>` | - | Submit handler |
| onReset | `() => void` | - | Reset handler |
| onChange | `(values: any) => void` | - | Change handler |
| onError | `(errors: any) => void` | - | Error handler |
| disabled | `boolean` | `false` | Disable all fields |
| loading | `boolean` | `false` | Loading state |
| autoSaveDelay | `number` | - | Auto-save delay in ms |
| validateOnChange | `boolean` | `false` | Validate on change |
| validateOnBlur | `boolean` | `false` | Validate on blur |
| showErrorSummary | `boolean` | `false` | Show error summary |
| layout | `'vertical' \| 'horizontal' \| 'inline'` | `'vertical'` | Form layout |

## Accessibility

Ensuring the Form component is accessible to all users.

### Keyboard Navigation

How users can interact with the form using a keyboard:

- Tab through fields
- Enter to submit
- Escape to reset
- Arrow keys for groups

### Screen Readers

How the component communicates with assistive technologies:

- Form role and label
- Required field indication
- Error announcements
- Loading state updates

### Best Practices

Guidelines for maintaining accessibility:

- Clear field labeling
- Proper field grouping
- Error messaging
- Focus management

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual form functionality:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Input } from './Form';
import '@testing-library/jest-dom';

describe('Form', () => {
  it('renders correctly', () => {
    render(
      <Form>
        <Input label="Test Input" name="test" />
      </Form>
    );
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('handles submission', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <Input label="Name" name="name" />
        <button type="submit">Submit</button>
      </Form>
    );
    
    await userEvent.type(screen.getByLabelText('Name'), 'Test User');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(handleSubmit).toHaveBeenCalledWith({ name: 'Test User' });
  });

  it('validates fields', async () => {
    const validationSchema = yup.object({
      email: yup.string().email().required()
    });

    render(
      <Form validationSchema={validationSchema}>
        <Input label="Email" name="email" type="email" />
        <button type="submit">Submit</button>
      </Form>
    );
    
    await userEvent.type(screen.getByLabelText('Email'), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });
});
```

### Integration Tests

Testing form behavior with multiple fields:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Input, Select } from './components';
import '@testing-library/jest-dom';

describe('Form Integration', () => {
  it('handles complex form submission', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <Input label="Name" name="name" required />
        <Select 
          label="Country" 
          name="country"
          options={[
            { value: 'us', label: 'USA' },
            { value: 'uk', label: 'UK' }
          ]}
          required
        />
      </Form>
    );
    
    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.click(screen.getByLabelText('Country'));
    await userEvent.click(screen.getByText('USA'));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      country: 'us'
    });
  });
});
```

### E2E Tests

Testing form behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Form', () => {
  test('handles registration flow', async ({ page }) => {
    await page.goto('/registration');
    
    // Fill out form
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Verify success
    await expect(page.getByText('Registration successful')).toBeVisible();
  });

  test('handles validation errors', async ({ page }) => {
    await page.goto('/registration');
    
    // Submit without filling
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Verify error messages
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('handles server errors', async ({ page }) => {
    await page.goto('/registration');
    
    // Fill with existing email
    await page.getByLabel('Email').fill('existing@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Verify error message
    await expect(page.getByText('Email already exists')).toBeVisible();
  });
});
```

## Design Guidelines

Best practices for implementing the Form component.

### Visual Design

Core visual principles:

- Consistent field spacing
- Clear section grouping
- Error state styling
- Loading indicators
- Submit button placement

### Layout Considerations

How to handle different layout scenarios:

- Responsive layouts
- Field alignment
- Label placement
- Error message positioning
- Button alignment

## Performance Considerations

Guidelines for optimal form performance:

- Efficient validation
- Debounced auto-save
- Optimized re-renders
- Memory cleanup
- Large form handling

## Related Components

Components commonly used with Form:

- [FormGroup](/react-component-patterns/form/form-group.md) - For field groups
- [FormField](/react-component-patterns/form/form-field.md) - For field wrappers
- [Input](/react-component-patterns/form/input.md) - For text input
- [Select](/react-component-patterns/form/select.md) - For dropdowns

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Form Validation Patterns](#)