---
title: FormGroup Component
description: Container component for grouping related form fields with shared layout and validation
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Layout
  - Group
  - React
---

# FormGroup Component

## Overview

The FormGroup component provides a container for organizing related form fields. It supports various layouts, conditional rendering, and group-level validation, helping to create structured and accessible forms. This component is essential for maintaining logical grouping and consistent spacing in complex forms.

## Key Features

A comprehensive set of features for form field grouping:

- Field grouping with labels
- Layout options (vertical/horizontal)
- Group-level validation
- Conditional rendering
- Nested groups support
- Custom styling options
- Error handling
- Accessibility support

## Usage Guidelines

This section demonstrates how to implement the FormGroup component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the FormGroup component:

```tsx
import * as React from 'react';
import { FormGroup, Input } from '@/components/form';

function BasicFormGroupExample() {
  return (
    <FormGroup label="Personal Information">
      <Input name="firstName" label="First Name" required />
      <Input name="lastName" label="Last Name" required />
      <Input name="email" type="email" label="Email" required />
    </FormGroup>
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedFormGroupExample() {
  const [paymentMethod, setPaymentMethod] = React.useState('');

  return (
    <>
      <FormGroup
        label="Contact Information"
        layout="horizontal"
        labelCol="30%"
        fieldCol="70%"
        bordered
      >
        <Input name="street" label="Street Address" />
        <Input name="city" label="City" />
        <Input name="zipCode" label="ZIP Code" />
      </FormGroup>

      <FormGroup
        label="Payment Details"
        when={paymentMethod === 'card'}
        error={!paymentMethod}
        errorMessage="Please select a payment method"
      >
        <FormGroup label="Card Information">
          <Input 
            name="cardNumber" 
            label="Card Number" 
            required 
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input 
              name="expiryDate" 
              label="Expiry Date" 
              required 
            />
            <Input 
              name="cvv" 
              label="CVV" 
              required 
            />
          </div>
        </FormGroup>
      </FormGroup>
    </>
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `ReactNode` | - | Group label |
| helperText | `string` | - | Helper text |
| error | `boolean` | `false` | Error state |
| errorMessage | `string` | - | Error message |
| disabled | `boolean` | `false` | Disable all fields |
| required | `boolean` | `false` | Mark group as required |
| layout | `'vertical' \| 'horizontal' \| 'inline'` | `'vertical'` | Group layout |
| labelCol | `number \| string` | - | Label column width |
| fieldCol | `number \| string` | - | Field column width |
| bordered | `boolean` | `false` | Show border |
| filled | `boolean` | `false` | Show background |
| spacing | `number \| string` | - | Group spacing |
| when | `boolean \| ((values: any) => boolean)` | - | Render condition |

## Accessibility

Ensuring the FormGroup component is accessible to all users.

### Keyboard Navigation

How users can interact with grouped fields:

- Tab through fields
- Arrow keys for radio groups
- Space for checkboxes
- Enter to submit

### Screen Readers

How the component communicates with assistive technologies:

- Group role and label
- Required group indication
- Error announcements
- Field relationships

### Best Practices

Guidelines for maintaining accessibility:

- Clear group labeling
- Logical field order
- Error messaging
- Focus management

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual group functionality:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormGroup, Input } from './FormGroup';
import '@testing-library/jest-dom';

describe('FormGroup', () => {
  it('renders correctly', () => {
    render(
      <FormGroup label="Test Group">
        <Input label="Test Input" name="test" />
      </FormGroup>
    );
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('handles conditional rendering', () => {
    const { rerender } = render(
      <FormGroup 
        label="Test Group" 
        when={false}
      >
        <Input label="Test Input" name="test" />
      </FormGroup>
    );
    
    expect(screen.queryByText('Test Group')).not.toBeInTheDocument();
    
    rerender(
      <FormGroup 
        label="Test Group" 
        when={true}
      >
        <Input label="Test Input" name="test" />
      </FormGroup>
    );
    
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <FormGroup 
        label="Test Group"
        error
        errorMessage="Group error"
      >
        <Input label="Test Input" name="test" />
      </FormGroup>
    );
    
    expect(screen.getByText('Group error')).toBeInTheDocument();
  });
});
```

### Integration Tests

Testing group behavior with form validation:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, FormGroup, Input } from './components';
import '@testing-library/jest-dom';

describe('FormGroup Integration', () => {
  it('works with form validation', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <FormGroup 
          label="Address"
          required
        >
          <Input name="street" label="Street" required />
          <Input name="city" label="City" required />
        </FormGroup>
      </Form>
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('This group is required')).toBeInTheDocument();
  });
});
```

### E2E Tests

Testing group behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('FormGroup', () => {
  test('handles group interactions', async ({ page }) => {
    await page.goto('/form-group-demo');
    
    // Test group visibility
    const group = page.getByRole('group', { name: 'Contact Details' });
    await expect(group).toBeVisible();
    
    // Test nested fields
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Phone').fill('1234567890');
    
    // Test group validation
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('All fields are required')).toBeVisible();
  });

  test('handles conditional rendering', async ({ page }) => {
    await page.goto('/form-group-demo');
    
    // Test group visibility toggle
    await page.getByLabel('Show additional fields').click();
    await expect(page.getByText('Additional Information')).toBeVisible();
    
    await page.getByLabel('Show additional fields').click();
    await expect(page.getByText('Additional Information')).not.toBeVisible();
  });
});
```

## Design Guidelines

Best practices for implementing the FormGroup component.

### Visual Design

Core visual principles:

- Consistent spacing
- Clear group boundaries
- Error state styling
- Label alignment
- Nested indentation

### Layout Considerations

How to handle different layout scenarios:

- Responsive layouts
- Field alignment
- Label placement
- Error message positioning
- Nested group spacing

## Performance Considerations

Guidelines for optimal group performance:

- Efficient conditional rendering
- Group updates optimization
- Event handler cleanup
- Memory management
- DOM updates minimization

## Related Components

Components commonly used with FormGroup:

- [Form](/react-component-patterns/form/form.md) - For form container
- [FormField](/react-component-patterns/form/form-field.md) - For individual fields
- [FormLabel](/react-component-patterns/form/form-label.md) - For group labels
- [FormHelperText](/react-component-patterns/form/form-helper-text.md) - For helper text

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Form Layout Patterns](#)