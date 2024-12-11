---
title: Spacing System
description: A comprehensive spacing system for React components with consistent scales and responsive layouts
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Spacing
  - Layout
  - Design System
  - Responsive Design
---

# Spacing System

## Overview

Our spacing system provides a consistent and scalable approach to component layout and spacing. It uses a base unit scale that maintains visual harmony across the application.

## Spacing Scale

### Base Units

::: code-with-tooltips

```scss
:root {
  // Base spacing unit (4px)
  --spacing-unit: 4px;

  // Spacing scale
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0-5: calc(var(--spacing-unit) * 0.5);  // 2px
  --spacing-1: var(--spacing-unit);                 // 4px
  --spacing-2: calc(var(--spacing-unit) * 2);       // 8px
  --spacing-3: calc(var(--spacing-unit) * 3);       // 12px
  --spacing-4: calc(var(--spacing-unit) * 4);       // 16px
  --spacing-5: calc(var(--spacing-unit) * 5);       // 20px
  --spacing-6: calc(var(--spacing-unit) * 6);       // 24px
  --spacing-8: calc(var(--spacing-unit) * 8);       // 32px
  --spacing-10: calc(var(--spacing-unit) * 10);     // 40px
  --spacing-12: calc(var(--spacing-unit) * 12);     // 48px
  --spacing-16: calc(var(--spacing-unit) * 16);     // 64px
  --spacing-20: calc(var(--spacing-unit) * 20);     // 80px
  --spacing-24: calc(var(--spacing-unit) * 24);     // 96px
  --spacing-32: calc(var(--spacing-unit) * 32);     // 128px
}
```

:::

### Semantic Spacing

::: code-with-tooltips

```scss
:root {
  // Component spacing
  --spacing-component-xs: var(--spacing-2);
  --spacing-component-sm: var(--spacing-4);
  --spacing-component-md: var(--spacing-6);
  --spacing-component-lg: var(--spacing-8);
  --spacing-component-xl: var(--spacing-10);

  // Layout spacing
  --spacing-layout-xs: var(--spacing-4);
  --spacing-layout-sm: var(--spacing-8);
  --spacing-layout-md: var(--spacing-12);
  --spacing-layout-lg: var(--spacing-16);
  --spacing-layout-xl: var(--spacing-24);

  // Inset padding
  --spacing-inset-xs: var(--spacing-2);
  --spacing-inset-sm: var(--spacing-4);
  --spacing-inset-md: var(--spacing-6);
  --spacing-inset-lg: var(--spacing-8);
  --spacing-inset-xl: var(--spacing-10);
}
```

:::

## Spacing Components

### Stack

A component for managing vertical spacing:

::: code-with-tooltips

```tsx
interface StackProps {
  /** Child elements */
  children: React.ReactNode;
  /** Space between elements */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to reverse the order */
  reverse?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const Stack = ({
  children,
  spacing = 'md',
  reverse = false,
  className,
}: StackProps) => {
  return (
    <div
      className={clsx(
        'stack',
        `stack--${spacing}`,
        reverse && 'stack--reverse',
        className
      )}
    >
      {children}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.stack {
  display: flex;
  flex-direction: column;

  &--reverse {
    flex-direction: column-reverse;
  }

  &--xs > * + * {
    margin-top: var(--spacing-component-xs);
  }

  &--sm > * + * {
    margin-top: var(--spacing-component-sm);
  }

  &--md > * + * {
    margin-top: var(--spacing-component-md);
  }

  &--lg > * + * {
    margin-top: var(--spacing-component-lg);
  }

  &--xl > * + * {
    margin-top: var(--spacing-component-xl);
  }

  &--reverse {
    &.stack--xs > * + * {
      margin-bottom: var(--spacing-component-xs);
      margin-top: 0;
    }

    &.stack--sm > * + * {
      margin-bottom: var(--spacing-component-sm);
      margin-top: 0;
    }

    &.stack--md > * + * {
      margin-bottom: var(--spacing-component-md);
      margin-top: 0;
    }

    &.stack--lg > * + * {
      margin-bottom: var(--spacing-component-lg);
      margin-top: 0;
    }

    &.stack--xl > * + * {
      margin-bottom: var(--spacing-component-xl);
      margin-top: 0;
    }
  }
}
```

:::

### Cluster

A component for managing horizontal spacing:

::: code-with-tooltips

