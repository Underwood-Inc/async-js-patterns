---
title: DataGrid Component
description: Advanced grid component for displaying and managing tabular data with sorting, filtering, and selection
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Grid
  - Table
  - React
---

# DataGrid Component

## Overview

The DataGrid component provides a powerful interface for displaying and interacting with tabular data. It supports features like sorting, filtering, row selection, and custom cell rendering.

## Usage

### Basic DataGrid

::: code-with-tooltips

```tsx
import { DataGrid } from '@/components/data';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name' },
  { field: 'age', headerName: 'Age', type: 'number' },
  { 
    field: 'status',
    headerName: 'Status',
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

<DataGrid
  columns={columns}
  rows={rows}
  onRowClick={(row) => console.log('Clicked row:', row)}
/>
```

:::

### API Reference

```tsx
interface DataGridColumn<T = any> {
  /** Unique field identifier */
  field: string;
  /** Column header text */
  headerName: string;
  /** Data type */
  type?: 'string' | 'number' | 'date' | 'boolean';
  /** Column width */
  width?: number;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Whether column is filterable */
  filterable?: boolean;
  /** Custom cell renderer */
  renderCell?: (params: DataGridCellParams<T>) => React.ReactNode;
  /** Custom header renderer */
  renderHeader?: (params: DataGridHeaderParams) => React.ReactNode;
  /** Value formatter */
  valueFormatter?: (value: any) => string;
  /** Value getter */
  valueGetter?: (params: DataGridValueGetterParams<T>) => any;
}

interface DataGridProps<T = any> {
  /** Grid columns */
  columns: DataGridColumn<T>[];
  /** Grid rows */
  rows: T[];
  /** Whether to show row selection */
  checkboxSelection?: boolean;
  /** Selected row IDs */
  selectedRows?: (string | number)[];
  /** Selection change handler */
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Sort model */
  sortModel?: DataGridSortModel;
  /** Sort change handler */
  onSortChange?: (model: DataGridSortModel) => void;
  /** Filter model */
  filterModel?: DataGridFilterModel;
  /** Filter change handler */
  onFilterChange?: (model: DataGridFilterModel) => void;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Selection and Sorting

::: code-with-tooltips

```tsx
const [selectedIds, setSelectedIds] = useState<number[]>([]);
const [sortModel, setSortModel] = useState<DataGridSortModel>([
  { field: 'name', sort: 'asc' }
]);

<DataGrid
  columns={columns}
  rows={rows}
  checkboxSelection
  selectedRows={selectedIds}
  onSelectionChange={setSelectedIds}
  sortModel={sortModel}
  onSortChange={setSortModel}
