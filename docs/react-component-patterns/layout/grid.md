---
title: Grid Components
description: Flexible and responsive grid components for React applications with support for various layouts and responsive behaviors
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Layout
  - Grid
  - Responsive Design
  - Design System
---

# Grid Components

## Overview

Our grid system provides a flexible and responsive way to create complex layouts. It supports both CSS Grid and Flexbox with various configuration options.

## Components

### Base Grid

The foundation grid component with responsive columns:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface GridProps {
  /** Grid content */
  children: React.ReactNode;
  /** Number of columns */
  columns?: number | { [breakpoint: string]: number };
  /** Gap between items */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Row gap override */
  rowGap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Column gap override */
  columnGap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Whether to flow items by column */
  flow?: 'row' | 'column';
  /** Whether to stretch items to fill container height */
  stretch?: boolean;
  /** HTML element to render */
  as?: React.ElementType;
  /** ARIA role if needed */
  role?: string;
  /** ARIA label */
  'aria-label'?: string;
  /** Additional CSS classes */
  className?: string;
}

const gapMap = {
  xs: 'var(--spacing-2)',
  sm: 'var(--spacing-4)',
  md: 'var(--spacing-6)',
  lg: 'var(--spacing-8)',
  xl: 'var(--spacing-10)',
};

export const Grid = ({
  children,
  columns = 12,
  gap = 'md',
  rowGap,
  columnGap,
  flow = 'row',
  stretch = false,
  as: Component = 'div',
  role,
  'aria-label': ariaLabel,
  className,
  ...props
}: GridProps) => {
  const gridGap = typeof gap === 'string' ? gapMap[gap] : `${gap}px`;
  const gridRowGap = rowGap ? (typeof rowGap === 'string' ? gapMap[rowGap] : `${rowGap}px`) : gridGap;
  const gridColumnGap = columnGap ? (typeof columnGap === 'string' ? gapMap[columnGap] : `${columnGap}px`) : gridGap;

  const gridStyle = {
    '--grid-columns': typeof columns === 'number' ? columns : undefined,
    '--grid-row-gap': gridRowGap,
    '--grid-column-gap': gridColumnGap,
    ...Object.entries(typeof columns === 'object' ? columns : {}).reduce(
      (acc, [breakpoint, value]) => ({
        ...acc,
        [`--grid-columns-${breakpoint}`]: value,
      }),
      {}
    ),
  } as React.CSSProperties;

  return (
    <Component
      className={clsx(
        'grid',
        `grid--flow-${flow}`,
        stretch && 'grid--stretch',
        className
      )}
      style={gridStyle}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Component>
  );
};
```

:::

::: code-with-tooltips

```scss
.grid {
  display: grid;
  gap: var(--grid-row-gap) var(--grid-column-gap);

  // Default grid columns
  grid-template-columns: repeat(var(--grid-columns, 12), minmax(0, 1fr));

  // Responsive columns
  @media (min-width: 640px) {
    grid-template-columns: repeat(var(--grid-columns-sm, var(--grid-columns)), minmax(0, 1fr));
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(var(--grid-columns-md, var(--grid-columns)), minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(var(--grid-columns-lg, var(--grid-columns)), minmax(0, 1fr));
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(var(--grid-columns-xl, var(--grid-columns)), minmax(0, 1fr));
  }

  // Flow variants
  &--flow-row {
    grid-auto-flow: row;
  }

  &--flow-column {
    grid-auto-flow: column;
  }

  // Stretch variant
  &--stretch {
    align-items: stretch;
  }
}
```

:::

### Grid Item

A component for grid items with span and positioning:

::: code-with-tooltips

```tsx
interface GridItemProps {
  /** Item content */
  children: React.ReactNode;
  /** Column span */
  span?: number | { [breakpoint: string]: number };
  /** Column start */
  start?: number | { [breakpoint: string]: number };
  /** Column end */
  end?: number | { [breakpoint: string]: number };
  /** Row span */
  rowSpan?: number;
  /** Row start */
  rowStart?: number;
  /** Row end */
  rowEnd?: number;
  /** HTML element to render */
  as?: React.ElementType;
  /** Additional CSS classes */
  className?: string;
}

export const GridItem = ({
  children,
  span,
  start,
  end,
  rowSpan,
  rowStart,
  rowEnd,
  as: Component = 'div',
  className,
  ...props
}: GridItemProps) => {
  const itemStyle = {
    '--col-span': typeof span === 'number' ? span : undefined,
    '--col-start': start,
    '--col-end': end,
    '--row-span': rowSpan,
    '--row-start': rowStart,
    '--row-end': rowEnd,
    ...Object.entries(typeof span === 'object' ? span : {}).reduce(
      (acc, [breakpoint, value]) => ({
        ...acc,
        [`--col-span-${breakpoint}`]: value,
      }),
      {}
    ),
  } as React.CSSProperties;

  return (
    <Component
      className={clsx('grid-item', className)}
      style={itemStyle}
      {...props}
    >
      {children}
    </Component>
  );
};
```

:::

::: code-with-tooltips

```scss
.grid-item {
  // Default span
  grid-column: span var(--col-span, 1) / span var(--col-span, 1);

  // Explicit positioning
  grid-column-start: var(--col-start);
  grid-column-end: var(--col-end);
  grid-row: span var(--row-span, 1) / span var(--row-span, 1);
  grid-row-start: var(--row-start);
  grid-row-end: var(--row-end);

  // Responsive spans
  @media (min-width: 640px) {
    grid-column: span var(--col-span-sm, var(--col-span, 1)) / span var(--col-span-sm, var(--col-span, 1));
  }

  @media (min-width: 768px) {
    grid-column: span var(--col-span-md, var(--col-span, 1)) / span var(--col-span-md, var(--col-span, 1));
  }

  @media (min-width: 1024px) {
    grid-column: span var(--col-span-lg, var(--col-span, 1)) / span var(--col-span-lg, var(--col-span, 1));
  }

  @media (min-width: 1280px) {
    grid-column: span var(--col-span-xl, var(--col-span, 1)) / span var(--col-span-xl, var(--col-span, 1));
  }
}
```

:::

### Auto Grid

A component for auto-responsive grid layouts:

::: code-with-tooltips

```tsx
interface AutoGridProps extends Omit<GridProps, 'columns'> {
  /** Minimum item width */
  minWidth?: string;
}

export const AutoGrid = ({
  children,
  minWidth = '250px',
  ...props
}: AutoGridProps) => {
  return (
    <div
      className={clsx('auto-grid')}
      style={{ '--min-width': minWidth } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.auto-grid {
  display: grid;
  gap: var(--grid-row-gap, var(--spacing-6)) var(--grid-column-gap, var(--spacing-6));
  grid-template-columns: repeat(auto-fill, minmax(var(--min-width), 1fr));
}
```

:::

## Usage Examples

### Basic Grid

::: code-with-tooltips

```tsx
<Grid columns={3} gap="lg">
  <GridItem>Item 1</GridItem>
  <GridItem>Item 2</GridItem>
  <GridItem>Item 3</GridItem>
</Grid>
```

:::

### Responsive Grid

::: code-with-tooltips

```tsx
<Grid
  columns={{
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
  }}
  gap="md"
>
  {Array.from({ length: 12 }).map((_, i) => (
    <GridItem key={i}>Item {i + 1}</GridItem>
  ))}
</Grid>
```

:::

### Complex Layout

::: code-with-tooltips

```tsx
<Grid columns={12} gap="md">
  <GridItem span={12}>
    <header>Full Width Header</header>
  </GridItem>

  <GridItem span={{ base: 12, md: 3 }}>
    <nav>Sidebar Navigation</nav>
  </GridItem>

  <GridItem span={{ base: 12, md: 6 }}>
    <main>Main Content Area</main>
  </GridItem>

  <GridItem span={{ base: 12, md: 3 }}>
    <aside>Related Content</aside>
  </GridItem>

  <GridItem span={12}>
    <footer>Full Width Footer</footer>
  </GridItem>
</Grid>
```

:::

### Auto Grid

::: code-with-tooltips

```tsx
<AutoGrid minWidth="200px" gap="lg">
  {Array.from({ length: 8 }).map((_, i) => (
    <div key={i} className="card">
      Card {i + 1}
    </div>
  ))}
</AutoGrid>
```

:::

### Grid with Explicit Positioning

::: code-with-tooltips

```tsx
<Grid columns={3} gap="md">
  <GridItem start={1} end={4}>
    Header (Full Width)
  </GridItem>

  <GridItem start={1} end={2} rowSpan={2}>
    Sidebar
  </GridItem>

  <GridItem start={2} end={4}>
    Main Content
  </GridItem>

  <GridItem start={2} end={4}>
    Additional Content
  </GridItem>

  <GridItem start={1} end={4}>
    Footer (Full Width)
  </GridItem>
</Grid>
```

:::

## Best Practices

### 1. Responsive Design

- Use responsive columns
- Consider breakpoints
- Handle edge cases
- Maintain spacing
- Support mobile views

### 2. Performance

- Minimize reflows
- Use efficient selectors
- Cache calculations
- Handle large grids
- Optimize images

### 3. Accessibility

- Maintain order
- Support zoom
- Handle overflow
- Consider navigation
- Preserve hierarchy

### 4. Implementation

Example of using grids in components:

::: code-with-tooltips

```tsx
// Card grid example
const CardGrid = ({ items }: { items: CardItem[] }) => {
  return (
    <AutoGrid minWidth="300px" gap="lg">
      {items.map(item => (
        <Card key={item.id} {...item} />
      ))}
    </AutoGrid>
  );
};

// Dashboard layout example
const DashboardLayout = () => {
  return (
    <Grid columns={24} gap="md">
      {/* Sidebar */}
      <GridItem span={{ base: 24, lg: 6 }} rowSpan={2}>
        <Sidebar />
      </GridItem>

      {/* Main content */}
      <GridItem span={{ base: 24, lg: 18 }}>
        <Grid columns={2} gap="md">
          <GridItem>
            <StatsCard />
          </GridItem>
          <GridItem>
            <ChartCard />
          </GridItem>
        </Grid>
      </GridItem>

      {/* Additional content */}
      <GridItem span={{ base: 24, lg: 18 }}>
        <Grid columns={3} gap="md">
          <GridItem>
            <ActivityCard />
          </GridItem>
          <GridItem span={2}>
            <TableCard />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};
```

:::

### 5. Customization

Example of extending grid styles:

::: code-with-tooltips

```scss
// Custom grid variants
.grid {
  // Masonry-like grid
  &--masonry {
    grid-template-rows: masonry;
    align-items: start;
  }

  // Dense grid
  &--dense {
    grid-auto-flow: dense;
  }

  // Gallery grid
  &--gallery {
    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      grid-auto-rows: 200px;
      grid-auto-flow: dense;

      .grid-item {
        &--featured {
          grid-column: span 2;
          grid-row: span 2;
        }

        &--wide {
          grid-column: span 2;
        }

        &--tall {
          grid-row: span 2;
        }
      }
    }
  }
}

// Custom grid item variants
.grid-item {
  // Card item
  &--card {
    background: var(--vp-c-bg-soft);
    border-radius: 8px;
    padding: var(--spacing-4);
    height: 100%;
  }

  // Feature item
  &--feature {
    background: var(--vp-c-brand);
    color: white;
    padding: var(--spacing-6);
    border-radius: 12px;
  }
}
```

:::
