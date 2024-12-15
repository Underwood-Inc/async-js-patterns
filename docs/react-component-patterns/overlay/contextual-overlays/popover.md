---
title: Popover Component
description: Context-sensitive overlay for displaying additional content
category: Overlay
subcategory: Contextual Overlays
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Overlay
  - Popover
  - React
---

# Popover Component

## Overview

The Popover component displays additional content in a floating overlay that is positioned relative to a trigger element. It's ideal for showing contextual information, forms, or actions without disrupting the main interface flow.

## Key Features

- Multiple positioning options
- Arrow indicator support
- Click and hover triggers
- Offset and flip behavior
- Portal rendering
- Focus management
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode, CSSProperties } from 'react';

export interface PopoverProps {
  /** Whether the popover is visible */
  open: boolean;
  /** Element that triggers the popover */
  trigger: ReactNode;
  /** Popover content */
  children: ReactNode;
  /** Preferred placement of the popover */
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'auto';
  /** Offset from the trigger element */
  offset?: number;
  /** Whether to show the arrow */
  arrow?: boolean;
  /** Trigger behavior */
  trigger?: 'click' | 'hover';
  /** Close handler */
  onClose?: () => void;
  /** Additional CSS class */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Whether the popover is visible |
| `trigger` | ReactNode | - | Element that triggers the popover |
| `children` | ReactNode | - | Popover content |
| `placement` | string | 'bottom' | Preferred placement of the popover |
| `offset` | number | 8 | Offset from the trigger element |
| `arrow` | boolean | true | Whether to show the arrow |
| `trigger` | string | 'click' | Trigger behavior |
| `onClose` | function | - | Close handler |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Usage

::: code-with-tooltips
```tsx
import { Popover, Button } from '@underwood/components';
import { useState } from 'react';

export const PopoverExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      trigger={
        <Button onClick={() => setOpen(!open)}>
          Click me
        </Button>
      }
      onClose={() => setOpen(false)}
    >
      <div style={{ padding: 16 }}>
        <h3>Popover Content</h3>
        <p>Additional information or actions can go here.</p>
      </div>
    </Popover>
  );
};
```
:::

## Examples

### Basic Popover

::: code-with-tooltips
```tsx
import { Popover, Button } from '@underwood/components';
import { useState } from 'react';

export const BasicPopoverExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      trigger={
        <Button onClick={() => setOpen(!open)}>
          More Info
        </Button>
      }
      onClose={() => setOpen(false)}
    >
      <div style={{ padding: 16 }}>
        <p>Additional information about this feature.</p>
      </div>
    </Popover>
  );
};
```
:::

### Hover Trigger

::: code-with-tooltips
```tsx
import { Popover, Text } from '@underwood/components';

export const HoverPopoverExample = () => (
  <Popover
    trigger={
      <Text>Hover over me</Text>
    }
    trigger="hover"
    placement="top"
  >
    <div style={{ padding: 8 }}>
      <p>Hover content</p>
    </div>
  </Popover>
);
```
:::

### With Form Content

::: code-with-tooltips
```tsx
import { Popover, Button, Input } from '@underwood/components';
import { useState } from 'react';

export const FormPopoverExample = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      trigger={
        <Button onClick={() => setOpen(!open)}>
          Edit Profile
        </Button>
      }
      onClose={() => setOpen(false)}
      placement="bottom-start"
    >
      <form onSubmit={handleSubmit} style={{ padding: 16 }}>
        <Input
          label="Name"
          defaultValue="John Doe"
        />
        <Button type="submit">
          Save
        </Button>
      </form>
    </Popover>
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Content Strategy**
   - Keep content focused and relevant
   - Use appropriate sizing
   - Consider content hierarchy
   - Handle overflow properly

2. **Positioning**
   - Choose logical placement
   - Handle viewport constraints
   - Consider mobile viewports
   - Maintain visibility

3. **Interaction**
   - Use appropriate triggers
   - Handle click outside
   - Manage focus properly
   - Consider touch interactions

### Accessibility

1. **ARIA Attributes**
   - Use `role="dialog"` appropriately
   - Set proper aria-labelledby
   - Include descriptive labels
   - Handle focus management

2. **Keyboard Navigation**
   - Support Tab navigation
   - Handle Escape key
   - Maintain focus trap
   - Support arrow keys

3. **Screen Readers**
   - Announce state changes
   - Provide context
   - Include descriptions
   - Handle dynamic updates

### Performance

1. **Rendering**
   - Use portals efficiently
   - Optimize positioning updates
   - Handle resize events
   - Clean up listeners

2. **State Management**
   - Handle open/close efficiently
   - Manage event handlers
   - Clean up on unmount
   - Optimize re-renders

## Related Components

- [Tooltip](./tooltip.md) - For simple hover descriptions
- [ContextMenu](./context-menu.md) - For right-click menus
- [Dropdown](./dropdown.md) - For selection menus
- [Modal](../modals/modal.md) - For larger overlay content 