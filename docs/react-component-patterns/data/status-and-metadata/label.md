---
title: Label Component
description: Text label component for status and metadata
category: Data
subcategory: Status and Metadata
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Data
  - Status
  - Label
  - React
---

# Label Component

## Overview

The Label component provides a text-based label for displaying status, categories, or metadata. It supports various styles, colors, and customization options.

## Key Features

- Status variants
- Custom colors
- Size options
- Icon support
- Truncation
- Custom styling
- Accessibility support

## Component API

```tsx
import React from 'react';

export interface LabelProps {
  /** Label text */
  children: React.ReactNode;
  /** Label variant */
  variant?: 'filled' | 'outlined' | 'soft' | 'ghost';
  /** Label color */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Start icon */
  startIcon?: React.ReactNode;
  /** End icon */
  endIcon?: React.ReactNode;
  /** Whether label is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether to truncate text */
  truncate?: boolean;
  /** Maximum width */
  maxWidth?: number | string;
  /** Additional CSS class */
  className?: string;
  /** Whether label is disabled */
  disabled?: boolean;
  /** Whether to show remove button */
  removable?: boolean;
  /** Remove handler */
  onRemove?: () => void;
  /** Tooltip text */
  tooltip?: string;
}
```

## Usage Examples

### Basic Label

```tsx
import { Label } from '@/components/data/status-and-metadata';

export const BasicLabelExample = () => {
  return (
    <Label
      variant="filled"
      color="primary"
    >
      New
    </Label>
  );
};
```

### With Icons

```tsx
import { Label } from '@/components/data/status-and-metadata';
import { CheckIcon, ArrowIcon } from '@/components/icons';

export const IconLabelExample = () => (
  <Label
    variant="outlined"
    color="success"
    startIcon={<CheckIcon />}
    endIcon={<ArrowIcon />}
  >
    Completed
  </Label>
);
```

### Interactive Label

```tsx
import { Label } from '@/components/data/status-and-metadata';

export const InteractiveLabelExample = () => {
  const handleClick = () => {
    console.log('Label clicked');
  };

  const handleRemove = () => {
    console.log('Label removed');
  };

  return (
    <Label
      variant="soft"
      color="secondary"
      clickable
      onClick={handleClick}
      removable
      onRemove={handleRemove}
    >
      Category
    </Label>
  );
};
```

### With Truncation

```tsx
import { Label } from '@/components/data/status-and-metadata';

export const TruncatedLabelExample = () => (
  <Label
    variant="ghost"
    color="info"
    truncate
    maxWidth={150}
    tooltip="Very long label text that needs truncation"
  >
    Very long label text that needs truncation
  </Label>
);
```

## Best Practices

1. **Visual Design**
   - Clear contrast
   - Consistent styling
   - Appropriate sizing
   - Icon alignment

2. **Content**
   - Clear text
   - Proper truncation
   - Icon usage
   - Tooltips

3. **Accessibility**
   - Color contrast
   - ARIA labels
   - Focus states
   - Click targets

4. **Interaction**
   - Click feedback
   - Remove action
   - Hover states
   - Disabled state

## Related Components

- [Indicator](/react-component-patterns/data/status-and-metadata/indicator.md) - For status indicators
- [Badge](/react-component-patterns/data/badge.md) - For numeric indicators
- [Tag](/react-component-patterns/data/status-and-metadata/tag.md) - For tag elements

## Testing Examples

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '@/components/data/status-and-metadata';

describe('Label', () => {
  it('renders children correctly', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies variant and color classes', () => {
    const { container } = render(
      <Label variant="filled" color="success">
        Success
      </Label>
    );
    expect(container.firstChild).toHaveClass('label--filled');
    expect(container.firstChild).toHaveClass('label--success');
  });

  it('handles click events when clickable', async () => {
    const handleClick = jest.fn();
    render(
      <Label clickable onClick={handleClick}>
        Click Me
      </Label>
    );

    await userEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('truncates text when specified', () => {
    const longText = 'This is a very long label text that should be truncated';
    const { container } = render(
      <Label truncate maxWidth={100}>
        {longText}
      </Label>
    );
    expect(container.firstChild).toHaveClass('label--truncate');
    expect(container.firstChild).toHaveStyle({
      maxWidth: '100px'
    });
  });
});
```

### Integration Tests

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label, Icon } from '@/components/data';

describe('Label Integration', () => {
  it('integrates with Icon components', () => {
    render(
      <Label
        startIcon={<Icon name="check" data-testid="start-icon" />}
        endIcon={<Icon name="arrow" data-testid="end-icon" />}
      >
        Label with Icons
      </Label>
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('handles remove functionality', async () => {
    const handleRemove = jest.fn();
    render(
      <Label removable onRemove={handleRemove}>
        Removable Label
      </Label>
    );

    await userEvent.click(screen.getByRole('button'));
    expect(handleRemove).toHaveBeenCalled();
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Label', () => {
  test('shows tooltip on truncated text', async ({ page }) => {
    await page.goto('/components/label');
    
    const label = page.locator('.label--truncate');
    
    // Hover over truncated label
    await label.hover();
    
    // Check tooltip is visible with full text
    await expect(page.locator('.tooltip')).toBeVisible();
  });

  test('handles interactive states', async ({ page }) => {
    await page.goto('/components/label');
    
    const label = page.locator('.label--clickable');
    
    // Check hover state
    await label.hover();
    await expect(label).toHaveClass(/label--hover/);
    
    // Check active state
    await label.click();
    await expect(label).toHaveClass(/label--active/);
  });

  test('maintains accessibility in different themes', async ({ page }) => {
    await page.goto('/components/label');
    
    // Test in light theme
    await expect(page.locator('.label')).toHaveCSS(
      'color',
      'rgb(0, 0, 0)' // Light theme color
    );
    
    // Switch to dark theme
    await page.click('[data-testid="theme-toggle"]');
    
    // Test in dark theme
    await expect(page.locator('.label')).toHaveCSS(
      'color',
      'rgb(255, 255, 255)' // Dark theme color
    );
    
    // Verify contrast ratio meets WCAG standards
    const contrastRatio = await page.evaluate(() => {
      const label = document.querySelector('.label');
      const styles = window.getComputedStyle(label);
      return calculateContrastRatio(
        styles.backgroundColor,
        styles.color
      );
    });
    
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });
});
```