---
title: FileUpload Component
description: File upload component with drag and drop support, file validation, and progress tracking
category: Components
subcategory: Form
date: 2024-12-01
author: Underwood Inc
status: Stable
tags:
  - Form
  - Upload
  - Files
  - React
---

# FileUpload Component

## Overview

The FileUpload component provides a comprehensive interface for handling file uploads. It supports drag and drop, file validation, progress tracking, and multiple file selection while maintaining accessibility standards. This component is essential for handling file inputs in forms and document management interfaces.

## Key Features

A comprehensive set of features for file uploads:

- Drag and drop
- Multiple file support
- File validation
- Progress tracking
- File previews
- Size limits
- Type restrictions
- Accessibility support

## Usage Guidelines

This section demonstrates how to implement the FileUpload component, from basic usage to advanced scenarios.

### Basic Usage

The simplest implementation of the FileUpload component:

```tsx
import * as React from 'react';
import { FileUpload } from '@/components/form';

export const BasicFileUploadExample: React.FC = () => {
  const handleUpload = async (files: File[]) => {
    // Handle file upload logic
    console.log('Uploading files:', files);
  };

  return (
    <FileUpload
      label="Upload File"
      onUpload={handleUpload}
      accept="image/*"
    />
  );
};
```

### Advanced Usage

Examples of more complex implementations:

```tsx
import * as React from 'react';
import { FileUpload } from '@/components/form';

export const AdvancedFileUploadExample: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState('');

  const validateFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG and PDF files are allowed';
    }

    return '';
  };

  const handleUpload = async (files: File[]) => {
    setError('');
    setProgress(0);

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      // Simulated upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setFiles(prevFiles => [...prevFiles, ...files]);
    } catch (err) {
      setError('Upload failed. Please try again.');
    }
  };

  const handleRemove = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file));
  };

  return (
    <>
      <FileUpload
        label="Upload Documents"
        onUpload={handleUpload}
        onRemove={handleRemove}
        accept=".jpg,.jpeg,.png,.pdf"
        multiple
        maxSize={5 * 1024 * 1024}
        error={error}
        progress={progress}
        showPreview
        previewMaxHeight={200}
        dragAndDrop
      />

      <FileUpload
        label="Profile Picture"
        onUpload={handleUpload}
        accept="image/*"
        cropRatio={1}
        showCropper
        maxFiles={1}
        required
      />

      <FileUpload
        label="Attachments"
        onUpload={handleUpload}
        accept=".doc,.docx,.pdf"
        multiple
        maxFiles={5}
        showFileList
        customDropzoneText="Drag files here or click to browse"
      />
    </>
  );
};
```

## Props

A comprehensive list of available props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onUpload | `(files: File[]) => void` | Required | Upload handler |
| label | `string` | - | Field label |
| accept | `string` | - | Accepted file types |
| multiple | `boolean` | `false` | Allow multiple files |
| maxSize | `number` | - | Maximum file size |
| maxFiles | `number` | - | Maximum file count |
| error | `string` | - | Error message |
| progress | `number` | - | Upload progress |
| showPreview | `boolean` | `false` | Show file preview |
| previewMaxHeight | `number` | - | Preview height limit |
| dragAndDrop | `boolean` | `false` | Enable drag and drop |
| showCropper | `boolean` | `false` | Show image cropper |
| cropRatio | `number` | - | Crop aspect ratio |
| showFileList | `boolean` | `false` | Show file list |
| onRemove | `(file: File) => void` | - | Remove handler |

## Accessibility

Ensuring the FileUpload component is accessible to all users.

### Keyboard Navigation

How users can interact with the upload interface:

- Tab to focus controls
- Space to open file dialog
- Enter to submit
- Delete to remove files
- Escape to cancel

### Screen Readers

How the component communicates with assistive technologies:

- Upload status
- File information
- Error messages
- Progress updates
- Success feedback

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

Testing individual upload functionality:

