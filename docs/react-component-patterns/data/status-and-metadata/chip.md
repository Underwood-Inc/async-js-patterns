---
title: Chip Component
description: Interactive component for displaying filters, selections, and input tokens
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Chip
  - Filter
  - React
---

# Chip Component

## Overview

The Chip component provides an interactive way to display filters, selections, and input tokens. It supports various states, actions, and customization options.

## Usage

### Basic Chip

::: code-with-tooltips

```tsx
import { Chip } from '@/components/data';

<Chip>Basic</Chip>
<Chip onDelete={() => console.log('deleted')}>Deletable</Chip>
<Chip disabled>Disabled</Chip>
```

:::

### API Reference

```tsx
interface ChipProps {
  /** Chip content */
  children: React.ReactNode;
  /** Whether chip is disabled */
  disabled?: boolean;
  /** Whether chip is selected */
  selected?: boolean;
  /** Chip variant */
  variant?: 'filled' | 'outlined';
  /** Chip color */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  /** Chip size */
  size?: 'sm' | 'md' | 'lg';
  /** Leading icon */
  icon?: React.ReactNode;
  /** Avatar component */
  avatar?: React.ReactNode;
  /** Delete handler */
  onDelete?: (e: React.MouseEvent) => void;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Additional CSS class */
  className?: string;
}

interface ChipGroupProps {
  /** Chip elements */
  children: React.ReactNode;
  /** Space between chips */
  spacing?: SpacingValue;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Avatar and Icon

::: code-with-tooltips

```tsx
<Chip
  avatar={<Avatar src="/user.jpg" />}
  icon={<Icon name="verified" />}
>
  John Doe
</Chip>

<Chip
  avatar={<Avatar>JD</Avatar>}
  onDelete={() => handleDelete()}
>
  Jane Doe
</Chip>
```

:::

#### Filter Chips

::: code-with-tooltips

```tsx
const [selected, setSelected] = useState<string[]>([]);

<ChipGroup>
  {filters.map(filter => (
    <Chip
      key={filter.id}
      selected={selected.includes(filter.id)}
      onClick={() => toggleFilter(filter.id)}
    >
      {filter.label}
    </Chip>
  ))}
</ChipGroup>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(({
  children,
  disabled = false,
  selected = false,
  variant = 'filled',
  color = 'default',
  size = 'md',
  icon,
  avatar,
  onDelete,
  onClick,
  className,
  ...props
}, ref) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onDelete?.(e);
    }
  };
  
  return (
    <div
      ref={ref}
      className={clsx(
        'chip',
        `chip--${variant}`,
        `chip--${color}`,
        `chip--${size}`,
        {
          'chip--disabled': disabled,
          'chip--selected': selected,
          'chip--clickable': !!onClick,
          'chip--deletable': !!onDelete
        },
        className
      )}
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={disabled ? undefined : onClick ? 0 : undefined}
      {...props}
    >
      {avatar && (
        <span className="chip__avatar">{avatar}</span>
      )}
      {icon && (
        <span className="chip__icon">{icon}</span>
      )}
      <span className="chip__label">{children}</span>
      {onDelete && (
        <button
          className="chip__delete"
          onClick={handleDelete}
          disabled={disabled}
          aria-label="Remove"
        >
          <Icon name="close" />
        </button>
      )}
    </div>
  );
});

