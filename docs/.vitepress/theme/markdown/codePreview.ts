import type { MarkdownRenderer } from 'vitepress';

export function codePreviewPlugin(md: MarkdownRenderer) {
  // Store the original fence renderer
  const originalFence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options, env, self] = args;
    const token = tokens[idx];
    const rawLang = token.info.trim();

    // Get the base language and check for preview flag
    const [lang, ...flags] = rawLang.split(':');
    const isPreview = flags.includes('preview');

    // Always set the clean language for proper highlighting
    token.info = lang;

    // Get the highlighted code
    const highlightedCode = originalFence(tokens, idx, options, env, self);

    // If not a preview block, return the highlighted code as is
    if (!isPreview) {
      return highlightedCode;
    }

    // For preview blocks, add tooltips while preserving syntax highlighting
    const typeInfo: Record<string, { description: string; type?: string }> = {
      string: {
        type: 'primitive',
        description: 'The string primitive type represents textual data',
      },
      number: {
        type: 'primitive',
        description: 'The number primitive type represents numeric values',
      },
      boolean: {
        type: 'primitive',
        description: 'The boolean primitive type represents true/false values',
      },
      Promise: {
        type: 'interface',
        description:
          'The Promise object represents a value that may not be available immediately',
      },
      Array: {
        type: 'interface',
        description:
          'The Array object enables storing multiple values in a single variable',
      },
      map: {
        type: 'method',
        description:
          'Creates a new array with the results of calling a provided function on every element',
      },
      find: {
        type: 'method',
        description:
          'Returns the value of the first element in the array that satisfies the provided testing function',
      },
      async: {
        type: 'keyword',
        description: 'Declares an asynchronous function that returns a Promise',
      },
      interface: {
        type: 'keyword',
        description: 'Declares a TypeScript interface type',
      },
    };

    // Process the code using regex during SSR
    let modifiedCode = highlightedCode;

    Object.entries(typeInfo).forEach(([term, info]) => {
      // First, check if the term exists in the raw content
      if (token.content.includes(term)) {
        // Updated regex to match terms within Shiki spans more precisely
        const termPattern = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex special chars
        const regex = new RegExp(
          `(<span[^>]*?style="([^"]*)"[^>]*>)([^<]*)\\b(${termPattern})\\b([^<]*)(</span>)`,
          'g'
        );
        const tooltip = info.type
          ? `${info.type}<br>${info.description}`
          : info.description;

        modifiedCode = modifiedCode.replace(
          regex,
          (match, spanStart, style, before, term, after, spanEnd) => {
            // Preserve Shiki's style in the tooltip span
            return `${spanStart}${before}<span class="tooltip" style="${style}" data-tooltip="${tooltip}">${term}</span>${after}${spanEnd}`;
          }
        );
      }
    });

    // Return the modified code with tooltips
    return `<div class="code-preview">${modifiedCode}</div>`;
  };
}
