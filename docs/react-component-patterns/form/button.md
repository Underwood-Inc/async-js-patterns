---
title: Button Components
description: Flexible and accessible button components for React applications
date: 2024-12-01
author: Underwood Inc
tags:
  - React
  - Buttons
  - Components
  - Design System
---

# Button Components

## Overview

A comprehensive set of button components that provide consistent styling and behavior across your application. These components are fully accessible, support keyboard navigation, and include loading states.

## Components

### Base Button

The foundation button component with multiple variants:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Full width button */
  isFullWidth?: boolean;
  /** Left icon component */
  leftIcon?: React.ReactNode;
  /** Right icon component */
  rightIcon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'button',
        `button--${variant}`,
        `button--${size}`,
        isFullWidth && 'button--full-width',
        isLoading && 'button--loading',
        className
      )}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="button__spinner" aria-hidden="true">
          {/* Spinner SVG */}
        </span>
      )}
      <span className="button__content">
        {leftIcon && (
          <span className="button__icon button__icon--left">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="button__icon button__icon--right">
            {rightIcon}
          </span>
        )}
      </span>
    </button>
  );
};
```

:::

::: code-with-tooltips

```scss
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  // Remove default button styles
  appearance: none;
  -webkit-appearance: none;

  &:focus-visible {
    outline: 2px solid var(--vp-c-brand);
    outline-offset: 2px;
  }

  // Variants
  &--primary {
    background: var(--vp-c-brand);
    color: white;

    &:hover:not(:disabled) {
      background: var(--vp-c-brand-dark);
    }

    &:active:not(:disabled) {
      background: var(--vp-c-brand-darker);
    }
  }

  &--secondary {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-divider);

    &:hover:not(:disabled) {
      background: var(--vp-c-bg-mute);
      border-color: var(--vp-c-brand);
    }

    &:active:not(:disabled) {
      background: var(--vp-c-bg-alt);
    }
  }

  &--outline {
    background: transparent;
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
    background: transparent;
    color: var(--vp-c-brand);

    &:hover:not(:disabled) {
      background: color.adjust(colors.$purple-brand, $alpha: -0.9);
    }

    &:active:not(:disabled) {
      background: color.adjust(colors.$purple-brand, $alpha: -0.8);
    }
  }

  // Sizes
  &--sm {
    height: 32px;
    padding: 0 12px;
    font-size: 14px;
    gap: 6px;
  }

  &--md {
    height: 40px;
    padding: 0 16px;
    font-size: 16px;
    gap: 8px;
  }

  &--lg {
    height: 48px;
    padding: 0 24px;
    font-size: 18px;
    gap: 10px;
  }

  // States
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--loading {
    cursor: wait;

    .button__content {
      opacity: 0;
    }

    .button__spinner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &--full-width {
    width: 100%;
  }

  // Icon positioning
  .button__content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: inherit;
  }

  .button__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

// Dark mode adjustments
.dark .button {
  &--secondary {
    background: color.adjust(colors.$purple-dark, $lightness: 5%);

    &:hover:not(:disabled) {
      background: color.adjust(colors.$purple-dark, $lightness: 10%);
    }

    &:active:not(:disabled) {
      background: color.adjust(colors.$purple-dark, $lightness: 15%);
    }
  }
}
```

:::

## Usage Examples

### Basic Buttons

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', gap: '1rem' }}>
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
</div>
```

:::

### Button Sizes

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>
```

:::

### With Icons

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', gap: '1rem' }}>
  <Button leftIcon={<SearchIcon />}>Search</Button>
  <Button rightIcon={<ArrowRightIcon />}>Next</Button>
  <Button leftIcon={<PlusIcon />} rightIcon={<ChevronDownIcon />}>
    Add Item
  </Button>
</div>
```

:::

### States

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', gap: '1rem' }}>
  <Button isLoading>Loading</Button>
  <Button isDisabled>Disabled</Button>
  <Button isFullWidth>Full Width</Button>
</div>
```

:::

## Best Practices

### 1. Accessibility

- Use proper ARIA attributes
- Support keyboard navigation
- Maintain focus states
- Provide loading state indicators

### 2. User Experience

- Use appropriate cursor styles
- Implement hover and active states
- Provide visual feedback
- Maintain consistent spacing

### 3. Performance

- Optimize icon loading
- Use CSS transitions
- Implement proper memoization
- Handle click events efficiently

### 4. Maintainability

- Follow consistent naming
- Document props and variants
- Implement proper types
- Write comprehensive tests

## Button Group Component

For related buttons that should be grouped together:

::: code-with-tooltips

```tsx
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  className,
}: ButtonGroupProps) => {
  return (
    <div
      className={clsx(
        'button-group',
        `button-group--${orientation}`,
        `button-group--${spacing}`,
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.button-group {
  display: inline-flex;

  &--horizontal {
    flex-direction: row;

    &.button-group--sm { gap: 0.5rem; }
    &.button-group--md { gap: 1rem; }
    &.button-group--lg { gap: 1.5rem; }
  }

  &--vertical {
    flex-direction: column;

    &.button-group--sm { gap: 0.5rem; }
    &.button-group--md { gap: 1rem; }
    &.button-group--lg { gap: 1.5rem; }
  }
}
</code_block_to_apply_changes_from>
```

:::
