import { useRouter } from 'vitepress';
import Theme from 'vitepress/theme';
import { onMounted, watch } from 'vue';
import TooltipLoader from './components/TooltipLoader.vue';
import { codePreviewPlugin } from './markdown/codePreview';
import './styles/code.scss';
import './styles/custom.scss';
import { createTooltipPortal, hideTooltip, showTooltip } from './tooltipPortal';

declare global {
  interface Window {
    tooltipLoader?: {
      updateProgress: (processed: number, total: number) => void;
      hideLoader: () => void;
    };
  }
}

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
}

/* Ensure tooltip portal is above everything */
.tooltip-portal {
  position: fixed !important;
  z-index: 9999999 !important;
}

.tooltip-content {
  z-index: 9999999 !important;
}
`;

// Track processed tooltips to avoid duplicate handlers
const processedTooltips = new WeakSet();

// Function to handle tooltip initialization
function initializeTooltips(tooltipContainer: HTMLElement | null) {
  if (!tooltipContainer) return;

  const tooltips = document.querySelectorAll('.tooltip');
  const unprocessedCount = Array.from(tooltips).filter(
    (t) => !processedTooltips.has(t)
  ).length;

  if (unprocessedCount > 0 && window.tooltipLoader) {
    window.tooltipLoader.updateProgress(0, unprocessedCount);
  }

  let processed = 0;
  tooltips.forEach((tooltip) => {
    // Skip if already processed
    if (processedTooltips.has(tooltip)) {
      return;
    }

    let currentTooltipEl: HTMLElement | null = null;

    tooltip.addEventListener('mouseenter', (event) => {
      const tooltipContent = tooltip.getAttribute('data-tooltip');
      const rect = tooltip.getBoundingClientRect();
      if (tooltipContent) {
        currentTooltipEl = showTooltip(
          tooltipContainer,
          tooltipContent,
          rect.left + rect.width / 2,
          rect.top
        );
        processed++;
        if (window.tooltipLoader) {
          window.tooltipLoader.updateProgress(processed, unprocessedCount);
          if (processed === unprocessedCount) {
            window.tooltipLoader.hideLoader();
          }
        }
      }
    });

    tooltip.addEventListener('mouseleave', () => {
      hideTooltip(currentTooltipEl);
      currentTooltipEl = null;
    });

    // Mark as processed
    processedTooltips.add(tooltip);
  });
}

export default {
  extends: Theme,
  enhanceApp({ app }) {
    // Register the TooltipLoader component
    app.component('TooltipLoader', TooltipLoader);
  },
  setup() {
    let tooltipContainer: HTMLElement | null = null;
    let observer: MutationObserver | null = null;

    onMounted(() => {
      if (typeof window === 'undefined') return;

      // Add styles
      const style = document.createElement('style');
      style.textContent = tooltipStyles;
      document.head.appendChild(style);

      // Initialize tooltip portal
      tooltipContainer = createTooltipPortal();

      // Create observer
      observer = new MutationObserver(() => {
        requestAnimationFrame(() => {
          initializeTooltips(tooltipContainer);
        });
      });

      // Start observing
      observer.observe(document.body, { childList: true, subtree: true });

      // Initial tooltip check
      initializeTooltips(tooltipContainer);

      // Watch for route changes
      const router = useRouter();
      watch(
        () => router.route.path,
        () => {
          // Reset and reinitialize on route change
          if (observer) {
            observer.disconnect();
            observer.observe(document.body, { childList: true, subtree: true });
          }
          initializeTooltips(tooltipContainer);
        }
      );
    });

    // Cleanup
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  },
  markdown: {
    config: (md) => {
      codePreviewPlugin(md);
    },
  },
};
