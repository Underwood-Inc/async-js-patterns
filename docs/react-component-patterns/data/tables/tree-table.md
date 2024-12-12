---
title: TreeTable Component
description: Component for displaying hierarchical data in a table format with expandable rows
category: Data
subcategory: Tables
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - Table
  - Tree
  - React
---

# TreeTable Component

## Overview

The TreeTable component combines table functionality with hierarchical data display. It extends the Table component to support nested data structures with features like row expansion, collapsing, and level-based rendering.

## Key Features

- Hierarchical data display
- Row expansion/collapse
- Level-based indentation
- Custom expansion controls
- Sorting and filtering
- Keyboard navigation
- Accessibility support
- Performance optimized

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface TreeTableColumn<T = unknown> {
  /** Unique column key */
  key: string;
  /** Column header text */
  title: string;
  /** Custom render function */
  render?: (
    _value: unknown,
    _row: T,
    _meta: { level: number; expanded: boolean }
  ) => ReactNode;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Column width */
  width?: number | string;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether column is filterable */
  filterable?: boolean;
}

export interface TreeTableProps<T = unknown> {
  /** Table data */
  data: T[];
  /** Column definitions */
  columns: TreeTableColumn<T>[];
  /** Default expanded row IDs */
  defaultExpandedIds?: (string | number)[];
  /** Controlled expanded row IDs */
  expandedIds?: (string | number)[];
  /** Expansion change handler */
  onExpandedChange?: (_ids: (string | number)[]) => void;
  /** Row key getter */
  getRowKey?: (_row: T) => string | number;
  /** Children key in data */
  childrenKey?: string;
  /** Whether to show loading state */
  loading?: boolean;
  /** Whether to show grid lines */
  gridLines?: boolean;
  /** Whether to enable hover state */
  hover?: boolean;
  /** Whether to enable selection */
  selectable?: boolean;
  /** Selected row IDs */
  selectedIds?: (string | number)[];
  /** Selection change handler */
  onSelectionChange?: (_ids: (string | number)[]) => void;
  /** Additional CSS class */
  className?: string;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | T[] | - | Table data with hierarchy |
| `columns` | TreeTableColumn[] | - | Column definitions |
| `defaultExpandedIds` | (string \| number)[] | [] | Initially expanded rows |
| `expandedIds` | (string \| number)[] | - | Controlled expanded state |
| `onExpandedChange` | function | - | Expansion change handler |
| `getRowKey` | function | row => row.id | Row key extractor |
| `childrenKey` | string | 'children' | Children property name |
| `loading` | boolean | false | Loading state |
| `gridLines` | boolean | true | Show grid lines |
| `hover` | boolean | true | Enable hover state |
| `selectable` | boolean | false | Enable selection |
| `selectedIds` | (string \| number)[] | [] | Selected row IDs |
| `onSelectionChange` | function | - | Selection change handler |

## Usage

### Basic TreeTable

::: code-with-tooltips
```tsx
import { TreeTable } from '@/components/data';

export const BasicTreeTableExample = () => {
  const data = [
    {
      id: 1,
      name: 'Parent 1',
      type: 'Folder',
      children: [
        { id: 2, name: 'Child 1.1', type: 'File' },
        { id: 3, name: 'Child 1.2', type: 'File' }
      ]
    },
    {
      id: 4,
      name: 'Parent 2',
      type: 'Folder',
      children: [
        { id: 5, name: 'Child 2.1', type: 'File' }
      ]
    }
  ];

  const columns = [
    { 
      key: 'name',
      title: 'Name',
      render: (value, row, { level }) => (
        <div style={{ paddingLeft: level * 20 }}>
          {value}
        </div>
      )
    },
    {
      key: 'type',
      title: 'Type'
    }
  ];

  return (
    <TreeTable
      data={data}
      columns={columns}
      defaultExpandedIds={[1]}
    />
  );
};
```
:::

### With Custom Expansion Control

::: code-with-tooltips
```tsx
import { TreeTable } from '@/components/data';
import { Icon } from '@/components/core';

export const CustomExpansionExample = () => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (value, row, { level, expanded }) => (
        <div style={{ paddingLeft: level * 20 }}>
          {row.children?.length > 0 && (
            <Icon
              name={expanded ? 'chevron-down' : 'chevron-right'}
              onClick={() => toggleExpand(row.id)}
              className="cursor-pointer mr-2"
            />
          )}
          <Icon name={row.children?.length ? 'folder' : 'file'} />
          <span className="ml-2">{value}</span>
        </div>
      )
    },
    {
      key: 'modified',
      title: 'Last Modified',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'size',
      title: 'Size',
      align: 'right',
      render: (value) => formatBytes(value)
    }
  ];

  return (
    <TreeTable
      data={data}
      columns={columns}
      expandedIds={expandedIds}
      onExpandedChange={setExpandedIds}
      hover
      gridLines
    />
  );
};
```
:::

### With Selection and Loading

::: code-with-tooltips
```tsx
import { TreeTable } from '@/components/data';
import { useState, useEffect } from 'react';

export const SelectableTreeTableExample = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tree-data');
        const json = await response.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <TreeTable
      data={data}
      columns={columns}
      loading={loading}
      selectable
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      expandedIds={expandedIds}
      onExpandedChange={setExpandedIds}
      hover
      gridLines
    />
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Data Structure**
   - Use consistent hierarchy
   - Limit nesting depth
   - Handle circular references
   - Validate data integrity

2. **Expansion Control**
   - Provide clear indicators
   - Support keyboard control
   - Handle large datasets
   - Remember expanded state

3. **Visual Hierarchy**
   - Use consistent indentation
   - Show clear parent-child
   - Handle long content
   - Support responsive layout

### Accessibility

1. **Keyboard Navigation**
   - Support arrow keys
   - Enable expand/collapse
   - Handle selection
   - Maintain focus state

2. **Screen Readers**
   - Announce hierarchy
   - Indicate expanded state
   - Provide row context
   - Support navigation

3. **Visual Indicators**
   - Clear expansion state
   - Sufficient contrast
   - Focus indicators
   - Selection feedback

### Performance

1. **Data Management**
   - Optimize tree traversal
   - Cache expanded state
   - Handle large datasets
   - Implement virtualization

2. **Rendering**
   - Minimize re-renders
   - Optimize expansion
   - Handle deep nesting
   - Clean up listeners

3. **State Updates**
   - Batch operations
   - Optimize selection
   - Handle expansion
   - Manage memory

## Related Components

- [Table](./table.md) - For flat data structures
- [DataGrid](./data-grid.md) - For advanced data features
- [Tree](../navigation/tree.md) - For pure tree navigation
- [List](../lists-and-cards/list.md) - For simple data display
