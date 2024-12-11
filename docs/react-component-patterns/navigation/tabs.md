---
title: Tab Components
description: Tab navigation components for React applications with smooth transitions and accessibility
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Navigation
  - Tabs
  - Design System
  - Accessibility
---

# Tab Components

## Overview

Our tab components provide an intuitive way to organize and navigate between related sections of content. They support keyboard navigation, animations, and various styling options.

## Components

### Tab Container

The main container component for managing tab state:

::: code-with-tooltips

```tsx
import React from 'react';
import clsx from 'clsx';

interface TabsProps {
  /** Default active tab */
  defaultTab?: string;
  /** Active tab (controlled) */
  activeTab?: string;
  /** Change handler */
  onChange?: (tab: string) => void;
  /** Tab content */
  children: React.ReactNode;
  /** Tab variant */
  variant?: 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
  /** Tab size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to stretch tabs to full width */
  stretch?: boolean;
  /** Label for the tablist */
  label?: string;
  /** Manual tab activation */
  manual?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const Tabs = ({
  defaultTab,
  activeTab: controlledTab,
  onChange,
  children,
  variant = 'line',
  size = 'md',
  stretch = false,
  label = 'Tabs',
  manual = false,
  className,
  ...props
}: TabsProps) => {
  const [selectedTab, setSelectedTab] = React.useState(defaultTab);
  const [focusedTab, setFocusedTab] = React.useState<string | null>(null);
  const activeTab = controlledTab ?? selectedTab;

  const handleTabChange = (tab: string) => {
    if (!controlledTab) {
      setSelectedTab(tab);
    }
    onChange?.(tab);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabs: string[]) => {
    const currentIndex = tabs.indexOf(focusedTab || activeTab);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    setFocusedTab(nextTab);
    if (!manual) {
      handleTabChange(nextTab);
    }
  };

  const handleFocus = (tab: string) => {
    setFocusedTab(tab);
  };

  const handleBlur = () => {
    setFocusedTab(null);
  };

  const tabsContext = {
    activeTab,
    focusedTab,
    onChange: handleTabChange,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    manual,
    variant,
    size,
  };

  return (
    <div
      className={clsx(
        'tabs',
        `tabs--${variant}`,
        `tabs--${size}`,
        stretch && 'tabs--stretch',
        className
      )}
      {...props}
    >
      <TabsContext.Provider value={tabsContext}>
        {children}
      </TabsContext.Provider>
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.tabs {
  display: flex;
  flex-direction: column;
  width: 100%;

  // Variants
  &--line {
    .tabs__list {
      border-bottom: 1px solid var(--vp-c-divider);
    }

    .tab-trigger {
      margin-bottom: -1px;
      border-bottom: 2px solid transparent;

      &--active {
        border-bottom-color: var(--vp-c-brand);
      }
    }
  }

  &--enclosed {
    .tabs__list {
      background-color: var(--vp-c-bg-soft);
      border-radius: 8px 8px 0 0;
      padding: var(--spacing-1);
    }

    .tab-trigger {
      border-radius: 6px;

      &--active {
        background-color: var(--vp-c-bg);
      }
    }
  }

  &--soft-rounded {
    .tabs__list {
      background-color: var(--vp-c-bg-soft);
      border-radius: 9999px;
      padding: var(--spacing-1);
    }

    .tab-trigger {
      border-radius: 9999px;

      &--active {
        background-color: var(--vp-c-bg);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
    }
  }

  &--solid-rounded {
    .tabs__list {
      gap: var(--spacing-2);
    }

    .tab-trigger {
      border-radius: 9999px;

      &--active {
        background-color: var(--vp-c-brand);
        color: white;
      }
    }
  }

  // Sizes
  &--sm {
    .tab-trigger {
      padding: var(--spacing-1) var(--spacing-3);
      font-size: 0.875rem;
    }
  }

  &--md {
    .tab-trigger {
      padding: var(--spacing-2) var(--spacing-4);
      font-size: 1rem;
    }
  }

  &--lg {
    .tab-trigger {
      padding: var(--spacing-3) var(--spacing-6);
      font-size: 1.125rem;
    }
  }

  // Stretch variant
  &--stretch {
    .tabs__list {
      justify-content: stretch;
    }

    .tab-trigger {
      flex: 1;
    }
  }
}
```

