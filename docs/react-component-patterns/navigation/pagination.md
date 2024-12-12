---
title: Pagination Component
description: Component for handling pagination in lists and tables
date: 2024-01-01
author: Underwood Inc
tags:
  - Navigation
  - Pagination
  - React
---

# Pagination Component

## Overview

The Pagination component provides navigation controls for paginated content. It supports various styles, sizes, and can handle both simple and complex pagination scenarios.

## Usage

### Basic Pagination

::: code-with-tooltips
```tsx
import { Pagination } from '@/components/navigation';

<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log(`Navigate to page ${page}`)}
/>
```
:::

### API Reference

```tsx
interface PaginationProps {
  /** Current active page */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of visible page buttons */
  siblingCount?: number;
  /** Whether to show first/last page buttons */
  showEndButtons?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Sibling Pages

::: code-with-tooltips
```tsx
<Pagination
  currentPage={5}
  totalPages={10}
  siblingCount={2}
  showEndButtons
  onPageChange={(page) => setCurrentPage(page)}
/>
```
:::

#### Custom Styling

::: code-with-tooltips
```tsx
<Pagination
  currentPage={1}
  totalPages={5}
  size="lg"
  className="custom-pagination"
  onPageChange={(page) => setCurrentPage(page)}
/>
```
:::

## Best Practices

- Show current page clearly
- Provide clear navigation controls
- Handle edge cases (first/last page)
- Consider mobile-friendly sizing
- Include proper loading states

## Accessibility

- Uses proper ARIA labels
- Supports keyboard navigation
- Provides clear visual feedback
- Maintains focus management

## Implementation

::: code-with-tooltips
```tsx
import React from 'react';
import clsx from 'clsx';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showEndButtons = true,
  size = 'md',
  className,
}) => {
  const pages = usePaginationRange({
    currentPage,
    totalPages,
    siblingCount,
  });

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={clsx(
        'pagination',
        `pagination--${size}`,
        className
      )}
    >
      {showEndButtons && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          «
        </button>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? 'page' : undefined}
          className={clsx(
            'pagination__button',
            { 'pagination__button--active': currentPage === page }
          )}
        >
          {page}
        </button>
      ))}

      {showEndButtons && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          »
        </button>
      )}
    </nav>
  );
};
```
:::

## Related Components

- [Table](../data/table.md)
- [List](../data/list.md)
- [DataGrid](../data/data-grid.md) 