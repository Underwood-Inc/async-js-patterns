---
title: FormHelperText Component
description: Supplementary text component for providing additional information and guidance in forms
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Helper Text
  - Accessibility
  - React
---

# FormHelperText Component

## Overview

The FormHelperText component provides supplementary information and guidance for form fields. It supports various states including validation feedback, hints, and character counts while maintaining accessibility standards. This component is crucial for enhancing form usability and user understanding.

## Key Features

A comprehensive set of features for form field guidance:

- Validation feedback
- Character counting
- Dynamic content
- Error states
- Success states
- Warning states
- Icon support
- Accessibility support

## Usage Guidelines

This section demonstrates how to implement the FormHelperText component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the FormHelperText component:

```tsx
import * as React from 'react';
import { FormHelperText } from '@/components/form';

function BasicFormHelperTextExample() {
  return (
    <FormHelperText>
      Password must be at least 8 characters long
    </FormHelperText>
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedFormHelperTextExample() {
  const [charCount, setCharCount] = React.useState(0);
  const maxLength = 100;

  return (
    <>
      <FormHelperText
        error={charCount > maxLength}
        icon={<InfoIcon />}
        id="bio-helper"
      >
        Write a brief description about yourself
        <span className="char-count">
          {charCount}/{maxLength}
        </span>
      </FormHelperText>

      <FormHelperText
        success
        icon={<CheckIcon />}
        animate
      >
        Username is available!
      </FormHelperText>

      <FormHelperText
        warning
        icon={<WarningIcon />}
        persistent
      >
        This action cannot be undone
      </FormHelperText>
    </>
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | Required | Helper text content |
| error | `boolean` | `false` | Error state |
| success | `boolean` | `false` | Success state |
| warning | `boolean` | `false` | Warning state |
| icon | `ReactNode` | - | Leading icon |
| animate | `boolean` | `false` | Enable animations |
| persistent | `boolean` | `false` | Always show text |
| id | `string` | - | Unique identifier |
| className | `string` | - | Additional CSS class |
| disabled | `boolean` | `false` | Disabled state |

## Accessibility

Ensuring the FormHelperText component is accessible to all users.

### Keyboard Navigation

How users can interact with helper text:

- Tab to focusable elements
- Arrow keys for navigation
- Escape to dismiss
- Space/Enter for actions

### Screen Readers

How the component communicates with assistive technologies:

- Proper ARIA roles
- Status announcements
- Error descriptions
- Success feedback

### Best Practices

Guidelines for maintaining accessibility:

- Clear messaging
- Proper associations
- Color contrast
- Focus management

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual helper text functionality:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormHelperText } from './FormHelperText';
import '@testing-library/jest-dom';

describe('FormHelperText', () => {
  it('renders correctly', () => {
    render(
      <FormHelperText>Help text</FormHelperText>
    );
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(
      <FormHelperText error>
        Invalid input
      </FormHelperText>
    );
    expect(screen.getByText('Invalid input')).toHaveClass('error');
  });

  it('shows success state', () => {
    render(
      <FormHelperText success>
        Valid input
      </FormHelperText>
    );
    expect(screen.getByText('Valid input')).toHaveClass('success');
  });

  it('renders with icon', () => {
    render(
      <FormHelperText icon={<span data-testid="icon" />}>
        Help text
      </FormHelperText>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
```

### Integration Tests

Testing helper text behavior with form fields:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, FormHelperText, Input } from './components';
import '@testing-library/jest-dom';

describe('FormHelperText Integration', () => {
  it('associates with input field', async () => {
    render(
      <Form>
        <Input 
          id="email"
          name="email"
          aria-describedby="email-helper"
        />
        <FormHelperText id="email-helper">
          Enter your email address
        </FormHelperText>
      </Form>
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'email-helper');
  });

  it('updates on input validation', async () => {
    render(
      <Form>
        <Input 
          id="password"
          name="password"
          type="password"
          aria-describedby="password-helper"
        />
        <FormHelperText 
          id="password-helper"
          error={!isValid}
        >
          {isValid ? 'Password is valid' : 'Password is too weak'}
        </FormHelperText>
      </Form>
    );
    
    await userEvent.type(screen.getByRole('textbox'), 'weak');
    expect(screen.getByText('Password is too weak')).toHaveClass('error');
  });
});
```

### E2E Tests

Testing helper text behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('FormHelperText', () => {
  test('handles validation states', async ({ page }) => {
    await page.goto('/form-helper-demo');
    
    // Test error state
    await page.getByRole('textbox').fill('invalid');
    await expect(page.getByText('Invalid email')).toHaveClass(/error/);
    
    // Test success state
    await page.getByRole('textbox').fill('valid@email.com');
    await expect(page.getByText('Email is valid')).toHaveClass(/success/);
    
    // Test character count
    const textarea = page.getByRole('textbox', { name: 'Description' });
    await textarea.fill('Hello');
    await expect(page.getByText('5/100')).toBeVisible();
  });
});
```

## Design Guidelines

Best practices for implementing the FormHelperText component.

### Visual Design

Core visual principles:

- Clear typography
- Consistent spacing
- State colors
- Icon alignment
- Text wrapping

### Layout Considerations

How to handle different layout scenarios:

- Text placement
- Icon positioning
- Character count
- Multi-line text
- Responsive behavior

## Performance Considerations

Guidelines for optimal helper text performance:

- Efficient state updates
- Animation performance
- Event handler cleanup
- Memory management
- DOM updates minimization

## Related Components

Components commonly used with FormHelperText:

- Icon - For helper icons
- [FormField](/react-component-patterns/form/form-field.md) - For field wrapper
- [FormLabel](/react-component-patterns/form/form-label.md) - For field labels

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Helper Text Patterns](#)