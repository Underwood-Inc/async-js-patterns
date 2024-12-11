---
title: Container Components
description: Flexible and responsive container components for React applications with various layout patterns
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Layout
  - Container
  - Responsive Design
  - Design System
---

# Container Components

## Overview

Our container components provide consistent and responsive layout patterns for content organization. They support various sizes, paddings, and responsive behaviors.

## Components

### Base Container

The foundation container component for content width management:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface ContainerProps {
  /** Container content */
  children: React.ReactNode;
  /** Container size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to center the container */
  centered?: boolean;
  /** Whether to add padding */
  fluid?: boolean;
  /** HTML element to render */
  as?: React.ElementType;
  /** ARIA role if needed */
  role?: string;
  /** ARIA label */
  'aria-label'?: string;
  /** Additional CSS classes */
  className?: string;
}

export const Container = ({
  children,
  size = 'lg',
  centered = true,
  fluid = false,
  as: Component = 'div',
  role,
  'aria-label': ariaLabel,
  className,
  ...props
}: ContainerProps) => {
  return (
    <Component
      className={clsx(
        'container',
        `container--${size}`,
        centered && 'container--centered',
        !fluid && 'container--padded',
        className
      )}
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
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  // Sizes
  &--sm {
    max-width: 640px;  // 40rem
  }

  &--md {
    max-width: 768px;  // 48rem
  }

  &--lg {
    max-width: 1024px; // 64rem
  }

  &--xl {
    max-width: 1280px; // 80rem
  }

  &--full {
    max-width: none;
  }

  // Modifiers
  &--centered {
    margin-left: auto;
    margin-right: auto;
  }

  &--padded {
    padding-left: var(--spacing-layout-md);
    padding-right: var(--spacing-layout-md);

    @media (min-width: 640px) {
      padding-left: var(--spacing-layout-lg);
      padding-right: var(--spacing-layout-lg);
    }
  }
}
```

:::

### Section Container

A container component for page sections with vertical spacing:

::: code-with-tooltips

```tsx
interface SectionProps extends ContainerProps {
  /** Section spacing */
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  /** Background color */
  background?: 'default' | 'alt' | 'brand';
}

export const Section = ({
  children,
  spacing = 'lg',
  background = 'default',
  ...props
}: SectionProps) => {
  return (
    <section
      className={clsx(
        'section',
        `section--spacing-${spacing}`,
        `section--bg-${background}`
      )}
    >
      <Container {...props}>
        {children}
      </Container>
    </section>
  );
};
```

:::

::: code-with-tooltips

```scss
.section {
  width: 100%;

  // Spacing variants
  &--spacing-sm {
    padding-top: var(--spacing-layout-sm);
    padding-bottom: var(--spacing-layout-sm);
  }

  &--spacing-md {
    padding-top: var(--spacing-layout-md);
    padding-bottom: var(--spacing-layout-md);
  }

  &--spacing-lg {
    padding-top: var(--spacing-layout-lg);
    padding-bottom: var(--spacing-layout-lg);
  }

  &--spacing-xl {
    padding-top: var(--spacing-layout-xl);
    padding-bottom: var(--spacing-layout-xl);
  }

  // Background variants
  &--bg-default {
    background-color: var(--vp-c-bg);
  }

  &--bg-alt {
    background-color: var(--vp-c-bg-soft);
  }

  &--bg-brand {
    background-color: var(--vp-c-brand);
    color: white;
  }
}
```

:::

### Content Container

A container component optimized for text content:

::: code-with-tooltips

```tsx
interface ContentProps extends ContainerProps {
  /** Content width */
  width?: 'narrow' | 'medium' | 'wide';
}

export const Content = ({
  children,
  width = 'medium',
  ...props
}: ContentProps) => {
  return (
    <Container
      size="full"
      className={clsx(
        'content',
        `content--${width}`
      )}
      {...props}
    >
      {children}
    </Container>
  );
};
```

:::

::: code-with-tooltips

```scss
.content {
  // Content widths
  &--narrow {
    max-width: 65ch; // Optimal reading width
  }

  &--medium {
    max-width: 85ch;
  }

  &--wide {
    max-width: 120ch;
  }

  // Typography
  font-size: 1.125rem;
  line-height: 1.6;

  h1, h2, h3, h4, h5, h6 {
    margin-top: 2em;
    margin-bottom: 1em;
    line-height: 1.3;
  }

  p {
    margin-bottom: 1.5em;
  }

  ul, ol {
    margin-bottom: 1.5em;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.5em;
  }

  blockquote {
    margin: 2em 0;
    padding: 1em 1.5em;
    border-left: 4px solid var(--vp-c-brand);
    background: var(--vp-c-bg-soft);
  }
}
```

:::

## Usage Examples

### Basic Container

::: code-with-tooltips

```tsx
<Container>
  <h1>Main Content</h1>
  <p>Container with default padding and max-width.</p>
</Container>
```

:::

### Fluid Container

::: code-with-tooltips

```tsx
<Container fluid>
  <div className="full-width-banner">
    Full width content without padding
  </div>
</Container>
```

:::

### Section with Container

::: code-with-tooltips

```tsx
<Section background="alt" spacing="xl">
  <h2>Featured Section</h2>
  <p>Section with background and vertical spacing.</p>
</Section>
```

:::

### Content Container

::: code-with-tooltips

```tsx
<Content width="narrow">
  <h1>Article Title</h1>
  <p>
    Optimized for reading with proper line length and typography.
    The width is limited to maintain readability.
  </p>
  <blockquote>
    Important quote or callout with proper styling.
  </blockquote>
</Content>
```

:::

### Nested Containers

::: code-with-tooltips

```tsx
<Section background="brand" spacing="xl">
  <h2>Featured Products</h2>
  <Container size="xl">
    <div className="grid">
      {/* Product grid */}
    </div>
  </Container>
</Section>
```

:::

### Responsive Layout

::: code-with-tooltips

```tsx
<>
  {/* Full width hero section */}
  <Section background="brand" spacing="xl">
    <Container size="xl">
      <h1>Welcome</h1>
    </Container>
  </Section>

  {/* Main content */}
  <Section spacing="lg">
    <Container size="lg">
      <div className="grid">
        <aside className="sidebar">
          {/* Sidebar content */}
        </aside>
        <main className="main-content">
          <Content width="medium">
            {/* Main content */}
          </Content>
        </main>
      </div>
    </Container>
  </Section>
</>
```

:::

### Semantic HTML Usage

::: code-with-tooltips

```tsx
<Container as="main">
  Main content
</Container>

<Container as="article">
  Article content
</Container>

<Container as="section">
  Section content
</Container>
```

:::

## Best Practices

### 1. Responsive Design

- Use fluid layouts
- Consider breakpoints
- Handle edge cases
- Maintain spacing
- Support mobile views

### 2. Performance

- Minimize nesting
- Optimize reflows
- Use efficient selectors
- Cache calculations
- Handle large content

### 3. Accessibility

- Maintain structure
- Support zoom
- Handle overflow
- Consider scrolling
- Preserve hierarchy

### 4. Implementation

Example of using containers in page layouts:

::: code-with-tooltips

```tsx
// Page layout example
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="header">
        <Container size="xl">
          <nav>{/* Navigation content */}</nav>
        </Container>
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <Container>
          <div className="footer__content">
            {/* Footer content */}
          </div>
        </Container>
      </footer>
    </>
  );
};

