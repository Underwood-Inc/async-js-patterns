---
title: Error Component
description: Display error states and error handling interfaces
category: Feedback
subcategory: Status Indicators
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Error
  - React
---

# Error Component

## Overview

The Error component displays error states and provides error handling interfaces. It helps users understand what went wrong and offers ways to recover or get help.

## Key Features

- Multiple error state types
- Primary and secondary actions
- Custom error icons
- Technical details support
- Flexible styling options
- Accessible by default
- Clear error messaging

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode, CSSProperties } from 'react';

export interface ErrorProps {
  /** Main error message */
  title: string;
  /** Detailed error description */
  message: string;
  /** Primary action button */
  action?: ReactNode;
  /** Secondary action button */
  secondaryAction?: ReactNode;
  /** Custom error icon */
  icon?: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Technical error details */
  details?: string;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | - | Main error message |
| `message` | string | - | Detailed error description |
| `action` | ReactNode | - | Primary action button |
| `secondaryAction` | ReactNode | - | Secondary action button |
| `icon` | ReactNode | - | Custom error icon |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |
| `details` | string | - | Technical error details |

## Usage

::: code-with-tooltips
```tsx
import { Error, Button } from '@underwood/components';

export const ErrorExample = () => {
  const handleRetry = () => {
    // Retry logic
  };

  return (
    <Error
      title="Connection Error"
      message="Please check your internet connection"
      action={
        <Button variant="primary" onClick={handleRetry}>
          Retry Connection
        </Button>
      }
    />
  );
};
```
:::

## Examples

### Basic Error

::: code-with-tooltips
```tsx
import { Error, Button } from '@underwood/components';

export const BasicErrorExample = () => {
  const handleRetry = () => {
    // Retry logic
  };

  return (
    <Error
      title="Connection Error"
      message="Please check your internet connection"
      action={
        <Button variant="primary" onClick={handleRetry}>
          Retry Connection
        </Button>
      }
    />
  );
};
```
:::

### With Multiple Actions

::: code-with-tooltips
```tsx
import { Error, Button } from '@underwood/components';

export const MultiActionErrorExample = () => {
  const handleRetry = () => {
    // Retry logic
  };

  const handleDiscard = () => {
    // Discard changes logic
  };

  return (
    <Error
      title="Failed to Save Changes"
      message="Your changes could not be saved due to a server error"
      action={
        <Button variant="primary" onClick={handleRetry}>
          Try Again
        </Button>
      }
      secondaryAction={
        <Button variant="text" onClick={handleDiscard}>
          Discard Changes
        </Button>
      }
    />
  );
};
```
:::

### With Technical Details

::: code-with-tooltips
```tsx
import { Error, Button } from '@underwood/components';

export const TechnicalErrorExample = () => {
  const handleRefresh = () => {
    // Refresh logic
  };

  const handleSupport = () => {
    // Contact support logic
  };

  return (
    <Error
      title="API Error"
      message="Failed to fetch user data"
      details="Error: 404 Not Found - /api/users/123"
      action={
        <Button variant="primary" onClick={handleRefresh}>
          Refresh
        </Button>
      }
      secondaryAction={
        <Button variant="secondary" onClick={handleSupport}>
          Contact Support
        </Button>
      }
    />
  );
};
```
:::

### Custom Styled Error

::: code-with-tooltips
```tsx
import { Error, Button } from '@underwood/components';
import { LockIcon } from '@underwood/icons';

export const StyledErrorExample = () => {
  const handleSignIn = () => {
    // Sign in logic
  };

  return (
    <Error
      title="Authentication Failed"
      message="Your session has expired"
      icon={<LockIcon style={{ fontSize: 48 }} />}
      style={{ backgroundColor: '#fff3f3', padding: 32 }}
      action={
        <Button variant="primary" onClick={handleSignIn}>
          Sign In Again
        </Button>
      }
    />
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Error Messages**
   - Use clear error messages
   - Explain what went wrong
   - Suggest recovery actions
   - Keep messages user-friendly

2. **Actions**
   - Provide clear recovery paths
   - Include fallback options
   - Make actions obvious
   - Consider user context

3. **Visual Design**
   - Use appropriate error colors
   - Keep layout clean
   - Make messages prominent
   - Handle responsive layouts

### Accessibility

1. **ARIA Attributes**
   - Use `role="alert"` appropriately
   - Include descriptive labels
   - Handle focus management
   - Support keyboard navigation

2. **Screen Readers**
   - Announce error states
   - Provide error context
   - Include action descriptions
   - Consider error updates

3. **Keyboard Navigation**
   - Make actions focusable
   - Maintain focus order
   - Support keyboard shortcuts
   - Handle focus trapping

### Performance

1. **Error Handling**
   - Handle different error types
   - Log errors appropriately
   - Clean up error states
   - Handle retries efficiently

2. **State Management**
   - Handle state changes efficiently
   - Clean up event listeners
   - Optimize re-renders
   - Handle unmounting

## Related Components

- [Result](./result.md) - For operation results
- [Empty](./empty.md) - For empty states
- [Status](./status.md) - For status indicators
