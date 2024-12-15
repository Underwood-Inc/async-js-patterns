---
title: Semantic HTML Guide
description: Comprehensive guide for using semantic HTML elements correctly in React components
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - HTML
  - Accessibility
  - Best Practices
  - Semantic Markup
---

# Semantic HTML Guide

## Overview

This guide provides best practices for using semantic HTML elements in React components. Following these guidelines improves accessibility, SEO, and code maintainability.

## Document Structure Elements

### `<main>`

Use for the primary content of the document. Should be unique per page.

::: code-with-tooltips

```tsx
const PageLayout = () => (
  <>
    <header>...</header>
    <main>
      <h1>Page Title</h1>
      <article>Main content...</article>
    </main>
    <footer>...</footer>
  </>
);
```

:::

### `<article>`

Use for self-contained, independently distributable content.

::: code-with-tooltips

```tsx
const BlogPost = () => (
  <article>
    <header>
      <h2>Article Title</h2>
      <p>Posted by Author on Date</p>
    </header>
    <section className="content">
      <p>Article content...</p>
    </section>
    <footer>
      <div className="tags">...</div>
      <section className="comments">...</section>
    </footer>
  </article>
);
```

:::

### `<section>`

Use for thematically grouped content, typically with a heading.

::: code-with-tooltips

```tsx
const ProductDetails = () => (
  <section aria-labelledby="details-title">
    <h2 id="details-title">Product Details</h2>
    <div className="content-grid">
      <div className="specs">...</div>
      <div className="features">...</div>
    </div>
  </section>
);
```

:::

### `<aside>`

Use for content tangentially related to the main content.

::: code-with-tooltips

```tsx
const PageWithSidebar = () => (
  <div className="layout-grid">
    <main>
      <article>Main content...</article>
    </main>
    <aside aria-label="Related content">
      <section className="related-articles">
        <h2>Related Articles</h2>
        <ul>...</ul>
      </section>
    </aside>
  </div>
);
```

:::

## Navigation Elements

### `<nav>`

Use for major navigation blocks.

::: code-with-tooltips

```tsx
const Navigation = () => (
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/products">Products</a></li>
      <li>
        <a href="/categories">Categories</a>
        <ul>
          <li><a href="/categories/1">Category 1</a></li>
        </ul>
      </li>
    </ul>
  </nav>
);
```

:::

### `<header>`

Use for introductory content or navigation aids.

::: code-with-tooltips

```tsx
const PageHeader = () => (
  <header className="site-header">
    <div className="logo">
      <a href="/">Site Logo</a>
    </div>
    <nav aria-label="Main navigation">...</nav>
    <div className="user-menu">...</div>
  </header>
);
```

:::

### `<footer>`

Use for footer content of a section or page.

::: code-with-tooltips

```tsx
const PageFooter = () => (
  <footer className="site-footer">
    <nav aria-label="Footer navigation">
      <ul>...</ul>
    </nav>
    <section className="footer-info">
      <h2 className="visually-hidden">Company Information</h2>
      <address>...</address>
    </section>
  </footer>
);
```

:::

## Content Elements

### `<div>` vs Semantic Elements

Use `div` only for non-semantic grouping and layout.

::: code-with-tooltips

```tsx
// Good - proper semantic structure
const ProductCard = () => (
  <article className="product-card">
    <header>
      <h3>{title}</h3>
      <p className="price">{price}</p>
    </header>
    {/* div is fine for layout purposes */}
    <div className="image-wrapper">
      <img src={image} alt={title} />
    </div>
    <div className="actions-wrapper">
      <button>Add to Cart</button>
    </div>
  </article>
);

// Bad - overusing semantic elements
const BadExample = () => (
  <section className="wrapper"> {/* Should be div */}
    <article className="box"> {/* Should be div */}
      Just some text
    </article>
  </section>
);
```

:::

### Lists

::: code-with-tooltips

