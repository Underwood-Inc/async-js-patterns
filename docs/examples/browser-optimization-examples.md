---
title: Browser Optimization Examples
description: Learn browser optimization techniques and patterns. Master performance tuning, memory management, and browser-specific optimizations.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Browser
  - Performance
  - Optimization
  - Examples
  - Best Practices
image: /web-patterns/images/browser-optimization-examples-banner.png
---

# Browser Optimization Examples

This page demonstrates practical examples of optimizing asynchronous operations in the browser environment.

## DOM Batch Processing

::: code-with-tooltips

```typescript
// Efficient DOM batch updates
class DOMBatchProcessor {
  private queue: Array<() => void> = [];
  private scheduled = false;

  schedule(update: () => void): void {
    this.queue.push(update);

    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  private flush(): void {
    const updates = [...this.queue];
    this.queue = [];
    this.scheduled = false;

    // Batch read operations
    const measurements = updates
      .filter((update) => update.name.startsWith('read'))
      .map((update) => update());

    // Batch write operations
    updates
      .filter((update) => update.name.startsWith('write'))
      .forEach((update) => update());
  }
}

// Usage
const batchProcessor = new DOMBatchProcessor();

function updateElements(elements: HTMLElement[]): void {
  elements.forEach((element) => {
    // Read operation
    batchProcessor.schedule(function read() {
      const rect = element.getBoundingClientRect();
      return rect;
    });

    // Write operation
    batchProcessor.schedule(function write() {
      element.style.transform = 'translateX(100px)';
    });
  });
}
```

:::

## Intersection Observer

::: code-with-tooltips

```typescript
class LazyLoader {
  private observer: IntersectionObserver;
  private loadQueue: Map<Element, () => Promise<void>> = new Map();
  private loading = new Set<Element>();

  constructor(
    options: {
      root?: Element | null;
      rootMargin?: string;
      threshold?: number | number[];
    } = {}
  ) {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      options
    );
  }

  observe(element: Element, loader: () => Promise<void>): void {
    this.loadQueue.set(element, loader);
    this.observer.observe(element);
  }

  private async handleIntersection(
    entries: IntersectionObserverEntry[]
  ): Promise<void> {
    const visible = entries.filter((entry) => entry.isIntersecting);

    for (const entry of visible) {
      const element = entry.target;
      const loader = this.loadQueue.get(element);

      if (loader && !this.loading.has(element)) {
        this.loading.add(element);

        try {
          await loader();
          this.loadQueue.delete(element);
          this.observer.unobserve(element);
        } catch (error) {
          console.error('Failed to load:', error);
        } finally {
          this.loading.delete(element);
        }
      }
    }
  }

  disconnect(): void {
    this.observer.disconnect();
    this.loadQueue.clear();
    this.loading.clear();
  }
}

// Usage
const lazyLoader = new LazyLoader({
  rootMargin: '50px',
  threshold: 0.1,
});

// Lazy load images
document.querySelectorAll('img[data-src]').forEach((img) => {
  lazyLoader.observe(img, async () => {
    const src = img.getAttribute('data-src');
    if (src) {
      await loadImage(src);
      img.setAttribute('src', src);
      img.removeAttribute('data-src');
    }
  });
});

// Lazy load components
document.querySelectorAll('[data-component]').forEach((element) => {
  lazyLoader.observe(element, async () => {
    const component = element.getAttribute('data-component');
    if (component) {
      const module = await import(`./components/${component}`);
      module.default.mount(element);
    }
  });
});
```

:::

## Web Worker Task Queue

::: code-with-tooltips

