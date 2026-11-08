import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import AndroidPipelineDiagram from './AndroidPipelineDiagram.vue';
import ArchitectureDiagram from './ArchitectureDiagram.vue';
import Preview from './Preview.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // <Preview id="materials" /> in any docs page.
    app.component('Preview', Preview);
    app.component('ArchitectureDiagram', ArchitectureDiagram);
    app.component('AndroidPipelineDiagram', AndroidPipelineDiagram);
  },
} satisfies Theme;
