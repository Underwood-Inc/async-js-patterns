---
title: Spinner Component
description: Loading spinner animations for indicating processing states
category: Feedback
subcategory: Progress Indicators
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Loading
  - React
---

# Spinner Component

## Overview

The Spinner component provides a visual indicator for loading or processing states. It's designed for providing immediate feedback during data fetching, form submission, or any operation that requires user wait time.

## Key Features

- Multiple size options
- Various visual variants (circle, dots, pulse)
- Customizable colors and speed
- Optional overlay mode
- Accessible by default
- Reduced motion support

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface SpinnerProps {
  /** Size of the spinner */
  size?: 'small' | 'medium' | 'large';
  /** Accessible label for screen readers */
  label?: string;
  /** Color of the spinner */
  color?: 'primary' | 'secondary' | string;
  /** Animation speed */
  speed?: 'slow' | 'normal' | 'fast';
  /** Show spinner in a centered overlay */
  overlay?: boolean;
  /** Visual style variant */
  variant?: 'circle' | 'dots' | 'pulse';
  /** Additional CSS class */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | 'small' \| 'medium' \| 'large' | 'medium' | Size of the spinner |
| `label` | string | - | Accessible label for screen readers |
| `color` | 'primary' \| 'secondary' \| string | 'primary' | Color of the spinner |
| `speed` | 'slow' \| 'normal' \| 'fast' | 'normal' | Animation speed |
| `overlay` | boolean | false | Show spinner in a centered overlay |
| `variant` | 'circle' \| 'dots' \| 'pulse' | 'circle' | Visual style variant |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional styles |

## Usage

::: code-with-tooltips
```tsx
import { Spinner } from '@underwood/components';

export const SpinnerExample = () => {
  return (
    <Spinner
      size="medium"
      label="Loading content..."
    />
  );
};
```
:::

## Examples

### Basic Spinner

::: code-with-tooltips
```tsx
import { Spinner } from '@underwood/components';

export const BasicSpinnerExample = () => (
  <Spinner
    size="medium"
    label="Loading..."
  />
);
```
:::

### Overlay Spinner

::: code-with-tooltips
```tsx
import { Spinner } from '@underwood/components';

export const OverlaySpinnerExample = () => (
  <Spinner
    overlay
    size="large"
    label="Processing your request..."
  />
);
```
:::

### Custom Styled Spinner

::: code-with-tooltips
```tsx
import { Spinner } from '@underwood/components';

export const CustomSpinnerExample = () => (
  <Spinner
    color="#6200ee"
    size="large"
    speed="fast"
    variant="dots"
  />
);
```
:::

### With Content Wrapper

::: code-with-tooltips
```tsx
import { Spinner } from '@underwood/components';
import { useState, useEffect } from 'react';

export const WrappedSpinnerExample = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        // Simulated content loading
        await new Promise(resolve => setTimeout(resolve, 2000));
        setContent('Content loaded successfully!');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '200px' }}>
      {loading && (
        <Spinner
          overlay
          label="Loading content..."
          variant="pulse"
        />
      )}
      {content && <div>{content}</div>}
    </div>
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Timing and Display**
   - Show immediately when loading starts
   - Use appropriate size for context
   - Consider loading duration
   - Handle loading states consistently

2. **Visual Design**
   - Choose appropriate variant for context
   - Maintain consistent styling
   - Use clear visual hierarchy
   - Consider animation speed

3. **Positioning**
   - Center in container when possible
   - Use overlay for full-page loading
   - Consider content layout impact
   - Handle mobile viewports

### Accessibility

1. **ARIA Attributes**
   - Use `role="status"` appropriately
   - Set `aria-busy="true"` during loading
   - Include descriptive labels
   - Handle focus management

2. **Motion and Animation**
   - Respect reduced motion preferences
   - Use appropriate animation speeds
   - Consider animation impact
   - Provide static alternatives

3. **Screen Readers**
   - Announce loading states
   - Update status appropriately
   - Use clear descriptions
   - Consider loading duration

### Performance

1. **Animation**
   - Use CSS animations when possible
   - Optimize animation frames
   - Handle cleanup properly
   - Consider battery impact

2. **Resource Management**
   - Clean up on unmount
   - Handle state changes efficiently
   - Manage multiple instances
   - Optimize render cycles

## Related Components

- [Progress](/react-component-patterns/feedback/progress-indicators/progress.md) - For showing determinate progress
- [LoadingBar](/react-component-patterns/feedback/progress-indicators/loading-bar.md) - For page-level loading indicators
- [Skeleton](/react-component-patterns/feedback/progress-indicators/skeleton.md) - For content loading placeholders
- [CircularProgress](/react-component-patterns/feedback/progress-indicators/circular-progress.md) - For circular progress indicators