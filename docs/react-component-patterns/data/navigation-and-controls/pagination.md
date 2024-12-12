---
title: Pagination Component
description: Component for navigating through multiple pages of content
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Navigation
  - Pagination
  - React
---

# Pagination Component

## Overview

The Pagination component enables navigation through multiple pages of content. It supports various styles, page size options, and customizable controls.

## Usage

### Basic Pagination

::: code-with-tooltips

```tsx
import { Pagination } from '@/components/data';

<Pagination
  total={100}
  pageSize={10}
  current={1}
  onChange={(page) => console.log(`Go to page ${page}`)}
/>
```

:::

### API Reference

```tsx
interface PaginationProps {
  /** Total number of items */
  total: number;
  /** Items per page */
  pageSize?: number;
  /** Current page number */
  current?: number;
  /** Default page number */
  defaultCurrent?: number;
  /** Page change handler */
  onChange?: (page: number, pageSize: number) => void;
  /** Whether to show quick jumper */
  showQuickJumper?: boolean;
  /** Whether to show size changer */
  showSizeChanger?: boolean;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Whether to show total text */
  showTotal?: boolean | ((total: number, range: [number, number]) => React.ReactNode);
  /** Whether to disable */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Size Changer

::: code-with-tooltips

```tsx
<Pagination
  total={200}
  showSizeChanger
  pageSizeOptions={[10, 20, 50, 100]}
  showTotal={(total, range) => (
    `${range[0]}-${range[1]} of ${total} items`
  )}
