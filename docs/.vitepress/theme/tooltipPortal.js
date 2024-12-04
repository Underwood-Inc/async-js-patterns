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

  // Convert newlines to <br> tags and set as HTML
  tooltipEl.innerHTML = content
    .split('\n')
    .map((line) =>
      line.trim() ? `<p style="margin: 0; padding: 0;">${line}</p>` : '<br>'
    )
    .join('');

  tooltipEl.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    transform: translate(-50%, -100%) translateY(-8px);
    padding: 10px 14px;
    background: var(--vp-c-bg-soft);
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
  `;

  // Add styles for paragraph spacing
  const paragraphs = tooltipEl.getElementsByTagName('p');
  Array.from(paragraphs).forEach((p, index) => {
    if (index < paragraphs.length - 1) {
      p.style.marginBottom = '0.5em';
    }
  });

  tooltipContainer.appendChild(tooltipEl);
  return tooltipEl;
}

export function hideTooltip(tooltipEl) {
  if (isBrowser && tooltipEl) {
    tooltipEl.remove();
  }
}
