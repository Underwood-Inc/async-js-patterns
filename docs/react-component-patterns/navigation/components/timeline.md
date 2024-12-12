---
title: Timeline Component
description: Component for displaying chronological sequences of events or activities
date: 2024-01-01
author: Underwood Inc
tags:
  - Data Display
  - Timeline
  - Events
  - React
---

# Timeline Component

## Overview

The Timeline component visualizes a sequence of events or activities in chronological order. It supports various styles, custom content, and interactive features.

## Usage

### Basic Timeline

::: code-with-tooltips

```tsx
import { Timeline } from '@/components/data';

<Timeline>
  <Timeline.Item>
    <Timeline.Dot />
    <Timeline.Content>
      <h4>Event 1</h4>
      <p>Description of event 1</p>
    </Timeline.Content>
  </Timeline.Item>
  <Timeline.Item>
    <Timeline.Dot color="success" />
    <Timeline.Content>
      <h4>Event 2</h4>
      <p>Description of event 2</p>
    </Timeline.Content>
  </Timeline.Item>
</Timeline>
```

:::

### API Reference

```tsx
interface TimelineProps {
  /** Timeline items */
  children: React.ReactNode;
  /** Timeline alignment */
  align?: 'left' | 'right' | 'alternate';
  /** Timeline orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Whether to reverse the order */
  reverse?: boolean;
  /** Additional CSS class */
  className?: string;
}

interface TimelineItemProps {
  /** Item content */
  children: React.ReactNode;
  /** Whether item is active */
  active?: boolean;
  /** Whether to show connector line */
  connector?: boolean;
  /** Additional CSS class */
  className?: string;
}

interface TimelineDotProps {
  /** Dot color */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  /** Dot variant */
  variant?: 'filled' | 'outlined';
  /** Custom icon */
  icon?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}
```

### Examples

#### With Custom Content

::: code-with-tooltips

```tsx
<Timeline align="alternate">
  <Timeline.Item>
    <Timeline.Dot icon={<Icon name="star" />} color="primary" />
    <Timeline.Content>
      <Card>
        <Card.Header>
          <h4>Event Title</h4>
          <time>2024-01-01</time>
        </Card.Header>
        <Card.Body>
          <p>Detailed description of the event</p>
        </Card.Body>
      </Card>
    </Timeline.Content>
  </Timeline.Item>
</Timeline>
```

:::

## Implementation

### Core Component

::: code-with-tooltips

```tsx
export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(({
  children,
  align = 'left',
  orientation = 'vertical',
  reverse = false,
  className,
  ...props
}, ref) => {
  const items = React.Children.toArray(children);
  const orderedItems = reverse ? [...items].reverse() : items;
  
  return (
    <div
      ref={ref}
      className={clsx(
        'timeline',
        `timeline--${orientation}`,
        `timeline--${align}`,
        className
      )}
      {...props}
    >
      {orderedItems.map((item, index) => (
        React.cloneElement(item as React.ReactElement, {
          key: index,
          position: align === 'alternate' 
            ? index % 2 === 0 ? 'left' : 'right'
            : align
        })
      ))}
    </div>
  );
});

Timeline.Item = function TimelineItem({
  children,
  active = false,
  connector = true,
  className,
  position,
  ...props
}: TimelineItemProps & { position?: 'left' | 'right' }) {
  return (
    <div
      className={clsx(
        'timeline__item',
        `timeline__item--${position}`,
        {
          'timeline__item--active': active,
          'timeline__item--no-connector': !connector
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Timeline.Dot = function TimelineDot({
  color = 'default',
  variant = 'filled',
  icon,
  className,
  ...props
}: TimelineDotProps) {
  return (
    <div
      className={clsx(
        'timeline__dot',
        `timeline__dot--${color}`,
        `timeline__dot--${variant}`,
        className
      )}
      {...props}
    >
      {icon}
    </div>
  );
};

Timeline.Content = function TimelineContent({
  children,
  className,
  ...props
}: TimelineContentProps) {
  return (
    <div
      className={clsx('timeline__content', className)}
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
.timeline {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  
  // Vertical orientation
  &--vertical {
    display: flex;
    flex-direction: column;
    
    .timeline__item {
      position: relative;
      margin-bottom: var(--spacing-lg);
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  // Horizontal orientation
  &--horizontal {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    
    .timeline__item {
      flex: 1;
      margin-right: var(--spacing-lg);
      
      &:last-child {
        margin-right: 0;
      }
    }
  }
  
  // Item styles
  &__item {
    display: flex;
    
    &--left {
      .timeline__content {
        margin-left: var(--spacing-md);
      }
    }
    
    &--right {
      flex-direction: row-reverse;
      
      .timeline__content {
        margin-right: var(--spacing-md);
      }
    }
    
    &--active {
      .timeline__dot {
        transform: scale(1.2);
      }
    }
  }
  
  // Dot styles
  &__dot {
    position: relative;
    width: var(--timeline-dot-size);
    height: var(--timeline-dot-size);
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    
    &--filled {
      background-color: var(--dot-bg-color);
      color: var(--dot-text-color);
    }
    
    &--outlined {
      background-color: transparent;
      border: 2px solid var(--dot-bg-color);
      color: var(--dot-bg-color);
    }
    
    // Color variations
    &--default {
      --dot-bg-color: var(--text-secondary);
      --dot-text-color: var(--surface-background);
    }
    
    &--primary {
      --dot-bg-color: var(--primary-color);
      --dot-text-color: var(--primary-contrast);
    }
    
    &--success {
      --dot-bg-color: var(--success-color);
      --dot-text-color: var(--success-contrast);
    }
  }
  
  // Connector line
  &__connector {
    position: absolute;
    background-color: var(--border-color);
    
    .timeline--vertical & {
      width: 2px;
      top: var(--timeline-dot-size);
      bottom: calc(-1 * var(--spacing-lg) + var(--timeline-dot-size));
      left: calc(var(--timeline-dot-size) / 2 - 1px);
    }
    
    .timeline--horizontal & {
      height: 2px;
      left: var(--timeline-dot-size);
      right: calc(-1 * var(--spacing-lg) + var(--timeline-dot-size));
      top: calc(var(--timeline-dot-size) / 2 - 1px);
    }
  }
  
  // Content styles
  &__content {
    flex: 1;
  }
}
```

