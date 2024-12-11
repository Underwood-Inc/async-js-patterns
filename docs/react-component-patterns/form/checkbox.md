---
title: Checkbox Components
description: Flexible and accessible checkbox components for React applications with support for indeterminate states and grouping
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Form Controls
  - Checkbox
  - Accessibility
---

# Checkbox Components

## Overview

A comprehensive set of checkbox components that handle various selection scenarios, including indeterminate states and grouping. These components are built with TypeScript and follow WAI-ARIA practices.

## Components

### Base Checkbox

The foundation checkbox component with support for indeterminate state:

::: code-with-tooltips

```tsx
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Label content */
  label?: ReactNode;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Checkbox size */
  size?: 'sm' | 'md' | 'lg';
  /** Indeterminate state */
  indeterminate?: boolean;
  /** Whether the checkbox spans full width */
  isFullWidth?: boolean;
  /** Additional classes for the wrapper */
  wrapperClassName?: string;
}

export const Checkbox = forwardRef(({
  label,
  description,
  error,
  success,
  size = 'md',
  indeterminate = false,
  isFullWidth = false,
  disabled = false,
  required = false,
  className,
  wrapperClassName,
  id,
  ...props
}: CheckboxProps, ref: Ref<HTMLInputElement>) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionId = `${checkboxId}-description`;
  const errorId = `${checkboxId}-error`;
  const successId = `${checkboxId}-success`;

  const hasError = !!error;
  const hasSuccess = !!success;
  const hasDescription = !!description;

  React.useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate, ref]);

  return (
    <div
      className={clsx(
        'checkbox-wrapper',
        `checkbox-wrapper--${size}`,
        isFullWidth && 'checkbox-wrapper--full-width',
        hasError && 'checkbox-wrapper--error',
        hasSuccess && 'checkbox-wrapper--success',
        disabled && 'checkbox-wrapper--disabled',
        wrapperClassName
      )}
    >
      <label
        className="checkbox__label"
        htmlFor={checkboxId}
      >
        <span className="checkbox__input-wrapper">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            required={required}
            aria-describedby={clsx(
              hasDescription && descriptionId,
              hasError && errorId,
              hasSuccess && successId
            )}
            className={clsx(
              'checkbox__input',
              hasError && 'checkbox__input--error',
              hasSuccess && 'checkbox__input--success',
              className
            )}
            {...props}
          />
          <span
            className="checkbox__control"
            aria-hidden="true"
          >
            {indeterminate ? (
              <MinusIcon className="checkbox__icon" />
            ) : (
              <CheckIcon className="checkbox__icon" />
            )}
          </span>
        </span>

        {label && (
          <span className="checkbox__label-text">
            {label}
            {required && (
              <>
                <span aria-hidden="true" className="checkbox__required-indicator">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </>
            )}
          </span>
        )}
      </label>

      {description && (
        <span
          id={descriptionId}
          className="checkbox__description"
        >
          {description}
        </span>
      )}

      {error && (
        <span
          id={errorId}
          className="checkbox__error"
          role="alert"
        >
          {error}
        </span>
      )}

      {success && (
        <span
          id={successId}
          className="checkbox__success"
          role="status"
        >
          {success}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
```

:::

::: code-with-tooltips

