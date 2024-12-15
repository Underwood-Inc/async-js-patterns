---
title: VirtualGrid Component
description: Grid component optimized for rendering large datasets with virtualization
category: Data
subcategory: Lists & Cards
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - Grid
  - Performance
  - React
---

# VirtualGrid Component

## Overview

The VirtualGrid component provides an efficient way to render large grid layouts by only rendering items that are currently visible in the viewport. This virtualization technique significantly improves performance when dealing with large datasets.

## Key Features

- Viewport-based rendering
- Dynamic item sizes
- Scroll position restoration
- Variable column count
- Responsive layout
- Performance optimized
- Accessibility support

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface VirtualGridProps<T = any> {
  /** Grid items */
  items: T[];
  /** Item render function */
  renderItem: (item: T, index: number) => ReactNode;
  /** Number of columns */
  columns?: number | ResponsiveValue<number>;
  /** Row height in pixels */
  rowHeight?: number;
  /** Gap between items */
  gap?: number;
  /** Viewport height */
  height: number | string;
  /** Overscan count */
  overscan?: number;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Additional CSS class */
  className?: string;
}

export type ResponsiveValue<T> = {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};
```
:::

## Usage

### Basic VirtualGrid

::: code-with-tooltips
```tsx
import { VirtualGrid } from '@underwood/components';

export const BasicVirtualGridExample = () => {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `Item ${i}`,
  }));

  return (
    <VirtualGrid
      items={items}
      height={400}
      columns={3}
      rowHeight={200}
      gap={16}
      renderItem={(item) => (
        <div key={item.id} className="grid-item">
          {item.title}
        </div>
      )}
    />
  );
};
```
:::

### With Variable Sizes

::: code-with-tooltips
```tsx
import { VirtualGrid } from '@underwood/components';

export const VariableSizeExample = () => {
  const getRowHeight = (index: number) => {
    // Alternate between different heights
    return index % 2 === 0 ? 200 : 300;
  };

  return (
    <VirtualGrid
      items={items}
      height={600}
      columns={{
        base: 1,
        sm: 2,
        md: 3,
        lg: 4
      }}
      rowHeight={getRowHeight}
      gap={20}
      renderItem={renderGridItem}
    />
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Performance Optimization**
   - Set appropriate overscan
   - Optimize item rendering
   - Manage memory usage
   - Handle scroll events

2. **Layout Management**
   - Consistent item sizes
   - Responsive columns
   - Handle resize events
   - Maintain scroll position

### Accessibility

1. **Keyboard Navigation**
   - Arrow key support
   - Focus management
   - Tab navigation
   - Scroll announcements

2. **ARIA Support**
   - Proper roles
   - Grid structure
   - Live regions
   - Focus indicators

## Related Components

- [Grid](/react-component-patterns/layout/grid.md) - For static grid layouts
- [CardGrid](/react-component-patterns/data/lists-and-cards/card-grid.md) - For card-based grids
- [VirtualList](/react-component-patterns/data/lists-and-cards/virtual-list.md) - For virtualized lists 