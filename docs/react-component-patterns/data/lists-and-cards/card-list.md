---
title: CardList Component
description: List layout component for displaying cards in a vertical or horizontal arrangement
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - List
  - Layout
  - React
---

# CardList Component

## Overview

The CardList component provides a list-based layout for displaying cards in either vertical or horizontal arrangements. It supports various spacing options, dividers, and interaction patterns.

## Usage

### Basic CardList

::: code-with-tooltips

```tsx
import { CardList } from '@/components/data';

<CardList spacing="md">
  <Card>
    <Card.Body>Card 1</Card.Body>
  </Card>
  <Card>
    <Card.Body>Card 2</Card.Body>
  </Card>
  <Card>
    <Card.Body>Card 3</Card.Body>
  </Card>
</CardList>
```

:::

### API Reference

```tsx
interface CardListProps {
  /** List items */
  children: React.ReactNode;
  /** Space between items */
  spacing?: SpacingValue;
  /** List direction */
  direction?: 'vertical' | 'horizontal';
  /** Whether to show dividers */
  dividers?: boolean;
  /** Divider color */
  dividerColor?: string;
  /** Whether items are selectable */
  selectable?: boolean;
  /** Selected item indices */
  selectedIndices?: number[];
  /** Selection change handler */
  onSelectionChange?: (indices: number[]) => void;
  /** Additional CSS class */
  className?: string;
}

type SpacingValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
```

### Examples

#### Horizontal List

::: code-with-tooltips

```tsx
<CardList
  direction="horizontal"
  spacing="lg"
  style={{ overflowX: 'auto' }}
>
  {items.map(item => (
    <Card key={item.id} style={{ minWidth: 300 }}>
      <Card.Media src={item.image} />
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
      </Card.Body>
    </Card>
  ))}
</CardList>
```

:::

#### With Dividers

::: code-with-tooltips

```tsx
<CardList
  dividers
  dividerColor="var(--border-color)"
  spacing="md"
>
  {items.map(item => (
    <Card key={item.id}>
      <Card.Body>{item.content}</Card.Body>
    </Card>
  ))}
</CardList>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const CardList = React.forwardRef<HTMLDivElement, CardListProps>(({
  children,
  spacing = 'md',
  direction = 'vertical',
  dividers = false,
  dividerColor = 'var(--border-color)',
  selectable = false,
  selectedIndices = [],
  onSelectionChange,
  className,
  ...props
}, ref) => {
  const handleItemClick = (index: number) => {
    if (!selectable) return;
    
    const newSelection = selectedIndices.includes(index)
      ? selectedIndices.filter(i => i !== index)
      : [...selectedIndices, index];
    
    onSelectionChange?.(newSelection);
  };
  
  return (
    <div
      ref={ref}
      className={clsx(
        'card-list',
        `card-list--${direction}`,
        { 'card-list--dividers': dividers },
        className
      )}
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: typeof spacing === 'number' ? spacing : `var(--spacing-${spacing})`
      }}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <div
          className={clsx('card-list__item', {
            'card-list__item--selected': selectedIndices.includes(index)
          })}
          onClick={() => handleItemClick(index)}
          role={selectable ? 'option' : undefined}
          aria-selected={selectable ? selectedIndices.includes(index) : undefined}
        >
          {child}
          {dividers && index < React.Children.count(children) - 1 && (
            <div
              className="card-list__divider"
              style={{
                backgroundColor: dividerColor
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
});
```

:::

## Styling

### Base Styles

::: code-with-tooltips