Chip.Group = function ChipGroup({
  children,
  spacing = 'sm',
  className,
  ...props
}: ChipGroupProps) {
  return (
    <div
      className={clsx('chip-group', className)}
      style={{ gap: `var(--spacing-${spacing})` }}
      {...props}
    >
      {children}
    </div>
  );
};
```

:::

## Styling

### Base Styles

::: code-with-tooltips

```scss
.chip {
  display: inline-flex;
  align-items: center;
  height: var(--chip-height);
  padding: 0 var(--chip-padding);
  border-radius: var(--chip-border-radius);
  font-size: var(--chip-font-size);
  transition: all 0.2s;
  user-select: none;
  
  // Content layout
  &__avatar {
    margin-right: var(--spacing-xs);
    
    img {
      width: var(--chip-avatar-size);
      height: var(--chip-avatar-size);
      border-radius: 50%;
    }
  }
  
  &__icon {
    margin-right: var(--spacing-xs);
    display: inline-flex;
    align-items: center;
  }
  
  &__label {
    margin: 0 var(--spacing-xs);
  }
  
  &__delete {
    margin-left: var(--spacing-xs);
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  // Size variations
  &--sm {
    --chip-height: 24px;
    --chip-padding: 8px;
    --chip-font-size: 12px;
    --chip-avatar-size: 16px;
  }
  
  &--md {
    --chip-height: 32px;
    --chip-padding: 12px;
    --chip-font-size: 14px;
    --chip-avatar-size: 24px;
  }
  
  &--lg {
    --chip-height: 40px;
    --chip-padding: 16px;
    --chip-font-size: 16px;
    --chip-avatar-size: 32px;
  }
  
  // Variant styles
  &--filled {
    background: var(--chip-bg-color);
    color: var(--chip-text-color);
    
    &.chip--selected {
      background: var(--chip-selected-bg-color);
      color: var(--chip-selected-text-color);
    }
  }
  
  &--outlined {
    background: transparent;
    border: 1px solid var(--chip-border-color);
    color: var(--chip-text-color);
    
    &.chip--selected {
      background: var(--chip-selected-bg-color);
      border-color: var(--chip-selected-border-color);
      color: var(--chip-selected-text-color);
    }
  }
  
  // Color variations
  &--default {
    --chip-bg-color: var(--surface-background-alt);
    --chip-text-color: var(--text-primary);
    --chip-border-color: var(--border-color);
  }
  
  &--primary {
    --chip-bg-color: var(--primary-color-light);
    --chip-text-color: var(--primary-color);
    --chip-border-color: var(--primary-color);
  }
  
  // State modifiers
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  &--clickable:not(&--disabled) {
    cursor: pointer;
    
    &:hover {
      filter: brightness(0.95);
    }
    
    &:active {
      filter: brightness(0.9);
    }
  }
}

// Chip group styles
.chip-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders content correctly', () => {
    render(<Chip>Test Chip</Chip>);
    expect(screen.getByText('Test Chip')).toBeInTheDocument();
  });

  it('handles delete event', () => {
    const handleDelete = jest.fn();
    render(<Chip onDelete={handleDelete}>Deletable</Chip>);
    
    fireEvent.click(screen.getByLabelText('Remove'));
    expect(handleDelete).toHaveBeenCalled();
  });

  it('handles click event', () => {
    const handleClick = jest.fn();
    render(<Chip onClick={handleClick}>Clickable</Chip>);
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('respects disabled state', () => {
    const handleClick = jest.fn();
    const handleDelete = jest.fn();
    
    render(
      <Chip
        disabled
        onClick={handleClick}
        onDelete={handleDelete}
      >
        Disabled
      </Chip>
    );
    
    fireEvent.click(screen.getByText('Disabled'));
    fireEvent.click(screen.getByLabelText('Remove'));
    
    expect(handleClick).not.toHaveBeenCalled();
    expect(handleDelete).not.toHaveBeenCalled();
  });

  it('renders avatar and icon', () => {
    render(
      <Chip
        avatar={<div data-testid="avatar" />}
        icon={<div data-testid="icon" />}
      >
        With Avatar & Icon
      </Chip>
    );
    
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

describe('Chip.Group', () => {
  it('renders multiple chips with correct spacing', () => {
    const { container } = render(
      <Chip.Group spacing="md">
        <Chip>Chip 1</Chip>
        <Chip>Chip 2</Chip>
      </Chip.Group>
    );
    
    expect(container.firstChild).toHaveStyle({
      gap: 'var(--spacing-md)'
    });
  });
});
```

:::

## Accessibility

### Keyboard Navigation

::: code-with-tooltips

```tsx
const Chip = React.forwardRef<HTMLDivElement, ChipProps>(({
  onClick,
  onDelete,
  disabled,
  ...props
}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onClick?.(e as any);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        onDelete?.(e as any);
        break;
    }
  };
  
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={disabled ? undefined : 0}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
      {...props}
    />
  );
});
```

:::

## Best Practices

### Usage Guidelines

::: code-with-tooltips

```tsx
// DO: Use consistent sizes within groups
<ChipGroup>
  <Chip size="md">Filter 1</Chip>
  <Chip size="md">Filter 2</Chip>
</ChipGroup>

// DON'T: Mix variants in the same group
<ChipGroup>
  <Chip variant="filled">One</Chip>
  <Chip variant="outlined">Two</Chip> {/* Inconsistent! */}
</ChipGroup>

// DO: Use appropriate colors for state
<Chip color="success" selected>
  Active Filter
</Chip>

// DON'T: Overload with multiple interactions
<Chip
  onClick={handleClick}
  onDelete={handleDelete} // Could be confusing
  selected
>
  Too Many Actions
</Chip>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize handlers
const FilterChip = memo(({ id, onToggle }) => (
  <Chip
    onClick={useCallback(() => onToggle(id), [id, onToggle])}
    selected={selected.includes(id)}
  >
    {id}
  </Chip>
));

// DON'T: Create handlers inline
<Chip
  onDelete={() => handleDelete(id)} // Creates new function every render
>
  {label}
</Chip>
```

:::
