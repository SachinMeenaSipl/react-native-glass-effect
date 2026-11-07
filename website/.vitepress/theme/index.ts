import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Preview from './Preview.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // <Preview id="materials" /> in any docs page.
    app.component('Preview', Preview);
  },
} satisfies Theme;
