---
title: Dropdown Component
description: Selection menu for choosing from a list of options
category: Overlay
subcategory: Contextual Overlays
date: 2024-12-01
author: Underwood Inc
status: Stable
tags:
  - Overlay
  - Dropdown
  - React
---

# Dropdown Component

## Overview

The Dropdown component displays a menu of options when clicked, allowing users to make a selection. It's ideal for forms, navigation, and any interface that requires choosing from a list of options.

## Key Features

- Single and multiple selection
- Search/filter functionality
- Option grouping
- Custom option rendering
- Keyboard navigation
- Virtual scrolling
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode, CSSProperties } from 'react';

export interface DropdownProps<T> {
  /** Selected value(s) */
  value: T | T[];
  /** Available options */
  options: DropdownOption<T>[];
  /** Change handler */
  onChange: (value: T | T[]) => void;
  /** Whether multiple selection is allowed */
  multiple?: boolean;
  /** Whether to show search input */
  searchable?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Whether dropdown is disabled */
  disabled?: boolean;
  /** Custom option render function */
  renderOption?: (option: DropdownOption<T>) => ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
}

export interface DropdownOption<T> {
  /** Option value */
  value: T;
  /** Option label */
  label: string;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Option group */
  group?: string;
  /** Custom option data */
  data?: Record<string, unknown>;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T \| T[]` | - | Selected value(s) |
| `options` | `DropdownOption<T>[]` | - | Available options |
| `onChange` | `function` | - | Change handler |
| `multiple` | `boolean` | `false` | Whether multiple selection is allowed |
| `searchable` | `boolean` | `false` | Whether to show search input |
| `placeholder` | `string` | 'Select...' | Placeholder text |
| `disabled` | `boolean` | `false` | Whether dropdown is disabled |
| `renderOption` | `function` | - | Custom option render function |
| `className` | `string` | - | Additional CSS class |
| `style` | `object` | - | Additional CSS styles |

## Usage

```tsx
import { Dropdown } from '@underwood/components';
import { useState } from 'react';

export const DropdownExample = () => {
  const [value, setValue] = useState<string>('');
  
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' }
  ];

  return (
    <Dropdown<string>
      value={value}
      options={options}
      onChange={setValue}
      placeholder="Select a fruit"
    />
  );
};
```

## Examples

### Basic Dropdown

```tsx
import { Dropdown } from '@underwood/components';
import { useState } from 'react';

export const BasicDropdownExample = () => {
  const [value, setValue] = useState<string>('');
  
  const options = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  return (
    <Dropdown<string>
      value={value}
      options={options}
      onChange={setValue}
      placeholder="Select status"
    />
  );
};
```

### Multiple Selection

```tsx
import { Dropdown } from '@underwood/components';
import { useState } from 'react';

export const MultipleDropdownExample = () => {
  const [values, setValues] = useState<string[]>([]);
  
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' }
  ];

  return (
    <Dropdown<string>
      value={values}
      options={options}
      onChange={setValues}
      multiple
      placeholder="Select frameworks"
    />
  );
};
```

### With Groups and Search

```tsx
import { Dropdown } from '@underwood/components';
import { useState } from 'react';

export const GroupedDropdownExample = () => {
  const [value, setValue] = useState<string>('');
  
  const options = [
    { value: 'react', label: 'React', group: 'Frontend' },
    { value: 'vue', label: 'Vue', group: 'Frontend' },
    { value: 'node', label: 'Node.js', group: 'Backend' },
    { value: 'python', label: 'Python', group: 'Backend' }
  ];

  return (
    <Dropdown<string>
      value={value}
      options={options}
      onChange={setValue}
      searchable
      placeholder="Select technology"
    />
  );
};
```

## Best Practices

### Usage Guidelines

1. **Option Organization**
   - Group related options
   - Order logically
   - Use clear labels
   - Handle long lists

2. **Selection Behavior**
   - Clear selection feedback
   - Handle empty states
   - Support deselection
   - Consider default values

3. **Search Implementation**
   - Optimize search performance
   - Handle no results
   - Show loading states
   - Consider fuzzy matching

### Accessibility

1. **ARIA Attributes**
   - Use `role="listbox"` appropriately
   - Set proper aria-expanded
   - Include descriptive labels
   - Handle selection state

2. **Keyboard Navigation**
   - Support arrow keys
   - Enable type-to-select
   - Handle Enter/Space
   - Support Escape key

3. **Screen Readers**
   - Announce selection changes
   - Describe current value
   - Handle group labels
   - Provide search context

### Performance

1. **Rendering**
   - Implement virtual scrolling
   - Optimize option rendering
   - Handle large datasets
   - Clean up listeners

2. **State Management**
   - Handle selection efficiently
   - Manage search state
   - Clean up on unmount
   - Optimize re-renders

## Related Components

- [Select](/react-component-patterns/form/select.md) - For simple selection
- [Combobox](/react-component-patterns/form/combobox.md) - For searchable selection
- [Menu](/react-component-patterns/navigation/menu.md) - For navigation menus
- [Popover](/react-component-patterns/overlay/contextual-overlays/popover.md) - For custom content
