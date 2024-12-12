---
title: Banner
description: Prominent announcement displays for important messages and system-wide notifications
category: Feedback
subcategory: Notifications
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Notifications
  - Announcements
  - React
---

# Banner Component

## Overview

The Banner component displays prominent announcements or messages that require user attention. It's designed for system-wide notifications, feature announcements, or important updates that need persistent visibility.

## Key Features

- Multiple style variants (info, warning, error, success)
- Optional action buttons
- Sticky positioning support
- Customizable icons
- Dismissible functionality
- Accessible by default

## Usage

```tsx
import { Banner } from '@underwood/components';

function MyComponent() {
  const [visible, setVisible] = useState(true);

  return (
    <Banner
      visible={visible}
      title="New Feature Available"
      message="Try our new dark mode theme"
      action={
        <Button variant="primary" onClick={() => setVisible(false)}>
          Enable Dark Mode
        </Button>
      }
      onClose={() => setVisible(false)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | boolean | false | Controls the visibility of the banner |
| `title` | string | - | The banner title |
| `message` | string | - | The main message content |
| `action` | ReactNode | - | Optional action button or element |
| `onClose` | function | - | Callback fired when banner is closed |
| `variant` | 'info' \| 'warning' \| 'error' \| 'success' | 'info' | Banner style variant |
| `icon` | ReactNode | - | Optional icon element |
| `sticky` | boolean | false | Whether banner should stick to top of viewport |

## Examples

### Basic Banner

```tsx
<Banner
  visible={true}
  title="Welcome Back!"
  message="We've updated our privacy policy"
/>
```

### Warning Banner with Action

```tsx
<Banner
  visible={true}
  title="Scheduled Maintenance"
  message="System will be unavailable on Sunday, 2AM-4AM"
  variant="warning"
  action={
    <Button variant="secondary">
      Learn More
    </Button>
  }
/>
```

### Sticky Banner with Custom Icon

```tsx
<Banner
  visible={true}
  title="Limited Time Offer"
  message="Get 20% off on all premium features"
  sticky={true}
  icon={<StarIcon />}
  action={
    <Button variant="primary">
      Claim Offer
    </Button>
  }
/>
```

## Best Practices

### Usage Guidelines

1. **Message Hierarchy**
   - Use for important, system-wide announcements
   - Reserve for messages that require persistent visibility
   - Limit the number of simultaneous banners

2. **Content Strategy**
   - Keep messages clear and actionable
   - Use appropriate variants for message context
   - Include relevant actions when necessary

3. **Visual Design**
   - Maintain consistent spacing and alignment
   - Use icons to reinforce message type
   - Ensure sufficient contrast for all variants

4. **Interaction Design**
   - Provide clear dismissal options
   - Handle multiple banners gracefully
   - Consider animation for entry/exit

### Accessibility

1. **ARIA Attributes**
   - Use `role="alert"` for important messages
   - Include `aria-live` regions appropriately
   - Provide `aria-label` for interactive elements

2. **Keyboard Navigation**
   - Ensure focusable elements are reachable
   - Maintain logical tab order
   - Support keyboard dismissal (Esc key)

3. **Screen Readers**
   - Announce new banners appropriately
   - Provide context for actions
   - Include status information in announcements

### Performance

1. **Rendering**
   - Minimize banner updates
   - Handle multiple banners efficiently
   - Clean up event listeners on unmount

2. **Animation**
   - Use CSS transitions for smooth animations
   - Consider reduced motion preferences
   - Optimize for performance

## Related Components

- [Alert](./alert.md) - For contextual feedback messages
- [Toast](./toast.md) - For brief, auto-dismissing notifications
- [Snackbar](./snackbar.md) - For temporary feedback about operations
- [Dialog](../modals/dialog.md) - For important messages requiring user action