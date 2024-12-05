import { createTooltipPortal, hideTooltip, showTooltip } from './tooltipPortal';

let tooltipPortal: HTMLDivElement | null = null;
let currentTooltip: HTMLDivElement | null = null;

export function setupTooltips() {
  if (typeof window === 'undefined') return;

  tooltipPortal = createTooltipPortal();

  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('has-tooltip')) {
      const rect = target.getBoundingClientRect();
      const tooltip = target.getAttribute('data-tooltip');
      if (tooltip && tooltipPortal) {
        currentTooltip = showTooltip(
          tooltipPortal,
          tooltip,
          rect.left + rect.width / 2,
          rect.top
        );
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('has-tooltip')) {
      hideTooltip(currentTooltip);
      currentTooltip = null;
    }
  });
}
