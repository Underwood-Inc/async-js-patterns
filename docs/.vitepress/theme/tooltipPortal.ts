import { createApp, h } from 'vue';
import Tooltip from './components/Tooltip.vue';

const isBrowser = typeof window !== 'undefined';

export function createTooltipPortal(): HTMLDivElement | null {
  if (!isBrowser) return null;

  const tooltipContainer = document.createElement('div');
  tooltipContainer.className = 'tooltip-portal';
  tooltipContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: var(--vp-z-index-tooltip);
  `;
  document.body.appendChild(tooltipContainer);
  return tooltipContainer;
}

export function showTooltip(
  tooltipContainer: HTMLDivElement | null,
  content: string,
  x: number,
  y: number,
  type: 'error' | 'default' = 'default'
): HTMLDivElement | null {
  if (!isBrowser || !tooltipContainer) return null;

  const tooltipMount = document.createElement('div');
  tooltipMount.style.position = 'fixed';

  // Create the tooltip first to get its dimensions
  const app = createApp({
    render() {
      return h(Tooltip, {
        content,
        position: 'above', // default position
        type,
        onMounted: (el: HTMLElement) => {
          const tooltipRect = el.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Calculate available space
          const spaceAbove = y;
          const spaceBelow = viewportHeight - y;
          const tooltipHeight = tooltipRect.height + 16; // Add padding

          // Determine position (above or below)
          const position =
            spaceAbove > tooltipHeight || spaceAbove > spaceBelow
              ? 'above'
              : 'below';

          // Calculate x position
          let finalX = Math.min(
            Math.max(x, tooltipRect.width / 2 + 10), // Don't go off left edge
            viewportWidth - tooltipRect.width / 2 - 10 // Don't go off right edge
          );

          // Calculate y position
          let finalY = position === 'above' ? y : y;

          // Update tooltip position and props
          tooltipMount.style.left = `${finalX}px`;
          tooltipMount.style.top = `${finalY}px`;

          // Update tooltip position prop
          el.__vue__?.exposed?.updatePosition(position);
        },
      });
    },
  });

  app.mount(tooltipMount);
  tooltipContainer.appendChild(tooltipMount);

  return tooltipMount;
}

export function hideTooltip(tooltipEl: HTMLElement | null): void {
  if (isBrowser && tooltipEl) {
    const app = tooltipEl.__vue_app__;
    if (app) {
      app.unmount();
    }
    tooltipEl.remove();
  }
}
