---
title: VirtualList Component
description: High-performance list component for rendering large datasets using virtualization
category: Data
subcategory: Lists & Cards
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - List
  - Virtualization
  - Performance
  - React
---

# VirtualList Component

## Overview

The VirtualList component extends the base List component to provide efficient rendering of large datasets by only rendering items that are currently visible in the viewport. It supports both fixed and variable height items, smooth scrolling, and dynamic content updates.

## Key Features

- Virtual scrolling
- Fixed/variable height items
- Dynamic content updates
- Smooth scrolling
- Overscan support
- Performance optimized
- Keyboard navigation
- Touch device support

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface VirtualListProps<T = unknown> {
  /** List items */
  items: T[];
  /** Container height */
  height: number;
  /** Item height (fixed) */
  itemHeight?: number;
  /** Get item height (variable) */
  getItemHeight?: (_index: number) => number;
  /** Number of items to render beyond visible area */
  overscan?: number;
  /** Custom render function */
  renderItem: (_item: T, _index: number) => ReactNode;
  /** Scroll position change handler */
  onScroll?: (_scrollTop: number) => void;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Whether items are selectable */
  selectable?: boolean;
  /** Selected items */
  selectedItems?: T[];
  /** Selection change handler */
  onSelectionChange?: (_items: T[]) => void;
  /** Additional CSS class */
  className?: string;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | T[] | - | List items array |
| `height` | number | - | Container height |
| `itemHeight` | number | 40 | Fixed item height |
| `getItemHeight` | function | - | Variable height getter |
| `overscan` | number | 3 | Overscan item count |
| `renderItem` | function | - | Item renderer |
| `onScroll` | function | - | Scroll handler |
| `loading` | boolean | false | Loading state |
| `error` | string | - | Error message |
| `emptyMessage` | string | 'No items' | Empty state message |
| `selectable` | boolean | false | Enable selection |
| `selectedItems` | T[] | [] | Selected items |
| `onSelectionChange` | function | - | Selection handler |

## Usage

### Basic VirtualList

::: code-with-tooltips
```tsx
import { VirtualList } from '@/components/data';

export const BasicVirtualListExample = () => {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    content: `Item ${i}`
  }));

  return (
    <VirtualList
      items={items}
      height={400}
      itemHeight={40}
      renderItem={(item) => (
        <div className="list-item">
          {item.content}
        </div>
      )}
    />
  );
};
```
:::

### Variable Height Items

::: code-with-tooltips
```tsx
import { VirtualList } from '@/components/data';

export const VariableHeightExample = () => {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `Item ${i}`,
    content: `Content with variable length ${i}`.repeat(Math.random() * 5)
  }));

  return (
    <VirtualList
      items={items}
      height={400}
      getItemHeight={(index) => {
        return items[index].content.length > 50 ? 80 : 40;
      }}
      renderItem={(item) => (
        <div className="list-item">
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </div>
      )}
    />
  );
};
```
:::

### With Selection and Loading

::: code-with-tooltips
```tsx
import { VirtualList } from '@/components/data';
import { useState, useEffect } from 'react';

export const SelectableVirtualListExample = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        setItems(data);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <VirtualList
      items={items}
      height={400}
      itemHeight={60}
      loading={loading}
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
    />
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Performance Optimization**
   - Use fixed heights when possible
   - Implement proper memoization
   - Optimize render functions
   - Cache measurements

2. **Content Management**
   - Handle dynamic content
   - Support variable heights
   - Manage scroll position
   - Handle content updates

3. **User Experience**
   - Show loading states
   - Maintain scroll position
   - Handle smooth scrolling
   - Support touch devices

### Accessibility

1. **Keyboard Navigation**
   - Support arrow keys
   - Handle page up/down
   - Maintain focus state
   - Enable selection

2. **Screen Readers**
   - Announce scroll position
   - Provide list context
   - Handle dynamic updates
   - Support navigation

3. **Visual Feedback**
   - Clear scroll indicators
   - Selection highlights
   - Loading indicators
   - Focus states

### Performance

1. **Rendering**
   - Use windowing
   - Optimize measurements
   - Handle resize events
   - Clean up listeners

2. **Memory Management**
   - Cache item heights
   - Reuse DOM nodes
   - Clean up resources
   - Handle unmounting

## Related Components

- [List](./list.md) - For smaller datasets
- [InfiniteList](./infinite-list.md) - For dynamic loading
- [Table](../tables/table.md) - For tabular data
- [DataGrid](../tables/data-grid.md) - For complex data grids
