---
title: BottomSheet
description: A mobile-first panel that slides up from the bottom of the screen
date: 2024-01-01
author: Underwood Inc
tags:
  - Overlay
  - BottomSheet
  - React
---

# BottomSheet Component

## Overview

The BottomSheet component is a mobile-first interface pattern that slides up from the bottom of the screen. It's commonly used in mobile applications to display additional content, actions, or forms without leaving the current context. The component supports different snap points and drag gestures.

## Usage

```tsx
import { BottomSheet } from '@underwood/components';

function BottomSheetExample() {
  const [open, setOpen] = useState(false);

  return (
    <BottomSheet
      open={open}
      onClose={() => setOpen(false)}
      snapPoints={['25%', '50%', '90%']}
      initialSnap={1}
    >
      <div className="bottom-sheet-content">
        <h3>Select Option</h3>
        <div className="options-list">
          {/* Content */}
        </div>
      </div>
    </BottomSheet>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Controls sheet visibility |
| `onClose` | function | - | Callback when sheet closes |
| `snapPoints` | Array<string \| number> | ['50%'] | Snap point positions |
| `initialSnap` | number | 0 | Initial snap point index |
| `height` | string \| number | - | Fixed height (overrides snap points) |
| `draggable` | boolean | true | Enable drag gestures |
| `backdrop` | boolean | true | Show backdrop overlay |
| `rounded` | boolean | true | Apply rounded corners |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Examples

### Action Sheet

```tsx
<BottomSheet
  open={true}
  snapPoints={['auto']}
  rounded
>
  <div className="action-sheet">
    <header>
      <h3>Share Post</h3>
      <Button icon={<CloseIcon />} onClick={onClose} />
    </header>
    <div className="actions-grid">
      <ActionButton
        icon={<TwitterIcon />}
        label="Twitter"
        onClick={() => share('twitter')}
      />
      <ActionButton
        icon={<FacebookIcon />}
        label="Facebook"
        onClick={() => share('facebook')}
      />
      <ActionButton
        icon={<LinkedInIcon />}
        label="LinkedIn"
        onClick={() => share('linkedin')}
      />
      <ActionButton
        icon={<EmailIcon />}
        label="Email"
        onClick={() => share('email')}
      />
    </div>
  </div>
</BottomSheet>
```

### Form Sheet

```tsx
<BottomSheet
  open={true}
  snapPoints={['50%', '90%']}
  initialSnap={0}
>
  <div className="form-sheet">
    <header>
      <h3>Add Review</h3>
    </header>
    <form onSubmit={handleSubmit}>
      <RatingInput
        label="Rating"
        value={rating}
        onChange={setRating}
      />
      <TextField
        label="Title"
        value={title}
        onChange={setTitle}
        required
      />
      <TextArea
        label="Review"
        value={review}
        onChange={setReview}
        required
        expandable
      />
      <Button type="submit" variant="primary">
        Submit Review
      </Button>
    </form>
  </div>
</BottomSheet>
```

### Media Preview

```tsx
<BottomSheet
  open={true}
  snapPoints={['25%', '75%']}
  draggable
>
  <div className="media-preview">
    <div className="preview-header">
      <img src={album.cover} alt={album.title} />
      <div className="info">
        <h3>{album.title}</h3>
        <p>{album.artist}</p>
      </div>
    </div>
    <div className="track-list">
      {album.tracks.map(track => (
        <TrackItem
          key={track.id}
          title={track.title}
          duration={track.duration}
          onPlay={() => playTrack(track.id)}
        />
      ))}
    </div>
  </div>
</BottomSheet>
```

## Best Practices

1. **Mobile Experience**
   - Design for touch interactions
   - Use appropriate snap points
   - Support smooth animations

2. **Content**
   - Keep content scrollable
   - Show drag handle when needed
   - Use clear headings

3. **Interaction**
   - Support drag gestures
   - Handle swipe to dismiss
   - Provide close button

4. **Accessibility**
   - Support keyboard navigation
   - Use proper ARIA roles
   - Handle focus management

## Related Components

- [Sheet](../modals/sheet.md) - For full-screen overlays
- [Drawer](../drawer/drawer.md) - For side panels
- [Modal](../modals/modal.md) - For centered dialogs