:::

### Tab List

The container for tab triggers:

::: code-with-tooltips

```tsx
interface TabListProps {
  /** Tab triggers */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export const TabList = ({
  children,
  className,
  ...props
}: TabListProps) => {
  const { activeTab, onKeyDown } = React.useContext(TabsContext);
  const tabs = React.Children.map(children, child =>
    React.isValidElement(child) ? child.props.value : null
  ).filter(Boolean);

  return (
    <div
      role="tablist"
      className={clsx('tabs__list', className)}
      onKeyDown={(e) => onKeyDown(e, tabs)}
      aria-orientation="horizontal"
      {...props}
    >
      {children}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.tabs__list {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}
```

:::

### Tab Trigger

The clickable tab button:

::: code-with-tooltips

```tsx
interface TabTriggerProps {
  /** Tab value */
  value: string;
  /** Tab label */
  children: React.ReactNode;
  /** Whether to disable the tab */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const TabTrigger = ({
  value,
  children,
  disabled = false,
  className,
  ...props
}: TabTriggerProps) => {
  const { activeTab, onChange } = React.useContext(TabsContext);
  const isActive = activeTab === value;
  const id = `tab-${value}`;
  const panelId = `panel-${value}`;

  return (
    <button
      id={id}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={clsx(
        'tab-trigger',
        isActive && 'tab-trigger--active',
        disabled && 'tab-trigger--disabled',
        className
      )}
      onClick={() => onChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};
```

:::

::: code-with-tooltips

```scss
.tab-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background: none;
  color: var(--vp-c-text-2);
  font-weight: 500;

  &:hover:not(&--disabled) {
    color: var(--vp-c-text-1);
  }

  &--active {
    color: var(--vp-c-brand);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

:::

### Tab Panel

The content container for each tab:

::: code-with-tooltips

```tsx
interface TabPanelProps {
  /** Panel value */
  value: string;
  /** Panel content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export const TabPanel = ({
  value,
  children,
  className,
  ...props
}: TabPanelProps) => {
  const { activeTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;
  const id = `panel-${value}`;
  const triggerId = `tab-${value}`;

  if (!isActive) return null;

  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={triggerId}
      tabIndex={0}
      className={clsx('tab-panel', className)}
      {...props}
    >
      {children}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.tab-panel {
  padding: var(--spacing-4) 0;
}
```

:::

## Usage Examples

### Basic Tabs

::: code-with-tooltips

```tsx
<Tabs defaultTab="tab1">
  <TabList>
    <TabTrigger value="tab1">Tab 1</TabTrigger>
    <TabTrigger value="tab2">Tab 2</TabTrigger>
    <TabTrigger value="tab3">Tab 3</TabTrigger>
  </TabList>

  <TabPanel value="tab1">
    Content for Tab 1
  </TabPanel>
  <TabPanel value="tab2">
    Content for Tab 2
  </TabPanel>
  <TabPanel value="tab3">
    Content for Tab 3
  </TabPanel>
</Tabs>
```

:::

### Different Variants

::: code-with-tooltips

```tsx
<>
  <Tabs variant="line" defaultTab="tab1">
    <TabList>
      <TabTrigger value="tab1">Line Tab 1</TabTrigger>
      <TabTrigger value="tab2">Line Tab 2</TabTrigger>
    </TabList>
    {/* Panels */}
  </Tabs>

  <Tabs variant="enclosed" defaultTab="tab1">
    <TabList>
      <TabTrigger value="tab1">Enclosed Tab 1</TabTrigger>
      <TabTrigger value="tab2">Enclosed Tab 2</TabTrigger>
    </TabList>
    {/* Panels */}
  </Tabs>

  <Tabs variant="soft-rounded" defaultTab="tab1">
    <TabList>
      <TabTrigger value="tab1">Rounded Tab 1</TabTrigger>
      <TabTrigger value="tab2">Rounded Tab 2</TabTrigger>
    </TabList>
    {/* Panels */}
  </Tabs>
