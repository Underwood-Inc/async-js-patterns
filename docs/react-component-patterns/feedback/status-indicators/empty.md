---
title: Empty
description: Display placeholder content for empty states
date: 2024-01-01
author: Underwood Inc
tags:
  - Feedback
  - Status
  - React
---

# Empty Component

## Overview

The Empty component provides a placeholder display for when there is no data or content to show. It helps create a better user experience by explaining why content is missing and suggesting possible actions.

## Usage

```tsx
import { Empty, Button } from '@underwood/components';
import { SearchIcon } from '@underwood/icons';

// Basic example
<Empty
  title="No Results"
  description="No matching results found"
/>

// With custom image and action
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

// With multiple actions
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

// With custom styling
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
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | - | Main message to display |
| `description` | string | - | Additional explanatory text |
| `image` | string \| ReactNode | - | Custom image or icon |
| `action` | ReactNode | - | Action button or element |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |
| `imageStyle` | object | - | Styles for the image element |

## Examples

### Basic Empty State

```tsx
<Empty
  title="No Results"
  description="No matching results found"
/>
```

### With Custom Image

```tsx
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
```

### With Multiple Actions

```tsx
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
```

### Customized Style

```tsx
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
```

## Best Practices

1. **Content**
   - Use clear, friendly messages
   - Explain why content is missing
   - Suggest next steps or actions

2. **Visual Design**
   - Use appropriate imagery
   - Maintain consistent styling
   - Consider layout spacing

3. **Actions**
   - Provide relevant actions
   - Keep actions simple
   - Use clear action labels

4. **Accessibility**
   - Include descriptive text
   - Support keyboard navigation
   - Maintain proper contrast

## Related Components

- [Result](./result.md) - For operation results
- [Status](./status.md) - For status indicators
- [Error](./error.md) - For error states
 