---
title: RichText Component
description: Rich text editor component with formatting tools, markdown support, and customizable toolbar
category: Components
subcategory: Form
date: 2024-01-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Editor
  - Text
  - React
---

# RichText Component

## Overview

The RichText component provides a full-featured rich text editor with formatting tools, markdown support, and customizable toolbar options. It supports various content formats, keyboard shortcuts, and collaborative editing while maintaining accessibility standards. This component is essential for handling complex text input in forms and content management systems.

## Key Features

A comprehensive set of features for rich text editing:

- Text formatting
- Markdown support
- Keyboard shortcuts
- Image handling
- Link management
- Table support
- List formatting
- Code blocks
- Custom plugins
- Collaborative editing
- History management
- Accessibility support

## Usage Guidelines

This section demonstrates how to implement the RichText component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the RichText component:

```tsx
import * as React from 'react';
import { RichText } from '@/components/form';

export const BasicRichTextExample: React.FC = () => {
  const [content, setContent] = React.useState('');

  return (
    <RichText
      label="Content"
      value={content}
      onChange={setContent}
    />
  );
};
```

### Advanced Usage

Examples of more complex implementations:

```tsx
import * as React from 'react';
import { RichText } from '@/components/form';
import { uploadImage } from '@/utils/upload';

export const AdvancedRichTextExample: React.FC = () => {
  const [content, setContent] = React.useState('');
  const [wordCount, setWordCount] = React.useState(0);
  const [error, setError] = React.useState('');

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImage(file);
      return url;
    } catch (err) {
      setError('Failed to upload image');
      return null;
    }
  };

  const customPlugins = [
    {
      name: 'wordCount',
      render: () => (
        <div className="word-count">
          Words: {wordCount}
        </div>
      )
    }
  ];

  const customToolbar = [
    ['bold', 'italic', 'underline'],
    ['h1', 'h2', 'h3'],
    ['link', 'image'],
    ['code', 'codeBlock'],
    ['wordCount']
  ];

  return (
    <>
      <RichText
        label="Blog Post"
        value={content}
        onChange={(value, { wordCount }) => {
          setContent(value);
          setWordCount(wordCount);
        }}
        plugins={customPlugins}
        toolbar={customToolbar}
        imageUpload={handleImageUpload}
        maxLength={5000}
        placeholder="Write your blog post..."
        error={error}
      />

      <RichText
        label="Comment"
        value={content}
        onChange={setContent}
        toolbar={['bold', 'italic', 'link']}
        maxLength={500}
        minHeight={100}
        maxHeight={300}
        readOnly={!isLoggedIn}
      />

      <RichText
        label="Collaborative Document"
        value={content}
        onChange={setContent}
        collaborative
        presenceList={[
          { id: 1, name: 'John', color: '#ff0000' },
          { id: 2, name: 'Jane', color: '#00ff00' }
        ]}
        autosave
        autosaveInterval={5000}
      />
    </>
  );
};
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | Required | Editor content |
| onChange | `(value: string, meta: EditorMeta) => void` | Required | Change handler |
| label | `string` | - | Field label |
| plugins | `Plugin[]` | - | Custom plugins |
| toolbar | `(string \| string[])[]` | - | Toolbar config |
| imageUpload | `(file: File) => Promise<string \| null>` | - | Image handler |
| maxLength | `number` | - | Maximum length |
| minHeight | `number` | - | Minimum height |
| maxHeight | `number` | - | Maximum height |
| placeholder | `string` | - | Placeholder text |
| readOnly | `boolean` | `false` | Read-only mode |
| collaborative | `boolean` | `false` | Enable collaboration |
| presenceList | `User[]` | - | Active users |
| autosave | `boolean` | `false` | Enable autosave |
| autosaveInterval | `number` | `5000` | Autosave delay |

## Accessibility

Ensuring the RichText component is accessible to all users.

### Keyboard Navigation

How users can interact with the editor:

- Tab through controls
- Arrow keys for navigation
- Shortcuts for formatting
- Enter/Shift+Enter
- Escape to exit menus

### Screen Readers

How the component communicates with assistive technologies:

- Toolbar descriptions
- Format announcements
- Error messages
- Status updates
- Content structure

### Best Practices

Guidelines for maintaining accessibility:

- Clear labeling
- Keyboard shortcuts
- ARIA attributes
- Focus management
- Content structure

## Testing

A comprehensive testing strategy to ensure reliability.

### Unit Tests

Testing individual editor functionality:

```tsx
/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { RichText } from '@/components/form';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('RichText', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders correctly', () => {
    render(
      <RichText
        label="Test Editor"
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByLabelText('Test Editor')).toBeInTheDocument();
  });

  it('handles text input', async () => {
    render(
      <RichText
        label="Test Editor"
        value=""
        onChange={mockOnChange}
      />
    );

    const user = userEvent.setup();
    const editor = screen.getByRole('textbox');
    await user.type(editor, 'Hello, World!');

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.stringContaining('Hello, World!'),
      expect.any(Object)
    );
  });

  it('applies formatting', async () => {
    render(
      <RichText
        label="Test Editor"
        value=""
        onChange={mockOnChange}
      />
    );

    const user = userEvent.setup();
    const boldButton = screen.getByRole('button', { name: /bold/i });
    await user.click(boldButton);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.stringContaining('<strong>'),
      expect.any(Object)
    );
  });

  it('handles image upload', async () => {
    const mockUpload = vi.fn().mockResolvedValue('image.jpg');
    render(
      <RichText
        label="Test Editor"
        value=""
        onChange={mockOnChange}
        imageUpload={mockUpload}
      />
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload image/i);

    const user = userEvent.setup();
    await user.upload(input, file);

    expect(mockUpload).toHaveBeenCalledWith(file);
  });
});
```

### Integration Tests

Testing editor behavior with form validation:

```tsx
/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Form, RichText } from '@/components/form';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('RichText Integration', () => {
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    mockHandleSubmit.mockClear();
  });

  it('validates required field', async () => {
    render(
      <Form onSubmit={mockHandleSubmit}>
        <RichText
          label="Content"
          value=""
          onChange={vi.fn()}
          required
        />
        <button type="submit">Submit</button>
      </Form>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Content is required')).toBeVisible();
  });

  it('handles character limit', async () => {
    render(
      <Form>
        <RichText
          label="Comment"
          value=""
          onChange={vi.fn()}
          maxLength={10}
        />
      </Form>
    );

    const user = userEvent.setup();
    const editor = screen.getByRole('textbox');
    await user.type(editor, 'Hello, World!');

    expect(screen.getByText('Character limit exceeded')).toBeVisible();
  });
});
```

### E2E Tests

Testing editor behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('RichText', () => {
  test('handles basic formatting', async ({ page }) => {
    await page.goto('/rich-text-demo');

    // Type text
    await page.getByRole('textbox').type('Hello, World!');

    // Apply bold
    await page.getByRole('button', { name: 'Bold' }).click();
    await page.getByRole('textbox').type('Bold text');

    // Verify formatting
    const content = await page.evaluate(() => {
      const editor = document.querySelector('[contenteditable="true"]');
      return editor?.innerHTML;
    });

    expect(content).toContain('<strong>Bold text</strong>');
  });

  test('handles collaborative editing', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    await page1.goto('/rich-text-demo');
    await page2.goto('/rich-text-demo');

    // User 1 types
    await page1.getByRole('textbox').type('Hello');

    // Verify User 2 sees the update
    await expect(page2.getByText('Hello')).toBeVisible();

    // User 2 types
    await page2.getByRole('textbox').type(', World!');

    // Verify User 1 sees the update
    await expect(page1.getByText('Hello, World!')).toBeVisible();
  });
});
```

## Design Guidelines

Best practices for implementing the RichText component.

### Visual Design

Core visual principles:

- Toolbar layout
- Text formatting
- Content spacing
- Focus indicators
- Status feedback

### Layout Considerations

How to handle different layout scenarios:

- Toolbar positioning
- Editor sizing
- Content overflow
- Mobile responsiveness
- Plugin placement

## Performance Considerations

Guidelines for optimal editor performance:

- Content rendering
- Change handling
- History management
- Collaborative sync
- Memory cleanup

## Related Components

Components commonly used with RichText:

- [FormField](/react-component-patterns/form/form-field.md) - For field wrapper
- [Toolbar](/react-component-patterns/navigation/toolbar.md) - For formatting tools
- [ImageUpload](/react-component-patterns/form/image-upload.md) - For image handling
- [MarkdownPreview](/react-component-patterns/data/markdown-preview.md) - For content preview

## Resources

Additional documentation and references:

- [Rich Text Patterns](#)
- [Editor Guidelines](#)
- [Accessibility Best Practices](#)