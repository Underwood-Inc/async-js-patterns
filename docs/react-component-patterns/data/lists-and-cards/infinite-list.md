---
title: InfiniteList Component
description: List component with infinite scrolling and dynamic data loading capabilities
category: Data
subcategory: Lists & Cards
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - List
  - Infinite Scroll
  - React
---

# InfiniteList Component

## Overview

The InfiniteList component extends the base List component to provide infinite scrolling functionality with dynamic data loading. It efficiently handles large datasets by loading data in chunks as the user scrolls, with support for both forward and backward loading.

## Key Features

- Infinite scrolling
- Dynamic data loading
- Bidirectional loading
- Loading states
- Error handling
- Empty states
- Scroll position management
- Imperative controls

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface InfiniteListProps<T = unknown> {
  /** Data fetching function */
  fetchData: (_page: number) => Promise<T[]>;
  /** Number of items per page */
  pageSize?: number;
  /** Custom item renderer */
  renderItem: (_item: T) => ReactNode;
  /** Initial data */
  initialData?: T[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: Error;
  /** Loading threshold */
  threshold?: number;
  /** Whether to enable bidirectional loading */
  bidirectional?: boolean;
  /** Loading placeholder */
  loadingPlaceholder?: ReactNode;
  /** Error placeholder */
  errorPlaceholder?: ReactNode;
  /** Empty state placeholder */
  emptyPlaceholder?: ReactNode;
  /** Scroll container ref */
  scrollContainerRef?: React.RefObject<HTMLElement>;
  /** Whether items are selectable */
  selectable?: boolean;
  /** Selected items */
  selectedItems?: T[];
  /** Selection change handler */
  onSelectionChange?: (_items: T[]) => void;
  /** Additional CSS class */
  className?: string;
}

export interface InfiniteListRef {
  /** Reset list to initial state */
  reset: () => void;
  /** Refresh current data */
  refresh: () => Promise<void>;
  /** Load next page */
  loadNext: () => Promise<void>;
  /** Load previous page (if bidirectional) */
  loadPrevious: () => Promise<void>;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fetchData` | function | - | Data fetching function |
| `pageSize` | number | 20 | Items per page |
| `renderItem` | function | - | Item renderer |
| `initialData` | T[] | [] | Initial items |
| `loading` | boolean | false | Loading state |
| `error` | Error | - | Error state |
| `threshold` | number | 250 | Loading threshold |
| `bidirectional` | boolean | false | Enable bidirectional |
| `loadingPlaceholder` | ReactNode | - | Loading content |
| `errorPlaceholder` | ReactNode | - | Error content |
| `emptyPlaceholder` | ReactNode | - | Empty content |
| `scrollContainerRef` | RefObject | - | Scroll container |
| `selectable` | boolean | false | Enable selection |
| `selectedItems` | T[] | [] | Selected items |
| `onSelectionChange` | function | - | Selection handler |

## Usage

### Basic InfiniteList

::: code-with-tooltips
```tsx
import { InfiniteList } from '@/components/data';

export const BasicInfiniteListExample = () => {
  const fetchData = async (page: number) => {
    const response = await fetch(`/api/items?page=${page}`);
    return response.json();
  };

  return (
    <InfiniteList
      fetchData={fetchData}
      pageSize={20}
      renderItem={(item) => (
        <div className="list-item">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      )}
    />
  );
};
```
:::

### With Selection and Error Handling

::: code-with-tooltips
```tsx
import { InfiniteList } from '@/components/data';
import { useState } from 'react';

export const SelectableInfiniteListExample = () => {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [error, setError] = useState<Error>();

  const fetchData = async (page: number) => {
    try {
      const response = await fetch(`/api/items?page=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  };

  return (
    <InfiniteList
      fetchData={fetchData}
      pageSize={20}
      error={error}
      selectable
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems}
      renderItem={(item) => (
        <ListItem
          title={item.title}
          description={item.description}
          selected={selectedItems.includes(item)}
        />
      )}
      errorPlaceholder={
        <ErrorMessage
          message={error?.message}
          onRetry={() => setError(undefined)}
        />
      }
    />
  );
};
```
:::

### With Bidirectional Loading

::: code-with-tooltips
```tsx
import { InfiniteList } from '@/components/data';
import { useRef } from 'react';

export const BidirectionalInfiniteListExample = () => {
  const listRef = useRef<InfiniteListRef>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchData = async (page: number) => {
    const response = await fetch(`/api/items?page=${page}`);
    return response.json();
  };

  return (
    <div ref={scrollRef} style={{ height: 400, overflow: 'auto' }}>
      <InfiniteList
        ref={listRef}
        fetchData={fetchData}
        pageSize={20}
        bidirectional
        scrollContainerRef={scrollRef}
        renderItem={(item) => (
          <ListItem
            title={item.title}
            description={item.description}
          />
        )}
        loadingPlaceholder={<Spinner />}
      />
    </div>
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Data Management**
   - Implement proper caching
   - Handle loading states
   - Manage error states
   - Cache page results

2. **Scroll Handling**
   - Optimize scroll events
   - Maintain scroll position
   - Handle bidirectional load
   - Manage thresholds

3. **User Experience**
   - Show loading feedback
   - Handle errors gracefully
   - Maintain responsiveness
   - Support touch devices

### Accessibility

1. **Keyboard Navigation**
   - Support arrow keys
   - Handle page up/down
   - Enable selection
   - Maintain focus

2. **Screen Readers**
   - Announce loading
   - Indicate progress
   - Provide context
   - Handle updates

3. **Visual Feedback**
   - Clear loading states
   - Error indicators
   - Selection feedback
   - Scroll position

### Performance

1. **Data Loading**
   - Implement caching
   - Batch updates
   - Optimize requests
   - Handle cleanup

2. **Rendering**
   - Use virtualization
   - Optimize re-renders
   - Manage memory
   - Clean up listeners

3. **State Management**
   - Cache results
   - Handle updates
   - Manage selection
   - Optimize storage

## Related Components

- [List](./list.md) - For simple lists
- [VirtualList](./virtual-list.md) - For large datasets
- [InfiniteScroll](./infinite-scroll.md) - For scroll containers
- [DataGrid](../tables/data-grid.md) - For tabular data