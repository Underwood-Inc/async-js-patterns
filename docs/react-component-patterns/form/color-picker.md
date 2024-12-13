---
title: ColorPicker Component
description: Color selection component with RGB, HSL, and hex formats, color swatches, and alpha channel support
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Color
  - Picker
  - React
---

# ColorPicker Component

## Overview

The ColorPicker component provides an intuitive interface for selecting colors. It supports various color formats (RGB, HSL, Hex), custom color swatches, and alpha channel adjustments while maintaining accessibility standards. This component is essential for handling color inputs in forms and design tools.

## Key Features

A comprehensive set of features for color selection:

- Multiple color formats
- Alpha channel support
- Color swatches
- Custom presets
- Format conversion
- Keyboard navigation
- Accessibility support
- Custom styling

## Usage Guidelines

This section demonstrates how to implement the ColorPicker component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the ColorPicker component:

```tsx
import * as React from 'react';
import { ColorPicker } from '@/components/form';

export const BasicColorPickerExample: React.FC = () => {
  const [color, setColor] = React.useState('#000000');

  return (
    <ColorPicker
      label="Select Color"
      value={color}
      onChange={setColor}
    />
  );
};
```

### Advanced Usage

Examples of more complex implementations:

```tsx
import * as React from 'react';
import { ColorPicker } from '@/components/form';
import { rgbToHex, hexToRgb, rgbToHsl } from '@/utils/color';

export const AdvancedColorPickerExample: React.FC = () => {
  const [color, setColor] = React.useState('#FF0000');
  const [format, setFormat] = React.useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [alpha, setAlpha] = React.useState(1);

  const presetColors = [
    '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF'
  ];

  const handleColorChange = (newColor: string, newAlpha?: number) => {
    setColor(newColor);
    if (newAlpha !== undefined) {
      setAlpha(newAlpha);
    }
  };

  const getFormattedColor = () => {
    const rgb = hexToRgb(color);
    switch (format) {
      case 'rgb':
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      case 'hsl':
        const hsl = rgbToHsl(rgb);
        return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;
      default:
        return color;
    }
  };

  return (
    <>
      <ColorPicker
        label="Theme Color"
        value={color}
        onChange={handleColorChange}
        format={format}
        alpha={alpha}
        presetColors={presetColors}
        showFormatToggle
        showAlphaSlider
      />

      <ColorPicker
        label="Custom Format"
        value={color}
        onChange={handleColorChange}
        format="rgb"
        swatches={[
          { color: '#FF0000', label: 'Red' },
          { color: '#00FF00', label: 'Green' },
          { color: '#0000FF', label: 'Blue' }
        ]}
        disableAlpha
        disableFormatToggle
      />

      <ColorPicker
        label="Advanced Options"
        value={color}
        onChange={handleColorChange}
        format={format}
        onFormatChange={setFormat}
        alpha={alpha}
        onAlphaChange={setAlpha}
        defaultView="spectrum"
        recentColors={[]}
        maxRecentColors={5}
      />
    </>
  );
};
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | - | Selected color |
| onChange | `(color: string, alpha?: number) => void` | - | Change handler |
| label | `string` | - | Field label |
| format | `'hex' \| 'rgb' \| 'hsl'` | `'hex'` | Color format |
| alpha | `number` | `1` | Alpha channel value |
| presetColors | `string[]` | - | Preset color list |
| swatches | `Array<{ color: string, label: string }>` | - | Custom swatches |
| showFormatToggle | `boolean` | `false` | Show format toggle |
| showAlphaSlider | `boolean` | `false` | Show alpha slider |
| disableAlpha | `boolean` | `false` | Disable alpha |
| disableFormatToggle | `boolean` | `false` | Disable format toggle |
| defaultView | `'spectrum' \| 'swatches'` | `'spectrum'` | Default view |
| recentColors | `string[]` | - | Recent colors list |
| maxRecentColors | `number` | `10` | Max recent colors |

## Accessibility

Ensuring the ColorPicker component is accessible to all users.

### Keyboard Navigation

How users can interact with the color picker:

- Tab to focus controls
- Arrow keys for adjustment
- Enter to confirm
- Space to toggle
- Escape to cancel

### Screen Readers

How the component communicates with assistive technologies:

- Color announcements
- Format indication
- Value changes
- Control labels
- Error messages

### Best Practices

Guidelines for maintaining accessibility:

- Clear labeling
- Keyboard support
- ARIA attributes
- Focus management
- Color contrast

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual color picker functionality:

```tsx
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from '@/components/form';
import '@testing-library/jest-dom';

