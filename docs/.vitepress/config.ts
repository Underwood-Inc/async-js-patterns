import fs from 'fs';
import matter from 'gray-matter';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { getHighlighter } from 'shiki';
import { defineConfig } from 'vitepress';
import { languages } from './theme/languages';
import { codeTooltipsPlugin } from './theme/markdown/codeTooltips';
import { parseCode } from './theme/utils/parsers';
import { typeColors, typeDefinitions } from './theme/utils/typeDefinitions';
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

export default defineConfig({
  title: siteName,
  description: siteDescription,
  base: '/web-patterns/',
  cleanUrls: true,
  ignoreDeadLinks: [
    // Ignore LICENSE file link
    /\/LICENSE/,
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
    languageAlias: {
      'typescript:preview': 'typescript',
      'javascript:preview': 'javascript',
      ':preview': 'plaintext',
    },
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

      const originalFence = md.renderer.rules.fence;
      md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
        const token = tokens[idx];
        const term = tokens[idx].content.trim();
        const info = token.info ? token.info.trim() : '';
        const code = token.content.trim();
        const lang = token.info.trim();
        // Parse code using existing system
        const parseResult = parseCode(token.content, lang);
        const tooltipMap = new Map<
          string,
          { errors: Set<string>; info: Set<string> }
        >();

        // Parse code using existing system
        const [langType] = info.split(':')
        performanceLogger.logTooltip(
          term,
          langType || 'plaintext',
          parseResult.errors?.length > 0
        );

        // Check if we're inside a code-with-tooltips container
        const isInTooltipContainer = tokens.some(
          (t, i) => i < idx && t.type === 'container_code-with-tooltips_open'
        );

        // If not in tooltip container, use original renderer
        if (!isInTooltipContainer) {
          return originalFence!(tokens, idx, options, env, slf);
        }

        const highlightedCode = highlighter.codeToHtml(code, {
          lang: highlighter.getLoadedLanguages().includes(lang)
            ? lang
            : 'plaintext',
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
        });

        // Process tokens and build tooltips
        parseResult.tokens.forEach((tokenInfo) => {
          if (!tokenInfo?.text) return;

          const term = tokenInfo.text;
          const info = tokenInfo.info || typeDefinitions[term];

          if (!tooltipMap.has(term)) {
            tooltipMap.set(term, { errors: new Set(), info: new Set() });
          }

          if (info) {
            const tooltipContent = encodeURIComponent(
              JSON.stringify({
                type: info.type || 'identifier',
                description: info.documentation || `Identifier: ${term}`,
                color: typeColors[info.type as keyof typeof typeColors] || {
                  text: '#666',
                  background: 'rgba(102, 102, 102, 0.1)',
                },
              })
            );
            tooltipMap
              .get(term)!
              .info.add(`info:::${info.type}\ntype:${tooltipContent}`);
          }
        });

        // Enhanced tooltip debugging
        const debugData = {
          term,
          hasInfo: !!info,
          type: info?.type || 'none',
          hasDocumentation: !!info?.documentation,
          hasTypeDefinition: !!typeDefinitions[term],
          parseResult: {
            totalTokens: parseResult.tokens.length,
            hasErrors: parseResult.errors?.length > 0,
            errors: parseResult.errors
          }
        }

        performanceLogger.logTooltipDebug(debugData)

        // Add detailed tooltip content in a separate group if needed
        // if (tooltipMap.size > 0) {
        //   console.group('Detailed Tooltip Content');
        //   tooltipMap.forEach((data, term) => {
        //     console.group(`Term: ${term}`);
        //     Array.from(data.info).forEach((tooltip, index) => {
        //       console.log(`Tooltip ${index + 1}:`, tooltip);
        //     });
        //     console.groupEnd();
        //   });
        //   console.groupEnd();
        // }

        performanceLogger.startProcess(parseResult.tokens.length);
        // Process code with tooltips while preserving Shiki classes
        let processedCode = highlightedCode.replace(
          /<pre class="shiki[^>]*>(.*?)<\/pre>/s,
          (match, codeContent) => {
            let processed = codeContent;
            tooltipMap.forEach(({ errors, info }, term) => {
              const termPattern = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(
                `(<span[^>]*?>)([^<]*?\\b)(${termPattern})\\b([^<]*?)(</span>)`,
                'g'
              );

              const combinedContent = Array.from(info).join('|||');
              processed = processed.replace(
                regex,
                (match, spanStart, before, term, after, spanEnd) =>
                  `${spanStart}${before}<span class="tooltip-trigger" data-tooltip="${encodeURIComponent(combinedContent)}">${term}</span>${after}${spanEnd}`
              );
            });
            return `<pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0">${processed}</pre>`;
          }
        );

        if (parseResult.errors?.length > 0) {
          parseResult.errors.forEach(error => {
            performanceLogger.logError(term, error)
          })
        }

        performanceLogger.startProcess(parseResult.tokens.length)

        return `<div class="code-block-wrapper" data-code-tooltips="true">${processedCode}</div>`;
      };
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
          delimiters: ['${', '}'],
          // Disable template compilation for examples route
          // compileTemplate: (template) => {
          //   if (template.id?.includes('/examples/')) {
          //     return { code: template.content };
          //   }
          //   return undefined;
          // },
        },
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
            { text: 'Alert', link: '/react-component-patterns/feedback/alert' },
            { text: 'Toast', link: '/react-component-patterns/feedback/toast' },
            {
              text: 'Progress',
              link: '/react-component-patterns/feedback/progress',
            },
            {
              text: 'Skeleton',
              link: '/react-component-patterns/feedback/skeleton',
            },
          ],
        },
        {
          text: 'Overlay',
          items: [
            { text: 'Modal', link: '/react-component-patterns/overlay/modal' },
            {
              text: 'Drawer',
              link: '/react-component-patterns/overlay/drawer',
            },
            {
              text: 'Popover',
              link: '/react-component-patterns/overlay/popover',
            },
            {
              text: 'Tooltip',
              link: '/react-component-patterns/overlay/tooltip',
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
        detailedView: true,
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: {
              title: 2,
              text: 1,
              titles: 1.5,
            },
          },
        },
      },
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
