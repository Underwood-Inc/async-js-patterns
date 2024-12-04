import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Async Mastery',
  description:
    'A comprehensive guide to async JavaScript patterns with implementations',
  base: '/async-mastery/',
  ignoreDeadLinks: [
    // Ignore LICENSE file link
    /\/LICENSE/,
  ],
  markdown: {
    theme: {
      light: 'monokai',
      dark: 'monokai',
    },
    lineNumbers: true,
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Async Mastery',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Implementations', link: '/implementations/custom-promise' },
      { text: 'Patterns', link: '/patterns/tasks-series' },
      { text: 'Timers', link: '/timers/settimeout' },
      { text: 'Advanced', link: '/advanced/' },
      { text: 'Examples', link: '/examples/' },
    ],
    appearance: true,
    theme: {
      vars: {
        'c-brand': '#d4c4a8', // Beige color
        'c-brand-light': '#e5dac8', // Lighter beige
      },
    },
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
      '/implementations/': [
        {
          text: 'Promise Implementations',
          items: [
            { text: 'Custom Promise', link: '/implementations/custom-promise' },
            { text: 'Promise.all()', link: '/implementations/promise-all' },
            { text: 'Promise.any()', link: '/implementations/promise-any' },
            { text: 'Promise.race()', link: '/implementations/promise-race' },
            {
              text: 'Promise.allSettled()',
              link: '/implementations/promise-allsettled',
            },
            {
              text: 'Promise.finally()',
              link: '/implementations/promise-finally',
            },
            {
              text: 'Promise.resolve/reject',
              link: '/implementations/promise-resolve-reject',
            },
          ],
        },
      ],
      '/patterns/': [
        {
          text: 'Async Task Patterns',
          items: [
            { text: 'Tasks in Series', link: '/patterns/tasks-series' },
            { text: 'Tasks in Parallel', link: '/patterns/tasks-parallel' },
            { text: 'Tasks Racing', link: '/patterns/tasks-race' },
          ],
        },
      ],
      '/timers/': [
        {
          text: 'Timer Implementations',
          items: [
            { text: 'Custom setTimeout', link: '/timers/settimeout' },
            { text: 'Custom setInterval', link: '/timers/setinterval' },
            { text: 'Clear All Timers', link: '/timers/clear-timers' },
          ],
        },
      ],
      '/advanced/': [
        {
          text: 'Advanced Patterns',
          items: [
            { text: 'Overview', link: '/advanced/' },
            { text: 'Promisifying Callbacks', link: '/advanced/promisifying' },
            { text: 'Auto-Retry', link: '/advanced/auto-retry' },
            {
              text: 'API Batch Throttling',
              link: '/advanced/batch-throttling',
            },
            { text: 'Debouncing', link: '/advanced/debouncing' },
            { text: 'Throttling', link: '/advanced/throttling' },
            { text: 'Memoization', link: '/advanced/memoization' },
            { text: 'Error Handling', link: '/advanced/error-handling' },
          ],
        },
        {
          text: 'Performance & Optimization',
          items: [
            { text: 'Memory Management', link: '/advanced/memory-management' },
            {
              text: 'Performance Monitoring',
              link: '/advanced/performance-monitoring',
            },
            {
              text: 'Performance Profiling',
              link: '/advanced/performance-profiling',
            },
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
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Promise Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            {
              text: 'Custom Promise Usage',
              link: '/examples/custom-promise-usage',
            },
            {
              text: 'Promise.all Examples',
              link: '/examples/promise-all-examples',
            },
            {
              text: 'Promise.any Examples',
              link: '/examples/promise-any-examples',
            },
            {
              text: 'Promise.race Examples',
              link: '/examples/promise-race-examples',
            },
            {
              text: 'Promise.allSettled Examples',
              link: '/examples/promise-allsettled-examples',
            },
            {
              text: 'Promise.finally Examples',
              link: '/examples/promise-finally-examples',
            },
          ],
        },
        {
          text: 'Task Pattern Examples',
          items: [
            { text: 'Sequential Tasks', link: '/examples/sequential-tasks' },
            { text: 'Parallel Tasks', link: '/examples/parallel-tasks' },
            { text: 'Racing Tasks', link: '/examples/racing-tasks' },
          ],
        },
        {
          text: 'Timer Examples',
          items: [
            { text: 'Custom setTimeout', link: '/examples/custom-settimeout' },
            {
              text: 'Custom setInterval',
              link: '/examples/custom-setinterval',
            },
            { text: 'Timer Management', link: '/examples/timer-management' },
          ],
        },
        {
          text: 'Advanced Pattern Examples',
          items: [
            {
              text: 'Promisifying Examples',
              link: '/examples/promisifying-examples',
            },
            {
              text: 'Auto-Retry Examples',
              link: '/examples/auto-retry-examples',
            },
            {
              text: 'Batch Throttling Examples',
              link: '/examples/batch-throttling-examples',
            },
            {
              text: 'Debouncing Examples',
              link: '/examples/debouncing-examples',
            },
            {
              text: 'Throttling Examples',
              link: '/examples/throttling-examples',
            },
            {
              text: 'Memoization Examples',
              link: '/examples/memoization-examples',
            },
            {
              text: 'Error Handling Examples',
              link: '/examples/error-handling-examples',
            },
          ],
        },
        {
          text: 'Performance Examples',
          items: [
            {
              text: 'Memory Management Examples',
              link: '/examples/memory-management-examples',
            },
            {
              text: 'Performance Monitoring Examples',
              link: '/examples/performance-monitoring-examples',
            },
            {
              text: 'Browser Optimization Examples',
              link: '/examples/browser-optimization-examples',
            },
            {
              text: 'Node.js Optimization Examples',
              link: '/examples/nodejs-optimization-examples',
            },
          ],
        },
        {
          text: 'Development Examples',
          items: [
            { text: 'Testing Examples', link: '/examples/testing-examples' },
            {
              text: 'Debugging Examples',
              link: '/examples/debugging-examples',
            },
            { text: 'Linting Examples', link: '/examples/linting-example' },
            { text: 'Lint Test', link: '/examples/lint-test' },
            {
              text: 'Markdown Lint Test',
              link: '/examples/markdown-lint-test',
            },
          ],
        },
        {
          text: 'Real-World Examples',
          items: [
            {
              text: 'API Client Implementation',
              link: '/examples/api-client-implementation',
            },
            {
              text: 'Data Processing Pipeline',
              link: '/examples/data-processing-pipeline',
            },
            { text: 'Rate Limited API', link: '/examples/rate-limited-api' },
            { text: 'Caching System', link: '/examples/caching-system' },
            {
              text: 'Event Processing System',
              link: '/examples/event-processing-system',
            },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Underwood-Inc/async-mastery',
      },
    ],
  },
});
