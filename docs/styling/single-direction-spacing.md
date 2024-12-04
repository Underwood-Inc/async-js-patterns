# Single-Direction Spacing

## Overview

Single-Direction Spacing (also known as Unidirectional Margin) is a CSS layout pattern that establishes a consistent spacing approach by applying margins in only one direction.

## Core Concepts

### The Rule

- Apply margins in one direction only (typically bottom or right)
- Use padding for internal spacing
- Maintain a single source of truth for spacing values
- Prevent margin collapsing issues

## Implementation Examples

### Basic Usage

```css:preview
/* Define spacing scale */
:root {
  --space-unit: 8px;
  --space-xs: calc(var(--space-unit) * 1); /* 8px */
  --space-sm: calc(var(--space-unit) * 2); /* 16px */
  --space-md: calc(var(--space-unit) * 3); /* 24px */
  --space-lg: calc(var(--space-unit) * 4); /* 32px */
  --space-xl: calc(var(--space-unit) * 6); /* 48px */
}

/* Base spacing classes */
.mb-xs {
  margin-bottom: var(--space-xs);
}
.mb-sm {
  margin-bottom: var(--space-sm);
}
.mb-md {
  margin-bottom: var(--space-md);
}
.mb-lg {
  margin-bottom: var(--space-lg);
}
.mb-xl {
  margin-bottom: var(--space-xl);
}
```

### Real-World Examples

#### Article Layout

```html:preview
<article class="article">
  <h1 class="mb-md">Article Title</h1>
  <p class="mb-sm">First paragraph...</p>
  <p class="mb-sm">Second paragraph...</p>
  <h2 class="mb-sm">Section Title</h2>
  <p class="mb-md">More content...</p>
  <ul class="mb-lg">
    <li class="mb-xs">List item 1</li>
    <li class="mb-xs">List item 2</li>
    <li>List item 3</li>
  </ul>
</article>
```

```css:preview
.article {
  max-width: 65ch;
  padding: var(--space-lg);
}

/* Component-specific spacing */
.article h1 {
  margin-bottom: var(--space-lg);
}

.article p {
  margin-bottom: var(--space-md);
}

.article ul {
  margin-bottom: var(--space-lg);
}

.article li:not(:last-child) {
  margin-bottom: var(--space-xs);
}
```

#### Form Layout

```html:preview
<form class="form">
  <div class="form-group mb-md">
    <label class="mb-xs">Name</label>
    <input type="text" />
  </div>
  <div class="form-group mb-md">
    <label class="mb-xs">Email</label>
    <input type="email" />
  </div>
  <button type="submit">Submit</button>
</form>
```

```css:preview
.form {
  padding: var(--space-lg);
}

.form-group:not(:last-child) {
  margin-bottom: var(--space-md);
}

.form label {
  display: block;
  margin-bottom: var(--space-xs);
}
```

## Advanced Patterns

### Responsive Spacing

```css:preview
/* Base spacing */
.mb-responsive {
  margin-bottom: var(--space-sm);
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .mb-responsive {
    margin-bottom: var(--space-md);
  }
}

@media (min-width: 1024px) {
  .mb-responsive {
    margin-bottom: var(--space-lg);
  }
}
```

### Grid Systems

```css:preview
.grid {
  display: grid;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.grid-item:not(:last-child) {
  margin-bottom: var(--space-md);
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-item {
    margin-bottom: 0; /* Reset when in grid layout */
  }
}
```

### Component Spacing

```css:preview
/* Card component */
.card {
  padding: var(--space-md);
}

.card-title {
  margin-bottom: var(--space-sm);
}

.card-content {
  margin-bottom: var(--space-md);
}

/* List component */
.list-item:not(:last-child) {
  margin-bottom: var(--space-xs);
}
```

## Best Practices

### 1. Consistent Direction

- Choose either bottom or right margins (bottom for vertical, right for horizontal)
- Stick to the chosen direction throughout the project
- Use utility classes to maintain consistency

### 2. Spacing Scale

- Use a consistent spacing scale based on a base unit
- Define spacing variables at the root level
- Use meaningful names for spacing values

```css:preview
:root {
  /* Base unit: 4px */
  --space-unit: 4px;
  --space-2: calc(var(--space-unit) * 2); /* 8px */
  --space-4: calc(var(--space-unit) * 4); /* 16px */
  --space-6: calc(var(--space-unit) * 6); /* 24px */
  --space-8: calc(var(--space-unit) * 8); /* 32px */
  --space-12: calc(var(--space-unit) * 12); /* 48px */
}
```

### 3. Exception Handling

```css:preview
/* Last child exceptions */
.stack > *:not(:last-child) {
  margin-bottom: var(--space-md);
}

/* Reset margins when needed */
.no-margin {
  margin-bottom: 0;
}

/* Responsive margins */
.responsive-margin {
  margin-bottom: var(--space-sm);
}

@media (min-width: 768px) {
  .responsive-margin {
    margin-bottom: var(--space-md);
  }
}
```

### 4. Documentation

```css:preview
/* Document spacing patterns */
:root {
  /* Spacing Scale
   * --space-xs: 8px  (0.5rem)  - Minimal spacing, used for tight layouts
   * --space-sm: 16px (1rem)    - Default spacing for related content
   * --space-md: 24px (1.5rem)  - Medium spacing for section breaks
   * --space-lg: 32px (2rem)    - Large spacing for major sections
   * --space-xl: 48px (3rem)    - Extra large spacing for page-level blocks
   */
}
```

## Common Use Cases

### 1. Content Flow

```css:preview
/* Article content */
.content > * {
  margin-bottom: var(--space-md);
}

.content > h2 {
  margin-bottom: var(--space-sm);
}

.content > p:last-child {
  margin-bottom: 0;
}
```

### 2. Navigation

```css:preview
/* Vertical navigation */
.nav-vertical .nav-item:not(:last-child) {
  margin-bottom: var(--space-xs);
}

/* Horizontal navigation */
.nav-horizontal .nav-item:not(:last-child) {
  margin-right: var(--space-sm);
}
```

### 3. Form Layout

```css:preview
.form-field:not(:last-child) {
  margin-bottom: var(--space-md);
}

.form-label {
  margin-bottom: var(--space-xs);
}

.form-help {
  margin-bottom: var(--space-sm);
}
```

## References

- [Single Direction Margin Declaration](https://csswizardry.com/2012/06/single-direction-margin-declarations/)
- [The Stack Layout Pattern](https://every-layout.dev/layouts/stack/)
- [Spacing in CSS](https://ishadeed.com/article/spacing-in-css/)
