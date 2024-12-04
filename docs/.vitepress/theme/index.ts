import DefaultTheme from 'vitepress/theme';
import ReadingTime from './components/ReadingTime.vue';
import './custom.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReadingTime', ReadingTime);
  },
};
