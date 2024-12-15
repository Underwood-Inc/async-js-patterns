---
title: Menu Component
description: Flexible menu component for navigation and dropdown interfaces
date: 2024-01-01
author: Underwood Inc
tags:
  - Navigation
  - Menu
  - Dropdown
  - React
---

# Menu Component

## Overview

The Menu component provides a flexible solution for navigation menus, dropdown menus, and context menus. It supports keyboard navigation, nested menus, and various styling options.

## Usage

### Basic Menu

::: code-with-tooltips
```tsx
import { Menu } from '@/components/navigation';

<Menu>
  <Menu.Item>Home</Menu.Item>
  <Menu.Item>About</Menu.Item>
  <Menu.Item>Contact</Menu.Item>
</Menu>
```
:::

### API Reference

```tsx
interface MenuProps {
  /** Menu orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Whether the menu is expanded */
  expanded?: boolean;
  /** Callback when menu state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Additional CSS class */
  className?: string;
  /** Child elements */
  children: React.ReactNode;
}

interface MenuItemProps {
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the item is currently selected */
  selected?: boolean;
  /** Callback when item is selected */
  onSelect?: () => void;
  /** Child elements */
  children: React.ReactNode;
}
```

### Examples

#### Dropdown Menu

::: code-with-tooltips
```tsx
<Menu>
  <Menu.Trigger>Options ▾</Menu.Trigger>
  <Menu.Items>
    <Menu.Item onSelect={() => console.log('Edit')}>
      Edit
    </Menu.Item>
    <Menu.Item onSelect={() => console.log('Delete')}>
      Delete
    </Menu.Item>
  </Menu.Items>
</Menu>
```
:::

#### Navigation Menu

::: code-with-tooltips
```tsx
<Menu orientation="horizontal">
  <Menu.Item>
    <Link to="/">Home</Link>
  </Menu.Item>
  <Menu.Item>
    <Link to="/about">About</Link>
  </Menu.Item>
  <Menu.Submenu label="Products">
    <Menu.Item>Product 1</Menu.Item>
    <Menu.Item>Product 2</Menu.Item>
  </Menu.Submenu>
</Menu>
```
:::

## Best Practices

- Use semantic HTML elements
- Implement proper keyboard navigation
- Provide visual feedback for hover and focus states
- Handle mobile touch interactions appropriately

## Accessibility

- Follows WAI-ARIA Menu pattern
- Supports keyboard navigation (arrow keys, Enter, Escape)
- Provides proper ARIA attributes
- Manages focus appropriately

## Implementation

::: code-with-tooltips
```tsx
import React from 'react';
import clsx from 'clsx';

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(({
  orientation = 'vertical',
  expanded,
  onExpandedChange,
  className,
  children,
}, ref) => {
  return (
    <div
      ref={ref}
      role="menu"
      className={clsx(
        'menu',
        `menu--${orientation}`,
        { 'menu--expanded': expanded },
        className
      )}
    >
      {children}
    </div>
  );
});

Menu.displayName = 'Menu';
```
:::

## Related Components

- [Tabs](./tabs.md)
- [Breadcrumb](./breadcrumb.md)
- [Dropdown](../overlay/contextual-overlays/dropdown.md)