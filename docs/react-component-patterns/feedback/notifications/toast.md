---
title: Toast Component
description: Temporary notifications for brief updates and feedback messages
category: Feedback
subcategory: Notifications
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Notifications
  - Toast
  - React
---

# Toast Component

## Overview

The Toast component displays brief, temporary notifications that automatically dismiss themselves. It's designed for providing non-intrusive feedback about operations, updates, and system events without interrupting the user's workflow.

## Key Features

- Multiple severity levels (info, success, warning, error)
- Automatic dismissal with configurable duration
- Optional action buttons
- Customizable positioning
- Queue management for multiple toasts
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface ToastProps {
  /** Unique toast identifier */
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
  action?: ReactNode;
  /** Toast position */
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /** Additional CSS class */
  className?: string;
}

export interface ToastContextValue {
  /** Show a new toast */
  showToast: (toast: Omit<ToastProps, 'id'>) => string;
  /** Close a specific toast */
  closeToast: (id: string) => void;
  /** Close all toasts */
  closeAll: () => void;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | - | Unique toast identifier |
| `message` | string | - | Toast message content |
| `type` | 'info' \| 'success' \| 'warning' \| 'error' | 'info' | Toast type |
| `duration` | number | 5000 | Display duration in ms |
| `dismissible` | boolean | true | Whether toast can be dismissed |
| `onClose` | function | - | Close handler |
| `action` | ReactNode | - | Optional action element |
| `position` | object | `vertical: 'top'; horizontal: 'right'` | Toast position |
| `className` | string | - | Additional CSS class |

## Usage

::: code-with-tooltips
```tsx
import { useState } from 'react';
import { useToast, Button } from '@underwood/components';

export const ToastExample = () => {
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
};
```
:::

## Examples

### Basic Success Toast

::: code-with-tooltips
```tsx
import { useToast } from '@underwood/components';

export const BasicToastExample = () => {
  const { showToast } = useToast();

  const showSuccessToast = () => {
    showToast({
      message: 'File uploaded successfully',
      type: 'success'
    });
  };

  return <Button onClick={showSuccessToast}>Upload File</Button>;
};
```
:::

### Toast with Action

::: code-with-tooltips
```tsx
import { useToast, Button } from '@underwood/components';

export const ActionToastExample = () => {
  const { showToast } = useToast();

  const showActionToast = () => {
    showToast({
      message: 'Message archived',
      type: 'info',
      action: (
        <Button variant="text" size="small" onClick={handleUndo}>
          Undo
        </Button>
      )
    });
  };

  return <Button onClick={showActionToast}>Archive Message</Button>;
};
```
:::

### Custom Positioned Toast

::: code-with-tooltips
```tsx
import { useToast, Button } from '@underwood/components';

export const PositionedToastExample = () => {
  const { showToast } = useToast();

  const showErrorToast = () => {
    showToast({
      message: 'Network error occurred',
      type: 'error',
      position: {
        vertical: 'bottom',
        horizontal: 'center'
      }
    });
  };

  return <Button onClick={showErrorToast}>Test Connection</Button>;
};
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
   - Set appropriate display durations
   - Consider reading time
   - Handle quick sequences
   - Manage multiple toasts

3. **Visual Design**
   - Maintain consistent styling
   - Use clear hierarchy
   - Consider stacking order
   - Support RTL layouts

### Accessibility

1. **ARIA Attributes**
   - Use `role="alert"` for important messages
   - Set appropriate `aria-live` regions
   - Include descriptive labels
   - Handle focus management

2. **Keyboard Navigation**
   - Support Escape to dismiss
   - Make actions focusable
   - Maintain focus order
   - Handle keyboard shortcuts

3. **Screen Readers**
   - Announce new toasts appropriately
   - Convey message importance
   - Describe available actions
   - Handle toast updates

### Performance

1. **Rendering**
   - Optimize animations
   - Clean up timers
   - Handle unmounting
   - Manage toast queue

2. **State Management**
   - Handle concurrent toasts
   - Manage toast lifecycle
   - Clean up resources
   - Prevent memory leaks

## Troubleshooting

### Common Issues

1. **Toast disappears too quickly**
   - Adjust duration setting
   - Check auto-dismiss logic
   - Consider user reading time
   - Validate timer cleanup

2. **Multiple toasts overlap**
   - Implement proper stacking
   - Use toast queue manager
   - Set maximum visible count
   - Handle positioning

3. **Actions not responding**
   - Verify event handlers
   - Check action rendering
   - Ensure proper focus
   - Test keyboard access

## Related Components

- [Alert](./alert.md) - For persistent important messages
- [Snackbar](./snackbar.md) - For action-oriented feedback
- [Banner](./banner.md) - For system-wide announcements
- [Dialog](../modals/dialog.md) - For important messages requiring user action
