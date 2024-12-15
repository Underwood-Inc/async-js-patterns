---
title: Confirm
description: Specialized dialog component for confirmation actions
date: 2024-01-01
author: Underwood Inc
tags:
  - Overlay
  - Confirm
  - React
---

# Confirm Component

## Overview

The Confirm component is a specialized dialog for getting user confirmation before proceeding with important or destructive actions. It provides a consistent way to handle user confirmations across the application.

## Usage

```tsx
import { Confirm, Button } from '@underwood/components';
import { useState } from 'react';

function ConfirmExample() {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    // Handle confirmation
    setOpen(false);
  };

  return (
    <Confirm
      open={open}
      title="Delete Account"
      message="Are you sure you want to delete your account? This action cannot be undone."
      confirmLabel="Delete Account"
      cancelLabel="Keep Account"
      onConfirm={handleConfirm}
      onCancel={() => setOpen(false)}
      variant="danger"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Controls confirm dialog visibility |
| `title` | string | - | Dialog title |
| `message` | string | - | Confirmation message |
| `confirmLabel` | string | 'Confirm' | Label for confirm button |
| `cancelLabel` | string | 'Cancel' | Label for cancel button |
| `onConfirm` | function | - | Callback when confirmed |
| `onCancel` | function | - | Callback when cancelled |
| `variant` | 'default' \| 'danger' \| 'warning' | 'default' | Visual style variant |
| `loading` | boolean | false | Show loading state |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Examples

### Basic Confirmation

```tsx
<Confirm
  open={true}
  title="Save Changes"
  message="Do you want to save your changes?"
  onConfirm={handleSave}
  onCancel={handleCancel}
/>
```

### Dangerous Action

```tsx
<Confirm
  open={true}
  title="Delete Project"
  message="This will permanently delete the project and all its data. This action cannot be undone."
  confirmLabel="Delete Forever"
  cancelLabel="Cancel"
  variant="danger"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

### With Loading State

```tsx
<Confirm
  open={true}
  title="Publish Changes"
  message="Are you ready to publish these changes to production?"
  confirmLabel="Publish"
  loading={isPublishing}
  onConfirm={handlePublish}
  onCancel={handleCancel}
/>
```

### Warning Confirmation

```tsx
<Confirm
  open={true}
  title="Leave Page"
  message="You have unsaved changes. Are you sure you want to leave?"
  confirmLabel="Leave"
  cancelLabel="Stay"
  variant="warning"
  onConfirm={handleLeave}
  onCancel={handleStay}
/>
```

## Best Practices

1. **Messages**
   - Be clear about consequences
   - Use specific action verbs
   - Explain what will happen

2. **Actions**
   - Make destructive actions clear
   - Use appropriate variants
   - Consider loading states

3. **Interaction**
   - Support keyboard shortcuts
   - Handle loading states
   - Prevent accidental clicks

4. **Content**
   - Keep messages concise
   - Use clear language
   - Avoid technical jargon

## Related Components

- [Dialog](./dialog.md) - For general dialogs
- [Modal](./modal.md) - For complex modal dialogs
- [Sheet](./sheet.md) - For full-screen modals 