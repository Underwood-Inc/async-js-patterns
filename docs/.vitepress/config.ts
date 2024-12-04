import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { defineConfig } from 'vitepress';
import { readingTime } from './plugins/readingTime';
import { typescriptPlugin } from './plugins/typescript';
import { codePreviewPlugin } from './theme/markdown/codePreview';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  title: 'Modern Web Development Patterns',
  description:
    'A comprehensive guide to async JavaScript, TypeScript patterns, and modern styling',
  base: '/web-patterns/',
  cleanUrls: true,
  ignoreDeadLinks: [
    // Ignore LICENSE file link
    /\/LICENSE/,
  ],
  head: [
    // Favicons
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/web-patterns/logo.svg' },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/web-patterns/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/web-patterns/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/web-patterns/apple-touch-icon.png',
      },
    ],
    ['link', { rel: 'manifest', href: '/web-patterns/site.webmanifest' }],
  ],
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    config: (md) => {
      md.use(readingTime);
      md.use(typescriptPlugin);
      md.use(codePreviewPlugin);
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [resolve(__dirname, 'theme/styles')],
        },
      },
    },
    server: {
      fs: {
        strict: false,
      },
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Modern Web Development Patterns',
    nav: [
      { text: 'Guide', link: '/' },
      {
        text: 'Advanced',
        items: [
          { text: 'Overview', link: '/advanced/' },
          { text: 'Performance', link: '/advanced/performance/' },
          { text: 'Error Handling', link: '/advanced/error-handling' },
          { text: 'Development', link: '/advanced/development/' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Browser', link: '/examples/browser-optimization-examples' },
          { text: 'Node.js', link: '/examples/nodejs-optimization-examples' },
          { text: 'Parallel Tasks', link: '/examples/parallel-tasks' },
        ],
      },
      { text: 'Styling', link: '/styling/' },
    ],
    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Contributing', link: '/CONTRIBUTING' },
            { text: 'License', link: '/LICENSE' },
          ],
        },
      ],
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
      ],
      '/advanced/': [
        {
          text: 'Advanced Patterns',
          items: [
            { text: 'Overview', link: '/advanced/' },
            {
              text: 'Performance',
              items: [
                { text: 'Auto-Retry', link: '/advanced/auto-retry' },
                {
                  text: 'Batch Throttling',
                  link: '/advanced/batch-throttling',
                },
                { text: 'Debouncing', link: '/advanced/debouncing' },
                { text: 'Throttling', link: '/advanced/throttling' },
                { text: 'Memoization', link: '/advanced/memoization' },
              ],
            },
            {
              text: 'Memory & Performance',
              items: [
                {
                  text: 'Memory Management',
                  link: '/advanced/memory-management',
                },
                {
                  text: 'Performance Monitoring',
                  link: '/advanced/performance-monitoring',
                },
              ],
            },
            {
              text: 'Environment Optimizations',
              items: [
                {
                  text: 'Browser Optimizations',
                  link: '/advanced/browser-optimizations',
                },
                {
                  text: 'Node.js Optimizations',
                  link: '/advanced/nodejs-optimizations',
                },
              ],
            },
            {
              text: 'Development Tools',
              items: [
                {
                  text: 'Testing Strategies',
                  link: '/advanced/testing-strategies',
                },
                {
                  text: 'Debugging Techniques',
                  link: '/advanced/debugging-techniques',
                },
                {
                  text: 'Performance Profiling',
                  link: '/advanced/performance-profiling',
                },
              ],
            },
            {
              text: 'Error Management',
              items: [
                { text: 'Error Handling', link: '/advanced/error-handling' },
              ],
            },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Underwood-Inc/web-patterns',
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Underwood Inc.',
    },
  },
  appearance: true,
});
