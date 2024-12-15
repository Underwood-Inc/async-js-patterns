---
title: FormField Component
description: Container component for form inputs that handles layout, validation, and accessibility
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Field
  - Layout
  - React
---

# FormField Component

## Overview

The FormField component provides a standardized container for form inputs, managing layout, validation states, and accessibility. It coordinates the interaction between labels, inputs, helper text, and error messages while maintaining consistent styling and behavior.

## Key Features

A comprehensive set of features for form field management:

- Input wrapping
- Label integration
- Validation states
- Error handling
- Helper text
- Required states
- Disabled states
- Custom layouts
- Accessibility support

## Usage Guidelines

This section demonstrates how to implement the FormField component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the FormField component:

```tsx
import * as React from 'react';
import { FormField, Input } from '@/components/form';

// Example component showing basic form field usage
export const BasicFormFieldExample: React.FC = () => {
  return (
    <FormField label="Username">
      <Input name="username" required />
    </FormField>
  );
};
```

### Advanced Usage

Examples of more complex implementations:

```tsx
import * as React from 'react';
import { FormField, Input, FileUpload, CheckboxGroup } from '@/components/form';
import { validateEmail } from '@/utils/validation';

// Example component showing advanced form field usage
export const AdvancedFormFieldExample: React.FC = () => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState('');
  const [fileError, setFileError] = React.useState('');
  const [fileUploaded, setFileUploaded] = React.useState(false);

  return (
    <>
      <FormField
        label="Email Address"
        required
        error={error}
        helperText="We'll never share your email"
        layout="horizontal"
        labelWidth="30%"
      >
        <Input
          name="email"
          type="email"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(validateEmail(e.target.value));
          }}
        />
      </FormField>

      <FormField
        label="Profile Picture"
        optional
        tooltip="Maximum size: 5MB"
        error={fileError}
        success={fileUploaded}
      >
        <FileUpload
          name="avatar"
          accept="image/*"
          maxSize={5 * 1024 * 1024}
          onError={setFileError}
          onSuccess={() => setFileUploaded(true)}
        />
      </FormField>

      <FormField
        label="Preferences"
        layout="stacked"
        spacing="1rem"
      >
        <CheckboxGroup
          name="preferences"
          options={[
            { label: 'Email notifications', value: 'email' },
            { label: 'SMS notifications', value: 'sms' },
            { label: 'Push notifications', value: 'push' }
          ]}
        />
      </FormField>
    </>
  );
};
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | Required | Form input element |
| label | `ReactNode` | - | Field label |
| error | `string \| boolean` | - | Error state/message |
| helperText | `string` | - | Helper text |
| required | `boolean` | `false` | Required state |
| optional | `boolean` | `false` | Optional state |
| disabled | `boolean` | `false` | Disabled state |
| layout | `'vertical' \| 'horizontal' \| 'stacked'` | `'vertical'` | Field layout |
| labelWidth | `string \| number` | - | Label width |
| spacing | `string \| number` | - | Element spacing |
| tooltip | `ReactNode` | - | Label tooltip |
| success | `boolean` | `false` | Success state |

## Accessibility

Ensuring the FormField component is accessible to all users.

### Keyboard Navigation

How users can interact with form fields:

- Tab through fields
- Space/Enter for actions
- Arrow keys for options
- Escape to reset

### Screen Readers

How the component communicates with assistive technologies:

- Label associations
- Required states
- Error messages
- Helper text
- Field descriptions

### Best Practices

Guidelines for maintaining accessibility:

- Clear labeling
- Proper associations
- Error handling
- Focus management
- State announcements

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual field functionality:

```tsx
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';

/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormField, Input } from '@/components/form';

describe('FormField', () => {
  it('renders correctly', async () => {
    render(
      <FormField label="Test Field">
        <Input name="test" />
      </FormField>
    );

    const user = userEvent.setup();
    const input = screen.getByLabelText('Test Field');
    await user.type(input, 'test value');

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test value');
  });

  it('shows required state', async () => {
    render(
      <FormField label="Test Field" required>
        <Input name="test" />
      </FormField>
    );

    const user = userEvent.setup();
    const input = screen.getByLabelText('Test Field');
    await user.tab();

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('shows error message', async () => {
    render(
      <FormField 
        label="Test Field"
        error="Invalid input"
      >
        <Input name="test" />
      </FormField>
    );

    const user = userEvent.setup();
    const input = screen.getByLabelText('Test Field');
    await user.click(input);
    await user.tab();

    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  it('shows helper text', async () => {
    render(
      <FormField 
        label="Test Field"
        helperText="Help message"
      >
        <Input name="test" />
      </FormField>
    );

    const user = userEvent.setup();
    const input = screen.getByLabelText('Test Field');
    await user.hover(input);

    expect(screen.getByText('Help message')).toBeInTheDocument();
  });
});
```

### Integration Tests

Testing field behavior with form validation:

```tsx
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';

/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Form, FormField, Input } from '@/components/form';

describe('FormField Integration', () => {
  it('handles validation', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <FormField 
          label="Email"
          required
          error="Invalid email format"
        >
          <Input
            name="email"
            type="email"
          />
        </FormField>
        <button type="submit">Submit</button>
      </Form>
    );
    
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email'), 'invalid');
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Invalid email format')).toBeVisible();
  });

  it('handles field interactions', async () => {
    const helperTexts = {
      default: 'Enter your username',
      focus: 'Must be unique'
    };

    render(
      <Form>
        <FormField 
          label="Username"
          helperText={helperTexts.default}
        >
          <Input
            name="username"
            onFocus={() => screen.getByText(helperTexts.focus)}
            onBlur={() => screen.getByText(helperTexts.default)}
          />
        </FormField>
      </Form>
    );
    
    const user = userEvent.setup();
    const input = screen.getByLabelText('Username');
    await user.click(input);
    expect(screen.getByText(helperTexts.focus)).toBeVisible();
    
    await user.tab();
    expect(screen.getByText(helperTexts.default)).toBeVisible();
  });
});
```

### E2E Tests

Testing field behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('FormField', () => {
  test('handles field states', async ({ page }) => {
    await page.goto('/form-field-demo');
    
    // Test required validation
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('This field is required')).toBeVisible();
    
    // Test input interaction
    const input = page.getByLabel('Username');
    await input.click();
    await expect(page.getByText('Enter a unique username')).toBeVisible();
    
    // Test error state
    await input.fill('a');
    await expect(page.getByText('Username too short')).toBeVisible();
    
    // Test success state
    await input.fill('validuser');
    await expect(page.getByText('Username available')).toBeVisible();
  });
});
```

## Design Guidelines

Best practices for implementing the FormField component.

### Visual Design

Core visual principles:

- Label alignment
- Input spacing
- Error styling
- Helper text placement
- Required indicators

### Layout Considerations

How to handle different layout scenarios:

- Vertical layout
- Horizontal layout
- Stacked layout
- Responsive behavior
- Field groups

## Performance Considerations

Guidelines for optimal field performance:

- State management
- Event handling
- DOM updates
- Memory cleanup
- Style optimizations

## Related Components

Components commonly used with FormField:

- [FormLabel](/react-component-patterns/form/form-label.md) - For field labels
- [FormHelperText](/react-component-patterns/form/form-helper-text.md) - For helper text
- [FormErrorMessage](/react-component-patterns/form/form-error-message.md) - For error messages
- [FormGroup](/react-component-patterns/form/form-group.md) - For field groups

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Field Pattern Guidelines](#)
- [Accessibility Best Practices](#)