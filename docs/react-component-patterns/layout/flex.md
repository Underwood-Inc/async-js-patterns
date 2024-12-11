---
title: Flex Components
description: Flexible box layout components for React applications with comprehensive alignment and distribution options
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Layout
  - Flexbox
  - Responsive Design
  - Design System
---

# Flex Components

## Overview

Our flex components provide an intuitive way to create flexible layouts using CSS Flexbox. They support various alignment, distribution, and responsive behaviors.

## Components

### Base Flex

The foundation flex component with comprehensive options:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface FlexProps {
  /** Flex content */
  children: React.ReactNode;
  /** Direction of flex items */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  /** Alignment along the main axis */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Alignment along the cross axis */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Whether to wrap items */
  wrap?: boolean | 'reverse';
  /** Gap between items */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Inline flex display */
  inline?: boolean;
  /** HTML element to render */
  as?: React.ElementType;
  /** ARIA role if needed */
  role?: string;
  /** ARIA label */
  'aria-label'?: string;
  /** Additional CSS classes */
  className?: string;
}

const gapMap = {
  xs: 'var(--spacing-2)',
  sm: 'var(--spacing-4)',
  md: 'var(--spacing-6)',
  lg: 'var(--spacing-8)',
  xl: 'var(--spacing-10)',
};

export const Flex = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  wrap = false,
  gap = 'md',
  inline = false,
  as: Component = 'div',
  role,
  'aria-label': ariaLabel,
  className,
  ...props
}: FlexProps) => {
  const flexGap = typeof gap === 'string' ? gapMap[gap] : `${gap}px`;

  return (
    <Component
      className={clsx(
        'flex',
        `flex--direction-${direction}`,
        `flex--justify-${justify}`,
        `flex--align-${align}`,
        wrap && `flex--wrap${wrap === 'reverse' ? '-reverse' : ''}`,
        inline && 'flex--inline',
        className
      )}
      style={{ '--flex-gap': flexGap } as React.CSSProperties}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Component>
  );
};
```

:::

::: code-with-tooltips

```scss
.flex {
  display: flex;
  gap: var(--flex-gap);

  // Display variants
  &--inline {
    display: inline-flex;
  }

  // Direction variants
  &--direction {
    &-row { flex-direction: row; }
    &-row-reverse { flex-direction: row-reverse; }
    &-column { flex-direction: column; }
    &-column-reverse { flex-direction: column-reverse; }
  }

  // Justify variants
  &--justify {
    &-start { justify-content: flex-start; }
    &-center { justify-content: center; }
    &-end { justify-content: flex-end; }
    &-between { justify-content: space-between; }
    &-around { justify-content: space-around; }
    &-evenly { justify-content: space-evenly; }
  }

  // Align variants
  &--align {
    &-start { align-items: flex-start; }
    &-center { align-items: center; }
    &-end { align-items: flex-end; }
    &-stretch { align-items: stretch; }
    &-baseline { align-items: baseline; }
  }

  // Wrap variants
  &--wrap {
    flex-wrap: wrap;

    &-reverse {
      flex-wrap: wrap-reverse;
    }
  }
}
```

:::

### Flex Item

A component for flex items with grow, shrink, and basis properties:

::: code-with-tooltips

```tsx
interface FlexItemProps {
  /** Item content */
  children: React.ReactNode;
  /** Flex grow factor */
  grow?: number;
  /** Flex shrink factor */
  shrink?: number;
  /** Flex basis */
  basis?: string | number;
  /** Order of the item */
  order?: number;
  /** Self alignment override */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Additional CSS classes */
  className?: string;
}

