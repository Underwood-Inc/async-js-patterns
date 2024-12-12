---
title: Status
description: Visual indicators for representing status states
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Status
  - React
---

# Status Component

## Overview

The Status component provides visual indicators for representing different states such as online/offline, active/inactive, or processing states. It helps users quickly understand the current state of items or processes.

## Usage

```tsx
import { Status } from '@underwood/components';

function MyComponent() {
  return (
    <div>
      <Status state="online" label="Server Status" />
      <Status state="processing" label="Job Status" />
      <Status state="offline" label="Connection Status" />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | 'online' \| 'offline' \| 'processing' \| 'error' \| 'warning' | - | Current status state |
| `label` | string | - | Accessible label for the status |
| `size` | 'small' \| 'medium' \| 'large' | 'medium' | Size of the status indicator |
| `showLabel` | boolean | false | Whether to show the label text |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |
| `pulseAnimation` | boolean | true | Whether to show pulse animation |

## Examples

### Basic Status

```tsx
<Status
  state="online"
  label="Server Status"
  showLabel
/>
```

### With Custom Styling

```tsx
<Status
  state="processing"
  label="Job Status"
  size="large"
  style={{ backgroundColor: '#e3f2fd' }}
/>
```

### Status Group

```tsx
<div style={{ display: 'flex', gap: 16 }}>
  <Status state="online" label="API" showLabel />
  <Status state="warning" label="Database" showLabel />
  <Status state="error" label="Cache" showLabel />
</div>
```

### Interactive Status

```tsx
<Status
  state="online"
  label="Click for details"
  showLabel
  onClick={() => showDetails()}
  style={{ cursor: 'pointer' }}
/>
```

## Best Practices

1. **Visual Design**
   - Use consistent colors for states
   - Keep indicators visible but subtle
   - Consider color-blind users

2. **Accessibility**
   - Always include descriptive labels
   - Use proper ARIA attributes
   - Support screen readers

3. **Interaction**
   - Make clickable areas large enough
   - Provide hover states when interactive
   - Include tooltips when needed

4. **States**
   - Use clear, distinct states
   - Handle transitions smoothly
   - Update states immediately

## Related Components

- [Result](./result.md) - For operation results
- [Empty](./empty.md) - For empty states
- [Error](./error.md) - For error states
