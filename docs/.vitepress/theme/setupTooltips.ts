import { inBrowser } from 'vitepress';
import { createApp, h } from 'vue';
import Tooltip from './components/Tooltip.vue';
import TooltipLoader from './components/TooltipLoader.vue';
import {
  createTooltipPortal,
  hideTooltip as importedHideTooltip,
} from './tooltipPortal';

let tooltipPortal: HTMLDivElement | null = null;
let currentTooltip: HTMLDivElement | null = null;
let keepTooltipsOpen = false;
let scrollRAF: number | null = null;
let activeTooltipTrigger: HTMLElement | null = null;
let hoverEnabled = true;
let hideTimeout: number | null = null;
const HIDE_DELAY = 100; // Reduced from 200ms to 100ms

// Map to track active tooltips and their trigger elements
const activeTooltips = new Map<
  HTMLElement,
  {
    id: string;
    tooltip: HTMLElement;
    trigger: HTMLElement;
    isClickOpened: boolean;
  }
>();

// Set to track open tooltip triggers
const openTooltipTriggers = new Set<HTMLElement>();

// Track tooltips that are in the process of being hidden
const hidingTooltips = new Set<string>();

// Track last interaction time for each tooltip
const tooltipInteractions = new Map<string, number>();
const TOOLTIP_MAX_IDLE_TIME = 3000; // 3 seconds

// Track which tooltips were opened by clicks
const clickOpenedTooltips = new Set<string>();

// Adjusted constants for better UX
const TOOLTIP_CLOSE_DISTANCE = 200; // Increased significantly
const TOOLTIP_CLOSE_DELAY = 800; // Doubled delay
const TOOLTIP_HOVER_BUFFER = 100; // Increased buffer
const TOOLTIP_CORRIDOR_WIDTH = 150; // Width of safe movement corridor

let lastMousePosition = { x: 0, y: 0 };
const tooltipOpenTimes = new Map<string, number>();
let closeTimeoutId: number | null = null;

const DEBUG_HOVER_ZONES = false; // Toggle for visualization

let loaderApp: any = null;

function createDebugElement(rect: DOMRect, color: string): HTMLElement {
  const el = document.createElement('div');
  el.style.cssText = `
    position: fixed;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    background-color: ${color};
    opacity: 0.1;
    pointer-events: none;
    z-index: 9998;
  `;
  el.classList.add('tooltip-debug-zone');
  return el;
}

function visualizeHoverZones(
  tooltipEl: HTMLElement,
  triggerEl: HTMLElement,
  bufferedTooltip: any,
  corridor: any
) {
  if (!DEBUG_HOVER_ZONES) return;

  // Remove any existing debug elements
  document.querySelectorAll('.tooltip-debug-zone').forEach((el) => el.remove());

  // Visualize buffered tooltip area
  const bufferRect = new DOMRect(
    bufferedTooltip.left,
    bufferedTooltip.top,
    bufferedTooltip.right - bufferedTooltip.left,
    bufferedTooltip.bottom - bufferedTooltip.top
  );
  document.body.appendChild(createDebugElement(bufferRect, 'blue'));

  // Visualize corridor
  const corridorRect = new DOMRect(
    corridor.left,
    corridor.top,
    corridor.right - corridor.left,
    corridor.bottom - corridor.top
  );
  document.body.appendChild(createDebugElement(corridorRect, 'green'));
}

// Add scroll handler
function handleScroll() {
  debugTooltips('scroll', { activeTooltipsCount: activeTooltips.size });

  // Update all active tooltips
  activeTooltips.forEach((entry) => {
    const trigger = entry.trigger;
    const tooltip = entry.tooltip;

    // Get the trigger element's position relative to the viewport
    const rect = trigger.getBoundingClientRect();

    // Calculate position relative to the viewport
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    // Update tooltip position with fixed positioning
    tooltip.style.position = 'fixed';
    tooltip.style.transform = `translate(${x}px, ${y}px)`;

    debugTooltips('updatePosition', {
      tooltipId: entry.id,
      x,
      y,
      trigger: trigger.getAttribute('data-tooltip'),
    });
  });
}

