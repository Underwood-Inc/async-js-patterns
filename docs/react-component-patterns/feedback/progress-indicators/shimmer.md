---
title: Shimmer Component
description: Loading placeholder animation for content that is being loaded
category: Feedback
subcategory: Progress Indicators
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Loading
  - Animation
  - React
---

# Shimmer Component

## Overview

The Shimmer component provides a placeholder loading animation that mimics the shape and size of the content being loaded. It creates a smooth, wave-like animation effect that indicates content is being fetched.

## Key Features

- Content-aware shapes
- Customizable animation
- Multiple variants
- Responsive design
- Performance optimized
- Accessibility support

## Component API

### Props Interface

::: code-with-tooltips
```tsx
export interface ShimmerProps {
  /** Visual variant */
  variant?: 'text' | 'rect' | 'circle';
  /** Width of shimmer */
  width?: number | string;
  /** Height of shimmer */
  height?: number | string;
  /** Animation duration in ms */
  duration?: number;
  /** Whether to repeat animation */
  repeat?: boolean;
  /** Additional CSS class */
  className?: string;
}
```
:::

## Usage

### Basic Shimmer

::: code-with-tooltips
```tsx
import { Shimmer } from '@underwood/components';

export const BasicShimmerExample = () => (
  <Shimmer
    variant="text"
    width={200}
    height={20}
  />
);
```
:::

### Content Placeholder

::: code-with-tooltips
```tsx
import { Shimmer } from '@underwood/components';

export const ContentPlaceholderExample = () => (
  <div style={{ width: '300px' }}>
    <Shimmer variant="circle" width={50} height={50} />
    <div style={{ marginTop: '12px' }}>
      <Shimmer variant="text" width="80%" height={16} />
      <Shimmer variant="text" width="60%" height={16} style={{ marginTop: '8px' }} />
    </div>
  </div>
);
```
:::

## Best Practices

### Usage Guidelines

1. **Visual Design**
   - Match content dimensions
   - Consistent animation
   - Proper spacing
   - Layout stability

2. **Performance**
   - Optimize animations
   - Limit instances
   - Clean up timers
   - Handle unmounting

### Accessibility

1. **ARIA Support**
   - Use `aria-busy="true"`
   - Set `role="status"`
   - Include descriptions
   - Handle focus

2. **Reduced Motion**
   - Respect preferences
   - Provide alternatives
   - Manage animations
   - Consider impact

## Related Components

- [Skeleton](/react-component-patterns/feedback/progress-indicators/skeleton.md) - For static loading placeholders
- [Progress](/react-component-patterns/feedback/progress-indicators/progress.md) - For determinate progress
- [Spinner](/react-component-patterns/feedback/progress-indicators/spinner.md) - For loading spinners 