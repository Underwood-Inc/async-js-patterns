---
title: Indicator Component
description: Visual indicator component for status and state
category: Data
subcategory: Status and Metadata
date: 2024-12-01
author: Underwood Inc
status: Stable
tags:
  - Data
  - Status
  - Indicator
  - React
---

# Indicator Component

## Overview

The Indicator component provides a visual representation of status, state, or progress. It supports various styles, animations, and customization options.

## Key Features

- Status states
- Custom colors
- Animations
- Size variants
- Position options
- Custom styling
- Accessibility support

## Component API

```tsx
import React from 'react';

export interface IndicatorProps {
  /** Status variant */
  variant?: 'dot' | 'badge' | 'pulse';
  /** Status color */
  color?: 'success' | 'error' | 'warning' | 'info' | string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show animation */
  animated?: boolean;
  /** Animation type */
  animation?: 'pulse' | 'ping' | 'blink';
  /** Position relative to container */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Whether indicator is visible */
  show?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Custom content */
  children?: React.ReactNode;
  /** Container element */
  container?: React.ReactNode;
  /** Tooltip text */
  tooltip?: string;
  /** ARIA label */
  ariaLabel?: string;
}
```

## Usage Examples

### Basic Indicator

```tsx
import { Indicator } from '@/components/data/status-and-metadata';

export const BasicIndicatorExample = () => {
  return (
    <Indicator
      variant="dot"
      color="success"
    />
  );
};
```

### With Animation

```tsx
import { Indicator } from '@/components/data/status-and-metadata';

export const AnimatedIndicatorExample = () => (
  <Indicator
    variant="pulse"
    color="error"
    animated
    animation="ping"
  />
);
```

### With Container

```tsx
import { Indicator } from '@/components/data/status-and-metadata';
import { Avatar } from '@/components/data';

export const ContainerIndicatorExample = () => {
  const user = {
    avatar: '/avatars/user.jpg'
  };

  return (
    <Indicator
      variant="badge"
      color="warning"
      position="top-right"
    >
      <Avatar src={user.avatar} />
    </Indicator>
  );
};
```

### With Custom Color

```tsx
import { Indicator } from '@/components/data/status-and-metadata';

export const CustomColorIndicatorExample = () => (
  <Indicator
    variant="dot"
    color="#6366F1"
    size="large"
    tooltip="Custom status"
  />
);
```

## Best Practices

1. **Visual Design**
   - Clear states
   - Consistent colors
   - Appropriate sizing
   - Visible contrast

2. **Animation**
   - Subtle effects
   - Performance
   - Reduced motion
   - Purpose-driven

3. **Accessibility**
   - Color meaning
   - ARIA labels
   - Screen readers
   - Focus states

4. **Implementation**
   - Flexible positioning
   - Responsive design
   - Browser support
   - Performance

## Related Components

- [Label](/react-component-patterns/data/status-and-metadata/label.md) - For text labels
- Badge - For numeric indicators
- [Status](/react-component-patterns/data/status-and-metadata/status.md) - For status displays

## Testing Examples

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { Indicator } from '@/components/data/status-and-metadata';

describe('Indicator', () => {
  it('renders with default props', () => {
    render(<Indicator />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    const { container } = render(
      <Indicator variant="pulse" color="success" />
    );
    expect(container.firstChild).toHaveClass('indicator--pulse');
    expect(container.firstChild).toHaveClass('indicator--success');
  });

  it('renders with custom color', () => {
    const { container } = render(
      <Indicator color="#FF0000" />
    );
    expect(container.firstChild).toHaveStyle({
      backgroundColor: '#FF0000'
    });
  });

  it('renders with children', () => {
    render(
      <Indicator>
        <div data-testid="child">Content</div>
      </Indicator>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
```

### Integration Tests

```tsx
import { render, screen } from '@testing-library/react';
import { Indicator, Avatar } from '@/components/data';

describe('Indicator Integration', () => {
  it('integrates with Avatar component', () => {
    render(
      <Indicator position="top-right" color="success">
        <Avatar src="/avatar.jpg" alt="User" />
      </Indicator>
    );

    expect(screen.getByRole('status')).toHaveClass('indicator--top-right');
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles animation states', () => {
    const { container } = render(
      <Indicator
        animated
        animation="pulse"
        color="warning"
      />
    );

    expect(container.firstChild).toHaveClass('indicator--animated');
    expect(container.firstChild).toHaveClass('indicator--pulse-animation');
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Indicator', () => {
  test('shows tooltip on hover', async ({ page }) => {
    await page.goto('/components/indicator');
    
    const indicator = page.locator('.indicator[data-tooltip]');
    
    // Hover over indicator
    await indicator.hover();
    
    // Check tooltip is visible
    await expect(page.locator('.tooltip')).toBeVisible();
  });

  test('maintains position with container resize', async ({ page }) => {
    await page.goto('/components/indicator');
    
    const container = page.locator('.indicator-container');
    const indicator = page.locator('.indicator');
    
    // Get initial position
    const initialBounds = await indicator.boundingBox();
    
    // Resize container
    await page.evaluate(() => {
      document.querySelector('.indicator-container').style.width = '500px';
    });
    
    // Get new position
    const newBounds = await indicator.boundingBox();
    
    // Verify relative position is maintained
    expect(newBounds.x - initialBounds.x).toBeLessThan(1);
    expect(newBounds.y - initialBounds.y).toBeLessThan(1);
  });

  test('handles theme changes', async ({ page }) => {
    await page.goto('/components/indicator');
    
    // Switch to dark theme
    await page.click('[data-testid="theme-toggle"]');
    
    // Verify indicator adapts to theme
    await expect(page.locator('.indicator')).toHaveCSS(
      'background-color',
      'rgb(45, 55, 72)' // Dark theme color
    );
  });
});
```