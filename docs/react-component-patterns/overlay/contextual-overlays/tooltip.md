---
title: Tooltip Component
description: Simple hover tooltips for providing additional information
category: Overlay
subcategory: Contextual Overlays
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Overlay
  - Tooltip
  - React
---

# Tooltip Component

## Overview

The Tooltip component displays brief, informative text when users hover over or focus on an element. It provides additional context or explanations without cluttering the interface.

## Key Features

- Multiple positioning options
- Customizable delays
- Arrow indicator support
- Touch device support
- Portal rendering
- Focus management
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips

```tsx
import { ReactNode, CSSProperties } from 'react';

export interface TooltipProps {
  /** Element that triggers the tooltip */
  children: ReactNode;
  /** Tooltip content */
  content: ReactNode;
  /** Preferred placement of the tooltip */
  placement?: 'top' | 'right' | 'bottom' | 'left';
  /** Delay before showing tooltip (ms) */
  showDelay?: number;
  /** Delay before hiding tooltip (ms) */
  hideDelay?: number;
  /** Whether to show the arrow */
  arrow?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Whether tooltip is disabled */
  disabled?: boolean;
}
```

:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Element that triggers the tooltip |
| `content` | ReactNode | - | Tooltip content |
| `placement` | string | 'top' | Preferred placement of the tooltip |
| `showDelay` | number | 200 | Delay before showing tooltip (ms) |
| `hideDelay` | number | 0 | Delay before hiding tooltip (ms) |
| `arrow` | boolean | true | Whether to show the arrow |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |
| `disabled` | boolean | false | Whether tooltip is disabled |

## Usage

::: code-with-tooltips

```tsx
import { Tooltip, Button } from '@underwood/components';

export const TooltipExample = () => (
  <Tooltip content="Click to save your changes">
    <Button>
      Save
    </Button>
  </Tooltip>
);
```

:::

## Examples

### Basic Tooltip

::: code-with-tooltips

```tsx
import { Tooltip, IconButton } from '@underwood/components';

export const BasicTooltipExample = () => (
  <Tooltip content="Add to favorites">
    <IconButton aria-label="Add to favorites">
      ★
    </IconButton>
  </Tooltip>
);
```

:::

### Custom Placement

::: code-with-tooltips

```tsx
import { Tooltip, Button } from '@underwood/components';

export const PlacementTooltipExample = () => (
  <Tooltip 
    content="This appears on the right"
    placement="right"
  >
    <Button>
      Hover Me
    </Button>
  </Tooltip>
);
```

:::

### With Custom Delays

::: code-with-tooltips

```tsx
import { Tooltip, Link } from '@underwood/components';

export const DelayedTooltipExample = () => (
  <Tooltip 
    content="Opens in a new window"
    showDelay={500}
    hideDelay={200}
  >
    <Link 
      href="https://example.com" 
      target="_blank"
      rel="noopener noreferrer"
    >
      External Link
    </Link>
  </Tooltip>
);
```

:::

## Best Practices

### Usage Guidelines

1. **Content Strategy**
   - Keep content brief and clear
   - Use for supplementary information
   - Avoid essential content
   - Consider mobile usage

2. **Timing**
   - Use appropriate delays
   - Consider reading time
   - Handle quick interactions
   - Prevent flicker

3. **Positioning**
   - Choose logical placement
   - Handle viewport edges
   - Consider content length
   - Maintain visibility

### Accessibility

1. **ARIA Attributes**
   - Use `role="tooltip"` appropriately
   - Set proper aria-describedby
   - Include descriptive labels
   - Handle focus states

2. **Keyboard Navigation**
   - Support focus triggers
   - Handle Escape key
   - Consider arrow keys
   - Maintain focus visibility

3. **Screen Readers**
   - Announce tooltip content
   - Provide context
   - Handle dynamic updates
   - Consider mobile screen readers

### Performance

1. **Rendering**
   - Use portals efficiently
   - Optimize show/hide
   - Handle resize events
   - Clean up listeners

2. **State Management**
   - Handle hover states efficiently
   - Manage timers properly
   - Clean up on unmount
   - Optimize re-renders

## Related Components

- [Popover](./popover.md) - For more complex overlays
- [ContextMenu](./context-menu.md) - For right-click menus
- [Dropdown](./dropdown.md) - For selection menus
