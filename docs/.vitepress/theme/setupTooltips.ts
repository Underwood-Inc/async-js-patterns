import { createTooltipPortal, hideTooltip, showTooltip } from './tooltipPortal';

let tooltipPortal: HTMLDivElement | null = null;
let currentTooltip: HTMLDivElement | null = null;
let keepTooltipsOpen = false; // Development flag

// Map to track all active tooltips and their triggers
const activeTooltips = new Map<HTMLElement, HTMLElement>(); // tooltip -> trigger

// Function to toggle tooltip behavior
export function toggleTooltipPersistence(persist: boolean) {
  keepTooltipsOpen = persist;
  if (!persist) {
    // Close all open tooltips when disabling persistence
    const tooltips = document.querySelectorAll('.tooltip-content');
    tooltips.forEach((tooltip) => tooltip.remove());
    activeTooltips.clear();
  }
}

// Function to update tooltip positions
function updateTooltipPositions() {
  if (!tooltipPortal) return;

  activeTooltips.forEach((trigger, tooltip) => {
    const rect = trigger.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top - 10;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  });
}

export function setupTooltips() {
  if (typeof window === 'undefined') return;

  tooltipPortal = createTooltipPortal();

  // Add scroll event listener
  window.addEventListener(
    'scroll',
    () => {
      if (activeTooltips.size > 0) {
        updateTooltipPositions();
      }
    },
    { passive: true }
  );

  // Global click handler for closing tooltips
  document.addEventListener('click', (e) => {
    if (!keepTooltipsOpen) return;

    const target = e.target as HTMLElement;
    const isTooltip = target.closest('.tooltip-content');
    const isTooltipTrigger = target.closest('.has-tooltip');

    if (!isTooltip && !isTooltipTrigger) {
      const tooltips = document.querySelectorAll('.tooltip-content');
      tooltips.forEach((tooltip) => tooltip.remove());
      activeTooltips.clear();
    }
  });

  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('has-tooltip')) {
      const rect = target.getBoundingClientRect();
      const tooltip = target.getAttribute('data-tooltip');
      if (tooltip && tooltipPortal) {
        if (!keepTooltipsOpen) {
          // Remove previous tooltip if not in persistent mode
          hideTooltip(currentTooltip);
          activeTooltips.clear();
        }
        currentTooltip = showTooltip(
          tooltipPortal,
          tooltip,
          rect.left + rect.width / 2,
          rect.top - 10
        );
        if (currentTooltip) {
          activeTooltips.set(currentTooltip, target);
        }
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (keepTooltipsOpen) return; // Skip hiding if persistence is enabled

    const target = e.target as HTMLElement;
    if (target.classList.contains('has-tooltip')) {
      if (currentTooltip) {
        activeTooltips.delete(currentTooltip);
      }
      hideTooltip(currentTooltip);
      currentTooltip = null;
    }
  });
}
