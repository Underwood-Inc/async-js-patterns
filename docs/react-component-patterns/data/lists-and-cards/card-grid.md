---
title: CardGrid Component
description: Grid layout component for displaying multiple cards with responsive behavior
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Grid
  - Layout
  - React
---

# CardGrid Component

## Overview

The CardGrid component provides a responsive grid layout for displaying multiple cards. It supports various grid configurations, gap settings, and responsive breakpoints.

## Usage

### Basic CardGrid

::: code-with-tooltips

```tsx
import { CardGrid } from '@/components/data';

<CardGrid columns={3} gap="md">
  <Card>
    <Card.Body>Card 1</Card.Body>
  </Card>
  <Card>
    <Card.Body>Card 2</Card.Body>
  </Card>
  <Card>
    <Card.Body>Card 3</Card.Body>
  </Card>
</CardGrid>
```

:::

### API Reference

```tsx
interface CardGridProps {
  /** Grid items */
  children: React.ReactNode;
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
  /** Additional CSS class */
  className?: string;
}

type ResponsiveValue<T> = {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

type SpacingValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
```

### Examples

#### Responsive Grid

::: code-with-tooltips

```tsx
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
      <Card.Media src={item.image} />
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        <p>{item.description}</p>
      </Card.Body>
    </Card>
  ))}
</CardGrid>
```

:::

#### Auto-fit Grid

::: code-with-tooltips