```scss
.checkbox-wrapper {
  display: inline-flex;
  flex-direction: column;
  gap: 0.5rem;

  &--full-width {
    width: 100%;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .checkbox__label {
      cursor: not-allowed;
    }
  }

  // Sizes
  &--sm {
    font-size: 0.875rem;

    .checkbox__control {
      width: 16px;
      height: 16px;
    }

    .checkbox__icon {
      width: 12px;
      height: 12px;
    }
  }

  &--md {
    font-size: 1rem;

    .checkbox__control {
      width: 20px;
      height: 20px;
    }

    .checkbox__icon {
      width: 14px;
      height: 14px;
    }
  }

  &--lg {
    font-size: 1.125rem;

    .checkbox__control {
      width: 24px;
      height: 24px;
    }

    .checkbox__icon {
      width: 16px;
      height: 16px;
    }
  }
}

.checkbox__label {
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--vp-c-text-1);
}

.checkbox__input-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.checkbox__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;

  &:focus-visible + .checkbox__control {
    outline: 2px solid var(--vp-c-brand);
    outline-offset: 2px;
  }

  &:checked + .checkbox__control {
    background: var(--vp-c-brand);
    border-color: var(--vp-c-brand);

    .checkbox__icon {
      opacity: 1;
      transform: scale(1);
    }
  }

  &--error + .checkbox__control {
    border-color: var(--vp-c-danger);
  }

  &--success + .checkbox__control {
    border-color: var(--vp-c-success);
  }
}

.checkbox__control {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 4px;
  transition: all 0.2s ease;

  .checkbox__icon {
    color: white;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.2s ease;
  }
}

.checkbox__label-text {
  line-height: 1.4;
  user-select: none;
}

.checkbox__required-indicator {
  color: var(--vp-c-danger);
  margin-left: 0.25rem;
}

.checkbox__description {
  color: var(--vp-c-text-2);
  font-size: 0.875em;
  margin-left: calc(20px + 0.5rem);
}

.checkbox__error {
  color: var(--vp-c-danger);
  font-size: 0.875em;
  margin-left: calc(20px + 0.5rem);
}

.checkbox__success {
  color: var(--vp-c-success);
  font-size: 0.875em;
  margin-left: calc(20px + 0.5rem);
}

// Dark mode adjustments
.dark {
  .checkbox__control {
    background: color.adjust(colors.$purple-dark, $lightness: 5%);
  }
}
```

:::

### Checkbox Group

A component for managing multiple related checkboxes:

::: code-with-tooltips

```tsx
interface CheckboxGroupProps {
  /** Group label */
  label?: string;
  /** Selected values */
  value?: string[];
  /** Default selected values */
  defaultValue?: string[];
  /** Group options */
  options: Array<{
    value: string;
    label: ReactNode;
    description?: string;
    disabled?: boolean;
  }>;
  /** Group description */
  description?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Checkbox size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the group is disabled */
  disabled?: boolean;
  /** Whether the group is required */
  required?: boolean;
  /** Whether the group spans full width */
  isFullWidth?: boolean;
  /** Change handler */
  onChange?: (values: string[]) => void;
  /** Additional classes */
  className?: string;
}

export const CheckboxGroup = ({
  label,
  value,
  defaultValue = [],
  options,
  description,
  error,
  success,
  size = 'md',
  disabled = false,
  required = false,
  isFullWidth = false,
  onChange,
  className,
}: CheckboxGroupProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    value || defaultValue
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);

  const handleChange = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];

    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const groupId = `checkbox-group-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionId = `${groupId}-description`;
  const errorId = `${groupId}-error`;
  const successId = `${groupId}-success`;

  return (
    <div
      role="group"
      aria-labelledby={label ? groupId : undefined}
      aria-describedby={clsx(
        description && descriptionId,
        error && errorId,
        success && successId
      )}
      className={clsx(
        'checkbox-group',
        isFullWidth && 'checkbox-group--full-width',
        className
      )}
    >
      {label && (
        <div id={groupId} className="checkbox-group__label">
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="checkbox-group__required-indicator">
                *
              </span>
              <span className="sr-only">(required)</span>
            </>
          )}
        </div>
      )}

      {description && (
        <div id={descriptionId} className="checkbox-group__description">
          {description}
        </div>
      )}

      <div className="checkbox-group__options">
        {options.map(option => (
          <Checkbox
            key={option.value}
            label={option.label}
            description={option.description}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleChange(option.value)}
            disabled={disabled || option.disabled}
            size={size}
          />
        ))}
      </div>

      {error && (
        <div
          id={errorId}
          className="checkbox-group__error"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          id={successId}
          className="checkbox-group__success"
          role="status"
        >
          {success}
        </div>
      )}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &--full-width {
    width: 100%;
  }
}

