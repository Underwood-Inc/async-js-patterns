// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Tooltip processing state
let tooltipsProcessed = 0;
let tooltipsTotal = 0;
let loadingIndicator: HTMLDivElement | null = null;
let hideTimeout: number | null = null;

function createLoadingIndicator() {
  if (!isBrowser || loadingIndicator) return;

  loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'tooltip-loading-indicator';
  loadingIndicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    padding: 8px 16px;
    background: var(--vp-c-bg);
    border: 2px solid var(--vp-c-brand);
    border-radius: 8px;
    font-size: 14px;
    color: var(--vp-c-text-1);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999998;
    transform: translateY(10px);
    font-family: var(--vp-font-family-base);
    backdrop-filter: blur(8px);
    pointer-events: none;
  `;
  document.body.appendChild(loadingIndicator);
  console.log('Tooltip loading indicator created');
}

function updateLoadingIndicator() {
  if (!loadingIndicator) return;

  if (tooltipsTotal === 0) {
    loadingIndicator.style.opacity = '0';
    loadingIndicator.style.transform = 'translateY(10px)';
    console.log('No tooltips to process');
    return;
  }

  loadingIndicator.style.opacity = '1';
  loadingIndicator.style.transform = 'translateY(0)';
  const progress = `${tooltipsProcessed}/${tooltipsTotal}`;
  loadingIndicator.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style="display: flex; align-items: center;">
        <span style="color: var(--vp-c-brand); animation: pulse 1.5s infinite;">●</span>
      </div>
      <span>Processing tooltips: ${progress}</span>
    </div>
  `;
  console.log(`Tooltip progress: ${progress}`);

  if (tooltipsProcessed === tooltipsTotal) {
    // Clear any existing timeout
    if (hideTimeout !== null) {
      window.clearTimeout(hideTimeout);
    }

    console.log('All tooltips processed');

    // Set new timeout to hide the indicator
    hideTimeout = window.setTimeout(() => {
      if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        loadingIndicator.style.transform = 'translateY(10px)';
      }

      // Reset counters after hiding
      window.setTimeout(() => {
        tooltipsProcessed = 0;
        tooltipsTotal = 0;
        console.log('Tooltip counters reset');
      }, 300);
    }, 1500);
  }
}

// Add pulse animation to the stylesheet
if (isBrowser) {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

export function initializeTooltips(count: number): void {
  console.log(`Initializing tooltips: ${count} tooltips found`);
  tooltipsProcessed = 0;
  tooltipsTotal = count;
  createLoadingIndicator();
  updateLoadingIndicator();
}

export function incrementProcessedTooltips(): void {
  tooltipsProcessed++;
  console.log(`Processed tooltip ${tooltipsProcessed}/${tooltipsTotal}`);
  updateLoadingIndicator();
}

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
