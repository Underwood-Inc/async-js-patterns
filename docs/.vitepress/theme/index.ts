import DefaultTheme from 'vitepress/theme';
import Layout from './Layout.vue';
import './styles/custom.scss';

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // Theme enhancement can be added here if needed
  },
};