</>
```

:::

### With Icons

::: code-with-tooltips

```tsx
<Tabs defaultTab="overview">
  <TabList>
    <TabTrigger value="overview">
      <HomeIcon className="mr-2" />
      Overview
    </TabTrigger>
    <TabTrigger value="analytics">
      <ChartIcon className="mr-2" />
      Analytics
    </TabTrigger>
    <TabTrigger value="settings">
      <SettingsIcon className="mr-2" />
      Settings
    </TabTrigger>
  </TabList>
  {/* Panels */}
</Tabs>
```

:::

### Disabled Tabs

::: code-with-tooltips

```tsx
<Tabs defaultTab="active">
  <TabList>
    <TabTrigger value="active">Active Tab</TabTrigger>
    <TabTrigger value="disabled" disabled>
      Disabled Tab
    </TabTrigger>
  </TabList>
  {/* Panels */}
</Tabs>
```

:::

### Stretched Tabs

::: code-with-tooltips

```tsx
<Tabs defaultTab="tab1" stretch>
  <TabList>
    <TabTrigger value="tab1">Tab 1</TabTrigger>
    <TabTrigger value="tab2">Tab 2</TabTrigger>
    <TabTrigger value="tab3">Tab 3</TabTrigger>
  </TabList>
  {/* Panels */}
</Tabs>
```

:::

## Best Practices

### 1. Accessibility

- Use proper ARIA roles
- Support keyboard navigation
- Maintain focus states
- Clear active states
- Screen reader support

### 2. UX Guidelines

- Clear visual feedback
- Consistent spacing
- Logical grouping
- Smooth transitions
- Touch targets

### 3. Performance

- Lazy load content
- Minimize re-renders
- Cache calculations
- Optimize transitions
- Handle large content

### 4. Implementation

Example of using tabs in components:

::: code-with-tooltips

```tsx
// Product details tabs
const ProductTabs = ({ product }: { product: Product }) => {
  return (
    <Tabs defaultTab="details">
      <TabList>
        <TabTrigger value="details">
          Product Details
        </TabTrigger>
        <TabTrigger value="specs">
          Specifications
        </TabTrigger>
        <TabTrigger value="reviews">
          Reviews ({product.reviewCount})
        </TabTrigger>
      </TabList>

      <TabPanel value="details">
        <div className="product-description">
          {product.description}
        </div>
      </TabPanel>

      <TabPanel value="specs">
        <div className="product-specs">
          {product.specifications.map(spec => (
            <div key={spec.name} className="spec-item">
              <div className="spec-label">{spec.name}</div>
              <div className="spec-value">{spec.value}</div>
            </div>
          ))}
        </div>
      </TabPanel>

      <TabPanel value="reviews">
        <div className="product-reviews">
          {product.reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </TabPanel>
    </Tabs>
  );
};
```

:::

### 5. Customization

Example of extending tab styles:

::: code-with-tooltips

```scss
// Custom tab variants
.tabs {
  // Gradient variant
  &--gradient {
    .tabs__list {
      background: linear-gradient(
        to right,
        var(--vp-c-brand),
        color.adjust(colors.$purple-brand, $lightness: 20%)
      );
      padding: var(--spacing-1);
      border-radius: 8px;
    }

    .tab-trigger {
      color: white;
      opacity: 0.8;

      &--active {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 6px;
      }
    }
  }

  // Card variant
  &--card {
    .tab-trigger {
      border: 1px solid var(--vp-c-divider);
      border-radius: 8px;
      margin-right: -1px;

      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      &--active {
        background-color: var(--vp-c-brand);
        border-color: var(--vp-c-brand);
        color: white;
        z-index: 1;
      }
    }
  }

  // Vertical variant
  &--vertical {
    flex-direction: row;
    align-items: flex-start;

    .tabs__list {
      flex-direction: column;
      border-right: 1px solid var(--vp-c-divider);
      padding-right: var(--spacing-4);
      margin-right: var(--spacing-4);
    }

    .tab-trigger {
      width: 100%;
      justify-content: flex-start;

      &--active {
        border-right: 2px solid var(--vp-c-brand);
        margin-right: -1px;
      }
    }
  }
}

// Custom animations
.tab-panel {
  &-enter {
    opacity: 0;
    transform: translateY(8px);
  }

  &-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.2s ease;
  }

  &-exit {
    opacity: 1;
    transform: translateY(0);
  }

  &-exit-active {
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.2s ease;
  }
}
```

:::
