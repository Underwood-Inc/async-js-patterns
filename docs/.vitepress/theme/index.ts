import { inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import { setupTooltips } from './setupTooltips';
import './styles/custom.scss';

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    if (inBrowser) {
      setupTooltips();
    }
  },
};
