---
title: Badge Component
description: Component for displaying status indicators, counts, and labels
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Badge
  - Status
  - React
---

# Badge Component

## Overview

The Badge component is used to display status indicators, counts, and labels. It supports various styles, colors, and positioning options.

## Usage

### Basic Badge

::: code-with-tooltips

```tsx
import { Badge } from '@/components/data';

<Badge>New</Badge>

<Badge count={5}>
  <Icon name="notifications" />
</Badge>

<Badge status="success">Active</Badge>
```

:::

### API Reference

```tsx
interface BadgeProps {
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

### Examples

#### Status Badges

::: code-with-tooltips

```tsx
<Badge variant="dot" color="success">Active</Badge>
<Badge variant="dot" color="error">Offline</Badge>
<Badge variant="dot" color="warning">Away</Badge>
```

:::

#### Counter Badge

::: code-with-tooltips

```tsx
<Badge count={99} maxCount={99}>
  <Button>Messages</Button>
</Badge>

<Badge count={1000} maxCount={999}>
  <Icon name="notifications" />
</Badge>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  children,
  count,
  maxCount = 99,
  variant = 'filled',
  color = 'default',
  size = 'md',
  visible = true,
  showZero = false,
  offset = [0, 0],
  placement = 'top-right',
  className,
  ...props
}, ref) => {
  const showBadge = visible && (
    typeof count === 'number' ? (count > 0 || showZero) : true
  );
  
  const content = typeof count === 'number'
    ? count > maxCount
      ? `${maxCount}+`
      : count.toString()
    : children;
  
  return (
    <span
      ref={ref}
      className={clsx(
        'badge',
        `badge--${variant}`,
        `badge--${color}`,
        `badge--${size}`,
        `badge--${placement}`,
        { 'badge--standalone': !children },
        className
      )}
      style={{
        '--badge-offset-x': `${offset[0]}px`,
        '--badge-offset-y': `${offset[1]}px`
      } as React.CSSProperties}
      {...props}
    >
      {children}
      {showBadge && (
        <span className="badge__content">
          {content}
        </span>
      )}
    </span>
  );
});
```

:::

## Styling

### Base Styles

::: code-with-tooltips

```scss
.badge {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  
  // Content styles
  &__content {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--badge-min-width);
    height: var(--badge-height);
    padding: 0 var(--badge-padding);
    border-radius: var(--badge-border-radius);
    font-size: var(--badge-font-size);
    font-weight: var(--badge-font-weight);
    line-height: 1;
    white-space: nowrap;
    transform: translate(
      var(--badge-offset-x, 0),
      var(--badge-offset-y, 0)
    );
    
    // Placement variations
    .badge--top-right & {
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
    
    .badge--top-left & {
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
    }
    
    .badge--bottom-right & {
      bottom: 0;
      right: 0;
      transform: translate(50%, 50%);
    }
    
    .badge--bottom-left & {
      bottom: 0;
      left: 0;
      transform: translate(-50%, 50%);
    }
  }
  
  // Variant styles
  &--filled {
    .badge__content {
      color: var(--badge-text-color);
      background: var(--badge-bg-color);
    }
  }
  
  &--outlined {
    .badge__content {
      color: var(--badge-bg-color);
      background: transparent;
      border: 1px solid var(--badge-bg-color);
    }
  }
  
  &--dot {
    .badge__content {
      min-width: var(--badge-dot-size);
      height: var(--badge-dot-size);
      padding: 0;
      border-radius: 50%;
    }
  }
  
  // Color variations
  &--primary { --badge-bg-color: var(--primary-color); }
  &--success { --badge-bg-color: var(--success-color); }
  &--warning { --badge-bg-color: var(--warning-color); }
  &--error { --badge-bg-color: var(--error-color); }
  
  // Size variations
  &--sm {
    --badge-min-width: 16px;
    --badge-height: 16px;
    --badge-padding: 4px;
    --badge-font-size: 12px;
    --badge-dot-size: 8px;
  }
  
  &--md {
    --badge-min-width: 20px;
    --badge-height: 20px;
    --badge-padding: 6px;
    --badge-font-size: 14px;
    --badge-dot-size: 10px;
  }
  
  &--lg {
    --badge-min-width: 24px;
    --badge-height: 24px;
    --badge-padding: 8px;
    --badge-font-size: 16px;
    --badge-dot-size: 12px;
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders content correctly', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('handles count display', () => {
    render(<Badge count={5}>
      <div>Content</div>
    </Badge>);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('respects maxCount', () => {
    render(<Badge count={100} maxCount={99}>
      <div>Content</div>
    </Badge>);
    
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('handles visibility', () => {
    const { rerender } = render(
      <Badge count={5} visible={false}>
        <div>Content</div>
      </Badge>
    );
    
    expect(screen.queryByText('5')).not.toBeInTheDocument();
    
    rerender(
      <Badge count={5} visible={true}>
        <div>Content</div>
      </Badge>
    );
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('applies correct classes', () => {
    const { container } = render(
      <Badge
        variant="dot"
        color="success"
        size="sm"
        placement="top-right"
      >
        Content
      </Badge>
    );
    
    expect(container.firstChild).toHaveClass(
      'badge',
      'badge--dot',
      'badge--success',
      'badge--sm',
      'badge--top-right'
    );
  });
});
```

:::

## Accessibility

### ARIA Attributes

::: code-with-tooltips

```tsx
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  count,
  children,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={typeof count === 'number' ? `${count} notifications` : undefined}
      {...props}
    >
      {children}
    </span>
  );
});
```

:::

## Best Practices

### Usage Guidelines

::: code-with-tooltips

```tsx
// DO: Use appropriate colors for status
<Badge color="success">Active</Badge>
<Badge color="error">Error</Badge>

// DON'T: Mix status colors with count
<Badge color="success" count={5}> {/* Confusing! */}
  <Icon name="check" />
</Badge>

// DO: Use consistent sizing
<Badge size="sm">
  <Icon size="sm" />
</Badge>

// DON'T: Mix sizes
<Badge size="lg">
  <Icon size="sm" /> {/* Inconsistent! */}
</Badge>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize dynamic content
const DynamicBadge = memo(({ count, children }) => (
  <Badge count={count}>{children}</Badge>
));

// DON'T: Create new styles inline
<Badge style={{ margin: '8px' }}> {/* Avoid! */}
  Content
</Badge>
```

:::