```tsx
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { FileUpload } from '@/components/form';

describe('FileUpload', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    mockOnUpload.mockClear();
  });

  it('renders correctly', () => {
    render(
      <FileUpload
        label="Test Upload"
        onUpload={mockOnUpload}
      />
    );
    expect(screen.getByLabelText('Test Upload')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(
      <FileUpload
        label="Test Upload"
        onUpload={mockOnUpload}
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Test Upload');

    const user = userEvent.setup();
    await user.upload(input, file);

    expect(mockOnUpload).toHaveBeenCalledWith([file]);
  });

  it('shows error for invalid file type', async () => {
    render(
      <FileUpload
        label="Test Upload"
        onUpload={mockOnUpload}
        accept="image/*"
      />
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Test Upload');

    const user = userEvent.setup();
    await user.upload(input, file);

    expect(screen.getByText('Invalid file type')).toBeVisible();
  });

  it('shows progress during upload', async () => {
    render(
      <FileUpload
        label="Test Upload"
        onUpload={mockOnUpload}
        progress={50}
      />
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
  });
});
```

### Integration Tests

Testing upload behavior with form validation:

```tsx
import { describe, it, expect } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Form, FileUpload } from '@/components/form';
import userEvent from '@testing-library/user-event';

describe('FileUpload Integration', () => {
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    mockHandleSubmit.mockClear();
  });

  it('validates required file', async () => {
    render(
      <Form onSubmit={mockHandleSubmit}>
        <FileUpload
          label="Required File"
          onUpload={jest.fn()}
          required
        />
        <button type="submit">Submit</button>
      </Form>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('File is required')).toBeVisible();
  });

  it('handles multiple file upload', async () => {
    const mockOnUpload = jest.fn();
    render(
      <Form>
        <FileUpload
          label="Multiple Files"
          onUpload={mockOnUpload}
          multiple
          maxFiles={3}
        />
      </Form>
    );

    const files = [
      new File(['test1'], 'test1.txt', { type: 'text/plain' }),
      new File(['test2'], 'test2.txt', { type: 'text/plain' })
    ];

    const input = screen.getByLabelText('Multiple Files');
    const user = userEvent.setup();
    await user.upload(input, files);

    expect(mockOnUpload).toHaveBeenCalledWith(files);
  });
});
```

### E2E Tests

Testing upload behavior in a real browser environment:

```typescript
import { test, expect } from '@playwright/test';

test.describe('FileUpload', () => {
  test('handles file upload', async ({ page }) => {
    await page.goto('/file-upload-demo');

    // Upload file
    await page.setInputFiles('input[type="file"]', {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content')
    });

    // Verify upload success
    await expect(page.getByText('Upload successful')).toBeVisible();
  });

  test('handles drag and drop', async ({ page }) => {
    await page.goto('/file-upload-demo');

    // Create file data
    const fileData = {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content')
    };

    // Simulate drag and drop
    await page.evaluate(() => {
      const dropzone = document.querySelector('.dropzone');
      const event = new DragEvent('drop', {
        dataTransfer: new DataTransfer()
      });
      dropzone?.dispatchEvent(event);
    });

    // Verify drop handling
    await expect(page.getByText('File dropped')).toBeVisible();
  });
});
```

## Design Guidelines

Best practices for implementing the FileUpload component.

### Visual Design

Core visual principles:

- Upload area styling
- Progress indication
- Preview thumbnails
- Error states
- Focus indicators

### Layout Considerations

How to handle different layout scenarios:

- Dropzone sizing
- Preview layout
- Progress bar placement
- Error message position
- File list display

## Performance Considerations

Guidelines for optimal upload performance:

- File validation
- Chunk uploading
- Progress tracking
- Memory management
- Image optimization

## Related Components

Components commonly used with FileUpload:

- Progress Bar - For upload progress
- Image Cropper - For image editing
- File List - For file management
- [FormField](/react-component-patterns/form/form-field.md) - For field wrapper
- [Input](/react-component-patterns/form/input.md) - For file input

## Resources

Additional documentation and references:

- [File Upload Patterns](#)
- [Drag and Drop Guidelines](#)
- [Accessibility Best Practices](#)