```typescript
class WorkerTaskQueue {
  private worker: Worker;
  private tasks: Map<
    number,
    {
      resolve: (value: any) => void;
      reject: (reason: any) => void;
    }
  > = new Map();
  private nextTaskId = 1;

  constructor(workerScript: string) {
    this.worker = new Worker(workerScript);
    this.setupWorker();
  }

  private setupWorker(): void {
    this.worker.onmessage = (event: MessageEvent) => {
      const { taskId, result, error } = event.data;
      const task = this.tasks.get(taskId);

      if (task) {
        if (error) {
          task.reject(new Error(error));
        } else {
          task.resolve(result);
        }
        this.tasks.delete(taskId);
      }
    };

    this.worker.onerror = (error: ErrorEvent) => {
      console.error('Worker error:', error);
      this.tasks.forEach((task) => {
        task.reject(new Error('Worker failed'));
      });
      this.tasks.clear();
    };
  }

  async execute<T>(taskType: string, data: any): Promise<T> {
    const taskId = this.nextTaskId++;

    return new Promise((resolve, reject) => {
      this.tasks.set(taskId, { resolve, reject });

      this.worker.postMessage({
        taskId,
        type: taskType,
        data,
      });
    });
  }

  terminate(): void {
    this.worker.terminate();
    this.tasks.clear();
  }
}

// Worker script (worker.ts)
const handlers = {
  async processData(data: any) {
    // CPU-intensive processing
    return data.map((item) => item * 2);
  },

  async imageFilter(imageData: ImageData) {
    // Image processing
    return applyFilter(imageData);
  },
};

self.onmessage = async (event: MessageEvent) => {
  const { taskId, type, data } = event.data;
  const handler = handlers[type];

  if (!handler) {
    self.postMessage({
      taskId,
      error: `Unknown task type: ${type}`,
    });
    return;
  }

  try {
    const result = await handler(data);
    self.postMessage({ taskId, result });
  } catch (error) {
    self.postMessage({
      taskId,
      error: error.message,
    });
  }
};

// Usage
const taskQueue = new WorkerTaskQueue('worker.js');

// Process data in worker
const data = Array.from({ length: 1000000 }, (_, i) => i);
const result = await taskQueue.execute<number[]>('processData', data);

// Process image in worker
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;
const imageData = ctx.getImageData(0, 0, width, height);
const filteredData = await taskQueue.execute<ImageData>(
  'imageFilter',
  imageData
);
```

:::

## Real-World Example: Virtual Scrolling

::: code-with-tooltips

```typescript
class VirtualScroller {
  private container: HTMLElement;
  private itemHeight: number;
  private items: any[];
  private visibleItems: Map<number, HTMLElement> = new Map();
  private scrollTop = 0;
  private observer: IntersectionObserver;
  private renderQueue: DOMBatchProcessor;

  constructor(
    container: HTMLElement,
    items: any[],
    options: {
      itemHeight: number;
      overscan?: number;
      batchSize?: number;
    }
  ) {
    this.container = container;
    this.items = items;
    this.itemHeight = options.itemHeight;
    this.renderQueue = new DOMBatchProcessor();

    this.setupContainer();
    this.setupObserver();
    this.setupScrollListener();
  }

  private setupContainer(): void {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';

    const totalHeight = this.items.length * this.itemHeight;
    const content = document.createElement('div');
    content.style.height = `${totalHeight}px`;
    this.container.appendChild(content);
  }

  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index')!);

          if (!entry.isIntersecting) {
            this.recycleItem(index);
          }
        });
      },
      { root: this.container }
    );
  }

  private setupScrollListener(): void {
    this.container.addEventListener('scroll', () => {
      this.scrollTop = this.container.scrollTop;
      this.updateVisibleItems();
    });
  }

  private updateVisibleItems(): void {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + this.getVisibleCount(),
      this.items.length
    );

    // Remove items that are no longer visible
    for (const [index, element] of this.visibleItems) {
      if (index < startIndex || index >= endIndex) {
        this.recycleItem(index);
      }
    }

    // Add new visible items
    for (let i = startIndex; i < endIndex; i++) {
      if (!this.visibleItems.has(i)) {
        this.renderItem(i);
      }
    }
  }

  private renderItem(index: number): void {
    this.renderQueue.schedule(() => {
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.top = `${index * this.itemHeight}px`;
      element.style.height = `${this.itemHeight}px`;
      element.setAttribute('data-index', index.toString());

      // Render item content
      element.innerHTML = this.items[index].toString();

      this.container.appendChild(element);
      this.visibleItems.set(index, element);
      this.observer.observe(element);
    });
  }

  private recycleItem(index: number): void {
    const element = this.visibleItems.get(index);
    if (element) {
      this.observer.unobserve(element);
      element.remove();
      this.visibleItems.delete(index);
    }
  }

  private getVisibleCount(): number {
    return Math.ceil(this.container.clientHeight / this.itemHeight);
  }

  updateItems(newItems: any[]): void {
    this.items = newItems;
    const totalHeight = this.items.length * this.itemHeight;
    this.container.firstElementChild!.style.height = `${totalHeight}px`;
    this.updateVisibleItems();
  }

  destroy(): void {
    this.observer.disconnect();
    this.visibleItems.clear();
    this.container.innerHTML = '';
  }
}

// Usage
const container = document.getElementById('container')!;
const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);

const scroller = new VirtualScroller(container, items, {
  itemHeight: 50,
  overscan: 5,
  batchSize: 10,
});

// Update items dynamically
setTimeout(() => {
  const newItems = Array.from({ length: 5000 }, (_, i) => `New Item ${i}`);
  scroller.updateItems(newItems);
}, 5000);
```

