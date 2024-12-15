---
title: Table Component
description: Feature-rich data table component with sorting, filtering, and pagination
category: Data
subcategory: Tables
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - Table
  - React
---

# Table Component

## Overview

The Table component provides a powerful way to display and interact with tabular data. It supports sorting, filtering, pagination, and row selection.

## Key Features

- Column sorting and filtering
- Row selection
- Pagination support
- Custom cell rendering
- Keyboard navigation
- Responsive layout
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface TableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Column header text */
  title: string;
  /** Custom render function */
  render?: (_value: unknown, _row: T) => ReactNode;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Column width */
  width?: number | string;
  /** Column filter configuration */
  filter?: {
    type: 'text' | 'number' | 'select';
    operators?: string[];
    options?: { label: string; value: unknown }[];
  };
}

export interface TableProps<T> {
  /** Data array */
  data: T[];
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Row click handler */
  onRowClick?: (_row: T) => void;
  /** Selected rows */
  selectedRows?: T[];
  /** Selection change handler */
  onSelectionChange?: (_rows: T[]) => void;
  /** Whether to show pagination */
  pagination?: boolean;
  /** Items per page */
  pageSize?: number;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Empty state message */
  emptyMessage?: string;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | Data array |
| `columns` | `TableColumn<T>[]` | - | Column definitions |
| `onRowClick` | `function` | - | Row click handler |
| `selectedRows` | `T[]` | `[]` | Selected rows |
| `onSelectionChange` | `function` | - | Selection change handler |
| `pagination` | `boolean` | `false` | Whether to show pagination |
| `pageSize` | `number` | `10` | Items per page |
| `loading` | `boolean` | `false` | Loading state |
| `error` | `string` | - | Error state |
| `emptyMessage` | `string` | `'No data'` | Empty state message |

## Usage

::: code-with-tooltips
```tsx
import { Table } from '@/components/data';
import { useState } from 'react';

export const TableExample = () => {
  const [selectedRows, setSelectedRows] = useState<Record<string, unknown>[]>([]);

  const data = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
  ];

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'age', title: 'Age', sortable: true },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      pagination
      pageSize={10}
    />
  );
};
```
:::

## Examples

### Basic Table

::: code-with-tooltips
```tsx
import { Table } from '@/components/data';

export const BasicTableExample = () => {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
  ];

  return (
    <Table
      data={data}
      columns={columns}
    />
  );
};
```
:::

### With Sorting and Filtering

::: code-with-tooltips
```tsx
import { Table } from '@/components/data';
import { UserName } from '@/components/user';

export const SortableTableExample = () => {
  const data = [
    { id: 1, name: 'John Doe', age: 30, role: 'Admin' },
    { id: 2, name: 'Jane Smith', age: 25, role: 'User' },
  ];

  const columns = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value) => <UserName>{value as string}</UserName>,
      filter: {
        type: 'text'
      }
    },
    {
      key: 'age',
      title: 'Age',
      sortable: true,
      filter: {
        type: 'number',
        operators: ['equals', 'greaterThan', 'lessThan']
      }
    },
    {
      key: 'role',
      title: 'Role',
      filter: {
        type: 'select',
        options: [
          { label: 'Admin', value: 'Admin' },
          { label: 'User', value: 'User' }
        ]
      }
    }
  ];

  return (
    <Table
      data={data}
      columns={columns}
      defaultSort={{ key: 'name', direction: 'asc' }}
    />
  );
};
```
:::

### With Selection and Pagination

::: code-with-tooltips
```tsx
import { Table } from '@/components/data';
import { useState } from 'react';

export const SelectableTableExample = () => {
  const [selectedRows, setSelectedRows] = useState<Record<string, unknown>[]>([]);

  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    status: i % 2 === 0 ? 'Active' : 'Inactive'
  }));

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'status', title: 'Status' }
  ];

  return (
    <Table
      data={data}
      columns={columns}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
      pagination
      pageSize={10}
    />
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Data Structure**
   - Keep data consistent
   - Handle empty states
   - Validate data types
   - Consider performance

2. **Interaction**
   - Use clear sorting indicators
   - Provide filter feedback
   - Support keyboard navigation
   - Handle large datasets

3. **Visual Design**
   - Maintain consistent spacing
   - Use clear typography
   - Show loading states
   - Handle overflow

### Accessibility

1. **ARIA Attributes**
   - Use proper table roles
   - Label interactive elements
   - Announce sort changes
   - Handle focus management

2. **Keyboard Navigation**
   - Support arrow keys
   - Enable cell focusing
   - Handle selection
   - Support shortcuts

3. **Screen Readers**
   - Announce state changes
   - Provide context
   - Label columns
   - Handle updates

### Performance

1. **Rendering**
   - Virtualize large tables
   - Optimize sorting
   - Handle filtering
   - Manage updates

2. **State Management**
   - Handle selection efficiently
   - Manage sort state
   - Cache filter results
   - Clean up listeners

## Related Components

- [DataGrid](./data-grid.md) - For complex data grids
- [TreeTable](./tree-table.md) - For hierarchical data
- [List](../lists-and-cards/list.md) - For simpler data display
- [Card](../lists-and-cards/card.md) - For grid-based layouts
