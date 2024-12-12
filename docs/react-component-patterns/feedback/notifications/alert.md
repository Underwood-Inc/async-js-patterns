---
title: Alert Component
description: Status and message alerts for important information
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Notifications
  - Alert
  - React
---

# Alert Component

## Overview

The Alert component displays important messages and notifications to users. It supports different severity levels, can be dismissible, and optionally includes actions.

## TypeScript Interface

```tsx
interface AlertProps {
  /** Alert severity level */
  severity?: 'info' | 'success' | 'warning' | 'error';
  /** Alert title */
  title?: string;
  /** Whether alert can be dismissed */
  dismissible?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Additional actions */
  actions?: React.ReactNode;
  /** Alert content */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Whether alert should be outlined */
  variant?: 'filled' | 'outlined';
  /** Icon override */
  icon?: React.ReactNode;
  /** Auto-hide duration in milliseconds */
  autoHideDuration?: number;
}
```

## Usage

```tsx
import { Alert } from '@underwood/components';

function MyComponent() {
  return (
    <Alert 
      severity="success"
      title="Operation Successful"
      dismissible
      onClose={() => console.log('Alert closed')}
    >
      Your changes have been saved successfully.
    </Alert>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `severity` | 'info' \| 'success' \| 'warning' \| 'error' | 'info' | Alert severity level |
| `title` | string | - | Alert title |
| `dismissible` | boolean | false | Whether alert can be dismissed |
| `onClose` | function | - | Close handler |
| `actions` | ReactNode | - | Additional actions |
| `children` | ReactNode | - | Alert content |
| `className` | string | - | Additional CSS class |
| `variant` | 'filled' \| 'outlined' | 'filled' | Alert visual style |
| `icon` | ReactNode | - | Custom icon |
| `autoHideDuration` | number | - | Auto-hide duration in ms |

## Examples

### Basic Alert

```tsx
<Alert severity="info">
  This is an informational message.
</Alert>
```

### With Title and Actions

```tsx
<Alert
  severity="warning"
  title="Unsaved Changes"
  actions={
    <>
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={handleDiscard}>Discard</Button>
    </>
  }
>
  You have unsaved changes that will be lost.
</Alert>
```

### Outlined Variant

```tsx
<Alert
  severity="error"
  variant="outlined"
  title="Connection Error"
>
  Unable to connect to the server. Please try again.
</Alert>
```

### Auto-dismissible Alert

```tsx
<Alert
  severity="success"
  autoHideDuration={5000}
  onClose={() => console.log('Alert closed')}
>
  Settings updated successfully.
</Alert>
```

## Accessibility

### ARIA Attributes

The Alert component uses the following ARIA attributes:

```tsx
<div
  role="alert"
  aria-live={severity === 'error' ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  {children}
</div>
```

### Keyboard Navigation

- `Tab` - Focuses interactive elements within the alert
- `Enter/Space` - Triggers focused action
- `Escape` - Closes dismissible alerts

### Screen Reader Considerations

- Alert messages are announced when they appear
- Severity is conveyed through aria-label
- Close button has clear, descriptive label
- Actions have meaningful labels

## Best Practices

### Usage

- Use appropriate severity levels
- Keep messages clear and concise
- Include helpful actions when needed
- Consider auto-dismiss for success messages
- Limit number of concurrent alerts

### Content

- Write clear, actionable messages
- Include error codes when relevant
- Provide recovery instructions
- Use consistent terminology
- Avoid technical jargon

### Visual Design

- Use consistent colors for severities
- Maintain sufficient contrast
- Consider icon usage
- Handle long content gracefully
- Support RTL layouts

### Performance

- Clean up timers on unmount
- Handle multiple alerts efficiently
- Optimize animations
- Consider bundle size
- Manage alert queue

## Troubleshooting

### Common Issues

1. **Alert doesn't auto-dismiss**
   - Check if `autoHideDuration` is set
   - Verify `onClose` handler is working
   - Check for focus interrupting auto-dismiss

2. **Alert styling inconsistent**
   - Verify severity prop is correct
   - Check variant prop value
   - Ensure theme is properly applied

3. **Actions not working**
   - Verify event handlers
   - Check action button rendering
   - Ensure proper focus management

## Related Components

- [Toast](./toast.md) - For temporary notifications
- [Snackbar](./snackbar.md) - For brief feedback messages
- [Banner](./banner.md) - For prominent announcements