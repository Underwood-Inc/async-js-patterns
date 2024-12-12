---
title: LoadingBar
description: Page-level loading indicator for navigation and route changes
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Loading
  - React
---

# LoadingBar Component

## Overview

The LoadingBar component provides a page-level loading indicator, typically shown at the top of the application during navigation or route changes. It helps users understand that content is being loaded or processed.

## Usage

```tsx
import { LoadingBar } from '@underwood/components';

function MyApp() {
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
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | boolean | false | Whether to show the loading bar |
| `color` | string | '#2196f3' | Color of the loading bar |
| `height` | number | 3 | Height of the loading bar in pixels |
| `progress` | number | - | Optional manual progress value (0-100) |
| `waitingTime` | number | 1000 | Minimum time to show loading state |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Examples

### Basic Loading Bar

```tsx
<LoadingBar
  loading={true}
  color="#2196f3"
  height={3}
/>
```

### Custom Progress

```tsx
<LoadingBar
  loading={true}
  progress={75}
  color="#4caf50"
  height={4}
/>
```

### With Router Integration

```tsx
function AppLoadingBar() {
  const [loading, setLoading] = useState(false);
  
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
  }, []);

  return (
    <LoadingBar
      loading={loading}
      waitingTime={750}
    />
  );
}
```

### Styled Loading Bar

```tsx
<LoadingBar
  loading={true}
  color="linear-gradient(to right, #00b4db, #0083b0)"
  height={4}
  style={{
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  }}
/>
```

## Best Practices

1. **Timing**
   - Show for meaningful operations
   - Use appropriate minimum duration
   - Handle quick operations gracefully

2. **Visual Design**
   - Keep height subtle
   - Use appropriate colors
   - Consider brand guidelines

3. **Integration**
   - Integrate with routing system
   - Handle errors appropriately
   - Clean up event listeners

4. **Performance**
   - Optimize animations
   - Handle multiple requests
   - Prevent unnecessary renders

## Related Components

- [Progress](./progress.md) - For determinate progress
- [Spinner](./spinner.md) - For loading spinners
- [Skeleton](./skeleton.md) - For content loading states 