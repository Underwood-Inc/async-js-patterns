---
title: Checkbox Component
description: Checkbox input component for boolean or multiple selection with support for indeterminate state
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Input
  - Checkbox
  - React
---

# Checkbox Component

## Overview

The Checkbox component provides a toggleable input control for boolean values or multiple selections. It supports advanced features like indeterminate states for parent-child relationships, custom styling, and keyboard accessibility. This component is essential for collecting binary choices or managing multiple selections in forms.

## Key Features

A comprehensive set of features for checkbox interactions:

- Boolean value selection
- Indeterminate state support
- Custom label rendering
- Group management
- Keyboard accessibility
- Custom styling options
- Validation states
- Form integration

## Usage Guidelines

This section demonstrates how to implement the Checkbox component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the Checkbox component:

```tsx
import * as React from 'react';
import { Checkbox } from '@/components/form';

function BasicCheckboxExample() {
  return (
    <Checkbox
      label="Accept terms and conditions"
      onChange={(checked) => console.log('Checked:', checked)}
    />
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedCheckboxExample() {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [parentChecked, setParentChecked] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);

  const options = ['Option 1', 'Option 2', 'Option 3'];

  const handleParentChange = (checked: boolean) => {
    setParentChecked(checked);
    setIndeterminate(false);
    setSelected(checked ? options : []);
  };

  const handleChildChange = (option: string, checked: boolean) => {
    const newSelected = checked
      ? [...selected, option]
      : selected.filter(item => item !== option);
    
    setSelected(newSelected);
    setParentChecked(newSelected.length === options.length);
    setIndeterminate(newSelected.length > 0 && newSelected.length < options.length);
  };

  return (
    <div>
      <Checkbox
        label="Select All"
        checked={parentChecked}
        indeterminate={indeterminate}
        onChange={handleParentChange}
      />
      {options.map(option => (
        <Checkbox
          key={option}
          label={option}
          checked={selected.includes(option)}
          onChange={(checked) => handleChildChange(option, checked)}
        />
      ))}
    </div>
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | `boolean` | `false` | Checkbox state |
| onChange | `(checked: boolean) => void` | - | Change handler |
| indeterminate | `boolean` | `false` | Indeterminate state |
| label | `ReactNode` | - | Checkbox label |
| disabled | `boolean` | `false` | Disabled state |
| error | `boolean` | `false` | Error state |
| required | `boolean` | `false` | Required field |
| name | `string` | - | Input name |
| value | `string` | - | Input value |

## Accessibility

Ensuring the Checkbox component is accessible to all users.

### Keyboard Navigation

How users can interact with the checkbox using a keyboard:

- Space to toggle state
- Tab to focus
- Arrow keys for groups
- Enter to submit

### Screen Readers

How the component communicates with assistive technologies:

- State announcements
- Required field indication
- Error messages
- Group relationships

### Best Practices

Guidelines for maintaining accessibility:

- Clear labeling
- Proper ARIA states
- Focus management
- Error handling

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual checkbox functionality:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';
import '@testing-library/jest-dom';

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox label="Test Checkbox" />);
    expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
  });

  it('handles state changes', async () => {
    const handleChange = jest.fn();
    render(
      <Checkbox 
        label="Test" 
        onChange={handleChange}
      />
    );
    
    const checkbox = screen.getByLabelText('Test');
    await userEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('supports indeterminate state', () => {
    render(
      <Checkbox 
        label="Test" 
        indeterminate
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });
});
```

### Integration Tests

Testing checkbox behavior in forms:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Checkbox } from './components';
import '@testing-library/jest-dom';

describe('Checkbox Integration', () => {
  it('works with form validation', async () => {
    render(
      <Form onSubmit={jest.fn()}>
        <Checkbox 
          label="Accept Terms"
          required
        />
      </Form>
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
});
```

### E2E Tests

Testing checkbox behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Checkbox', () => {
  test('handles basic interactions', async ({ page }) => {
    await page.goto('/checkbox-demo');
    
    // Test basic toggle
    const checkbox = page.getByLabel('Accept Terms');
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    
    // Test keyboard interaction
    await checkbox.press('Space');
    await expect(checkbox).not.toBeChecked();
  });

  test('handles group selection', async ({ page }) => {
    await page.goto('/checkbox-demo');
    
    // Test parent-child relationship
    const parentCheckbox = page.getByLabel('Select All');
    await parentCheckbox.click();
    
    const childCheckboxes = page.getByTestId('child-checkbox');
    await expect(childCheckboxes).toHaveCount(3);
    await expect(childCheckboxes.first()).toBeChecked();
  });
});
```

## Design Guidelines

Best practices for implementing the Checkbox component.

### Visual Design

Core visual principles:

- Clear checked state
- Visible focus states
- Proper spacing
- Error indication
- Label alignment

### Layout Considerations

How to handle different layout scenarios:

- Group alignment
- Label wrapping
- Mobile touch targets
- Error message placement
- Group hierarchy

## Performance Considerations

Guidelines for optimal checkbox performance:

- Efficient state management
- Group updates optimization
- Event handler cleanup
- Memory management
- DOM updates minimization

## Related Components

Components commonly used with Checkbox:

- [Radio](/react-component-patterns/form/radio.md) - For exclusive selection
- [Switch](/react-component-patterns/form/switch.md) - For toggle switches
- [FormField](/react-component-patterns/form/form-field.md) - For form field wrapper
- [FormGroup](/react-component-patterns/form/form-group.md) - For checkbox groups

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Selection Pattern Guidelines](#)
