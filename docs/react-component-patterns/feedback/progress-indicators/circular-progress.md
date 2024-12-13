---
title: CircularProgress Component
description: Circular progress indicator for showing determinate and indeterminate progress
category: Feedback
subcategory: Progress Indicators
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Loading
  - Progress
  - React
---

# CircularProgress Component

## Overview

The CircularProgress component displays progress in a circular format, supporting both determinate and indeterminate states. It's ideal for showing progress in a compact, circular visualization.

## Key Features

- Determinate/indeterminate modes
- Customizable size and thickness
- Color customization
- Label support
- Animated transitions
- Accessibility support

## Component API

### Props Interface

::: code-with-tooltips
```tsx
export interface CircularProgressProps {
  /** Progress value (0-100) */
  value?: number;
  /** Size in pixels */
  size?: number;
  /** Circle thickness */
  thickness?: number;
  /** Whether progress is indeterminate */
  indeterminate?: boolean;
  /** Progress color */
  color?: 'primary' | 'secondary' | string;
  /** Label text */
  label?: string;
  /** Whether to show value */
  showValue?: boolean;
  /** Additional CSS class */
  className?: string;
}
```
:::

## Usage

### Basic CircularProgress

::: code-with-tooltips
```tsx
import { CircularProgress } from '@underwood/components';

export const BasicCircularProgressExample = () => (
  <CircularProgress value={75} />
);
```
:::

### Indeterminate Progress

::: code-with-tooltips
```tsx
import { CircularProgress } from '@underwood/components';

export const IndeterminateExample = () => (
  <CircularProgress
    indeterminate
    size={48}
    thickness={4}
  />
);
```
:::

### With Label and Value

::: code-with-tooltips
```tsx
import { CircularProgress } from '@underwood/components';

export const LabeledProgressExample = () => (
  <CircularProgress
    value={80}
    label="Loading..."
    showValue
    size={64}
  />
);
```
:::

## Best Practices

### Usage Guidelines

1. **Progress Display**
   - Clear value indication
   - Smooth animations
   - Appropriate sizing
   - Color contrast

2. **State Management**
   - Handle transitions
   - Show completion
   - Error states
   - Loading feedback

### Accessibility

1. **ARIA Support**
   - Use `role="progressbar"`
   - Set `aria-valuenow`
   - Include `aria-label`
   - Update announcements

2. **Visual Accessibility**
   - Sufficient contrast
   - Clear indicators
   - Size visibility
   - Motion sensitivity

## Related Components

- [Progress](/react-component-patterns/feedback/progress-indicators/progress.md) - For linear progress bars
- [Spinner](/react-component-patterns/feedback/progress-indicators/spinner.md) - For loading spinners
- [LoadingBar](/react-component-patterns/feedback/progress-indicators/loading-bar.md) - For page-level loading 