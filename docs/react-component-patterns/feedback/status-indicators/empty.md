---
title: Empty Component
description: Display placeholder content for empty states
category: Feedback
subcategory: Status Indicators
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Feedback
  - Status
  - React
---

# Empty Component

## Overview

The Empty component provides a placeholder display for when there is no data or content to show. It helps create a better user experience by explaining why content is missing and suggesting possible actions.

## Key Features

- Customizable empty state messages
- Optional action buttons
- Custom image/icon support
- Responsive layout
- Flexible styling options
- Accessible by default
- Clear visual hierarchy

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode, CSSProperties } from 'react';

export interface EmptyProps {
  /** Main message to display */
  title: string;
  /** Additional explanatory text */
  description?: string;
  /** Custom image or icon */
  image?: string | ReactNode;
  /** Action button or element */
  action?: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Additional CSS styles */
  style?: CSSProperties;
  /** Styles for the image element */
  imageStyle?: CSSProperties;
}
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | - | Main message to display |
| `description` | string | - | Additional explanatory text |
| `image` | string \| ReactNode | - | Custom image or icon |
| `action` | ReactNode | - | Action button or element |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |
| `imageStyle` | object | - | Styles for the image element |

## Usage

::: code-with-tooltips
```tsx
import { Empty, Button } from '@underwood/components';

export const EmptyExample = () => {
  return (
    <Empty
      title="No Results Found"
      description="Try adjusting your search criteria"
      action={
        <Button variant="primary">
          Clear Search
        </Button>
      }
    />
  );
};
```
:::

## Examples

### Basic Empty State

::: code-with-tooltips
```tsx
import { Empty } from '@underwood/components';

export const BasicEmptyExample = () => (
  <Empty
    title="No Results"
    description="No matching results found"
  />
);
```
:::

### With Custom Image

::: code-with-tooltips
```tsx
import { Empty, Button } from '@underwood/components';
import { SearchIcon } from '@underwood/icons';

export const CustomImageEmptyExample = () => (
  <Empty
    image={<SearchIcon style={{ fontSize: 64 }} />}
    title="No Search Results"
    description="Try using different keywords"
    action={
      <Button variant="text">
        Clear Search
      </Button>
    }
  />
);
```
:::

### With Multiple Actions

::: code-with-tooltips
```tsx
import { Empty, Button } from '@underwood/components';

export const MultiActionEmptyExample = () => (
  <Empty
    title="No Files"
    description="Upload files to get started"
    action={
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary">
          Upload File
        </Button>
        <Button variant="secondary">
          Browse Templates
        </Button>
      </div>
    }
  />
);
```
:::

### Customized Style

::: code-with-tooltips
```tsx
import { Empty, Button } from '@underwood/components';

export const StyledEmptyExample = () => (
  <Empty
    title="Cart is Empty"
    description="Add items to your cart to continue shopping"
    image="/images/empty-cart.svg"
    imageStyle={{ width: 120, height: 120 }}
    style={{ backgroundColor: '#f5f5f5', padding: 24, borderRadius: 8 }}
    action={
      <Button variant="primary">
        Browse Products
      </Button>
    }
  />
);
```
:::

## Best Practices

### Usage Guidelines

1. **Content Strategy**
   - Use clear, friendly messages
   - Explain why content is missing
   - Suggest next steps or actions
   - Keep descriptions concise

2. **Visual Design**
   - Use appropriate imagery
   - Maintain consistent styling
   - Consider layout spacing
   - Handle responsive layouts

3. **Actions**
   - Provide relevant actions
   - Keep actions simple
   - Use clear action labels
   - Consider mobile interactions

### Accessibility

1. **ARIA Attributes**
   - Use `role="status"` appropriately
   - Include descriptive labels
   - Handle focus management
   - Support keyboard navigation

2. **Screen Readers**
   - Provide clear state descriptions
   - Announce empty state changes
   - Include action descriptions
   - Consider content updates

3. **Keyboard Navigation**
   - Make actions focusable
   - Maintain focus order
   - Support keyboard shortcuts
   - Handle focus trapping

### Performance

1. **Image Loading**
   - Optimize custom images
   - Use appropriate image sizes
   - Consider lazy loading
   - Handle loading states

2. **State Management**
   - Handle state changes efficiently
   - Clean up event listeners
   - Optimize re-renders
   - Handle unmounting

## Related Components

- [Result](./result.md) - For operation results
- [Status](./status.md) - For status indicators
- [Error](./error.md) - For error states
 