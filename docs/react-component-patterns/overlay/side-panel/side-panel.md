---
title: SidePanel
description: A persistent panel that appears alongside the main content
date: 2024-01-01
author: Underwood Inc
tags:
  - Overlay
  - SidePanel
  - React
---

# SidePanel Component

## Overview

The SidePanel component is a persistent panel that appears alongside the main content. Unlike drawers, side panels are designed to be visible for longer periods and often contain complementary content or controls that need to remain accessible while interacting with the main content.

## Usage

```tsx
import { SidePanel } from '@underwood/components';

function SidePanelExample() {
  return (
    <div className="layout">
      <main>Main Content</main>
      <SidePanel
        width={400}
        resizable
      >
        <div className="details-panel">
          <h2>Item Details</h2>
          <div className="content">
            {/* Panel content */}
          </div>
        </div>
      </SidePanel>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number \| string | 400 | Panel width |
| `position` | 'left' \| 'right' | 'right' | Panel position |
| `resizable` | boolean | false | Enable resize handle |
| `minWidth` | number | 200 | Minimum width when resizable |
| `maxWidth` | number | '50%' | Maximum width when resizable |
| `collapsible` | boolean | false | Enable collapse button |
| `collapsed` | boolean | false | Control collapsed state |
| `onCollapse` | function | - | Collapse state change handler |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Examples

### Details Panel

```tsx
<SidePanel
  width={400}
  resizable
  collapsible
>
  <div className="details-view">
    <header>
      <h2>{item.title}</h2>
      <Button icon={<CloseIcon />} onClick={closePanel} />
    </header>
    <div className="content">
      <PropertyList>
        <Property label="Created" value={item.createdAt} />
        <Property label="Modified" value={item.modifiedAt} />
        <Property label="Owner" value={item.owner} />
      </PropertyList>
      <TabGroup>
        <Tab label="Details">
          <ItemDetails item={item} />
        </Tab>
        <Tab label="History">
          <ItemHistory item={item} />
        </Tab>
      </TabGroup>
    </div>
  </div>
</SidePanel>
```

### Inspector Panel

```tsx
<SidePanel
  position="right"
  width={320}
  resizable
>
  <div className="inspector">
    <header>
      <h3>Properties</h3>
    </header>
    <div className="properties">
      <FormGroup>
        <TextField
          label="Name"
          value={selected.name}
          onChange={handleNameChange}
        />
        <ColorPicker
          label="Fill Color"
          value={selected.color}
          onChange={handleColorChange}
        />
        <NumberField
          label="Opacity"
          value={selected.opacity}
          min={0}
          max={1}
          step={0.1}
          onChange={handleOpacityChange}
        />
      </FormGroup>
    </div>
  </div>
</SidePanel>
```

### Preview Panel

```tsx
<SidePanel
  position="right"
  width="40%"
  collapsible
>
  <div className="preview-panel">
    <header>
      <h3>Preview</h3>
      <ViewControls>
        <Button icon={<DesktopIcon />} />
        <Button icon={<TabletIcon />} />
        <Button icon={<MobileIcon />} />
      </ViewControls>
    </header>
    <div className="preview-content">
      <iframe
        src={previewUrl}
        title="Preview"
        width="100%"
        height="100%"
      />
    </div>
  </div>
</SidePanel>
```

## Best Practices

1. **Layout**
   - Consider panel width impact on main content
   - Use responsive widths when needed
   - Provide resize controls for flexibility

2. **Content Organization**
   - Use clear section headers
   - Group related controls
   - Maintain consistent spacing

3. **Interaction**
   - Support keyboard shortcuts
   - Provide collapse/expand controls
   - Handle resize smoothly

4. **Performance**
   - Lazy load content when possible
   - Optimize panel rendering
   - Handle large content sets efficiently

## Related Components

- [Drawer](/react-component-patterns/overlay/drawer/drawer.md) - For temporary sliding panels
- [Sheet](/react-component-patterns/overlay/modals/sheet.md) - For full-screen overlays
- [Split](/react-component-patterns/layout/split.md) - For resizable split views
