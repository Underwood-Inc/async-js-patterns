---
title: Switch Components
description: Toggle switch components for React applications with smooth animations and customizable styles
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Form Controls
  - Switch
  - Design System
  - Accessibility
---

# Switch Components

## Overview

Our switch components provide an intuitive way to toggle between two states. They feature smooth animations, accessible controls, and customizable styles.

## Components

### Switch

The base switch component with toggle functionality:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface SwitchProps {
  /** Switch label */
  label: string;
  /** Whether the switch is checked */
  checked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Description text */
  description?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  color?: 'brand' | 'success' | 'warning' | 'error';
  /** Name for the input */
  name?: string;
  /** Value for the input */
  value?: string;
  /** Additional CSS classes */
  className?: string;
}

export const Switch = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  description,
  size = 'md',
  color = 'brand',
  name,
  value,
  className,
  ...props
}: SwitchProps) => {
  const id = React.useId();
  const descriptionId = description ? `${id}-description` : undefined;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <div
      className={clsx(
        'switch',
        `switch--${size}`,
        `switch--${color}`,
        checked && 'switch--checked',
        disabled && 'switch--disabled',
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="switch__input"
        aria-checked={checked}
        aria-describedby={descriptionId}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
        {...props}
      />

      <label
        htmlFor={id}
        className="switch__label"
      >
        <span className="switch__text">{label}</span>
        <div className="switch__control" aria-hidden="true">
          <div className="switch__track" />
          <div className="switch__thumb" />
        </div>
      </label>

      {description && (
        <div
          id={descriptionId}
          className="switch__description"
        >
          {description}
        </div>
      )}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.switch {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover:not(&--disabled) {
    background-color: var(--vp-c-bg-soft);

    .switch__track {
      background-color: color.adjust(colors.$purple-brand, $alpha: -0.8);
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

    &:focus-visible + .switch__control {
      box-shadow: 0 0 0 2px color.adjust(colors.$purple-brand, $alpha: -0.8);
    }
  }

  // Control
  &__control {
    position: relative;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__track {
    width: 36px;
    height: 20px;
    background-color: var(--vp-c-divider);
    border-radius: 10px;
    transition: all 0.2s ease;
  }

  &__thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
    .switch__track {
      background-color: var(--vp-c-brand);
    }

    .switch__thumb {
      transform: translateX(16px);
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .switch__track {
      background-color: var(--vp-c-divider);
    }
  }

  // Sizes
  &--sm {
    .switch__track {
      width: 28px;
      height: 16px;
    }

    .switch__thumb {
      width: 12px;
      height: 12px;
    }

    &.switch--checked .switch__thumb {
      transform: translateX(12px);
    }
  }

  &--lg {
    .switch__track {
      width: 48px;
      height: 24px;
    }

    .switch__thumb {
      width: 20px;
      height: 20px;
    }

    &.switch--checked .switch__thumb {
      transform: translateX(24px);
    }
  }

  // Colors
  &--success {
    &.switch--checked .switch__track {
      background-color: var(--color-success);
    }

    &:hover:not(&--disabled) .switch__track {
      background-color: color.adjust(colors.$success, $alpha: -0.8);
    }
  }

  &--warning {
    &.switch--checked .switch__track {
      background-color: var(--color-warning);
    }

    &:hover:not(&--disabled) .switch__track {
      background-color: color.adjust(colors.$warning, $alpha: -0.8);
    }
  }

  &--error {
    &.switch--checked .switch__track {
      background-color: var(--color-error);
    }

    &:hover:not(&--disabled) .switch__track {
      background-color: color.adjust(colors.$error, $alpha: -0.8);
    }
  }
}
```

:::

## Usage Examples

### Basic Switch

::: code-with-tooltips

```tsx
const [enabled, setEnabled] = React.useState(false);

return (
  <Switch
    label="Notifications"
    checked={enabled}
    onChange={setEnabled}
  />
);
```

:::

### With Description

::: code-with-tooltips

```tsx
<Switch
  label="Airplane mode"
  description="Disable all wireless connections"
/>
```

:::

### Different Sizes

::: code-with-tooltips

```tsx
<div className="flex flex-col gap-4">
  <Switch
    size="sm"
    label="Small switch"
  />
  <Switch
    size="md"
    label="Medium switch"
  />
  <Switch
    size="lg"
    label="Large switch"
  />
</div>
```

:::

### Color Variants

::: code-with-tooltips

```tsx
<div className="flex flex-col gap-4">
  <Switch
    color="brand"
    label="Brand color"
    checked
  />
  <Switch
    color="success"
    label="Success color"
    checked
  />
  <Switch
    color="warning"
    label="Warning color"
    checked
  />
  <Switch
    color="error"
    label="Error color"
    checked
  />
</div>
```

:::

### Disabled State

::: code-with-tooltips

```tsx
<div className="flex flex-col gap-4">
  <Switch
    label="Disabled unchecked"
    disabled
  />
  <Switch
    label="Disabled checked"
    checked
    disabled
  />
</div>
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
- Smooth animations
- Instant response
- Logical grouping
- Error handling

### 3. Performance

- Optimize animations
- Minimize re-renders
- Use efficient selectors
- Cache calculations
- Handle transitions

### 4. Implementation

Example of using switches in forms:

::: code-with-tooltips

```tsx
// Settings form example
const SettingsForm = () => {
  const [settings, setSettings] = React.useState({
    notifications: true,
    marketing: false,
    darkMode: false,
    autoUpdate: true,
  });

  const handleChange = (key: keyof typeof settings) => (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: checked,
    }));
  };

  return (
    <form className="settings-form">
      <div className="space-y-6">
        <Switch
          label="Push notifications"
          description="Receive notifications when someone mentions you"
          checked={settings.notifications}
          onChange={handleChange('notifications')}
        />

        <Switch
          label="Marketing emails"
          description="Receive emails about new features and special offers"
          checked={settings.marketing}
          onChange={handleChange('marketing')}
        />

        <Switch
          label="Dark mode"
          description="Use dark theme across the application"
          checked={settings.darkMode}
          onChange={handleChange('darkMode')}
        />

        <Switch
          label="Auto updates"
          description="Automatically install updates when available"
          checked={settings.autoUpdate}
          onChange={handleChange('autoUpdate')}
        />
      </div>

      <div className="mt-8">
        <button type="submit">
          Save changes
        </button>
      </div>
    </form>
  );
};
```

:::

### 5. Customization

Example of extending switch styles:

::: code-with-tooltips

```scss
// Custom switch variants
.switch {
  // Card style
  &--card {
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    padding: var(--spacing-4);

    &:hover:not(.switch--disabled) {
      border-color: var(--vp-c-brand);
    }

    &.switch--checked {
      border-color: var(--vp-c-brand);
      background-color: color.adjust(colors.$purple-brand, $alpha: -0.9);
    }
  }

  // Icon support
  &--icon {
    .switch__thumb {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--vp-c-text-2);

      &::before {
        font-size: 12px;
      }
    }

    &.switch--checked .switch__thumb {
      color: var(--vp-c-brand);
    }
  }

  // Reverse layout
  &--reverse {
    flex-direction: row-reverse;

    .switch__content {
      text-align: right;
    }
  }
}

// Custom animations
@keyframes switchThumb {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.switch {
  &--animate {
    .switch__thumb {
      animation: switchThumb 0.2s ease;
    }
  }
}
```

:::
