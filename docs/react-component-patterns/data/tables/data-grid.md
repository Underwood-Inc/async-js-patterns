---
title: DataGrid Component
description: Advanced grid component for displaying and managing tabular data with sorting, filtering, and selection
category: Data
subcategory: Tables
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - Grid
  - Table
  - React
---

# DataGrid Component

## Overview

The DataGrid component provides a powerful interface for displaying and interacting with tabular data. It extends the basic Table component with advanced features like virtualization, complex sorting, filtering, and custom cell rendering.

## Key Features

- Virtual scrolling for large datasets
- Multi-column sorting
- Advanced filtering
- Row selection and bulk actions
- Custom cell and header rendering
- Column resizing and reordering
- Keyboard navigation
- Excel-like features

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface DataGridColumn<T = unknown> {
  /** Unique field identifier */
  field: string;
  /** Column header text */
  headerName: string;
  /** Custom cell renderer */
  renderCell?: (_params: DataGridCellParams<T>) => ReactNode;
  /** Custom header renderer */
  renderHeader?: (_params: DataGridHeaderParams) => ReactNode;
  /** Value formatter */
  valueFormatter?: (_value: unknown) => string;
  /** Value getter */
  valueGetter?: (_params: DataGridValueGetterParams<T>) => unknown;
  /** Column alignment */
  align?: 'left' | 'center' | 'right';
  /** Whether column is pinned */
  pinned?: 'left' | 'right';
}

