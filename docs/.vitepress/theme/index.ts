import Theme from 'vitepress/theme';
import { codePreviewPlugin } from './markdown/codePreview';
import './styles/code.scss';
import './styles/custom.scss';
import { createTooltipPortal, hideTooltip, showTooltip } from './tooltipPortal';

// Create the style content string
const tooltipStyles = `
.tooltip {
  position: relative !important;
  border-bottom: 1px dashed var(--vp-c-brand) !important;
  cursor: help !important;
  display: inline !important;
}

/* Dark theme adjustments */
.dark .tooltip-content {
  background: var(--vp-c-bg-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Ensure tooltips work within Shiki code blocks */
.vp-code .tooltip {
  text-decoration: none !important;
  border-bottom: 1px dashed var(--vp-c-brand) !important;
}

/* Preserve Shiki syntax highlighting */
.vp-code .tooltip[style] {
  color: inherit !important;
}`;

// Track processed tooltips to avoid duplicate handlers
const processedTooltips = new WeakSet();

export default {
  extends: Theme,
  async enhanceApp({ app, router }) {
    // Only run client-side code in browser environment
    if (import.meta.env.SSR) {
      return;
    }

    // Wait for the DOM to be ready
    if (typeof window !== 'undefined') {
      // Add styles
      const style = document.createElement('style');
      style.textContent = tooltipStyles;
      document.head.appendChild(style);

      // Initialize tooltip portal
      const tooltipContainer = createTooltipPortal();

      // Add a MutationObserver to handle dynamically added tooltips
      const observer = new MutationObserver((mutations) => {
        requestAnimationFrame(() => {
          const tooltips = document.querySelectorAll('.tooltip');
          tooltips.forEach((tooltip) => {
            // Skip if already processed
            if (processedTooltips.has(tooltip)) {
              return;
            }

            let currentTooltipEl = null;

            tooltip.addEventListener('mouseenter', (event) => {
              const tooltipContent = tooltip.getAttribute('data-tooltip');
              const rect = tooltip.getBoundingClientRect();
              currentTooltipEl = showTooltip(
                tooltipContainer,
                tooltipContent,
                rect.left + rect.width / 2,
                rect.top
              );
            });

            tooltip.addEventListener('mouseleave', () => {
              hideTooltip(currentTooltipEl);
              currentTooltipEl = null;
            });

            // Mark as processed
            processedTooltips.add(tooltip);
          });
        });
      });

      // Start observing the document with the configured parameters
      observer.observe(document.body, { childList: true, subtree: true });

      // Add route change handler to reinitialize tooltips
      router.onAfterRouteChanged = () => {
        const tooltips = document.querySelectorAll('.tooltip');
        if (tooltips.length > 0) {
          observer.disconnect();
          observer.observe(document.body, { childList: true, subtree: true });
        }
      };
    }
  },
  markdown: {
    config: (md) => {
      codePreviewPlugin(md);
    },
  },
};
