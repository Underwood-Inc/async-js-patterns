---
title: Progress
description: Progress bars and circles for showing completion status
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Progress
  - React
---

# Progress Component

## Overview

The Progress component displays the completion status of a task or operation. It supports both linear progress bars and circular progress indicators.

## Usage

```tsx
import { Progress } from '@underwood/components';

function MyComponent() {
  return (
    <Progress
      value={75}
      variant="linear"
      label="Uploading files..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | 0 | Current progress value (0-100) |
| `variant` | 'linear' \| 'circular' | 'linear' | Progress indicator style |
| `size` | 'small' \| 'medium' \| 'large' | 'medium' | Size of the progress indicator |
| `label` | string | - | Accessible label for screen readers |
| `color` | 'primary' \| 'secondary' \| string | 'primary' | Color of the progress indicator |
| `thickness` | number | 4 | Thickness of the progress bar/circle |
| `indeterminate` | boolean | false | Show indeterminate progress animation |

## Examples

### Linear Progress

```tsx
<Progress
  value={60}
  variant="linear"
  label="Loading data..."
/>
```

### Circular Progress

```tsx
<Progress
  value={75}
  variant="circular"
  size="large"
  label="Processing..."
/>
```

### Indeterminate Progress

```tsx
<Progress
  indeterminate
  variant="linear"
  label="Please wait..."
/>
```

### Custom Styled Progress

```tsx
<Progress
  value={80}
  color="#6200ee"
  thickness={6}
  label="Downloading..."
/>
```

## Best Practices

1. **Feedback**
   - Show progress immediately when operation starts
   - Update progress smoothly
   - Indicate completion clearly

2. **Accessibility**
   - Always include descriptive labels
   - Use ARIA attributes appropriately
   - Support screen readers

3. **Visual Design**
   - Maintain consistent styling
   - Use appropriate sizes
   - Consider color contrast

4. **Performance**
   - Optimize animation performance
   - Handle updates efficiently
   - Clean up resources when done

## Related Components

- [Spinner](./spinner.md) - For loading spinners
- [LoadingBar](./loading-bar.md) - For page-level loading
- [Skeleton](./skeleton.md) - For content loading states 