---
title: List Component
description: Versatile list component for displaying collections of items
category: Data
subcategory: Lists & Cards
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - List
  - React
---

# List Component

## Overview

The List component provides a flexible way to display collections of items. It serves as the foundation for more specialized list components and supports various layouts, item customization, and interaction patterns.

## Key Features

- Vertical and horizontal layouts
- Item selection
- Custom item rendering
- Keyboard navigation
- Accessible by default
- Responsive design
- Loading states
- Empty states

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

interface Item {
  id: string | number;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export interface ListProps<T = Item> {
  /** Array of items */
  items: T[];
  /** Custom render function for items */
  renderItem: (_item: T) => ReactNode;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** Whether items are selectable */
  selectable?: boolean;
  /** Selected items */
  selectedItems?: T[];
  /** Selection change handler */
  onSelectionChange?: (_items: T[]) => void;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Whether to show dividers */
  dividers?: boolean;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Additional CSS class */
  className?: string;
}

export interface ListItemProps<T = Item> {
  /** Item data */
  item: T;
  /** Whether item is selected */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | T[] | - | Array of items to display |
| `renderItem` | function | - | Custom item renderer |
| `layout` | string | 'vertical' | Layout direction |
| `selectable` | boolean | false | Enable item selection |
| `selectedItems` | T[] | [] | Selected items array |
| `onSelectionChange` | function | - | Selection change handler |
| `loading` | boolean | false | Loading state |
| `error` | string | - | Error message |
| `emptyMessage` | string | 'No items' | Empty state message |
| `dividers` | boolean | false | Show item dividers |
| `size` | string | 'medium' | Size variant |

## Usage

### Basic List

::: code-with-tooltips
```tsx
import { List, ListItem } from '@/components/data';

export const BasicListExample = () => {
  const items: Item[] = [
    { id: '1', title: 'Item 1', description: 'Description 1' },
    { id: '2', title: 'Item 2', description: 'Description 2' },
  ];

  return (
    <List
      items={items}
      renderItem={(item) => (
        <ListItem
          item={item}
          onClick={() => console.log('Clicked:', item.title)}
        />
      )}
    />
  );
};
```
:::

### With Selection

::: code-with-tooltips
```tsx
import { List, ListItem } from '@/components/data';
import { useState } from 'react';

export const SelectableListExample = () => {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const items: Item[] = [
    { 
      id: '1', 
      title: 'Item 1', 
      description: 'Description 1',
      icon: <Icon name="document" />
    },
    { 
      id: '2', 
      title: 'Item 2', 
      description: 'Description 2',
      icon: <Icon name="folder" />
    },
  ];

  return (
    <List
      items={items}
      selectable
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems}
      renderItem={(item) => (
        <ListItem
          item={item}
          selected={selectedItems.includes(item)}
        />
      )}
    />
  );
};
```
:::

### With Loading and Error States

::: code-with-tooltips
```tsx
import { List } from '@/components/data';
import { useState, useEffect } from 'react';

export const AsyncListExample = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <List
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No items found"
      renderItem={(item) => (
        <ListItem
          title={item.title}
          description={item.description}
        />
      )}
    />
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Layout & Structure**
   - Use consistent item layouts
   - Group related items
   - Handle long content
   - Consider item density

2. **Interaction Design**
   - Clear selection states
   - Intuitive keyboard nav
   - Handle hover states
   - Support touch devices

3. **State Management**
   - Handle loading states
   - Show error messages
   - Display empty states
   - Manage selection

### Accessibility

1. **Semantic Structure**
   - Use proper list markup
   - Include ARIA roles
   - Handle focus states
   - Support screen readers

2. **Keyboard Navigation**
   - Arrow key navigation
   - Selection shortcuts
   - Tab order
   - Focus indicators

3. **Screen Readers**
   - Announce selection
   - Provide context
   - Describe actions
   - Handle live updates

### Performance

1. **Rendering**
   - Optimize item renders
   - Handle large lists
   - Manage selection
   - Clean up listeners

2. **State Updates**
   - Batch selection changes
   - Optimize re-renders
   - Handle updates
   - Cache results

## Related Components

- [VirtualList](./virtual-list.md) - For large datasets
- [InfiniteList](./infinite-list.md) - For dynamic loading
- [Table](../tables/table.md) - For tabular data
- [Card](./card.md) - For rich content display
