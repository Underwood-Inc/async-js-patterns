---
title: Tooltip System Guide
description: Learn how to use and extend the tooltip system
---

# Tooltip System Guide

## Overview

Our tooltip system provides a flexible, performant way to add contextual information throughout the application. It supports both hover and click interactions, handles positioning automatically, and integrates with our portal system for optimal rendering.

## Quick Start

### Basic Usage

The simplest way to add a tooltip is using the `has-tooltip` class:

```html:preview
<div class="has-tooltip">
  Hover over me
</div>
```

### Ad-hoc Tooltips

For more complex tooltips, use the `createAdHocTooltip` function:

```typescript:preview
import { createAdHocTooltip } from '../tooltips/adhocTooltips';

const tooltip = createAdHocTooltip({
  id: 'custom-tooltip',
  content: 'Custom tooltip content',
  trigger: 'hover-target',
  appearance: {
    theme: 'dark',
    position: 'bottom',
  },
});
```

## System Architecture

### Components

1. **Portal System**

   - Manages tooltip rendering outside component trees
   - Prevents z-index and overflow issues
   - Handles positioning and stacking

2. **Event Management**

   - Tracks hover and click interactions
   - Manages tooltip lifecycle
   - Handles cleanup and memory management

3. **Positioning Engine**
   - Calculates optimal tooltip placement
   - Handles viewport boundaries
   - Manages scroll containers

## Testing

### Unit Tests

```typescript:preview
import { describe, it, expect, vi } from 'vitest';

describe('Tooltip System', () => {
  it('creates tooltip with correct config', () => {
    const tooltip = createAdHocTooltip({
      id: 'test',
      content: 'Test content',
      trigger: 'test-trigger',
    });

    expect(tooltip.id).toBe('test');
  });
});
```

### Debug Mode

Enable debug mode during development:

```typescript:preview
import { toggleTooltipDebug } from '../tooltips/debug';

// Enable debug logging
toggleTooltipDebug(true);
```

Debug features include:

- Console logging of lifecycle events
- Visual indicators for trigger zones
- Performance metrics
- Event timing information

## Best Practices

1. **Performance**

   - Use basic tooltips for simple text
   - Leverage event delegation
   - Clean up custom tooltips when components unmount

2. **Accessibility**

   - Include aria-label attributes
   - Ensure keyboard navigation
   - Maintain proper contrast ratios

3. **Content Guidelines**
   - Keep content concise
   - Use consistent formatting
   - Avoid redundant information

## API Reference

### CustomTooltip Interface

```typescript:preview
interface CustomTooltip {
  id: string;
  content: string | Component;
  trigger: string | string[];
  appearance?: {
    theme?: 'light' | 'dark' | 'custom';
    position?: 'top' | 'bottom' | 'left' | 'right';
    offset?: number;
    animation?: string;
    customClass?: string;
  };
  portal?: {
    target?: string;
    strategy?: 'fixed' | 'absolute';
  };
}
```

## Troubleshooting

### Common Issues

1. **Tooltip Flicker**

   - Check z-index configuration
   - Verify hover zones
   - Review event timing

2. **Position Issues**

   - Validate scroll containers
   - Check viewport boundaries
   - Review transform origins

3. **Performance**
   - Monitor active tooltip count
   - Review event listeners
   - Check DOM updates