export const FlexItem = ({
  children,
  grow,
  shrink,
  basis,
  order,
  align,
  className,
  ...props
}: FlexItemProps) => {
  return (
    <div
      className={clsx(
        'flex-item',
        align && `flex-item--align-${align}`,
        className
      )}
      style={{
        '--flex-grow': grow,
        '--flex-shrink': shrink,
        '--flex-basis': typeof basis === 'number' ? `${basis}px` : basis,
        '--flex-order': order,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.flex-item {
  flex-grow: var(--flex-grow, 0);
  flex-shrink: var(--flex-shrink, 1);
  flex-basis: var(--flex-basis, auto);
  order: var(--flex-order, 0);

  // Self alignment
  &--align {
    &-start { align-self: flex-start; }
    &-center { align-self: center; }
    &-end { align-self: flex-end; }
    &-stretch { align-self: stretch; }
    &-baseline { align-self: baseline; }
  }
}
```

:::

### Spacer

A utility component for creating flexible space:

::: code-with-tooltips

```tsx
interface SpacerProps {
  /** Size of the spacer */
  size?: number | string;
  /** Whether to grow to fill space */
  grow?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const Spacer = ({
  size,
  grow = false,
  className,
  ...props
}: SpacerProps) => {
  return (
    <div
      className={clsx('spacer', className)}
      style={{
        '--spacer-size': typeof size === 'number' ? `${size}px` : size,
        '--spacer-grow': grow ? 1 : 0,
      } as React.CSSProperties}
      {...props}
    />
  );
};
```

:::

::: code-with-tooltips

```scss
.spacer {
  width: var(--spacer-size, auto);
  height: var(--spacer-size, auto);
  flex-grow: var(--spacer-grow, 0);
  flex-shrink: 0;
}
```

:::

## Usage Examples

### Basic Flex

::: code-with-tooltips

```tsx
<Flex gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>
```

:::

### Centered Content

::: code-with-tooltips

```tsx
<Flex justify="center" align="center" style={{ height: '200px' }}>
  <div>Centered Content</div>
</Flex>
```

:::

### Navigation Bar

::: code-with-tooltips

```tsx
<Flex justify="between" align="center">
  <div className="logo">Logo</div>
  <Flex gap="lg">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Contact</a>
  </Flex>
  <button>Sign In</button>
</Flex>
```

:::

### Card Layout

::: code-with-tooltips

```tsx
<Flex direction="column" gap="sm">
  <img src="card-image.jpg" alt="Card" />
  <h3>Card Title</h3>
  <p>Card description goes here.</p>
  <Spacer grow />
  <Flex justify="between" align="center">
    <button>Action</button>
    <span>Meta</span>
  </Flex>
</Flex>
```

:::

### Complex Layout

::: code-with-tooltips

```tsx
<Flex direction="column" gap="lg">
  {/* Header */}
  <Flex justify="between" align="center">
    <h1>Dashboard</h1>
    <Flex gap="md">
      <button>Settings</button>
      <button>Profile</button>
    </Flex>
  </Flex>

  {/* Main content */}
  <Flex gap="lg" wrap>
    {/* Sidebar */}
    <FlexItem basis="250px" shrink={0}>
      <nav>
        <Flex direction="column" gap="sm">
          <a href="#">Dashboard</a>
          <a href="#">Analytics</a>
          <a href="#">Reports</a>
          <a href="#">Settings</a>
        </Flex>
      </nav>
    </FlexItem>

    {/* Content */}
    <FlexItem grow={1} basis="0">
      <Flex direction="column" gap="md">
        {/* Stats */}
        <Flex gap="md" wrap>
          <FlexItem grow={1} basis="200px">
            <div className="stat-card">Stat 1</div>
          </FlexItem>
          <FlexItem grow={1} basis="200px">
            <div className="stat-card">Stat 2</div>
          </FlexItem>
          <FlexItem grow={1} basis="200px">
            <div className="stat-card">Stat 3</div>
          </FlexItem>
        </Flex>

        {/* Chart */}
        <div className="chart">Chart</div>

        {/* Table */}
        <div className="table">Table</div>
      </Flex>
    </FlexItem>
  </Flex>
</Flex>
```

:::

## Best Practices

### 1. Layout Patterns

- Use appropriate direction
- Consider content flow
- Handle wrapping
- Maintain spacing
- Use semantic markup

### 2. Responsive Design

- Handle small screens
- Use flexible sizing
- Consider breakpoints
- Maintain readability
- Support touch targets

### 3. Performance

- Minimize nesting
- Use efficient selectors
- Cache calculations
- Handle reflows
- Optimize transitions

### 4. Implementation

Example of using flex in components:

::: code-with-tooltips

```tsx
// Card component example
const Card = ({ image, title, description, actions }: CardProps) => {
  return (
    <Flex direction="column" gap="md" className="card">
      {image && (
        <div className="card__image">
          <img src={image} alt={title} />
        </div>
      )}

      <Flex direction="column" gap="sm">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
      </Flex>

      <Spacer grow />

      {actions && (
        <Flex gap="sm" className="card__actions">
          {actions}
        </Flex>
      )}
    </Flex>
  );
};

// Form layout example
const Form = ({ children, actions }: FormProps) => {
  return (
    <Flex direction="column" gap="lg" as="form">
      <Flex direction="column" gap="md">
        {children}
      </Flex>

      <Flex justify="end" gap="md">
        {actions}
      </Flex>
    </Flex>
  );
};

// Split layout example
const SplitLayout = ({
  aside,
  children,
  reverse,
}: SplitLayoutProps) => {
  return (
    <Flex
      gap="xl"
      wrap
      direction={reverse ? 'row-reverse' : 'row'}
    >
      <FlexItem basis="300px" shrink={0}>
        {aside}
      </FlexItem>
      <FlexItem grow={1} basis="0">
        {children}
      </FlexItem>
    </Flex>
  );
};
```

:::

### 5. Customization

Example of extending flex styles:

::: code-with-tooltips

```scss
// Custom flex variants
.flex {
  // Center all content
  &--center-all {
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  // Stack on mobile
  &--stack-mobile {
    @media (max-width: 768px) {
      flex-direction: column;

      > * {
        width: 100%;
      }
    }
  }

  // Grid-like layout
  &--grid {
    flex-wrap: wrap;
    margin: calc(var(--flex-gap) * -0.5);

    > * {
      flex: 1 1 var(--min-width, 200px);
      margin: calc(var(--flex-gap) * 0.5);
    }
  }
}

// Custom flex item variants
.flex-item {
  // Fixed width item
  &--fixed {
    flex: 0 0 auto;
  }

  // Equal width item
  &--equal {
    flex: 1 1 0;
  }

  // Full width on mobile
  &--full-mobile {
    @media (max-width: 768px) {
      flex: 0 0 100%;
    }
  }
}
```

:::
