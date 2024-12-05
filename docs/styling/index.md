---
title: Modern CSS & SCSS Patterns
description: Comprehensive guide to modern CSS methodologies and SCSS patterns. Learn about CSS architecture, responsive design, and maintainable styling practices.
date: 2024-01-01
author: Underwood Inc
tags:
  - CSS
  - SCSS
  - Web Design
  - Responsive Design
  - CSS Architecture
  - Frontend Development
  - Styling Patterns
image: /web-patterns/images/styling-banner.png
---

# Modern CSS & SCSS Patterns

Learn modern CSS methodologies and SCSS patterns for scalable applications.

## Core Concepts

- **CSS Architecture**: Scalable and maintainable CSS patterns
- **SCSS Features**: Leveraging preprocessor capabilities
- **Methodologies**: BEM and other naming conventions
- **Responsive Design**: Mobile-first approach

## Available Guides

### CSS Fundamentals

- [CSS Patterns](./css-patterns.md) - Modern CSS patterns and best practices
- [SCSS Patterns](./scss-patterns.md) - Advanced SCSS techniques
- [HTML Patterns](./html-patterns.md) - Semantic HTML and accessibility

### Methodologies

- [BEM Methodology](./bem-methodology.md) - Block Element Modifier pattern
- [Single Direction Spacing](./single-direction-spacing.md) - Consistent spacing
- [Lobotomized Owl](./lobotomized-owl.md) - Advanced CSS selectors

## Quick Examples

### Modern CSS Features

```scss:preview
// CSS Custom Properties
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 8px;
  --border-radius: 4px;
  --transition-speed: 200ms;
}

// Modern Layout with Grid
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: calc(var(--spacing-unit) * 2);
  padding: var(--spacing-unit);
}

// Flexbox Components
.card {
  display: flex;
  flex-direction: column;
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
  transition: transform var(--transition-speed) ease;

  &:hover {
    transform: translateY(-2px);
  }
}

// Modern CSS Features
.button {
  background: var(--primary-color);
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-unit) calc(var(--spacing-unit) * 2);
  color: white;
  transition: all var(--transition-speed) ease;

  &:is(:hover, :focus) {
    background: color-mix(in srgb, var(--primary-color) 85%, white);
  }

  &:active {
    transform: scale(0.98);
  }
}
```

### SCSS Mixins

```scss:preview
// Responsive Breakpoints
@mixin respond-to($breakpoint) {
  @if $breakpoint == "small" {
    @media (min-width: 576px) { @content; }
  } @else if $breakpoint == "medium" {
    @media (min-width: 768px) { @content; }
  } @else if $breakpoint == "large" {
    @media (min-width: 992px) { @content; }
  }
}

// Flex Center
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Typography Scale
@mixin font-size($size) {
  font-size: $size;
  line-height: calc($size * 1.5);
}

// Usage Example
.container {
  @include flex-center;
  padding: var(--spacing-unit);

  @include respond-to('medium') {
    padding: calc(var(--spacing-unit) * 2);
  }
}

.heading {
  @include font-size(2rem);
  margin-bottom: var(--spacing-unit);
}
```

### BEM Pattern

```scss:preview
.card {
  &__header {
    padding: var(--spacing-unit);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  &__content {
    padding: calc(var(--spacing-unit) * 2);
  }

  &__footer {
    padding: var(--spacing-unit);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  &--featured {
    border: 2px solid var(--primary-color);
  }
}
```

## Best Practices

1. **CSS Architecture**

   - Use CSS custom properties for theming
   - Implement consistent spacing system
   - Follow single responsibility principle

2. **Responsive Design**

   - Use mobile-first approach
   - Implement fluid typography
   - Create flexible layouts

3. **Performance**

   - Minimize specificity conflicts
   - Optimize critical rendering path
   - Use efficient selectors

4. **Maintainability**

   - Follow naming conventions
   - Document component patterns
   - Create reusable mixins

5. **Accessibility**
   - Ensure proper contrast
   - Support reduced motion
   - Implement focus states
