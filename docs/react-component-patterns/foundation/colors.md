---
title: Color System
description: A comprehensive color system for React components with theme support and accessibility considerations
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Colors
  - Theme
  - Design System
  - Accessibility
---

# Color System

## Overview

Our color system provides a consistent and accessible palette for React components. It supports both light and dark themes, maintains WCAG compliance, and integrates seamlessly with our component library.

## Color Tokens

### Brand Colors

::: code-with-tooltips

```scss
:root {
  // Primary brand colors
  --color-brand-50: #{colors.$purple-gray-100};
  --color-brand-100: #{colors.$purple-gray-200};
  --color-brand-200: #{colors.$purple-gray-300};
  --color-brand-300: #{colors.$purple-gray-400};
  --color-brand-400: #{colors.$purple-gray-500};
  --color-brand-500: #{colors.$purple-brand};
  --color-brand-600: #{colors.$purple-brand-dark};
  --color-brand-700: #{colors.$purple-gray-700};
  --color-brand-800: #{colors.$purple-gray-800};
  --color-brand-900: #{colors.$purple-gray-900};
}
```

:::

### Semantic Colors

::: code-with-tooltips

```scss
:root {
  // Text colors
  --color-text-primary: var(--vp-c-text-1);
  --color-text-secondary: var(--vp-c-text-2);
  --color-text-tertiary: var(--vp-c-text-3);

  // Background colors
  --color-bg-primary: var(--vp-c-bg);
  --color-bg-secondary: var(--vp-c-bg-soft);
  --color-bg-tertiary: var(--vp-c-bg-mute);

  // Border colors
  --color-border-primary: var(--vp-c-divider);
  --color-border-secondary: var(--vp-c-divider-light);

  // Status colors
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #{colors.$purple-brand};
}

.dark {
  // Dark theme adjustments
  --color-success: #4ade80;
  --color-warning: #fbbf24;
  --color-error: #f87171;
  --color-info: #{colors.$purple-brand-light};
}
```

:::

## Color Utilities

### Color Provider

A context provider for managing theme colors:

::: code-with-tooltips

```tsx
import React, { createContext, useContext, useState } from 'react';

interface ColorContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: Record<string, string>;
}

const ColorContext = createContext<ColorContextValue | undefined>(undefined);

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const colors = {
    // Brand colors
    brandPrimary: 'var(--color-brand-500)',
    brandLight: 'var(--color-brand-400)',
    brandDark: 'var(--color-brand-600)',

    // Text colors
    textPrimary: 'var(--color-text-primary)',
    textSecondary: 'var(--color-text-secondary)',
    textTertiary: 'var(--color-text-tertiary)',

    // Background colors
    bgPrimary: 'var(--color-bg-primary)',
    bgSecondary: 'var(--color-bg-secondary)',
    bgTertiary: 'var(--color-bg-tertiary)',

    // Border colors
    borderPrimary: 'var(--color-border-primary)',
    borderSecondary: 'var(--color-border-secondary)',

    // Status colors
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)',
  };

  return (
    <ColorContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};
```

:::

### Color Hook

A custom hook for accessing theme colors:

::: code-with-tooltips

```tsx
export const useThemeColor = (colorKey: keyof typeof defaultColors) => {
  const { colors } = useColors();
  return colors[colorKey];
};

// Usage example
const MyComponent = () => {
  const brandColor = useThemeColor('brandPrimary');
  return (
    <div style={{ color: brandColor }}>
      Themed content
    </div>
  );
};
```

:::

## Color Components

### Color Swatch

A component for displaying color samples:

::: code-with-tooltips

