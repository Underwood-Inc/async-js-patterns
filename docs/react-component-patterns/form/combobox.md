---
title: Combobox Component
description: Autocomplete input component with dropdown suggestions and keyboard navigation support
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Input
  - Autocomplete
  - React
---

# Combobox Component

## Overview

The Combobox component combines an input field with a dropdown list of suggestions, providing autocomplete functionality. It supports both free text input and selection from predefined options while maintaining accessibility standards. This component is essential for providing efficient data entry with suggestions in forms.

## Key Features

A comprehensive set of features for combobox interactions:

- Autocomplete suggestions
- Custom filtering
- Keyboard navigation
- Multiple selection
- Async data loading
- Custom option rendering
- Accessibility support
- Form integration

## Usage Guidelines

This section demonstrates how to implement the Combobox component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the Combobox component:

```tsx
import * as React from 'react';
import { Combobox } from '@/components/form';

export const BasicComboboxExample: React.FC = () => {
  const [value, setValue] = React.useState('');
  const options = ['Apple', 'Banana', 'Orange', 'Pear'];

  return (
    <Combobox
      label="Select Fruit"
      value={value}
      onChange={setValue}
      options={options}
    />
  );
};
```

### Advanced Usage

Examples of more complex implementations:

```tsx
import * as React from 'react';
import { Combobox } from '@/components/form';

interface Option {
  id: string;
  label: string;
  category: string;
}

export const AdvancedComboboxExample: React.FC = () => {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<Option[]>([]);

  const fetchOptions = async (query: string) => {
    setLoading(true);
    try {
      // Simulated API call
      const response = await fetch(`/api/search?q=${query}`);
      const data = await response.json();
      setOptions(data);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    fetchOptions(newValue);
  };

  return (
    <Combobox
      label="Search Items"
      value={value}
      onChange={handleChange}
      options={options}
      loading={loading}
      renderOption={(option) => (
        <div className="flex flex-col">
          <span>{option.label}</span>
          <span className="text-sm text-gray-500">{option.category}</span>
        </div>
      )}
      getOptionValue={(option) => option.id}
      getOptionLabel={(option) => option.label}
    />
  );
};
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | - | Input value |
| onChange | `(value: string) => void` | - | Change handler |
| options | `T[]` | `[]` | Available options |
| label | `string` | - | Field label |
| onSelect | `(option: T) => void` | - | Selection handler |
| renderOption | `(option: T) => ReactNode` | - | Custom render function |
| getOptionValue | `(option: T) => string` | - | Value getter |
| getOptionLabel | `(option: T) => string` | - | Label getter |
| loading | `boolean` | `false` | Loading state |
| disabled | `boolean` | `false` | Disabled state |
| error | `string` | - | Error message |
| placeholder | `string` | - | Placeholder text |

## Accessibility

Ensuring the Combobox component is accessible to all users.

### Keyboard Navigation

How users can interact with the combobox:

- Up/Down arrows to navigate options
- Enter to select
- Escape to close dropdown
- Tab to move focus
- Type to filter options

### Screen Readers

How the component communicates with assistive technologies:

- Option announcements
- Selection state
- Loading state
- Error messages
- List navigation

### Best Practices

Guidelines for maintaining accessibility:

- Clear labeling
- ARIA attributes
- Focus management
- Keyboard support
- Error handling

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual combobox functionality:

```tsx
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from '@/components/form';
import '@testing-library/jest-dom';

describe('Combobox', () => {
  const mockOnChange = jest.fn();
  const mockOnSelect = jest.fn();
  const options = ['Apple', 'Banana', 'Orange'];

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnSelect.mockClear();
  });

  it('renders correctly', () => {
    render(
      <Combobox
        label="Test Combobox"
        value=""
        onChange={mockOnChange}
        options={options}
      />
    );
    expect(screen.getByLabelText('Test Combobox')).toBeInTheDocument();
  });

  it('shows options on focus', async () => {
    render(
      <Combobox
        label="Test Combobox"
        value=""
        onChange={mockOnChange}
        options={options}
      />
    );
    
    await userEvent.click(screen.getByRole('combobox'));
    options.forEach(option => {
      expect(screen.getByText(option)).toBeVisible();
    });
  });

  it('filters options on type', async () => {
    render(
      <Combobox
        label="Test Combobox"
        value=""
        onChange={mockOnChange}
        options={options}
      />
    );
    
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'app');
    
    expect(screen.getByText('Apple')).toBeVisible();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });
});
```

### Integration Tests

Testing combobox behavior in forms:

```tsx
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Combobox } from '@/components/form';
import '@testing-library/jest-dom';

describe('Combobox Integration', () => {
  it('works with form validation', async () => {
    render(
      <Form onSubmit={jest.fn()}>
        <Combobox
          label="Required Field"
          value=""
          onChange={() => {}}
          options={[]}
          required
        />
      </Form>
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
});
```