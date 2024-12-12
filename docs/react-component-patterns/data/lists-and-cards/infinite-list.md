---
title: InfiniteList Component
description: List component with infinite scrolling and dynamic data loading capabilities
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - List
  - Infinite Scroll
  - React
---

# InfiniteList Component

## Overview

The InfiniteList component provides infinite scrolling functionality with dynamic data loading. It efficiently handles large datasets by loading data in chunks as the user scrolls, with support for both forward and backward loading.

## Usage

### Basic InfiniteList

::: code-with-tooltips

```tsx
import { InfiniteList } from '@/components/data';

const MyList = () => {
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
          {item.title}
        </div>
      )}
    />
  );
};
```

:::

### API Reference

```tsx
interface InfiniteListProps<T> {
  /** Data fetching function */
  fetchData: (page: number) => Promise<T[]>;
  /** Number of items per page */
  pageSize?: number;
  /** Custom item renderer */
  renderItem: (item: T) => React.ReactNode;
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
  loadingPlaceholder?: React.ReactNode;
  /** Error placeholder */
  errorPlaceholder?: React.ReactNode;
  /** Empty state placeholder */
  emptyPlaceholder?: React.ReactNode;
  /** Scroll container ref */
  scrollContainerRef?: React.RefObject<HTMLElement>;
  /** Additional CSS class */
  className?: string;
}

interface InfiniteListRef {
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

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const InfiniteList = React.forwardRef<InfiniteListRef, InfiniteListProps>(({
  fetchData,
  pageSize = 20,
  renderItem,
  initialData = [],
  loading: controlledLoading,
  error: controlledError,
  threshold = 250,
  bidirectional = false,
  loadingPlaceholder = <DefaultLoadingPlaceholder />,
  errorPlaceholder = <DefaultErrorPlaceholder />,
  emptyPlaceholder = <DefaultEmptyPlaceholder />,
  scrollContainerRef,
  className
}, ref) => {
  const [items, setItems] = useState<T[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const loadMore = useCallback(async (page: number) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newItems = await fetchData(page);
      setItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length === pageSize);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setLoading(false);
    }
  }, [fetchData, loading, hasMore, pageSize]);
  
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef?.current || containerRef.current;
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < threshold;
    
    if (scrolledToBottom && !loading && hasMore) {
      loadMore(currentPage + 1);
    }
  }, [loadMore, currentPage, loading, hasMore, threshold]);
  
  useEffect(() => {
    const container = scrollContainerRef?.current || containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  useImperativeHandle(ref, () => ({
    reset: () => {
      setItems(initialData);
      setCurrentPage(1);
      setHasMore(true);
      setError(null);
    },
    refresh: async () => {
      setItems([]);
      setCurrentPage(1);
      setHasMore(true);
      await loadMore(1);
    },
    loadNext: () => loadMore(currentPage + 1),
    loadPrevious: async () => {
      if (!bidirectional || currentPage <= 1) return;
      
      try {
        const prevItems = await fetchData(currentPage - 1);
        setItems(prev => [...prevItems, ...prev]);
        setCurrentPage(prev => prev - 1);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load previous data'));
      }
    }
  }), [loadMore, currentPage, bidirectional, initialData]);
  
  if (error || controlledError) {
    return (
      <div className={clsx('infinite-list--error', className)}>
        {errorPlaceholder}
      </div>
    );
  }
  
  if (items.length === 0 && !loading && !controlledLoading) {
    return (
      <div className={clsx('infinite-list--empty', className)}>
        {emptyPlaceholder}
      </div>
    );
  }
  
  return (
    <div
      ref={containerRef}
      className={clsx('infinite-list', className)}
    >
      {bidirectional && currentPage > 1 && (
        <div className="infinite-list__load-previous">
          <button onClick={() => ref.current?.loadPrevious()}>
            Load Previous
          </button>
        </div>
      )}
      
      {items.map((item, index) => (
        <div key={index} className="infinite-list__item">
          {renderItem(item)}
        </div>
      ))}
      
      {(loading || controlledLoading) && (
        <div className="infinite-list__loading">
          {loadingPlaceholder}
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
.infinite-list {
  position: relative;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  // Item container
  &__item {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: var(--surface-hover);
    }
  }
  
  // Loading states
  &__loading {
    padding: var(--spacing-md);
    text-align: center;
    background: var(--surface-background);
    
    &--overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.8);
    }
  }
  
  // Load previous button
  &__load-previous {
    padding: var(--spacing-md);
    text-align: center;
    border-bottom: 1px solid var(--border-color);
    
    button {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      background: var(--surface-background);
      cursor: pointer;
      
      &:hover {
        background: var(--surface-hover);
      }
    }
  }
  
  // Error state
  &--error {
    padding: var(--spacing-xl);
    text-align: center;
    color: var(--text-danger);
  }
  
  // Empty state
  &--empty {
    padding: var(--spacing-xl);
    text-align: center;
    color: var(--text-secondary);
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { InfiniteList } from './InfiniteList';

describe('InfiniteList', () => {
  const mockFetchData = jest.fn();
  const mockItems = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Item ${i}`
  }));

  beforeEach(() => {
    mockFetchData.mockReset();
    mockFetchData.mockResolvedValue(mockItems);
  });

  const defaultProps = {
    fetchData: mockFetchData,
    renderItem: (item: typeof mockItems[0]) => (
      <div data-testid={`item-${item.id}`}>{item.title}</div>
    )
  };

  it('renders initial data', async () => {
    render(<InfiniteList {...defaultProps} initialData={mockItems.slice(0, 5)} />);
    
    expect(screen.getAllByTestId(/^item-/)).toHaveLength(5);
  });

  it('loads more data on scroll', async () => {
    render(<InfiniteList {...defaultProps} />);
    
    await act(async () => {
      const container = screen.getByRole('list');
      fireEvent.scroll(container, {
        target: {
          scrollTop: 1000,
          scrollHeight: 2000,
          clientHeight: 800
        }
      });
    });
    
    expect(mockFetchData).toHaveBeenCalledWith(2);
  });

  it('handles errors', async () => {
    mockFetchData.mockRejectedValue(new Error('Failed to fetch'));
    
    render(<InfiniteList {...defaultProps} />);
    
    await screen.findByText('Failed to fetch');
  });

  it('supports bidirectional loading', async () => {
    const ref = React.createRef<InfiniteListRef>();
    
    render(
      <InfiniteList
        {...defaultProps}
        bidirectional
        ref={ref}
        initialData={mockItems}
      />
    );
    
    await act(async () => {
      await ref.current?.loadPrevious();
    });
    
    expect(mockFetchData).toHaveBeenCalledWith(0);
  });

  it('exposes ref methods', async () => {
    const ref = React.createRef<InfiniteListRef>();
    
    render(<InfiniteList {...defaultProps} ref={ref} />);
    
    await act(async () => {
      await ref.current?.refresh();
    });
    
    expect(mockFetchData).toHaveBeenCalledWith(1);
  });
});
```

:::

### Integration Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { InfiniteList } from './InfiniteList';

const server = setupServer(
  rest.get('/api/items', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page'));
    return res(
      ctx.json(
        Array.from({ length: 20 }, (_, i) => ({
          id: page * 20 + i,
          title: `Item ${page * 20 + i}`
        }))
      )
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads and displays data from API', async () => {
  render(
    <InfiniteList
      fetchData={async (page) => {
        const res = await fetch(`/api/items?page=${page}`);
        return res.json();
      }}
      renderItem={(item) => <div>{item.title}</div>}
    />
  );
  
  await waitFor(() => {
    expect(screen.getByText('Item 0')).toBeInTheDocument();
  });
  
  fireEvent.scroll(window, { target: { scrollY: 1000 } });
  
  await waitFor(() => {
    expect(screen.getByText('Item 20')).toBeInTheDocument();
  });
});
```