/>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const DataGrid = React.forwardRef<HTMLDivElement, DataGridProps>(({
  columns,
  rows,
  checkboxSelection = false,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  sortModel,
  onSortChange,
  filterModel,
  onFilterChange,
  loading = false,
  className,
  ...props
}, ref) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState(
    new Set(selectedRows)
  );
  const [internalSortModel, setInternalSortModel] = useState(sortModel);
  
  const handleHeaderClick = useCallback((column: DataGridColumn) => {
    if (!column.sortable) return;
    
    const newModel = updateSortModel(internalSortModel, column.field);
    setInternalSortModel(newModel);
    onSortChange?.(newModel);
  }, [internalSortModel, onSortChange]);
  
  const handleRowSelect = useCallback((rowId: string | number) => {
    const newSelected = new Set(internalSelectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    
    setInternalSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  }, [internalSelectedRows, onSelectionChange]);
  
  const sortedRows = useMemo(() => {
    if (!internalSortModel?.length) return rows;
    return sortRows(rows, internalSortModel);
  }, [rows, internalSortModel]);
  
  return (
    <div
      ref={ref}
      className={clsx('data-grid', className)}
      {...props}
    >
      <div className="data-grid__header">
        {checkboxSelection && (
          <div className="data-grid__cell data-grid__cell--checkbox">
            <input
              type="checkbox"
              checked={internalSelectedRows.size === rows.length}
              onChange={() => handleSelectAll()}
            />
          </div>
        )}
        {columns.map(column => (
          <div
            key={column.field}
            className={clsx(
              'data-grid__cell',
              'data-grid__header-cell',
              {
                'data-grid__header-cell--sortable': column.sortable,
                'data-grid__header-cell--sorted': isSorted(column.field)
              }
            )}
            style={{ width: column.width }}
            onClick={() => handleHeaderClick(column)}
          >
            {column.renderHeader?.(column) ?? column.headerName}
            {column.sortable && (
              <SortIcon
                direction={getSortDirection(column.field)}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="data-grid__body">
        {loading ? (
          <div className="data-grid__loading">
            <Spinner />
          </div>
        ) : (
          sortedRows.map(row => (
            <div
              key={row.id}
              className="data-grid__row"
              onClick={() => onRowClick?.(row)}
            >
              {checkboxSelection && (
                <div className="data-grid__cell data-grid__cell--checkbox">
                  <input
                    type="checkbox"
                    checked={internalSelectedRows.has(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </div>
              )}
              {columns.map(column => (
                <div
                  key={column.field}
                  className="data-grid__cell"
                  style={{ width: column.width }}
                >
                  {column.renderCell?.({
                    row,
                    value: getValue(row, column),
                    field: column.field
                  }) ?? getValue(row, column)}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
});
```

:::

## Styling

### Base Styles

::: code-with-tooltips

```scss
.data-grid {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  
  // Header styles
  &__header {
    display: flex;
    background: var(--surface-background-alt);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  &__header-cell {
    font-weight: 600;
    user-select: none;
    
    &--sortable {
      cursor: pointer;
      
      &:hover {
        background: var(--surface-hover);
      }
    }
    
    &--sorted {
      background: var(--surface-selected);
    }
  }
  
  // Cell styles
  &__cell {
    padding: var(--spacing-md);
    min-width: 100px;
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    
    &--checkbox {
      flex: 0 0 48px;
      min-width: 48px;
      justify-content: center;
    }
  }
  
  // Row styles
  &__row {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    transition: background 0.2s;
    
    &:hover {
      background: var(--surface-hover);
    }
    
    &--selected {
      background: var(--surface-selected);
    }
  }
  
  // Loading state
  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
  }
  
  // Empty state
  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    color: var(--text-secondary);
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { DataGrid } from './DataGrid';

describe('DataGrid', () => {
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', sortable: true }
  ];
  
  const rows = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ];

  it('renders columns and rows', () => {
    render(<DataGrid columns={columns} rows={rows} />);
    
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('handles row selection', () => {
    const handleSelectionChange = jest.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        checkboxSelection
        onSelectionChange={handleSelectionChange}
      />
    );
    
    fireEvent.click(screen.getAllByRole('checkbox')[1]);
    expect(handleSelectionChange).toHaveBeenCalledWith([1]);
  });

  it('handles sorting', () => {
    const handleSortChange = jest.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        onSortChange={handleSortChange}
      />
    );
    
    fireEvent.click(screen.getByText('Name'));
    expect(handleSortChange).toHaveBeenCalledWith([
      { field: 'name', sort: 'asc' }
    ]);
  });
});
```

:::

## Accessibility

### ARIA Attributes

::: code-with-tooltips

```tsx
const DataGrid = React.forwardRef<HTMLDivElement, DataGridProps>(({
  // ... other props
}, ref) => {
  return (
    <div
      ref={ref}
      role="grid"
      aria-busy={loading}
      aria-colcount={columns.length}
      aria-rowcount={rows.length + 1} // Including header
    >
      <div role="rowgroup">
        <div role="row">
          {columns.map(column => (
            <div
              role="columnheader"
              aria-sort={getSortDirection(column.field)}
              aria-label={column.headerName}
            >
              {/* ... */}
            </div>
          ))}
        </div>
      </div>
      <div role="rowgroup">
        {rows.map(row => (
          <div
            role="row"
            aria-selected={isSelected(row.id)}
          >
            {/* ... */}
          </div>
        ))}
      </div>
    </div>
  );
});
```

:::

## Best Practices

### Usage Guidelines

::: code-with-tooltips

```tsx
// DO: Use appropriate column widths
const columns = [
  { field: 'id', width: 80 }, // Narrow for IDs
  { field: 'name', minWidth: 200 }, // Wider for names
  { field: 'description', flex: 1 } // Flexible for content
];

// DON'T: Mix data types in columns
const badColumns = [
  {
    field: 'status',
    type: 'string',
    renderCell: (params) => (
      params.value === true ? 'Yes' : 'No' // Inconsistent types!
    )
  }
];

// DO: Handle loading and empty states
<DataGrid
  loading={isLoading}
  rows={rows}
  emptyContent={
    <EmptyState
      icon="table"
      message="No data available"
    />
  }
/>

// DON'T: Use complex inline renderers
<DataGrid
  columns={[{
    field: 'actions',
    renderCell: (params) => (
      <ComplexComponent // Move to separate component
        data={params.row}
        onAction={handleAction}
      />
    )
  }]}
/>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize column definitions
const DataGridWrapper = ({ data }) => {
  const columns = useMemo(() => [
    {
      field: 'name',
      renderCell: useCallback((params) => (
        <UserCell user={params.row} />
      ), [])
    }
  ], []);
  
  return <DataGrid columns={columns} rows={data} />;
};

// DON'T: Create new sort functions inline
<DataGrid
  sortComparator={(a, b) => a.localeCompare(b)} // Creates new function every render
/>

// DO: Use virtualization for large datasets
<DataGrid
  rows={largeDataset}
  virtualization={{
    enabled: true,
    rowHeight: 52,
    overscan: 5
  }}
/>
```

:::
