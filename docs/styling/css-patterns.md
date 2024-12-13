---
title: CSS Patterns Guide
description: Explore modern CSS patterns and techniques. Learn about layouts, responsive design, animations, and advanced CSS features.
date: 2024-12-01
author: Underwood Inc
tags:
  - CSS
  - Design Patterns
  - Responsive Design
  - Layouts
  - Animations
  - Best Practices
image: /web-patterns/images/css-patterns-banner.png
---

# CSS Patterns

## Overview

Modern CSS patterns and best practices for building maintainable and performant web applications.

## Modern CSS Features

### Custom Properties (Variables)

```css:preview
:root {
  --color-primary: #9d8cd6;
  --color-secondary: #6366f1;
  --spacing-unit: 1rem;
  --border-radius: 4px;
}

.button {
  background: var(--color-primary);
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
}
```

### Container Queries

```css:preview
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card__title {
    font-size: 2rem;
  }
}
```

### Grid Layout

```css:preview
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-unit);
}
```

### Flexbox Patterns

```css:preview
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}
```

## Layout Patterns

### Holy Grail Layout

```css:preview
.layout {
  display: grid;
  grid-template-areas:
    'header header header'
    'nav main aside'
    'footer footer footer';
  grid-template-columns: 200px 1fr 200px;
  min-height: 100vh;
}

.header {
  grid-area: header;
}
.nav {
  grid-area: nav;
}
.main {
  grid-area: main;
}
.aside {
  grid-area: aside;
}
.footer {
  grid-area: footer;
}
```

### Card Grid

```css:preview
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
```

## Component Patterns

### Button System

```css:preview
.button {
  /* Base styles */
  padding: 0.5em 1em;
  border: none;
  border-radius: var(--border-radius);
  font: inherit;

  /* Variants */
  &--primary {
    background: var(--color-primary);
    color: white;
  }

  &--secondary {
    background: var(--color-secondary);
    color: white;
  }

  /* States */
  &:hover {
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

### Form Controls

```css:preview
.form-control {
  display: grid;
  gap: 0.5rem;
}

.input {
  padding: 0.5em;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font: inherit;

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
  }

  &:invalid {
    border-color: var(--color-error);
  }
}
```

## Responsive Patterns

### Fluid Typography

```css:preview
:root {
  --fluid-min-width: 320;
  --fluid-max-width: 1140;
  --fluid-min-size: 16;
  --fluid-max-size: 24;

  --fluid-size: calc(
    (var(--fluid-min-size) * 1px) +
      (var(--fluid-max-size) - var(--fluid-min-size)) *
      (100vw - (var(--fluid-min-width) * 1px)) /
      (var(--fluid-max-width) - var(--fluid-min-width))
  );
}

body {
  font-size: var(--fluid-size);
}
```

### Responsive Images

```css:preview
.image {
  max-width: 100%;
  height: auto;

  /* Modern image optimization */
  object-fit: cover;
  aspect-ratio: 16/9;

  /* Lazy loading */
  loading: lazy;
}
```

## Performance Patterns

### Content Visibility

```css:preview
.below-fold {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

### Will-Change

```css:preview
.animated {
  will-change: transform;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}
```

## Animation Patterns

### Keyframe Animations

```css:preview
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fade-in 0.3s ease forwards;
}
```

### Transitions

```css:preview
.button {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
```

## Best Practices

1. Use Logical Properties

```css:preview
.element {
  margin-block: 1rem;
  padding-inline: 2rem;
}
```

2. Progressive Enhancement

```css:preview
.grid {
  display: flex;
  flex-wrap: wrap;

  @supports (display: grid) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
```

3. Accessibility

```css:preview
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## References

- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [CSS Tricks](https://css-tricks.com)
- [Modern CSS Solutions](https://moderncss.dev)
