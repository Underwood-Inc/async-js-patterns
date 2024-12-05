---
title: HTML Patterns Guide
description: Master modern HTML patterns and semantic markup. Learn about accessibility, SEO optimization, and best practices for structuring web content.
date: 2024-01-01
author: Underwood Inc
tags:
  - HTML
  - Semantic Markup
  - Accessibility
  - SEO
  - Best Practices
  - Web Standards
image: /web-patterns/images/html-patterns-banner.png
---

# HTML Layout Patterns

## Overview

Modern HTML layout patterns focusing on semantic structure, accessibility, and best practices for building inclusive web applications.

## Semantic Structure

### Basic Page Layout

```html:preview
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Page description for accessibility" />
    <title>Page Title</title>
  </head>
  <body>
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="#main">Skip to main content</a></li>
          <li><a href="/">Home</a></li>
        </ul>
      </nav>
    </header>

    <main id="main" role="main">
      <article>
        <h1>Main Content Heading</h1>
        <section aria-labelledby="section-heading">
          <h2 id="section-heading">Section Heading</h2>
          <!-- Content -->
        </section>
      </article>
    </main>

    <aside role="complementary">
      <h2>Supplementary Content</h2>
      <!-- Sidebar content -->
    </aside>

    <footer role="contentinfo">
      <!-- Footer content -->
    </footer>
  </body>
</html>
```

## Accessibility Patterns

### Form Layout

```html:preview
<form role="form" aria-labelledby="form-title">
  <h2 id="form-title">Contact Form</h2>

  <div class="form-group">
    <label for="name">
      Name
      <span aria-hidden="true">*</span>
      <span class="sr-only">required</span>
    </label>
    <input
      type="text"
      id="name"
      name="name"
      required
      aria-required="true"
      aria-describedby="name-help"
    />
    <small id="name-help">Enter your full name</small>
  </div>

  <fieldset>
    <legend>Preferences</legend>
    <div class="checkbox-group">
      <input type="checkbox" id="option1" name="option1" />
      <label for="option1">Option 1</label>
    </div>
  </fieldset>

  <button type="submit" aria-label="Submit form">Submit</button>
</form>
```

### Navigation Patterns

```html:preview
<nav aria-label="Main navigation">
  <button
    aria-expanded="false"
    aria-controls="nav-menu"
    aria-label="Toggle navigation"
  >
    Menu
  </button>

  <ul id="nav-menu" role="menu">
    <li role="none">
      <a href="/" role="menuitem">Home</a>
    </li>
    <li role="none">
      <button role="menuitem" aria-haspopup="true" aria-expanded="false">
        Products
      </button>
      <ul role="menu" aria-label="Products submenu">
        <!-- Submenu items -->
      </ul>
    </li>
  </ul>
</nav>
```

## Content Patterns

### Article Structure

```html:preview
<article>
  <header>
    <h1>Article Title</h1>
    <div class="metadata">
      <time datetime="2024-03-15">March 15, 2024</time>
      <address rel="author">Author Name</address>
    </div>
  </header>

  <div class="content">
    <p>Article content...</p>

    <figure>
      <img src="image.jpg" alt="Descriptive text" />
      <figcaption>Image caption</figcaption>
    </figure>
  </div>

  <footer>
    <section class="tags" aria-label="Article tags">
      <!-- Tags -->
    </section>
  </footer>
</article>
```

### Card Components

```html:preview
<div class="card" role="article">
  <div class="card-media">
    <img src="image.jpg" alt="" aria-hidden="true" />
  </div>

  <div class="card-content">
    <h3 class="card-title">
      <a href="/article" class="stretched-link"> Article Title </a>
    </h3>
    <p class="card-description">Brief description...</p>
  </div>

  <div class="card-footer">
    <button type="button" aria-label="Share Article Title">Share</button>
  </div>
</div>
```

## Best Practices

### 1. Document Structure

- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<article>`, etc.)
- Maintain proper heading hierarchy (h1-h6)
- Include skip links for keyboard navigation
- Use appropriate ARIA landmarks and roles

### 2. Forms and Inputs

- Associate labels with form controls
- Group related fields with `<fieldset>` and `<legend>`
- Provide clear error messages and validation
- Use appropriate input types and attributes
- Include helper text and instructions

### 3. Images and Media

- Always provide meaningful alt text
- Use empty alt="" for decorative images
- Include captions where appropriate
- Ensure proper contrast ratios
- Provide text alternatives for complex visuals

### 4. Interactive Elements

- Ensure keyboard accessibility
- Maintain visible focus indicators
- Provide appropriate ARIA states
- Include touch targets of sufficient size
- Ensure proper event handling

### 5. Performance Considerations

```html:preview
<!-- Preload critical assets -->
<link rel="preload" href="critical.css" as="style" />
<link rel="preload" href="main.js" as="script" />

<!-- Lazy load non-critical images -->
<img
  src="placeholder.jpg"
  data-src="actual-image.jpg"
  loading="lazy"
  alt="Description"
/>

<!-- Use responsive images -->
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg" />
  <source media="(min-width: 400px)" srcset="medium.jpg" />
  <img src="small.jpg" alt="Description" />
</picture>
```

## References

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN HTML Guide](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [HTML5 Accessibility](https://html5accessibility.com/)
