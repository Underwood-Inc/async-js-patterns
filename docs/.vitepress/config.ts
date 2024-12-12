import fs from 'fs';
import matter from 'gray-matter';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { getHighlighter } from 'shiki';
import { defineConfig } from 'vitepress';
import { readingTime } from './plugins/readingTime';
import { typescriptPlugin } from './plugins/typescript';
import { codePreviewPlugin } from './theme/markdown/codePreview';
import { withMermaid } from 'vitepress-plugin-mermaid';
import {
  processTooltips,
  applyTooltipsToCode,
} from './theme/utils/tooltipProcessor';
import container from 'markdown-it-container';
import { debugLog } from './theme/markdown/codePreview';
import { codeTooltipsPlugin } from './theme/markdown/codeTooltips';
import { performanceLogger } from './theme/utils/performanceLogger';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Site metadata
const siteName = 'Web Patterns';
const siteDescription =
  'A comprehensive guide to async JavaScript, TypeScript patterns, and modern styling practices';
const siteUrl = 'https://underwood-inc.github.io/web-patterns';
const defaultImage = '/web-patterns/social-preview.png';
const twitterHandle = 'tetrawhispers';
const siteImage = defaultImage;

const languages = [
  'typescript',
  'javascript',
  'json',
  'bash',
  'markdown',
  'tsx',
  'scss',
  'css',
  'html',
  'python'
];

