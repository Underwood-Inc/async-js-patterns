---
title: Tag Component
description: Component for displaying metadata, categories, and labels
category: Data
subcategory: Status & Metadata
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - Tag
  - Label
  - React
---

# Tag Component

## Overview

The Tag component is used to display metadata, categories, and labels. It supports various styles, colors, and optional interactivity like removal and clicking.

## Key Features

- Multiple color variants
- Size options
- Closable tags
- Icon support
- Border styles
- Interactive states
- Group management
- Accessibility support

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import React from 'react';

export interface TagProps {
  /** Tag content */
  children: React.ReactNode;
  /** Tag color */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | string;
  /** Tag size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether tag is closable */
  closable?: boolean;
  /** Close handler */
  onClose?: (_e: React.MouseEvent) => void;
  /** Whether tag is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: (_e: React.MouseEvent) => void;
  /** Tag icon */
  icon?: React.ReactNode;
  /** Whether tag is bordered */
  bordered?: boolean;
  /** Whether tag is rounded */
  rounded?: boolean;
  /** Additional CSS class */
  className?: string;
}

export interface TagGroupProps {
  /** Group content */
  children: React.ReactNode;
  /** Space between tags */
  spacing?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}
```
:::

## Usage

### Basic Tag

::: code-with-tooltips
```tsx
import React from 'react';
import { Tag } from '@/components/data';

const BasicTagExample = () => (
  <div>
    {/* Simple tag */}
    <Tag>Default</Tag>

    {/* Colored tag */}
    <Tag color="primary">Primary</Tag>

    {/* Closable tag */}
    <Tag closable onClose={() => console.log('closed')}>
      Closable
    </Tag>
  </div>
);

export default BasicTagExample;
```
:::

### Examples

#### With Icons

::: code-with-tooltips
```tsx
import React from 'react';
import { Tag } from '@/components/data';
import { Icon } from '@/components/core';

const IconTagsExample = () => (
  <div>
    <Tag icon={<Icon name="star" />}>Featured</Tag>
    <Tag icon={<Icon name="check" />} color="success">
      Completed
    </Tag>
    <Tag icon={<Icon name="warning" />} color="warning">
      Warning
    </Tag>
  </div>
);

export default IconTagsExample;
```
:::

#### Interactive Tags

::: code-with-tooltips
```tsx
import React from 'react';
import { Tag } from '@/components/data';

const InteractiveTagsExample = () => {
  const handleTagClick = (category: string) => {
    console.log(`Clicked ${category}`);
  };

  const handleTagRemove = (category: string) => {
    console.log(`Removed ${category}`);
  };

  const removeCategory = (id: string) => {
    console.log(`Removed category ${id}`);
  };

  const categories = [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' },
    { id: '3', name: 'Category 3' },
  ];

  return (
    <div>
      <Tag
        clickable
        onClick={() => handleTagClick('category')}
        closable
        onClose={() => handleTagRemove('category')}
      >
        Category
      </Tag>

      <Tag.Group spacing="md">
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
    </div>
  );
};

export default InteractiveTagsExample;
```
:::

## Best Practices

### Usage Guidelines

1. **Visual Design**
   - Use semantic colors
   - Keep tags concise
   - Maintain consistent sizing
   - Consider spacing

2. **Interaction Design**
   - Clear click targets
   - Obvious close buttons
   - Consistent feedback
   - Touch-friendly areas

3. **Content Strategy**
   - Keep text short
   - Use clear labels
   - Group related tags
   - Consider hierarchy

### Accessibility

1. **ARIA Support**
   - Use proper roles
   - Provide clear labels
   - Support screen readers
   - Handle focus states

2. **Keyboard Navigation**
   - Enable tab navigation
   - Support enter/space
   - Handle delete/backspace
   - Manage focus traps

3. **Interactive Elements**
   - Clear focus indicators
   - Sufficient touch targets
   - Proper contrast
   - Descriptive labels

### Performance

1. **Rendering**
   - Optimize updates
   - Handle large groups
   - Manage animations
   - Clean up listeners

2. **Event Handling**
   - Debounce interactions
   - Batch updates
   - Memoize handlers
   - Optimize callbacks

## Related Components

- [Badge](./badge.md) - For status indicators
- [Chip](./chip.md) - For interactive filters
- [Label](./label.md) - For form labels