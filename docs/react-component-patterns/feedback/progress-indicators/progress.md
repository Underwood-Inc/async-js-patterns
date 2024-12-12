---
title: Progress Component
description: Progress bars and circles for showing completion status
category: Feedback
subcategory: Progress Indicators
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Progress
  - React
---

# Progress Component

## Overview

The Progress component displays the completion status of a task or operation. It provides both linear progress bars and circular progress indicators with support for determinate and indeterminate states.

## Key Features

- Linear and circular variants
- Determinate and indeterminate states
- Multiple size options
- Customizable colors and thickness
- Accessible by default
- Smooth animations

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface ProgressProps {
  /** Current progress value (0-100) */
  value?: number;
  /** Progress indicator style */
  variant?: 'linear' | 'circular';
  /** Size of the progress indicator */
  size?: 'small' | 'medium' | 'large';
  /** Accessible label for screen readers */
  label?: string;
  /** Color of the progress indicator */
  color?: 'primary' | 'secondary' | string;
  /** Thickness of the progress bar/circle */
  thickness?: number;
  /** Show indeterminate progress animation */
  indeterminate?: boolean;
  /** Additional CSS class */
  className?: string;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | 0 | Current progress value (0-100) |
| `variant` | 'linear' \| 'circular' | 'linear' | Progress indicator style |
| `size` | 'small' \| 'medium' \| 'large' | 'medium' | Size of the progress indicator |
| `label` | string | - | Accessible label for screen readers |
| `color` | 'primary' \| 'secondary' \| string | 'primary' | Color of the progress indicator |
| `thickness` | number | 4 | Thickness of the progress bar/circle |
| `indeterminate` | boolean | false | Show indeterminate progress animation |
| `className` | string | - | Additional CSS class |

## Usage

::: code-with-tooltips
```tsx
import { Progress } from '@underwood/components';

export const ProgressExample = () => {
  return (
    <Progress
      value={75}
      variant="linear"
      label="Uploading files..."
    />
  );
};
```
:::

## Examples

### Linear Progress

::: code-with-tooltips
```tsx
import { Progress } from '@underwood/components';

export const LinearProgressExample = () => (
  <Progress
    value={60}
    variant="linear"
    label="Loading data..."
  />
);
```
:::

### Circular Progress

::: code-with-tooltips
```tsx
import { Progress } from '@underwood/components';

export const CircularProgressExample = () => (
  <Progress
    value={75}
    variant="circular"
    size="large"
    label="Processing..."
  />
);
```
:::

### Indeterminate Progress

::: code-with-tooltips
```tsx
import { Progress } from '@underwood/components';

export const IndeterminateProgressExample = () => (
  <Progress
    indeterminate
    variant="linear"
    label="Please wait..."
  />
);
```
:::

### Custom Styled Progress

::: code-with-tooltips
```tsx
import { Progress } from '@underwood/components';

export const CustomProgressExample = () => (
  <Progress
    value={80}
    color="#6200ee"
    thickness={6}
    label="Downloading..."
  />
);
```
:::

## Best Practices

### Usage Guidelines

1. **Progress Updates**
   - Show progress immediately when operation starts
   - Update progress smoothly and frequently
   - Indicate completion clearly
   - Use indeterminate state when progress is unknown

2. **Visual Feedback**
   - Choose appropriate variant for the context
   - Use consistent sizing across similar operations
   - Maintain clear visual hierarchy
   - Consider mobile viewports

3. **Error Handling**
   - Show error states clearly
   - Provide retry options when applicable
   - Maintain progress state during retries
   - Handle interruptions gracefully

### Accessibility

1. **ARIA Attributes**
   - Use `role="progressbar"` appropriately
   - Set `aria-valuenow` for current value
   - Include `aria-valuemin` and `aria-valuemax`
   - Provide descriptive labels

2. **Screen Readers**
   - Announce progress updates
   - Indicate completion status
   - Use clear progress descriptions
   - Consider update frequency

3. **Keyboard Interaction**
   - Support focus when interactive
   - Handle keyboard interrupts
   - Maintain focus during updates
   - Consider tab order

### Performance

1. **Animation**
   - Use CSS transitions when possible
   - Optimize animation frames
   - Consider reduced motion
   - Handle cleanup properly

2. **Updates**
   - Throttle progress updates
   - Batch DOM updates
   - Clean up intervals/timeouts
   - Handle unmounting properly

## Related Components

- [Spinner](./spinner.md) - For simple loading indicators
- [LoadingBar](./loading-bar.md) - For page-level loading indicators
- [Skeleton](./skeleton.md) - For content loading placeholders
- [CircularProgress](./circular-progress.md) - For circular-specific progress