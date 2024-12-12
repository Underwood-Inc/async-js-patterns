---
title: Spinner
description: Loading spinner animations for indicating processing states
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Loading
  - React
---

# Spinner Component

## Overview

The Spinner component provides a visual indicator for loading or processing states. It's commonly used during data fetching, form submission, or any operation that requires user wait time.

## Usage

```tsx
import { Spinner } from '@underwood/components';

function MyComponent() {
  return (
    <Spinner
      size="medium"
      label="Loading content..."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | 'small' \| 'medium' \| 'large' | 'medium' | Size of the spinner |
| `label` | string | - | Accessible label for screen readers |
| `color` | 'primary' \| 'secondary' \| string | 'primary' | Color of the spinner |
| `speed` | 'slow' \| 'normal' \| 'fast' | 'normal' | Animation speed |
| `overlay` | boolean | false | Show spinner in a centered overlay |
| `variant` | 'circle' \| 'dots' \| 'pulse' | 'circle' | Visual style variant |

## Examples

### Basic Spinner

```tsx
<Spinner
  size="medium"
  label="Loading..."
/>
```

### Overlay Spinner

```tsx
<Spinner
  overlay
  size="large"
  label="Processing your request..."
/>
```

### Custom Styled Spinner

```tsx
<Spinner
  color="#6200ee"
  size="large"
  speed="fast"
  variant="dots"
/>
```

### With Content Wrapper

```tsx
<div style={{ position: 'relative', minHeight: '200px' }}>
  <Spinner
    overlay
    label="Loading content..."
    variant="pulse"
  />
  {content}
</div>
```

## Best Practices

1. **Usage**
   - Show immediately when loading starts
   - Use appropriate size for context
   - Include meaningful labels

2. **Positioning**
   - Center in container when possible
   - Use overlay for full-page loading
   - Consider content layout impact

3. **Accessibility**
   - Always include descriptive labels
   - Use proper ARIA attributes
   - Consider reduced motion preferences

4. **Performance**
   - Optimize animation performance
   - Clean up on unmount
   - Handle state changes efficiently

## Related Components

- [Progress](./progress.md) - For determinate progress
- [LoadingBar](./loading-bar.md) - For page-level loading
- [Skeleton](./skeleton.md) - For content loading states 