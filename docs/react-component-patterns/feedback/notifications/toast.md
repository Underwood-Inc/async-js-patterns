---
title: Toast Component
description: Temporary notifications for brief updates and feedback
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Notifications
  - Toast
  - React
---

# Toast Component

## Overview

The Toast component displays brief, temporary notifications that automatically dismiss themselves. It's ideal for providing non-intrusive feedback about operations, updates, and system events.

## TypeScript Interface

```tsx
interface ToastProps {
  /** Unique ID for the toast */
  id: string;
  /** Toast message content */
  message: string;
  /** Toast type/severity */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** Display duration in milliseconds */
  duration?: number;
  /** Whether toast can be dismissed */
  dismissible?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Optional action element */
  action?: React.ReactNode;
  /** Toast position */
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /** Additional CSS class */
  className?: string;
}

interface ToastContextValue {
  /** Show a new toast */
  showToast: (toast: Omit<ToastProps, 'id'>) => string;
  /** Close a specific toast */
  closeToast: (id: string) => void;
  /** Close all toasts */
  closeAll: () => void;
}
```

## Usage

```tsx
import { useToast } from '@underwood/components';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({
      message: 'Operation completed successfully',
      type: 'success',
      duration: 3000,
      action: (
        <Button size="small" onClick={handleUndo}>
          Undo
        </Button>
      )
    });
  };

  return (
    <Button onClick={handleSuccess}>
      Perform Action
    </Button>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | - | Unique toast identifier |
| `message` | string | - | Toast message content |
| `type` | 'info' \| 'success' \| 'warning' \| 'error' | 'info' | Toast type |
| `duration` | number | 5000 | Display duration in ms |
| `dismissible` | boolean | true | Whether toast can be dismissed |
| `onClose` | function | - | Close handler |
| `action` | ReactNode | - | Optional action element |
| `position` | object | { vertical: 'top', horizontal: 'right' } | Toast position |
| `className` | string | - | Additional CSS class |

## Examples

### Basic Toast

```tsx
showToast({
  message: 'File uploaded successfully',
  type: 'success'
});
```

### With Action

```tsx
showToast({
  message: 'Message archived',
  type: 'info',
  action: (
    <Button variant="text" size="small" onClick={handleUndo}>
      Undo
    </Button>
  )
});
```

### Custom Position

```tsx
showToast({
  message: 'Network error occurred',
  type: 'error',
  position: {
    vertical: 'bottom',
    horizontal: 'center'
  }
});
```

### With Custom Duration

```tsx
showToast({
  message: 'Changes saved',
  type: 'success',
  duration: 2000,
  dismissible: false
});
```

## Accessibility

### ARIA Attributes

The Toast component uses the following ARIA attributes:

```tsx
<div
  role="alert"
  aria-live={type === 'error' ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  {message}
</div>
```

### Keyboard Navigation

- `Tab` - Focuses interactive elements
- `Enter/Space` - Triggers focused action
- `Escape` - Dismisses active toast

### Screen Reader Considerations

- Messages are announced when they appear
- Type/severity is conveyed through aria-label
- Actions have descriptive labels
- Auto-dismiss timing considers reading speed

## Best Practices

### Usage

- Keep messages brief and clear
- Use appropriate toast types
- Set reasonable durations
- Limit concurrent toasts
- Position consistently

### Content

- Write actionable messages
- Include relevant details
- Use consistent terminology
- Avoid technical jargon
- Consider message length

### Visual Design

- Use consistent styling
- Maintain sufficient contrast
- Consider animation timing
- Handle stacking properly
- Support RTL layouts

### Performance

- Clean up timers on unmount
- Manage toast queue efficiently
- Optimize animations
- Consider bundle size
- Handle multiple instances

## Troubleshooting

### Common Issues

1. **Toast disappears too quickly**
   - Adjust duration setting
   - Check auto-dismiss logic
   - Consider user reading time

2. **Multiple toasts overlap**
   - Implement proper stacking
   - Use toast queue manager
   - Limit maximum toasts

3. **Actions not responding**
   - Verify event handlers
   - Check action rendering
   - Ensure proper focus management

## Related Components

- [Alert](./alert.md) - For important messages
- [Snackbar](./snackbar.md) - For brief feedback messages
- [Banner](./banner.md) - For prominent announcements 