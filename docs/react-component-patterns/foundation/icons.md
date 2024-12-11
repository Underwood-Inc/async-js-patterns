---
title: Icon System
description: A comprehensive icon system for React components with SVG icons, customization, and accessibility
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Icons
  - SVG
  - Design System
  - Accessibility
---

# Icon System

## Overview

Our icon system provides a flexible and accessible way to use SVG icons in React components. It supports customization, themes, and follows accessibility best practices.

## Components

### Base Icon

The foundation icon component with customization options:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Icon size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Icon color */
  color?: string;
  /** Whether the icon is decorative */
  decorative?: boolean;
  /** Label for non-decorative icons */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

export const Icon = ({
  size = 'md',
  color = 'currentColor',
  decorative = false,
  label,
  className,
  children,
  ...props
}: IconProps) => {
  const dimension = typeof size === 'number' ? size : sizeMap[size];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={dimension}
      height={dimension}
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx('icon', className)}
      aria-hidden={decorative}
      aria-label={!decorative ? label : undefined}
      role={!decorative ? 'img' : undefined}
      {...props}
    >
      {children}
    </svg>
  );
};
```

:::

### Icon Components

Common icon components built on the base Icon:

::: code-with-tooltips

```tsx
export const ChevronDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);

export const SearchIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 6L9 17l-5-5" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Icon>
);

export const InfoIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </Icon>
);