:::

## Performance Optimization

### Windowing Integration

::: code-with-tooltips

```tsx
import { VirtualList } from './VirtualList';

const WindowedInfiniteList = ({
  fetchData,
  pageSize = 20,
  itemHeight = 50,
  ...props
}: InfiniteListProps & { itemHeight: number }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const loadMore = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newItems = await fetchData(Math.ceil(items.length / pageSize) + 1);
      setItems(prev => [...prev, ...newItems]);
    } finally {
      setLoading(false);
    }
  }, [items.length, loading, pageSize, fetchData]);
  
  return (
    <VirtualList
      items={items}
      itemHeight={itemHeight}
      renderItem={props.renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={3}
    />
  );
};
```

:::

### Debounced Scroll Handler

::: code-with-tooltips

```tsx
const useDebounceScroll = (callback: () => void, delay = 150) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);
};

// Usage in component
const debouncedHandleScroll = useDebounceScroll(handleScroll);
```

:::

## Accessibility

### ARIA Attributes

::: code-with-tooltips

```tsx
<div
  role="feed"
  aria-busy={loading}
  aria-live="polite"
  className={clsx('infinite-list', className)}
>
  {items.map((item, index) => (
    <div
      key={index}
      role="article"
      aria-posinset={index + 1}
      aria-setsize={-1} // Unknown total size
      className="infinite-list__item"
    >
      {renderItem(item)}
    </div>
  ))}
</div>
```

:::

## Integration Examples

### With React Query

::: code-with-tooltips

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

const InfiniteListWithQuery = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ({ pageParam = 1 }) => fetchItems(pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 20 ? pages.length + 1 : undefined;
    }
  });
  
  const items = data?.pages.flat() ?? [];
  
  return (
    <InfiniteList
      items={items}
      loading={isFetching}
      error={isError ? error : undefined}
      hasMore={hasNextPage}
      onLoadMore={() => fetchNextPage()}
      renderItem={(item) => (
        <div className="item">{item.title}</div>
      )}
    />
  );
};
```

:::

### With GraphQL

::: code-with-tooltips

```tsx
import { useQuery } from '@apollo/client';

const ITEMS_QUERY = gql`
  query GetItems($offset: Int!, $limit: Int!) {
    items(offset: $offset, limit: $limit) {
      id
      title
      description
    }
  }
`;

const InfiniteListWithGraphQL = () => {
  const { data, loading, error, fetchMore } = useQuery(ITEMS_QUERY, {
    variables: { offset: 0, limit: 20 }
  });
  
  const handleLoadMore = () => {
    fetchMore({
      variables: {
        offset: data.items.length,
        limit: 20
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          items: [...prev.items, ...fetchMoreResult.items]
        };
      }
    });
  };
  
  return (
    <InfiniteList
      items={data?.items ?? []}
      loading={loading}
      error={error}
      onLoadMore={handleLoadMore}
      renderItem={(item) => (
        <div className="item">{item.title}</div>
      )}
    />
  );
};
```

:::