```tsx
const NavigationList = () => (
  <nav>
    {/* Use ul for unordered lists */}
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
);

const ProcessSteps = () => (
  <section>
    <h2>How It Works</h2>
    {/* Use ol for sequential steps */}
    <ol>
      <li>Create account</li>
      <li>Configure settings</li>
      <li>Start using</li>
    </ol>
  </section>
);

const MetaData = () => (
  {/* Use dl for name-value pairs */}
  <dl>
    <dt>Published</dt>
    <dd>December 2024</dd>
    <dt>Author</dt>
    <dd>John Doe</dd>
  </dl>
);
```

:::

## Form Elements

### Proper Form Structure

::: code-with-tooltips

```tsx
const ContactForm = () => (
  <form aria-labelledby="form-title">
    <h2 id="form-title">Contact Us</h2>

    <fieldset>
      <legend>Personal Information</legend>

      <div className="field-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          aria-required="true"
          aria-describedby="name-help"
        />
        <small id="name-help">Enter your full name</small>
      </div>

      <div className="field-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          aria-required="true"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>Your Message</legend>

      <div className="field-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          aria-required="true"
        />
      </div>
    </fieldset>

    <div className="form-actions">
      <button type="submit">Send Message</button>
    </div>
  </form>
);
```

:::

## Best Practices

### 1. Document Outline

- Use only one `<main>` per page
- Use `<header>` and `<footer>` within `<article>` and `<section>` when appropriate
- Maintain proper heading hierarchy (`h1-h6`)
- Use `aria-labelledby` to associate headings with sections

### 2. Navigation

- Use `<nav>` for major navigation blocks
- Add `aria-label` to distinguish multiple `<nav>` elements
- Use lists (`<ul>`, `<ol>`) for navigation items
- Consider using `<button>` for interactive elements that don't navigate

### 3. Content Structure

- Use `<article>` for self-contained content
- Use `<section>` for thematic grouping
- Use `<aside>` for complementary content
- Use `<div>` only for styling/layout

### 4. Forms

- Group related fields with `<fieldset>` and `<legend>`
- Always use `<label>` with form controls
- Use appropriate input types
- Add proper ARIA attributes for accessibility

### 5. Common Patterns

::: code-with-tooltips

```tsx
// Card Pattern
const Card = ({ title, content, actions }) => (
  <article className="card">
    <header>
      <h3>{title}</h3>
    </header>
    <div className="card-content">
      {content}
    </div>
    {actions && (
      <footer className="card-actions">
        {actions}
      </footer>
    )}
  </article>
);

// List Pattern
const List = ({ items }) => (
  <section aria-labelledby="list-title">
    <h2 id="list-title">Items</h2>
    <ul className="items-grid">
      {items.map(item => (
        <li key={item.id}>
          <article className="item-card">
            {item.content}
          </article>
        </li>
      ))}
    </ul>
  </section>
);

// Modal Pattern
const Modal = ({ title, children, onClose }) => (
  <div role="dialog" aria-labelledby="modal-title" aria-modal="true">
    <header>
      <h2 id="modal-title">{title}</h2>
      <button
        onClick={onClose}
        aria-label="Close modal"
      >
        ×
      </button>
    </header>
    <div className="modal-content">
      {children}
    </div>
  </div>
);
```

:::

## Common Mistakes to Avoid

1. Using semantic elements for styling:

::: code-with-tooltips

```tsx
// Bad
<section className="button-wrapper"> // Should be div
  <button>Click me</button>
</section>

// Good
<div className="button-wrapper">
  <button>Click me</button>
</div>
```

:::

2. Missing headings in sections:

::: code-with-tooltips

```tsx
// Bad
<section>
  <p>Content without heading</p>
</section>

// Good
<section aria-labelledby="section-title">
  <h2 id="section-title">Section Title</h2>
  <p>Content with heading</p>
</section>
```

:::

3. Nesting headings incorrectly:

::: code-with-tooltips

```tsx
// Bad
<h1>Page Title</h1>
<section>
  <h3>Section Title</h3> // Should be h2
</section>

// Good
<h1>Page Title</h1>
<section>
  <h2>Section Title</h2>
</section>
```

:::

4. Overusing `article`:

::: code-with-tooltips

