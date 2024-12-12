---
title: Table Component
description: Feature-rich data table component with sorting, filtering, and pagination
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Table
  - React
---

# Table Component

## Overview

The Table component provides a powerful way to display and interact with tabular data. It supports sorting, filtering, pagination, and row selection.

## Usage

### Basic Table

::: code-with-tooltips

```tsx
import { Table } from '@/components/data';

const data = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Smith', age: 25 },
];

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'age', title: 'Age' },
];

<Table
  data={data}
  columns={columns}
  onRowClick={(row) => console.log('clicked:', row)}
/>
```

:::

### API Reference

```tsx
interface TableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Column header text */
  title: string;
  /** Custom render function */
  render?: (value: any, row: T) => React.ReactNode;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Column width */
  width?: number | string;
}

interface TableProps<T> {
  /** Data array */
  data: T[];
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Selected rows */
  selectedRows?: T[];
  /** Selection change handler */
  onSelectionChange?: (rows: T[]) => void;
  /** Whether to show pagination */
  pagination?: boolean;
  /** Items per page */
  pageSize?: number;
}
```

### Examples

#### With Sorting and Filtering

::: code-with-tooltips

```tsx
<Table
  data={data}
  columns={[
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value) => <UserName>{value}</UserName>
    },
    {
      key: 'age',
      title: 'Age',
      sortable: true,
      filter: {
        type: 'number',
        operators: ['equals', 'greaterThan', 'lessThan']
      }
    }
  ]}
  defaultSort={{ key: 'name', direction: 'asc' }}
/>
```

:::

## Best Practices

- Use consistent column widths
- Implement proper loading states
- Handle empty states gracefully
- Support keyboard navigation
- Optimize for large datasets

## Accessibility

- Use semantic table markup
- Support keyboard navigation
- Provide sort indicators
- Include proper ARIA attributes
- Handle focus management

## Implementation

::: code-with-tooltips

```tsx
export const Table = <T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  pagination = false,
  pageSize = 10,
}: TableProps<T>) => {
  return (
    <div className="table-container">
      <table role="grid">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key} role="columnheader">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              role="row"
            >
              {columns.map(column => (
                <td key={column.key} role="gridcell">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

:::

## Related Components

- [DataGrid](./data-grid.md)
- [List](./list.md)
- [Pagination](../navigation/pagination.md)
