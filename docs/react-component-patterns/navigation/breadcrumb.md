---
title: Breadcrumb Components
description: Breadcrumb navigation components for React applications with flexible styling and accessibility
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Navigation
  - Breadcrumb
  - Design System
  - Accessibility
---

# Breadcrumb Components

## Overview

Our breadcrumb components provide a clear navigation trail for users to understand their location within the application hierarchy.

## Components

### Breadcrumb Container

The container component for breadcrumb items:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface BreadcrumbProps {
  /** Breadcrumb items */
  children: React.ReactNode;
  /** Separator between items */
  separator?: React.ReactNode;
  /** Maximum items to show before collapsing */
  maxItems?: number;
  /** Label for navigation */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

export const Breadcrumb = ({
  children,
  separator = '/',
  maxItems,
  label = 'Breadcrumb',
  className,
  ...props
}: BreadcrumbProps) => {
  const items = React.Children.toArray(children);
  const itemCount = items.length;

  const renderItems = () => {
    if (!maxItems || itemCount <= maxItems) {
      return items.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index < itemCount - 1 && (
            <li
              className="breadcrumb__separator"
              aria-hidden="true"
            >
              {separator}
            </li>
          )}
        </React.Fragment>
      ));
    }

    const showItems = maxItems - 2;
    return (
      <>
        {items.slice(0, showItems).map((item, index) => (
          <React.Fragment key={index}>
            {item}
            <li
              className="breadcrumb__separator"
              aria-hidden="true"
            >
              {separator}
            </li>
          </React.Fragment>
        ))}
        <li
          className="breadcrumb__collapse"
          aria-label={`${itemCount - showItems - 1} more navigation levels`}
        >
          ...
        </li>
        <li
          className="breadcrumb__separator"
          aria-hidden="true"
        >
          {separator}
        </li>
        {items[itemCount - 1]}
      </>
    );
  };

  return (
    <nav
      aria-label={label}
      className={clsx('breadcrumb', className)}
      {...props}
    >
      <ol className="breadcrumb__list">
        {renderItems()}
      </ol>
    </nav>
  );
};

// Example usage with proper semantic HTML
const PageBreadcrumb = () => (
  <header className="page-header">
    <Breadcrumb label="Current page location">
      <BreadcrumbItem href="/">
        <HomeIcon aria-hidden="true" />
        <span>Home</span>
      </BreadcrumbItem>
      <BreadcrumbItem href="/products">
        Products
      </BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics">
        Electronics
      </BreadcrumbItem>
      <BreadcrumbItem active>
        Smartphones
      </BreadcrumbItem>
    </Breadcrumb>
  </header>
);

// Example with dropdown for collapsed items
const BreadcrumbWithDropdown = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <li className="breadcrumb__item">
        <div ref={dropdownRef} className="breadcrumb__dropdown">
          <button
            className="breadcrumb__dropdown-trigger"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label="Show more navigation levels"
          >
            ...
          </button>
          {isOpen && (
            <ul
              className="breadcrumb__dropdown-menu"
              role="menu"
            >
              <li role="none">
                <a
                  href="/level1"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  Level 1
                </a>
              </li>
              <li role="none">
                <a
                  href="/level2"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  Level 2
                </a>
              </li>
            </ul>
          )}
        </div>
      </li>
      <BreadcrumbItem href="/current">Current</BreadcrumbItem>
      <BreadcrumbItem active>Details</BreadcrumbItem>
    </Breadcrumb>
  );
};

