---
title: DatePicker Component
description: Date selection component with calendar interface, keyboard navigation, and various date formats
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Date
  - Calendar
  - React
---

# DatePicker Component

## Overview

The DatePicker component provides an intuitive interface for selecting dates with a calendar popup. It supports various date formats, range selection, and keyboard navigation while maintaining accessibility standards. This component is essential for handling date inputs in forms.

## Key Features

A comprehensive set of features for date selection:

- Calendar interface
- Date range selection
- Multiple date formats
- Keyboard navigation
- Localization support
- Min/max date limits
- Custom date parsing
- Accessibility support

## Usage Guidelines

This section demonstrates how to implement the DatePicker component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the DatePicker component:

```tsx
import * as React from 'react';
import { DatePicker } from '@/components/form';

export const BasicDatePickerExample: React.FC = () => {
  const [date, setDate] = React.useState<Date | null>(null);

  return (
    <DatePicker
      label="Select Date"
      value={date}
      onChange={setDate}
    />
  );
};
```

### Advanced Usage

Examples of more complex implementations:

```tsx
import * as React from 'react';
import { DatePicker } from '@/components/form';
import { format, isValid, parse } from 'date-fns';

export const AdvancedDatePickerExample: React.FC = () => {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [error, setError] = React.useState('');

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date && endDate && date > endDate) {
      setError('Start date must be before end date');
    } else {
      setError('');
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (date && startDate && date < startDate) {
      setError('End date must be after start date');
    } else {
      setError('');
    }
  };

  return (
    <>
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={handleStartDateChange}
        minDate={new Date()}
        format="MM/dd/yyyy"
        error={!!error}
        helperText={error}
        clearable
      />

      <DatePicker
        label="End Date"
        value={endDate}
        onChange={handleEndDateChange}
        minDate={startDate || new Date()}
        format="MM/dd/yyyy"
        error={!!error}
        disabled={!startDate}
        clearable
      />

      <DatePicker
        label="Custom Format"
        format="MMMM do, yyyy"
        parseDate={(value) => parse(value, 'MMMM do, yyyy', new Date())}
        formatDate={(date) => format(date, 'MMMM do, yyyy')}
        placeholder="Select a date..."
        disabledDates={[new Date('2024-12-25')]}
        highlightedDates={[new Date('2024-01-01')]}
      />
    </>
  );
};
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `Date \| null` | - | Selected date |
| onChange | `(date: Date \| null) => void` | - | Change handler |
| label | `string` | - | Field label |
| format | `string` | `'MM/dd/yyyy'` | Date format |
| minDate | `Date` | - | Minimum selectable date |
| maxDate | `Date` | - | Maximum selectable date |
| disabled | `boolean` | `false` | Disabled state |
| error | `boolean` | `false` | Error state |
| helperText | `string` | - | Helper text |
| clearable | `boolean` | `false` | Show clear button |
| parseDate | `(value: string) => Date` | - | Custom parse function |
| formatDate | `(date: Date) => string` | - | Custom format function |
| disabledDates | `Date[]` | - | Disabled dates |
| highlightedDates | `Date[]` | - | Highlighted dates |

## Accessibility

Ensuring the DatePicker component is accessible to all users.

### Keyboard Navigation

How users can interact with the calendar:

- Tab to focus calendar
- Arrow keys for navigation
- Enter to select date
- Space to open calendar
- Escape to close calendar

### Screen Readers

How the component communicates with assistive technologies:

- Date announcements
- Selected state
- Error messages
- Calendar navigation
- Date descriptions

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

Testing individual date picker functionality:

```tsx
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '@/components/form';
import '@testing-library/jest-dom';

describe('DatePicker', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders correctly', () => {
    render(
      <DatePicker
        label="Test Date"
        value={null}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Test Date')).toBeInTheDocument();
  });

  it('opens calendar on click', async () => {
    render(
      <DatePicker
        label="Test Date"
        value={null}
        onChange={mockOnChange}
      />
    );
    
    await userEvent.click(screen.getByRole('textbox'));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('selects date', async () => {
    const date = new Date('2024-01-01');
    render(
      <DatePicker
        label="Test Date"
        value={null}
        onChange={mockOnChange}
      />
    );
    
    await userEvent.click(screen.getByRole('textbox'));
    await userEvent.click(screen.getByText('1'));
    
    expect(mockOnChange).toHaveBeenCalledWith(date);
  });

  it('handles disabled dates', () => {
    const disabledDate = new Date('2024-01-01');
    render(
      <DatePicker
        label="Test Date"
        value={null}
        onChange={mockOnChange}
        disabledDates={[disabledDate]}
      />
    );
    
    const dateButton = screen.getByText('1');
    expect(dateButton).toHaveAttribute('aria-disabled', 'true');
  });
});
```

### Integration Tests

Testing date picker behavior with form validation:

```tsx
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, DatePicker } from '@/components/form';
import '@testing-library/jest-dom';

describe('DatePicker Integration', () => {
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    mockHandleSubmit.mockClear();
  });

  it('validates date range', async () => {
    render(
      <Form onSubmit={mockHandleSubmit}>
        <DatePicker
          label="Start Date"
          name="startDate"
          required
        />
        <DatePicker
          label="End Date"
          name="endDate"
          required
        />
        <button type="submit">Submit</button>
      </Form>
    );
    
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Start date is required')).toBeVisible();
  });

  it('handles date format validation', async () => {
    render(
      <Form>
        <DatePicker
          label="Date"
          format="MM/dd/yyyy"
        />
      </Form>
    );
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'invalid');
    expect(screen.getByText('Invalid date format')).toBeVisible();
  });
});
```

### E2E Tests

Testing date picker behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('DatePicker', () => {
  test('handles date selection', async ({ page }) => {
    await page.goto('/date-picker-demo');
    
    // Open calendar
    await page.getByLabel('Select Date').click();
    
    // Select date
    await page.getByText('15').click();
    
    // Verify selection
    const input = page.getByRole('textbox');
    await expect(input).toHaveValue(/15/);
  });

  test('handles keyboard navigation', async ({ page }) => {
    await page.goto('/date-picker-demo');
    
    // Focus input
    await page.getByLabel('Select Date').focus();
    
    // Open calendar with space
    await page.keyboard.press('Space');
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    
    // Verify selection
    const input = page.getByRole('textbox');
    await expect(input).toHaveValue(/.+/);
  });
});
```

## Design Guidelines

Best practices for implementing the DatePicker component.

### Visual Design

Core visual principles:

- Calendar layout
- Date highlighting
- Input formatting
- Error states
- Focus indicators

### Layout Considerations

How to handle different layout scenarios:

- Calendar positioning
- Input width
- Mobile responsiveness
- Error message placement
- Helper text alignment

## Performance Considerations

Guidelines for optimal date picker performance:

- Date calculations
- Calendar rendering
- Event handling
- Memory management
- DOM updates

## Related Components

Components commonly used with DatePicker:

- Time Range Picker - For time range selection
- Date Range Picker - For date range selection
- Calendar - For calendar display
- [FormField](/react-component-patterns/form/form-field.md) - For field wrapper
- [Input](/react-component-patterns/form/input.md) - For manual date input

## Resources

Additional documentation and references:

- [Date Format Patterns](#)
- [Calendar Best Practices](#)
- [Accessibility Guidelines](#)