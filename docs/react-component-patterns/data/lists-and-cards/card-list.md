---
title: CardList Component
description: List layout component for displaying cards in a vertical or horizontal arrangement
category: Data
subcategory: Lists & Cards
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data Display
  - List
  - Layout
  - React
---

# CardList Component

## Overview

The CardList component extends the base List component to provide a specialized layout for displaying cards in either vertical or horizontal arrangements. It supports various spacing options, dividers, and interaction patterns while maintaining consistent behavior with other list components.

## Key Features

- Vertical/horizontal layouts
- Customizable spacing
- Optional dividers
- Item selection
- Keyboard navigation
- Touch support
- Responsive design
- Accessibility support

## Component API

### Props Interface

::: code-with-tooltips
```tsx
import { ReactNode } from 'react';

export interface CardListProps {
  /** List items */
  children: ReactNode;
  /** Space between items */
  spacing?: SpacingValue;
  /** List direction */
  direction?: 'vertical' | 'horizontal';
  /** Whether to show dividers */
  dividers?: boolean;
  /** Divider color */
  dividerColor?: string;
  /** Whether items are selectable */
  selectable?: boolean;
  /** Selected item indices */
  selectedIndices?: number[];
  /** Selection change handler */
  onSelectionChange?: (_indices: number[]) => void;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS class */
  className?: string;
}

export type SpacingValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
```
:::

### Props Table

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | List items |
| `spacing` | SpacingValue | 'md' | Item spacing |
| `direction` | string | 'vertical' | List direction |
| `dividers` | boolean | false | Show dividers |
| `dividerColor` | string | - | Divider color |
| `selectable` | boolean | false | Enable selection |
| `selectedIndices` | number[] | [] | Selected indices |
| `onSelectionChange` | function | - | Selection handler |
| `loading` | boolean | false | Loading state |
| `error` | string | - | Error message |
| `emptyMessage` | string | 'No items' | Empty message |

## Usage

### Basic CardList

::: code-with-tooltips
```tsx
import { CardList, Card } from '@/components/data';

export const BasicCardListExample = () => {
  return (
    <CardList spacing="md">
      <Card>
        <Card.Body>
          <Card.Title>Card 1</Card.Title>
          <p>First card content</p>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Card 2</Card.Title>
          <p>Second card content</p>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Card 3</Card.Title>
          <p>Third card content</p>
        </Card.Body>
      </Card>
    </CardList>
  );
};
```
:::

### Horizontal List

::: code-with-tooltips
```tsx
import { CardList, Card } from '@/components/data';

export const HorizontalCardListExample = () => {
  const items = [
    { id: 1, title: 'Item 1', image: '/image1.jpg' },
    { id: 2, title: 'Item 2', image: '/image2.jpg' },
    { id: 3, title: 'Item 3', image: '/image3.jpg' },
  ];

  return (
    <CardList
      direction="horizontal"
      spacing="lg"
      style={{ overflowX: 'auto' }}
    >
      {items.map(item => (
        <Card key={item.id} style={{ minWidth: 300 }}>
          <Card.Media
            src={item.image}
            alt={item.title}
            height={200}
          />
          <Card.Body>
            <Card.Title>{item.title}</Card.Title>
          </Card.Body>
        </Card>
      ))}
    </CardList>
  );
};
```
:::

### With Selection

::: code-with-tooltips
```tsx
import { CardList, Card } from '@/components/data';
import { useState } from 'react';

export const SelectableCardListExample = () => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  return (
    <CardList
      selectable
      selectedIndices={selectedIndices}
      onSelectionChange={setSelectedIndices}
      dividers
      spacing="md"
    >
      {items.map((item, index) => (
        <Card
          key={item.id}
          hoverable
          shadow={selectedIndices.includes(index) ? 'md' : 'sm'}
        >
          <Card.Body>
            <Card.Title>{item.title}</Card.Title>
            <p>{item.description}</p>
          </Card.Body>
        </Card>
      ))}
    </CardList>
  );
};
```
:::

## Best Practices

### Usage Guidelines

1. **Layout Management**
   - Use consistent spacing
   - Handle overflow properly
   - Maintain alignment
   - Consider responsiveness

2. **Interaction Design**
   - Clear selection states
   - Smooth transitions
   - Touch-friendly areas
   - Keyboard support

3. **Content Organization**
   - Logical grouping
   - Visual hierarchy
   - Consistent sizing
   - Proper spacing

### Accessibility

1. **Keyboard Navigation**
   - Arrow key support
   - Selection shortcuts
   - Focus management
   - Tab order

2. **Screen Readers**
   - List semantics
   - Selection states
   - Item positions
   - Group context

3. **Visual Feedback**
   - Focus indicators
   - Selection highlights
   - Loading states
   - Error messages

### Performance

1. **Rendering**
   - Optimize updates
   - Handle large lists
   - Manage selection
   - Clean up listeners

2. **Interaction**
   - Debounce events
   - Batch updates
   - Handle scrolling
   - Manage memory

3. **Layout**
   - Minimize reflows
   - Handle resizing
   - Optimize transitions
   - Cache measurements

## Related Components

- [List](./list.md) - Base list component
- [Card](./card.md) - Card component
- [CardGrid](./card-grid.md) - Grid layout
- [VirtualList](./virtual-list.md) - For large lists