```tsx
// Bad
<article className="layout-container"> // Should be div
  <article className="card"> // This one is fine
    Content
  </article>
</article>

// Good
<div className="layout-container">
  <article className="card">
    Content
  </article>
</div>
```

:::

## Advanced Patterns

### 1. Complex Navigation Patterns

::: code-with-tooltips

```tsx
// Multi-level Navigation
const MainNavigation = () => (
  <nav aria-label="Main navigation">
    <ul>
      <li>
        <a href="/products">Products</a>
        {/* Submenu */}
        <ul aria-label="Product categories">
          <li><a href="/products/electronics">Electronics</a></li>
          <li>
            <a href="/products/computers">Computers</a>
            {/* Third level */}
            <ul aria-label="Computer types">
              <li><a href="/products/computers/laptops">Laptops</a></li>
              <li><a href="/products/computers/desktops">Desktops</a></li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
);

// Breadcrumb Navigation
const Breadcrumbs = () => (
  <nav aria-label="Breadcrumb">
    <ol>
      <li>
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
      </li>
      <li>
        <a href="/products">Products</a>
        <span aria-hidden="true">/</span>
      </li>
      <li aria-current="page">Current Page</li>
    </ol>
  </nav>
);
```

:::

### 2. Article Patterns

::: code-with-tooltips

```tsx
// Blog Post
const BlogPost = () => (
  <article>
    <header>
      <h1>Article Title</h1>
      <div className="metadata">
        <address>
          By <a rel="author" href="/authors/john">John Doe</a>
        </address>
        <time dateTime="2024-01-01">January 1, 2024</time>
      </div>
      <figure>
        <img src="/hero.jpg" alt="Descriptive alt text" />
        <figcaption>Image caption text</figcaption>
      </figure>
    </header>

    <div className="content">
      <section aria-labelledby="section1">
        <h2 id="section1">Section Title</h2>
        <p>Content...</p>

        <aside className="callout" aria-label="Note">
          <h3>Important Note</h3>
          <p>Additional information...</p>
        </aside>
      </section>
    </div>

    <footer>
      <section className="tags" aria-label="Article tags">
        <h2>Tags</h2>
        <ul>
          <li><a href="/tags/react">React</a></li>
        </ul>
      </section>

      <section className="share" aria-label="Share article">
        <h2>Share</h2>
        <ul>
          <li>
            <button aria-label="Share on Twitter">Twitter</button>
          </li>
        </ul>
      </section>
    </footer>
  </article>
);
```

:::

### 3. Form Patterns

::: code-with-tooltips

```tsx
// Complex Form with Fieldsets
const RegistrationForm = () => (
  <form aria-labelledby="form-title" noValidate>
    <h1 id="form-title">Create Account</h1>

    <fieldset>
      <legend>Personal Information</legend>

      <div role="group" aria-labelledby="name-group">
        <div id="name-group">Name</div>
        <div className="field-group">
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              aria-required="true"
              aria-describedby="firstName-help"
            />
            <small id="firstName-help">Enter your legal first name</small>
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              aria-required="true"
            />
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset>
      <legend>Account Security</legend>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          aria-required="true"
          aria-describedby="password-requirements"
        />
        <div id="password-requirements" role="status">
          <ul>
            <li>Must be at least 8 characters</li>
            <li>Must include a number</li>
          </ul>
        </div>
      </div>

      <div className="field">
        <label htmlFor="security-question">Security Question</label>
        <select
          id="security-question"
          aria-required="true"
        >
          <option value="">Select a question</option>
          <optgroup label="Personal Questions">
            <option value="pet">What was your first pet's name?</option>
          </optgroup>
        </select>
      </div>
    </fieldset>

    <fieldset>
      <legend>Preferences</legend>

      <div role="group" aria-labelledby="notifications-group">
        <div id="notifications-group">Notification Preferences</div>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="notifications"
              value="email"
            />
            Email notifications
          </label>
          <label>
            <input
              type="checkbox"
              name="notifications"
              value="sms"
            />
            SMS notifications
          </label>
        </div>
      </div>
    </fieldset>

    <div className="form-actions">
      <button type="button">Cancel</button>
      <button type="submit">Create Account</button>
    </div>
  </form>
);
```

