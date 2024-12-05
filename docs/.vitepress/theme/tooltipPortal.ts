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

  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'tooltip-content';

  // Create a wrapper for the content
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'tooltip-content-wrapper';

  // Split content by <br> and create paragraph elements
  content.split('<br>').forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    p.style.margin = '0';
    p.style.padding = '0';
    if (contentWrapper.children.length > 0) {
      p.style.marginTop = '0.5em';
    }
    contentWrapper.appendChild(p);
  });

  tooltipEl.appendChild(contentWrapper);

  tooltipEl.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    transform: translate(-50%, -100%) translateY(-8px);
    padding: 10px 14px;
    background: var(--vp-c-bg);
    color: var(--vp-c-text-1);
    font-size: 14px;
    line-height: 1.6;
    border-radius: 8px;
    border: 1px dashed var(--vp-c-brand);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    opacity: 1;
    visibility: visible;
    pointer-events: none;
    max-width: 360px;
    text-align: left;
    font-family: var(--vp-font-family-base);
    font-weight: 400;
    font-style: normal;
    letter-spacing: 0.2px;
    backdrop-filter: blur(8px);
  `;

  tooltipContainer.appendChild(tooltipEl);
  return tooltipEl;
}

export function hideTooltip(tooltipEl: HTMLElement | null): void {
  if (isBrowser && tooltipEl) {
    tooltipEl.remove();
  }
}
