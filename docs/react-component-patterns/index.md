---
title: React Component Patterns
description: Comprehensive guide to building modern, reusable React components following best practices and design patterns
category: Guide
subcategory: Core Concepts
date: 2024-12-01
author: Underwood Inc
status: Stable
tags:
  - React
  - Components
  - UI Design
  - Best Practices
  - TypeScript
---

# React Component Patterns

## Overview

A comprehensive guide to building modern, maintainable React components using best practices, design patterns, and TypeScript. This guide focuses on creating a robust component library that follows DRY principles, composable design, and performance optimization.

## Key Features

- TypeScript-first component development
- Composable and reusable patterns
- Comprehensive component categories
- Best practices and design patterns
- Performance optimization guidelines

## Usage Guidelines

### Basic Usage

::: code-with-tooltips

```tsx
import React from 'react';
import type { PropsWithChildren } from 'react';

interface CardProps {
  title: string;
  variant?: 'default' | 'featured';
  className?: string;
}

export const Card = ({
  title,
  variant = 'default',
  className,
  children
}: PropsWithChildren<CardProps>) => {
  return (
    <div
      className={clsx(
        'card',
        `card--${variant}`,
        className
      )}
    >
      <div className="card__header">
        <h3 className="card__title">{title}</h3>
      </div>
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.card {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 2px solid var(--vp-c-brand);
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &--featured {
    border-color: var(--vp-c-brand-dark);
    background: color.adjust(colors.$purple-light, $lightness: -2%);
  }

  &__header {
    padding: 1rem;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  &__title {
    margin: 0;
    color: var(--vp-c-brand-dark);
  }

  &__content {
    padding: 1rem;
  }
}
```

:::

### Advanced Usage

```tsx
// Example of advanced component composition
const AdvancedCard = () => {
  return (
    <Card
      title="Advanced Usage"
      variant="featured"
      header={<CustomHeader />}
      footer={<ActionButtons />}
    >
      <CardContent>
        <CardMedia />
        <CardDescription />
      </CardContent>
    </Card>
  );
};
```

## Component Categories

Our React component library is organized into the following categories:

### Foundation

- [Typography](./foundation/typography.md) - Text components and styles
- [Colors](./foundation/colors.md) - Color system and themes
- [Spacing](./foundation/spacing.md) - Layout and spacing system
- [Icons](./foundation/icons.md) - Icon system and usage

### Layout

- [Container](./layout/container.md) - Content wrapper components
- [Grid](./layout/grid.md) - Grid system components
- [Stack](./layout/stack.md) - Vertical/horizontal stacking
- [Flex](./layout/flex.md) - Flexbox components

### Form Controls

- [Button](./form/button.md) - Button variants and states
- [Input](./form/input.md) - Text input components
- [Select](./form/select.md) - Dropdown selection
- [Checkbox](./form/checkbox.md) - Checkbox components
- [Radio](./form/radio.md) - Radio button groups
- [Switch](./form/switch.md) - Toggle switches

### Navigation

- [Menu](./navigation/menu.md) - Menu components
- [Tabs](./navigation/tabs.md) - Tab navigation
- [Breadcrumb](./navigation/breadcrumb.md) - Breadcrumb navigation
- [Pagination](./navigation/pagination.md) - Page navigation

### Feedback

- [Alert](./feedback/notifications/alert) - Alert messages
- [Toast](./feedback/notifications/toast) - Toast notifications
- [Progress](./feedback/progress-indicators/progress) - Progress indicators
- [Skeleton](./feedback/progress-indicators/skeleton) - Loading states

### Overlay

- [Modal](./overlay/modals/modal) - Modal dialogs
- [Drawer](./overlay/drawer/drawer) - Slide-out panels
- [Popover](./overlay/contextual-overlays/popover) - Contextual overlays
- [Tooltip](./overlay/contextual-overlays/tooltip) - Hover tooltips

### Data Display

- [Table](./data/tables/table) - Data tables
- [List](./data/lists-and-cards/list) - List components
- [Card](./data/lists-and-cards/card) - Card layouts
- [Badge](./data/status-and-metadata/badge) - Status badges

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string` | Required | The card title |
| variant | `'default' \| 'featured'` | `'default'` | Visual style variant |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Card content |

## Accessibility

### Best Practices

- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Maintain focus management
- Support screen readers

### Component-specific Guidelines

- Cards should use article or section elements when appropriate
- Interactive elements must be keyboard accessible
- Color contrast must meet WCAG standards
- Focus states must be visible

## Testing

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders with title', () => {
    render(<Card title="Test Card">Content</Card>);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(
      <Card title="Featured Card" variant="featured">
        Content
      </Card>
    );
    expect(container.firstChild).toHaveClass('card--featured');
  });
});
```

## Design Guidelines

### Visual Design

- Use CSS-in-JS or CSS Modules for component-specific styles
  - Provides better encapsulation and scoping
  - Enables dynamic styling based on props
  - Eliminates naming conflicts
  - Allows for dead code elimination
  - Provides TypeScript support and type safety
  - Example:

::: code-with-tooltips

  ```tsx
  // Using CSS Modules
  import styles from './Card.module.css';
  
  export const Card = ({ featured }) => (
    <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <h2 className={styles.title}>Title</h2>
    </div>
  );

  // Using CSS-in-JS (styled-components)
  const CardWrapper = styled.div<{ featured?: boolean }>`
    background: ${props => props.featured ? 'yellow' : 'white'};
    padding: var(--space-md);
    border-radius: var(--radius-md);
  `;
  ```

:::

- Follow BEM methodology for global styles
  - Provides clear structure for larger stylesheets
  - Makes CSS more maintainable and scalable
  - Helps prevent style conflicts in global styles
  - Example:

::: code-with-tooltips

  ```scss
  .card {
    &__header { /* Block Element */ }
    &--featured { /* Block Modifier */ }
  }
  ```

:::

- Implement responsive design using modern CSS
  - Use CSS Grid and Flexbox for layouts
  - Implement Container Queries for component-level responsiveness
  - Use modern units (rem, ch, dvh) for better scaling
  - Example:

::: code-with-tooltips

  ```scss
  .layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-md);
    
    @container (min-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  ```

:::

- Support theming and customization
  - Use CSS Custom Properties for theme values
  - Implement dark mode using CSS variables
  - Provide component-level style customization
  - Example:

::: code-with-tooltips

  ```scss
  :root {
    --color-primary: #646cff;
    --color-text: #213547;
  }

  .dark {
    --color-primary: #747bff;
    --color-text: #ffffff;
  }
  ```

:::

### Layout Considerations

- Use consistent spacing
- Follow responsive design principles
- Consider component composition
- Maintain visual hierarchy

## Performance Considerations

- Implement proper memoization
- Optimize re-renders
- Use lazy loading when appropriate
- Consider bundle size impact