:::

### 4. Dialog Patterns

::: code-with-tooltips

```tsx
// Modal Dialog
const Modal = ({ title, children, onClose }) => (
  <div
    role="dialog"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    aria-modal="true"
  >
    <header>
      <h2 id="dialog-title">{title}</h2>
      <button
        onClick={onClose}
        aria-label="Close dialog"
      >
        ×
      </button>
    </header>

    <div id="dialog-description">
      {children}
    </div>

    <footer>
      <div className="dialog-actions">
        <button onClick={onClose}>Cancel</button>
        <button>Confirm</button>
      </div>
    </footer>
  </div>
);

// Alert Dialog
const AlertDialog = ({ title, children, onClose }) => (
  <div
    role="alertdialog"
    aria-labelledby="alert-title"
    aria-describedby="alert-content"
  >
    <h2 id="alert-title">{title}</h2>
    <div id="alert-content">{children}</div>
    <button onClick={onClose}>Acknowledge</button>
  </div>
);
```

:::

### 5. Interactive Component Patterns

::: code-with-tooltips

```tsx
// Tabs
const TabInterface = () => (
  <div className="tabs">
    <div role="tablist" aria-label="Content sections">
      <button
        role="tab"
        aria-selected="true"
        aria-controls="panel-1"
        id="tab-1"
      >
        Tab 1
      </button>
      <button
        role="tab"
        aria-selected="false"
        aria-controls="panel-2"
        id="tab-2"
        tabIndex={-1}
      >
        Tab 2
      </button>
    </div>

    <div
      role="tabpanel"
      id="panel-1"
      aria-labelledby="tab-1"
      tabIndex={0}
    >
      Panel 1 content
    </div>
    <div
      role="tabpanel"
      id="panel-2"
      aria-labelledby="tab-2"
      tabIndex={0}
      hidden
    >
      Panel 2 content
    </div>
  </div>
);

// Accordion
const Accordion = () => (
  <div className="accordion">
    <h3>
      <button
        aria-expanded="true"
        aria-controls="section1-content"
        id="section1-header"
      >
        Section 1
      </button>
    </h3>
    <div
      id="section1-content"
      role="region"
      aria-labelledby="section1-header"
    >
      Content 1
    </div>

    <h3>
      <button
        aria-expanded="false"
        aria-controls="section2-content"
        id="section2-header"
      >
        Section 2
      </button>
    </h3>
    <div
      id="section2-content"
      role="region"
      aria-labelledby="section2-header"
      hidden
    >
      Content 2
    </div>
  </div>
);
```

:::

### 6. Content Organization Patterns

::: code-with-tooltips

```tsx
// Card Grid
const CardGrid = () => (
  <section aria-labelledby="section-title">
    <h2 id="section-title">Featured Items</h2>
    <div className="card-grid" role="list">
      {items.map(item => (
        <article role="listitem" key={item.id} className="card">
          <header>
            <h3>{item.title}</h3>
          </header>
          <div className="card-content">
            <img src={item.image} alt="" aria-hidden="true" />
            <p>{item.description}</p>
          </div>
          <footer>
            <button aria-label={`Learn more about ${item.title}`}>
              Learn More
            </button>
          </footer>
        </article>
      ))}
    </div>
  </section>
);

// Search Results
const SearchResults = ({ query, results }) => (
  <section aria-labelledby="results-title">
    <h2 id="results-title">
      Search Results for "{query}"
    </h2>

    <p role="status" aria-live="polite">
      {results.length} results found
    </p>

    {results.length > 0 ? (
      <ul>
        {results.map(result => (
          <li key={result.id}>
            <article className="search-result">
              <h3>
                <a href={result.url}>{result.title}</a>
              </h3>
              <p>{result.excerpt}</p>
              <footer>
                <dl>
                  <dt>Author</dt>
                  <dd>{result.author}</dd>
                  <dt>Published</dt>
                  <dd>
                    <time dateTime={result.date}>
                      {formatDate(result.date)}
                    </time>
                  </dd>
                </dl>
              </footer>
            </article>
          </li>
        ))}
      </ul>
    ) : (
      <p>No results found.</p>
    )}
  </section>
);
```

