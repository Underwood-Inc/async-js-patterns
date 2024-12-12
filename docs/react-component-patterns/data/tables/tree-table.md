---
title: TreeTable Component
description: Component for displaying hierarchical data in a table format with expandable rows
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Table
  - Tree
  - React
---

# TreeTable Component

## Overview

The TreeTable component combines table functionality with hierarchical data display. It supports row expansion, nested data, sorting, and customizable rendering.

## Usage

### Basic TreeTable

::: code-with-tooltips

```tsx
import { TreeTable } from '@/components/data';

const data = [
  {
    id: 1,
    name: 'Parent 1',
    children: [
      { id: 2, name: 'Child 1.1' },
      { id: 3, name: 'Child 1.2' }
    ]
  },
  {
    id: 4,
    name: 'Parent 2',
    children: [
      { id: 5, name: 'Child 2.1' }
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
  }
];

<TreeTable
  data={data}
  columns={columns}
  defaultExpandedIds={[1]}
/>
```

:::

### API Reference

```tsx
interface TreeTableColumn<T> {
  /** Unique column key */
  key: string;
  /** Column header text */
  title: string;
  /** Custom render function */
  render?: (
    value: any,
    row: T,
    meta: { level: number; expanded: boolean }
  ) => React.ReactNode;
  /** Whether column is sortable */
  sortable?: boolean;
  /** Column width */
  width?: number | string;
}

interface TreeTableProps<T> {
  /** Table data */
  data: T[];
  /** Column definitions */
  columns: TreeTableColumn<T>[];
  /** Default expanded row IDs */
  defaultExpandedIds?: (string | number)[];
  /** Controlled expanded row IDs */
  expandedIds?: (string | number)[];
  /** Expansion change handler */
  onExpandedChange?: (ids: (string | number)[]) => void;
  /** Row key getter */
  getRowKey?: (row: T) => string | number;
  /** Children key in data */
  childrenKey?: string;
  /** Whether to show loading state */
  loading?: boolean;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### Custom Expansion Control

::: code-with-tooltips

```tsx
<TreeTable
  columns={[
    {
      key: 'name',
      title: 'Name',
      render: (value, row, { level, expanded }) => (
        <div style={{ paddingLeft: level * 20 }}>
          {row.children?.length > 0 && (
            <button onClick={() => toggleExpand(row.id)}>
              {expanded ? '▼' : '▶'}
            </button>
          )}
          {value}
        </div>
      )
    }
  ]}
  data={data}
