---
title: TimePicker Component
description: Time selection component with 12/24 hour formats, minute intervals, and keyboard navigation
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Time
  - Clock
  - React
---

# TimePicker Component

## Overview

The TimePicker component provides an intuitive interface for selecting time values. It supports both 12-hour and 24-hour formats, customizable minute intervals, and keyboard navigation while maintaining accessibility standards. This component is essential for handling time inputs in forms.

## Key Features

A comprehensive set of features for time selection:

- 12/24 hour formats
- Minute intervals
- Keyboard navigation
- Time validation
- Format localization
- Clear button
- Accessibility support
- Custom styling

## Usage Guidelines

This section demonstrates how to implement the TimePicker component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the TimePicker component:

```tsx
import * as React from 'react';
import { TimePicker } from '@/components/form';

export const BasicTimePickerExample: React.FC = () => {
  const [time, setTime] = React.useState<string | null>(null);

  return (
    <TimePicker
      label="Select Time"
      value={time}
      onChange={setTime}
    />
  );
};
```

### Advanced Usage

Examples of more complex implementations:

```tsx
import * as React from 'react';
import { TimePicker } from '@/components/form';
import { format, parse } from 'date-fns';

export const AdvancedTimePickerExample: React.FC = () => {
  const [startTime, setStartTime] = React.useState<string | null>(null);
  const [endTime, setEndTime] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');

  const validateTimeRange = (start: string | null, end: string | null) => {
    if (!start || !end) return '';
    
    const startDate = parse(start, 'HH:mm', new Date());
    const endDate = parse(end, 'HH:mm', new Date());
    
    return startDate >= endDate ? 'End time must be after start time' : '';
  };

  const handleStartTimeChange = (time: string | null) => {
    setStartTime(time);
    setError(validateTimeRange(time, endTime));
  };

  const handleEndTimeChange = (time: string | null) => {
    setEndTime(time);
    setError(validateTimeRange(startTime, time));
  };

  return (
    <>
      <TimePicker
        label="Start Time"
        value={startTime}
        onChange={handleStartTimeChange}
        format="hh:mm a"
        minuteStep={15}
        error={!!error}
        helperText={error}
        clearable
      />

      <TimePicker
        label="End Time"
        value={endTime}
        onChange={handleEndTimeChange}
        format="hh:mm a"
        minuteStep={15}
        error={!!error}
        disabled={!startTime}
        clearable
      />

      <TimePicker
        label="Custom Format"
        format="HH:mm"
        use24Hours
        disabledHours={() => [0, 1, 2, 3, 4, 5, 6]}
        disabledMinutes={(hour) => hour === 12 ? [0, 15, 30, 45] : []}
        placeholder="Select time..."
      />
    </>
  );
};
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string \| null` | - | Selected time |
| onChange | `(time: string \| null) => void` | - | Change handler |
| label | `string` | - | Field label |
| format | `string` | `'hh:mm a'` | Time format |
| use24Hours | `boolean` | `false` | Use 24-hour format |
| minuteStep | `number` | `1` | Minute interval |
| disabled | `boolean` | `false` | Disabled state |
| error | `boolean` | `false` | Error state |
| helperText | `string` | - | Helper text |
| clearable | `boolean` | `false` | Show clear button |
| disabledHours | `() => number[]` | - | Disabled hours |
| disabledMinutes | `(hour: number) => number[]` | - | Disabled minutes |

## Accessibility

Ensuring the TimePicker component is accessible to all users.

### Keyboard Navigation

How users can interact with the time picker:

- Tab to focus input
- Arrow keys for time adjustment
- Enter to confirm
- Space to open dropdown
- Escape to close dropdown

### Screen Readers

How the component communicates with assistive technologies:

- Time announcements
- Format indication
- Error messages
- Selection state
- Time descriptions

### Best Practices

Guidelines for maintaining accessibility:

- Clear labeling
- Keyboard support
- ARIA attributes
- Focus management
- Error handling

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual time picker functionality:

```tsx
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TimePicker } from '@/components/form';
import '@testing-library/jest-dom';

describe('TimePicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders correctly', () => {
    render(
      <TimePicker
        label="Test Time"
        value={null}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Test Time')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    render(
      <TimePicker
        label="Test Time"
        value={null}
        onChange={mockOnChange}
      />
    );
    
    await userEvent.click(screen.getByRole('textbox'));
    expect(screen.getByRole('listbox')).toBeVisible();
  });

  it('selects time', async () => {
    render(
      <TimePicker
        label="Test Time"
        value={null}
        onChange={mockOnChange}
      />
    );
    
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.click(screen.getByText('12:00 PM'));
    
    expect(mockOnChange).toHaveBeenCalledWith('12:00');
  });

  it('handles disabled times', () => {
    render(
      <TimePicker
        label="Test Time"
        value={null}
        onChange={mockOnChange}
        disabledHours={() => [12]}
      />
    );
    
    const option = screen.getByText('12:00 PM');
    expect(option).toHaveAttribute('aria-disabled', 'true');
  });
});
```

### Integration Tests

Testing time picker behavior with form validation:

```tsx
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, TimePicker } from '@/components/form';
import '@testing-library/jest-dom';

describe('TimePicker Integration', () => {
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    mockHandleSubmit.mockClear();
  });

  it('validates time range', async () => {
    render(
      <Form onSubmit={mockHandleSubmit}>
        <TimePicker
          label="Start Time"
          name="startTime"
          required
        />
        <TimePicker
          label="End Time"
          name="endTime"
          required
        />
        <button type="submit">Submit</button>
      </Form>
    );
    
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Start time is required')).toBeVisible();
  });

  it('handles time format validation', async () => {
    render(
      <Form>
        <TimePicker
          label="Time"
          format="HH:mm"
        />
      </Form>
    );
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'invalid');
    expect(screen.getByText('Invalid time format')).toBeVisible();
  });
});
```

### E2E Tests

Testing time picker behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('TimePicker', () => {
  test('handles time selection', async ({ page }) => {
    await page.goto('/time-picker-demo');
    
    // Open dropdown
    await page.getByLabel('Select Time').click();
    
    // Select time
    await page.getByText('3:00 PM').click();
    
    // Verify selection
    const input = page.getByRole('textbox');
    await expect(input).toHaveValue('3:00 PM');
  });

  test('handles keyboard navigation', async ({ page }) => {
    await page.goto('/time-picker-demo');
    
    // Focus input
    await page.getByLabel('Select Time').focus();
    
    // Open dropdown with space
    await page.keyboard.press('Space');
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    
    // Verify selection
    const input = page.getByRole('textbox');
    await expect(input).toHaveValue(/.+/);
  });
});
```

## Design Guidelines

Best practices for implementing the TimePicker component.

### Visual Design

Core visual principles:

- Time format display
- Input styling
- Dropdown layout
- Error states
- Focus indicators

### Layout Considerations

How to handle different layout scenarios:

- Dropdown positioning
- Input width
- Mobile responsiveness
- Error message placement
- Helper text alignment

## Performance Considerations

Guidelines for optimal time picker performance:

- Time calculations
- Dropdown rendering
- Event handling
- Memory management
- DOM updates

## Related Components

Components commonly used with TimePicker:

- Time Range Picker - For time range selection
- Clock - For visual time selection
- [FormField](/react-component-patterns/form/form-field.md) - For field wrapper
- [Input](/react-component-patterns/form/input.md) - For manual time input

## Resources

Additional documentation and references:

- [Time Format Patterns](#)
- [Time Input Guidelines](#)
- [Accessibility Best Practices](#)