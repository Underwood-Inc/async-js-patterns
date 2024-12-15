---
title: Card Component
description: Versatile card component for displaying content in a contained format
category: Data
subcategory: Lists & Cards
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - Card
  - Layout
  - React
---

# Card Component

## Overview

The Card component provides a flexible container for displaying content in a contained format. It supports various layouts, content sections, and interaction patterns through a compound component pattern.

## Key Features

- Compound component pattern
- Header, body, and footer sections
- Media support
- Interactive states
- Customizable styling
- Accessibility support
- Responsive design
- Shadow variants

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface CardProps {
  /** Card content */
  children: ReactNode;
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

export interface CardHeaderProps {
  /** Header content */
  children: ReactNode;
  /** Header background */
  background?: string;
  /** Header padding */
  padding?: number | string;
  /** Additional CSS class */
  className?: string;
}

export interface CardTitleProps {
  /** Title content */
  children: ReactNode;
  /** Title level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Additional CSS class */
  className?: string;
}

export interface CardBodyProps {
  /** Body content */
  children: ReactNode;
  /** Body padding */
  padding?: number | string;
  /** Additional CSS class */
  className?: string;
}

export interface CardFooterProps {
  /** Footer content */
  children: ReactNode;
  /** Footer padding */
  padding?: number | string;
  /** Additional CSS class */
  className?: string;
}

export interface CardMediaProps {
  /** Media source URL */
  src: string;
  /** Alt text */
  alt: string;
  /** Media height */
  height?: number | string;
  /** Media width */
  width?: number | string;
  /** Object fit */
  objectFit?: 'cover' | 'contain' | 'fill';
  /** Additional CSS class */
  className?: string;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Card content |
| `hoverable` | boolean | false | Enable hover effect |
| `shadow` | string/boolean | false | Shadow variant |
| `padding` | number/string | - | Card padding |
| `radius` | number/string | 'md' | Border radius |
| `clickable` | boolean | false | Enable click |
| `onClick` | function | - | Click handler |
| `className` | string | - | Custom class |

## Usage

### Basic Card

::: code-with-tooltips
```tsx
import { Card } from '@/components/data';

export const BasicCardExample = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
        <Card.Subtitle>Card Subtitle</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <p>This is the main content of the card.</p>
      </Card.Body>
      <Card.Footer>
        <Button>Action</Button>
      </Card.Footer>
    </Card>
  );
};
```
:::

### With Media

::: code-with-tooltips
```tsx
import { Card } from '@/components/data';

export const MediaCardExample = () => {
  return (
    <Card shadow="md">
      <Card.Media
        src="/image.jpg"
        alt="Card image"
        height={200}
        objectFit="cover"
      />
      <Card.Body>
        <Card.Title>Media Card</Card.Title>
        <p>Card content with media.</p>
      </Card.Body>
    </Card>
  );
};
```
:::

### Interactive Card

::: code-with-tooltips
```tsx
import { Card } from '@/components/data';

export const InteractiveCardExample = () => {
  const handleCardClick = () => {
    console.log('Card clicked');
  };

  return (
    <Card
      hoverable
      clickable
      shadow="sm"
      onClick={handleCardClick}
    >
      <Card.Body>
        <Card.Title>Clickable Card</Card.Title>
        <p>Click me to trigger an action.</p>
      </Card.Body>
    </Card>
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Layout & Structure**
   - Use semantic sections
   - Maintain consistent spacing
   - Follow content hierarchy
   - Handle overflow properly

2. **Interaction Design**
   - Clear hover states
   - Obvious click targets
   - Consistent feedback
   - Touch-friendly areas

3. **Content Organization**
   - Logical grouping
   - Clear hierarchy
   - Balanced density
   - Proper alignment

### Accessibility

1. **Semantic Structure**
   - Use proper headings
   - Include ARIA roles
   - Handle focus states
   - Support keyboard

2. **Interactive Elements**
   - Clear focus states
   - Keyboard navigation
   - Touch targets
   - Click handling

3. **Media Content**
   - Alt text
   - Loading states
   - Fallback content
   - Responsive images

### Performance

1. **Rendering**
   - Optimize media loading
   - Lazy load images
   - Handle transitions
   - Minimize reflows

2. **State Management**
   - Cache hover states
   - Optimize click handlers
   - Manage media states
   - Handle animations

3. **Resource Loading**
   - Optimize image loading
   - Preload critical assets
   - Handle loading states
   - Manage fallbacks

## Related Components

- [CardList](./card-list.md) - For displaying cards in a list layout
- [CardGrid](./card-grid.md) - For displaying cards in a grid layout
- [List](./list.md) - For simpler list layouts
