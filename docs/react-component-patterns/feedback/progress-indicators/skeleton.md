---
title: Skeleton
description: Placeholder loading states for content that is being loaded
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Loading
  - React
---

# Skeleton Component

## Overview

The Skeleton component provides a placeholder preview of content while data is being loaded. It helps create a smoother user experience by reducing perceived loading time and layout shifts.

## Usage

```tsx
import { Skeleton } from '@underwood/components';

function MyComponent() {
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
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | 'text' \| 'rectangular' \| 'circular' | 'text' | The shape of the skeleton |
| `width` | number \| string | '100%' | Width of the skeleton |
| `height` | number \| string | - | Height of the skeleton |
| `animation` | 'pulse' \| 'wave' \| false | 'pulse' | Animation effect type |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Examples

### Text Skeleton

```tsx
<div>
  <Skeleton variant="text" width={300} height={24} />
  <Skeleton variant="text" width={250} height={24} />
  <Skeleton variant="text" width={200} height={24} />
</div>
```

### Card Skeleton

```tsx
<div style={{ padding: 20 }}>
  <Skeleton variant="rectangular" width="100%" height={200} />
  <div style={{ marginTop: 8 }}>
    <Skeleton variant="text" width="80%" height={32} />
    <Skeleton variant="text" width="60%" height={24} />
  </div>
</div>
```

### Profile Skeleton

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
  <Skeleton variant="circular" width={40} height={40} />
  <div>
    <Skeleton variant="text" width={120} height={24} />
    <Skeleton variant="text" width={80} height={16} />
  </div>
</div>
```

### Custom Animation

```tsx
<Skeleton 
  variant="rectangular"
  width="100%"
  height={200}
  animation="wave"
  style={{ borderRadius: 8 }}
/>
```

## Best Practices

1. **Layout**
   - Match skeleton dimensions to actual content
   - Maintain consistent spacing
   - Preserve content hierarchy

2. **Animation**
   - Use subtle animations
   - Consider reduced motion preferences
   - Keep animations consistent

3. **Timing**
   - Show immediately when loading starts
   - Maintain minimum display time
   - Transition smoothly to content

4. **Accessibility**
   - Include proper ARIA attributes
   - Provide loading context
   - Consider screen readers

## Related Components

- [Progress](./progress.md) - For determinate progress
- [Spinner](./spinner.md) - For loading spinners
- [LoadingBar](./loading-bar.md) - For page-level loading 