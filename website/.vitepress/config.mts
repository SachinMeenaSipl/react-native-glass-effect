import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { defineConfig } from 'vitepress';

// Pages live in ../docs, outside this package, so Vue can't be found by walking up
// from them. Resolve it from this package instead.
const require = createRequire(import.meta.url);
const vueDir = dirname(require.resolve('vue/package.json')).split('\\').join('/');

const repo = 'https://github.com/SachinMeenaSipl/react-native-glass-effect';
const base = '/react-native-glass-effect/';
const siteUrl = `https://sachinmeenasipl.github.io${base}`;

// --- SEO -------------------------------------------------------------------------------

const siteTitle = 'Liquid Glass for React Native';
const siteDescription =
  'Liquid Glass and glassmorphism for React Native, Expo and the web: real-time background blur, iOS 26 UIGlassEffect, Android refraction shader, frosted glass views, buttons and cards.';
const keywords = [
  'react native liquid glass',
  'liquid glass',
  'glassmorphism react native',
  'react native blur view',
  'expo blur',
  'frosted glass',
  'iOS 26 UIGlassEffect',
  'backdrop blur',
  'react-native-web glass',
  'Next.js glassmorphism',
].join(', ');
const ogImage = `${siteUrl}og-image.jpg`;

/** First prose paragraph of a page, as plain text, for its meta description. */
function firstParagraph(markdown: string): string {
  const body = markdown.replace(/^---[\s\S]*?---\s*/, '');
  const lines = body.split(/\r?\n/);
  const paragraph: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (paragraph.length && !t) break;
    if (!t || /^(#|<|\||```|:::|-|\*|>|!\[|\d+\.)/.test(t)) continue;
    paragraph.push(t);
  }
  const text = paragraph
    .join(' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, '')}…`;
}


const sidebar = [
  {
    text: 'Getting started',
    items: [
      { text: 'Introduction', link: '/guide/introduction' },
      { text: 'How it works', link: '/guide/how-it-works' },
      { text: 'Quick start', link: '/guide/quick-start' },
      { text: 'Core concepts', link: '/guide/core-concepts' },
      { text: 'Playground', link: '/guide/playground' },
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
      { text: 'Property precedence', link: '/features/precedence' },
      { text: 'Theming', link: '/features/theming' },
      { text: 'Touch and motion', link: '/features/interaction' },
      { text: 'iOS renderers', link: '/features/ios-renderers' },
      { text: 'Quality', link: '/features/quality' },
      { text: 'Performance', link: '/features/performance' },
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
      { text: 'Compatibility', link: '/reference/compatibility' },
      { text: 'Platform support', link: '/reference/platform-support' },
      { text: 'Troubleshooting', link: '/reference/troubleshooting' },
      { text: 'FAQ', link: '/reference/faq' },
      { text: 'Glossary', link: '/reference/glossary' },
      { text: 'Changelog', link: '/reference/changelog' },
    ],
  },
];

// The site is built from the repo's own docs/ folder, so there is one copy of the docs.
export default defineConfig({
  lang: 'en-US',
  title: 'Liquid Glass Native',
  titleTemplate: `:title · ${siteTitle}`,
  description: siteDescription,
  base,
  sitemap: { hostname: siteUrl },
  // Per-page SEO: a description (from the frontmatter, or else the page's first paragraph),
  // a canonical URL, and Open Graph / Twitter tags that match the page.
  transformPageData(pageData, { siteConfig }) {
    const fm = pageData.frontmatter;
    if (!fm.description && pageData.filePath) {
      try {
        const text = firstParagraph(readFileSync(join(siteConfig.srcDir, pageData.filePath), 'utf8'));
        if (text) {
          fm.description = text;
          // VitePress renders <meta name="description"> from this field, set before this hook.
          pageData.description = text;
        }
      } catch {
        // Keep the site description.
      }
    }
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '');
    const url = `${siteUrl}${path}`;
    const title = fm.title ?? (pageData.title ? `${pageData.title} · ${siteTitle}` : siteTitle);
    const description = fm.description ?? siteDescription;
    fm.head ??= [];
    fm.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    );
  },
  srcDir: '../docs',
  srcExclude: ['roadmap/**', 'user-guide/**'],
  cleanUrls: true,
  rewrites: {
    'architecture/README.md': 'architecture/index.md',
  },
  // Links to repo files outside docs/ (examples/, AGENTS.md, src/) aren't site pages.
  ignoreDeadLinks: [/^\.\.\/\.\.\//, /AGENTS/, /examples/, /CONTRIBUTING/],
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.svg` }],
    ['meta', { name: 'keywords', content: keywords }],
    ['meta', { name: 'author', content: 'Sachin Meena' }],
    ['meta', { name: 'theme-color', content: '#0c1150' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: 'Liquid Glass for React Native: glass panels over colourful artwork on Android' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    // Structured data: tells search engines this is a software library and where its code lives.
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'react-native-liquid-glass-native',
        alternateName: siteTitle,
        description: siteDescription,
        url: siteUrl,
        codeRepository: repo,
        programmingLanguage: ['TypeScript', 'Kotlin', 'Objective-C++'],
        runtimePlatform: ['React Native', 'Expo', 'Android', 'iOS', 'Web'],
        license: 'https://opensource.org/licenses/MIT',
        author: { '@type': 'Person', name: 'Sachin Meena' },
        image: ogImage,
      }),
    ],
  ],
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
      { text: 'Compatibility', link: '/reference/compatibility' },
      { text: 'Playground', link: '/guide/playground' },
      {
        text: 'More',
        items: [
          { text: 'Live web demo', link: `https://sachinmeenasipl.github.io${base}demo/` },
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
            { text: 'Web', link: '/architecture/09-web' },
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
