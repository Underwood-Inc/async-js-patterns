# The Lobotomized Owl Selector

## Overview

The Lobotomized Owl Selector (`* + *`) is a powerful CSS technique for managing vertical rhythm and spacing between elements, introduced by Heydon Pickering.

## Core Concept

The selector consists of a universal selector (`*`) followed by an adjacent sibling combinator (`+`) and another universal selector (`*`), targeting any element that follows another element.

::: code-with-tooltips

```css
* + * {
  margin-top: 1.5em;
}
```

:::

## Implementation Examples

### Basic Usage

::: code-with-tooltips

```css
/* Add spacing between all adjacent siblings */
.content * + * {
  margin-top: 1.5rem;
}

/* Specific element spacing */
.article > * + * {
  margin-top: 2rem;
}
```

:::

### Real-World Examples

#### Article Layout

::: code-with-tooltips

```html
<article class="article">
  <h1>Article Title</h1>
  <p>First paragraph...</p>
  <p>Second paragraph...</p>
  <h2>Section Title</h2>
  <p>More content...</p>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
  </ul>
</article>
```

:::

::: code-with-tooltips

```css
.article > * + * {
  margin-top: 1.5rem;
}

/* Tighter spacing for list items */
.article ul > * + * {
  margin-top: 0.5rem;
}

/* Larger spacing before headings */
.article * + h2 {
  margin-top: 3rem;
}
```

:::

#### Form Layout

::: code-with-tooltips

```html
<form class="form">
  <div class="form__field">
    <label>Name</label>
    <input type="text" />
  </div>
  <div class="form__field">
    <label>Email</label>
    <input type="email" />
  </div>
  <button type="submit">Submit</button>
</form>
```

:::

::: code-with-tooltips

```css
.form > * + * {
  margin-top: 1.5rem;
}

.form__field > * + * {
  margin-top: 0.5rem;
}
```

:::

## Advanced Patterns

### Responsive Spacing

::: code-with-tooltips

```css
.content > * + * {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .content > * + * {
    margin-top: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .content > * + * {
    margin-top: 2rem;
  }
}
```

:::

### Component-Specific Spacing

::: code-with-tooltips

```css
/* Card component spacing */
.card > * + * {
  margin-top: 1rem;
}

/* List component spacing */
.list > * + * {
  margin-top: 0.5rem;
}

/* Grid component with horizontal spacing */
.grid {
  display: grid;
  gap: 1rem;
}
```

:::

### Exception Handling

::: code-with-tooltips

```css
/* Apply general spacing */
.content > * + * {
  margin-top: 1.5rem;
}

/* Remove spacing for specific elements */
.content > .no-margin {
  margin-top: 0;
}

/* Custom spacing for specific combinations */
.content > p + p {
  margin-top: 1rem;
}

.content > h2 + p {
  margin-top: 0.75rem;
}
```

:::

## Best Practices

### 1. Scope Appropriately

- Apply the owl selector to specific containers rather than globally
- Use class-scoped selectors to prevent unintended cascading
- Consider the impact on nested components

### 2. Handle Exceptions

- Create utility classes for removing spacing when needed
- Define specific overrides for special cases
- Use more specific selectors for fine-tuned control

### 3. Maintain Consistency

- Use a consistent spacing scale
- Document your spacing variables
- Consider creating spacing mixins or utility classes

::: code-with-tooltips

```css
:root {
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
}

.content > * + * {
  margin-top: var(--space-md);
}
```

:::

### 4. Performance Considerations

- Limit the depth of universal selectors
- Use more specific selectors when possible
- Consider the performance impact on large DOMs

## Common Use Cases

### 1. Typography

::: code-with-tooltips

```css
.typography > * + * {
  margin-top: 1em;
}

.typography > h2 + * {
  margin-top: 0.5em;
}
```

:::

### 2. Card Layouts

::: code-with-tooltips

```css
.card > * + * {
  margin-top: 1rem;
}

.card__header + .card__content {
  margin-top: 1.5rem;
}
```

:::

### 3. Form Groups

::: code-with-tooltips

```css
.form-group > * + * {
  margin-top: 0.5rem;
}

.form-group + .form-group {
  margin-top: 1.5rem;
}
```

:::

## References

- [The Lobotomized Owl Selector](https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/)
- [Every Layout - Stack](https://every-layout.dev/layouts/stack/)
- [CSS Tricks - Lobotomized Owl](https://css-tricks.com/lobotomized-owls/)