// Example with schema.org markup
const BreadcrumbWithSchema = () => (
  <Breadcrumb>
    <BreadcrumbItem
      href="/"
      itemScope
      itemType="https://schema.org/ListItem"
      itemProp="item"
      position={1}
    >
      <span itemProp="name">Home</span>
    </BreadcrumbItem>
    <BreadcrumbItem
      href="/products"
      itemScope
      itemType="https://schema.org/ListItem"
      itemProp="item"
      position={2}
    >
      <span itemProp="name">Products</span>
    </BreadcrumbItem>
    <BreadcrumbItem
      active
      itemScope
      itemType="https://schema.org/ListItem"
      itemProp="item"
      position={3}
    >
      <span itemProp="name">Current Page</span>
    </BreadcrumbItem>
  </Breadcrumb>
);
```

:::

::: code-with-tooltips

```scss
.breadcrumb {
  // Container styles
  &__list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  // Separator styles
  &__separator {
    display: flex;
    align-items: center;
    color: var(--vp-c-text-2);
    margin: 0 var(--spacing-2);
    user-select: none;
  }

  // Collapse indicator
  &__collapse {
    color: var(--vp-c-text-2);
    margin: 0 var(--spacing-2);
    cursor: default;
  }
}
```

:::

### Breadcrumb Item

The individual breadcrumb item component:

::: code-with-tooltips

```tsx
interface BreadcrumbItemProps {
  /** Item content */
  children: React.ReactNode;
  /** Whether the item is active */
  active?: boolean;
  /** Href for link items */
  href?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export const BreadcrumbItem = ({
  children,
  active = false,
  href,
  onClick,
  className,
  ...props
}: BreadcrumbItemProps) => {
  const content = (
    <span className="breadcrumb-item__content">
      {children}
    </span>
  );

  return (
    <li
      className={clsx(
        'breadcrumb-item',
        active && 'breadcrumb-item--active',
        className
      )}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {href ? (
        <a
          href={href}
          className="breadcrumb-item__link"
          onClick={onClick}
          aria-current={active ? 'page' : undefined}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
};
```

:::

::: code-with-tooltips

```scss
.breadcrumb-item {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);

  // Link styles
  &__link {
    color: var(--vp-c-text-1);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--vp-c-brand);
      text-decoration: underline;
    }
  }

  // Content styles
  &__content {
    display: inline-flex;
    align-items: center;
  }

  // Active state
  &--active {
    color: var(--vp-c-text-1);
    font-weight: 500;
  }
}
```

:::

## Usage Examples

### Basic Breadcrumb

::: code-with-tooltips

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem active>Categories</BreadcrumbItem>
</Breadcrumb>
```

:::

### Custom Separator

::: code-with-tooltips

```tsx
<Breadcrumb separator=">">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
  <BreadcrumbItem active>Article Title</BreadcrumbItem>
</Breadcrumb>
```

:::

### With Icons

::: code-with-tooltips

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">
    <HomeIcon className="mr-1" />
    Home
  </BreadcrumbItem>
  <BreadcrumbItem href="/dashboard">
    <DashboardIcon className="mr-1" />
    Dashboard
  </BreadcrumbItem>
  <BreadcrumbItem active>
    <SettingsIcon className="mr-1" />
    Settings
  </BreadcrumbItem>
</Breadcrumb>
```

:::

### Collapsed Items

::: code-with-tooltips

```tsx
<Breadcrumb maxItems={3}>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem href="/categories">Categories</BreadcrumbItem>
  <BreadcrumbItem href="/electronics">Electronics</BreadcrumbItem>
  <BreadcrumbItem active>Smartphones</BreadcrumbItem>
</Breadcrumb>
```

:::

### With Dropdown

::: code-with-tooltips

```tsx
const CollapsedBreadcrumb = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <div className="breadcrumb__dropdown">
        <button
          className="breadcrumb__dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          ...
        </button>
        {isOpen && (
          <div className="breadcrumb__dropdown-content">
            <a href="/level-1">Level 1</a>
            <a href="/level-2">Level 2</a>
            <a href="/level-3">Level 3</a>
          </div>
        )}
      </div>
      <BreadcrumbItem href="/current">Current</BreadcrumbItem>
      <BreadcrumbItem active>Details</BreadcrumbItem>
    </Breadcrumb>
  );
};
```

:::

## Best Practices

### 1. Accessibility

- Use proper ARIA labels
- Support keyboard navigation
- Maintain focus states
- Clear visual hierarchy
- Screen reader support

### 2. UX Guidelines

- Clear visual separation
- Consistent spacing
- Logical hierarchy
- Responsive behavior
- Touch targets

### 3. Performance

- Minimize re-renders
- Efficient DOM updates
- Handle large paths
- Optimize transitions
- Cache calculations

### 4. Implementation

Example of using breadcrumbs in layouts:

::: code-with-tooltips

```tsx
// Page layout with breadcrumb
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs(location.pathname);

  return (
    <div className="page-layout">
      <header className="page-header">
        <Breadcrumb>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem
              key={crumb.path}
              href={crumb.path}
              active={index === breadcrumbs.length - 1}
            >
              {crumb.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </header>

      <main className="page-content">
        {children}
      </main>
    </div>
  );
};

// Dynamic breadcrumbs hook
const useBreadcrumbs = (path: string) => {
  return React.useMemo(() => {
    const parts = path.split('/').filter(Boolean);
    let currentPath = '';

    return parts.map(part => {
      currentPath += `/${part}`;
      return {
        label: formatLabel(part),
        path: currentPath,
      };
    });
  }, [path]);
};
```

:::

### 5. Customization

Example of extending breadcrumb styles:

::: code-with-tooltips

```scss
// Custom breadcrumb variants
.breadcrumb {
  // Contained style
  &--contained {
    background-color: var(--vp-c-bg-soft);
    padding: var(--spacing-3) var(--spacing-4);
    border-radius: 8px;
  }

  // Bordered style
  &--bordered {
    border: 1px solid var(--vp-c-divider);
    padding: var(--spacing-2) var(--spacing-4);
    border-radius: 8px;
  }

  // Arrow separator
  &--arrow {
    .breadcrumb__separator {
      margin: 0;

      &::after {
        content: '';
        width: 24px;
        height: 24px;
        background-image: url("data:image/svg+xml,...");
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  }
}

// Custom item variants
.breadcrumb-item {
  // Chip style
  &--chip {
    background-color: var(--vp-c-bg-soft);
    padding: var(--spacing-1) var(--spacing-3);
    border-radius: 16px;

    &:hover {
      background-color: var(--vp-c-bg-mute);
    }

    &.breadcrumb-item--active {
      background-color: var(--vp-c-brand);
      color: white;
    }
  }

  // Underline style
  &--underline {
    .breadcrumb-item__link {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--vp-c-brand);
        transform: scaleX(0);
        transition: transform 0.2s ease;
      }

      &:hover::after {
        transform: scaleX(1);
      }
    }
  }
}
```

:::
