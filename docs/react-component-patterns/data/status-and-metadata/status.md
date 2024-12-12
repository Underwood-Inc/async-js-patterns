---
title: Status Component
description: Visual indicators for representing status states
category: Data
subcategory: Status & Metadata
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - Status
  - React
---

# Status Component

## Overview

The Status component provides visual indicators for representing different states such as online/offline, active/inactive, or processing states. It helps users quickly understand the current state of items or processes through clear, accessible visual cues.

## Key Features

- Multiple status states
- Various size options
- Optional label display
- Pulse animation support
- Custom styling options
- Interactive capabilities
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { CSSProperties } from 'react';

export interface StatusProps {
  /** Current status state */
  state: 'online' | 'offline' | 'processing' | 'error' | 'warning';
  /** Accessible label for the status */
  label: string;
  /** Size of the status indicator */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show the label text */
  showLabel?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Whether to show pulse animation */
  pulseAnimation?: boolean;
  /** Click handler for interactive status */
  onClick?: () => void;
}
```
:::

## Usage

### Basic Status

::: code-with-tooltips
```tsx
import { Status } from '@/components/data';

export const StatusExample = () => {
  return (
    <div>
      <Status state="online" label="Server Status" />
      <Status state="processing" label="Job Status" />
      <Status state="offline" label="Connection Status" />
    </div>
  );
};
```
:::

### Examples

#### With Custom Styling

::: code-with-tooltips
```tsx
import { Status } from '@/components/data';

export const CustomStatusExample = () => (
  <Status
    state="processing"
    label="Job Status"
    size="large"
    style={{ backgroundColor: '#e3f2fd' }}
  />
);
```
:::

#### Status Group

::: code-with-tooltips
```tsx
import { Status } from '@/components/data';

export const StatusGroupExample = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Status state="online" label="API" showLabel />
    <Status state="warning" label="Database" showLabel />
    <Status state="error" label="Cache" showLabel />
  </div>
);
```
:::

#### Interactive Status

::: code-with-tooltips
```tsx
import { Status } from '@/components/data';
import { useState } from 'react';

export const InteractiveStatusExample = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <Status
        state="online"
        label="Click for details"
        showLabel
        onClick={() => setIsDetailsOpen(true)}
        style={{ cursor: 'pointer' }}
      />
      {isDetailsOpen && (
        <div>
          <h3>System Status: Online</h3>
          <p>Last updated: 2 minutes ago</p>
          <p>Uptime: 99.9%</p>
        </div>
      )}
    </>
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Visual Communication**
   - Use consistent colors for states
   - Keep indicators visible but subtle
   - Consider color-blind users
   - Maintain clear state differences

2. **State Management**
   - Use clear, distinct states
   - Handle transitions smoothly
   - Update states immediately
   - Consider loading states

3. **Layout and Spacing**
   - Maintain consistent sizing
   - Consider mobile viewports
   - Handle text overflow
   - Align indicators properly

### Accessibility

1. **ARIA Attributes**
   - Use `role="status"` appropriately
   - Include descriptive labels
   - Handle focus management
   - Support keyboard interaction

2. **Color and Contrast**
   - Ensure sufficient color contrast
   - Provide alternative indicators
   - Consider color blindness
   - Test with screen readers

3. **Interactive Elements**
   - Make clickable areas large enough
   - Provide hover states
   - Include focus indicators
   - Add tooltips when needed

### Performance

1. **Animations**
   - Use CSS transitions
   - Optimize pulse animations
   - Handle cleanup properly
   - Consider reduced motion

2. **State Updates**
   - Batch status changes
   - Prevent unnecessary renders
   - Clean up event listeners
   - Handle unmounting

## Related Components

- [Badge](./badge.md) - For status counts and indicators
- [Tag](./tag.md) - For labels and categories
- [Indicator](./indicator.md) - For simple visual indicators