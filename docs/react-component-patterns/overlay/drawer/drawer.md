---
title: Drawer
description: A sliding panel that appears from the edge of the screen
date: 2024-01-01
author: Underwood Inc
tags:
  - Overlay
  - Drawer
  - React
---

# Drawer Component

## Overview

The Drawer component is a sliding panel that appears from the edge of the screen. It's commonly used for navigation menus, filters, or contextual actions. The drawer can slide in from any edge of the screen and can be temporary or persistent.

## Usage

```tsx
import { Drawer } from '@underwood/components';

function DrawerExample() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      position="left"
      width={300}
    >
      <nav>
        <ul>
          <li>Home</li>
          <li>Products</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </Drawer>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Controls drawer visibility |
| `onClose` | function | - | Callback when drawer closes |
| `position` | 'left' \| 'right' \| 'top' \| 'bottom' | 'left' | Drawer position |
| `width` | number \| string | 300 | Drawer width (for left/right) |
| `height` | number \| string | 300 | Drawer height (for top/bottom) |
| `variant` | 'temporary' \| 'persistent' | 'temporary' | Drawer behavior type |
| `backdrop` | boolean | true | Show backdrop overlay |
| `className` | string | - | Additional CSS class |
| `style` | object | - | Additional CSS styles |

## Examples

### Navigation Drawer

```tsx
<Drawer
  open={true}
  position="left"
  variant="persistent"
>
  <nav className="drawer-nav">
    <MenuItem icon={<HomeIcon />} href="/">Home</MenuItem>
    <MenuItem icon={<ShopIcon />} href="/products">Products</MenuItem>
    <MenuItem icon={<InfoIcon />} href="/about">About</MenuItem>
    <MenuItem icon={<ContactIcon />} href="/contact">Contact</MenuItem>
  </nav>
</Drawer>
```

### Filter Panel

```tsx
<Drawer
  open={true}
  position="right"
  width={400}
>
  <div className="filter-panel">
    <h3>Filters</h3>
    <FilterGroup
      title="Categories"
      options={categories}
      onChange={handleCategoryChange}
    />
    <FilterGroup
      title="Price Range"
      type="range"
      min={0}
      max={1000}
      onChange={handlePriceChange}
    />
    <FilterGroup
      title="Brands"
      options={brands}
      type="checkbox"
      onChange={handleBrandChange}
    />
  </div>
</Drawer>
```

### Cart Drawer

```tsx
<Drawer
  open={true}
  position="right"
  width={400}
>
  <div className="cart-drawer">
    <h3>Shopping Cart</h3>
    <div className="cart-items">
      {items.map(item => (
        <CartItem
          key={item.id}
          {...item}
          onRemove={() => removeItem(item.id)}
          onQuantityChange={(qty) => updateQuantity(item.id, qty)}
        />
      ))}
    </div>
    <div className="cart-summary">
      <div className="total">Total: ${total}</div>
      <Button variant="primary" onClick={checkout}>
        Checkout
      </Button>
    </div>
  </div>
</Drawer>
```

### Mobile Menu

```tsx
<Drawer
  open={true}
  position="bottom"
  height="90vh"
>
  <div className="mobile-menu">
    <div className="user-info">
      <Avatar src={user.avatar} />
      <span>{user.name}</span>
    </div>
    <nav>
      <MenuItem href="/profile">Profile</MenuItem>
      <MenuItem href="/settings">Settings</MenuItem>
      <MenuItem href="/help">Help</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </nav>
  </div>
</Drawer>
```

## Best Practices

1. **Position**
   - Use left/right for navigation and filters
   - Use bottom for mobile menus
   - Use top sparingly

2. **Content**
   - Keep content focused and organized
   - Use clear hierarchy
   - Include close button/mechanism

3. **Interaction**
   - Support swipe gestures on mobile
   - Handle keyboard navigation
   - Manage focus properly

4. **Accessibility**
   - Use proper ARIA roles
   - Support screen readers
   - Manage focus trap

## Related Components

- [Sheet](../modals/sheet.md) - For full-screen overlays
- [Modal](../modals/modal.md) - For centered dialogs
- [SidePanel](../side-panel/side-panel.md) - For persistent side content