/>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const TreeTable = React.forwardRef<HTMLDivElement, TreeTableProps>(({
  data,
  columns,
  defaultExpandedIds = [],
  expandedIds: controlledIds,
  onExpandedChange,
  getRowKey = row => row.id,
  childrenKey = 'children',
  loading = false,
  className,
  ...props
}, ref) => {
  const [expandedState, setExpandedState] = useState(
    new Set(defaultExpandedIds)
  );
  
  const expanded = controlledIds ?? Array.from(expandedState);
  
  const toggleExpand = useCallback((id: string | number) => {
    const newExpanded = new Set(expandedState);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedState(newExpanded);
    onExpandedChange?.(Array.from(newExpanded));
  }, [expandedState, onExpandedChange]);
  
  const flattenData = useCallback((
    items: any[],
    level = 0,
    parent?: string | number
  ): any[] => {
    return items.flatMap(item => {
      const id = getRowKey(item);
      const children = item[childrenKey];
      const row = { ...item, level, parent };
      
      return [
        row,
        ...(expanded.includes(id) && children?.length
          ? flattenData(children, level + 1, id)
          : [])
      ];
    });
  }, [expanded, getRowKey, childrenKey]);
  
  const rows = useMemo(() => flattenData(data), [
    data,
    flattenData
  ]);
  
  return (
    <div
      ref={ref}
      className={clsx('tree-table', className)}
      {...props}
    >
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={getRowKey(row)}>
              {columns.map(column => (
                <td key={column.key}>
                  {column.render?.(
                    row[column.key],
                    row,
                    {
                      level: row.level,
                      expanded: expanded.includes(getRowKey(row))
                    }
                  ) ?? row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="tree-table__loading">
          Loading...
        </div>
      )}
    </div>
  );
});
```

:::

## Styling

### Base Styles

::: code-with-tooltips

```scss
.tree-table {
  width: 100%;
  overflow: auto;
  position: relative;
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid var(--border-color);
    background: var(--surface-background-alt);
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  td {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
  }
  
  tr {
    &:hover {
      background: var(--surface-hover);
    }
  }
  
  // Expansion controls
  &__expand-button {
    background: none;
    border: none;
    padding: var(--spacing-xs);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
  }
  
  // Loading state
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
  }
  
  // Indentation guides
  &__indent-guide {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border-color);
    opacity: 0.3;
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TreeTable } from './TreeTable';

describe('TreeTable', () => {
  const mockData = [
    {
      id: 1,
      name: 'Parent',
      children: [
        { id: 2, name: 'Child' }
      ]
    }
  ];

  const mockColumns = [
    { key: 'name', title: 'Name' }
  ];

  it('renders data correctly', () => {
    render(
      <TreeTable
        data={mockData}
        columns={mockColumns}
      />
    );
    
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
  });

  it('handles row expansion', () => {
    const handleExpandedChange = jest.fn();
    
    render(
      <TreeTable
        data={mockData}
        columns={mockColumns}
        onExpandedChange={handleExpandedChange}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleExpandedChange).toHaveBeenCalledWith([1]);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('respects defaultExpandedIds', () => {
    render(
      <TreeTable
        data={mockData}
        columns={mockColumns}
        defaultExpandedIds={[1]}
      />
    );
    
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('handles controlled expansion', () => {
    const { rerender } = render(
      <TreeTable
        data={mockData}
        columns={mockColumns}
        expandedIds={[]}
      />
    );
    
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    
    rerender(
      <TreeTable
        data={mockData}
        columns={mockColumns}
        expandedIds={[1]}
      />
    );
    
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
```

:::

## Accessibility

### ARIA Attributes

::: code-with-tooltips

```tsx
const TreeTable = React.forwardRef<HTMLDivElement, TreeTableProps>(({
  // ... other props
}, ref) => {
  return (
    <div
      ref={ref}
      role="treegrid"
      aria-busy={loading}
    >
      <table>
        <thead role="rowgroup">
          <tr role="row">
            {columns.map(column => (
              <th
                key={column.key}
                role="columnheader"
                aria-sort={column.sortable ? 'none' : undefined}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map(row => (
            <tr
              key={getRowKey(row)}
              role="row"
              aria-level={row.level + 1}
              aria-expanded={row.children?.length > 0
                ? expanded.includes(getRowKey(row))
                : undefined}
            >
              {/* ... cells ... */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
```

:::

## Best Practices

### Usage Guidelines

::: code-with-tooltips

```tsx
// DO: Use consistent indentation
<TreeTable
  columns={[{
    key: 'name',
    render: (value, row, { level }) => (
      <div style={{ paddingLeft: `${level * 20}px` }}>
        {value}
      </div>
    )
  }]}
/>

// DON'T: Mix indentation methods
<TreeTable
  columns={[{
    key: 'name',
    render: (value, row) => (
      row.level === 0
        ? value
        : <div style={{ marginLeft: '20px' }}>{value}</div>
    )
  }]}
/>

// DO: Handle loading states
<TreeTable
  loading={isLoading}
  loadingComponent={<CustomSpinner />}
/>

// DON'T: Leave loading states unhandled
<TreeTable
  data={isLoading ? [] : data} // Poor UX!
/>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize handlers and renderers
const columns = useMemo(() => [{
  key: 'name',
  render: useCallback((value, row, { level }) => (
    <div style={{ paddingLeft: level * 20 }}>
      {value}
    </div>
  ), [])
}], []);

// DON'T: Create new functions inline
<TreeTable
  onExpandedChange={(ids) => setExpanded(ids)} // Creates new function every render
/>

// DO: Use row virtualization for large datasets
<TreeTable
  virtualizeRows
  rowHeight={40}
  visibleRows={20}
/>
```

:::
