---
title: Tag Component
description: Component for displaying metadata, categories, and labels with optional interactivity
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Tag
  - Label
  - React
---

# Tag Component

## Overview

The Tag component is used to display metadata, categories, and labels. It supports various styles, colors, and optional interactivity like removal and clicking.

## Usage

### Basic Tag

::: code-with-tooltips

```tsx
import { Tag } from '@/components/data';

<Tag>Default</Tag>
<Tag color="primary">Primary</Tag>
<Tag closable onClose={() => console.log('closed')}>Closable</Tag>
```

:::

### API Reference

```tsx
interface TagProps {
  /** Tag content */
  children: React.ReactNode;
  /** Tag color */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | string;
  /** Tag size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether tag is closable */
  closable?: boolean;
  /** Close handler */
  onClose?: (e: React.MouseEvent) => void;
  /** Whether tag is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Tag icon */
  icon?: React.ReactNode;
  /** Whether tag is bordered */
  bordered?: boolean;
  /** Whether tag is rounded */
  rounded?: boolean;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Icon

::: code-with-tooltips

```tsx
<Tag icon={<Icon name="star" />}>Featured</Tag>
<Tag icon={<Icon name="check" />} color="success">Completed</Tag>
<Tag icon={<Icon name="warning" />} color="warning">Warning</Tag>
```

:::

#### Interactive Tags

::: code-with-tooltips

```tsx
<Tag
  clickable
  onClick={() => handleTagClick('category')}
  closable
  onClose={() => handleTagRemove('category')}
>
  Category
</Tag>

<Tag.Group>
  {categories.map(category => (
    <Tag
      key={category.id}
      closable
      onClose={() => removeCategory(category.id)}
    >
      {category.name}
    </Tag>
  ))}
</Tag.Group>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(({
  children,
  color = 'default',
  size = 'md',
  closable = false,
  onClose,
  clickable = false,
  onClick,
  icon,
  bordered = false,
  rounded = false,
  className,
  ...props
}, ref) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.(e);
  };
  
  return (
    <span
      ref={ref}
      className={clsx(
        'tag',
        `tag--${size}`,
        {
          'tag--clickable': clickable,
          'tag--bordered': bordered,
          'tag--rounded': rounded,
          [`tag--${color}`]: !bordered
        },
        className
      )}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {icon && <span className="tag__icon">{icon}</span>}
      <span className="tag__content">{children}</span>
      {closable && (
        <button
          className="tag__close"
          onClick={handleClose}
          aria-label="Remove tag"
        >
          <Icon name="close" />
        </button>
      )}
    </span>
  );
});

Tag.Group = function TagGroup({
  children,
  spacing = 'sm',
  className,
  ...props
}: TagGroupProps) {
  return (
    <div
      className={clsx('tag-group', className)}
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
.tag {
  display: inline-flex;
  align-items: center;
  padding: var(--tag-padding);
  border-radius: var(--tag-border-radius);
  font-size: var(--tag-font-size);
  line-height: 1;
  transition: all 0.2s;
  
  // Content layout
  &__icon {
    margin-right: var(--spacing-xs);
    display: inline-flex;
    align-items: center;
  }
  
  &__content {
    margin: 0 var(--spacing-xs);
  }
  
  &__close {
    margin-left: var(--spacing-xs);
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
  }
  
  // Size variations
  &--sm {
    --tag-padding: 2px 6px;
    --tag-font-size: 12px;
  }
  
  &--md {
    --tag-padding: 4px 8px;
    --tag-font-size: 14px;
  }
  
  &--lg {
    --tag-padding: 6px 12px;
    --tag-font-size: 16px;
  }
  
  // Color variations
  &--default {
    background: var(--surface-background-alt);
    color: var(--text-secondary);
  }
  
  &--primary {
    background: var(--primary-color-light);
    color: var(--primary-color);
  }
  
  &--success {
    background: var(--success-color-light);
    color: var(--success-color);
  }
  
  &--warning {
    background: var(--warning-color-light);
    color: var(--warning-color);
  }
  
  &--error {
    background: var(--error-color-light);
    color: var(--error-color);
  }
  
  // Bordered variant
  &--bordered {
    background: transparent;
    border: 1px solid currentColor;
  }
  
  // Rounded variant
  &--rounded {
    border-radius: 9999px;
  }
  
  // Interactive states
  &--clickable {
    cursor: pointer;
    
    &:hover {
      filter: brightness(0.95);
    }
    
    &:active {
      filter: brightness(0.9);
    }
  }
}

// Tag group styles
.tag-group {
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
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders content correctly', () => {
    render(<Tag>Test Tag</Tag>);
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });

  it('handles close event', () => {
    const handleClose = jest.fn();
    render(<Tag closable onClose={handleClose}>Closable</Tag>);
    
    fireEvent.click(screen.getByLabelText('Remove tag'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('handles click event when clickable', () => {
    const handleClick = jest.fn();
    render(<Tag clickable onClick={handleClick}>Clickable</Tag>);
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders icon correctly', () => {
    render(<Tag icon={<span data-testid="icon" />}>With Icon</Tag>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies correct styles based on props', () => {
    const { container } = render(
      <Tag
        color="primary"
        size="lg"
        bordered
        rounded
      >
        Styled
      </Tag>
    );
    
    expect(container.firstChild).toHaveClass(
      'tag',
      'tag--primary',
      'tag--lg',
      'tag--bordered',
      'tag--rounded'
    );
  });
});

describe('Tag.Group', () => {
  it('renders multiple tags with correct spacing', () => {
    const { container } = render(
      <Tag.Group spacing="md">
        <Tag>Tag 1</Tag>
        <Tag>Tag 2</Tag>
      </Tag.Group>
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
const Tag = React.forwardRef<HTMLSpanElement, TagProps>(({
  clickable,
  closable,
  onClose,
  onClick,
  ...props
}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e as any);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onClose?.(e as any);
    }
  };
  
  return (
    <span
      ref={ref}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable || closable ? 0 : undefined}
      onKeyDown={clickable || closable ? handleKeyDown : undefined}
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
// DO: Use semantic colors
<Tag color="success">Active</Tag>
<Tag color="error">Failed</Tag>

// DON'T: Mix interactive behaviors
<Tag
  clickable
  onClick={handleClick}
  closable // Avoid combining click and close
  onClose={handleClose}
>
  Confusing
</Tag>

// DO: Group related tags
<Tag.Group>
  <Tag>React</Tag>
  <Tag>TypeScript</Tag>
  <Tag>JavaScript</Tag>
</Tag.Group>

// DON'T: Use inconsistent sizes
<Tag.Group>
  <Tag size="sm">Small</Tag>
  <Tag size="lg">Large</Tag> {/* Inconsistent! */}
</Tag.Group>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize handlers
const MemoizedTag = memo(({ id, onRemove }) => (
  <Tag
    closable
    onClose={useCallback(() => onRemove(id), [id, onRemove])}
  >
    {id}
  </Tag>
));

// DON'T: Create handlers inline
<Tag
  closable
  onClose={() => handleClose(id)} // Creates new function every render
>
  {content}
</Tag>
```

:::
