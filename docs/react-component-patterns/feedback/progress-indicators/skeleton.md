---
title: Skeleton Component
description: Placeholder loading states for content that is being loaded
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

# Skeleton Component

## Overview

The Skeleton component provides a placeholder preview of content while data is being loaded. It helps create a smoother user experience by reducing perceived loading time and preventing layout shifts during content loading.

## Key Features

- Multiple shape variants (text, rectangular, circular)
- Customizable dimensions
- Animated loading effects
- Responsive width support
- Layout preservation
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { CSSProperties } from 'react';

export interface SkeletonProps {
  /** The shape of the skeleton */
  variant?: 'text' | 'rectangular' | 'circular';
  /** Width of the skeleton */
  width?: number | string;
  /** Height of the skeleton */
  height?: number | string;
  /** Animation effect type */
  animation?: 'pulse' | 'wave' | false;
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
| `variant` | 'text' \| 'rectangular' \| 'circular' | 'text' | The shape of the skeleton |
| `width` | number \| string | '100%' | Width of the skeleton |
| `height` | number \| string | - | Height of the skeleton |
| `animation` | 'pulse' \| 'wave' \| false | 'pulse' | Animation effect type |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Usage

::: code-with-tooltips
```tsx
import { useState } from 'react';
import { Skeleton } from '@underwood/components';

export const SkeletonExample = () => {
  const [loading, setLoading] = useState(true);

  return loading ? (
    <div>
      <Skeleton variant="text" width={200} height={20} />
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Skeleton variant="circular" width={40} height={40} />
    </div>
  ) : (
    <ActualContent />
  );
};
```
:::

## Examples

### Text Skeleton

::: code-with-tooltips
```tsx
import { Skeleton } from '@underwood/components';

export const TextSkeletonExample = () => (
  <div>
    <Skeleton variant="text" width={300} height={24} />
    <Skeleton variant="text" width={250} height={24} />
    <Skeleton variant="text" width={200} height={24} />
  </div>
);
```
:::

### Card Skeleton

::: code-with-tooltips
```tsx
import { Skeleton } from '@underwood/components';

export const CardSkeletonExample = () => (
  <div style={{ padding: 20 }}>
    <Skeleton variant="rectangular" width="100%" height={200} />
    <div style={{ marginTop: 8 }}>
      <Skeleton variant="text" width="80%" height={32} />
      <Skeleton variant="text" width="60%" height={24} />
    </div>
  </div>
);
```
:::

### Profile Skeleton

::: code-with-tooltips
```tsx
import { Skeleton } from '@underwood/components';

export const ProfileSkeletonExample = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <Skeleton variant="circular" width={40} height={40} />
    <div>
      <Skeleton variant="text" width={120} height={24} />
      <Skeleton variant="text" width={80} height={16} />
    </div>
  </div>
);
```
:::

### Custom Animation

::: code-with-tooltips
```tsx
import { Skeleton } from '@underwood/components';

export const AnimatedSkeletonExample = () => (
  <Skeleton 
    variant="rectangular"
    width="100%"
    height={200}
    animation="wave"
    style={{ borderRadius: 8 }}
  />
);
```
:::

## Best Practices

### Usage Guidelines

1. **Layout Matching**
   - Match skeleton dimensions to actual content
   - Preserve content hierarchy
   - Maintain consistent spacing
   - Handle responsive layouts

2. **Visual Design**
   - Use appropriate variants for content type
   - Keep animations subtle
   - Consider light/dark themes
   - Maintain visual hierarchy

3. **Loading Strategy**
   - Show immediately when loading starts
   - Set appropriate minimum display time
   - Handle quick content switches
   - Consider progressive loading

### Accessibility

1. **ARIA Attributes**
   - Use `role="progressbar"` appropriately
   - Set `aria-busy="true"` during loading
   - Provide loading context
   - Handle focus management

2. **Motion and Animation**
   - Respect reduced motion preferences
   - Use subtle animations
   - Consider animation impact
   - Provide static alternatives

3. **Screen Readers**
   - Announce loading states
   - Provide loading context
   - Consider loading duration
   - Handle content updates

### Performance

1. **Animation**
   - Use CSS animations when possible
   - Optimize animation frames
   - Handle cleanup properly
   - Consider battery impact

2. **Resource Management**
   - Minimize DOM elements
   - Handle unmounting properly
   - Clean up animations
   - Optimize render cycles

## Related Components

- [Progress](./progress.md) - For showing determinate progress
- [Spinner](./spinner.md) - For simple loading indicators
- [LoadingBar](./loading-bar.md) - For page-level loading indicators
- [Shimmer](./shimmer.md) - For content placeholder animations