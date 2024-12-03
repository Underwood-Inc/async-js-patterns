import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Async JS Patterns',
  description: 'A comprehensive guide to async JavaScript patterns with implementations',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    sidebar: [
      {
        text: 'Promise Implementations',
        items: [
          { text: 'Custom Promise', link: '/implementations/custom-promise' },
          { text: 'Promise.all()', link: '/implementations/promise-all' },
          { text: 'Promise.any()', link: '/implementations/promise-any' },
          { text: 'Promise.race()', link: '/implementations/promise-race' },
          { text: 'Promise.allSettled()', link: '/implementations/promise-allsettled' },
          { text: 'Promise.finally()', link: '/implementations/promise-finally' },
          { text: 'Promise.resolve/reject', link: '/implementations/promise-resolve-reject' },
        ]
      },
      {
        text: 'Async Task Patterns',
        items: [
          { text: 'Tasks in Series', link: '/patterns/tasks-series' },
          { text: 'Tasks in Parallel', link: '/patterns/tasks-parallel' },
          { text: 'Tasks Racing', link: '/patterns/tasks-race' },
        ]
      },
      {
        text: 'Timer Implementations',
        items: [
          { text: 'Custom setTimeout', link: '/timers/settimeout' },
          { text: 'Custom setInterval', link: '/timers/setinterval' },
          { text: 'Clear All Timers', link: '/timers/clear-timers' },
        ]
      },
      {
        text: 'Advanced Patterns',
        items: [
          { text: 'Promisifying Callbacks', link: '/advanced/promisifying' },
          { text: 'Auto-Retry', link: '/advanced/auto-retry' },
          { text: 'API Batch Throttling', link: '/advanced/batch-throttling' },
          { text: 'Debouncing', link: '/advanced/debouncing' },
          { text: 'Throttling', link: '/advanced/throttling' },
          { text: 'Memoization', link: '/advanced/memoization' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/async-js-patterns' }
    ]
  }
}); 