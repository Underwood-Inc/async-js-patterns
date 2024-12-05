---
title: BEM Methodology Guide
description: Learn the Block Element Modifier methodology for writing maintainable and scalable CSS. Master BEM naming conventions and best practices.
date: 2024-01-01
author: Underwood Inc
tags:
  - CSS
  - BEM
  - Methodology
  - Best Practices
  - Naming Conventions
  - Code Organization
image: /web-patterns/images/bem-methodology-banner.png
---

# BEM Methodology

## Overview

BEM (Block Element Modifier) is a naming convention methodology that helps create reusable components and code sharing in front-end development.

## Core Concepts

### Block

A standalone entity that is meaningful on its own.

```css:preview
.block {
  /* styles */
}

/* Examples */
.header {
}
.menu {
}
.search-form {
}
```

### Element

A part of a block that has no standalone meaning and is semantically tied to its block.

```css:preview
.block__element {
  /* styles */
}

/* Examples */
.menu__item {
}
.header__logo {
}
.search-form__input {
}
```

### Modifier

A flag on a block or element that changes appearance or behavior.

```css:preview
.block--modifier {
  /* styles */
}

.block__element--modifier {
  /* styles */
}

/* Examples */
.menu--dark {
}
.menu__item--active {
}
.search-form__input--disabled {
}
```

## Implementation Examples

### Basic Structure

```html:preview
<nav class="menu">
  <ul class="menu__list">
    <li class="menu__item">
      <a class="menu__link menu__link--active" href="/">Home</a>
    </li>
    <li class="menu__item">
      <a class="menu__link" href="/about">About</a>
    </li>
  </ul>
</nav>
```

```css:preview
.menu {
  background: #fff;
}

.menu__list {
  list-style: none;
  padding: 0;
}

.menu__item {
  display: inline-block;
}

.menu__link {
  color: #333;
  text-decoration: none;
}

.menu__link--active {
  color: #0066cc;
  font-weight: bold;
}
```

### Complex Component

```html:preview
<form class="search-form search-form--dark">
  <div class="search-form__field">
    <input class="search-form__input" type="text" />
    <button class="search-form__button search-form__button--primary">
      Search
    </button>
  </div>
  <div class="search-form__filters">
    <label class="search-form__filter">
      <input type="checkbox" class="search-form__checkbox" />
      Advanced
    </label>
  </div>
</form>
```

```css:preview
.search-form {
  padding: 1rem;
}

.search-form--dark {
  background: #333;
  color: #fff;
}

.search-form__field {
  display: flex;
  gap: 0.5rem;
}

.search-form__input {
  flex: 1;
  padding: 0.5rem;
}

.search-form__button {
  padding: 0.5rem 1rem;
}

.search-form__button--primary {
  background: #0066cc;
  color: #fff;
}

.search-form__filters {
  margin-top: 0.5rem;
}

.search-form__filter {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
```

## Best Practices

### 1. Naming Conventions

- Use lowercase letters
- Words within names are separated by hyphens (-)
- Elements are separated from blocks by two underscores (\_\_)
- Modifiers are separated from blocks or elements by two hyphens (--)

### 2. Structure

- Keep nesting levels to a minimum
- Avoid creating elements of elements (e.g., `.block__elem1__elem2`)
- Use cascading sparingly

### 3. Modifiers

- Use boolean modifiers when no value is needed
- Use key-value modifiers when a value is needed
- Keep modifier names short but descriptive

```css:preview
/* Boolean modifier */
.button--disabled {
}

/* Key-value modifier */
.button--color-red {
}
.button--size-large {
}
```

### 4. File Organization

```txt
styles/
  blocks/
    menu/
      menu.css
      menu__item.css
      menu__link.css
    search-form/
      search-form.css
      search-form__input.css
      search-form__button.css
```

## Common Patterns

### 1. Mix Pattern

Combining multiple BEM entities on a single DOM node.

```html:preview
<div class="header__logo logo">
  <!-- logo is a block, header__logo is an element -->
</div>
```

### 2. Element State Pattern

Using modifiers to represent element states.

```css:preview
.form__input--invalid {
  border-color: red;
}

.form__input--valid {
  border-color: green;
}
```

### 3. Responsive Pattern

Using modifiers for responsive variations.

```css:preview
.grid {
  display: grid;
}

.grid--cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 768px) {
  .grid--cols-4\@md {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## References

- [BEM Official Documentation](https://en.bem.info/)
- [GetBEM](http://getbem.com/)
- [CSS Tricks Guide to BEM](https://css-tricks.com/bem-101/)
