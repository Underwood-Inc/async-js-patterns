---
title: Banner Component
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

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface BannerProps {
  /** Controls the visibility of the banner */
  visible: boolean;
  /** The banner title */
  title?: string;
  /** The main message content */
  message: string;
  /** Optional action button or element */
  action?: ReactNode;
  /** Callback fired when banner is closed */
  onClose?: () => void;
  /** Banner style variant */
  variant?: 'info' | 'warning' | 'error' | 'success';
  /** Optional icon element */
  icon?: ReactNode;
  /** Whether banner should stick to top of viewport */
  sticky?: boolean;
}
```
:::

### Props Table

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

## Usage

::: code-with-tooltips
```tsx
import { useState } from 'react';
import { Banner, Button } from '@underwood/components';

export const BannerExample = () => {
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
};
```
:::

## Examples

### Basic Banner

::: code-with-tooltips
```tsx
import { Banner } from '@underwood/components';

export const BasicBannerExample = () => (
  <Banner
    visible={true}
    title="Welcome Back!"
    message="We've updated our privacy policy"
  />
);
```
:::

### Warning Banner with Action

::: code-with-tooltips
```tsx
import { Banner, Button } from '@underwood/components';

export const WarningBannerExample = () => {
  const handleLearnMore = () => {
    // Handle learn more action
    console.log('Learn more clicked');
  };

  return (
    <Banner
      visible={true}
      title="Scheduled Maintenance"
      message="System will be unavailable on Sunday, 2AM-4AM"
      variant="warning"
      action={
        <Button variant="secondary" onClick={handleLearnMore}>
          Learn More
        </Button>
      }
    />
  );
};
```
:::

### Sticky Banner with Custom Icon

::: code-with-tooltips
```tsx
import { Banner, Button } from '@underwood/components';
import { StarIcon } from '@underwood/icons';

export const StickyBannerExample = () => {
  const handleClaimOffer = () => {
    // Handle claim offer action
    console.log('Offer claimed');
  };

  return (
    <Banner
      visible={true}
      title="Limited Time Offer"
      message="Get 20% off on all premium features"
      sticky={true}
      icon={<StarIcon />}
      action={
        <Button variant="primary" onClick={handleClaimOffer}>
          Claim Offer
        </Button>
      }
    />
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Message Hierarchy**
   - Use for important, system-wide announcements
   - Reserve for messages that require persistent visibility
   - Limit the number of simultaneous banners
   - Consider message priority

2. **Content Strategy**
   - Keep messages clear and actionable
   - Use appropriate variants for message context
   - Include relevant actions when necessary
   - Maintain consistent tone

3. **Visual Design**
   - Maintain consistent spacing and alignment
   - Use icons to reinforce message type
   - Ensure sufficient contrast for all variants
   - Consider responsive behavior

4. **Interaction Design**
   - Provide clear dismissal options
   - Handle multiple banners gracefully
   - Consider animation for entry/exit
   - Support touch interactions

### Accessibility

1. **ARIA Attributes**
   - Use `role="alert"` for important messages
   - Include `aria-live` regions appropriately
   - Provide `aria-label` for interactive elements
   - Set proper `aria-expanded` states

2. **Keyboard Navigation**
   - Ensure focusable elements are reachable
   - Maintain logical tab order
   - Support keyboard dismissal (Esc key)
   - Handle focus trapping when needed

3. **Screen Readers**
   - Announce new banners appropriately
   - Provide context for actions
   - Include status information in announcements
   - Consider announcement timing

### Performance

1. **Rendering**
   - Minimize banner updates
   - Handle multiple banners efficiently
   - Clean up event listeners on unmount
   - Optimize DOM updates

2. **Animation**
   - Use CSS transitions for smooth animations
   - Consider reduced motion preferences
   - Optimize for performance
   - Handle animation cleanup

## Related Components

- [Alert](/react-component-patterns/feedback/notifications/alert.md) - For contextual feedback messages
- [Toast](/react-component-patterns/feedback/notifications/toast.md) - For brief, auto-dismissing notifications
- [Snackbar](/react-component-patterns/feedback/notifications/snackbar.md) - For temporary feedback about operations
- [Dialog](/react-component-patterns/overlay/modals/dialog.md) - For important messages requiring user action