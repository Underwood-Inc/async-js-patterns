---
title: Textarea Component
description: Multi-line text input component with auto-resizing, character counting, and validation support
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Input
  - Textarea
  - React
---

# Textarea Component

## Overview

The Textarea component provides a flexible multi-line text input field for forms. It supports advanced features like auto-resizing, character counting, and validation states, making it ideal for collecting longer text input while maintaining a consistent user experience.

## Key Features

A comprehensive set of features for multi-line text input:

- Auto-resizing based on content
- Character limit with counter
- Validation states and messages
- Placeholder text support
- Disabled and read-only states
- Custom styling options
- Accessibility support

## Usage Guidelines

This section demonstrates how to implement the Textarea component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the Textarea component:

```tsx
import * as React from 'react';
import { Textarea } from '@/components/form';

function BasicTextareaExample() {
  return (
    <Textarea
      label="Comments"
      placeholder="Enter your comments"
      onChange={(e) => console.log(e.target.value)}
    />
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedTextareaExample() {
  const [value, setValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsValid(validateContent(newValue));
  };

  return (
    <Textarea
      label="Description"
      value={value}
      onChange={handleChange}
      autoResize
      minRows={3}
      maxRows={10}
      maxLength={500}
      showCount
      error={!isValid}
      errorMessage="Description must be at least 50 characters"
      helperText="Tell us about your project"
      required
    />
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | - | Textarea content |
| onChange | `(event: React.ChangeEvent<HTMLTextAreaElement>) => void` | - | Change handler |
| autoResize | `boolean` | `false` | Whether to auto-resize based on content |
| minRows | `number` | `3` | Minimum number of rows |
| maxRows | `number` | - | Maximum number of rows |
| maxLength | `number` | - | Maximum character limit |
| showCount | `boolean` | `false` | Whether to show character count |
| error | `boolean` | `false` | Error state |
| errorMessage | `string` | - | Error message text |
| label | `string` | - | Input label |
| required | `boolean` | `false` | Whether field is required |

## Accessibility

Ensuring the Textarea component is accessible to all users.

### Keyboard Navigation

How users can interact with the textarea using a keyboard:

- Tab to focus the textarea
- Enter for new lines
- Ctrl+A to select all text
- Arrow keys for cursor movement

### Screen Readers

How the component communicates with assistive technologies:

- Proper textarea labeling
- Error state announcements
- Required field indication
- Character count updates

### Best Practices

Guidelines for maintaining accessibility:

- Always provide visible labels
- Use proper error messaging
- Maintain sufficient color contrast
- Support keyboard interactions

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual textarea functionality:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';
import '@testing-library/jest-dom';

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea label="Test Textarea" />);
    expect(screen.getByLabelText('Test Textarea')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const handleChange = jest.fn();
    render(<Textarea label="Test" onChange={handleChange} />);
    
    const textarea = screen.getByLabelText('Test');
    await userEvent.type(textarea, 'Hello\nWorld');
    expect(handleChange).toHaveBeenCalledTimes(11);
  });

  it('shows character count', () => {
    render(
      <Textarea 
        label="Test" 
        maxLength={100}
        showCount
        value="Hello"
      />
    );
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });
});
```

### Integration Tests

Testing textarea behavior with form validation:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Textarea } from './components';
import '@testing-library/jest-dom';

describe('Textarea Integration', () => {
  it('works with form validation', async () => {
    render(
      <Form onSubmit={jest.fn()}>
        <Textarea 
          label="Description"
          required
          minLength={10}
        />
      </Form>
    );
    
    const textarea = screen.getByLabelText('Description');
    await userEvent.type(textarea, 'Short');
    await userEvent.tab();
    
    expect(screen.getByText('Minimum length is 10 characters')).toBeInTheDocument();
  });
});
```

### E2E Tests

Testing textarea behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Textarea', () => {
  test('handles user input and validation', async ({ page }) => {
    await page.goto('/textarea-demo');
    
    // Test basic input
    const textarea = page.getByLabel('Comments');
    await textarea.fill('Hello\nWorld');
    await expect(textarea).toHaveValue('Hello\nWorld');
    
    // Test auto-resize
    const initialHeight = await textarea.boundingBox().then(box => box.height);
    await textarea.fill('Hello\nWorld\nMore\nLines');
    const newHeight = await textarea.boundingBox().then(box => box.height);
    expect(newHeight).toBeGreaterThan(initialHeight);
    
    // Test character limit
    await textarea.fill('x'.repeat(101));
    await expect(page.getByText('Maximum length exceeded')).toBeVisible();
  });

  test('supports keyboard navigation', async ({ page }) => {
    await page.goto('/textarea-demo');
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Comments')).toBeFocused();
    
    await page.keyboard.type('Hello');
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await expect(page.getByLabel('Comments')).toHaveValue('');
  });
});
```

## Design Guidelines

Best practices for implementing the Textarea component.

### Visual Design

Core visual principles:

- Consistent padding and spacing
- Clear focus states
- Visible placeholder text
- Error state styling
- Resize handle styling

### Layout Considerations

How to handle different layout scenarios:

- Full-width vs. fixed-width textareas
- Auto-resize constraints
- Label placement options
- Error message positioning

## Performance Considerations

Guidelines for optimal textarea performance:

- Debounce resize calculations
- Optimize change handlers
- Handle large text efficiently
- Clean up resize observers

## Related Components

Components commonly used with Textarea:

- [Input](/react-component-patterns/form/input.md) - For single-line text input
- [RichText](/react-component-patterns/form/rich-text.md) - For formatted text editing
- [FormField](/react-component-patterns/form/form-field.md) - For form field wrapper
- [FormHelperText](/react-component-patterns/form/form-helper-text.md) - For helper text

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Text Input Patterns](#)