---
title: List Component
description: Versatile list component for displaying collections of items
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - List
  - React
---

# List Component

## Overview

The List component provides a flexible way to display collections of items. It supports various layouts, item customization, and interaction patterns.

## Usage

### Basic List

::: code-with-tooltips

```tsx
import { List } from '@/components/data';

const items = [
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' },
];

<List
  items={items}
  renderItem={(item) => (
    <div className="list-item">{item.title}</div>
  )}
/>
```

:::

### API Reference

```tsx
interface ListProps<T> {
  /** Array of items */
  items: T[];
  /** Custom render function for items */
  renderItem: (item: T) => React.ReactNode;
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** Whether items are selectable */
  selectable?: boolean;
  /** Selected items */
  selectedItems?: T[];
  /** Selection change handler */
  onSelectionChange?: (items: T[]) => void;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Selection

::: code-with-tooltips

```tsx
<List
  items={items}
  selectable
  selectedItems={selectedItems}
  onSelectionChange={setSelectedItems}
  renderItem={(item) => (
    <ListItem
      title={item.title}
      description={item.description}
      icon={item.icon}
    />
  )}
/>
```

:::

## Best Practices

- Use consistent item layouts
- Handle empty states
- Implement proper loading states
- Support keyboard navigation
- Consider item density

## Accessibility

- Use semantic list markup
- Support keyboard interaction
- Manage focus properly
- Include proper ARIA attributes
- Handle selection states

## Implementation

::: code-with-tooltips

```tsx
export const List = <T extends { id: string | number }>({
  items,
  renderItem,
  layout = 'vertical',
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  className,
}: ListProps<T>) => {
  return (
    <ul
      className={clsx(
        'list',
        `list--${layout}`,
        { 'list--selectable': selectable },
        className
      )}
      role="listbox"
      aria-multiselectable={selectable}
    >
      {items.map((item) => (
        <li
          key={item.id}
          role="option"
          aria-selected={selectedItems.includes(item)}
          onClick={() => {
            if (selectable) {
              const newSelection = selectedItems.includes(item)
                ? selectedItems.filter(i => i !== item)
                : [...selectedItems, item];
              onSelectionChange?.(newSelection);
            }
          }}
        >
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
};
```

:::

## Related Components

- [VirtualList](./virtual-list.md)
- [Table](./table.md)
- [Card](./card.md)
