---
title: Input Components
description: Flexible and accessible input components for React applications with comprehensive validation and state management
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Form Controls
  - Input
  - Validation
  - Accessibility
---

# Input Components

## Overview

A comprehensive set of input components that handle various text input scenarios, form validation, and accessibility requirements. These components are built with TypeScript and follow modern React patterns.

## Components

### Base Input

The foundation input component with validation and state management:

::: code-with-tooltips

```tsx
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Input size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Left addon (icon, text, etc.) */
  leftAddon?: ReactNode;
  /** Right addon (icon, text, etc.) */
  rightAddon?: ReactNode;
  /** Whether the input is loading */
  isLoading?: boolean;
  /** Whether the input spans full width */
  isFullWidth?: boolean;
  /** Additional classes for the wrapper */
  wrapperClassName?: string;
  /** Additional classes for the input */
  inputClassName?: string;
}

export const Input = forwardRef(({
  label,
  helperText,
  error,
  success,
  size = 'md',
  leftAddon,
  rightAddon,
  isLoading = false,
  isFullWidth = false,
  disabled = false,
  required = false,
  wrapperClassName,
  inputClassName,
  id,
  ...props
}: InputProps, ref: Ref<HTMLInputElement>) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperTextId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;

  const hasError = !!error;
  const hasSuccess = !!success;
  const hasHelperText = !!helperText;
  const hasAddon = !!(leftAddon || rightAddon);

  return (
    <div
      className={clsx(
        'input-wrapper',
        `input-wrapper--${size}`,
        isFullWidth && 'input-wrapper--full-width',
        hasError && 'input-wrapper--error',
        hasSuccess && 'input-wrapper--success',
        disabled && 'input-wrapper--disabled',
        wrapperClassName
      )}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="input__label"
        >
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="input__required-indicator">
                *
              </span>
              <span className="sr-only">(required)</span>
            </>
          )}
        </label>
      )}

      <div
        className={clsx(
          'input__field-wrapper',
          hasAddon && 'input__field-wrapper--with-addon'
        )}
      >
        {leftAddon && (
          <span className="input__addon input__addon--left">
            {leftAddon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'input__field',
            hasError && 'input__field--error',
            hasSuccess && 'input__field--success',
            inputClassName
          )}
          disabled={disabled || isLoading}
          required={required}
          aria-invalid={hasError}
          aria-describedby={clsx(
            hasHelperText && helperTextId,
            hasError && errorId,
            hasSuccess && successId
          )}
          {...props}
        />

        {rightAddon && (
          <span className="input__addon input__addon--right">
            {rightAddon}
          </span>
        )}

        {isLoading && (
          <span
            className="input__spinner"
            aria-hidden="true"
          >
            {/* Spinner SVG */}
          </span>
        )}
      </div>

      {helperText && (
        <span
          id={helperTextId}
          className="input__helper-text"
        >
          {helperText}
        </span>
      )}

      {error && (
        <span
          id={errorId}
          className="input__error"
          role="alert"
        >
          {error}
        </span>
      )}

      {success && (
        <span
          id={successId}
          className="input__success"
          role="status"
        >
          {success}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
```

:::

::: code-with-tooltips

```scss
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &--full-width {
    width: 100%;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  // Sizes
  &--sm {
    font-size: 0.875rem;

    .input__field {
      height: 32px;
      padding: 0 0.75rem;
    }

    .input__addon {
      padding: 0 0.5rem;
    }
  }

  &--md {
    font-size: 1rem;

    .input__field {
      height: 40px;
      padding: 0 1rem;
    }

    .input__addon {
      padding: 0 0.75rem;
    }
  }

  &--lg {
    font-size: 1.125rem;

    .input__field {
      height: 48px;
      padding: 0 1.25rem;
    }

    .input__addon {
      padding: 0 1rem;
    }
  }
}

.input__label {
  color: var(--vp-c-text-1);
  font-weight: 500;
  cursor: pointer;
}

.input__required-indicator {
  color: var(--vp-c-danger);
  margin-left: 0.25rem;
}

.input__field-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  &--with-addon {
    .input__field {
      &:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      &:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }
}

.input__field {
  width: 100%;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: inherit;
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--vp-c-text-3);
  }

  &:hover:not(:disabled) {
    border-color: var(--vp-c-brand);
  }

  &:focus {
    outline: none;
    border-color: var(--vp-c-brand);
    box-shadow: 0 0 0 3px color.adjust(colors.$purple-brand, $alpha: -0.8);
  }

  &:disabled {
    background: var(--vp-c-bg-mute);
    cursor: not-allowed;
  }

  &--error {
    border-color: var(--vp-c-danger) !important;

    &:focus {
      box-shadow: 0 0 0 3px color.adjust(colors.$red-500, $alpha: -0.8);
    }
  }

  &--success {
    border-color: var(--vp-c-success) !important;

    &:focus {
      box-shadow: 0 0 0 3px color.adjust(colors.$green-500, $alpha: -0.8);
    }
  }
}

.input__addon {
  display: flex;
  align-items: center;
  background: var(--vp-c-bg-mute);
  border: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);

  &--left {
    border-right: 0;
    border-radius: 8px 0 0 8px;
  }

  &--right {
    border-left: 0;
    border-radius: 0 8px 8px 0;
  }

  svg {
    width: 1em;
    height: 1em;
  }
}

.input__spinner {
  position: absolute;
  right: 1rem;
  color: var(--vp-c-brand);
  animation: spin 1s linear infinite;
}

.input__helper-text {
  color: var(--vp-c-text-2);
  font-size: 0.875em;
}

.input__error {
  color: var(--vp-c-danger);
  font-size: 0.875em;
}

.input__success {
  color: var(--vp-c-success);
  font-size: 0.875em;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Dark mode adjustments
.dark {
  .input__field {
    background: color.adjust(colors.$purple-dark, $lightness: 5%);

    &:disabled {
      background: color.adjust(colors.$purple-dark, $lightness: -3%);
    }
  }

  .input__addon {
    background: color.adjust(colors.$purple-dark, $lightness: -3%);
  }
}
```

