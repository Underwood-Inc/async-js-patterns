---
title: CardGrid Component
description: Grid layout component for displaying multiple cards with responsive behavior
category: Data
subcategory: Lists & Cards
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - Grid
  - Layout
  - React
---

# CardGrid Component

## Overview

The CardGrid component provides a responsive grid layout for displaying multiple cards. It extends the base grid system to offer various grid configurations, gap settings, and responsive breakpoints while maintaining consistent behavior with other card-based components.

## Key Features

- Responsive grid layout
- Configurable columns
- Auto-fit support
- Gap customization
- Aspect ratio control
- Alignment options
- Breakpoint support
- Performance optimized

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface CardGridProps {
  /** Grid items */
  children: ReactNode;
  /** Number of columns */
  columns?: number | ResponsiveValue<number>;
  /** Gap between items */
  gap?: SpacingValue;
  /** Minimum column width for auto-fit */
  minColumnWidth?: number | string;
  /** Grid alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Grid justification */
  justify?: 'start' | 'center' | 'end' | 'stretch';
  /** Whether to maintain aspect ratio */
  maintainAspectRatio?: boolean;
  /** Aspect ratio (width/height) */
  aspectRatio?: number;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Empty state message */
  emptyMessage?: string;
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

export type SpacingValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Grid items |
| `columns` | number/object | 3 | Column count |
| `gap` | SpacingValue | 'md' | Grid gap |
| `minColumnWidth` | number/string | - | Min column width |
| `align` | string | 'stretch' | Grid alignment |
| `justify` | string | 'stretch' | Grid justification |
| `maintainAspectRatio` | boolean | false | Keep aspect ratio |
| `aspectRatio` | number | 1 | Width/height ratio |
| `loading` | boolean | false | Loading state |
| `error` | string | - | Error message |
| `emptyMessage` | string | 'No items' | Empty message |

## Usage

### Basic CardGrid

::: code-with-tooltips
```tsx
import { CardGrid, Card } from '@/components/data';

export const BasicCardGridExample = () => {
  return (
    <CardGrid columns={3} gap="md">
      <Card>
        <Card.Body>
          <Card.Title>Card 1</Card.Title>
          <p>First card content</p>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Card 2</Card.Title>
          <p>Second card content</p>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Card 3</Card.Title>
          <p>Third card content</p>
        </Card.Body>
      </Card>
    </CardGrid>
  );
};
```
:::

### Responsive Grid

::: code-with-tooltips
```tsx
import { CardGrid, Card } from '@/components/data';

export const ResponsiveGridExample = () => {
  const items = [
    { id: 1, title: 'Item 1', image: '/image1.jpg', description: 'Description 1' },
    { id: 2, title: 'Item 2', image: '/image2.jpg', description: 'Description 2' },
    { id: 3, title: 'Item 3', image: '/image3.jpg', description: 'Description 3' },
    { id: 4, title: 'Item 4', image: '/image4.jpg', description: 'Description 4' },
  ];

  return (
    <CardGrid
      columns={{
        base: 1,
        sm: 2,
        md: 3,
        lg: 4
      }}
      gap="lg"
    >
      {items.map(item => (
        <Card key={item.id}>
          <Card.Media
            src={item.image}
            alt={item.title}
            height={200}
          />
          <Card.Body>
            <Card.Title>{item.title}</Card.Title>
            <p>{item.description}</p>
          </Card.Body>
        </Card>
      ))}
    </CardGrid>
  );
};
```
:::

### Auto-fit Grid

::: code-with-tooltips
```tsx
import { CardGrid, Card } from '@/components/data';

export const AutoFitGridExample = () => {
  return (
    <CardGrid
      minColumnWidth={300}
      gap="md"
      maintainAspectRatio
      aspectRatio={16/9}
    >
      {items.map(item => (
        <Card key={item.id}>
          <Card.Media
            src={item.image}
            alt={item.title}
            height="100%"
            objectFit="cover"
          />
        </Card>
      ))}
    </CardGrid>
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Layout Management**
   - Use responsive columns
   - Handle grid gaps
   - Maintain alignment
   - Consider breakpoints

2. **Content Organization**
   - Consistent card sizes
   - Proper aspect ratios
   - Balanced content
   - Grid alignment

3. **Responsive Design**
   - Mobile-first approach
   - Breakpoint handling
   - Fluid transitions
   - Touch support

### Accessibility

1. **Grid Structure**
   - Semantic markup
   - Logical order
   - Focus management
   - Screen reader support

2. **Navigation**
   - Keyboard support
   - Focus indicators
   - Tab sequence
   - Arrow key navigation

3. **Content Access**
   - Alt text
   - ARIA labels
   - Role attributes
   - State indicators

### Performance

1. **Rendering**
   - Optimize grid layout
   - Handle reflows
   - Manage transitions
   - Cache calculations

2. **Responsiveness**
   - Efficient breakpoints
   - Smooth resizing
   - Layout shifts
   - Image loading

3. **Memory**
   - Clean up listeners
   - Optimize refs
   - Handle unmounting
   - Manage state

## Related Components

- [Card](./card.md) - Card component
- [CardList](./card-list.md) - List layout
- [Grid](../layout/grid.md) - Base grid
- [VirtualGrid](./virtual-grid.md) - For large grids
