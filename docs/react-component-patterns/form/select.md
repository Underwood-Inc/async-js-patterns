---
title: Select Component
description: Dropdown selection component with support for single and multiple selection, option groups, and custom rendering
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Select
  - Dropdown
  - React
---

# Select Component

## Overview

The Select component provides a powerful dropdown selection interface for forms. It supports both single and multiple selection modes, option grouping, custom option rendering, and advanced features like search/filtering. This component is essential for handling selection from predefined options while maintaining accessibility and usability.

## Key Features

A comprehensive set of features for dropdown selection:

- Single and multiple selection modes
- Option grouping support
- Custom option rendering
- Search/filter functionality
- Keyboard navigation
- Validation states
- Custom styling options
- Accessibility support

## Usage Guidelines

This section demonstrates how to implement the Select component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the Select component:

```tsx
import * as React from 'react';
import { Select } from '@/components/form';

function BasicSelectExample() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' }
  ];

  return (
    <Select
      label="Fruit"
      options={options}
      placeholder="Select a fruit"
      onChange={(value) => console.log(value)}
    />
  );
}
```

### Advanced Usage

Examples of more complex implementations:

```tsx
function AdvancedSelectExample() {
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const options = [
    { value: 'sedan', label: 'Sedan', group: 'Cars' },
    { value: 'suv', label: 'SUV', group: 'Cars' },
    { value: 'cruiser', label: 'Cruiser', group: 'Motorcycles' },
    { value: 'sport', label: 'Sport', group: 'Motorcycles' }
  ];

  return (
    <Select
      label="Vehicles"
      options={options}
      multiple
      searchable
      value={selectedValues}
      onChange={setSelectedValues}
      renderOption={(option) => (
        <div className="option-container">
          <span className="option-label">{option.label}</span>
          <span className="option-group">{option.group}</span>
        </div>
      )}
      error={selectedValues.length === 0}
      errorMessage="Please select at least one vehicle"
      required
    />
  );
}
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | `SelectOption[]` | Required | Array of options to display |
| value | `string \| string[]` | - | Selected value(s) |
| onChange | `(value: string \| string[]) => void` | - | Selection change handler |
| multiple | `boolean` | `false` | Enable multiple selection |
| searchable | `boolean` | `false` | Enable search functionality |
| renderOption | `(option: SelectOption) => ReactNode` | - | Custom option renderer |
| error | `boolean` | `false` | Error state |
| errorMessage | `string` | - | Error message text |
| label | `string` | - | Select label |
| required | `boolean` | `false` | Whether field is required |

## Accessibility

Ensuring the Select component is accessible to all users.

### Keyboard Navigation

How users can interact with the select using a keyboard:

- Enter/Space to open dropdown
- Arrow keys to navigate options
- Enter to select option
- Escape to close dropdown
- Type to search (when enabled)

### Screen Readers

How the component communicates with assistive technologies:

- Proper ARIA roles (listbox/option)
- Selection state announcements
- Group labels for nested options
- Search status updates

### Best Practices

Guidelines for maintaining accessibility:

- Clear option labeling
- Proper group structure
- Keyboard focus management
- Clear selection indicators

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual select functionality:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';
import '@testing-library/jest-dom';

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ];

  it('renders correctly', () => {
    render(<Select label="Test Select" options={options} />);
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
  });

  it('handles selection', async () => {
    const handleChange = jest.fn();
    render(
      <Select 
        label="Test" 
        options={options} 
        onChange={handleChange}
      />
    );
    
    await userEvent.click(screen.getByLabelText('Test'));
    await userEvent.click(screen.getByText('Option A'));
    expect(handleChange).toHaveBeenCalledWith('a');
  });

  it('supports multiple selection', async () => {
    const handleChange = jest.fn();
    render(
      <Select 
        label="Test" 
        options={options} 
        multiple 
        onChange={handleChange}
      />
    );
    
    await userEvent.click(screen.getByLabelText('Test'));
    await userEvent.click(screen.getByText('Option A'));
    await userEvent.click(screen.getByText('Option B'));
    expect(handleChange).toHaveBeenCalledWith(['a', 'b']);
  });
});
```

### Integration Tests

Testing select behavior with form validation:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Select } from './components';
import '@testing-library/jest-dom';

describe('Select Integration', () => {
  it('works with form validation', async () => {
    render(
      <Form onSubmit={jest.fn()}>
        <Select 
          label="Category"
          options={[
            { value: 'a', label: 'Category A' },
            { value: 'b', label: 'Category B' }
          ]}
          required
        />
      </Form>
    );
    
    await userEvent.click(screen.getByLabelText('Category'));
    await userEvent.tab();
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
});
```

### E2E Tests

Testing select behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Select', () => {
  test('handles selection and search', async ({ page }) => {
    await page.goto('/select-demo');
    
    // Test basic selection
    const select = page.getByLabel('Category');
    await select.click();
    await page.getByText('Option A').click();
    await expect(select).toHaveValue('a');
    
    // Test search functionality
    await select.click();
    await page.keyboard.type('Option B');
    await expect(page.getByText('Option B')).toBeVisible();
    await expect(page.getByText('Option A')).not.toBeVisible();
    
    // Test keyboard navigation
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(select).toHaveValue('b');
  });

  test('handles multiple selection', async ({ page }) => {
    await page.goto('/select-demo');
    
    const select = page.getByLabel('Categories');
    await select.click();
    
    await page.getByText('Option A').click();
    await page.getByText('Option B').click();
    
    await expect(page.getByText('2 items selected')).toBeVisible();
  });
});
```

## Design Guidelines

Best practices for implementing the Select component.

### Visual Design

Core visual principles:

- Clear dropdown indicators
- Visible selection state
- Proper option spacing
- Group separators
- Search input styling

### Layout Considerations

How to handle different layout scenarios:

- Dropdown positioning
- Option list height
- Multiple selection layout
- Group indentation
- Mobile optimization

## Performance Considerations

Guidelines for optimal select performance:

- Virtualize large option lists
- Debounce search input
- Optimize option rendering
- Handle large datasets
- Clean up event listeners

## Related Components

Components commonly used with Select:

- [MultiSelect](/react-component-patterns/form/multi-select.md) - For complex multiple selection
- [Combobox](/react-component-patterns/form/combobox.md) - For searchable selection
- [FormField](/react-component-patterns/form/form-field.md) - For form field wrapper
- [Dropdown](/react-component-patterns/overlay/contextual-overlays/dropdown.md) - For custom dropdowns

## Resources

Additional documentation and references:

- [Form Design Guidelines](#)
- [Accessibility Best Practices](#)
- [Selection Pattern Guidelines](#)