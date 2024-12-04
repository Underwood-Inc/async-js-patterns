import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { defineConfig } from 'vitepress';
import { readingTime } from './plugins/readingTime';
import { typescriptPlugin } from './plugins/typescript';
import { codePreviewPlugin } from './theme/markdown/codePreview';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  title: 'Web Patterns',
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
    siteTitle: false,
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      {
        text: 'Patterns',
        items: [
          {
            text: 'Core',
            items: [
              { text: 'Async', link: '/async/' },
              { text: 'TypeScript', link: '/typescript/utility-types' },
              { text: 'Styling', link: '/styling/' },
            ],
          },
          {
            text: 'Advanced',
            items: [
              { text: 'Performance', link: '/async/performance' },
              { text: 'Error Handling', link: '/async/error-handling' },
              { text: 'Testing', link: '/typescript/testing-patterns' },
            ],
          },
        ],
      },
      {
        text: 'Examples',
        items: [
          {
            text: 'Async',
            items: [
              { text: 'Promise Usage', link: '/examples/custom-promise-usage' },
              { text: 'Parallel Tasks', link: '/examples/parallel-tasks' },
              { text: 'Sequential Tasks', link: '/examples/sequential-tasks' },
              { text: 'Promise.all', link: '/examples/promise-all-examples' },
              { text: 'Promise.race', link: '/examples/promise-race-examples' },
              { text: 'Promise.any', link: '/examples/promise-any-examples' },
              {
                text: 'Promise.allSettled',
                link: '/examples/promise-allsettled-examples',
              },
              {
                text: 'Promise.finally',
                link: '/examples/promise-finally-examples',
              },
              { text: 'Promisifying', link: '/examples/promisifying-examples' },
            ],
          },
          {
            text: 'Performance',
            items: [
              { text: 'Auto-Retry', link: '/examples/auto-retry-examples' },
              {
                text: 'Batch Throttling',
                link: '/examples/batch-throttling-examples',
              },
              { text: 'Debouncing', link: '/examples/debouncing-examples' },
              { text: 'Throttling', link: '/examples/throttling-examples' },
              { text: 'Memoization', link: '/examples/memoization-examples' },
            ],
          },
          {
            text: 'Optimization',
            items: [
              {
                text: 'Browser',
                link: '/examples/browser-optimization-examples',
              },
              {
                text: 'Node.js',
                link: '/examples/nodejs-optimization-examples',
              },
              { text: 'Memory', link: '/examples/memory-management-examples' },
              {
                text: 'Performance',
                link: '/examples/performance-monitoring-examples',
              },
            ],
          },
          {
            text: 'Timers',
            items: [
              { text: 'Timer Management', link: '/examples/timer-management' },
              {
                text: 'Custom setTimeout',
                link: '/examples/custom-settimeout',
              },
              {
                text: 'Custom setInterval',
                link: '/examples/custom-setinterval',
              },
            ],
          },
          {
            text: 'Development',
            items: [
              { text: 'Linting', link: '/examples/linting-example' },
              { text: 'Lint Testing', link: '/examples/lint-test' },
              { text: 'Markdown Lint', link: '/examples/markdown-lint-test' },
            ],
          },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/getting-started' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
        {
          text: 'Contributing',
          items: [
            { text: 'How to Contribute', link: '/CONTRIBUTING' },
            { text: 'License', link: '/LICENSE' },
          ],
        },
      ],
      '/async/': [
        {
          text: 'Async Patterns',
          items: [
            { text: 'Overview', link: '/async/' },
            { text: 'Promise Patterns', link: '/async/promises' },
            { text: 'Task Management', link: '/async/tasks' },
            { text: 'Timer Patterns', link: '/async/timers' },
            { text: 'Control Flow', link: '/async/control-flow' },
            { text: 'Error Handling', link: '/async/error-handling' },
            { text: 'Performance', link: '/async/performance' },
          ],
        },
      ],
      '/typescript/': [
        {
          text: 'TypeScript Patterns',
          items: [
            { text: 'Utility Types', link: '/typescript/utility-types' },
            { text: 'Type Guards', link: '/typescript/type-guards' },
            { text: 'Type Inference', link: '/typescript/type-inference' },
          ],
        },
        {
          text: 'Type Operations',
          items: [
            {
              text: 'Conditional Types',
              link: '/typescript/conditional-types',
            },
            { text: 'Mapped Types', link: '/typescript/mapped-types' },
            {
              text: 'Template Literals',
              link: '/typescript/template-literals',
            },
          ],
        },
        {
          text: 'Data Structures',
          items: [
            { text: 'Array Operations', link: '/typescript/array-operations' },
            { text: 'Array Utilities', link: '/typescript/array-utilities' },
            { text: 'Type-Safe Arrays', link: '/typescript/type-safe-arrays' },
            {
              text: 'String Manipulation',
              link: '/typescript/string-manipulation',
            },
            { text: 'String Utilities', link: '/typescript/string-utilities' },
          ],
        },
        {
          text: 'State Management',
          items: [
            { text: 'State Management', link: '/typescript/state-management' },
            { text: 'Immutable State', link: '/typescript/immutable-state' },
            { text: 'Observable State', link: '/typescript/observable-state' },
          ],
        },
        {
          text: 'Testing',
          items: [
            { text: 'Testing Patterns', link: '/typescript/testing-patterns' },
            { text: 'Test Utilities', link: '/typescript/test-utilities' },
            { text: 'Type Testing', link: '/typescript/type-testing' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Promise Patterns',
          items: [
            { text: 'Custom Promises', link: '/examples/custom-promise-usage' },
            { text: 'Promise.all', link: '/examples/promise-all-examples' },
            { text: 'Promise.race', link: '/examples/promise-race-examples' },
            { text: 'Promise.any', link: '/examples/promise-any-examples' },
            {
              text: 'Promise.allSettled',
              link: '/examples/promise-allsettled-examples',
            },
            {
              text: 'Promise.finally',
              link: '/examples/promise-finally-examples',
            },
            { text: 'Promisifying', link: '/examples/promisifying-examples' },
          ],
        },
        {
          text: 'Task Management',
          items: [
            { text: 'Parallel Tasks', link: '/examples/parallel-tasks' },
            { text: 'Sequential Tasks', link: '/examples/sequential-tasks' },
            { text: 'Racing Tasks', link: '/examples/racing-tasks' },
          ],
        },
        {
          text: 'Timer Patterns',
          items: [
            { text: 'Timer Management', link: '/examples/timer-management' },
            { text: 'Custom setTimeout', link: '/examples/custom-settimeout' },
            {
              text: 'Custom setInterval',
              link: '/examples/custom-setinterval',
            },
          ],
        },
        {
          text: 'Performance',
          items: [
            { text: 'Auto-Retry', link: '/examples/auto-retry-examples' },
            {
              text: 'Batch Throttling',
              link: '/examples/batch-throttling-examples',
            },
            { text: 'Debouncing', link: '/examples/debouncing-examples' },
            { text: 'Throttling', link: '/examples/throttling-examples' },
            { text: 'Memoization', link: '/examples/memoization-examples' },
          ],
        },
        {
          text: 'Optimization',
          items: [
            {
              text: 'Browser',
              link: '/examples/browser-optimization-examples',
            },
            { text: 'Node.js', link: '/examples/nodejs-optimization-examples' },
            { text: 'Memory', link: '/examples/memory-management-examples' },
            {
              text: 'Performance',
              link: '/examples/performance-monitoring-examples',
            },
          ],
        },
        {
          text: 'Development',
          items: [
            { text: 'Linting', link: '/examples/linting-example' },
            { text: 'Lint Testing', link: '/examples/lint-test' },
            { text: 'Markdown Lint', link: '/examples/markdown-lint-test' },
          ],
        },
      ],
      '/styling/': [
        {
          text: 'Styling Patterns',
          items: [
            { text: 'Overview', link: '/styling/' },
            { text: 'CSS Patterns', link: '/styling/css-patterns' },
            { text: 'SCSS Patterns', link: '/styling/scss-patterns' },
          ],
        },
        {
          text: 'Methodologies',
          items: [
            { text: 'BEM', link: '/styling/bem-methodology' },
            { text: 'Spacing', link: '/styling/single-direction-spacing' },
            { text: 'Selectors', link: '/styling/lobotomized-owl' },
          ],
        },
      ],
    },
    footer: {
      message: 'Released under the OpenRAIL-S v1.0 License.',
      copyright: 'Copyright © 2024-present Underwood Inc.',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Underwood-Inc/web-patterns' },
    ],
    outline: 'deep',
    aside: true,
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
      },
    },
  },
  appearance: true,
});
