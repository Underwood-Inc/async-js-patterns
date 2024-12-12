---
title: Result Component
description: Display operation results with status and actions
category: Feedback
subcategory: Status Indicators
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Status
  - React
---

# Result Component

## Overview

The Result component displays the outcome of an operation, typically showing success, error, or warning states with optional actions. It's designed to provide clear feedback after form submissions, data operations, or process completions, with appropriate visual cues and next steps.

## Key Features

- Multiple status types (success, error, warning, info)
- Customizable titles and subtitles
- Optional action buttons
- Custom icon support
- Extra content area
- Accessible by default
- Responsive layout

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode, CSSProperties } from 'react';

export interface ResultProps {
  /** Result status type */
  status: 'success' | 'error' | 'warning' | 'info';
  /** Main result message */
  title: string;
  /** Additional details */
  subtitle?: string;
  /** Action buttons or links */
  actions?: ReactNode;
  /** Custom icon override */
  icon?: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Extra content below actions */
  extra?: ReactNode;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | 'success' \| 'error' \| 'warning' \| 'info' | - | Result status type |
| `title` | string | - | Main result message |
| `subtitle` | string | - | Additional details |
| `actions` | ReactNode | - | Action buttons or links |
| `icon` | ReactNode | - | Custom icon override |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |
| `extra` | ReactNode | - | Extra content below actions |

## Usage

::: code-with-tooltips
```tsx
import { Result, Button } from '@underwood/components';

export const ResultExample = () => {
  return (
    <Result
      status="success"
      title="Payment Successful"
      subtitle="Your order has been processed"
      actions={
        <Button variant="primary">
          View Order
        </Button>
      }
    />
  );
};
```
:::

## Examples

### Success Result

::: code-with-tooltips
```tsx
import { Result, Button } from '@underwood/components';

export const SuccessResultExample = () => {
  const handleTrackOrder = () => {
    // Handle order tracking
  };

  const handleViewDetails = () => {
    // Handle viewing details
  };

  return (
    <Result
      status="success"
      title="Order Placed Successfully"
      subtitle="Order #2023120501 has been confirmed"
      actions={
        <>
          <Button variant="primary" onClick={handleTrackOrder}>
            Track Order
          </Button>
          <Button variant="secondary" onClick={handleViewDetails}>
            View Details
          </Button>
        </>
      }
    />
  );
};
```
:::

### Error Result

::: code-with-tooltips
```tsx
import { Result, Button, Link } from '@underwood/components';

export const ErrorResultExample = () => {
  const handleRetry = () => {
    // Handle payment retry
  };

  return (
    <Result
      status="error"
      title="Payment Failed"
      subtitle="There was an issue processing your payment"
      actions={
        <Button variant="primary" onClick={handleRetry}>
          Try Again
        </Button>
      }
      extra={
        <Link href="/help">Need help?</Link>
      }
    />
  );
};
```
:::

### Warning Result

::: code-with-tooltips
```tsx
import { Result, Button } from '@underwood/components';

export const WarningResultExample = () => {
  const handleResendVerification = () => {
    // Handle resending verification email
  };

  return (
    <Result
      status="warning"
      title="Account Requires Verification"
      subtitle="Please verify your email to continue"
      actions={
        <Button variant="primary" onClick={handleResendVerification}>
          Resend Verification
        </Button>
      }
    />
  );
};
```
:::

### Custom Result

::: code-with-tooltips
```tsx
import { Result, Button } from '@underwood/components';
import { CustomIcon } from '@underwood/icons';

export const CustomResultExample = () => {
  const handleGetStarted = () => {
    // Handle get started action
  };

  return (
    <Result
      status="info"
      icon={<CustomIcon />}
      title="Setup Complete"
      subtitle="Your workspace is ready"
      actions={
        <Button variant="primary" onClick={handleGetStarted}>
          Get Started
        </Button>
      }
      style={{ backgroundColor: '#f5f5f5' }}
    />
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Content Strategy**
   - Use clear, action-oriented titles
   - Provide helpful, concise subtitles
   - Include relevant next steps
   - Maintain consistent messaging

2. **Visual Design**
   - Use appropriate status colors
   - Maintain consistent styling
   - Consider layout spacing
   - Handle responsive behavior

3. **Actions**
   - Prioritize primary actions
   - Keep action labels clear
   - Limit number of actions
   - Consider mobile interactions

### Accessibility

1. **ARIA Attributes**
   - Use `role="status"` appropriately
   - Include descriptive labels
   - Handle focus management
   - Support keyboard navigation

2. **Content Structure**
   - Use semantic HTML elements
   - Maintain logical tab order
   - Provide clear feedback
   - Consider screen readers

3. **Interactive Elements**
   - Make buttons focusable
   - Provide hover states
   - Support keyboard shortcuts
   - Handle focus trapping

### Performance

1. **Rendering**
   - Optimize icon loading
   - Handle transitions smoothly
   - Manage state updates
   - Clean up event listeners

2. **Resource Management**
   - Load assets efficiently
   - Handle unmounting properly
   - Optimize re-renders
   - Consider code splitting

## Related Components

- [Status](./status.md) - For simple status indicators
- [Empty](./empty.md) - For empty state displays
- [Error](./error.md) - For detailed error states
- [Alert](../notifications/alert.md) - For temporary status messages

```
