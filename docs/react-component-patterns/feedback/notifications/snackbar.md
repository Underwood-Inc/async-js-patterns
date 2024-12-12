---
title: Snackbar
description: Brief feedback messages that appear at the bottom of the screen
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Notifications
  - React
---

# Snackbar Component

## Overview

The Snackbar component displays brief feedback messages at the bottom of the screen. It's ideal for showing non-intrusive notifications about app processes.

## TypeScript Interface

```tsx
interface SnackbarProps {
  /** Controls the visibility of the snackbar */
  open: boolean;
  /** The message to display */
  message: string;
  /** Optional action button or element */
  action?: React.ReactNode;
  /** Time in milliseconds before auto-hiding */
  autoHideDuration?: number;
  /** Callback fired when snackbar closes */
  onClose?: () => void;
  /** Position of the snackbar */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /** Optional severity level */
  severity?: 'success' | 'error' | 'warning' | 'info';
  /** Additional CSS class */
  className?: string;
}
```

## Usage

```tsx
import { Snackbar } from '@underwood/components';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <Snackbar
      open={open}
      message="Changes saved successfully"
      action={
        <Button color="secondary" size="small" onClick={() => setOpen(false)}>
          UNDO
        </Button>
      }
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Controls the visibility of the snackbar |
| `message` | string | - | The message to display |
| `action` | ReactNode | - | Optional action button or element |
| `autoHideDuration` | number | 6000 | Time in milliseconds before auto-hiding |
| `onClose` | function | - | Callback fired when snackbar closes |
| `anchorOrigin` | object | { vertical: 'bottom', horizontal: 'left' } | Position of the snackbar |
| `severity` | 'success' \| 'error' \| 'warning' \| 'info' | - | Optional severity level |
| `className` | string | - | Additional CSS class |

## Examples

### Basic Snackbar

```tsx
<Snackbar
  open={true}
  message="File uploaded successfully"
  autoHideDuration={3000}
/>
```

### With Action Button

```tsx
<Snackbar
  open={true}
  message="Message archived"
  action={
    <Button color="secondary" size="small">
      UNDO
    </Button>
  }
/>
```

### With Custom Position

```tsx
<Snackbar
  open={true}
  message="Settings saved"
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
/>
```

### With Severity

```tsx
<Snackbar
  open={true}
  message="Changes could not be saved"
  severity="error"
  action={
    <Button color="secondary" size="small">
      RETRY
    </Button>
  }
/>
```

## Accessibility

### ARIA Attributes

The Snackbar component uses the following ARIA attributes:

```tsx
<div
  role="alert"
  aria-live="polite"
  aria-atomic="true"
>
  {message}
</div>
```

### Keyboard Navigation

- `Escape` - Closes the snackbar
- `Tab` - Focuses the action button if present
- `Enter/Space` - Triggers the action when focused

### Screen Reader Considerations

- Messages are announced when they appear
- Action buttons have clear, descriptive labels
- Auto-dismiss timing considers reading speed

## Best Practices

### Duration

- Keep messages brief and clear
- Use appropriate auto-hide duration (recommended: 4000-6000ms)
- Allow manual dismissal
- Consider reading time for longer messages

### Positioning

- Maintain consistent positioning
- Avoid blocking important content
- Handle multiple snackbars properly
- Consider mobile viewports

### Content

- Use clear, concise messages
- Include relevant actions when needed
- Follow consistent tone and style
- Limit message length

### Performance

- Clean up timers on unmount
- Handle multiple snackbars efficiently
- Use transitions sparingly
- Consider bundle size

## Troubleshooting

### Common Issues

1. **Snackbar doesn't auto-close**
   - Check if `autoHideDuration` is set
   - Verify `onClose` handler is working
   - Check for focus interrupting auto-close

2. **Multiple snackbars overlap**
   - Use a snackbar manager/queue
   - Implement proper stacking
   - Consider using a toast system for multiple messages

3. **Action button not working**
   - Verify event handler attachment
   - Check action button rendering
   - Ensure proper focus management

## Related Components

- [Toast](./toast.md) - For temporary notifications
- [Alert](./alert.md) - For important messages
- [Banner](./banner.md) - For prominent announcements
``` 