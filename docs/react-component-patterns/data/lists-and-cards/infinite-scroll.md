---
title: InfiniteScroll Component
description: Component for loading content progressively as the user scrolls
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Scroll
  - Loading
  - React
---

# InfiniteScroll Component

## Overview

The InfiniteScroll component enables progressive loading of content as users scroll, providing a seamless experience for handling large datasets.

## Usage

### Basic InfiniteScroll

::: code-with-tooltips

```tsx
import { InfiniteScroll } from '@/components/data';

const [items, setItems] = useState<Item[]>([]);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const newItems = await fetchMoreItems();
  setItems(prev => [...prev, ...newItems]);
  setHasMore(newItems.length > 0);
};

<InfiniteScroll
  items={items}
  hasMore={hasMore}
  onLoadMore={loadMore}
  loading={<Spinner />}
>
  {(item) => (
    <Card key={item.id}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </Card>
  )}
</InfiniteScroll>
```

:::

### API Reference

```tsx
interface InfiniteScrollProps<T> {
  /** Items to render */
  items: T[];
  /** Whether more items can be loaded */
  hasMore: boolean;
  /** Load more handler */
  onLoadMore: () => Promise<void>;
  /** Loading indicator */
  loading?: React.ReactNode;
  /** Error state */
  error?: React.ReactNode;
  /** Retry handler */
  onRetry?: () => void;
  /** Item renderer */
  children: (item: T) => React.ReactNode;
  /** Threshold before loading more */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Error Handling

::: code-with-tooltips

```tsx
<InfiniteScroll
  items={items}
  hasMore={hasMore}
  onLoadMore={loadMore}
  loading={<Spinner />}
  error={
    <Alert severity="error">
      Failed to load items
      <Button onClick={handleRetry}>Retry</Button>
    </Alert>
  }
  onRetry={handleRetry}
>
  {(item) => <ItemCard item={item} />}
</InfiniteScroll>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const InfiniteScroll = React.forwardRef<HTMLDivElement, InfiniteScrollProps>(({
  items,
  hasMore,
  onLoadMore,
  loading,
  error,
  onRetry,
  children,
  threshold = 0.8,
  rootMargin = '100px',
  className,
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  
  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || loadError) return;
    
    try {
      setIsLoading(true);
      setLoadError(null);
      await onLoadMore();
    } catch (error) {
      setLoadError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, loadError, onLoadMore]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => observer.disconnect();
  }, [handleLoadMore, threshold, rootMargin]);
  
  return (
    <div
      ref={ref}
      className={clsx('infinite-scroll', className)}
      {...props}
    >
      <div className="infinite-scroll__content">
        {items.map(item => children(item))}
      </div>
      
      {loadError && error && (
        <div className="infinite-scroll__error">
          {error}
          {onRetry && (
            <button
              className="infinite-scroll__retry"
              onClick={() => {
                setLoadError(null);
                onRetry();
              }}
            >
              Retry
            </button>
          )}
        </div>
      )}
      
      {hasMore && !loadError && (
        <div ref={loaderRef} className="infinite-scroll__loader">
          {isLoading && loading}
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
.infinite-scroll {
  width: 100%;
  
  // Content container
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  // Loading indicator
  &__loader {
    display: flex;
    justify-content: center;
    padding: var(--spacing-lg);
  }
  
  // Error state
  &__error {
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    background: var(--error-background);
    color: var(--error-color);
    text-align: center;
  }
  
  // Retry button
  &__retry {
    margin-top: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--border-radius-sm);
    background: var(--error-color);
    color: white;
    cursor: pointer;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.9;
    }
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { InfiniteScroll } from './InfiniteScroll';

describe('InfiniteScroll', () => {
  const mockItems = [
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' }
  ];

  it('renders items correctly', () => {
    render(
      <InfiniteScroll
        items={mockItems}
        hasMore={true}
        onLoadMore={jest.fn()}
      >
        {(item) => <div>{item.title}</div>}
      </InfiniteScroll>
    );
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('calls onLoadMore when intersecting', async () => {
    const handleLoadMore = jest.fn();
    const intersectionObserverMock = jest.fn((callback) => ({
      observe: () => callback([{ isIntersecting: true }]),
      disconnect: jest.fn()
    }));
    
    window.IntersectionObserver = intersectionObserverMock;
    
    render(
      <InfiniteScroll
        items={mockItems}
        hasMore={true}
        onLoadMore={handleLoadMore}
      >
        {(item) => <div>{item.title}</div>}
      </InfiniteScroll>
    );
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(handleLoadMore).toHaveBeenCalled();
  });

  it('handles errors correctly', () => {
    render(
      <InfiniteScroll
        items={mockItems}
        hasMore={true}
        onLoadMore={jest.fn()}
        error="Error loading items"
        onRetry={jest.fn()}
      >
        {(item) => <div>{item.title}</div>}
      </InfiniteScroll>
    );
    
    expect(screen.getByText('Error loading items')).toBeInTheDocument();
  });
});
```

:::

## Accessibility

### ARIA Attributes

::: code-with-tooltips

```tsx
const InfiniteScroll = React.forwardRef<HTMLDivElement, InfiniteScrollProps>(({
  // ... other props
}, ref) => {
  return (
    <div
      ref={ref}
      role="feed"
      aria-busy={isLoading}
      aria-live="polite"
    >
      <div role="list">
        {items.map(item => (
          <div key={item.id} role="listitem">
            {children(item)}
          </div>
        ))}
      </div>
      {/* ... */}
    </div>
  );
});
```

:::

## Best Practices

### Usage Guidelines

::: code-with-tooltips

```tsx
// DO: Use appropriate threshold
<InfiniteScroll
  threshold={0.5} // Load when item is 50% visible
  rootMargin="100px" // Start loading 100px before visible
/>

// DON'T: Load too many items at once
const loadMore = async () => {
  const newItems = await fetchItems(page, 100); // Too many items!
};

// DO: Handle loading states
<InfiniteScroll
  loading={
    <Skeleton
      height={200}
      count={3}
      className="loading-placeholder"
    />
  }
/>

// DON'T: Modify items during render
<InfiniteScroll>
  {(item) => {
    const processed = processItem(item); // Avoid processing in render
    return <ItemCard item={processed} />;
  }}
</InfiniteScroll>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize item renderer
const ItemRenderer = memo(({ item }) => (
  <Card>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </Card>
));

<InfiniteScroll items={items}>
  {(item) => <ItemRenderer item={item} />}
</InfiniteScroll>

// DON'T: Create new functions inline
<InfiniteScroll
  onLoadMore={() => fetchItems()} // Creates new function every render
  onRetry={() => handleRetry()} // Creates new function every render
/>

// DO: Use windowing for large lists
const VirtualizedScroll = ({ items }) => {
  const rowRenderer = useCallback(({ index, style }) => (
    <div style={style}>
      <ItemCard item={items[index]} />
    </div>
  ), [items]);
  
  return (
    <InfiniteScroll
      items={items}
      virtualization={{
        height: 600,
        itemHeight: 100,
        overscanCount: 3
      }}
    >
      {rowRenderer}
    </InfiniteScroll>
  );
};
```

:::
