---
title: Card Component
description: Versatile card component for displaying content in a contained format
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Card
  - Layout
  - React
---

# Card Component

## Overview

The Card component provides a flexible container for displaying content in a contained format. It supports various layouts, content sections, and interaction patterns.

## Usage

### Basic Card

::: code-with-tooltips

```tsx
import { Card } from '@/components/data';

<Card>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Subtitle>Card Subtitle</Card.Subtitle>
  </Card.Header>
  <Card.Body>
    This is the main content of the card.
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

:::

### API Reference

```tsx
interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Whether card is hoverable */
  hoverable?: boolean;
  /** Whether card has shadow */
  shadow?: boolean | 'sm' | 'md' | 'lg';
  /** Card padding */
  padding?: number | string;
  /** Card border radius */
  radius?: number | string;
  /** Whether card is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class */
  className?: string;
}

interface CardHeaderProps {
  /** Header content */
  children: React.ReactNode;
  /** Header background */
  background?: string;
  /** Header padding */
  padding?: number | string;
  /** Additional CSS class */
  className?: string;
}

interface CardTitleProps {
  /** Title content */
  children: React.ReactNode;
  /** Title level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Additional CSS class */
  className?: string;
}

interface CardBodyProps {
  /** Body content */
  children: React.ReactNode;
  /** Body padding */
  padding?: number | string;
  /** Additional CSS class */
  className?: string;
}