:::

### Password Input

A specialized input component for password fields with show/hide functionality:

::: code-with-tooltips

```tsx
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './icons';

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Input
      {...props}
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      rightAddon={
        <button
          type="button"
          onClick={togglePassword}
          className="password-toggle"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
```

:::

::: code-with-tooltips

```scss
.password-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;

  &:hover {
    color: var(--vp-c-text-1);
  }

  &:focus-visible {
    outline: 2px solid var(--vp-c-brand);
    outline-offset: 2px;
    border-radius: 4px;
  }
}
```

:::

## Usage Examples

### Basic Input

::: code-with-tooltips

```tsx
<Input
  label="Username"
  placeholder="Enter your username"
  helperText="Choose a unique username"
/>
```

:::

### Required Input with Validation

::: code-with-tooltips

```tsx
<Input
  label="Email"
  type="email"
  required
  placeholder="Enter your email"
  error="Please enter a valid email address"
/>
```

:::

### Input with Icons

::: code-with-tooltips

```tsx
<Input
  label="Search"
  placeholder="Search..."
  leftAddon={<SearchIcon />}
  rightAddon={<XIcon />}
/>
```

:::

### Input Sizes

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  <Input size="sm" placeholder="Small input" />
  <Input size="md" placeholder="Medium input" />
  <Input size="lg" placeholder="Large input" />
</div>
```

:::

### Input States

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  <Input
    label="Success"
    value="Valid input"
    success="Input is valid"
  />
  <Input
    label="Error"
    value="Invalid input"
    error="Please correct this field"
  />
  <Input
    label="Disabled"
    value="Disabled input"
    disabled
  />
  <Input
    label="Loading"
    value="Loading..."
    isLoading
  />
</div>
```

:::

### Password Input

::: code-with-tooltips

```tsx
<PasswordInput
  label="Password"
  placeholder="Enter your password"
  helperText="Must be at least 8 characters"
/>
```

:::

## Form Integration Example

::: code-with-tooltips

```tsx
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            email: e.target.value
          }))}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          required
          value={formData.password}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            password: e.target.value
          }))}
          error={errors.password}
        />

        <Button type="submit" isFullWidth>
          Sign In
        </Button>
      </div>
    </form>
  );
};
```

:::

## Best Practices

### 1. Accessibility

- Use proper ARIA attributes
- Provide clear error messages
- Support keyboard navigation
- Maintain visible focus states
- Use semantic HTML elements

### 2. Validation

- Implement client-side validation
- Show clear error messages
- Provide real-time feedback
- Handle different input types
- Support custom validation

### 3. User Experience

- Show password strength
- Provide clear feedback
- Handle loading states
- Support autocomplete
- Implement proper masking

### 4. Performance

- Debounce input events
- Optimize re-renders
- Lazy load components
- Handle large forms efficiently
- Cache validation results

### 5. Security

- Sanitize input data
- Prevent XSS attacks
- Handle sensitive data
- Implement rate limiting
- Use proper encryption

## Composition

The Input components are designed to be composed with other form controls:

::: code-with-tooltips

```tsx
const FormField = ({
  label,
  error,
  required,
  children
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <div className="form-field">
    <label className="form-field__label">
      {label}
      {required && <span className="form-field__required">*</span>}
    </label>
    {children}
    {error && (
      <span className="form-field__error">{error}</span>
    )}
  </div>
);

// Usage
<FormField label="Email" required error="Invalid email">
  <Input type="email" />
</FormField>
```

:::