/>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(({
  total,
  pageSize = 10,
  current: controlledPage,
  defaultCurrent = 1,
  onChange,
  showQuickJumper = false,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  showTotal = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  const [currentPage, setCurrentPage] = useState(defaultCurrent);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  
  const page = controlledPage ?? currentPage;
  const totalPages = Math.ceil(total / currentPageSize);
  
  const getPageRange = useCallback((): [number, number] => {
    const start = (page - 1) * currentPageSize + 1;
    const end = Math.min(page * currentPageSize, total);
    return [start, end];
  }, [page, currentPageSize, total]);
  
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > totalPages || disabled) return;
    
    setCurrentPage(newPage);
    onChange?.(newPage, currentPageSize);
  }, [totalPages, disabled, onChange, currentPageSize]);
  
  const handleSizeChange = useCallback((newSize: number) => {
    if (disabled) return;
    
    const newTotalPages = Math.ceil(total / newSize);
    const newPage = Math.min(page, newTotalPages);
    
    setCurrentPageSize(newSize);
    setCurrentPage(newPage);
    onChange?.(newPage, newSize);
  }, [total, page, disabled, onChange]);
  
  return (
    <div
      ref={ref}
      className={clsx('pagination', { 'pagination--disabled': disabled }, className)}
      {...props}
    >
      {showTotal && (
        <span className="pagination__total">
          {typeof showTotal === 'function'
            ? showTotal(total, getPageRange())
            : `Total ${total} items`}
        </span>
      )}
      
      <button
        className="pagination__button"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1 || disabled}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" />
      </button>
      
      {/* Page numbers */}
      <div className="pagination__pages">
        {generatePageNumbers(page, totalPages).map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === '...' ? (
              <span className="pagination__ellipsis">...</span>
            ) : (
              <button
                className={clsx(
                  'pagination__page',
                  { 'pagination__page--active': pageNum === page }
                )}
                onClick={() => handlePageChange(pageNum as number)}
                disabled={disabled}
              >
                {pageNum}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <button
        className="pagination__button"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages || disabled}
        aria-label="Next page"
      >
        <Icon name="chevron-right" />
      </button>
      
      {showSizeChanger && (
        <select
          className="pagination__size-select"
          value={currentPageSize}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          disabled={disabled}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      )}
      
      {showQuickJumper && (
        <div className="pagination__jumper">
          Go to
          <input
            type="number"
            min={1}
            max={totalPages}
            value={page}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            disabled={disabled}
          />
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
.pagination {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  // Base button styles
  &__button,
  &__page {
    min-width: 32px;
    height: 32px;
    padding: 0 var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background: var(--surface-background);
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover:not(:disabled) {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  // Page numbers container
  &__pages {
    display: flex;
    gap: var(--spacing-xs);
  }
  
  // Active page
  &__page--active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--primary-contrast);
    
    &:hover {
      color: var(--primary-contrast);
    }
  }
  
  // Ellipsis
  &__ellipsis {
    display: flex;
    align-items: center;
    padding: 0 var(--spacing-sm);
    color: var(--text-secondary);
  }
  
  // Size selector
  &__size-select {
    min-width: 90px;
    height: 32px;
    padding: 0 var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    background: var(--surface-background);
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  // Quick jumper
  &__jumper {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    
    input {
      width: 50px;
      height: 32px;
      padding: 0 var(--spacing-sm);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      text-align: center;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
  
  // Disabled state
  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders correct number of pages', () => {
    render(
      <Pagination
        total={100}
        pageSize={10}
        current={1}
      />
    );
    
    expect(screen.getByText('1')).toHaveClass('pagination__page--active');
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles page changes', () => {
    const handleChange = jest.fn();
    render(
      <Pagination
        total={100}
        pageSize={10}
        current={1}
        onChange={handleChange}
      />
    );
    
    fireEvent.click(screen.getByText('2'));
    expect(handleChange).toHaveBeenCalledWith(2, 10);
  });

  it('handles size changes', () => {
    const handleChange = jest.fn();
    render(
      <Pagination
        total={100}
        pageSize={10}
        showSizeChanger
        onChange={handleChange}
      />
    );
    
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '20' }
    });
    expect(handleChange).toHaveBeenCalledWith(1, 20);
  });

  it('disables navigation when on first/last page', () => {
    render(
      <Pagination
        total={30}
        pageSize={10}
        current={1}
      />
    );
    
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    fireEvent.click(screen.getByText('3'));
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });
});
```

:::

## Accessibility

### Keyboard Navigation

::: code-with-tooltips

```tsx
const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(({
  // ... other props
}, ref) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent, pageNum: number) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handlePageChange(pageNum);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handlePageChange(page - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        handlePageChange(page + 1);
        break;
      case 'Home':
        e.preventDefault();
        handlePageChange(1);
        break;
      case 'End':
        e.preventDefault();
        handlePageChange(totalPages);
        break;
    }
  }, [handlePageChange, page, totalPages]);
  
  return (
    <nav
      ref={ref}
      role="navigation"
      aria-label="Pagination"
    >
      {/* ... */}
    </nav>
  );
});
```

:::

## Best Practices

### Usage Guidelines

::: code-with-tooltips

```tsx
// DO: Show appropriate number of pages
<Pagination
  total={1000}
  pageSize={10}
  maxVisible={5} // Limit visible page numbers
/>

// DON'T: Use for small datasets
<Pagination
  total={5} // Use simple navigation instead
  pageSize={1}
/>

// DO: Provide context with total text
<Pagination
  showTotal={(total, range) => (
    <span>Showing {range[0]}-{range[1]} of {total}</span>
  )}
/>

// DON'T: Mix controlled and uncontrolled
<Pagination
  current={page} // Avoid mixing with defaultCurrent
  defaultCurrent={1}
/>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize handlers
const PaginatedList = ({ items, onPageChange }) => {
  const handleChange = useCallback((page: number) => {
    onPageChange(page);
  }, [onPageChange]);
  
  return (
    <Pagination
      total={items.length}
      onChange={handleChange}
    />
  );
};

// DON'T: Create complex renderers inline
<Pagination
  showTotal={(total, range) => (
    <ComplexComponent // Avoid creating components inline
      total={total}
      range={range}
    />
  )}
/>
```

:::
