---
title: FormLabel Component
description: Label component for form fields with support for required indicators, tooltips, and custom styling
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Label
  - Accessibility
  - React
---

# FormLabel Component

## Overview

The FormLabel component provides a standardized way to label form fields. It supports required indicators, tooltips, and custom styling while maintaining accessibility best practices. This component is essential for creating clear and accessible form interfaces.

## Key Features

A comprehensive set of features for form field labeling:

- Required field indicators
- Optional field indicators
- Tooltip support
- Custom positioning
- HTML attributes
- Accessibility support
- Custom styling
- Error states

## Usage Guidelines

This section demonstrates how to implement the FormLabel component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the FormLabel component:

```tsx
import * as React from 'react';
import { FormLabel } from '@/components/form';

function BasicFormLabelExample() {
  return (
    <FormLabel htmlFor="username">
      Username
    </FormLabel>
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedFormLabelExample() {
  return (
    <>
      <FormLabel
        htmlFor="email"
        required
        tooltip="Enter your primary email address"
        position="left"
        width="120px"
      >
        Email Address
      </FormLabel>

      <FormLabel
        htmlFor="bio"
        optional
        optionalText="(Optional)"
        error={!isValid}
      >
        <div className="label-content">
          <span>Biography</span>
          <InfoIcon className="info-icon" />
        </div>
      </FormLabel>
    </>
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | Required | Label content |
| htmlFor | `string` | - | Associated input ID |
| required | `boolean` | `false` | Show required indicator |
| optional | `boolean` | `false` | Show optional text |
| optionalText | `string` | `'(Optional)'` | Optional text content |
| tooltip | `ReactNode` | - | Tooltip content |
| position | `'top' \| 'left' \| 'right'` | `'top'` | Label position |
| width | `number \| string` | - | Label width |
| error | `boolean` | `false` | Error state |
| disabled | `boolean` | `false` | Disabled state |
| colon | `boolean` | `false` | Show colon |

## Accessibility

Ensuring the FormLabel component is accessible to all users.

### Keyboard Navigation

How users can interact with labels using a keyboard:

- Tab to focus associated input
- Enter/Space for interactive elements
- Escape to close tooltips
- Arrow keys for navigation

### Screen Readers

How the component communicates with assistive technologies:

- Proper label association
- Required field indication
- Optional field indication
- Error state announcements

### Best Practices

Guidelines for maintaining accessibility:

- Clear text content
- Proper HTML association
- Visible focus states
- Error indication

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual label functionality:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormLabel } from './FormLabel';
import '@testing-library/jest-dom';

describe('FormLabel', () => {
  it('renders correctly', () => {
    render(
      <FormLabel htmlFor="test">Test Label</FormLabel>
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(
      <FormLabel htmlFor="test" required>
        Test Label
      </FormLabel>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows optional text', () => {
    render(
      <FormLabel 
        htmlFor="test" 
        optional 
        optionalText="(Optional)"
      >
        Test Label
      </FormLabel>
    );
    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    render(
      <FormLabel 
        htmlFor="test"
        tooltip="Help text"
      >
        Test Label
      </FormLabel>
    );
    
    await userEvent.hover(screen.getByText('Test Label'));
    expect(screen.getByText('Help text')).toBeVisible();
  });
});
```

### Integration Tests

Testing label behavior with form fields:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, FormLabel, Input } from './components';
import '@testing-library/jest-dom';

describe('FormLabel Integration', () => {
  it('associates with input field', async () => {
    render(
      <Form>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input id="name" name="name" />
      </Form>
    );
    
    const label = screen.getByText('Name');
    await userEvent.click(label);
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});
```

### E2E Tests

Testing label behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('FormLabel', () => {
  test('handles label interactions', async ({ page }) => {
    await page.goto('/form-label-demo');
    
    // Test label click
    await page.getByText('Username').click();
    await expect(page.getByRole('textbox')).toBeFocused();
    
    // Test tooltip
    await page.hover('text=Email');
    await expect(page.getByText('Enter your email')).toBeVisible();
    
    // Test required indicator
    const requiredLabel = page.getByText('Password').locator('..');
    await expect(requiredLabel).toContainText('*');
  });
});
```

## Design Guidelines

Best practices for implementing the FormLabel component.

### Visual Design

Core visual principles:

- Clear typography
- Consistent spacing
- Required indicators
- Optional text styling
- Error states

### Layout Considerations

How to handle different layout scenarios:

- Label placement
- Tooltip positioning
- Required indicator alignment
- Text wrapping
- Responsive behavior

## Performance Considerations

Guidelines for optimal label performance:

- Efficient tooltip rendering
- Event handler cleanup
- Memory management
- DOM updates minimization
- Style optimizations

## Related Components

Components commonly used with FormLabel:

- Tooltip - For label tooltips
- [FormField](/react-component-patterns/form/form-field.md) - For field wrapper
- [FormHelperText](/react-component-patterns/form/form-helper-text.md) - For help text

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Label Pattern Guidelines](#)