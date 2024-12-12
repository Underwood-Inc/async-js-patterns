---
title: Stack Component
description: Flexible stack layout component for vertical and horizontal content arrangement
date: 2024-01-01
author: Underwood Inc
tags:
  - Layout
  - Stack
  - Flexbox
  - React
---

# Stack Component

## Overview

The Stack component provides a simple way to arrange child elements vertically or horizontally with consistent spacing. It uses flexbox under the hood and supports various alignment and spacing options.

## Usage

### Basic Stack

::: code-with-tooltips
```tsx
import { Stack } from '@/components/layout';

// Vertical stack (default)
<Stack spacing="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

// Horizontal stack
<Stack direction="horizontal" spacing="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>
```
:::

### API Reference

```tsx
interface StackProps {
  /** Direction of the stack layout */
  direction?: 'vertical' | 'horizontal';
  /** Space between items */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Alignment of items along the cross axis */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Alignment of items along the main axis */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Whether to wrap items */
  wrap?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Child elements */
  children: React.ReactNode;
}
```

### Examples

#### With Different Spacing

::: code-with-tooltips
```tsx
<Stack spacing="xs">
  <div>Tight spacing</div>
  <div>Between items</div>
</Stack>

<Stack spacing="xl">
  <div>Wide spacing</div>
  <div>Between items</div>
</Stack>
```
:::

#### With Alignment

::: code-with-tooltips
```tsx
<Stack 
  direction="horizontal" 
  align="center" 
  justify="between"
>
  <div>Left</div>
  <div>Center</div>
  <div>Right</div>
</Stack>
```
:::

## Best Practices

- Use Stack for simple linear layouts
- Choose appropriate spacing based on content density
- Consider responsive behavior when using horizontal stacks
- Use semantic HTML elements as children

## Accessibility

- Stack preserves the natural DOM order
- Maintains proper focus order for interactive elements
- Supports RTL layouts automatically

## Implementation

::: code-with-tooltips
```tsx
import React from 'react';
import clsx from 'clsx';

export const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  spacing = 'md',
  align = 'start',
  justify = 'start',
  wrap = false,
  className,
  children,
}) => {
  return (
    <div
      className={clsx(
        'stack',
        `stack--${direction}`,
        `stack--spacing-${spacing}`,
        `stack--align-${align}`,
        `stack--justify-${justify}`,
        { 'stack--wrap': wrap },
        className
      )}
    >
      {children}
    </div>
  );
};
```
:::

## Related Components

- [Container](./container.md)
- [Grid](./grid.md)
- [Flex](./flex.md) 