---
title: Radio Component
description: Radio button component for exclusive selection within a group of options
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Input
  - Radio
  - React
---

# Radio Component

## Overview

The Radio component provides an exclusive selection control within a group of options. It ensures that only one option can be selected at a time, making it ideal for mutually exclusive choices in forms. The component supports both controlled and uncontrolled usage, with features for custom styling and keyboard navigation.

## Key Features

A comprehensive set of features for radio button interactions:

- Exclusive selection within groups
- Custom label rendering
- Group management
- Keyboard accessibility
- Custom styling options
- Validation states
- Form integration
- Disabled states

## Usage Guidelines

This section demonstrates how to implement the Radio component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the Radio component:

```tsx
import * as React from 'react';
import { Radio, RadioGroup } from '@/components/form';

function BasicRadioExample() {
  return (
    <RadioGroup
      label="Select Size"
      name="size"
      onChange={(value) => console.log('Selected:', value)}
    >
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedRadioExample() {
  const [selected, setSelected] = React.useState('');
  const [error, setError] = React.useState(false);

  const handleChange = (value: string) => {
    setSelected(value);
    setError(false);
  };

  const handleSubmit = () => {
    if (!selected) {
      setError(true);
    }
  };

  return (
    <RadioGroup
      label="Payment Method"
      name="payment"
      value={selected}
      onChange={handleChange}
      error={error}
      errorMessage="Please select a payment method"
      required
    >
      <Radio
        value="credit"
        label={
          <div className="payment-option">
            <CreditCardIcon />
            <span>Credit Card</span>
            <small>Additional fees may apply</small>
          </div>
        }
      />
      <Radio
        value="debit"
        label={
          <div className="payment-option">
            <DebitCardIcon />
            <span>Debit Card</span>
            <small>No additional fees</small>
          </div>
        }
      />
      <Radio
        value="bank"
        label={
          <div className="payment-option">
            <BankIcon />
            <span>Bank Transfer</span>
            <small>Processing time: 2-3 days</small>
          </div>
        }
      />
    </RadioGroup>
  );
}
```

## Props

A comprehensive list of available props:

### Radio Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | Required | Option value |
| label | `ReactNode` | - | Option label |
| disabled | `boolean` | `false` | Disabled state |
| name | `string` | - | Input name |
| checked | `boolean` | - | Checked state |

### RadioGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | - | Selected value |
| onChange | `(value: string) => void` | - | Change handler |
| name | `string` | Required | Group name |
| label | `ReactNode` | - | Group label |
| error | `boolean` | `false` | Error state |
| errorMessage | `string` | - | Error message |
| required | `boolean` | `false` | Required field |

## Accessibility

Ensuring the Radio component is accessible to all users.

### Keyboard Navigation

How users can interact with radio buttons using a keyboard:

- Space to select option
- Tab to focus group
- Arrow keys to navigate options
- Enter to submit

### Screen Readers

How the component communicates with assistive technologies:

- Group role and label
- Selected state announcements
- Required field indication
- Error messages

### Best Practices

Guidelines for maintaining accessibility:

- Clear option labeling
- Proper group structure
- Focus management
- Error handling

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual radio functionality:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioGroup } from './Radio';
import '@testing-library/jest-dom';

describe('Radio', () => {
  it('renders correctly', () => {
    render(
      <RadioGroup label="Test Group" name="test">
        <Radio label="Option 1" value="1" />
        <Radio label="Option 2" value="2" />
      </RadioGroup>
    );
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
  });

  it('handles selection', async () => {
    const handleChange = jest.fn();
    render(
      <RadioGroup 
        label="Test" 
        name="test"
        onChange={handleChange}
      >
        <Radio label="Option 1" value="1" />
        <Radio label="Option 2" value="2" />
      </RadioGroup>
    );
    
    await userEvent.click(screen.getByLabelText('Option 1'));
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('supports keyboard navigation', async () => {
    render(
      <RadioGroup label="Test" name="test">
        <Radio label="Option 1" value="1" />
        <Radio label="Option 2" value="2" />
      </RadioGroup>
    );
    
    const option1 = screen.getByLabelText('Option 1');
    option1.focus();
    await userEvent.keyboard('{arrowdown}');
    expect(screen.getByLabelText('Option 2')).toHaveFocus();
  });
});
```

### Integration Tests

Testing radio behavior in forms:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Radio, RadioGroup } from './components';
import '@testing-library/jest-dom';

describe('Radio Integration', () => {
  it('works with form validation', async () => {
    render(
      <Form onSubmit={jest.fn()}>
        <RadioGroup 
          label="Gender"
          name="gender"
          required
        >
          <Radio label="Male" value="male" />
          <Radio label="Female" value="female" />
          <Radio label="Other" value="other" />
        </RadioGroup>
      </Form>
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
});
```

### E2E Tests

Testing radio behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Radio', () => {
  test('handles selection', async ({ page }) => {
    await page.goto('/radio-demo');
    
    // Test basic selection
    const option1 = page.getByLabel('Option 1');
    await option1.click();
    await expect(option1).toBeChecked();
    
    // Test exclusive selection
    const option2 = page.getByLabel('Option 2');
    await option2.click();
    await expect(option1).not.toBeChecked();
    await expect(option2).toBeChecked();
  });

  test('supports keyboard navigation', async ({ page }) => {
    await page.goto('/radio-demo');
    
    // Focus first option
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Option 1')).toBeFocused();
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await expect(page.getByLabel('Option 2')).toBeFocused();
    
    // Select with space
    await page.keyboard.press('Space');
    await expect(page.getByLabel('Option 2')).toBeChecked();
  });
});
```

## Design Guidelines

Best practices for implementing the Radio component.

### Visual Design

Core visual principles:

- Clear selection state
- Visible focus states
- Proper spacing
- Error indication
- Label alignment

### Layout Considerations

How to handle different layout scenarios:

- Vertical vs. horizontal layout
- Label wrapping
- Mobile touch targets
- Error message placement
- Group alignment

## Performance Considerations

Guidelines for optimal radio performance:

- Efficient state management
- Group updates optimization
- Event handler cleanup
- Memory management
- DOM updates minimization

## Related Components

Components commonly used with Radio:

- [Checkbox](/react-component-patterns/form/checkbox.md) - For multiple selection
- [Select](/react-component-patterns/form/select.md) - For dropdown selection
- [FormField](/react-component-patterns/form/form-field.md) - For form field wrapper
- [FormGroup](/react-component-patterns/form/form-group.md) - For input groups

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Selection Pattern Guidelines](#)