```tsx
<CardGrid
  minColumnWidth={300}
  gap="md"
  maintainAspectRatio
  aspectRatio={16/9}
>
  {items.map(item => (
    <Card key={item.id}>
      <Card.Media src={item.image} />
    </Card>
  ))}
</CardGrid>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const CardGrid = React.forwardRef<HTMLDivElement, CardGridProps>(({
  children,
  columns = 3,
  gap = 'md',
  minColumnWidth,
  align = 'stretch',
  justify = 'stretch',
  maintainAspectRatio = false,
  aspectRatio = 1,
  className
}, ref) => {
  const gridTemplateColumns = useMemo(() => {
    if (typeof columns === 'number') {
      return minColumnWidth
        ? `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`
        : `repeat(${columns}, 1fr)`;
    }
    
    return {
      gridTemplateColumns: Object.entries(columns).reduce(
        (acc, [breakpoint, value]) => ({
          ...acc,
          [breakpoint === 'base' ? '' : `@media (min-width: ${breakpoints[breakpoint]}px)`]: {
            gridTemplateColumns: `repeat(${value}, 1fr)`
          }
        }),
        {}
      )
    };
  }, [columns, minColumnWidth]);
  
  return (
    <div
      ref={ref}
      className={clsx('card-grid', className)}
      style={{
        display: 'grid',
        gap: typeof gap === 'number' ? gap : `var(--spacing-${gap})`,
        alignItems: align,
        justifyItems: justify,
        ...gridTemplateColumns
      }}
    >
      {maintainAspectRatio ? (
        <div
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(auto-fill, minmax(0, ${aspectRatio}fr))`
          }}
        >
          {children}
        </div>
      ) : children}
    </div>
  );
});
```

:::

## Styling

### Base Styles

::: code-with-tooltips

```scss
.card-grid {
  // Container styles
  width: 100%;
  margin: 0 auto;
  
  // Grid item styles
  &__item {
    height: 100%;
    
    // Ensure cards fill grid cells
    > .card {
      height: 100%;
    }
  }
  
  // Responsive breakpoints
  @media (min-width: ${breakpoints.sm}px) {
    &--columns-sm-2 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: ${breakpoints.md}px) {
    &--columns-md-3 {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (min-width: ${breakpoints.lg}px) {
    &--columns-lg-4 {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  // Alignment variations
  &--align {
    &-start { align-items: start; }
    &-center { align-items: center; }
    &-end { align-items: end; }
  }
  
  // Justify variations
  &--justify {
    &-start { justify-items: start; }
    &-center { justify-items: center; }
    &-end { justify-items: end; }
  }
  
  // Gap variations
  &--gap {
    &-xs { gap: var(--spacing-xs); }
    &-sm { gap: var(--spacing-sm); }
    &-md { gap: var(--spacing-md); }
    &-lg { gap: var(--spacing-lg); }
    &-xl { gap: var(--spacing-xl); }
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen } from '@testing-library/react';
import { CardGrid } from './CardGrid';

describe('CardGrid', () => {
  const mockItems = [
    { id: 1, title: 'Card 1' },
    { id: 2, title: 'Card 2' },
    { id: 3, title: 'Card 3' }
  ];

  it('renders correct number of columns', () => {
    const { container } = render(
      <CardGrid columns={3}>
        {mockItems.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </CardGrid>
    );
    
    expect(container.firstChild).toHaveStyle({
      gridTemplateColumns: 'repeat(3, 1fr)'
    });
  });

  it('applies responsive columns', () => {
    const { container } = render(
      <CardGrid
        columns={{
          base: 1,
          sm: 2,
          md: 3
        }}
      >
        {mockItems.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </CardGrid>
    );
    
    const style = window.getComputedStyle(container.firstChild as Element);
    expect(style.gridTemplateColumns).toBe('repeat(1, 1fr)');
  });

  it('maintains aspect ratio when specified', () => {
    const { container } = render(
      <CardGrid
        maintainAspectRatio
        aspectRatio={16/9}
      >
        {mockItems.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </CardGrid>
    );
    
    const gridContainer = container.querySelector('[style*="gridTemplateRows"]');
    expect(gridContainer).toHaveStyle({
      gridTemplateRows: 'repeat(auto-fill, minmax(0, 1.7777777777777777fr))'
    });
  });

  it('applies gap correctly', () => {
    const { container } = render(
      <CardGrid gap="lg">
        {mockItems.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </CardGrid>
    );
    
    expect(container.firstChild).toHaveStyle({
      gap: 'var(--spacing-lg)'
    });
  });
});
```

:::

## Accessibility

### ARIA Attributes

::: code-with-tooltips

```tsx
const CardGrid = React.forwardRef<HTMLDivElement, CardGridProps>(({
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      role="grid"
      aria-label="Card grid"
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <div
          role="gridcell"
          aria-rowindex={Math.floor(index / columns) + 1}
          aria-colindex={(index % columns) + 1}
        >
          {child}
        </div>
      ))}
    </div>
  );
});
```

:::

## Performance Optimization

### Virtualization Integration

::: code-with-tooltips

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualCardGrid = ({
  items,
  columns,
  rowHeight,
  ...props
}: CardGridProps & {
  items: any[];
  rowHeight: number;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(items.length / columns),
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 2
  });
  
  return (
    <div ref={parentRef} style={{ height: '100%', overflow: 'auto' }}>
      <CardGrid
        {...props}
        columns={columns}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const startIndex = virtualRow.index * columns;
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: rowHeight,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              {items.slice(startIndex, startIndex + columns).map(item => (
                <Card key={item.id}>
                  <Card.Body>{item.content}</Card.Body>
                </Card>
              ))}
            </div>
          );
        })}
      </CardGrid>
    </div>
  );
};
```

:::

## Best Practices

### Layout Guidelines

::: code-with-tooltips

```tsx
// DO: Use consistent spacing
<CardGrid
  gap="md"
  columns={{
    base: 1,
    sm: 2,
    md: 3
  }}
>
  {items.map(item => (
    <Card key={item.id} padding="md">
      <Card.Body>{item.content}</Card.Body>
    </Card>
  ))}
</CardGrid>

// DON'T: Mix different gap sizes
<CardGrid gap="lg">
  <div style={{ gap: '8px' }}> {/* Inconsistent! */}
    <Card>{content}</Card>
  </div>
</CardGrid>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize grid items
const MemoizedCard = memo(({ item }) => (
  <Card>
    <Card.Body>{item.content}</Card.Body>
  </Card>
));

// Usage
<CardGrid columns={3}>
  {items.map(item => (
    <MemoizedCard key={item.id} item={item} />
  ))}
</CardGrid>

// DON'T: Create new components inline
<CardGrid columns={3}>
  {items.map(item => (
    // This creates a new component instance on every render
    <div key={item.id} style={{ padding: '16px' }}>
      <Card>{item.content}</Card>
    </div>
  ))}
</CardGrid>
```

:::
