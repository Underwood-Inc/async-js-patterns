---
title: Switch Component
description: Toggle switch component for binary state selection with animated transitions
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Input
  - Switch
  - Toggle
  - React
---

# Switch Component

## Overview

The Switch component provides a toggle switch control for binary settings. It is ideal for enabling/disabling features or toggling between two states, offering a more visual alternative to checkboxes. The component includes smooth animations and clear visual feedback.

## Key Features

A comprehensive set of features for toggle switch interactions:

- Animated state transitions
- Custom label placement
- Custom icons support
- Size variants
- Color variants
- Loading states
- Disabled states
- Form integration

## Usage Guidelines

This section demonstrates how to implement the Switch component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the Switch component:

```tsx
import * as React from 'react';
import { Switch } from '@/components/form';

function BasicSwitchExample() {
  return (
    <Switch
      label="Enable notifications"
      onChange={(checked) => console.log('Notifications:', checked)}
    />
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedSwitchExample() {
  const [enabled, setEnabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleChange = async (checked: boolean) => {
    setLoading(true);
    try {
      await updateFeatureFlag('darkMode', checked);
      setEnabled(checked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      label={
        <div className="switch-label">
          <span>Dark Mode</span>
          <small>{enabled ? 'On' : 'Off'}</small>
        </div>
      }
      checked={enabled}
      loading={loading}
      onChange={handleChange}
      size="large"
      color="primary"
      icons={{
        checked: <SunIcon />,
        unchecked: <MoonIcon />
      }}
    />
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| checked | `boolean` | `false` | Switch state |
| onChange | `(checked: boolean) => void` | - | Change handler |
| label | `ReactNode` | - | Switch label |
| loading | `boolean` | `false` | Loading state |
| disabled | `boolean` | `false` | Disabled state |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Switch size |
| color | `'primary' \| 'secondary' \| string` | `'primary'` | Switch color |
| icons | `{ checked?: ReactNode, unchecked?: ReactNode }` | - | Custom icons |
| labelPlacement | `'start' \| 'end' \| 'top' \| 'bottom'` | `'end'` | Label position |

## Accessibility

Ensuring the Switch component is accessible to all users.

### Keyboard Navigation

How users can interact with the switch using a keyboard:

- Space/Enter to toggle
- Tab to focus
- Arrow keys for groups
- Escape to blur

### Screen Readers

How the component communicates with assistive technologies:

- State announcements
- Label association
- Loading indication
- Error messages

### Best Practices

Guidelines for maintaining accessibility:

- Clear labeling
- Proper ARIA roles
- Focus management
- Loading states

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual switch functionality:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';
import '@testing-library/jest-dom';

describe('Switch', () => {
  it('renders correctly', () => {
    render(<Switch label="Test Switch" />);
    expect(screen.getByLabelText('Test Switch')).toBeInTheDocument();
  });

  it('handles toggle', async () => {
    const handleChange = jest.fn();
    render(
      <Switch 
        label="Test" 
        onChange={handleChange}
      />
    );
    
    const switchElement = screen.getByLabelText('Test');
    await userEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('supports keyboard interaction', async () => {
    render(<Switch label="Test" />);
    
    const switchElement = screen.getByLabelText('Test');
    switchElement.focus();
    await userEvent.keyboard('[Space]');
    expect(switchElement).toBeChecked();
  });
});
```

### Integration Tests

Testing switch behavior in forms:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Switch } from './components';
import '@testing-library/jest-dom';

describe('Switch Integration', () => {
  it('works with form submission', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form onSubmit={handleSubmit}>
        <Switch 
          label="Accept Terms"
          name="terms"
        />
      </Form>
    );
    
    await userEvent.click(screen.getByLabelText('Accept Terms'));
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
      terms: true
    }));
  });
});
```

### E2E Tests

Testing switch behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Switch', () => {
  test('handles toggle interaction', async ({ page }) => {
    await page.goto('/switch-demo');
    
    // Test basic toggle
    const switchElement = page.getByLabel('Enable Feature');
    await switchElement.click();
    await expect(switchElement).toBeChecked();
    
    // Test visual feedback
    await expect(page.getByTestId('switch-thumb')).toHaveClass(/active/);
    
    // Test keyboard interaction
    await switchElement.press('Space');
    await expect(switchElement).not.toBeChecked();
  });

  test('handles loading state', async ({ page }) => {
    await page.goto('/switch-demo');
    
    const switchElement = page.getByLabel('Auto-save');
    await switchElement.click();
    
    // Verify loading state
    await expect(page.getByTestId('loading-indicator')).toBeVisible();
    await expect(switchElement).toBeDisabled();
  });
});
```

## Design Guidelines

Best practices for implementing the Switch component.

### Visual Design

Core visual principles:

- Smooth animations
- Clear state indication
- Loading feedback
- Proper sizing
- Color contrast

### Layout Considerations

How to handle different layout scenarios:

- Label placement options
- Mobile touch targets
- Spacing and alignment
- Icon placement
- Group organization

## Performance Considerations

Guidelines for optimal switch performance:

- Animation optimization
- State management
- Event handler cleanup
- Loading state handling
- Memory management

## Related Components

Components commonly used with Switch:

- [Checkbox](/react-component-patterns/form/checkbox.md) - For checkboxes
- [Radio](/react-component-patterns/form/radio.md) - For radio buttons
- [FormField](/react-component-patterns/form/form-field.md) - For form field wrapper
- [FormGroup](/react-component-patterns/form/form-group.md) - For switch groups

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Toggle Pattern Guidelines](#)
