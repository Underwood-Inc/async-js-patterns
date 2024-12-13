---
title: ContextMenu Component
description: Right-click menu for contextual actions and commands
category: Overlay
subcategory: Contextual Overlays
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Overlay
  - ContextMenu
  - React
---

# ContextMenu Component

## Overview

The ContextMenu component displays a menu of actions when users right-click on an element. It provides quick access to contextual commands and actions specific to the clicked element.

## Key Features

- Right-click activation
- Keyboard shortcuts support
- Nested submenus
- Item grouping
- Icons and keyboard shortcuts
- Focus management
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips

```tsx
import { ReactNode, CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

export interface ContextMenuProps {
  /** Element that triggers the context menu */
  children: ReactNode;
  /** Menu items configuration */
  items: ContextMenuItem[];
  /** Whether to prevent default context menu */
  preventDefault?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Custom trigger event handler */
  onTrigger?: (_e: ReactMouseEvent) => void;
}

export interface ContextMenuItem {
  /** Item label */
  label: string;
  /** Item click handler */
  onClick?: () => void;
  /** Item icon */
  icon?: ReactNode;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Nested submenu items */
  items?: ContextMenuItem[];
  /** Item type (for separators) */
  type?: 'item' | 'separator';
}
```

:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Element that triggers the context menu |
| `items` | ContextMenuItem[] | - | Menu items configuration |
| `preventDefault` | boolean | true | Whether to prevent default context menu |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |
| `onTrigger` | function | - | Custom trigger event handler |

## Usage

::: code-with-tooltips

```tsx
import { ContextMenu } from '@underwood/components';

export const ContextMenuExample = () => {
  const menuItems = [
    {
      label: 'Cut',
      shortcut: '⌘X',
      onClick: () => {
        // Handle cut action
      }
    },
    {
      label: 'Copy',
      shortcut: '⌘C',
      onClick: () => {
        // Handle copy action
      }
    },
    {
      label: 'Paste',
      shortcut: '⌘V',
      onClick: () => {
        // Handle paste action
      }
    }
  ];

  return (
    <ContextMenu items={menuItems}>
      <div style={{ padding: 16 }}>
        Right-click me
      </div>
    </ContextMenu>
  );
};
```

:::

## Examples

### Basic Context Menu

::: code-with-tooltips

```tsx
import { ContextMenu } from '@underwood/components';

export const BasicContextMenuExample = () => {
  const menuItems = [
    { 
      label: 'Edit', 
      onClick: () => {
        // Handle edit action
      }
    },
    { 
      label: 'Delete', 
      onClick: () => {
        // Handle delete action
      }
    },
    { type: 'separator' },
    { 
      label: 'Share', 
      onClick: () => {
        // Handle share action
      }
    }
  ];

  return (
    <ContextMenu items={menuItems}>
      <div>Right-click for options</div>
    </ContextMenu>
  );
};
```

:::

### With Icons and Shortcuts

::: code-with-tooltips

```tsx
import { ContextMenu } from '@underwood/components';
import { EditIcon, DeleteIcon, ShareIcon } from '@underwood/icons';

export const IconContextMenuExample = () => {
  const menuItems = [
    {
      label: 'Edit',
      icon: <EditIcon />,
      shortcut: '⌘E',
      onClick: () => {
        // Handle edit action
      }
    },
    {
      label: 'Delete',
      icon: <DeleteIcon />,
      shortcut: '⌫',
      onClick: () => {
        // Handle delete action
      }
    },
    { type: 'separator' },
    {
      label: 'Share',
      icon: <ShareIcon />,
      shortcut: '⌘S',
      onClick: () => {
        // Handle share action
      }
    }
  ];

  return (
    <ContextMenu items={menuItems}>
      <div>Right-click for options</div>
    </ContextMenu>
  );
};
```

:::

### Nested Menu

::: code-with-tooltips

```tsx
import { ContextMenu } from '@underwood/components';

export const NestedContextMenuExample = () => {
  const menuItems = [
    {
      label: 'File',
      items: [
        { 
          label: 'New', 
          onClick: () => {
            // Handle new action
          }
        },
        { 
          label: 'Open', 
          onClick: () => {
            // Handle open action
          }
        },
        { 
          label: 'Save', 
          onClick: () => {
            // Handle save action
          }
        }
      ]
    },
    {
      label: 'Edit',
      items: [
        { 
          label: 'Cut', 
          onClick: () => {
            // Handle cut action
          }
        },
        { 
          label: 'Copy', 
          onClick: () => {
            // Handle copy action
          }
        },
        { 
          label: 'Paste', 
          onClick: () => {
            // Handle paste action
          }
        }
      ]
    }
  ];

  return (
    <ContextMenu items={menuItems}>
      <div>Right-click for nested menu</div>
    </ContextMenu>
  );
};
```

:::

## Best Practices

### Usage Guidelines

1. **Menu Structure**
   - Group related items
   - Use logical separators
   - Keep menus concise
   - Order by frequency

2. **Visual Design**
   - Maintain consistent styling
   - Use clear icons
   - Show keyboard shortcuts
   - Handle long labels

3. **Interaction**
   - Support keyboard navigation
   - Handle nested menus
   - Provide visual feedback
   - Consider touch devices

### Accessibility

1. **ARIA Attributes**
   - Use `role="menu"` appropriately
   - Set proper aria-labels
   - Handle menu state
   - Support focus management

2. **Keyboard Navigation**
   - Support arrow keys
   - Handle Enter/Space
   - Enable keyboard shortcuts
   - Support Escape key

3. **Screen Readers**
   - Announce menu state
   - Describe menu items
   - Handle nested menus
   - Provide context

### Performance

1. **Rendering**
   - Lazy load nested menus
   - Optimize positioning
   - Handle window resize
   - Clean up listeners

2. **State Management**
   - Handle menu state efficiently
   - Manage focus properly
   - Clean up on unmount
   - Optimize re-renders

## Related Components

- [Dropdown](./dropdown.md) - For selection menus
- [Popover](./popover.md) - For general overlays
- [Menu](../../navigation/menu.md) - For navigation menus
