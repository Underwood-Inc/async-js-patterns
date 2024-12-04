// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export function createTooltipPortal() {
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

export function showTooltip(tooltipContainer, content, x, y) {
  if (!isBrowser || !tooltipContainer) return null;

  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'tooltip-content';
  tooltipEl.textContent = content;
  tooltipEl.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    transform: translate(-50%, -100%) translateY(-8px);
    padding: 8px 12px;
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    border-radius: 6px;
    border: 1px solid var(--vp-c-divider);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 1;
    visibility: visible;
    pointer-events: none;
    max-width: 320px;
    text-align: left;
    font-family: var(--vp-font-family-base);
    font-weight: normal;
    font-style: normal;
  `;
  tooltipContainer.appendChild(tooltipEl);
  return tooltipEl;
}

export function hideTooltip(tooltipEl) {
  if (isBrowser && tooltipEl) {
    tooltipEl.remove();
  }
}
