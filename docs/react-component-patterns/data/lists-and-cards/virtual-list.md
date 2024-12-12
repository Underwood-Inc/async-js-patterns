---
title: VirtualList Component
description: High-performance list component for rendering large datasets using virtualization
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - List
  - Virtualization
  - Performance
  - React
---

# VirtualList Component

## Overview

The VirtualList component provides efficient rendering of large lists by only rendering items that are currently visible in the viewport. It supports both fixed and variable height items, smooth scrolling, and dynamic content updates.

## Usage

### Basic VirtualList

::: code-with-tooltips

```tsx
import { VirtualList } from '@/components/data';

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  content: `Item ${i}`
}));

<VirtualList
  items={items}
  height={400}
  itemHeight={40}
  renderItem={(item) => (
    <div className="list-item">{item.content}</div>
  )}
/>
```

:::

### API Reference

```tsx
interface VirtualListProps<T> {
  /** List items */
  items: T[];
  /** Container height */
  height: number;
  /** Item height (fixed) */
  itemHeight?: number;
  /** Get item height (variable) */
  getItemHeight?: (index: number) => number;
  /** Number of items to render beyond visible area */
  overscan?: number;
  /** Custom render function */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Scroll position change handler */
  onScroll?: (scrollTop: number) => void;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### Variable Height Items

::: code-with-tooltips

```tsx
<VirtualList
  items={items}
  height={400}
  getItemHeight={(index) => {
    // Return different heights based on content
    return items[index].content.length > 50 ? 80 : 40;
  }}
  renderItem={(item) => (
    <div className="list-item">
      <h3>{item.title}</h3>
      <p>{item.content}</p>
    </div>
  )}
/>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const VirtualList = React.forwardRef<HTMLDivElement, VirtualListProps>(({
  items,
  height,
  itemHeight = 40,
  getItemHeight,
  overscan = 3,
  renderItem,
  onScroll,
  className,
  ...props
}, ref) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const getSize = useCallback((index: number) => {
    return getItemHeight?.(index) ?? itemHeight;
  }, [getItemHeight, itemHeight]);
  
  const { virtualItems, totalSize } = useVirtualizer({
    count: items.length,
    getScrollElement: () => containerRef.current,
    estimateSize: getSize,
    overscan,
    scrollOffset: scrollTop
  });
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);
  
  return (
    <div
      ref={mergeRefs([ref, containerRef])}
      className={clsx('virtual-list', className)}
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
      {...props}
    >
      <div
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualItems.map(virtualItem => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
});
```

:::

## Styling

### Base Styles

::: code-with-tooltips

```scss
.virtual-list {
  // Container styles
  position: relative;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  
  // Hide scrollbar in Firefox
  scrollbar-width: none;
  
  // Hide scrollbar in Chrome/Safari
  &::-webkit-scrollbar {
    display: none;
  }
  
  // List item styles
  &__item {
    position: absolute;
    left: 0;
    width: 100%;
    will-change: transform;
    contain: content;
    
    // Optional: Add transitions for smooth updates
    transition: transform 0.2s;
  }
  
  // Loading state
  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  // Empty state
  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualList } from './VirtualList';

describe('VirtualList', () => {
  const mockItems = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    content: `Item ${i}`
  }));

  it('renders visible items', () => {
    render(
      <VirtualList
        items={mockItems}
        height={400}
        itemHeight={40}
        renderItem={(item) => (
          <div>{item.content}</div>
        )}
      />
    );
    
    // Only first few items should be rendered
    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 9')).toBeInTheDocument();
    expect(screen.queryByText('Item 50')).not.toBeInTheDocument();
  });

  it('handles scroll events', () => {
    const handleScroll = jest.fn();
    const { container } = render(
      <VirtualList
        items={mockItems}
        height={400}
        itemHeight={40}
        onScroll={handleScroll}
        renderItem={(item) => (
          <div>{item.content}</div>
        )}
      />
    );
    
    fireEvent.scroll(container.firstChild as Element, {
      target: { scrollTop: 500 }
    });
    
    expect(handleScroll).toHaveBeenCalledWith(500);
  });

  it('supports variable height items', () => {
    render(
      <VirtualList
        items={mockItems}
        height={400}
        getItemHeight={(index) => index % 2 === 0 ? 40 : 80}
        renderItem={(item) => (
          <div>{item.content}</div>
        )}
      />
    );
    
    const items = screen.getAllByText(/Item \d+/);
    expect(items.length).toBeGreaterThan(0);
  });
});
```

:::

## Performance Optimization

### Memory Usage

::: code-with-tooltips

```tsx
// DO: Memoize item renderer
const ItemRenderer = memo(({ item, style }) => (
  <div style={style}>
    {item.content}
  </div>
));

const VirtualList = ({ items, ...props }) => {
  const renderItem = useCallback((item, index) => (
    <ItemRenderer
      key={item.id}
      item={item}
      style={{
        height: getItemHeight(index)
      }}
    />
  ), [getItemHeight]);
  
  return (
    <VirtualList
      items={items}
      renderItem={renderItem}
      {...props}
    />
  );
};

// DON'T: Create new components inline
<VirtualList
  renderItem={(item) => (
    <div>{item.content}</div> // Creates new component every render
  )}
/>
```

:::

### Scroll Performance

::: code-with-tooltips

```tsx
// DO: Use CSS containment and will-change
const styles = {
  item: {
    contain: 'content',
    willChange: 'transform',
    transform: `translateY(${start}px)`
  }
};

// DON'T: Force reflow
const badStyles = {
  item: {
    top: `${start}px` // Forces reflow on scroll
  }
};

// DO: Debounce scroll handlers
const handleScroll = useDebouncedCallback(
  (scrollTop: number) => {
    onScroll?.(scrollTop);
  },
  100
);
```

:::

## Accessibility

### Keyboard Navigation

::: code-with-tooltips

```tsx
const VirtualList = React.forwardRef<HTMLDivElement, VirtualListProps>(({
  // ... other props
}, ref) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        // Scroll one item down
        containerRef.current?.scrollBy({
          top: itemHeight,
          behavior: 'smooth'
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Scroll one item up
        containerRef.current?.scrollBy({
          top: -itemHeight,
          behavior: 'smooth'
        });
        break;
      case 'PageDown':
        e.preventDefault();
        // Scroll one page down
        containerRef.current?.scrollBy({
          top: height,
          behavior: 'smooth'
        });
        break;
      case 'PageUp':
        e.preventDefault();
        // Scroll one page up
        containerRef.current?.scrollBy({
          top: -height,
          behavior: 'smooth'
        });
        break;
    }
  }, [height, itemHeight]);
  
  return (
    <div
      ref={mergeRefs([ref, containerRef])}
      tabIndex={0}
      role="list"
      onKeyDown={handleKeyDown}
      aria-label="Virtual scrolling list"
    >
      {/* ... content ... */}
    </div>
  );
});
```

:::

## Best Practices

### Usage Guidelines

::: code-with-tooltips

```tsx
// DO: Provide reasonable overscan
<VirtualList
  overscan={5} // Balance between smooth scrolling and memory
  items={items}
/>

// DON'T: Use for small lists
<VirtualList
  items={smallArray} // Use regular list for small datasets
/>

// DO: Handle loading states
<VirtualList
  items={items}
  loading={isLoading}
  loadingComponent={<Spinner />}
/>

// DON'T: Change item heights frequently
<VirtualList
  getItemHeight={(index) => {
    // Avoid dynamic height calculations that change often
    return Math.random() > 0.5 ? 40 : 80;
  }}
/>
```

:::
