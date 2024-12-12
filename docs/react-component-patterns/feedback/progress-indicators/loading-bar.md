---
title: LoadingBar Component
description: Page-level loading indicator for navigation and route changes
category: Feedback
subcategory: Progress Indicators
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Loading
  - React
---

# LoadingBar Component

## Overview

The LoadingBar component provides a page-level loading indicator, typically shown at the top of the application during navigation or route changes. It helps users understand that content is being loaded or processed while maintaining a clean and unobtrusive interface.

## Key Features

- Automatic progress animation
- Manual progress control
- Customizable appearance
- Router integration support
- Minimum display duration
- Accessible by default

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { CSSProperties } from 'react';

export interface LoadingBarProps {
  /** Whether to show the loading bar */
  loading: boolean;
  /** Color of the loading bar */
  color?: string;
  /** Height of the loading bar in pixels */
  height?: number;
  /** Optional manual progress value (0-100) */
  progress?: number;
  /** Minimum time to show loading state */
  waitingTime?: number;
  /** Additional CSS class */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | boolean | false | Whether to show the loading bar |
| `color` | string | '#2196f3' | Color of the loading bar |
| `height` | number | 3 | Height of the loading bar in pixels |
| `progress` | number | - | Optional manual progress value (0-100) |
| `waitingTime` | number | 1000 | Minimum time to show loading state |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Usage

::: code-with-tooltips
```tsx
import { useState } from 'react';
import { LoadingBar } from '@underwood/components';

export const LoadingBarExample = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingBar
        loading={loading}
        color="#2196f3"
        height={3}
      />
      {/* Rest of your app */}
    </>
  );
};
```
:::

## Examples

### Basic Loading Bar

::: code-with-tooltips
```tsx
import { LoadingBar } from '@underwood/components';

export const BasicLoadingBarExample = () => (
  <LoadingBar
    loading={true}
    color="#2196f3"
    height={3}
  />
);
```
:::

### Custom Progress

::: code-with-tooltips
```tsx
import { LoadingBar } from '@underwood/components';

export const CustomProgressExample = () => (
  <LoadingBar
    loading={true}
    progress={75}
    color="#4caf50"
    height={4}
  />
);
```
:::

### With Router Integration

::: code-with-tooltips
```tsx
import { useState, useEffect } from 'react';
import { LoadingBar } from '@underwood/components';
import { useRouter } from 'next/router';

export const RouterLoadingBarExample = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);
    
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <LoadingBar
      loading={loading}
      waitingTime={750}
    />
  );
};
```
:::

### Styled Loading Bar

::: code-with-tooltips
```tsx
import { LoadingBar } from '@underwood/components';

export const StyledLoadingBarExample = () => (
  <LoadingBar
    loading={true}
    color="linear-gradient(to right, #00b4db, #0083b0)"
    height={4}
    style={{
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}
  />
);
```
:::

## Best Practices

### Usage Guidelines

1. **Timing and Display**
   - Show for meaningful operations
   - Use appropriate minimum duration
   - Handle quick operations gracefully
   - Consider user perception

2. **Visual Design**
   - Keep height subtle and unobtrusive
   - Use appropriate colors
   - Consider brand guidelines
   - Maintain consistent styling

3. **Integration**
   - Integrate with routing system
   - Handle errors appropriately
   - Clean up event listeners
   - Consider page transitions

### Accessibility

1. **ARIA Attributes**
   - Use `role="progressbar"` appropriately
   - Set `aria-valuenow` when using manual progress
   - Include descriptive labels
   - Handle focus management

2. **Screen Readers**
   - Announce loading states
   - Provide loading context
   - Consider loading duration
   - Handle state changes

3. **Animation**
   - Respect reduced motion preferences
   - Use smooth transitions
   - Consider animation impact
   - Provide static alternatives

### Performance

1. **Animation**
   - Use CSS transitions when possible
   - Optimize animation frames
   - Handle cleanup properly
   - Consider battery impact

2. **Resource Management**
   - Handle multiple requests efficiently
   - Prevent unnecessary renders
   - Clean up event listeners
   - Optimize state updates

## Related Components

- [Progress](./progress.md) - For showing determinate progress
- [Spinner](./spinner.md) - For simple loading indicators
- [Skeleton](./skeleton.md) - For content loading placeholders
- [TopProgressBar](./top-progress-bar.md) - For YouTube-style loading indicators