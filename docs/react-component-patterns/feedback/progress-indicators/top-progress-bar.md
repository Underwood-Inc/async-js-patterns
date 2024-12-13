---
title: TopProgressBar Component
description: Page-level progress indicator that appears at the top of the viewport
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

# TopProgressBar Component

## Overview

The TopProgressBar component displays a thin progress bar at the top of the viewport, commonly used to indicate page loading progress or long-running operations. It provides visual feedback without disrupting the user interface.

## Key Features

- Smooth animations
- Determinate/indeterminate modes
- Customizable colors
- Auto-incrementing progress
- Minimal UI footprint
- Global state management

## Component API

### Props Interface

::: code-with-tooltips
```tsx
export interface TopProgressBarProps {
  /** Progress value (0-100) */
  value?: number;
  /** Whether progress is indeterminate */
  indeterminate?: boolean;
  /** Bar color */
  color?: 'primary' | 'secondary' | string;
  /** Bar height in pixels */
  height?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Whether to show the bar */
  visible?: boolean;
  /** Additional CSS class */
  className?: string;
}
```
:::

## Usage

### Basic TopProgressBar

::: code-with-tooltips
```tsx
import { TopProgressBar } from '@underwood/components';

export const BasicTopProgressBarExample = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <TopProgressBar
      value={progress}
      visible={true}
    />
  );
};
```
:::

### Indeterminate Progress

::: code-with-tooltips
```tsx
import { TopProgressBar } from '@underwood/components';

export const IndeterminateExample = () => (
  <TopProgressBar
    indeterminate
    visible={true}
    color="primary"
  />
);
```
:::

## Best Practices

### Usage Guidelines

1. **Progress Indication**
   - Clear visual feedback
   - Smooth transitions
   - Appropriate timing
   - Error states

2. **UI Integration**
   - Minimal interference
   - Consistent positioning
   - Color harmony
   - Z-index management

### Accessibility

1. **ARIA Support**
   - Use `role="progressbar"`
   - Set `aria-valuenow`
   - Include descriptions
   - Update announcements

2. **Visual Accessibility**
   - Sufficient contrast
   - Visible progress
   - Motion sensitivity
   - Focus handling

## Related Components

- [Progress](/react-component-patterns/feedback/progress-indicators/progress.md) - For inline progress bars
- [LoadingBar](/react-component-patterns/feedback/progress-indicators/loading-bar.md) - For section loading
- [CircularProgress](/react-component-patterns/feedback/progress-indicators/circular-progress.md) - For circular indicators 