interface CardFooterProps {
  /** Footer content */
  children: React.ReactNode;
  /** Footer padding */
  padding?: number | string;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Media

::: code-with-tooltips

```tsx
<Card>
  <Card.Media
    src="/image.jpg"
    alt="Card image"
    height={200}
  />
  <Card.Body>
    <Card.Title>Media Card</Card.Title>
    <p>Card content with media.</p>
  </Card.Body>
</Card>
```

:::

#### Interactive Card

::: code-with-tooltips

```tsx
<Card
  hoverable
  clickable
  onClick={() => handleCardClick()}
>
  <Card.Body>
    <Card.Title>Clickable Card</Card.Title>
    <p>Click me to trigger an action.</p>
  </Card.Body>
</Card>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
const CardContext = React.createContext<{
  padding?: number | string;
}>({});

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  hoverable = false,
  shadow = false,
  padding,
  radius = 'md',
  clickable = false,
  onClick,
  className,
  ...props
}, ref) => {
  return (
    <CardContext.Provider value={{ padding }}>
      <div
        ref={ref}
        className={clsx(
          'card',
          {
            'card--hoverable': hoverable,
            'card--clickable': clickable,
            [`card--shadow-${shadow}`]: shadow,
          },
          className
        )}
        style={{
          padding,
          borderRadius: radius,
          cursor: clickable ? 'pointer' : undefined
        }}
        onClick={clickable ? onClick : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
});

Card.Header = function CardHeader({
  children,
  background,
  padding,
  className
}: CardHeaderProps) {
  const ctx = useContext(CardContext);
  
  return (
    <div
      className={clsx('card__header', className)}
      style={{
        background,
        padding: padding ?? ctx.padding
      }}
    >
      {children}
    </div>
  );
};

Card.Title = function CardTitle({
  children,
  level = 3,
  className
}: CardTitleProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Component
      className={clsx('card__title', className)}
    >
      {children}
    </Component>
  );
};

Card.Body = function CardBody({
  children,
  padding,
  className
}: CardBodyProps) {
  const ctx = useContext(CardContext);
  
  return (
    <div
      className={clsx('card__body', className)}
      style={{ padding: padding ?? ctx.padding }}
    >
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  children,
  padding,
  className
}: CardFooterProps) {
  const ctx = useContext(CardContext);
  
  return (
    <div
      className={clsx('card__footer', className)}
      style={{ padding: padding ?? ctx.padding }}
    >
      {children}
    </div>
  );
};

Card.Media = function CardMedia({
  src,
  alt,
  height,
  width,
  className
}: CardMediaProps) {
  return (
    <div
      className={clsx('card__media', className)}
      style={{ height, width }}
    >
      <img src={src} alt={alt} />
    </div>
  );
};
```

:::

## Styling

### Base Styles

::: code-with-tooltips

```scss
.card {
  background: var(--surface-background);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: all 0.2s ease;
  
  // Hover state
  &--hoverable {
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }
  
  // Shadow variants
  &--shadow-sm { box-shadow: var(--shadow-sm); }
  &--shadow-md { box-shadow: var(--shadow-md); }
  &--shadow-lg { box-shadow: var(--shadow-lg); }
  
  // Clickable state
  &--clickable {
    cursor: pointer;
    
    &:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }
  }
  
  // Header
  &__header {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-background);
  }
  
  // Title
  &__title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
  }
  
  // Subtitle
  &__subtitle {
    margin: var(--spacing-xs) 0 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
  
  // Body
  &__body {
    padding: var(--spacing-md);
    
    > :first-child { margin-top: 0; }
    > :last-child { margin-bottom: 0; }
  }
  
  // Footer
  &__footer {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border-color);
    background: var(--surface-background-alt);
  }
  
  // Media
  &__media {
    position: relative;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('handles click events when clickable', () => {
    const handleClick = jest.fn();
    
    render(
      <Card clickable onClick={handleClick}>
        <Card.Body>Clickable Content</Card.Body>
      </Card>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies hover styles', () => {
    const { container } = render(
      <Card hoverable>
        <Card.Body>Hoverable Content</Card.Body>
      </Card>
    );
    
    expect(container.firstChild).toHaveClass('card--hoverable');
  });

  it('renders media content', () => {
    render(
      <Card>
        <Card.Media
          src="/test.jpg"
          alt="Test Image"
          height={200}
        />
      </Card>
    );
    
    const img = screen.getByAltText('Test Image');
    expect(img).toBeInTheDocument();
    expect(img.parentElement).toHaveStyle({ height: '200px' });
  });

  it('supports nested components', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Title</Card.Title>
          <Card.Subtitle>Subtitle</Card.Subtitle>
        </Card.Header>
        <Card.Body>Body Content</Card.Body>
        <Card.Footer>Footer Content</Card.Footer>
      </Card>
    );
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Body Content')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });
});
```

:::

## Accessibility

### ARIA Attributes

::: code-with-tooltips

```tsx
const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  clickable,
  onClick,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-pressed={clickable ? false : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
});
```

:::

## Integration Examples

### With React Router

::: code-with-tooltips

```tsx
import { Link } from 'react-router-dom';

const LinkCard = ({ to, children, ...props }) => (
  <Card
    as={Link}
    to={to}
    clickable
    hoverable
    {...props}
  >
    {children}
  </Card>
);

// Usage
<LinkCard to="/article/1">
  <Card.Media src="/thumbnail.jpg" alt="Article thumbnail" />
  <Card.Body>
    <Card.Title>Article Title</Card.Title>
    <p>Article preview text...</p>
  </Card.Body>
</LinkCard>
```

:::

### With Animation

::: code-with-tooltips

```tsx
import { motion } from 'framer-motion';

const AnimatedCard = motion(Card);

<AnimatedCard
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  <Card.Body>Animated content</Card.Body>
</AnimatedCard>
```

:::

## Best Practices

### Layout Guidelines

::: code-with-tooltips

```tsx
// DO: Use consistent spacing
<Card padding="md">
  <Card.Body>
    <Stack spacing="md">
      <Card.Title>Well-spaced Content</Card.Title>
      <p>Content with consistent margins</p>
    </Stack>
  </Card.Body>
</Card>

// DON'T: Mix padding values
<Card padding="lg">
  <Card.Body padding="sm"> {/* Inconsistent! */}
    <Card.Title>Inconsistent Spacing</Card.Title>
  </Card.Body>
</Card>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize handlers for clickable cards
const MemoizedCard = memo(({ item, onSelect }) => (
  <Card
    clickable
    onClick={useCallback(() => onSelect(item.id), [item.id, onSelect])}
  >
    <Card.Body>{item.content}</Card.Body>
  </Card>
));

// DON'T: Create new handlers on every render
<Card
  clickable
  onClick={() => handleSelect(item.id)} // Creates new function every render
>
  <Card.Body>{item.content}</Card.Body>
</Card>
```

:::
