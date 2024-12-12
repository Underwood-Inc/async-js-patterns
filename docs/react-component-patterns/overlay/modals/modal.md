---
title: Modal
description: Modal dialog windows for focused user interactions
date: 2024-01-01
author: Underwood Inc
tags:
  - Overlay
  - Modal
  - React
---

# Modal Component

## Overview

The Modal component creates a dialog window that appears on top of the main content. It's used for focused interactions that require user attention or input before proceeding.

## Usage

```tsx
import { Modal, Button } from '@underwood/components';
import { WelcomeIcon } from '@underwood/icons';
import { Editor } from '@underwood/editor';
import { useState } from 'react';

// Basic modal example
function ModalExample() {
  const [open, setOpen] = useState(false);
  
  const handleConfirm = () => {
    // Confirmation logic
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      title="Confirm Action"
      onClose={() => setOpen(false)}
    >
      <div>
        <p>Are you sure you want to proceed?</p>
        <div style={{ marginTop: 16 }}>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Settings modal example
function SettingsModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      title="User Settings"
      onClose={onClose}
    >
      <div>
        <p>Configure your preferences here.</p>
      </div>
    </Modal>
  );
}

// Image preview modal
function ImagePreviewModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      title="Image Preview"
      size="large"
      onClose={onClose}
    >
      <img
        src="/images/preview.jpg"
        alt="Preview"
        style={{ width: '100%' }}
      />
    </Modal>
  );
}

// Full screen editor modal
function EditorModal({ open, onClose, content }) {
  return (
    <Modal
      open={open}
      title="Document Editor"
      fullScreen
      onClose={onClose}
    >
      <div style={{ padding: 24 }}>
        <Editor content={content} />
      </div>
    </Modal>
  );
}

// Welcome modal with custom styling
function WelcomeModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      title="Welcome"
      style={{
        borderRadius: 16,
        backgroundColor: '#f8f9fa'
      }}
      onClose={onClose}
    >
      <div style={{ textAlign: 'center' }}>
        <WelcomeIcon size={64} />
        <h2>Getting Started</h2>
        <p>Follow these steps to set up your account.</p>
      </div>
    </Modal>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Controls modal visibility |
| `title` | string | - | Modal title |
| `onClose` | function | - | Callback when modal closes |
| `children` | ReactNode | - | Modal content |
| `size` | 'small' \| 'medium' \| 'large' | 'medium' | Modal size |
| `fullScreen` | boolean | false | Whether to show in full screen |
| `closeOnOverlayClick` | boolean | true | Close when clicking overlay |
| `closeOnEscape` | boolean | true | Close when pressing Escape |
| `showCloseButton` | boolean | true | Show close button in header |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Examples

### Basic Modal

```tsx
<Modal
  open={true}
  title="User Settings"
  onClose={handleClose}
>
  <div>
    <p>Configure your preferences here.</p>
  </div>
</Modal>
```

### Custom Size Modal

```tsx
<Modal
  open={true}
  title="Image Preview"
  size="large"
  onClose={handleClose}
>
  <img
    src="/images/preview.jpg"
    alt="Preview"
    style={{ width: '100%' }}
  />
</Modal>
```

### Full Screen Modal

```tsx
<Modal
  open={true}
  title="Document Editor"
  fullScreen
  onClose={handleClose}
>
  <div style={{ padding: 24 }}>
    <Editor content={content} />
  </div>
</Modal>
```

### Custom Styled Modal

```tsx
<Modal
  open={true}
  title="Welcome"
  style={{
    borderRadius: 16,
    backgroundColor: '#f8f9fa'
  }}
  onClose={handleClose}
>
  <div style={{ textAlign: 'center' }}>
    <WelcomeIcon size={64} />
    <h2>Getting Started</h2>
    <p>Follow these steps to set up your account.</p>
  </div>
</Modal>
```

## Best Practices

1. **Focus Management**
   - Trap focus within modal
   - Restore focus on close
   - Support keyboard navigation

2. **Content**
   - Keep content focused
   - Use clear headings
   - Provide clear actions

3. **Accessibility**
   - Use proper ARIA roles
   - Support screen readers
   - Handle keyboard events

4. **Performance**
   - Lazy load content
   - Clean up on unmount
   - Handle animations smoothly

## Related Components

- [Dialog](./dialog.md) - For simple dialog boxes
- [Confirm](./confirm.md) - For confirmation dialogs
- [Sheet](./sheet.md) - For full-screen modals