:::

## Testing

### Unit Tests

::: code-with-tooltips

```tsx
import { render, screen } from '@testing-library/react';
import { Timeline } from './Timeline';

describe('Timeline', () => {
  it('renders items in correct order', () => {
    render(
      <Timeline>
        <Timeline.Item>
          <Timeline.Content>Event 1</Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Content>Event 2</Timeline.Content>
        </Timeline.Item>
      </Timeline>
    );
    
    const items = screen.getAllByText(/Event \d/);
    expect(items[0]).toHaveTextContent('Event 1');
    expect(items[1]).toHaveTextContent('Event 2');
  });

  it('handles reverse order', () => {
    render(
      <Timeline reverse>
        <Timeline.Item>
          <Timeline.Content>Event 1</Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Content>Event 2</Timeline.Content>
        </Timeline.Item>
      </Timeline>
    );
    
    const items = screen.getAllByText(/Event \d/);
    expect(items[0]).toHaveTextContent('Event 2');
    expect(items[1]).toHaveTextContent('Event 1');
  });

  it('applies correct alignment classes', () => {
    const { container } = render(
      <Timeline align="alternate">
        <Timeline.Item>
          <Timeline.Content>Event 1</Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Content>Event 2</Timeline.Content>
        </Timeline.Item>
      </Timeline>
    );
    
    const items = container.querySelectorAll('.timeline__item');
    expect(items[0]).toHaveClass('timeline__item--left');
    expect(items[1]).toHaveClass('timeline__item--right');
  });
});
```

:::

## Accessibility

### ARIA Attributes

::: code-with-tooltips

```tsx
const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(({
  orientation = 'vertical',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      role="list"
      aria-orientation={orientation}
      {...props}
    >
      {/* ... */}
    </div>
  );
});

Timeline.Item = function TimelineItem(props) {
  return (
    <div
      role="listitem"
      aria-current={props.active ? 'step' : undefined}
      {...props}
    >
      {/* ... */}
    </div>
  );
};
```

:::

## Best Practices

### Usage Guidelines

::: code-with-tooltips

```tsx
// DO: Use semantic content order
<Timeline>
  <Timeline.Item>
    <Timeline.Dot />
    <Timeline.Content>
      <time>2024-01-01</time>
      <h3>Event Title</h3>
      <p>Description</p>
    </Timeline.Content>
  </Timeline.Item>
</Timeline>

// DON'T: Mix alignments
<Timeline align="left">
  <Timeline.Item>
    <Timeline.Content style={{ textAlign: 'right' }}> {/* Inconsistent! */}
      Content
    </Timeline.Content>
  </Timeline.Item>
</Timeline>

// DO: Use consistent spacing
<Timeline>
  {events.map(event => (
    <Timeline.Item key={event.id}>
      <Timeline.Content>
        <Card padding="md">
          {event.content}
        </Card>
      </Timeline.Content>
    </Timeline.Item>
  ))}
</Timeline>

// DON'T: Use inconsistent dot sizes
<Timeline>
  <Timeline.Item>
    <Timeline.Dot style={{ width: 20 }} /> {/* Avoid custom sizes */}
  </Timeline.Item>
</Timeline>
```

:::

### Performance Considerations

::: code-with-tooltips

```tsx
// DO: Memoize event handlers and content
const TimelineEvent = memo(({ event, onAction }) => (
  <Timeline.Item>
    <Timeline.Dot
      icon={<Icon name={event.icon} />}
      onClick={useCallback(() => onAction(event.id), [event.id, onAction])}
    />
    <Timeline.Content>
      {event.content}
    </Timeline.Content>
  </Timeline.Item>
));

// DON'T: Create new components inline
<Timeline>
  {events.map(event => (
    <div key={event.id}> {/* Avoid wrapper elements */}
      <Timeline.Item>{event.content}</Timeline.Item>
    </div>
  ))}
</Timeline>
```

:::
