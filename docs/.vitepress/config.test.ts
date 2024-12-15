import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import matter from 'gray-matter';
import { extractContentPreview } from './config';
import type { UserConfig } from 'vitepress';

// Mock modules
vi.mock('fs');
vi.mock('gray-matter', () => ({
  default: vi.fn((input: string) => {
    // Extract content after the frontmatter
    const match = input.match(/---\n[\s\S]*?\n---\n([\s\S]*)/);
    return {
      content: match ? match[1].trim() : input,
      data: {},
    };
  }),
}));

// Mock import.meta.url before importing config
vi.mock('node:url', async () => {
  return {
    fileURLToPath: vi.fn((url) => '/mocked/path'),
    URL: class {
      constructor(path: string, base: string) {
        if (!base.startsWith('file:')) {
          base = 'file:///mocked/base/path';
        }
        return new URL(path, base);
      }
    },
  };
});

// Mock VitePress and plugins
vi.mock('vitepress', () => ({
  defineConfig: (config: any) => config,
}));

vi.mock('vitepress-plugin-mermaid', () => ({
  withMermaid: (config: any) => config,
}));

vi.mock('./plugins/readingTime', () => ({
  readingTime: {},
}));

vi.mock('./plugins/typescript', () => ({
  typescriptPlugin: {},
}));

vi.mock('./theme/markdown/codePreview', () => ({
  codePreviewPlugin: {},
}));

// Set import.meta.url for the config module
Object.defineProperty(import.meta, 'url', {
  value: 'file:///mocked/path/config.ts',
});

// Import the actual config after mocks are set up
const { default: config } = await import('./config');

describe('VitePress Config', () => {
  describe('extractContentPreview', () => {
    beforeEach(() => {
      // Reset all mocks
      vi.clearAllMocks();
    });

    it('should extract preview from valid markdown file', () => {
      const mockContent = `---
title: Test
---
This is a test content.
With multiple lines.
\`\`\`
code block
\`\`\`
      `;

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent);

      const preview = extractContentPreview('test.md');
      expect(preview).toBe('This is a test content. With multiple lines.');
    });

    it('should handle non-existent files', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      const preview = extractContentPreview('nonexistent.md');
      expect(preview).toBe('');
    });

    it('should truncate long content', () => {
      const longContent = 'a'.repeat(300);
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(longContent);
      vi.mocked(matter).mockReturnValue({
        content: longContent,
        data: {},
      } as any);

      const preview = extractContentPreview('test.md', 200);
      expect(preview.length).toBeLessThanOrEqual(203); // 200 + '...'
      expect(preview.endsWith('...')).toBe(true);
    });

    it('should handle file read errors', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error('Read error');
      });

      const preview = extractContentPreview('error.md');
      expect(preview).toBe('');
    });

    it('should remove markdown syntax', () => {
      const markdownContent = `
---
title: Test
---
# Heading
**bold** *italic* \`code\`
[link](http://example.com)
\`\`\`
code block
\`\`\`
      `;

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(markdownContent);
      vi.mocked(matter).mockReturnValue({
        content: markdownContent,
        data: {},
      } as any);

      const preview = extractContentPreview('test.md');
      expect(preview).not.toContain('**');
      expect(preview).not.toContain('*');
      expect(preview).not.toContain('`');
      expect(preview).not.toContain('[');
      expect(preview).not.toContain('](');
    });
  });

  describe('Config Structure', () => {
    const typedConfig = config as Required<UserConfig>;

    it('should have required base configuration', () => {
      expect(typedConfig.base).toBe('/web-patterns/');
      expect(typedConfig.title).toBe('Web Patterns');
      expect(typedConfig.description).toBeDefined();
      expect(typedConfig.cleanUrls).toBe(true);
    });

    it('should have markdown configuration', () => {
      expect(typedConfig.markdown).toBeDefined();
      expect(typedConfig.markdown.lineNumbers).toBe(true);
      expect(typedConfig.markdown.theme).toEqual({
        light: 'github-light',
        dark: 'github-dark',
      });
    });

    it('should have theme configuration', () => {
      expect(typedConfig.themeConfig).toBeDefined();
      expect(typedConfig.themeConfig.logo).toBe('/logo.svg');
      expect(typedConfig.themeConfig.nav).toBeDefined();
      expect(typedConfig.themeConfig.sidebar).toBeDefined();
      expect(typedConfig.themeConfig.socialLinks).toBeDefined();
    });

    it('should have proper vite configuration', () => {
      expect(typedConfig.vite).toBeDefined();
      expect(typedConfig.vite.build.cssMinify).toBe(true);
      expect(typedConfig.vite.build.cssCodeSplit).toBe(true);
      expect(typedConfig.vite.optimizeDeps.include).toContain('mermaid');
    });

    it('should have proper locales configuration', () => {
      expect(typedConfig.locales).toBeDefined();
      expect(typedConfig.locales.root.label).toBe('English');
      expect(typedConfig.locales.root.lang).toBe('en');
    });
  });
});