```tsx
interface ColorSwatchProps {
  color: string;
  name: string;
  value: string;
  textColor?: string;
}

export const ColorSwatch = ({
  color,
  name,
  value,
  textColor = 'inherit'
}: ColorSwatchProps) => {
  return (
    <div className="color-swatch">
      <div
        className="color-swatch__sample"
        style={{ backgroundColor: color }}
      />
      <div className="color-swatch__info">
        <div className="color-swatch__name" style={{ color: textColor }}>
          {name}
        </div>
        <div className="color-swatch__value">
          {value}
        </div>
      </div>
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.color-swatch {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);

  &__sample {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    border: 2px solid var(--vp-c-divider);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__name {
    font-weight: 500;
  }

  &__value {
    font-family: var(--vp-font-family-mono);
    font-size: 0.875em;
    color: var(--vp-c-text-2);
  }
}
```

:::

## Usage Examples

### Theme Integration

::: code-with-tooltips

```tsx
const App = () => {
  return (
    <ColorProvider>
      <ThemeToggle />
      <ComponentLibrary />
    </ColorProvider>
  );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useColors();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
};
```

:::

### Color Palette Display

::: code-with-tooltips

```tsx
const ColorPalette = () => {
  const brandColors = [
    { name: 'Brand 50', value: 'var(--color-brand-50)' },
    { name: 'Brand 100', value: 'var(--color-brand-100)' },
    { name: 'Brand 200', value: 'var(--color-brand-200)' },
    { name: 'Brand 300', value: 'var(--color-brand-300)' },
    { name: 'Brand 400', value: 'var(--color-brand-400)' },
    { name: 'Brand 500', value: 'var(--color-brand-500)' },
    { name: 'Brand 600', value: 'var(--color-brand-600)' },
    { name: 'Brand 700', value: 'var(--color-brand-700)' },
    { name: 'Brand 800', value: 'var(--color-brand-800)' },
    { name: 'Brand 900', value: 'var(--color-brand-900)' },
  ];

  return (
    <div className="color-palette">
      {brandColors.map(color => (
        <ColorSwatch
          key={color.name}
          color={color.value}
          name={color.name}
          value={color.value}
        />
      ))}
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.color-palette {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  padding: 1rem;
}
```

:::

## Best Practices

### 1. Accessibility

- Maintain WCAG 2.1 AA contrast ratios
- Provide sufficient color contrast
- Don't rely on color alone
- Support color blindness
- Test with screen readers

### 2. Theme Support

- Use CSS custom properties
- Support light/dark modes
- Allow theme customization
- Handle system preferences
- Provide smooth transitions

### 3. Performance

- Minimize CSS variables
- Use efficient selectors
- Cache color calculations
- Optimize theme switches
- Reduce repaints

### 4. Maintainability

- Document color usage
- Use semantic naming
- Create color scales
- Version color tokens
- Follow naming conventions

### 5. Implementation

The color system integrates with our components through CSS custom properties:

::: code-with-tooltips

```tsx
// Button component example
const Button = styled.button`
  background-color: var(--color-brand-500);
  color: white;

  &:hover {
    background-color: var(--color-brand-600);
  }

  &:active {
    background-color: var(--color-brand-700);
  }

  &:disabled {
    background-color: var(--color-brand-200);
  }
`;

// Alert component example
const Alert = styled.div<{ variant: 'success' | 'error' | 'warning' | 'info' }>`
  background-color: ${props => `var(--color-${props.variant})`};
  color: white;
  padding: 1rem;
  border-radius: 8px;
`;
```

:::

## Color Functions

Utility functions for working with colors:

::: code-with-tooltips

```tsx
export const colorFunctions = {
  // Adjust color opacity
  alpha: (color: string, value: number) => {
    return `color-mix(in srgb, ${color}, transparent ${100 - value * 100}%)`;
  },

  // Lighten color
  lighten: (color: string, value: number) => {
    return `color-mix(in srgb, ${color}, white ${value * 100}%)`;
  },

  // Darken color
  darken: (color: string, value: number) => {
    return `color-mix(in srgb, ${color}, black ${value * 100}%)`;
  },

  // Get contrasting text color
  getContrastText: (bgColor: string) => {
    // Implementation for calculating contrast ratio
    return contrastRatio > 4.5 ? 'white' : 'black';
  },
};
```

:::