.checkbox-group__label {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.checkbox-group__required-indicator {
  color: var(--vp-c-danger);
  margin-left: 0.25rem;
}

.checkbox-group__description {
  color: var(--vp-c-text-2);
  font-size: 0.875em;
}

.checkbox-group__options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-group__error {
  color: var(--vp-c-danger);
  font-size: 0.875em;
}

.checkbox-group__success {
  color: var(--vp-c-success);
  font-size: 0.875em;
}
```

:::

## Usage Examples

### Basic Checkbox

::: code-with-tooltips

```tsx
<Checkbox
  label="I agree to the terms and conditions"
  description="Please read our terms before proceeding"
/>
```

:::

### Required Checkbox with Error

::: code-with-tooltips

```tsx
<Checkbox
  label="Accept privacy policy"
  required
  error="You must accept the privacy policy"
/>
```

:::

### Checkbox Sizes

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  <Checkbox size="sm" label="Small checkbox" />
  <Checkbox size="md" label="Medium checkbox" />
  <Checkbox size="lg" label="Large checkbox" />
</div>
```

:::

### Indeterminate State

::: code-with-tooltips

```tsx
<Checkbox
  label="Select all"
  indeterminate
  description="Some items are selected"
/>
```

:::

### Checkbox Group Example

::: code-with-tooltips

```tsx
<CheckboxGroup
  label="Select your interests"
  description="Choose all that apply"
  options={[
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
  ]}
  onChange={values => console.log('Selected:', values)}
/>
```

:::

### Nested Checkboxes

::: code-with-tooltips

```tsx
const NestedCheckboxes = () => {
  const [parentChecked, setParentChecked] = useState(false);
  const [parentIndeterminate, setParentIndeterminate] = useState(false);
  const [childrenChecked, setChildrenChecked] = useState({
    child1: false,
    child2: false,
    child3: false,
  });

  useEffect(() => {
    const checkedCount = Object.values(childrenChecked).filter(Boolean).length;
    setParentIndeterminate(checkedCount > 0 && checkedCount < 3);
    setParentChecked(checkedCount === 3);
  }, [childrenChecked]);

  const handleParentChange = () => {
    const newValue = !parentChecked;
    setParentChecked(newValue);
    setParentIndeterminate(false);
    setChildrenChecked({
      child1: newValue,
      child2: newValue,
      child3: newValue,
    });
  };

  const handleChildChange = (key: keyof typeof childrenChecked) => {
    setChildrenChecked(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="nested-checkboxes">
      <Checkbox
        label="Select all permissions"
        checked={parentChecked}
        indeterminate={parentIndeterminate}
        onChange={handleParentChange}
      />
      <div className="nested-checkboxes__children">
        <Checkbox
          label="Read permission"
          checked={childrenChecked.child1}
          onChange={() => handleChildChange('child1')}
        />
        <Checkbox
          label="Write permission"
          checked={childrenChecked.child2}
          onChange={() => handleChildChange('child2')}
        />
        <Checkbox
          label="Execute permission"
          checked={childrenChecked.child3}
          onChange={() => handleChildChange('child3')}
        />
      </div>
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.nested-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__children {
    margin-left: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

:::

## Best Practices

### 1. Accessibility

- Use proper ARIA attributes
- Support keyboard navigation
- Provide clear labels
- Handle focus management
- Use semantic HTML

### 2. User Experience

- Clear visual feedback
- Consistent spacing
- Logical grouping
- Error handling
- Loading states

### 3. Performance

- Optimize re-renders
- Handle large groups
- Manage state efficiently
- Debounce changes
- Cache results

### 4. Maintainability

- Type all props
- Document components
- Write unit tests
- Handle edge cases
- Follow conventions

### 5. Composition

The Checkbox components can be composed with other form controls:

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
<FormField label="Permissions" required error="Please select at least one permission">
  <CheckboxGroup
    options={[
      { value: 'read', label: 'Read' },
      { value: 'write', label: 'Write' },
      { value: 'execute', label: 'Execute' },
    ]}
  />
</FormField>
```

:::
