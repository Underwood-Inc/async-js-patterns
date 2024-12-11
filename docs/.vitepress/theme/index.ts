import { inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import Layout from './Layout.vue';
import './styles/index.scss';
import CustomFooter from './components/CustomFooter.vue';

// Lazy load tooltip setup
const setupTooltips = () =>
  import('./setupTooltips').then((m) => m.setupTooltips());

export default {
  ...DefaultTheme,
  Layout: () => {
    return h(Layout, null, {
      'layout-bottom': () => h(CustomFooter),
    });
  },
  enhanceApp({ app }) {
    if (inBrowser) {
      setupTooltips();
    }
  },
};