export const WarningIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
  </Icon>
);
```

:::

### Icon Button

A button component with icon support:

::: code-with-tooltips

```tsx
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon component */
  icon: React.ReactElement;
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Button variant */
  variant?: 'solid' | 'outline' | 'ghost';
  /** Whether the button is active */
  isActive?: boolean;
  /** Whether the button is loading */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const IconButton = ({
  icon,
  size = 'md',
  variant = 'solid',
  isActive = false,
  isLoading = false,
  className,
  ...props
}: IconButtonProps) => {
  const clonedIcon = React.cloneElement(icon, {
    size,
    'aria-hidden': true,
  });

  return (
    <button
      className={clsx(
        'icon-button',
        `icon-button--${size}`,
        `icon-button--${variant}`,
        isActive && 'icon-button--active',
        isLoading && 'icon-button--loading',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <SpinnerIcon size={size} className="icon-button__spinner" />
      ) : (
        clonedIcon
      )}
    </button>
  );
};
```

:::

::: code-with-tooltips

```scss
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  // Remove default button styles
  appearance: none;
  -webkit-appearance: none;
  background: none;
  padding: 0;

  &:focus-visible {
    outline: 2px solid var(--vp-c-brand);
    outline-offset: 2px;
  }

  // Sizes
  &--xs {
    width: 24px;
    height: 24px;
  }

  &--sm {
    width: 32px;
    height: 32px;
  }

  &--md {
    width: 40px;
    height: 40px;
  }

  &--lg {
    width: 48px;
    height: 48px;
  }

  &--xl {
    width: 56px;
    height: 56px;
  }

  // Variants
  &--solid {
    background: var(--vp-c-brand);
    color: white;

    &:hover:not(:disabled) {
      background: var(--vp-c-brand-dark);
    }

    &:active:not(:disabled) {
      background: var(--vp-c-brand-darker);
    }
  }

  &--outline {
    border-color: var(--vp-c-brand);
    color: var(--vp-c-brand);

    &:hover:not(:disabled) {
      background: color.adjust(colors.$purple-brand, $alpha: -0.9);
    }

    &:active:not(:disabled) {
      background: color.adjust(colors.$purple-brand, $alpha: -0.8);
    }
  }

  &--ghost {
    color: var(--vp-c-brand);

    &:hover:not(:disabled) {
      background: color.adjust(colors.$purple-brand, $alpha: -0.9);
    }

    &:active:not(:disabled) {
      background: color.adjust(colors.$purple-brand, $alpha: -0.8);
    }
  }

  // States
  &--active {
    background: var(--vp-c-brand);
    color: white;
    border-color: var(--vp-c-brand);
  }

  &--loading {
    cursor: wait;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.icon-button__spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

:::

## Usage Examples

### Basic Icons

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
  <SearchIcon size="sm" />
  <CheckIcon size="md" color="var(--vp-c-brand)" />
  <InfoIcon size="lg" />
  <WarningIcon size="xl" color="var(--color-warning)" />
</div>
```

:::

### Icon Buttons

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', gap: '1rem' }}>
  <IconButton
    icon={<SearchIcon />}
    aria-label="Search"
  />
  <IconButton
    icon={<CloseIcon />}
    variant="outline"
    aria-label="Close"
  />
  <IconButton
    icon={<InfoIcon />}
    variant="ghost"
    aria-label="Information"
  />
</div>
```

:::

### Loading State

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', gap: '1rem' }}>
  <IconButton
    icon={<SearchIcon />}
    isLoading
    aria-label="Loading"
  />
  <IconButton
    icon={<CheckIcon />}
    variant="outline"
    isLoading
    aria-label="Loading"
  />
</div>
```

:::

### Icon Sizes

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
  <IconButton
    icon={<SearchIcon />}
    size="xs"
    aria-label="Search"
  />
  <IconButton
    icon={<SearchIcon />}
    size="sm"
    aria-label="Search"
  />
  <IconButton
    icon={<SearchIcon />}
    size="md"
    aria-label="Search"
  />
  <IconButton
    icon={<SearchIcon />}
    size="lg"
    aria-label="Search"
  />
  <IconButton
    icon={<SearchIcon />}
    size="xl"
    aria-label="Search"
  />
</div>
```

:::

## Best Practices

### 1. Accessibility

- Provide labels for non-decorative icons
- Use proper ARIA attributes
- Support keyboard navigation
- Maintain focus states
- Consider color contrast

### 2. Performance

- Optimize SVG paths
- Use proper caching
- Implement lazy loading
- Bundle icons efficiently
- Minimize repaints

### 3. Customization

- Support color themes
- Allow size variations
- Enable style overrides
- Handle different contexts
- Support RTL layouts

### 4. Implementation

Example of using icons in components:

::: code-with-tooltips

```tsx
// Alert component example
const Alert = ({
  status = 'info',
  children
}: {
  status?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}) => {
  const icons = {
    info: <InfoIcon />,
    success: <CheckIcon />,
    warning: <WarningIcon />,
    error: <CloseIcon />,
  };

  return (
    <div className={`alert alert--${status}`}>
      <span className="alert__icon">
        {icons[status]}
      </span>
      <div className="alert__content">
        {children}
      </div>
    </div>
  );
};

// Navigation component example
const Navigation = () => {
  return (
    <nav className="nav">
      <IconButton
        icon={<MenuIcon />}
        variant="ghost"
        className="nav__menu-button"
        aria-label="Toggle menu"
      />
      <div className="nav__actions">
        <IconButton
          icon={<SearchIcon />}
          variant="ghost"
          aria-label="Search"
        />
        <IconButton
          icon={<NotificationIcon />}
          variant="ghost"
          aria-label="Notifications"
        />
        <IconButton
          icon={<UserIcon />}
          variant="ghost"
          aria-label="User menu"
        />
      </div>
    </nav>
  );
};
```

:::

### 5. Organization

Example of organizing icons:

::: code-with-tooltips

```tsx
// icons/index.ts
export * from './interface';
export * from './arrows';
export * from './media';
export * from './status';
export * from './social';

// icons/interface.ts
export { SearchIcon } from './SearchIcon';
export { MenuIcon } from './MenuIcon';
export { CloseIcon } from './CloseIcon';
// ...

// icons/arrows.ts
export { ChevronDownIcon } from './ChevronDownIcon';
export { ChevronUpIcon } from './ChevronUpIcon';
export { ArrowLeftIcon } from './ArrowLeftIcon';
// ...

// Usage
import { SearchIcon, MenuIcon, ChevronDownIcon } from '@/icons';
```

:::