```scss
.card-list {
  // Container styles
  width: 100%;
  
  // Direction variants
  &--vertical {
    flex-direction: column;
  }
  
  &--horizontal {
    flex-direction: row;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    // Hide scrollbar in Firefox
    scrollbar-width: none;
    
    // Hide scrollbar in Chrome/Safari
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  // Item styles
  &__item {
    position: relative;
    flex-shrink: 0;
    
    // Selected state
    &--selected {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    
    // Hover state
    &:hover {
      z-index: 1;
    }
  }
  
  // Divider styles
  &--dividers {
    .card-list__item {
      &:not(:last-child) {
        border-bottom: 1px solid var(--border-color);
      }
    }
    
    &.card-list--horizontal {
      .card-list__item:not(:last-child) {
        border-bottom: none;
        border-right: 1px solid var(--border-color);
      }
    }
  }
  
  // Spacing variations
  &--spacing {
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
import { render, screen, fireEvent } from '@testing-library/react';
import { CardList } from './CardList';

describe('CardList', () => {
  const mockItems = [
    <Card key={1}><Card.Body>Card 1</Card.Body></Card>,
    <Card key={2}><Card.Body>Card 2</Card.Body></Card>,
    <Card key={3}><Card.Body>Card 3</Card.Body></Card>
  ];

  it('renders children correctly', () => {
    render(<CardList>{mockItems}</CardList>);
    
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Card 3')).toBeInTheDocument();
  });

  it('handles selection', () => {
    const handleSelectionChange = jest.fn();
    
    render(
      <CardList
        selectable
        selectedIndices={[]}
        onSelectionChange={handleSelectionChange}
      >
        {mockItems}
      </CardList>
    );
    
    fireEvent.click(screen.getByText('Card 1'));
    expect(handleSelectionChange).toHaveBeenCalledWith([0]);
  });

  it('applies correct direction styles', () => {
    const { container } = render(
      <CardList direction="horizontal">
        {mockItems}
      </CardList>
    );
    
    expect(container.firstChild).toHaveClass('card-list--horizontal');
  });

  it('renders dividers when specified', () => {
    const { container } = render(
      <CardList dividers>
        {mockItems}
      </CardList>
    );
    
    const dividers = container.getElementsByClassName('card-list__divider');
    expect(dividers.length).toBe(2); // Two dividers for three items
  });
});
```

:::

## Accessibility

### Keyboard Navigation

::: code-with-tooltips

```tsx
const CardListWithKeyboard = React.forwardRef<HTMLDivElement, CardListProps>((props, ref) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!props.selectable) return;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        setFocusedIndex(prev => 
          Math.min(prev + 1, React.Children.count(props.children) - 1)
        );
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0) {
          props.onSelectionChange?.([focusedIndex]);
        }
        break;
    }
  };
  
  return (
    <div
      ref={ref}
      role="listbox"
      aria-orientation={props.direction === 'horizontal' ? 'horizontal' : 'vertical'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <CardList {...props} />
    </div>
  );
});
```

:::

## Performance Optimization

### Virtualization for Long Lists

::: code-with-tooltips

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualCardList = ({
  items,
  itemHeight,
  ...props
}: CardListProps & {
  items: any[];
  itemHeight: number;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5
  });
  
  return (
    <div ref={parentRef} style={{ height: '100%', overflow: 'auto' }}>
      <CardList
        {...props}
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: itemHeight,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </CardList>
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
<CardList spacing="md">
  {items.map(item => (
    <Card key={item.id} padding="md">
      <Card.Body>{item.content}</Card.Body>
    </Card>
  ))}
</CardList>

// DON'T: Mix spacing values
<CardList spacing="lg">
  <Card style={{ marginBottom: '8px' }}> {/* Inconsistent! */}
    <Card.Body>Content</Card.Body>
  </Card>
</CardList>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize list items
const MemoizedCard = memo(({ item }) => (
  <Card>
    <Card.Body>{item.content}</Card.Body>
  </Card>
));

// Usage
<CardList>
  {items.map(item => (
    <MemoizedCard key={item.id} item={item} />
  ))}
</CardList>

// DON'T: Create inline styles
<CardList>
  {items.map(item => (
    <div key={item.id} style={{ margin: '8px' }}> {/* Avoid! */}
      <Card>{item.content}</Card>
    </div>
  ))}
</CardList>
```

:::