// Function to extract content preview from markdown
function extractContentPreview(filePath: string, maxLength = 200): string {
  try {
    const fullPath = resolve(__dirname, '../', filePath);
    if (!fs.existsSync(fullPath)) return '';

    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const { content } = matter(fileContent);

    // Remove markdown syntax and code blocks
    const plainText = content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`.*?`/g, '') // Remove inline code
      .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1') // Replace links with text
      .replace(/[#*_]/g, '') // Remove markdown syntax
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();

    // Get first paragraph or truncate to maxLength
    const preview = plainText.split(/\n\n/)[0];
    return preview.length > maxLength
      ? preview.slice(0, maxLength).trim() + '...'
      : preview;
  } catch (error) {
    console.warn(`Error extracting preview from ${filePath}:`, error);
    return '';
  }
}

export default withMermaid(
  defineConfig({
    title: siteName,
    description: siteDescription,
    base: '/web-patterns/',
    cleanUrls: true,
    ignoreDeadLinks: [
      // Ignore LICENSE file link
      /\/LICENSE/,
      // Ignore all react-component-patterns links
      /\/react-component-patterns\/.*/,
      /\.\/component-[a-z]/,
    ],

    transformPageData(pageData) {
      // Get content preview for the current page
      const preview = extractContentPreview(pageData.relativePath);

      // Construct page title
      const pageTitle = pageData.frontmatter.title
        ? `${pageData.frontmatter.title} | ${siteName}`
        : siteName;

      // Get page description
      const pageDescription =
        pageData.frontmatter.description || preview || siteDescription;

      // Get page image
      const pageImage = pageData.frontmatter.image || defaultImage;

      // Update page metadata
      pageData.frontmatter.head = [
        // Open Graph / Facebook
        ['meta', { property: 'og:type', content: 'article' }],
        ['meta', { property: 'og:site_name', content: siteName }],
        ['meta', { property: 'og:title', content: pageTitle }],
        ['meta', { property: 'og:description', content: pageDescription }],
        [
          'meta',
          {
            property: 'og:url',
            content: `${siteUrl}${pageData.relativePath.replace(/\.md$/, '')}`,
          },
        ],
        ['meta', { property: 'og:image', content: `${siteUrl}${pageImage}` }],
        ['meta', { property: 'og:image:alt', content: pageTitle }],
        ['meta', { property: 'og:image:width', content: '1200' }],
        ['meta', { property: 'og:image:height', content: '630' }],
        [
          'meta',
          {
            property: 'article:published_time',
            content: pageData.frontmatter.date || new Date().toISOString(),
          },
        ],
        [
          'meta',
          {
            property: 'article:modified_time',
            content: pageData.frontmatter.updated || new Date().toISOString(),
          },
        ],

        // Twitter
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:site', content: twitterHandle }],
        ['meta', { name: 'twitter:creator', content: twitterHandle }],
        ['meta', { name: 'twitter:title', content: pageTitle }],
        ['meta', { name: 'twitter:description', content: pageDescription }],
        ['meta', { name: 'twitter:image', content: `${siteUrl}${pageImage}` }],
        ['meta', { name: 'twitter:image:alt', content: pageTitle }],

        // Additional SEO
        ['meta', { name: 'description', content: pageDescription }],
        [
          'meta',
          {
            name: 'author',
            content: pageData.frontmatter.author || 'Underwood Inc',
          },
        ],
        [
          'meta',
          {
            name: 'keywords',
            content:
              pageData.frontmatter.tags?.join(', ') ||
              'JavaScript, TypeScript, Async Programming, Web Development',
          },
        ],

        // Canonical URL
        [
          'link',
          {
            rel: 'canonical',
            href: `${siteUrl}${pageData.relativePath.replace(/\.md$/, '')}`,
          },
        ],
      ];
    },

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
    // Open Graph / Facebook
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: siteName }],
    ['meta', { property: 'og:title', content: siteName }],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:image', content: siteImage }],
    [
      'meta',
      { property: 'og:image:alt', content: `${siteName} - Visual Preview` },
    ],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    // Twitter
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: twitterHandle }],
    ['meta', { name: 'twitter:creator', content: twitterHandle }],
    ['meta', { name: 'twitter:title', content: siteName }],
    ['meta', { name: 'twitter:description', content: siteDescription }],
    ['meta', { name: 'twitter:image', content: siteImage }],
    [
      'meta',
      { name: 'twitter:image:alt', content: `${siteName} - Visual Preview` },
    ],
    // Additional SEO
    ['meta', { name: 'author', content: 'Underwood Inc' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'JavaScript, TypeScript, Async Programming, Web Development, Programming Patterns, Software Engineering, Frontend Development, Modern Web Development, Async/Await, Promises, Performance Optimization',
      },
    ],
    // Canonical URL
    ['link', { rel: 'canonical', href: siteUrl }],
    // Color scheme
    ['meta', { name: 'theme-color', content: '#646cff' }],
    // Additional mobile optimization
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    ],
    // RSS feed
    [
      'link',
      { rel: 'alternate', type: 'application/rss+xml', href: '/feed.xml' },
    ],
    // Manifest
    ['link', { rel: 'manifest', href: '/web-patterns/manifest.json' }],
  ],
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    languages: languages,
    config: async (md) => {
      codeTooltipsPlugin(md);

      const highlighter = await getHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: [
          'typescript',
          'javascript',
          'json',
          'bash',
          'markdown',
          'tsx',
          'scss',
          'css',
          'html',
          'python',
        ],
      });

      const originalFence = md.renderer.rules.fence!;
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const filePath = env.path || 'unknown';
        const originalContent = token.content;

        // Check if we're inside a code-with-tooltips container
        const isInTooltipContainer = tokens.some(
          (t, i) => i < idx && t.type === 'container_code-with-tooltips_open'
        );

        if (!isInTooltipContainer) {
          debugLog('SKIPPING', {
            reason: 'not in tooltip container',
            file: filePath
          });
          return originalFence(tokens, idx, options, env, self);
        }

        try {
          // Process template variables with error handling
          token.content = token.content.replace(/\${([^}]+)}/g, (match, expr) => {
            try {
              const value = expr.split('.').reduce((obj, prop) => obj?.[prop], env);
              return value ?? match; // Return original match if value is null/undefined
            } catch (e) {
              console.warn(`Template expression error: ${expr}`, e);
              return match;
            }
          });
          
          const highlightedCode = originalFence(tokens, idx, options, env, self);
          
          debugLog('TOOLTIP_PROCESSING', {
            file: filePath,
            tokenType: token.type,
            inContainer: isInTooltipContainer
          });

          // Process tooltips
          const { parseResult, tooltipMap, parserInfo } = processTooltips(token.content, token.info);

          let modifiedCode = highlightedCode;

          // Add tooltips and other features
          if (tooltipMap.size > 0) {
            modifiedCode = applyTooltipsToCode(modifiedCode, tooltipMap);
          }

          return `<div class="code-block-wrapper" data-code-tooltips="true">${modifiedCode}</div>`;
        } catch (error) {
          debugLog('ERROR', {
            file: filePath,
            line: token.map?.[0],
            error: error.message
          });
          token.content = originalContent; // Restore original content on error
          return originalFence(tokens, idx, options, env, self);
        }
      };

      // Combine the originalRender logic
      const originalRender = md.render;
      const originalTextRender = md.renderer.rules.text || ((tokens, idx) => tokens[idx].content);
      
      md.render = function (src, env) {
        // Process template syntax before rendering
        const processed = src
          .replace(/```[\s\S]*?```/g, match => match)
          .replace(/`[^`]*`/g, match => match)
          .replace(/\${(?!\{)/g, '\\${')
          .replace(/{{\s*([^}]*)}}/g, '\\{{ $1 }}');
        
        return originalRender.call(this, processed, env);
      };

      md.renderer.rules.text = (tokens, idx, options, env, self) => {
        let content = tokens[idx].content;
        
        // Only process if not inside code blocks
        if (!env.inCode) {
          content = content
            // Escape template literals
            .replace(/\${/g, '\\${')
            // Escape Vue interpolation
            .replace(/{{\s*([^}]*)}}/g, '@{{$1}}');
        }
        
        tokens[idx].content = content;
        return originalTextRender(tokens, idx, options, env, self);
      };

      // Track code block state
      md.core.ruler.push('track_code_blocks', state => {
        let inCode = false;
        state.tokens.forEach(token => {
          if (token.type === 'fence' || token.type === 'code_block') {
            inCode = true;
          }
          token.env = { ...token.env, inCode };
        });
        return true;
      });

      // Add custom container for Vue templates
      md.use(container, 'vue', {
        validate: function(params) {
          return params.trim().match(/^vue\s*(.*)$/);
        },
        render: function (tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return '<div class="vue-template">\n';
          } else {
            return '</div>\n';
          }
        }
      });
    },
    breaks: true,
    html: true,
    linkify: true,
    typographer: true,
    vue: {
      customBlocks: [],
      template: {
        compilerOptions: {
          isCustomElement: () => false,
          whitespace: 'preserve',
          delimiters: ['@{{', '}}']  // Use different delimiters for Vue
        }
      },
    },
  },
  async buildEnd() {
    const { buildSearchIndex } = await import('./buildSearchIndex.js');
    await buildSearchIndex();
    performanceLogger.finalize();
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Remove manualChunks for vitepress
          },
        },
      },
      minify: 'esbuild',
      cssCodeSplit: true,
      sourcemap: true,
    },
    plugins: [
      {
        name: 'markdown-template-handler',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('.md')) {
            // First preserve Vue containers
            const containers: string[] = [];
            let preservedContainers = code.replace(
              /::: [\s\S]*? :::/g,
              (match, offset) => {
                const placeholder = `___CONTAINER_${containers.length}___`;
                containers.push(match);
                return placeholder;
              }
            );

            // Then preserve code blocks
            const codeBlocks: string[] = [];
            let preservedCode = preservedContainers.replace(
              /```[\s\S]*?```/g,
              (match, offset) => {
                const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
                codeBlocks.push(match);
                return placeholder;
              }
            );

            // Then handle inline code
            const inlineCode: string[] = [];
            preservedCode = preservedCode.replace(/`[^`]*`/g, (match, offset) => {
              const placeholder = `___INLINE_CODE_${inlineCode.length}___`;
              inlineCode.push(match);
              return placeholder;
            });

            // Process template syntax
            preservedCode = preservedCode
              // Escape template literals
              .replace(/\${/g, '\\${')
              // Handle Vue interpolation
              .replace(/{{\s*([^}]*)}}/g, '@{{$1}}');

            // Restore everything in reverse order
            const result = preservedCode
              .replace(/___INLINE_CODE_(\d+)___/g, (_, i) => inlineCode[i])
              .replace(/___CODE_BLOCK_(\d+)___/g, (_, i) => codeBlocks[i])
              .replace(/___CONTAINER_(\d+)___/g, (_, i) => containers[i]);

            return result;
          }
        }
      },
      {
        name: 'react-component-patterns-handler',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('.md') && (
            id.includes('react-component-patterns') || 
            id.includes('/form/')
          )) {
            // For React files, escape all Vue-style interpolation
            return code
              .replace(/{{/g, '\\{{')
              .replace(/}}/g, '}}');
          }
        }
      }
    ],
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('-'),
          whitespace: 'preserve'
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [
            resolve(__dirname, 'theme/styles'),
            resolve(__dirname, 'theme'),
          ],
        },
      },
    },
    optimizeDeps: {
      entries: [
        'theme/tooltipPortal.ts',
        'theme/markdown/codePreview.ts',
        'theme/components/CodePreview.vue',
      ],
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
      { text: 'Async', link: '/async/' },
      { text: 'TypeScript', link: '/typescript/utility-types' },
      { text: 'Testing', link: '/tests/' },
      { text: 'Package Managers', link: '/package-managers/' },
      { text: 'Styling', link: '/styling/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'React Component Patterns', link: '/react-component-patterns/' },
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
            { text: 'Array Operations', link: '/typescript/array-operations' },
            { text: 'Array Utilities', link: '/typescript/array-utilities' },
            {
              text: 'Conditional Types',
              link: '/typescript/conditional-types',
            },
            { text: 'Mapped Types', link: '/typescript/mapped-types' },
            {
              text: 'String Manipulation',
              link: '/typescript/string-manipulation',
            },
            { text: 'String Utilities', link: '/typescript/string-utilities' },
            {
              text: 'Template Literals',
              link: '/typescript/template-literals',
            },
            { text: 'Type Guards', link: '/typescript/type-guards' },
            { text: 'Type Inference', link: '/typescript/type-inference' },
          ],
        },
        {
          text: 'State Management',
          items: [
            { text: 'Immutable State', link: '/typescript/immutable-state' },
            { text: 'Observable State', link: '/typescript/observable-state' },
            { text: 'State Management', link: '/typescript/state-management' },
          ],
        },
      ],
      '/tests/': [
        {
          text: 'Strategy',
          items: [
            { text: 'Overview', link: '/tests/' },
            {
              text: 'DD: Testing Strategy',
              link: '/tests/deep-dive-testing-strategy',
            },
          ],
        },
        {
          text: 'Testing Patterns',
          items: [
            { text: 'Test Utilities', link: '/tests/test-utilities' },
            { text: 'Testing Patterns', link: '/tests/testing-patterns' },
          ],
        },
        {
          text: 'Frameworks',
          items: [
            { text: 'Vitest', link: '/tests/frameworks/vitest' },
            { text: 'Jest', link: '/tests/frameworks/jest' },
            {
              text: 'Testing Library',
              link: '/tests/frameworks/testing-library',
            },
            { text: 'Cypress', link: '/tests/frameworks/cypress' },
            { text: 'Playwright', link: '/tests/frameworks/playwright' },
            { text: 'Selenium', link: '/tests/frameworks/selenium' },
            { text: 'WebdriverIO', link: '/tests/frameworks/webdriverio' },
            { text: 'Puppeteer', link: '/tests/frameworks/puppeteer' },
            { text: 'TestCafe', link: '/tests/frameworks/testcafe' },
            { text: 'Nightwatch', link: '/tests/frameworks/nightwatch' },
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
        {
          text: 'UI Components',
          items: [{ text: 'Tooltip System', link: '/examples/tooltip-system' }],
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
      '/package-managers/': [
        {
          text: 'Package Managers',
          items: [
            { text: 'Overview', link: '/package-managers/' },
            { text: 'npm', link: '/package-managers/npm' },
            { text: 'Yarn', link: '/package-managers/yarn' },
            { text: 'pnpm', link: '/package-managers/pnpm' },
            { text: 'Bun', link: '/package-managers/bun' },
          ],
        },
        {
          text: 'Best Practices',
          items: [
            {
              text: 'Dependency Management',
              link: '/package-managers/dependency-management',
            },
            {
              text: 'Version Control',
              link: '/package-managers/version-control',
            },
            { text: 'Security', link: '/package-managers/security' },
            { text: 'Monorepos', link: '/package-managers/monorepos' },
          ],
        },
        {
          text: 'Migration Guides',
          items: [
            {
              text: 'npm to Yarn',
              link: '/package-managers/migration/npm-to-yarn',
            },
            {
              text: 'npm to pnpm',
              link: '/package-managers/migration/npm-to-pnpm',
            },
            {
              text: 'Yarn to pnpm',
              link: '/package-managers/migration/yarn-to-pnpm',
            },
          ],
        },
      ],
      '/react-component-patterns/': [
        {
          text: 'React Components',
          items: [{ text: 'Overview', link: '/react-component-patterns/' }],
        },
        {
          text: 'Foundation',
          items: [
            {
              text: 'Typography',
              link: '/react-component-patterns/foundation/typography',
            },
            {
              text: 'Colors',
              link: '/react-component-patterns/foundation/colors',
            },
            {
              text: 'Spacing',
              link: '/react-component-patterns/foundation/spacing',
            },
            {
              text: 'Icons',
              link: '/react-component-patterns/foundation/icons',
            },
          ],
        },
        {
          text: 'Layout',
          items: [
            {
              text: 'Container',
              link: '/react-component-patterns/layout/container',
            },
            { text: 'Grid', link: '/react-component-patterns/layout/grid' },
            { text: 'Stack', link: '/react-component-patterns/layout/stack' },
            { text: 'Flex', link: '/react-component-patterns/layout/flex' },
          ],
        },
        {
          text: 'Form Controls',
          items: [
            { text: 'Button', link: '/react-component-patterns/form/button' },
            { text: 'Input', link: '/react-component-patterns/form/input' },
            { text: 'Select', link: '/react-component-patterns/form/select' },
            {
              text: 'Checkbox',
              link: '/react-component-patterns/form/checkbox',
            },
            { text: 'Radio', link: '/react-component-patterns/form/radio' },
            { text: 'Switch', link: '/react-component-patterns/form/switch' },
          ],
        },
        {
          text: 'Navigation',
          items: [
            { text: 'Menu', link: '/react-component-patterns/navigation/menu' },
            { text: 'Tabs', link: '/react-component-patterns/navigation/tabs' },
            {
              text: 'Breadcrumb',
              link: '/react-component-patterns/navigation/breadcrumb',
            },
            {
              text: 'Pagination',
              link: '/react-component-patterns/navigation/pagination',
            },
          ],
        },
        {
          text: 'Feedback',
          items: [
            {
              text: 'Alert',
              link: '/react-component-patterns/feedback/notifications/alert',
            },
            {
              text: 'Toast',
              link: '/react-component-patterns/feedback/notifications/toast',
            },
            {
              text: 'Banner',
              link: '/react-component-patterns/feedback/notifications/banner',
            },
            {
              text: 'Snackbar',
              link: '/react-component-patterns/feedback/notifications/snackbar',
            },
            {
              text: 'Progress',
              link: '/react-component-patterns/feedback/progress-indicators/progress',
            },
            {
              text: 'Skeleton',
              link: '/react-component-patterns/feedback/status-indicators/skeleton',
            },
          ],
        },
        {
          text: 'Overlay',
          items: [
            {
              text: 'Popover',
              link: '/react-component-patterns/overlay/contextual-overlays/popover',
            },
            {
              text: 'Tooltip',
              link: '/react-component-patterns/overlay/contextual-overlays/tooltip',
            },
            {
              text: 'Dropdown',
              link: '/react-component-patterns/overlay/contextual-overlays/dropdown',
            },
            {
              text: 'Context Menu',
              link: '/react-component-patterns/overlay/contextual-overlays/context-menu',
            },
          ],
        },
        {
          text: 'Data Display',
          items: [
            { text: 'Table', link: '/react-component-patterns/data/table' },
            { text: 'List', link: '/react-component-patterns/data/list' },
            { text: 'Card', link: '/react-component-patterns/data/card' },
            { text: 'Badge', link: '/react-component-patterns/data/badge' },
          ],
        },
      ],
    },
    // footer: {
    //   message: footerMessage,
    //   copyright: 'Copyright © 2024-present Underwood Inc.',
    // },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Underwood-Inc/web-patterns' },
      { icon: 'twitter', link: `https://twitter.com/${twitterHandle}` },
    ],
    outline: 'deep',
    aside: true,
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
      },
    },
    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      docFooter: {
        prev: 'Previous page',
        next: 'Next page',
      },
    },
  },
  appearance: true,
});
