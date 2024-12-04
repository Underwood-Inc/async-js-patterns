import DefaultTheme from 'vitepress/theme';
import ReadingTime from './components/ReadingTime.vue';
import './styles/custom.scss';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReadingTime', ReadingTime);
  },
};