```tsx
interface ClusterProps {
  /** Child elements */
  children: React.ReactNode;
  /** Space between elements */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Alignment along main axis */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Alignment along cross axis */
  align?: 'start' | 'center' | 'end';
  /** Whether to wrap items */
  wrap?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const Cluster = ({
  children,
  spacing = 'md',
  justify = 'start',
  align = 'center',
  wrap = true,
  className,
}: ClusterProps) => {
  return (
    <div
      className={clsx(
        'cluster',
        `cluster--${spacing}`,
        `cluster--justify-${justify}`,
        `cluster--align-${align}`,
        !wrap && 'cluster--nowrap',
        className
      )}
    >
      {children}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-component-md);

  &--xs {
    gap: var(--spacing-component-xs);
  }

  &--sm {
    gap: var(--spacing-component-sm);
  }

  &--md {
    gap: var(--spacing-component-md);
  }

  &--lg {
    gap: var(--spacing-component-lg);
  }

  &--xl {
    gap: var(--spacing-component-xl);
  }

  &--nowrap {
    flex-wrap: nowrap;
  }

  &--justify {
    &-start { justify-content: flex-start; }
    &-center { justify-content: center; }
    &-end { justify-content: flex-end; }
    &-between { justify-content: space-between; }
  }

  &--align {
    &-start { align-items: flex-start; }
    &-center { align-items: center; }
    &-end { align-items: flex-end; }
  }
}
```

:::

## Usage Examples

### Stack Component

::: code-with-tooltips

```tsx
<Stack spacing="md">
  <div className="box">Item 1</div>
  <div className="box">Item 2</div>
  <div className="box">Item 3</div>
</Stack>
```

:::

### Cluster Component

::: code-with-tooltips

```tsx
<Cluster spacing="sm" justify="between" align="center">
  <div className="box">Item 1</div>
  <div className="box">Item 2</div>
  <div className="box">Item 3</div>
</Cluster>
```

:::

### Nested Spacing

::: code-with-tooltips

```tsx
<Stack spacing="lg">
  <div className="section">
    <Stack spacing="sm">
      <h2>Section Title</h2>
      <p>Section content</p>
      <Cluster spacing="xs">
        <button>Action 1</button>
        <button>Action 2</button>
      </Cluster>
    </Stack>
  </div>
  <div className="section">
    <Stack spacing="sm">
      <h2>Section Title</h2>
      <p>Section content</p>
      <Cluster spacing="xs">
        <button>Action 1</button>
        <button>Action 2</button>
      </Cluster>
    </Stack>
  </div>
</Stack>
```

:::

## Spacing Utilities

### Margin and Padding Classes

::: code-with-tooltips

```scss
// Margin utilities
.m {
  &-0 { margin: var(--spacing-0); }
  &-1 { margin: var(--spacing-1); }
  &-2 { margin: var(--spacing-2); }
  &-3 { margin: var(--spacing-3); }
  &-4 { margin: var(--spacing-4); }
  // ... continue for all spacing values

  &t {
    &-0 { margin-top: var(--spacing-0); }
    &-1 { margin-top: var(--spacing-1); }
    // ... continue for all spacing values
  }

  &r {
    &-0 { margin-right: var(--spacing-0); }
    &-1 { margin-right: var(--spacing-1); }
    // ... continue for all spacing values
  }

  &b {
    &-0 { margin-bottom: var(--spacing-0); }
    &-1 { margin-bottom: var(--spacing-1); }
    // ... continue for all spacing values
  }

  &l {
    &-0 { margin-left: var(--spacing-0); }
    &-1 { margin-left: var(--spacing-1); }
    // ... continue for all spacing values
  }

  &x {
    &-0 { margin-left: var(--spacing-0); margin-right: var(--spacing-0); }
    &-1 { margin-left: var(--spacing-1); margin-right: var(--spacing-1); }
    // ... continue for all spacing values
  }

  &y {
    &-0 { margin-top: var(--spacing-0); margin-bottom: var(--spacing-0); }
    &-1 { margin-top: var(--spacing-1); margin-bottom: var(--spacing-1); }
    // ... continue for all spacing values
  }
}

// Padding utilities
.p {
  &-0 { padding: var(--spacing-0); }
  &-1 { padding: var(--spacing-1); }
  // ... continue for all spacing values

  // Similar pattern for pt, pr, pb, pl, px, py
}
```

:::

## Best Practices

### 1. Consistency

- Use the spacing scale consistently
- Avoid magic numbers
- Follow spacing patterns
- Maintain rhythm
- Use semantic values

### 2. Responsive Design

- Use relative units
- Scale spacing with viewport
- Consider content density
- Handle breakpoints
- Maintain proportions

### 3. Component Design

- Use spacing components
- Follow spacing hierarchy
- Handle edge cases
- Support nesting
- Allow customization

### 4. Performance

- Minimize custom values
- Use efficient selectors
- Cache calculations
- Optimize reflows
- Reduce specificity

### 5. Implementation

Example of implementing spacing in components:

::: code-with-tooltips

```tsx
// Card component example
const Card = styled.div`
  padding: var(--spacing-component-md);

  > * + * {
    margin-top: var(--spacing-component-sm);
  }

  .card__header {
    margin-bottom: var(--spacing-component-md);
  }

  .card__footer {
    margin-top: var(--spacing-component-lg);
  }
`;

// Form component example
const Form = styled.form`
  .form-group {
    & + & {
      margin-top: var(--spacing-component-md);
    }
  }

  .form-actions {
    margin-top: var(--spacing-component-lg);
  }
`;
```

:::
