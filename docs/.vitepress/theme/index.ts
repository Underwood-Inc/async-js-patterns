import Theme from 'vitepress/theme';
import { codePreviewPlugin } from './markdown/codePreview';
import './styles/code.scss';
import './styles/custom.scss';
import { createTooltipPortal, hideTooltip, showTooltip } from './tooltipPortal';

console.log('Loading VitePress theme with CodePreview support');

// Add tooltip styles for the trigger elements only
const style = document.createElement('style');
style.textContent = `
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
    console.log('Enhancing VitePress app');

    if (typeof window !== 'undefined') {
      console.log('Running in browser environment');

      // Add styles when the app is mounted
      console.log('Injecting tooltip styles');
      document.head.appendChild(style);

      // Initialize tooltip portal
      const tooltipContainer = createTooltipPortal();

      // Add a MutationObserver to handle dynamically added tooltips
      const observer = new MutationObserver((mutations) => {
        requestAnimationFrame(() => {
          const tooltips = document.querySelectorAll('.tooltip');

          if (tooltips.length > 0 && process.env.NODE_ENV === 'development') {
            console.log(`Found ${tooltips.length} tooltips in the document`);
          }

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
        console.log('Route changed, checking for tooltips');
        const tooltips = document.querySelectorAll('.tooltip');
        if (tooltips.length > 0) {
          console.log(`Found ${tooltips.length} tooltips after route change`);
        }
      };
    } else {
      console.log('Running in SSR environment');
    }
  },
  markdown: {
    config: (md) => {
      console.log('Configuring markdown with CodePreview plugin');
      codePreviewPlugin(md);
    },
  },
};
