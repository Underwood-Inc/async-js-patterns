---
title: Overlay Components
description: Components for displaying content in modals, drawers, popovers, and tooltips
date: 2024-01-01
author: Underwood Inc
tags:
  - Overlay
  - Modal
  - Drawer
  - React
---

# Overlay Components

## Overview

Overlay components display content that temporarily appears above the main interface. These components include modals, drawers, popovers, and tooltips that help manage complex interactions and additional content.

## Components

### Modals

- [Modal](./modals/modal.md) - Feature-rich modal dialog component
- [Dialog](./modals/dialog.md) - Simple dialog boxes
- [Confirm](./modals/confirm.md) - Confirmation dialogs
- [Sheet](./modals/sheet.md) - Full-screen modal dialogs

### Drawers

- [Drawer](./drawers/drawer.md) - Slide-out panel component
- [SidePanel](./drawers/side-panel.md) - Persistent side panels
- [BottomSheet](./drawers/bottom-sheet.md) - Mobile-optimized bottom drawers

### Contextual Overlays

- [Popover](./contextual-overlays/popover.md) - Context-sensitive overlays
- [Tooltip](./contextual-overlays/tooltip.md) - Hover tooltips
- [ContextMenu](./contextual-overlays/context-menu.md) - Right-click menus
- [Dropdown](./contextual-overlays/dropdown.md) - Dropdown menus

## Best Practices

### Positioning

- Handle viewport constraints
- Maintain proper stacking order
- Support scroll locking
- Handle mobile viewports
- Consider touch zones

### Interaction

- Manage focus properly
- Support keyboard navigation
- Handle click outside
- Provide escape actions
- Consider animations

### Accessibility

- Use proper ARIA roles
- Manage focus trap
- Support screen readers
- Handle keyboard events
- Provide clear labels

### Performance

- Lazy load content
- Optimize animations
- Handle mounting/unmounting
- Manage event listeners
- Clean up resources

## Related Sections

- [Feedback](../feedback/index.md) - Feedback components
- [Navigation](../navigation/index.md) - Navigation components
- [Layout](../layout/index.md) - Layout components 