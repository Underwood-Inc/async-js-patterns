import { inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import './styles/index.scss';

// Lazy load tooltip setup
const setupTooltips = () =>
  import('./setupTooltips').then((m) => m.setupTooltips());

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    if (inBrowser) {
      setupTooltips();
    }
  },
};
