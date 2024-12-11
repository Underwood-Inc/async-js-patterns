---
title: Typography Components
description: Typography components and utilities for consistent text styling across your React application
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Typography
  - Components
  - Design System
---

# Typography Components

## Overview

A comprehensive set of typography components that provide consistent text styling across your application. These components follow modern design principles and are fully accessible.

## Components

### Text Component

A flexible text component that handles different variants and styles:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface TextProps {
  /** The text content */
  children: React.ReactNode;
  /** Typography variant */
  variant?: 'body' | 'lead' | 'small' | 'tiny';
  /** Optional color override */
  color?: 'default' | 'muted' | 'brand' | 'error';
  /** Additional CSS classes */
  className?: string;
  /** HTML element to render as */
  as?: keyof JSX.IntrinsicElements;
}

export const Text = ({
  children,
  variant = 'body',
  color = 'default',
  className,
  as: Component = 'p',
}: TextProps) => {
  return (
    <Component
      className={clsx(
        'text',
        `text--${variant}`,
        `text--${color}`,
        className
      )}
    >
      {children}
    </Component>
  );
};
```

:::

::: code-with-tooltips

```scss
.text {
  margin: 0;
  padding: 0;

  // Variants
  &--body {
    font-size: 1rem;
    line-height: 1.5;
  }

  &--lead {
    font-size: 1.125rem;
    line-height: 1.6;
    font-weight: 400;
  }

  &--small {
    font-size: 0.875rem;
    line-height: 1.4;
  }

  &--tiny {
    font-size: 0.75rem;
    line-height: 1.3;
  }

  // Colors
  &--default {
    color: var(--vp-c-text-1);
  }

  &--muted {
    color: var(--vp-c-text-2);
  }

  &--brand {
    color: var(--vp-c-brand);
  }

  &--error {
    color: var(--vp-c-text-error);
  }
}
```

:::

### Heading Component

A component for rendering consistent headings:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface HeadingProps {
  /** The heading content */
  children: React.ReactNode;
  /** Heading level (h1-h6) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Optional size override */
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  /** Additional CSS classes */
  className?: string;
}

export const Heading = ({
  children,
  level = 2,
  size,
  className,
}: HeadingProps) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClass = size || `h${level}`;

  return (
    <Component
      className={clsx(
        'heading',
        `heading--${sizeClass}`,
        className
      )}
    >
      {children}
    </Component>
  );
};
```

:::

::: code-with-tooltips

```scss
.heading {
  margin: 0;
  font-weight: 600;
  line-height: 1.2;
  color: var(--vp-c-text-1);

  &--h1,
  &--xl {
    font-size: 2.5rem;
    background: linear-gradient(
      120deg,
      var(--vp-c-brand-light) 30%,
      var(--vp-c-brand)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &--h2,
  &--lg {
    font-size: 2rem;
    color: var(--vp-c-brand-dark);
  }

  &--h3,
  &--md {
    font-size: 1.5rem;
  }

  &--h4,
  &--sm {
    font-size: 1.25rem;
  }

  &--h5,
  &--xs {
    font-size: 1.125rem;
  }

  &--h6 {
    font-size: 1rem;
  }
}
```

:::

## Usage Examples

### Basic Text Styles

::: code-with-tooltips

```tsx
<>
  <Heading level={1}>Main Heading</Heading>
  <Text variant="lead">
    This is a lead paragraph that introduces the main content.
  </Text>
  <Text>
    Regular body text that forms the main content of your document.
  </Text>
  <Text variant="small" color="muted">
    A smaller, muted text often used for supplementary information.
  </Text>
</>
```

:::

### Article Layout

::: code-with-tooltips

```tsx
<article>
  <Heading level={1}>Article Title</Heading>
  <Text variant="lead" color="brand">
    Article introduction or summary goes here, styled with the brand color.
  </Text>

  <Heading level={2}>First Section</Heading>
  <Text>
    Main content paragraph with regular styling.
  </Text>

  <Heading level={3}>Subsection</Heading>
  <Text>
    More detailed content within the subsection.
  </Text>

  <Text variant="small" color="muted">
    Article metadata, publication date, etc.
  </Text>
</article>
```

:::

## Best Practices

### 1. Accessibility

- Use semantic heading levels (h1-h6)
- Maintain proper heading hierarchy
- Ensure sufficient color contrast
- Support user font size preferences

### 2. Responsive Design

- Use relative units (rem/em)
- Implement fluid typography
- Test at different viewport sizes
- Consider line length limits

### 3. Performance

- Implement proper font loading
- Use font subsetting when possible
- Consider system font stacks
- Optimize for Core Web Vitals

### 4. Maintainability

- Follow consistent naming conventions
- Document component props
- Implement proper TypeScript types
- Write comprehensive tests

## Theme Integration

The typography components use CSS custom properties from our theme:

::: code-with-tooltips

```scss
:root {
  // Text colors
  --vp-c-text-1: #{colors.$purple-gray-900};
  --vp-c-text-2: #{colors.$purple-gray-800};
  --vp-c-text-3: #{colors.$purple-gray-700};

  // Brand colors
  --vp-c-brand: #{colors.$purple-brand};
  --vp-c-brand-light: #{colors.$purple-brand-light};
  --vp-c-brand-dark: #{colors.$purple-brand-dark};

  // Font settings
  --vp-font-family-base: system-ui, sans-serif;
  --vp-font-family-mono: ui-monospace, monospace;
}

.dark {
  --vp-c-text-1: #{colors.$purple-gray-100};
  --vp-c-text-2: #{colors.$purple-gray-200};
  --vp-c-text-3: #{colors.$purple-gray-300};
}
```

:::