export interface DataGridProps<T = unknown> {
  /** Grid columns */
  columns: DataGridColumn<T>[];
  /** Grid rows */
  rows: T[];
  /** Whether to show row selection */
  checkboxSelection?: boolean;
  /** Selected row IDs */
  selectedRows?: (string | number)[];
  /** Selection change handler */
  onSelectionChange?: (_ids: (string | number)[]) => void;
  /** Row click handler */
  onRowClick?: (_row: T) => void;
  /** Sort model */
  sortModel?: DataGridSortModel;
  /** Sort change handler */
  onSortChange?: (_model: DataGridSortModel) => void;
  /** Filter model */
  filterModel?: DataGridFilterModel;
  /** Filter change handler */
  onFilterChange?: (_model: DataGridFilterModel) => void;
  /** Loading state */
  loading?: boolean;
  /** Row height */
  rowHeight?: number;
  /** Header height */
  headerHeight?: number;
  /** Whether to enable column resizing */
  resizable?: boolean;
  /** Whether to enable column reordering */
  reorderable?: boolean;
  /** Whether to enable virtual scrolling */
  virtual?: boolean;
  /** Additional CSS class */
  className?: string;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | DataGridColumn[] | - | Grid column definitions |
| `rows` | T[] | - | Grid data rows |
| `checkboxSelection` | boolean | false | Enable row selection |
| `selectedRows` | (string \| number)[] | [] | Selected row IDs |
| `onSelectionChange` | function | - | Selection change handler |
| `onRowClick` | function | - | Row click handler |
| `sortModel` | DataGridSortModel | - | Sort configuration |
| `onSortChange` | function | - | Sort change handler |
| `filterModel` | DataGridFilterModel | - | Filter configuration |
| `onFilterChange` | function | - | Filter change handler |
| `loading` | boolean | false | Loading state |
| `rowHeight` | number | 52 | Row height in pixels |
| `headerHeight` | number | 56 | Header height in pixels |
| `resizable` | boolean | false | Enable column resizing |
| `reorderable` | boolean | false | Enable column reordering |
| `virtual` | boolean | false | Enable virtual scrolling |

## Usage

### Basic DataGrid

::: code-with-tooltips
```tsx
import { DataGrid } from '@/components/data';

export const BasicDataGridExample = () => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'age', headerName: 'Age', type: 'number', width: 90 },
    { 
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Badge color={params.value === 'active' ? 'success' : 'error'}>
          {params.value}
        </Badge>
      )
    }
  ];

  const rows = [
    { id: 1, name: 'John Doe', age: 30, status: 'active' },
    { id: 2, name: 'Jane Smith', age: 25, status: 'inactive' }
  ];

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      onRowClick={(row) => console.log('Clicked row:', row)}
    />
  );
};
```
:::

### Advanced Features

::: code-with-tooltips
```tsx
import { DataGrid } from '@/components/data';
import { useState } from 'react';

export const AdvancedDataGridExample = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortModel, setSortModel] = useState<DataGridSortModel>([
    { field: 'name', sort: 'asc' }
  ]);
  const [filterModel, setFilterModel] = useState<DataGridFilterModel>({
    items: []
  });

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID',
      width: 70,
      pinned: 'left'
    },
    { 
      field: 'name',
      headerName: 'Name',
      width: 130,
      sortable: true,
      filterable: true
    },
    { 
      field: 'email',
      headerName: 'Email',
      width: 200,
      sortable: true,
      filterable: true
    },
    { 
      field: 'role',
      headerName: 'Role',
      width: 120,
      type: 'singleSelect',
      valueOptions: ['Admin', 'User', 'Guest']
    },
    { 
      field: 'lastLogin',
      headerName: 'Last Login',
      type: 'date',
      width: 160,
      valueFormatter: (value) => 
        new Date(value as string).toLocaleDateString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ButtonGroup>
          <IconButton
            icon="edit"
            onClick={() => handleEdit(params.row)}
          />
          <IconButton
            icon="delete"
            onClick={() => handleDelete(params.row)}
          />
        </ButtonGroup>
      )
    }
  ];

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      checkboxSelection
      selectedRows={selectedIds}
      onSelectionChange={setSelectedIds}
      sortModel={sortModel}
      onSortChange={setSortModel}
      filterModel={filterModel}
      onFilterChange={setFilterModel}
      resizable
      reorderable
      virtual
      rowHeight={52}
      headerHeight={56}
    />
  );
};
```
:::

### With Server-Side Operations

::: code-with-tooltips
```tsx
import { DataGrid } from '@/components/data';
import { useState, useEffect } from 'react';

export const ServerSideDataGridExample = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GridRow[]>([]);
  const [sortModel, setSortModel] = useState<DataGridSortModel>([]);
  const [filterModel, setFilterModel] = useState<DataGridFilterModel>({
    items: []
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/data', {
          method: 'POST',
          body: JSON.stringify({
            sort: sortModel,
            filter: filterModel,
            pagination: paginationModel
          })
        });
        const json = await response.json();
        setData(json.rows);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortModel, filterModel, paginationModel]);

  return (
    <DataGrid
      columns={columns}
      rows={data}
      loading={loading}
      sortModel={sortModel}
      onSortChange={setSortModel}
      filterModel={filterModel}
      onFilterChange={setFilterModel}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      virtual
    />
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Data Management**
   - Use virtual scrolling for large datasets
   - Implement server-side operations
   - Handle data updates efficiently
   - Cache results appropriately

2. **Column Configuration**
   - Set appropriate column widths
   - Configure sorting/filtering logically
   - Use column pinning sparingly
   - Group related columns

3. **User Experience**
   - Provide clear loading states
   - Handle errors gracefully
   - Show helpful empty states
   - Maintain responsive layout

### Accessibility

1. **Keyboard Navigation**
   - Support arrow key navigation
   - Enable cell selection
   - Handle keyboard shortcuts
   - Maintain focus management

2. **Screen Readers**
   - Use proper ARIA attributes
   - Announce state changes
   - Provide context information
   - Handle dynamic updates

3. **Visual Accessibility**
   - Maintain sufficient contrast
   - Support text scaling
   - Handle high contrast mode
   - Consider color blindness

### Performance

1. **Rendering Optimization**
   - Use virtualization
   - Implement row/cell memoization
   - Optimize sorting/filtering
   - Handle large datasets

2. **State Management**
   - Batch state updates
   - Optimize re-renders
   - Handle selection efficiently
   - Clean up event listeners

3. **Data Operations**
   - Use server-side operations
   - Implement data caching
   - Handle real-time updates
   - Optimize data transformations

## Related Components

- [Table](./table.md) - For simpler data display needs
- [TreeTable](./tree-table.md) - For hierarchical data display
- [List](../lists-and-cards/list.md) - For basic list display
- [VirtualList](../lists-and-cards/virtual-list.md) - For virtualized lists
