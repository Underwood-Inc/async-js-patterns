---
title: Select Components
description: Flexible and accessible select components for React applications with support for single and multiple selection
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Form Controls
  - Select
  - Dropdown
  - Accessibility
---

# Select Components

## Overview

A comprehensive set of select components that handle both single and multiple selection scenarios. These components are built with TypeScript, support keyboard navigation, and follow WAI-ARIA practices.

## Components

### Base Select

The foundation select component with support for single selection:

::: code-with-tooltips

```tsx
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import type { ReactNode, Ref } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  /** Select options */
  options: SelectOption[];
  /** Selected value */
  value?: string;
  /** Default value */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Select label */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Select size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the select is required */
  required?: boolean;
  /** Whether the select spans full width */
  isFullWidth?: boolean;
  /** Left icon */
  leftIcon?: ReactNode;
  /** Custom classes for the wrapper */
  wrapperClassName?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Focus handler */
  onFocus?: () => void;
  /** Blur handler */
  onBlur?: () => void;
}

export const Select = forwardRef(({
  options,
  value,
  defaultValue,
  placeholder = 'Select an option',
  label,
  helperText,
  error,
  success,
  size = 'md',
  disabled = false,
  required = false,
  isFullWidth = false,
  leftIcon,
  wrapperClassName,
  onChange,
  onFocus,
  onBlur,
}: SelectProps, ref: Ref<HTMLDivElement>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(opt => opt.value === selectedValue);
  const hasError = !!error;
  const hasSuccess = !!success;

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : prev
          );
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          const option = options[highlightedIndex];
          if (!option.disabled) {
            handleSelect(option.value);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onChange?.(value);
  };

  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
  const labelId = `${selectId}-label`;
  const listboxId = `${selectId}-listbox`;

  return (
    <div
      ref={selectRef}
      className={clsx(
        'select-wrapper',
        `select-wrapper--${size}`,
        isFullWidth && 'select-wrapper--full-width',
        hasError && 'select-wrapper--error',
        hasSuccess && 'select-wrapper--success',
        disabled && 'select-wrapper--disabled',
        wrapperClassName
      )}
    >
      {label && (
        <label
          id={labelId}
          className="select__label"
        >
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="select__required-indicator">
                *
              </span>
              <span className="sr-only">(required)</span>
            </>
          )}
        </label>
      )}

      <div
        ref={ref}
        className="select__control"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={labelId}
        aria-required={required}
        aria-invalid={hasError}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {leftIcon && (
          <span className="select__icon select__icon--left">
            {leftIcon}
          </span>
        )}

        <span className="select__value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <span className="select__icon select__icon--right">
          <ChevronDownIcon />
        </span>
      </div>

      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          className="select__options"
          aria-labelledby={labelId}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              className={clsx(
                'select__option',
                option.disabled && 'select__option--disabled',
                option.value === selectedValue && 'select__option--selected',
                index === highlightedIndex && 'select__option--highlighted'
              )}
              aria-selected={option.value === selectedValue}
              aria-disabled={option.disabled}
              onClick={() => !option.disabled && handleSelect(option.value)}
            >
              {option.label}
              {option.value === selectedValue && (
                <span className="select__check">
                  <CheckIcon />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {helperText && (
        <span className="select__helper-text">
          {helperText}
        </span>
      )}

      {error && (
        <span
          className="select__error"
          role="alert"
        >
          {error}
        </span>
      )}

      {success && (
        <span
          className="select__success"
          role="status"
        >
          {success}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
```

:::

::: code-with-tooltips

