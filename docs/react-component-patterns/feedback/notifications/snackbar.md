---
title: Snackbar Component
description: Brief feedback messages that appear at the bottom of the screen
category: Feedback
subcategory: Notifications
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Notifications
  - React
---

# Snackbar Component

## Overview

The Snackbar component displays brief feedback messages at the bottom of the screen. It's designed for showing non-intrusive notifications about app processes, with optional actions that users can take.

## Key Features

- Automatic dismissal with configurable duration
- Optional action buttons
- Multiple severity levels
- Customizable positioning
- Queue management for multiple snackbars
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface SnackbarProps {
  /** Controls the visibility of the snackbar */
  open: boolean;
  /** The message to display */
  message: string;
  /** Optional action button or element */
  action?: ReactNode;
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
:::

### Props Table

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

## Usage

::: code-with-tooltips
```tsx
import { useState } from 'react';
import { Snackbar, Button } from '@underwood/components';

export const SnackbarExample = () => {
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
};
```
:::

## Examples

### Basic Snackbar

::: code-with-tooltips
```tsx
import { Snackbar } from '@underwood/components';

export const BasicSnackbarExample = () => (
  <Snackbar
    open={true}
    message="File uploaded successfully"
    autoHideDuration={3000}
  />
);
```
:::

### With Action Button

::: code-with-tooltips
```tsx
import { Snackbar, Button } from '@underwood/components';

export const ActionSnackbarExample = () => (
  <Snackbar
    open={true}
    message="Message archived"
    action={
      <Button color="secondary" size="small">
        UNDO
      </Button>
    }
  />
);
```
:::

### With Custom Position

::: code-with-tooltips
```tsx
import { Snackbar } from '@underwood/components';

export const PositionedSnackbarExample = () => (
  <Snackbar
    open={true}
    message="Settings saved"
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  />
);
```
:::

## Best Practices

### Usage Guidelines

1. **Message Content**
   - Keep messages brief and clear
   - Use appropriate severity levels
   - Include relevant context
   - Avoid technical jargon

2. **Timing and Duration**
   - Use appropriate auto-hide duration (4000-6000ms)
   - Consider reading time for longer messages
   - Allow manual dismissal
   - Handle quick sequences

3. **Visual Design**
   - Maintain consistent positioning
   - Use clear hierarchy
   - Consider stacking order
   - Support mobile viewports

### Accessibility

1. **ARIA Attributes**
   - Use `role="alert"` appropriately
   - Set `aria-live="polite"` for most messages
   - Include descriptive labels
   - Handle focus management

2. **Keyboard Navigation**
   - Support Escape to dismiss
   - Make actions focusable
   - Maintain focus order
   - Handle keyboard shortcuts

3. **Screen Readers**
   - Announce new messages appropriately
   - Provide clear action descriptions
   - Consider reading duration
   - Handle message updates

### Performance

1. **Rendering**
   - Optimize animations
   - Clean up timers
   - Handle unmounting
   - Manage message queue

2. **State Management**
   - Handle concurrent messages
   - Manage lifecycle properly
   - Clean up resources
   - Prevent memory leaks

## Troubleshooting

### Common Issues

1. **Auto-dismiss not working**
   - Verify `autoHideDuration` setting
   - Check `onClose` handler
   - Consider focus interference
   - Validate timer cleanup

2. **Multiple snackbars overlap**
   - Implement proper stacking
   - Use message queue manager
   - Set maximum visible count
   - Handle positioning

3. **Actions not responding**
   - Verify event handlers
   - Check action rendering
   - Ensure proper focus
   - Test keyboard access

## Related Components

- [Toast](./toast.md) - For temporary, auto-dismissing notifications
- [Alert](./alert.md) - For persistent important messages
- [Banner](./banner.md) - For system-wide announcements
- [Dialog](../modals/dialog.md) - For important messages requiring user action
``` 