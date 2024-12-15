---
title: Badge Component
description: Component for displaying status indicators, counts, and labels
category: Data
subcategory: Status & Metadata
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - Badge
  - Status
  - React
---

# Badge Component

## Overview

The Badge component is used to display status indicators, numerical counts, and labels. It supports various styles, colors, and positioning options, making it versatile for showing notifications, status indicators, and counters.

## Key Features

- Multiple display variants (dot, numeric, text)
- Customizable positioning
- Maximum count handling
- Color variations
- Size options
- Visibility control
- Accessibility support

## Component API

### Props Interface

::: code-with-tooltips

```tsx
import React from 'react';

export interface BadgeProps {
  /** Badge content */
  children?: React.ReactNode;
  /** Numerical value to display */
  count?: number;
  /** Maximum count to show */
  maxCount?: number;
  /** Badge variant */
  variant?: 'filled' | 'outlined' | 'dot';
  /** Badge color */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether badge is visible */
  visible?: boolean;
  /** Whether to show zero count */
  showZero?: boolean;
  /** Badge offset */
  offset?: [number, number];
  /** Badge placement */
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Additional CSS class */
  className?: string;
}
```

:::

## Usage

### Basic Badge

::: code-with-tooltips

```tsx
import React from 'react';
import { Badge } from '@/components/data';
import { Icon } from '@/components/core';

const BasicBadgeExample = () => (
  <div>
    {/* Simple text badge */}
    <Badge>New</Badge>

    {/* Numeric badge */}
    <Badge count={5}>
      <Icon name="notifications" />
    </Badge>

    {/* Status badge */}
    <Badge variant="dot" color="success">Active</Badge>
  </div>
);

export default BasicBadgeExample;
```

:::

### Examples

#### Status Indicators

::: code-with-tooltips

```tsx
import React from 'react';
import { Badge } from '@/components/data';

const StatusIndicatorsExample = () => (
  <div>
    <Badge variant="dot" color="success">Online</Badge>
    <Badge variant="dot" color="error">Offline</Badge>
    <Badge variant="dot" color="warning">Away</Badge>
  </div>
);

export default StatusIndicatorsExample;
```

:::

#### Notification Counters

::: code-with-tooltips

```tsx
import React from 'react';
import { Badge } from '@/components/data';
import { Button } from '@/components/core';

const NotificationCountersExample = () => (
  <div>
    <Badge count={99} maxCount={99}>
      <Button>Messages</Button>
    </Badge>

    <Badge count={1000} maxCount={999}>
      <Icon name="notifications" />
    </Badge>
  </div>
);

export default NotificationCountersExample;
```

:::

#### Custom Placement

::: code-with-tooltips

```tsx
import React from 'react';
import { Badge } from '@/components/data';
import { Avatar } from '@/components/core';

const CustomPlacementExample = () => (
  <div>
    <Badge 
      count={5} 
      placement="bottom-right"
      offset={[5, 5]}
    >
      <Avatar src="/user.jpg" />
    </Badge>
  </div>
);

export default CustomPlacementExample;
```

:::

## Best Practices

### Usage Guidelines

1. **Visual Design**
   - Use consistent colors for states
   - Keep badges proportional to content
   - Maintain clear visibility
   - Consider badge placement

2. **Content Display**
   - Keep text concise
   - Handle overflow gracefully
   - Use appropriate max counts
   - Consider mobile viewports

3. **Interaction States**
   - Handle hover states
   - Support focus states
   - Manage visibility
   - Consider animations

### Accessibility

1. **ARIA Support**
   - Use proper roles
   - Provide descriptive labels
   - Support screen readers
   - Handle focus management

2. **Visual Accessibility**
   - Ensure color contrast
   - Support high contrast modes
   - Consider color blindness
   - Maintain readability

### Performance

1. **Rendering**
   - Optimize badge updates
   - Handle count changes
   - Manage visibility
   - Clean up listeners

2. **Animation**
   - Use CSS transitions
   - Optimize transforms
   - Handle unmounting
   - Consider reduced motion

## Related Components

- [Status](./status.md) - For status indicators
- [Tag](./tag.md) - For labels and categories
- [Chip](./chip.md) - For interactive filters
