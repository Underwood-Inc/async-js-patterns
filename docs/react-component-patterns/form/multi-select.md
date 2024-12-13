---
title: MultiSelect Component
description: Multiple selection component with search, filtering, and customizable options
category: Components
subcategory: Form
date: 2024-12-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Select
  - Multiple
  - React
---

# MultiSelect Component

## Overview

The MultiSelect component provides a comprehensive interface for selecting multiple options from a list. It supports searching, filtering, custom option rendering, and keyboard navigation while maintaining accessibility standards. This component is essential for handling multiple selection inputs in forms.

## Key Features

A comprehensive set of features for multiple selection:

- Multiple selection
- Search filtering
- Custom options
- Keyboard navigation
- Group support
- Async loading
- Selection limits
- Accessibility support

## Usage Guidelines

This section demonstrates how to implement the MultiSelect component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the MultiSelect component:

```tsx
import * as React from 'react';
import { MultiSelect } from '@/components/form';

export const BasicMultiSelectExample: React.FC = () => {
  const [selected, setSelected] = React.useState<string[]>([]);

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' }
  ];

  return (
    <MultiSelect
      label="Select Fruits"
      options={options}
      value={selected}
      onChange={setSelected}
    />
  );
};
```

### Advanced Usage

Examples of more complex implementations:

```tsx
import * as React from 'react';
import { MultiSelect } from '@/components/form';
import { fetchUsers } from '@/utils/api';

export const AdvancedMultiSelectExample: React.FC = () => {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const loadOptions = async (searchTerm: string) => {
    try {
      setLoading(true);
      const users = await fetchUsers(searchTerm);
      setOptions(users.map(user => ({
        value: user.id,
        label: user.name,
        description: user.email,
        avatar: user.avatar
      })));
    } catch (err) {
      setError('Failed to load options');
    } finally {
      setLoading(false);
    }
  };

  const groupedOptions = [
    {
      label: 'Fruits',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' }
      ]
    },
    {
      label: 'Vegetables',
      options: [
        { value: 'carrot', label: 'Carrot' },
        { value: 'potato', label: 'Potato' }
      ]
    }
  ];

  return (
    <>
      <MultiSelect
        label="Assign Users"
        value={selected}
        onChange={setSelected}
        onSearch={loadOptions}
        loading={loading}
        error={error}
        renderOption={(option) => (
          <div className="user-option">
            <img src={option.avatar} alt="" />
            <div>
              <div>{option.label}</div>
              <div>{option.description}</div>
            </div>
          </div>
        )}
        placeholder="Search users..."
        noOptionsMessage="No users found"
        loadingMessage="Loading users..."
      />

      <MultiSelect
        label="Select Items"
        options={groupedOptions}
        value={selected}
        onChange={setSelected}
        groupBy="label"
        maxItems={5}
        showSelectAll
        closeOnSelect={false}
      />

      <MultiSelect
        label="Tags"
        value={selected}
        onChange={setSelected}
        creatable
        createMessage="Create new tag"
        validateCreate={(input) => input.length >= 3}
        formatCreateLabel={(input) => `Create "${input}"`}
      />
    </>
  );
};
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string[]` | Required | Selected values |
| onChange | `(values: string[]) => void` | Required | Change handler |
| options | `Option[] \| OptionGroup[]` | Required | Options list |
| label | `string` | - | Field label |
| onSearch | `(term: string) => void` | - | Search handler |
| loading | `boolean` | `false` | Loading state |
| error | `string` | - | Error message |
| renderOption | `(option: Option) => ReactNode` | - | Option renderer |
| groupBy | `string` | - | Group key |
| maxItems | `number` | - | Selection limit |
| showSelectAll | `boolean` | `false` | Show select all |
| closeOnSelect | `boolean` | `true` | Close on select |
| creatable | `boolean` | `false` | Allow creation |
| createMessage | `string` | - | Create message |
| validateCreate | `(input: string) => boolean` | - | Creation validator |

## Accessibility

Ensuring the MultiSelect component is accessible to all users.

### Keyboard Navigation

How users can interact with the select:

- Tab to focus select
- Space to open menu
- Arrow keys for navigation
- Enter to select
- Escape to close menu

### Screen Readers

How the component communicates with assistive technologies:

- Option announcements
- Selection status
- Group headings
- Loading states
- Error messages

### Best Practices

Guidelines for maintaining accessibility:

- Clear labeling
- Keyboard support
- ARIA attributes
- Focus management
- Error handling

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual select functionality:

```tsx
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MultiSelect } from '@/components/form';

describe('MultiSelect', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ];

  it('renders correctly', () => {
    render(
      <MultiSelect
        label="Test Select"
        options={options}
        value={[]}
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
  });

  it('handles selection', async () => {
    const handleChange = jest.fn();
    render(
      <MultiSelect
        label="Test Select"
        options={options}
        value={[]}
        onChange={handleChange}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Test Select'));
    await user.click(screen.getByText('Option 1'));

    expect(handleChange).toHaveBeenCalledWith(['1']);
  });

  it('shows selected options', async () => {
    render(
      <MultiSelect
        label="Test Select"
        options={options}
        value={['1']}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('handles search', async () => {
    const handleSearch = jest.fn();
    render(
      <MultiSelect
        label="Test Select"
        options={options}
        value={[]}
        onChange={() => {}}
        onSearch={handleSearch}
      />
    );

    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    await user.type(input, 'test');

    expect(handleSearch).toHaveBeenCalledWith('test');
  });
});
```

### Integration Tests

Testing select behavior with form validation:

```tsx
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Form, MultiSelect } from '@/components/form';
import { userEvent } from '@testing-library/user-event';

describe('MultiSelect Integration', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ];

  it('validates required selection', async () => {
    render(
      <Form>
        <MultiSelect
          label="Test Select"
          options={options}
          value={[]}
          onChange={() => {}}
          required
        />
        <button type="submit">Submit</button>
      </Form>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Selection required')).toBeVisible();
  });

  it('handles max items', async () => {
    const handleChange = jest.fn();
    render(
      <Form>
        <MultiSelect
          label="Test Select"
          options={options}
          value={['1']}
          onChange={handleChange}
          maxItems={1}
        />
      </Form>
    );

    const user = userEvent.setup();
    await user.click(screen.getByLabelText('Test Select'));
    await user.click(screen.getByText('Option 2'));

    expect(screen.getByText('Maximum items selected')).toBeVisible();
  });
});
```

### E2E Tests

Testing select behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('MultiSelect', () => {
  test('handles multiple selection', async ({ page }) => {
    await page.goto('/multi-select-demo');

    // Open select
    await page.getByLabel('Select Items').click();

    // Select multiple options
    await page.getByText('Option 1').click();
    await page.getByText('Option 2').click();

    // Verify selections
    await expect(page.getByText('Option 1')).toBeVisible();
    await expect(page.getByText('Option 2')).toBeVisible();
  });

  test('handles keyboard navigation', async ({ page }) => {
    await page.goto('/multi-select-demo');

    // Focus select
    await page.getByLabel('Select Items').focus();

    // Open with space
    await page.keyboard.press('Space');

    // Navigate with arrows
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');

    // Verify selection
    await expect(page.getByText('Option 1')).toBeVisible();
  });
});
```

## Design Guidelines

Best practices for implementing the MultiSelect component.

### Visual Design

Core visual principles:

- Option layout
- Selection indicators
- Search input
- Loading states
- Error states

### Layout Considerations

How to handle different layout scenarios:

- Menu positioning
- Option grouping
- Selection chips
- Search placement
- Error message display

## Performance Considerations

Guidelines for optimal select performance:

- Option rendering
- Search filtering
- Selection tracking
- Menu positioning
- Memory cleanup

## Related Components

Components commonly used with MultiSelect:

- Chip - For selected items
- Menu - For dropdown menu
- [FormField](/react-component-patterns/form/form-field.md) - For field wrapper
- [Input](/react-component-patterns/form/input.md) - For text input

## Resources

Additional documentation and references:

- [Selection Patterns](#)
- [Menu Guidelines](#)
- [Accessibility Best Practices](#)