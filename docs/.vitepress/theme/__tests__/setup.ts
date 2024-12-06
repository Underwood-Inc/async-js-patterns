import { vi } from 'vitest';

// Mock VitePress theme
vi.mock('vitepress/theme', () => ({
  default: {
    Layout: {},
    NotFound: {},
    enhanceApp: () => {},
  },
}));

// Mock VitePress client
vi.mock('vitepress', () => ({
  inBrowser: true,
  useData: () => ({
    theme: {},
    site: {},
    page: {},
    frontmatter: {},
  }),
}));
