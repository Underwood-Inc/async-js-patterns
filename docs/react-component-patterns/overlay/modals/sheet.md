---
title: Sheet
description: Full-screen modal component for immersive experiences
date: 2024-01-01
author: Underwood Inc
tags:
  - Overlay
  - Sheet
  - React
---

# Sheet Component

## Overview

The Sheet component provides a full-screen modal experience, ideal for complex workflows, detailed forms, or immersive content viewing. It offers more space and flexibility than standard modals while maintaining a clear context switch.

## Usage

```tsx
import { Sheet, Button } from '@underwood/components';
import { useState } from 'react';

function SheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      title="Edit Profile"
      onClose={() => setOpen(false)}
      actions={
        <>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </>
      }
    >
      <div className="sheet-content">
        <form onSubmit={handleSubmit}>
          {/* Complex form content */}
        </form>
      </div>
    </Sheet>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Controls sheet visibility |
| `title` | string | - | Sheet title |
| `onClose` | function | - | Callback when sheet closes |
| `children` | ReactNode | - | Sheet content |
| `actions` | ReactNode | - | Action buttons |
| `position` | 'left' \| 'right' \| 'top' \| 'bottom' | 'right' | Sheet entry position |
| `closeOnEscape` | boolean | true | Close when pressing Escape |
| `showCloseButton` | boolean | true | Show close button |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Examples

### Basic Sheet

```tsx
<Sheet
  open={true}
  title="Document Preview"
  onClose={handleClose}
>
  <div className="preview-content">
    <DocumentViewer document={document} />
  </div>
</Sheet>
```

### Form Sheet

```tsx
<Sheet
  open={true}
  title="Create New Project"
  position="right"
  actions={
    <>
      <Button variant="primary" onClick={handleCreate}>
        Create Project
      </Button>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
    </>
  }
>
  <form className="project-form">
    <TextField
      label="Project Name"
      value={name}
      onChange={setName}
      required
    />
    <TextArea
      label="Description"
      value={description}
      onChange={setDescription}
    />
    <Select
      label="Template"
      options={templates}
      value={template}
      onChange={setTemplate}
    />
  </form>
</Sheet>
```

### Image Gallery Sheet

```tsx
<Sheet
  open={true}
  title="Photo Gallery"
  position="bottom"
  style={{ backgroundColor: '#000' }}
>
  <div className="gallery-grid">
    {images.map(image => (
      <img
        key={image.id}
        src={image.url}
        alt={image.title}
        onClick={() => selectImage(image)}
      />
    ))}
  </div>
</Sheet>
```

### Settings Sheet

```tsx
<Sheet
  open={true}
  title="Settings"
  position="left"
  actions={
    <Button variant="primary" onClick={handleSave}>
      Save Settings
    </Button>
  }
>
  <div className="settings-content">
    <Section title="General">
      <Toggle label="Dark Mode" />
      <Toggle label="Notifications" />
    </Section>
    <Section title="Privacy">
      <RadioGroup
        options={privacyOptions}
        value={privacy}
        onChange={setPrivacy}
      />
    </Section>
  </div>
</Sheet>
```

## Best Practices

1. **Layout**
   - Use full height effectively
   - Organize content clearly
   - Consider scrolling behavior

2. **Navigation**
   - Provide clear exit points
   - Support keyboard navigation
   - Handle back button

3. **Content**
   - Structure information logically
   - Use appropriate spacing
   - Consider mobile views

4. **Performance**
   - Lazy load content
   - Optimize animations
   - Handle large datasets

## Related Components

- [Modal](./modal.md) - For standard modal dialogs
- [Dialog](./dialog.md) - For simple dialogs
- [Drawer](../drawers/drawer.md) - For slide-out panels 