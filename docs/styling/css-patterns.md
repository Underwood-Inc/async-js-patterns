# CSS Patterns & Best Practices

This section covers essential CSS patterns and best practices for maintainable, scalable styling.

## Overview

Modern CSS development requires careful consideration of maintainability, performance, and scalability. This guide covers both fundamental and advanced patterns.

## Units & Spacing

### Relative Units

Use relative units for better accessibility and responsive design:

```css
/* ❌ Avoid fixed units */
.header {
  font-size: 16px;
  margin-bottom: 20px;
}

/* ✅ Use relative units */
:root {
  --space-unit: 0.25rem; /* 4px base unit */
}

.header {
  font-size: 1rem; /* Relative to root font size */
  margin-bottom: calc(var(--space-unit) * 5); /* 20px equivalent */
}
```

### Spacing Scale

Create a consistent spacing scale:

```css
:root {
  /* Base spacing units */
  --space-xs: calc(var(--space-unit) * 2); /* 8px */
  --space-sm: calc(var(--space-unit) * 3); /* 12px */
  --space-md: calc(var(--space-unit) * 4); /* 16px */
  --space-lg: calc(var(--space-unit) * 6); /* 24px */
  --space-xl: calc(var(--space-unit) * 8); /* 32px */
}
```

## Typography System

Create a scalable typography system:

```css
:root {
  /* Font sizes */
  --font-size-xs: 0.75rem; /* 12px */
  --font-size-sm: 0.875rem; /* 14px */
  --font-size-md: 1rem; /* 16px */
  --font-size-lg: 1.125rem; /* 18px */
  --font-size-xl: 1.25rem; /* 20px */

  /* Line heights */
  --line-height-tight: 1.2; /* 19.2px for 16px font */
  --line-height-normal: 1.5; /* 24px for 16px font */
  --line-height-relaxed: 1.75; /* 28px for 16px font */

  /* Example calculations:
   * line-height * font-size = final height
   * 1.2 * 16px = 19.2px
   * 1.5 * 16px = 24px
   * 1.75 * 16px = 28px
   */
}
```

## Best Practices

1. **CSS Custom Properties**:

   - Use for theme values
   - Create semantic names
   - Provide fallbacks

2. **Selector Specificity**:

   - Keep selectors as simple as possible
   - Avoid ID selectors
   - Use BEM naming convention

3. **Media Queries**:

   - Use mobile-first approach
   - Create standard breakpoints
   - Use relative units

4. **Performance**:
   - Minimize nesting (max 3 levels)
   - Use efficient selectors
   - Avoid universal selectors

## Examples

### Responsive Component Pattern

```css
.card {
  padding: var(--space-md);
  margin: var(--space-sm);

  @media (min-width: 768px) {
    padding: var(--space-lg);
    margin: var(--space-md);
  }
}
```

### Theme Variables Pattern

```css
:root {
  /* Light theme */
  --color-bg: #ffffff;
  --color-text: #2a2a2a;

  @media (prefers-color-scheme: dark) {
    /* Dark theme */
    --color-bg: #2a2a2a;
    --color-text: #ffffff;
  }
}
```

## CSS Units Guide

### rem vs em

The key difference between `rem` and `em` units lies in their reference point:

```css
/* rem = "root em" */
.using-rem {
  /* Always relative to ROOT font size (html element) */
  font-size: 1.5rem; /* 24px if root is 16px */
  padding: 1rem; /* 16px if root is 16px */
}

/* em = relative to parent */
.parent {
  font-size: 16px;

  .using-em {
    /* Relative to PARENT font size */
    font-size: 1.5em; /* 24px (16px * 1.5) */
    padding: 1em; /* 24px (based on element's font size) */
  }
}
```

#### When to Use rem

- **Font sizes**: `rem` provides consistent sizing across the application
- **Margins/Padding**: When you want spacing unaffected by component font size
- **Media queries**: For consistent breakpoints
- **Global components**: Elements that should maintain consistent sizing

```css
/* ✅ Good rem usage */
.button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
}
```

#### When to Use em

- **Component-specific spacing**: When elements should scale with their parent
- **Media queries**: When you want breakpoints relative to user's font size
- **Typography**: For elements that should scale with their parent's font size
- **Component padding**: When you want padding proportional to the element's font size

```css
/* ✅ Good em usage */
.card-title {
  font-size: 1.2em;
  margin-bottom: 0.5em; /* Scales with title's font size */
}

/* Common pattern for buttons */
.button {
  font-size: 1rem; /* Base font size */
  padding: 0.5em 1em; /* Padding scales with font size */
}
```

#### Best Practices

1. **Consistent Base**:

```css
:root {
  /* Define base font size */
  font-size: 16px; /* This makes 1rem = 16px */
}
```

2. **Avoid Mixed Units**:

```css
/* ❌ Avoid mixing units */
.mixed-units {
  font-size: 1.2rem;
  margin-bottom: 1em; /* Will be based on rem value */
}

/* ✅ Use consistent units */
.consistent-units {
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
}
```

3. **Accessibility Considerations**:

```css
/* Support user font size preferences */
html {
  /* Default font size */
  font-size: 16px;

  /* Respect user preferences */
  @media (prefers-reduced-motion: reduce) {
    font-size: 100%; /* Use browser default */
  }
}
```

4. **Compound Calculations**:

```css
/* ❌ Avoid nested em calculations */
.parent {
  font-size: 1.2em;
  .child {
    font-size: 1.2em; /* Compounds with parent */
    .grandchild {
      font-size: 1.2em; /* Further compounds! */
    }
  }
}

/* ✅ Use rem for nested elements */
.parent {
  font-size: 1.2rem;
  .child {
    font-size: 1.2rem;
    .grandchild {
      font-size: 1.2rem;
    }
  }
}
```

## References

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Values and Units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Architecture](https://www.smashingmagazine.com/2016/06/battling-bem-extended-edition-common-problems-and-how-to-avoid-them/)