// Page content example
const HomePage = () => {
  return (
    <PageLayout>
      {/* Hero section */}
      <Section background="brand" spacing="xl">
        <Container size="xl">
          <div className="hero">
            {/* Hero content */}
          </div>
        </Container>
      </Section>

      {/* Features section */}
      <Section spacing="lg">
        <Container>
          <div className="features-grid">
            {/* Feature cards */}
          </div>
        </Container>
      </Section>

      {/* Content section */}
      <Section background="alt" spacing="xl">
        <Content width="narrow">
          {/* Article content */}
        </Content>
      </Section>
    </PageLayout>
  );
};
```

:::

### 5. Customization

Example of extending container styles:

::: code-with-tooltips

```scss
// Custom container variants
.container {
  // Product container
  &--product {
    @extend .container--lg;

    @media (min-width: 1024px) {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: var(--spacing-layout-lg);
    }
  }

  // Dashboard container
  &--dashboard {
    @extend .container--xl;

    display: grid;
    grid-template-columns: 240px 1fr;
    gap: var(--spacing-layout-md);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

// Custom section variants
.section {
  &--hero {
    min-height: calc(100vh - var(--header-height));
    display: flex;
    align-items: center;
  }

  &--overlap {
    position: relative;
    margin-top: -100px;
    z-index: 1;
  }
}
```

:::