:::

### 7. Error Handling Patterns

::: code-with-tooltips

```tsx
// Form Error Summary
const FormErrorSummary = ({ errors }) => (
  errors.length > 0 && (
    <div
      role="alert"
      aria-labelledby="error-summary-title"
      className="error-summary"
    >
      <h2 id="error-summary-title">
        There are problems with your submission
      </h2>
      <ul>
        {errors.map(error => (
          <li key={error.id}>
            <a href={`#${error.field}`}>{error.message}</a>
          </li>
        ))}
      </ul>
    </div>
  )
);

// Inline Form Errors
const FormField = ({ id, label, error, ...props }) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
    {error && (
      <div
        id={`${id}-error`}
        className="error-message"
        role="alert"
      >
        {error}
      </div>
    )}
  </div>
);
```

:::

### 8. Loading State Patterns

::: code-with-tooltips

```tsx
// Loading States
const LoadingStates = () => (
  <>
    {/* Simple loading */}
    <div
      role="status"
      aria-label="Loading content"
    >
      <span className="spinner" aria-hidden="true" />
      <span className="visually-hidden">Loading...</span>
    </div>

    {/* Loading with progress */}
    <div role="progressbar"
      aria-valuenow={75}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading profile data"
    >
      <div className="progress-bar" style={{ width: '75%' }} />
    </div>

    {/* Skeleton loading */}
    <div role="status" aria-label="Loading article">
      <div className="skeleton-text" aria-hidden="true" />
      <div className="skeleton-text" aria-hidden="true" />
      <div className="skeleton-text" aria-hidden="true" />
    </div>
  </>
);
```

:::

## Additional Best Practices

### 1. Landmark Roles

- Use HTML5 semantic elements instead of ARIA roles when possible
- Ensure all content is within a landmark region
- Don't duplicate landmark roles unnecessarily
- Use aria-label to distinguish multiple instances of the same landmark

### 2. Focus Management

- Maintain a logical tab order
- Ensure all interactive elements are focusable
- Provide visible focus indicators
- Manage focus when content changes
- Trap focus in modals

### 3. Dynamic Content

- Use aria-live for dynamic content updates
- Choose appropriate aria-live politeness levels
- Update page title for single-page applications
- Announce loading states and results
- Handle infinite scroll accessibility

### 4. Content Structure

- Use proper heading hierarchy
- Group related form fields
- Provide table headers and captions
- Use definition lists for key-value pairs
- Structure lists appropriately

### 5. Interactive Widgets

- Follow WAI-ARIA design patterns
- Provide keyboard alternatives
- Handle touch interactions
- Support screen reader navigation
- Maintain state information

## Common Pitfalls

1. Overusing Semantic Elements:

::: code-with-tooltips

```tsx
// Bad
<section className="button-wrapper">
  <article className="button">Click me</article>
</section>

// Good
<div className="button-wrapper">
  <button type="button">Click me</button>
</div>
```

:::

2. Missing Required Attributes:

::: code-with-tooltips

```tsx
// Bad
<img src="image.jpg" /> // Missing alt
<input type="text" /> // Missing label

// Good
<img src="image.jpg" alt="Description" />
<label>
  Name:
  <input type="text" />
</label>
```

:::

3. Improper Nesting:

::: code-with-tooltips

```tsx
// Bad
<h1>Title</h1>
<section>
  <h3>Subtitle</h3> // Skipped h2
</section>

// Good
<h1>Title</h1>
<section>
  <h2>Section Title</h2>
  <h3>Subtitle</h3>
</section>
```

:::

4. Redundant ARIA:

::: code-with-tooltips

```tsx
// Bad
<button role="button">Click me</button>
<nav role="navigation">Menu</nav>

// Good
<button>Click me</button>
<nav>Menu</nav>
```

:::

## Resources

- [HTML Living Standard](https://html.spec.whatwg.org/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [WebAIM](https://webaim.org/)
- [A11Y Project](https://www.a11yproject.com/)
