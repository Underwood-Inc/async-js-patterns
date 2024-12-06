---
title: SCSS Patterns Guide
description: Master SCSS patterns and techniques. Learn about mixins, functions, variables, and advanced SCSS features for maintainable stylesheets.
date: 2024-01-01
author: Underwood Inc
tags:
  - SCSS
  - CSS
  - Sass
  - Mixins
  - Variables
  - Best Practices
image: /web-patterns/images/scss-patterns-banner.png
---

# SCSS Patterns

## Overview

This guide covers modern SCSS patterns and best practices for maintainable and scalable stylesheets.

## Modern SCSS Features

### Module System

```scss:preview
// Modern @use instead of @import
@use 'sass:color';
@use 'sass:math';
@use './variables' as *;
```

### Variables and Maps

```scss:preview
// _variables.scss
$colors: (
  'primary': #9d8cd6,
  'secondary': #6366f1,
  'accent': #3b82f6,
);

$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
);
```

### Color Functions

```scss:preview
// Modern color manipulation
.element {
  // Instead of darken()
  background: color.adjust($color, $lightness: -10%);

  // Instead of lighten()
  color: color.adjust($color, $lightness: 10%);

  // Scale color
  border-color: color.scale($color, $lightness: 20%);
}
```

### Mixins and Functions

```scss:preview
// Responsive mixins
@mixin respond-to($breakpoint) {
  @if map.has-key($breakpoints, $breakpoint) {
    @media (min-width: map.get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// Usage
.container {
  @include respond-to('md') {
    max-width: 768px;
  }
}

// Typography mixins
@mixin text-style($size, $weight: normal, $line-height: 1.5) {
  font-size: $size;
  font-weight: $weight;
  line-height: $line-height;
}
```

## Architecture Patterns

### 7-1 Pattern

```plaintext:preview
styles/
|– abstracts/
|   |– _variables.scss    # Variables
|   |– _functions.scss    # Functions
|   |– _mixins.scss       # Mixins
|   |– _placeholders.scss # Placeholders
|
|– base/
|   |– _reset.scss        # Reset/normalize
|   |– _typography.scss   # Typography rules
|
|– components/
|   |– _buttons.scss      # Buttons
|   |– _cards.scss        # Cards
|
|– layout/
|   |– _navigation.scss   # Navigation
|   |– _grid.scss         # Grid system
|   |– _header.scss       # Header
|   |– _footer.scss       # Footer
|
|– pages/
|   |– _home.scss         # Home specific styles
|   |– _about.scss        # About specific styles
|
|– themes/
|   |– _theme.scss        # Default theme
|   |– _dark.scss         # Dark theme
|
|– vendors/
|   |– _normalize.scss    # Normalize
|
|– main.scss             # Main file
```

## Best Practices

### 1. Use Modern Module System

```scss:preview
// ❌ Avoid @import
@import 'variables';

// ✅ Use @use
@use 'variables' as *;
```

### 2. Namespace Variables

```scss:preview
// ❌ Global variables
$color: blue;

// ✅ Namespaced variables
$button: (
  'primary': blue,
  'hover': darkblue,
);
```

### 3. BEM Naming Convention

```scss:preview
// Block
.card {
  // Element
  &__header {
    // Modifier
    &--highlighted {
      background: yellow;
    }
  }
}
```

### 4. Mobile-First Approach

```scss:preview
.container {
  width: 100%; // Mobile first

  @include respond-to('md') {
    width: 750px; // Tablet
  }

  @include respond-to('lg') {
    width: 970px; // Desktop
  }
}
```

### 5. CSS Custom Properties Integration

```scss:preview
:root {
  --color-primary: #{$primary-color};
  --spacing-unit: #{$spacing};
}

.element {
  color: var(--color-primary);
  margin: var(--spacing-unit);
}
```

### 6. Performance Considerations

```scss:preview
// ❌ Avoid deep nesting
.header {
  .nav {
    .list {
      .item {
        a {
          // Styles
        }
      }
    }
  }
}

// ✅ Flat selectors
.header-nav-item {
  // Styles
}
.header-nav-link {
  // Styles
}
```

## Tools and Linting

### Stylelint Configuration

```json:preview
{
  "extends": "stylelint-config-standard-scss",
  "rules": {
    "selector-class-pattern": "^[a-z][a-zA-Z0-9-_]*$",
    "max-nesting-depth": 3,
    "selector-max-compound-selectors": 3
  }
}
```

## References

- [Sass Documentation](https://sass-lang.com/documentation)
- [Sass Guidelines](https://sass-guidelin.es/)
- [Modern CSS with Sass](https://moderncss.dev/)