// Ensure scroll handler is properly bound
function setupScrollHandlers() {
  const scrollHandler = () => {
    if (activeTooltips.size > 0) {
      activeTooltips.forEach((entry) => {
        const trigger = entry.trigger;
        const tooltip = entry.tooltip;

        // Get the trigger element's position relative to the viewport
        const rect = trigger.getBoundingClientRect();

        // Calculate position relative to the viewport
        const x = rect.left + rect.width / 2;
        const y = rect.top;

        // Update tooltip position with fixed positioning
        tooltip.style.position = 'fixed';
        tooltip.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  };

  // Listen to scroll events on both window and document
  window.addEventListener('scroll', scrollHandler, { passive: true });
  document.addEventListener('scroll', scrollHandler, {
    passive: true,
    capture: true,
  });

  // Add scroll listeners to all scrollable parents
  document.querySelectorAll('.scrollable').forEach((element) => {
    element.addEventListener('scroll', scrollHandler, { passive: true });
  });
}

// Export all the necessary functions
export function isTooltipPinned() {
  return keepTooltipsOpen;
}

export function toggleTooltipPersistence(persist: boolean) {
  keepTooltipsOpen = persist;
  if (!persist) {
    hideAllTooltips();
  }
}

export function toggleTooltipHover(enabled: boolean) {
  hoverEnabled = enabled;
  if (!enabled && !keepTooltipsOpen) {
    hideAllTooltips();
  }
}

// Function to hide all tooltips
function hideAllTooltips() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  activeTooltips.forEach((entry) => {
    importedHideTooltip(entry.tooltip);
    openTooltipTriggers.delete(entry.trigger);
  });
  activeTooltips.clear();
  openTooltipTriggers.clear();
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

export function showTooltip(
  tooltipContainer: HTMLDivElement | null,
  content: string,
  x: number,
  y: number,
  type: 'error' | 'default' = 'default',
  triggerElement: HTMLElement,
  isClickOpened = false
): HTMLDivElement | null {
  if (!inBrowser || !tooltipContainer) return null;

  const tooltipId = hashString(content);

  // Remove from hiding set if it was being hidden
  hidingTooltips.delete(tooltipId);

  // Check if tooltip with this ID already exists
  const existingTooltip = Array.from(activeTooltips.values()).find(
    (entry) => entry.id === tooltipId
  );
  if (existingTooltip) {
    debugTooltips('duplicate prevented', { tooltipId });
    return existingTooltip.tooltip;
  }

  // Check if tooltip is already open for this trigger
  if (openTooltipTriggers.has(triggerElement)) {
    return null;
  }

  // Add to tracking set
  openTooltipTriggers.add(triggerElement);

  // Clear any pending hide timeouts
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  const tooltipMount = document.createElement('div');
  tooltipMount.style.cssText = `
    position: fixed;
    transform: translate(${x}px, ${y}px);
  `;

  if (isClickOpened) {
    clickOpenedTooltips.add(tooltipId);
  }

  const app = createApp({
    render() {
      return h(Tooltip, {
        content,
        x: 0,
        y: 0,
        type,
        isClickOpened,
        onClose: () => {
          if (isClickOpened) {
            clickOpenedTooltips.delete(tooltipId);
            localHideTooltip(tooltipMount);
          }
        },
      });
    },
  });

  app.mount(tooltipMount);
  tooltipContainer.appendChild(tooltipMount);

  // Store with ID and click state
  activeTooltips.set(tooltipMount, {
    id: tooltipId,
    tooltip: tooltipMount,
    trigger: triggerElement,
    isClickOpened,
  });

  debugTooltips('showTooltip', {
    content,
    x,
    y,
    existingId: existingTooltip?.id,
  });

  tooltipOpenTimes.set(hashString(content), Date.now());

  return tooltipMount;
}

function localHideTooltip(tooltipEl: HTMLElement | null): void {
  if (!tooltipEl) return;

  // Find the entry before starting hide timeout
  const entry = Array.from(activeTooltips.entries()).find(
    ([_, v]) => v.tooltip === tooltipEl
  );
  if (!entry) return;

  const [key, value] = entry;
  const tooltipId = value.id;

  // Don't hide click-opened tooltips
  if (clickOpenedTooltips.has(tooltipId)) {
    debugTooltips('hideTooltip-skip-click', { tooltipId });
    return;
  }

  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }

  // Mark this tooltip as being hidden
  hidingTooltips.add(tooltipId);

  hideTimeout = window.setTimeout(() => {
    if (inBrowser && tooltipEl) {
      const app = tooltipEl.__vue_app__;
      if (app) {
        app.unmount();
      }
      tooltipEl.remove();

      // Only remove if it hasn't been recreated and isn't click-opened
      if (
        hidingTooltips.has(tooltipId) &&
        !clickOpenedTooltips.has(tooltipId)
      ) {
        activeTooltips.delete(key);
        openTooltipTriggers.delete(value.trigger);
        hidingTooltips.delete(tooltipId);
      }

      debugTooltips('hideTooltip', {
        removedId: tooltipId,
        wasClickOpened: clickOpenedTooltips.has(tooltipId),
      });
    }
    hideTimeout = null;
  }, HIDE_DELAY);
}

// Setup function
export function setupTooltips() {
  if (!inBrowser) return;

  tooltipPortal = createTooltipPortal();

  // Add scroll listener
  setupScrollHandlers();

  // Handle mouseover for hover mode
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('tooltip-trigger')) return;

    if (!hoverEnabled || keepTooltipsOpen) return;

    const content = target.getAttribute('data-tooltip');
    if (!content) return;

    const tooltipId = hashString(content);
    tooltipInteractions.set(tooltipId, Date.now());
    // Check if this tooltip is already open
    const existingTooltip = Array.from(activeTooltips.values()).find(
      (entry) => entry.id === tooltipId
    );
    if (existingTooltip) {
      debugTooltips('mouseover - existing tooltip', { tooltipId });
      return;
    }

    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    currentTooltip = showTooltip(
      tooltipPortal,
      content,
      x,
      y,
      target.classList.contains('has-error') ? 'error' : 'default',
      target
    );

    if (currentTooltip) {
      activeTooltipTrigger = target;
    }
  });

  // Handle mouseout for hover mode
  document.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('tooltip-trigger')) return;

    if (!hoverEnabled || keepTooltipsOpen) return;

    const content = target.getAttribute('data-tooltip');
    if (!content) return;

    const tooltipId = hashString(content);

    // Don't hide click-opened tooltips on mouseout
    if (clickOpenedTooltips.has(tooltipId)) {
      debugTooltips('mouseout-skip-click', { tooltipId });
      return;
    }

    // Check if the mouse is moving to the tooltip itself
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('.tooltip-content')) {
      return;
    }

    // Find the tooltip element for this specific trigger
    const tooltipEntry = Array.from(activeTooltips.entries()).find(
      ([_, v]) => v.trigger === target && !clickOpenedTooltips.has(v.id)
    );

    if (tooltipEntry) {
      localHideTooltip(tooltipEntry[1].tooltip);
      if (tooltipEntry[1].tooltip === currentTooltip) {
        currentTooltip = null;
        activeTooltipTrigger = null;
      }
    }

    debugTooltips('mouseout', {
      tooltipId,
      wasClickOpened: clickOpenedTooltips.has(tooltipId),
      activeTooltipsCount: activeTooltips.size,
      openTriggersCount: openTooltipTriggers.size,
    });
  });

  // Handle click for non-hover mode
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('tooltip-trigger')) return;

    if (hoverEnabled) return;

    const content = target.getAttribute('data-tooltip');
    if (!content) return;

    // If clicking the same trigger, hide the tooltip
    if (activeTooltipTrigger === target) {
      if (currentTooltip) {
        localHideTooltip(currentTooltip);
        activeTooltips.delete(currentTooltip);
        openTooltipTriggers.delete(target);
        currentTooltip = null;
        activeTooltipTrigger = null;
      }
      return;
    }

    // Hide previous tooltip
    if (currentTooltip) {
      localHideTooltip(currentTooltip);
      activeTooltips.delete(currentTooltip);
    }

    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    currentTooltip = showTooltip(
      tooltipPortal,
      content,
      x,
      y,
      target.classList.contains('has-error') ? 'error' : 'default',
      target,
      true
    );

    if (currentTooltip) {
      const tooltipId = `${content}-${x}-${y}`;
      activeTooltips.set(currentTooltip, {
        id: tooltipId,
        tooltip: currentTooltip,
        trigger: target,
        isClickOpened: true,
      });
      activeTooltipTrigger = target;
    }
  });

  // Add document click handler to close tooltips
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // Don't close if clicking inside a tooltip or close button
    if (
      target.closest('.tooltip-content') ||
      target.closest('.tooltip-close')
    ) {
      return;
    }

    // If clicking a tooltip trigger, let that handler manage it
    if (target.classList.contains('tooltip-trigger')) {
      return;
    }

    // Close all click-opened tooltips
    for (const [key, value] of activeTooltips.entries()) {
      if (clickOpenedTooltips.has(value.id)) {
        localHideTooltip(value.tooltip);
        clickOpenedTooltips.delete(value.id);
      }
    }
  });

  // Add mousemove listener in setupTooltips
  document.addEventListener('mousemove', (e) => {
    lastMousePosition = { x: e.clientX, y: e.clientY };

    // Clear any pending close timeout
    if (closeTimeoutId) {
      window.clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
    }

    // Check distance for all active tooltips
    activeTooltips.forEach((entry, tooltipEl) => {
      if (clickOpenedTooltips.has(entry.id)) return;

      const openTime = tooltipOpenTimes.get(entry.id) || 0;
      if (Date.now() - openTime < TOOLTIP_CLOSE_DELAY) return;

      const distance = getDistanceFromTooltip(
        e.clientX,
        e.clientY,
        tooltipEl,
        entry.trigger
      );

      if (distance > TOOLTIP_CLOSE_DISTANCE) {
        const relatedTarget = document.elementFromPoint(e.clientX, e.clientY);

        // Don't close if mouse is over tooltip or trigger
        if (
          !relatedTarget?.closest('.tooltip-content') &&
          !relatedTarget?.closest('.tooltip-trigger')
        ) {
          // Set a timeout before closing
          closeTimeoutId = window.setTimeout(() => {
            if (!tooltipEl.matches(':hover')) {
              localHideTooltip(tooltipEl);
              tooltipOpenTimes.delete(entry.id);
            }
          }, TOOLTIP_CLOSE_DELAY);
        }
      }
    });
  });

  // Add to existing event handlers
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // Handle close button clicks
    if (target.closest('.close-button')) {
      const tooltipEl = target.closest('.tooltip-content') as HTMLElement;
      if (tooltipEl) {
        const entry = Array.from(activeTooltips.entries()).find(
          ([el]) => el === tooltipEl
        );
        if (entry) {
          const [_, tooltipData] = entry;
          // Remove from all tracking sets/maps
          activeTooltips.delete(tooltipEl);
          clickOpenedTooltips.delete(tooltipData.id);
          tooltipOpenTimes.delete(tooltipData.id);
          openTooltipTriggers.delete(tooltipData.trigger);
        }
      }
    }
  });
}

