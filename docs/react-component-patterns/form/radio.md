---
title: Radio Components
description: Radio button components for React applications with group functionality and customizable styles
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Form Controls
  - Radio
  - Design System
  - Accessibility
---

# Radio Components

## Overview

Our radio components provide accessible and customizable radio button controls. They support grouping, custom styles, and keyboard navigation.

## Components

### Radio Group

The container component for managing radio button state:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface RadioGroupProps {
  /** Group label */
  label: string;
  /** Selected value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Radio options */
  children: React.ReactNode;
  /** Whether the group is disabled */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Description for screen readers */
  description?: string;
  /** Name for the radio group */
  name?: string;
  /** Additional CSS classes */
  className?: string;
}

export const RadioGroup = ({
  label,
  value,
  onChange,
  children,
  disabled = false,
  error,
  description,
  name: providedName,
  className,
  ...props
}: RadioGroupProps) => {
  const groupId = React.useId();
  const name = providedName || groupId;
  const descriptionId = description ? `${groupId}-description` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;

  return (
    <fieldset
      className={clsx(
        'radio-group',
        disabled && 'radio-group--disabled',
        error && 'radio-group--error',
        className
      )}
      disabled={disabled}
      aria-describedby={clsx(descriptionId, errorId)}
      {...props}
    >
      <legend className="radio-group__label">
        {label}
      </legend>

      {description && (
        <div
          id={descriptionId}
          className="radio-group__description"
        >
          {description}
        </div>
      )}

      <div className="radio-group__options" role="radiogroup">
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) return null;

          return React.cloneElement(child, {
            name,
            checked: child.props.value === value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              onChange?.(e.target.value);
            },
            disabled: disabled || child.props.disabled,
            'aria-describedby': clsx(descriptionId, errorId),
          });
        })}
      </div>

      {error && (
        <div
          id={errorId}
          className="radio-group__error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </fieldset>
  );
};
```

:::

::: code-with-tooltips

```scss
.radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);

  &__label {
    color: var(--vp-c-text-1);
    font-weight: 500;
    font-size: 0.875rem;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  &__error {
    color: var(--color-error);
    font-size: 0.875rem;
  }

  // States
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .radio-group__label {
      color: var(--vp-c-text-2);
    }
  }

  &--error {
    .radio__input {
      border-color: var(--color-error);

      &:focus {
        box-shadow: 0 0 0 2px color.adjust(colors.$error, $alpha: -0.8);
      }
    }
  }
}
```

:::

### Radio

The individual radio button component:

::: code-with-tooltips

```tsx
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Radio label */
  label: string;
  /** Description text */
  description?: string;
  /** Whether the radio is checked */
  checked?: boolean;
  /** Whether the radio is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const Radio = ({
  label,
  description,
  checked,
  disabled,
  className,
  ...props
}: RadioProps) => {
  const id = React.useId();
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <label
      htmlFor={id}
      className={clsx(
        'radio',
        checked && 'radio--checked',
        disabled && 'radio--disabled',
        className
      )}
    >
      <input
        id={id}
        type="radio"
        checked={checked}
        disabled={disabled}
        className="radio__input"
        aria-describedby={descriptionId}
        {...props}
      />

      <div className="radio__control" aria-hidden="true">
        <div className="radio__indicator" />
      </div>

      <div className="radio__content">
        <div className="radio__label">{label}</div>
        {description && (
          <div
            id={descriptionId}
            className="radio__description"
          >
            {description}
          </div>
        )}
      </div>
    </label>
  );
};
```

:::

::: code-with-tooltips

```scss
.radio {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover:not(&--disabled) {
    background-color: var(--vp-c-bg-soft);

    .radio__control {
      border-color: var(--vp-c-brand);
    }
  }

  // Input
  &__input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;

    &:focus-visible + .radio__control {
      box-shadow: 0 0 0 2px color.adjust(colors.$purple-brand, $alpha: -0.8);
    }
  }

  // Control
  &__control {
    position: relative;
    width: 20px;
    height: 20px;
    border: 2px solid var(--vp-c-divider);
    border-radius: 50%;
    transition: all 0.2s ease;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--vp-c-brand);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s ease;
  }

  // Content
  &__content {
    flex: 1;
  }

  &__label {
    color: var(--vp-c-text-1);
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__description {
    color: var(--vp-c-text-2);
    font-size: 0.875rem;
    margin-top: var(--spacing-1);
  }

  // States
  &--checked {
    .radio__control {
      border-color: var(--vp-c-brand);
    }

    .radio__indicator {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .radio__control {
      background-color: var(--vp-c-bg-soft);
    }
  }
}
```

:::

## Usage Examples

### Basic Radio Group

::: code-with-tooltips

```tsx
const [value, setValue] = React.useState('option1');

return (
  <RadioGroup
    label="Select an option"
    value={value}
    onChange={setValue}
  >
    <Radio
      value="option1"
      label="Option 1"
    />
    <Radio
      value="option2"
      label="Option 2"
    />
    <Radio
      value="option3"
      label="Option 3"
    />
  </RadioGroup>
);
```

:::

### With Descriptions

::: code-with-tooltips

```tsx
<RadioGroup label="Notification preferences">
  <Radio
    value="all"
    label="All notifications"
    description="Receive notifications for all activity"
  />
  <Radio
    value="important"
    label="Important only"
    description="Only receive notifications for important updates"
  />
  <Radio
    value="none"
    label="None"
    description="Turn off all notifications"
  />
</RadioGroup>
```

:::

### Disabled State

::: code-with-tooltips

```tsx
<RadioGroup label="Subscription plan">
  <Radio
    value="free"
    label="Free plan"
    description="Limited features"
  />
  <Radio
    value="pro"
    label="Pro plan"
    description="Full access to all features"
    disabled
  />
  <Radio
    value="enterprise"
    label="Enterprise"
    description="Custom solutions for large teams"
    disabled
  />
</RadioGroup>
```

:::

### With Error

::: code-with-tooltips

```tsx
<RadioGroup
  label="Required selection"
  error="Please select an option"
>
  <Radio
    value="yes"
    label="Yes"
  />
  <Radio
    value="no"
    label="No"
  />
</RadioGroup>
```

:::

### Horizontal Layout

::: code-with-tooltips

```tsx
<RadioGroup
  label="Alignment"
  className="radio-group--horizontal"
>
  <Radio value="left" label="Left" />
  <Radio value="center" label="Center" />
  <Radio value="right" label="Right" />
</RadioGroup>

<style>
  .radio-group--horizontal .radio-group__options {
    flex-direction: row;
    gap: var(--spacing-4);
  }
</style>
```

:::

## Best Practices

### 1. Accessibility

- Use proper ARIA attributes
- Support keyboard navigation
- Maintain focus states
- Provide clear labels
- Handle screen readers

### 2. UX Guidelines

- Clear visual feedback
- Sufficient touch targets
- Logical grouping
- Descriptive labels
- Error handling

### 3. Performance

- Minimize re-renders
- Use efficient selectors
- Cache calculations
- Handle large groups
- Optimize transitions

### 4. Implementation

Example of using radio in forms:

::: code-with-tooltips

```tsx
// Form with radio groups
const PaymentForm = () => {
  const [paymentType, setPaymentType] = React.useState('');
  const [billingCycle, setBillingCycle] = React.useState('');

  return (
    <form className="payment-form">
      <RadioGroup
        label="Payment method"
        value={paymentType}
        onChange={setPaymentType}
      >
        <Radio
          value="credit"
          label="Credit card"
          description="Pay with Visa, Mastercard, or American Express"
        />
        <Radio
          value="debit"
          label="Debit card"
          description="Pay directly from your bank account"
        />
        <Radio
          value="paypal"
          label="PayPal"
          description="Pay using your PayPal account"
        />
      </RadioGroup>

      <RadioGroup
        label="Billing cycle"
        value={billingCycle}
        onChange={setBillingCycle}
      >
        <Radio
          value="monthly"
          label="Monthly"
          description="$10/month"
        />
        <Radio
          value="annual"
          label="Annual"
          description="$100/year (Save 17%)"
        />
      </RadioGroup>

      <button type="submit">
        Continue
      </button>
    </form>
  );
};
```

:::

### 5. Customization

Example of extending radio styles:

::: code-with-tooltips

```scss
// Custom radio variants
.radio-group {
  // Card style
  &--card {
    .radio {
      border: 1px solid var(--vp-c-divider);
      border-radius: 12px;
      padding: var(--spacing-4);

      &:hover:not(.radio--disabled) {
        border-color: var(--vp-c-brand);
      }

      &--checked {
        border-color: var(--vp-c-brand);
        background-color: color.adjust(colors.$purple-brand, $alpha: -0.9);
      }
    }
  }

  // Image selection
  &--image {
    .radio {
      flex-direction: column;
      align-items: center;
      text-align: center;

      &__control {
        margin-top: var(--spacing-4);
      }

      &__image {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
      }
    }
  }
}

// Custom radio sizes
.radio {
  &--sm {
    .radio__control {
      width: 16px;
      height: 16px;
    }

    .radio__indicator {
      width: 8px;
      height: 8px;
    }

    .radio__label {
      font-size: 0.8125rem;
    }
  }

  &--lg {
    .radio__control {
      width: 24px;
      height: 24px;
    }

    .radio__indicator {
      width: 12px;
      height: 12px;
    }

    .radio__label {
      font-size: 1rem;
    }
  }
}
```

:::