describe('ColorPicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders correctly', () => {
    render(
      <ColorPicker
        label="Test Color"
        value="#000000"
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Test Color')).toBeInTheDocument();
  });

  it('opens color picker on click', async () => {
    render(
      <ColorPicker
        label="Test Color"
        value="#000000"
        onChange={mockOnChange}
      />
    );
    
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('selects preset color', async () => {
    render(
      <ColorPicker
        label="Test Color"
        value="#000000"
        onChange={mockOnChange}
        presetColors={['#FF0000']}
      />
    );
    
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByTitle('#FF0000'));
    
    expect(mockOnChange).toHaveBeenCalledWith('#FF0000');
  });

  it('handles format change', async () => {
    render(
      <ColorPicker
        label="Test Color"
        value="#FF0000"
        onChange={mockOnChange}
        showFormatToggle
      />
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'RGB' }));
    expect(screen.getByDisplayValue('rgb(255, 0, 0)')).toBeInTheDocument();
  });
});
```

### Integration Tests

Testing color picker behavior with form validation:

```tsx
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, ColorPicker } from '@/components/form';
import '@testing-library/jest-dom';

describe('ColorPicker Integration', () => {
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    mockHandleSubmit.mockClear();
  });

  it('validates color format', async () => {
    render(
      <Form onSubmit={mockHandleSubmit}>
        <ColorPicker
          label="Color"
          name="color"
          required
        />
        <button type="submit">Submit</button>
      </Form>
    );
    
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('Color is required')).toBeVisible();
  });

  it('handles color validation', async () => {
    render(
      <Form>
        <ColorPicker
          label="Color"
          format="hex"
        />
      </Form>
    );
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'invalid');
    expect(screen.getByText('Invalid color format')).toBeVisible();
  });
});
```

### E2E Tests

Testing color picker behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('ColorPicker', () => {
  test('handles color selection', async ({ page }) => {
    await page.goto('/color-picker-demo');
    
    // Open color picker
    await page.getByLabel('Select Color').click();
    
    // Select color from spectrum
    await page.mouse.click(200, 200);
    
    // Verify selection
    const input = page.getByRole('textbox');
    await expect(input).toHaveValue(/#[0-9A-F]{6}/i);
  });

  test('handles keyboard navigation', async ({ page }) => {
    await page.goto('/color-picker-demo');
    
    // Focus color picker
    await page.getByLabel('Select Color').focus();
    
    // Open with space
    await page.keyboard.press('Space');
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    
    // Verify selection
    const input = page.getByRole('textbox');
    await expect(input).toHaveValue(/#[0-9A-F]{6}/i);
  });
});
```

## Design Guidelines

Best practices for implementing the ColorPicker component.

### Visual Design

Core visual principles:

- Color spectrum
- Swatch layout
- Input formatting
- Slider design
- Focus indicators

### Layout Considerations

How to handle different layout scenarios:

- Picker positioning
- Input width
- Mobile responsiveness
- Swatch grid layout
- Control placement

## Performance Considerations

Guidelines for optimal color picker performance:

- Color calculations
- Canvas rendering
- Event handling
- Memory management
- DOM updates

## Related Components

Components commonly used with ColorPicker:

- [FormField](/react-component-patterns/form/form-field.md) - For field wrapper
- [ColorSwatch](/react-component-patterns/data/color-swatch.md) - For color display
- [ColorPalette](/react-component-patterns/data/color-palette.md) - For color sets
- [Input](/react-component-patterns/form/input.md) - For manual color input

## Resources

Additional documentation and references:

- [Color Format Guidelines](#)
- [Color Picker Patterns](#)
- [Accessibility Best Practices](#)