let debugEnabled = false;

export function toggleDebug(enabled: boolean) {
  debugEnabled = enabled;
}

function debugTooltips(action: string, details: any) {
  if (!debugEnabled) return;

  console.log(`[Tooltips] ${action}
Active Tooltips: ${activeTooltips.size}
${Array.from(activeTooltips.values())
  .map(
    (t) => `- ${t.id} (${clickOpenedTooltips.has(t.id) ? 'click' : 'hover'})`
  )
  .join('\n')}

Open Triggers: ${openTooltipTriggers.size}
${Array.from(openTooltipTriggers)
  .map((t) => `- ${t.getAttribute('data-tooltip')?.slice(0, 30)}...`)
  .join('\n')}

Details: ${JSON.stringify(details, null, 2)}
`);
}

function getDistanceFromTooltip(
  mouseX: number,
  mouseY: number,
  tooltipEl: HTMLElement,
  triggerEl: HTMLElement
): number {
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const triggerRect = triggerEl.getBoundingClientRect();

  // Account for the tooltip's transform position (typically above the trigger)
  const tooltipActualRect = {
    left: tooltipRect.left,
    right: tooltipRect.right,
    // Adjust for the transform: translate(-50%, -100%) translateY(-8px)
    top: tooltipRect.top - tooltipRect.height - 8,
    bottom: tooltipRect.top - 8,
  };

  const bufferedTooltip = {
    left: tooltipActualRect.left - TOOLTIP_HOVER_BUFFER,
    right: tooltipActualRect.right + TOOLTIP_HOVER_BUFFER,
    top: tooltipActualRect.top - TOOLTIP_HOVER_BUFFER,
    bottom: tooltipActualRect.bottom + TOOLTIP_HOVER_BUFFER,
  };

  const corridor = {
    left:
      Math.min(triggerRect.left, tooltipActualRect.left) -
      TOOLTIP_CORRIDOR_WIDTH / 2,
    right:
      Math.max(triggerRect.right, tooltipActualRect.right) +
      TOOLTIP_CORRIDOR_WIDTH / 2,
    top: Math.min(triggerRect.top, tooltipActualRect.top),
    bottom: Math.max(triggerRect.bottom, tooltipActualRect.bottom),
  };

  // Visualize the zones with actual position
  visualizeHoverZones(tooltipEl, triggerEl, bufferedTooltip, corridor);

  if (
    (mouseX >= bufferedTooltip.left &&
      mouseX <= bufferedTooltip.right &&
      mouseY >= bufferedTooltip.top &&
      mouseY <= bufferedTooltip.bottom) ||
    (mouseX >= corridor.left &&
      mouseX <= corridor.right &&
      mouseY >= corridor.top &&
      mouseY <= corridor.bottom)
  ) {
    return 0;
  }

  const closestX = Math.max(
    bufferedTooltip.left,
    Math.min(mouseX, bufferedTooltip.right)
  );
  const closestY = Math.max(
    bufferedTooltip.top,
    Math.min(mouseY, bufferedTooltip.bottom)
  );

  return Math.sqrt(
    Math.pow(mouseX - closestX, 2) + Math.pow(mouseY - closestY, 2)
  );
}

function showLoader() {
  if (!inBrowser) return;

  const loaderMount = document.createElement('div');
  loaderApp = createApp(TooltipLoader);
  loaderApp.mount(loaderMount);
  document.body.appendChild(loaderMount);
}

export function initializeTooltips() {
  if (!inBrowser || tooltipPortal) return;

  showLoader();
  tooltipPortal = createTooltipPortal();

  // Process initial tooltips
  const tooltips = document.querySelectorAll('[data-tooltip]');
  const total = tooltips.length;
  let processed = 0;

  tooltips.forEach((tooltip, index) => {
    processTooltip(tooltip as HTMLElement);
    processed++;
    if (window.tooltipLoader) {
      window.tooltipLoader.updateProgress(processed, total);
    }
  });

  // Hide loader when done
  if (window.tooltipLoader) {
    window.tooltipLoader.hideLoader();
  }

  // Rest of initialization...
}
