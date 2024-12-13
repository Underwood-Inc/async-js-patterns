---
title: Alert Component
description: Status and message alerts for important information
category: Feedback
subcategory: Notifications
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Notifications
  - Alert
  - React
---

# Alert Component

## Overview

The Alert component displays important messages and notifications to users. It provides a consistent way to communicate status, warnings, errors, and success messages with appropriate visual styling and accessibility features.

## Key Features

- Multiple severity levels (info, success, warning, error)
- Optional titles and actions
- Dismissible alerts
- Auto-dismiss capability
- Filled and outlined variants
- Custom icon support
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface AlertProps {
  /** Alert severity level */
  severity?: 'info' | 'success' | 'warning' | 'error';
  /** Alert title */
  title?: string;
  /** Whether alert can be dismissed */
  dismissible?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Additional actions */
  actions?: ReactNode;
  /** Alert content */
  children: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Whether alert should be outlined */
  variant?: 'filled' | 'outlined';
  /** Icon override */
  icon?: ReactNode;
  /** Auto-hide duration in milliseconds */
  autoHideDuration?: number;
}
```
:::

### Props Table

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

## Usage

::: code-with-tooltips
```tsx
import { Alert } from '@underwood/components';

export const AlertExample = () => {
  const handleClose = () => {
    // Handle alert close
    console.log('Alert closed');
  };

  return (
    <Alert 
      severity="success"
      title="Operation Successful"
      dismissible
      onClose={handleClose}
    >
      Your changes have been saved successfully.
    </Alert>
  );
};
```
:::

## Examples

### Basic Alert

::: code-with-tooltips
```tsx
import { Alert } from '@underwood/components';

export const BasicAlertExample = () => (
  <Alert severity="info">
    This is an informational message.
  </Alert>
);
```
:::

### With Title and Actions

::: code-with-tooltips
```tsx
import { Alert, Button } from '@underwood/components';

export const ActionAlertExample = () => {
  const handleSave = () => {
    // Handle save action
    console.log('Changes saved');
  };

  const handleDiscard = () => {
    // Handle discard action
    console.log('Changes discarded');
  };

  return (
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
  );
};
```
:::

### Outlined Variant

::: code-with-tooltips
```tsx
import { Alert } from '@underwood/components';

export const OutlinedAlertExample = () => (
  <Alert
    severity="error"
    variant="outlined"
    title="Connection Error"
  >
    Unable to connect to the server. Please try again.
  </Alert>
);
```
:::

## Best Practices

### Usage Guidelines

1. **Message Content**
   - Use appropriate severity levels
   - Keep messages clear and concise
   - Include helpful actions when needed
   - Avoid technical jargon

2. **Visual Design**
   - Use consistent colors for severities
   - Maintain sufficient contrast
   - Consider icon usage
   - Handle long content gracefully

3. **Interaction Design**
   - Consider auto-dismiss timing
   - Make dismissal obvious
   - Handle multiple alerts properly
   - Support touch interactions

### Accessibility

1. **ARIA Attributes**
   - Use `role="alert"` appropriately
   - Set `aria-live` based on severity
   - Include descriptive labels
   - Handle focus management

2. **Keyboard Navigation**
   - Support Tab for interactive elements
   - Enable Enter/Space for actions
   - Allow Escape for dismissal
   - Maintain focus order

3. **Screen Readers**
   - Announce alerts appropriately
   - Convey severity through aria-label
   - Provide action context
   - Consider reading duration

### Performance

1. **Rendering**
   - Optimize animations
   - Clean up timers
   - Handle unmounting
   - Manage alert queue

2. **State Management**
   - Handle concurrent alerts
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

2. **Styling inconsistencies**
   - Verify severity prop
   - Check variant value
   - Ensure theme application
   - Test RTL support

3. **Actions not responding**
   - Verify event handlers
   - Check action rendering
   - Ensure proper focus
   - Test keyboard access

## Related Components

- [Toast](/react-component-patterns/feedback/notifications/toast.md) - For temporary, auto-dismissing notifications
- [Snackbar](/react-component-patterns/feedback/notifications/snackbar.md) - For brief feedback messages
- [Banner](/react-component-patterns/feedback/notifications/banner.md) - For system-wide announcements
- [Dialog](/react-component-patterns/overlay/modals/dialog.md) - For important messages requiring user action