:::

## Best Practices

1. Frame timing:

   ```typescript
   class FrameScheduler {
     private callbacks = new Set<() => void>();
     private running = false;

     schedule(callback: () => void): void {
       this.callbacks.add(callback);

       if (!this.running) {
         this.running = true;
         requestAnimationFrame(this.tick.bind(this));
       }
     }

     private tick(timestamp: number): void {
       const callbacks = Array.from(this.callbacks);
       this.callbacks.clear();
       this.running = false;

       for (const callback of callbacks) {
         try {
           callback();
         } catch (error) {
           console.error('Frame callback error:', error);
         }
       }

       if (this.callbacks.size > 0) {
         this.running = true;
         requestAnimationFrame(this.tick.bind(this));
       }
     }
   }
   ```

2. Memory management:

   ```typescript
   class DOMRecycler<T> {
     private pool: HTMLElement[] = [];
     private inUse = new Set<HTMLElement>();
     private factory: () => HTMLElement;

     constructor(factory: () => HTMLElement, initialSize: number = 20) {
       this.factory = factory;
       this.preallocate(initialSize);
     }

     private preallocate(count: number): void {
       for (let i = 0; i < count; i++) {
         this.pool.push(this.factory());
       }
     }

     acquire(): HTMLElement {
       let element = this.pool.pop();

       if (!element) {
         element = this.factory();
       }

       this.inUse.add(element);
       return element;
     }

     release(element: HTMLElement): void {
       if (this.inUse.has(element)) {
         element.remove();
         this.pool.push(element);
         this.inUse.delete(element);
       }
     }

     clear(): void {
       this.inUse.forEach((element) => element.remove());
       this.pool.forEach((element) => element.remove());
       this.inUse.clear();
       this.pool = [];
     }
   }
   ```

3. Event delegation:

   ```typescript
   class EventDelegator {
     private handlers: Map<string, Map<string, Set<EventListener>>> = new Map();

     constructor(private root: HTMLElement) {
       this.setupDelegation();
     }

     private setupDelegation(): void {
       this.root.addEventListener('click', (event) => {
         this.delegate(event, 'click');
       });

       this.root.addEventListener('input', (event) => {
         this.delegate(event, 'input');
       });
     }

     private delegate(event: Event, eventType: string): void {
       const target = event.target as HTMLElement;
       const handlers = this.handlers.get(eventType);

       if (!handlers) return;

       for (const [selector, listeners] of handlers) {
         if (target.matches(selector)) {
           listeners.forEach((listener) => {
             listener.call(target, event);
           });
         }
       }
     }

     on(eventType: string, selector: string, handler: EventListener): void {
       if (!this.handlers.has(eventType)) {
         this.handlers.set(eventType, new Map());
       }

       const typeHandlers = this.handlers.get(eventType)!;

       if (!typeHandlers.has(selector)) {
         typeHandlers.set(selector, new Set());
       }

       typeHandlers.get(selector)!.add(handler);
     }

     off(eventType: string, selector: string, handler: EventListener): void {
       const typeHandlers = this.handlers.get(eventType);
       if (!typeHandlers) return;

       const selectorHandlers = typeHandlers.get(selector);
       if (!selectorHandlers) return;

       selectorHandlers.delete(handler);
     }
   }
   ```

4. Idle scheduling:

   ```typescript
   class IdleTaskScheduler {
     private tasks: Array<{
       task: () => void;
       priority: number;
     }> = [];
     private running = false;

     schedule(task: () => void, priority: number = 0): void {
       this.tasks.push({ task, priority });
       this.tasks.sort((a, b) => b.priority - a.priority);

       if (!this.running) {
         this.running = true;
         this.processNextTask();
       }
     }

     private processNextTask(): void {
       if (this.tasks.length === 0) {
         this.running = false;
         return;
       }

       requestIdleCallback((deadline) => {
         while (deadline.timeRemaining() > 0 && this.tasks.length > 0) {
           const { task } = this.tasks.shift()!;
           try {
             task();
           } catch (error) {
             console.error('Task error:', error);
           }
         }

         if (this.tasks.length > 0) {
           this.processNextTask();
         } else {
           this.running = false;
         }
       });
     }
   }
   ```
