---
title: Error
description: Display error states and error handling interfaces
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Error
  - React
---

# Error Component

## Overview

The Error component displays error states and provides error handling interfaces. It helps users understand what went wrong and offers ways to recover or get help.

## Usage

```tsx
import { Error, Button } from '@underwood/components';
import { LockIcon } from '@underwood/icons';

// Basic error example
function ErrorExample() {
  const retry = () => {
    // Retry logic
  };

  return (
    <Error
      title="Connection Error"
      message="Please check your internet connection"
      action={
        <Button variant="primary" onClick={retry}>
          Retry Connection
        </Button>
      }
    />
  );
}

// Multiple actions example
<Error
  title="Failed to Save Changes"
  message="Your changes could not be saved due to a server error"
  action={
    <Button variant="primary">
      Try Again
    </Button>
  }
  secondaryAction={
    <Button variant="text">
      Discard Changes
    </Button>
  }
/>

// With technical details
<Error
  title="API Error"
  message="Failed to fetch user data"
  details="Error: 404 Not Found - /api/users/123"
  action={
    <Button variant="primary">
      Refresh
    </Button>
  }
  secondaryAction={
    <Button variant="secondary">
      Contact Support
    </Button>
  }
/>

// Custom styled error
<Error
  title="Authentication Failed"
  message="Your session has expired"
  icon={<LockIcon style={{ fontSize: 48 }} />}
  style={{ backgroundColor: '#fff3f3', padding: 32 }}
  action={
    <Button variant="primary">
      Sign In Again
    </Button>
  }
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | - | Main error message |
| `message` | string | - | Detailed error description |
| `action` | ReactNode | - | Primary action button |
| `secondaryAction` | ReactNode | - | Secondary action button |
| `icon` | ReactNode | - | Custom error icon |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |
| `details` | string | - | Technical error details (optional) |

## Examples

### Basic Error

```tsx
<Error
  title="Connection Error"
  message="Please check your internet connection"
  action={
    <Button variant="primary">
      Retry Connection
    </Button>
  }
/>
```

### With Multiple Actions

```tsx
<Error
  title="Failed to Save Changes"
  message="Your changes could not be saved due to a server error"
  action={
    <Button variant="primary">
      Try Again
    </Button>
  }
  secondaryAction={
    <Button variant="text">
      Discard Changes
    </Button>
  }
/>
```

### With Technical Details

```tsx
<Error
  title="API Error"
  message="Failed to fetch user data"
  details="Error: 404 Not Found - /api/users/123"
  action={
    <Button variant="primary">
      Refresh
    </Button>
  }
  secondaryAction={
    <Button variant="secondary">
      Contact Support
    </Button>
  }
/>
```

### Custom Styled Error

```tsx
<Error
  title="Authentication Failed"
  message="Your session has expired"
  icon={<LockIcon style={{ fontSize: 48 }} />}
  style={{ backgroundColor: '#fff3f3', padding: 32 }}
  action={
    <Button variant="primary">
      Sign In Again
    </Button>
  }
/>
```

## Best Practices

1. **Messages**
   - Use clear error messages
   - Explain what went wrong
   - Suggest recovery actions

2. **Actions**
   - Provide clear recovery paths
   - Include fallback options
   - Make actions obvious

3. **Visual Design**
   - Use appropriate error colors
   - Keep layout clean
   - Make messages prominent

4. **Error Handling**
   - Handle different error types
   - Provide appropriate context
   - Log errors for debugging

## Related Components

- [Result](./result.md) - For operation results
- [Empty](./empty.md) - For empty states
- [Status](./status.md) - For status indicators
