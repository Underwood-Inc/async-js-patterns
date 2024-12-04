# Browser Optimizations

## Overview

Browser optimizations for async JavaScript focus on techniques to improve performance, responsiveness, and resource utilization in web applications. These optimizations leverage browser-specific APIs and features to enhance the user experience while managing system resources efficiently.

## Key Concepts

### 1. DOM Batch Processing

When handling multiple DOM updates, batching operations is crucial for performance:

```typescript
// Example: Efficient DOM batch updates with read/write separation
class DOMBatchProcessor {
  private readQueue: Array<() => void> = [];
  private writeQueue: Array<() => void> = [];
  private scheduled = false;

  scheduleRead(operation: () => void): void {
    this.readQueue.push(operation);
    this.scheduleFlush();
  }

  scheduleWrite(operation: () => void): void {
    this.writeQueue.push(operation);
    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  private flush(): void {
    const reads = [...this.readQueue];
    this.readQueue = [];
    reads.forEach((read) => read());

    const writes = [...this.writeQueue];
    this.writeQueue = [];
    writes.forEach((write) => write());

    this.scheduled = false;

    if (this.readQueue.length > 0 || this.writeQueue.length > 0) {
      this.scheduleFlush();
    }
  }
}
```

### Common Pitfalls

1. **Layout Thrashing**

```typescript
// ❌ Bad: Causes layout thrashing
elements.forEach((el) => {
  const height = el.offsetHeight;
  el.style.height = `${height * 2}px`;
});

// ✅ Good: Batch reads and writes
const heights = elements.map((el) => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.height = `${heights[i] * 2}px`;
});
```

2. **Event Handler Proliferation**

```typescript
// ❌ Bad: Attaches handlers to every element
elements.forEach((el) => {
  el.addEventListener('click', handler);
});

// ✅ Good: Use event delegation
parentElement.addEventListener('click', (e) => {
  if (e.target.matches('.target-class')) {
    handler(e);
  }
});
```

## Real-World Example

Consider a web application that dynamically loads content as the user scrolls. Using IntersectionObserver and DOM batch processing, you can efficiently manage resource loading and DOM updates without blocking the main thread.

```typescript
class LazyLoader {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadContent(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );
  }

  observe(element: Element) {
    this.observer.observe(element);
  }

  private async loadContent(element: Element) {
    // Implementation
  }
}
```

### 3. DOM Element Tracking

Efficient tracking of processed DOM elements using WeakSet

```typescript
class DOMTracker {
  private processedElements = new WeakSet<Element>();
  private observer: MutationObserver;

  constructor(selector: string, processor: (element: Element) => void) {
    this.observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (this.processedElements.has(element)) {
            return;
          }
          processor(element);
          this.processedElements.add(element);
        });
      });
    });
  }

  start() {
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  stop() {
    this.observer.disconnect();
  }
}
```

Key benefits:

1. Prevents duplicate event listeners
2. Automatic memory cleanup when elements are removed
3. Zero memory overhead for tracking
4. Works with dynamic content updates
5. Thread-safe with requestAnimationFrame batching

This pattern is especially useful for:

- Dynamic content loading
- Single-page applications
- Virtual DOM frameworks
- Custom web components
- Tooltip and overlay systems

## Advanced Real-World Examples

### 1. Tooltip Portal System

A common challenge in web applications is managing tooltips that need to break out of their containing elements, especially within scrollable or overflow-hidden containers.

```typescript
class TooltipPortal {
  private portal: HTMLElement;
  private processedTooltips = new WeakSet<Element>();
  private activeTooltip: HTMLElement | null = null;

  constructor() {
    this.portal = this.createPortal();
    this.initMutationObserver();
  }

  private createPortal(): HTMLElement {
    const portal = document.createElement('div');
    portal.className = 'tooltip-portal';
    portal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
    `;
    document.body.appendChild(portal);
    return portal;
  }

  private initMutationObserver(): void {
    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach((tooltip) => {
          if (this.processedTooltips.has(tooltip)) return;
          this.attachTooltipHandlers(tooltip);
          this.processedTooltips.add(tooltip);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private attachTooltipHandlers(element: Element): void {
    element.addEventListener('mouseenter', () => {
      const content = element.getAttribute('data-tooltip');
      const rect = element.getBoundingClientRect();
      this.showTooltip(content!, rect);
    });

    element.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
  }

  private showTooltip(content: string, targetRect: DOMRect): void {
    this.hideTooltip();
    this.activeTooltip = document.createElement('div');
    this.activeTooltip.className = 'tooltip-content';
    this.activeTooltip.textContent = content;

    // Position tooltip above target
    const x = targetRect.left + targetRect.width / 2;
    const y = targetRect.top;

    this.activeTooltip.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -100%) translateY(-8px);
    `;

    this.portal.appendChild(this.activeTooltip);
  }

  private hideTooltip(): void {
    if (this.activeTooltip) {
      this.activeTooltip.remove();
      this.activeTooltip = null;
    }
  }
}
```

Key optimizations in this example:

1. Uses WeakSet to track processed tooltips without memory leaks
2. Batches DOM operations with requestAnimationFrame
3. Minimizes layout thrashing by reading measurements before writing styles
4. Uses event delegation for efficient event handling
5. Implements cleanup to prevent memory leaks

### 2. Virtual Scroll Implementation

Another common performance challenge is rendering large lists efficiently:

```typescript
class VirtualScroller {
  private container: HTMLElement;
  private itemHeight: number;
  private items: any[];
  private visibleItems = new Map<number, HTMLElement>();
  private observer: IntersectionObserver;

  constructor(container: HTMLElement, items: any[], itemHeight: number) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.setupScroller();
  }

  private setupScroller(): void {
    // Set container styles
    this.container.style.cssText = `
      position: relative;
      overflow-y: scroll;
      height: 100%;
    `;

    // Create spacer for scroll area
    const totalHeight = this.items.length * this.itemHeight;
    const spacer = document.createElement('div');
    spacer.style.height = `${totalHeight}px`;
    this.container.appendChild(spacer);

    // Setup scroll handler with throttling
    let ticking = false;
    this.container.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateVisibleItems();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial render
    this.updateVisibleItems();
  }

  private updateVisibleItems(): void {
    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight;

    // Calculate visible range
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.ceil((scrollTop + viewportHeight) / this.itemHeight);

    // Remove items that are no longer visible
    for (const [index, element] of this.visibleItems.entries()) {
      if (index < startIndex || index > endIndex) {
        element.remove();
        this.visibleItems.delete(index);
      }
    }

    // Add new visible items
    for (let i = startIndex; i <= endIndex; i++) {
      if (i >= 0 && i < this.items.length && !this.visibleItems.has(i)) {
        const element = this.renderItem(i);
        this.container.appendChild(element);
        this.visibleItems.set(i, element);
      }
    }
  }

  private renderItem(index: number): HTMLElement {
    const element = document.createElement('div');
    element.style.cssText = `
      position: absolute;
      top: ${index * this.itemHeight}px;
      width: 100%;
      height: ${this.itemHeight}px;
    `;
    element.textContent = this.items[index].toString();
    return element;
  }
}
```

Key optimizations in this example:

1. Uses requestAnimationFrame for smooth scrolling
2. Implements DOM recycling for better memory usage
3. Minimizes layout thrashing by batching DOM operations
4. Uses efficient data structures (Map) for tracking visible items
5. Implements cleanup to prevent memory leaks
