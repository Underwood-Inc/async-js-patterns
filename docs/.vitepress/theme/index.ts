import { inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import './styles/index.scss';
import CustomFooter from './components/CustomFooter.vue';
import DevPanel from './components/dev/DevPanel.vue';

// Lazy load tooltip setup
const setupTooltips = () =>
  import('./setupTooltips').then((m) => m.setupTooltips());

export default {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => [
        h(DevPanel),
        h(CustomFooter)
      ]
    });
  },
  enhanceApp({ app }) {
    if (inBrowser) {
      setupTooltips();
    }
  },
};
