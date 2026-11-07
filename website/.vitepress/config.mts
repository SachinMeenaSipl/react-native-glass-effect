import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { defineConfig } from 'vitepress';

// Pages live in ../docs, outside this package, so Vue can't be found by walking up
// from them. Resolve it from this package instead.
const require = createRequire(import.meta.url);
const vueDir = dirname(require.resolve('vue/package.json')).split('\\').join('/');

const repo = 'https://github.com/SachinMeenaSipl/react-native-glass-effect';
const base = '/react-native-glass-effect/';

const sidebar = [
  {
    text: 'Getting started',
    items: [
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'How it works', link: '/guide/how-it-works' },
      { text: 'Quick start', link: '/guide/quick-start' },
      { text: 'Core concepts', link: '/guide/core-concepts' },
    ],
  },
  {
    text: 'Installation',
    items: [
      { text: 'Overview', link: '/installation/' },
      { text: 'React Native (CLI)', link: '/installation/react-native' },
      { text: 'Expo', link: '/installation/expo' },
      { text: 'Web: React (Vite)', link: '/installation/web' },
      { text: 'Web: Next.js', link: '/installation/nextjs' },
      { text: 'Verify the install', link: '/installation/verify' },
    ],
  },
  {
    text: 'Components',
    items: [
      { text: 'LiquidGlassView', link: '/components/liquid-glass-view' },
      { text: 'GlassBackdrop', link: '/components/glass-backdrop' },
      { text: 'LiquidGlass', link: '/components/liquid-glass' },
      { text: 'FrostedGlass', link: '/components/frosted-glass' },
      { text: 'LiquidGlassButton', link: '/components/liquid-glass-button' },
      { text: 'LiquidGlassCard', link: '/components/liquid-glass-card' },
      { text: 'GlassAdjuster', link: '/components/glass-adjuster' },
      { text: 'GlassThemeProvider', link: '/components/glass-theme-provider' },
    ],
  },
  {
    text: 'Features',
    items: [
      { text: 'Materials', link: '/features/materials' },
      { text: 'Appearance props', link: '/features/appearance' },
      { text: 'Theming', link: '/features/theming' },
      { text: 'Touch and motion', link: '/features/interaction' },
      { text: 'iOS renderers', link: '/features/ios-renderers' },
      { text: 'Quality and performance', link: '/features/quality' },
      { text: 'Accessibility', link: '/features/accessibility' },
      { text: 'Capabilities', link: '/features/capabilities' },
      { text: 'Diagnostics', link: '/features/diagnostics' },
    ],
  },
  {
    text: 'Recipes',
    items: [
      { text: 'Overview', link: '/recipes/' },
      { text: 'Glass header', link: '/recipes/header' },
      { text: 'Glass tab bar', link: '/recipes/tab-bar' },
      { text: 'Cards over images', link: '/recipes/cards-over-images' },
      { text: 'Glass in a modal', link: '/recipes/modal' },
      { text: 'Settings toggle', link: '/recipes/settings-toggle' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'API', link: '/reference/api' },
      { text: 'Platform support', link: '/reference/platform-support' },
      { text: 'Troubleshooting', link: '/reference/troubleshooting' },
      { text: 'FAQ', link: '/reference/faq' },
    ],
  },
];

// The site is built from the repo's own docs/ folder, so there is one copy of the docs.
export default defineConfig({
  title: 'Liquid Glass Native',
  description:
    'Liquid Glass surfaces for React Native, Expo and the web: live background blur, refraction and lighting.',
  base,
  srcDir: '../docs',
  srcExclude: ['roadmap/**', 'user-guide/**'],
  cleanUrls: true,
  rewrites: {
    'architecture/README.md': 'architecture/index.md',
  },
  // Links to repo files outside docs/ (examples/, AGENTS.md, src/) aren't site pages.
  ignoreDeadLinks: [/^\.\.\/\.\.\//, /AGENTS/, /examples/, /CONTRIBUTING/],
  head: [['link', { rel: 'icon', href: `${base}favicon.svg` }]],
  vite: {
    resolve: {
      alias: [{ find: /^vue($|\/)/, replacement: `${vueDir}$1` }],
    },
  },
  markdown: {
    // Docs show JSX like `style={{ flex: 1 }}` in inline code. Keep Vue from
    // treating the double braces as template expressions.
    config(md) {
      const render = md.renderer.rules.code_inline!;
      md.renderer.rules.code_inline = (...args) => render(...args).replace('<code', '<code v-pre');
    },
  },
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Install', link: '/installation/' },
      { text: 'Components', link: '/components/liquid-glass-view' },
      { text: 'Recipes', link: '/recipes/' },
      { text: 'Live demo', link: `https://sachinmeenasipl.github.io${base}demo/`, target: '_blank' },
      {
        text: 'More',
        items: [
          { text: 'API reference', link: '/reference/api' },
          { text: 'Architecture', link: '/architecture/' },
          { text: 'npm', link: 'https://www.npmjs.com/package/react-native-liquid-glass-native' },
        ],
      },
    ],
    sidebar: {
      '/guide/': sidebar,
      '/installation/': sidebar,
      '/components/': sidebar,
      '/features/': sidebar,
      '/recipes/': sidebar,
      '/reference/': sidebar,
      '/architecture/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/architecture/01-overview' },
            { text: 'JS layer', link: '/architecture/02-js-layer' },
            { text: 'Android renderer', link: '/architecture/03-android-renderer' },
            { text: 'iOS', link: '/architecture/04-ios' },
            { text: 'Edge cases', link: '/architecture/05-edge-cases' },
            { text: 'Decisions', link: '/architecture/06-decisions' },
            { text: 'Testing', link: '/architecture/07-testing' },
            { text: 'Runtime behaviour', link: '/architecture/08-behaviour-trace' },
          ],
        },
      ],
    },
    outline: { level: [2, 3] },
    socialLinks: [{ icon: 'github', link: repo }],
    search: { provider: 'local' },
    editLink: {
      pattern: `${repo}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
    },
  },
});