```scss
.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

  &--full-width {
    width: 100%;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .select__control {
      pointer-events: none;
    }
  }

  // Sizes
  &--sm {
    font-size: 0.875rem;

    .select__control {
      height: 32px;
      padding: 0 0.75rem;
    }

    .select__option {
      padding: 0.5rem 0.75rem;
    }
  }

  &--md {
    font-size: 1rem;

    .select__control {
      height: 40px;
      padding: 0 1rem;
    }

    .select__option {
      padding: 0.625rem 1rem;
    }
  }

  &--lg {
    font-size: 1.125rem;

    .select__control {
      height: 48px;
      padding: 0 1.25rem;
    }

    .select__option {
      padding: 0.75rem 1.25rem;
    }
  }
}

.select__label {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.select__required-indicator {
  color: var(--vp-c-danger);
  margin-left: 0.25rem;
}

.select__control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--vp-c-brand);
  }

  &:focus {
    outline: none;
    border-color: var(--vp-c-brand);
    box-shadow: 0 0 0 3px color.adjust(colors.$purple-brand, $alpha: -0.8);
  }
}

.select__value {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--vp-c-text-1);

  &:empty::before {
    content: attr(data-placeholder);
    color: var(--vp-c-text-3);
  }
}

.select__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  color: var(--vp-c-text-2);

  svg {
    width: 100%;
    height: 100%;
  }

  &--right {
    transition: transform 0.2s ease;
    [aria-expanded="true"] & {
      transform: rotate(180deg);
    }
  }
}

.select__options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 0.5rem 0 0;
  padding: 0.5rem 0;
  list-style: none;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(.select__option--disabled) {
    background: color.adjust(colors.$purple-brand, $alpha: -0.9);
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--selected {
    background: color.adjust(colors.$purple-brand, $alpha: -0.8);
    color: var(--vp-c-brand);
    font-weight: 500;
  }

  &--highlighted {
    background: color.adjust(colors.$purple-brand, $alpha: -0.85);
  }
}

.select__check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  color: var(--vp-c-brand);
}

.select__helper-text {
  color: var(--vp-c-text-2);
  font-size: 0.875em;
}

.select__error {
  color: var(--vp-c-danger);
  font-size: 0.875em;
}

.select__success {
  color: var(--vp-c-success);
  font-size: 0.875em;
}

// Dark mode adjustments
.dark {
  .select__control {
    background: color.adjust(colors.$purple-dark, $lightness: 5%);
  }

  .select__options {
    background: color.adjust(colors.$purple-dark, $lightness: 5%);
    border-color: var(--vp-c-divider);
  }

  .select__option {
    &:hover:not(.select__option--disabled) {
      background: color.adjust(colors.$purple-dark, $lightness: 10%);
    }

    &--selected {
      background: color.adjust(colors.$purple-dark, $lightness: 8%);
    }

    &--highlighted {
      background: color.adjust(colors.$purple-dark, $lightness: 12%);
    }
  }
}
```

:::

### MultiSelect Component

A select component that supports multiple selection:

::: code-with-tooltips

```tsx
interface MultiSelectProps extends Omit<SelectProps, 'value' | 'defaultValue' | 'onChange'> {
  /** Selected values */
  value?: string[];
  /** Default values */
  defaultValue?: string[];
  /** Change handler */
  onChange?: (values: string[]) => void;
  /** Maximum number of selections allowed */
  maxSelections?: number;
}

export const MultiSelect = forwardRef(({
  value,
  defaultValue = [],
  maxSelections,
  onChange,
  ...props
}: MultiSelectProps, ref: Ref<HTMLDivElement>) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(value || defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);

  const handleSelect = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : maxSelections && selectedValues.length >= maxSelections
        ? selectedValues
        : [...selectedValues, optionValue];

    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const selectedLabels = props.options
    .filter(opt => selectedValues.includes(opt.value))
    .map(opt => opt.label)
    .join(', ');

  return (
    <Select
      {...props}
      ref={ref}
      value={undefined}
      selectedDisplay={selectedLabels || props.placeholder}
      onOptionSelect={handleSelect}
      isMulti
      selectedValues={selectedValues}
    />
  );
});

MultiSelect.displayName = 'MultiSelect';
```

:::

## Usage Examples

### Basic Select

::: code-with-tooltips

```tsx
<Select
  label="Country"
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
  ]}
/>
```

:::

### Required Select with Validation

::: code-with-tooltips

```tsx
<Select
  label="Category"
  required
  error="Please select a category"
  options={[
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
  ]}
/>
```

:::

### Select with Icon

::: code-with-tooltips

```tsx
<Select
  label="Sort by"
  leftIcon={<SortIcon />}
  options={[
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' },
    { value: 'price', label: 'Price' },
  ]}
/>
```

:::

### Select Sizes

::: code-with-tooltips

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  <Select
    size="sm"
    placeholder="Small select"
    options={[
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]}
  />
  <Select
    size="md"
    placeholder="Medium select"
    options={[
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]}
  />
  <Select
    size="lg"
    placeholder="Large select"
    options={[
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]}
  />
</div>
```

:::

### MultiSelect Example

::: code-with-tooltips

```tsx
<MultiSelect
  label="Skills"
  placeholder="Select skills"
  maxSelections={3}
  helperText="Select up to 3 skills"
  options={[
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'node', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
  ]}
/>
```

:::

### Disabled Options

::: code-with-tooltips

```tsx
<Select
  label="Plan"
  options={[
    { value: 'free', label: 'Free Plan' },
    { value: 'pro', label: 'Pro Plan' },
    { value: 'enterprise', label: 'Enterprise Plan', disabled: true },
  ]}
  helperText="Some plans may be unavailable"
/>
```

:::

## Best Practices

### 1. Accessibility

- Use proper ARIA attributes
- Support keyboard navigation
- Provide clear labels
- Handle focus management
- Announce selection changes

### 2. User Experience

- Show clear selection state
- Provide visual feedback
- Handle loading states
- Support search/filtering
- Clear error messages

### 3. Performance

- Virtualize long lists
- Optimize re-renders
- Handle large datasets
- Cache option data
- Debounce search

### 4. Maintainability

- Type all props
- Document components
- Write unit tests
- Handle edge cases
- Follow conventions

### 5. Composition

The Select components can be composed with other form controls:

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
<FormField label="Category" required error="Please select a category">
  <Select
    options={[
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]}
  />
</FormField>
```

:::
