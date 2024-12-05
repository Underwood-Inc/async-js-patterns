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
    z-index: 9999999;
  `;
  document.body.appendChild(tooltipContainer);
  return tooltipContainer;
}

export function showTooltip(
  tooltipContainer: HTMLDivElement | null,
  content: string,
  x: number,
  y: number
): HTMLDivElement | null {
  if (!isBrowser || !tooltipContainer) return null;

  const tooltipMount = document.createElement('div');

  const app = createApp({
    render() {
      return h(Tooltip, {
        content,
        x,
        y,
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
