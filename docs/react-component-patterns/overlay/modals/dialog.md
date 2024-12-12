---
title: Dialog
description: Simple dialog boxes for basic interactions and confirmations
date: 2024-01-01
author: Underwood Inc
tags:
  - Overlay
  - Dialog
  - React
---

# Dialog Component

## Overview

The Dialog component provides a simple modal interface for basic interactions and confirmations. It's a lighter alternative to the Modal component, optimized for quick decisions and simple forms.

## Usage

```tsx
import { Dialog, Button } from '@underwood/components';
import { useState } from 'react';

function DialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      title="Delete Item"
      onClose={() => setOpen(false)}
      actions={
        <>
          <Button variant="primary" onClick={() => handleDelete()}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </>
      }
    >
      Are you sure you want to delete this item? This action cannot be undone.
    </Dialog>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Controls dialog visibility |
| `title` | string | - | Dialog title |
| `onClose` | function | - | Callback when dialog closes |
| `children` | ReactNode | - | Dialog content |
| `actions` | ReactNode | - | Action buttons |
| `size` | 'small' \| 'medium' | 'small' | Dialog size |
| `closeOnOverlayClick` | boolean | true | Close when clicking overlay |
| `closeOnEscape` | boolean | true | Close when pressing Escape |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Examples

### Basic Dialog

```tsx
<Dialog
  open={true}
  title="Update Settings"
  onClose={handleClose}
  actions={
    <Button variant="primary" onClick={handleSave}>
      Save Changes
    </Button>
  }
>
  <p>Choose your notification preferences:</p>
  <div>
    <Checkbox label="Email notifications" />
    <Checkbox label="Push notifications" />
  </div>
</Dialog>
```

### Alert Dialog

```tsx
<Dialog
  open={true}
  title="Warning"
  onClose={handleClose}
  actions={
    <Button variant="primary" onClick={handleClose}>
      Got it
    </Button>
  }
>
  Your session will expire in 5 minutes. Please save your work.
</Dialog>
```

### Form Dialog

```tsx
<Dialog
  open={true}
  title="Add Contact"
  onClose={handleClose}
  actions={
    <>
      <Button variant="primary" onClick={handleSubmit}>
        Add
      </Button>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
    </>
  }
>
  <form onSubmit={handleSubmit}>
    <TextField
      label="Name"
      value={name}
      onChange={setName}
      required
    />
    <TextField
      label="Email"
      type="email"
      value={email}
      onChange={setEmail}
      required
    />
  </form>
</Dialog>
```

## Best Practices

1. **Content**
   - Keep content focused and concise
   - Use clear action labels
   - Maintain consistent layout

2. **Interaction**
   - Handle keyboard navigation
   - Manage focus properly
   - Support escape key

3. **Accessibility**
   - Use proper ARIA roles
   - Support screen readers
   - Maintain focus trap

4. **Visual Design**
   - Keep styling minimal
   - Use consistent spacing
   - Align actions properly

## Related Components

- [Modal](./modal.md) - For complex modal dialogs
- [Confirm](./confirm.md) - For confirmation dialogs
- [Sheet](./sheet.md) - For full-screen modals
