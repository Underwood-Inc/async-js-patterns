---
title: Result
description: Display operation results with status and actions
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Status
  - React
---

# Result Component

## Overview

The Result component displays the outcome of an operation, typically showing success, error, or warning states with optional actions. It's commonly used for form submissions, data operations, or process completions.

## Usage

```tsx
import { Result } from '@underwood/components';

function MyComponent() {
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
}
```

## Props

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

## Examples

### Success Result

```tsx
<Result
  status="success"
  title="Order Placed Successfully"
  subtitle="Order #2023120501 has been confirmed"
  actions={
    <>
      <Button variant="primary">Track Order</Button>
      <Button variant="secondary">View Details</Button>
    </>
  }
/>
```

### Error Result

```tsx
<Result
  status="error"
  title="Payment Failed"
  subtitle="There was an issue processing your payment"
  actions={
    <Button variant="primary">
      Try Again
    </Button>
  }
  extra={
    <Link href="/help">Need help?</Link>
  }
/>
```

### Warning Result

```tsx
<Result
  status="warning"
  title="Account Requires Verification"
  subtitle="Please verify your email to continue"
  actions={
    <Button variant="primary">
      Resend Verification
    </Button>
  }
/>
```

### Custom Result

```tsx
<Result
  status="info"
  icon={<CustomIcon />}
  title="Setup Complete"
  subtitle="Your workspace is ready"
  actions={
    <Button variant="primary">
      Get Started
    </Button>
  }
  style={{ backgroundColor: '#f5f5f5' }}
/>
```

## Best Practices

1. **Content**
   - Use clear, action-oriented titles
   - Provide helpful subtitles
   - Include relevant actions

2. **Visual Design**
   - Use appropriate status colors
   - Maintain consistent styling
   - Consider layout spacing

3. **Actions**
   - Prioritize primary actions
   - Keep action labels clear
   - Limit number of actions

4. **Accessibility**
   - Use semantic HTML
   - Include proper ARIA labels
   - Support keyboard navigation

## Related Components

- [Status](./status.md) - For status indicators
- [Empty](./empty.md) - For empty states
- [Error](./error.md) - For error states

```
