import type { MarkdownRenderer } from 'vitepress';
import { parseCode } from '../utils/parsers';
import { typeColors, typeDefinitions } from '../utils/typeDefinitions';

// Debug control state
let debugLoggingEnabled = false;

// Function to toggle debug logging
export function toggleDebugLogging(enable: boolean) {
  debugLoggingEnabled = enable;
  console.log(`Debug logging ${enable ? 'enabled' : 'disabled'}`);
}

// Debug types
const DEBUG = {
  TOKENS: true,
  ERRORS: true,
  REGEX: true,
  HTML: true,
  PARSER: true,
} as const;

// Enhanced debug logging utility
export function debugLog(type: keyof typeof DEBUG, ...args: any[]) {
  if (debugLoggingEnabled && DEBUG[type]) {
    console.group(`[CodePreview:${type}]`);
    args.forEach((arg) => {
      if (typeof arg === 'string') {
        console.log(arg);
      } else {
        console.dir(arg, { depth: null });
      }
    });
    console.groupEnd();
  }
}

function escapeHtml(unsafe: string | undefined): string {
  if (!unsafe) return '';

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function codePreviewPlugin(md: MarkdownRenderer) {
  const originalFence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options, env, self] = args;
    const token = tokens[idx];

    const rawLang = token.info.trim();
    const [lang, ...flags] = rawLang.split(':');
    const isPreview = flags.includes('preview');

    token.info = lang;
    const highlightedCode = originalFence(tokens, idx, options, env, self);

    if (!isPreview) {
      return highlightedCode;
    }

    let modifiedCode = highlightedCode;
    const parseResult = parseCode(token.content, lang);

    debugLog('TOKENS', 'Initial parse result:', {
      tokens: parseResult.tokens,
      errors: parseResult.errors,
      highlightedCode,
    });

    // Track tooltips for each term
    const tooltipMap = new Map<
      string,
      { errors: Set<string>; info: Set<string> }
    >();

    // Process errors first to ensure they're preserved
    parseResult.errors?.forEach((error) => {
      if (!error?.text) return;
      const term = error.text;
      const escapedError = escapeHtml(error.error);
      if (!escapedError) return;

      if (!tooltipMap.has(term)) {
        tooltipMap.set(term, { errors: new Set(), info: new Set() });
      }
      tooltipMap.get(term)!.errors.add(`error:::${escapedError}`);
    });

    // Process regular type tooltips
    parseResult.tokens.forEach((tokenInfo) => {
      const term = tokenInfo?.text;
      const info = term ? typeDefinitions[term] : undefined;

      if (!info) {
        // console.log('No type definition found for term:', term);
        return;
      }

      if (!tooltipMap.has(term)) {
        tooltipMap.set(term, { errors: new Set(), info: new Set() });
      }

      // Format the tooltip content with type information
      const typeInfo = {
        type: info.type || 'unknown',
        color:
          info.type && typeColors[info.type as keyof typeof typeColors]
            ? typeColors[info.type as keyof typeof typeColors]
            : { text: '#666', background: 'rgba(102, 102, 102, 0.1)' },
      };

      const tooltipContent = encodeURIComponent(
        JSON.stringify({
          type: typeInfo.type,
          color: typeInfo.color,
          description: info.description || 'No description available',
        })
      );

      tooltipMap
        .get(term)!
        .info.add(`info:::${typeInfo.type}\ntype:${tooltipContent}`);
    });

    // Apply tooltips
    tooltipMap.forEach(({ errors, info }, term) => {
      const termPattern = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(
        `(<span[^>]*?>)([^<]*?\\b)(${termPattern})\\b([^<]*?)(</span>)`,
        'g'
      );

      // Add test messages for each type
      const testMessages = [
        'error:::This is a test error message',
        'warning:::This is a test warning message',
        'info:::This is a test info message',
        'success:::This is a test success message',
      ];

      const combinedContent = [
        ...Array.from(errors),
        ...Array.from(info).map((infoStr) => {
          if (!infoStr || !infoStr.includes('type:')) return infoStr;

          try {
            const [desc, typeInfoStr] = infoStr
              .split('type:')
              .map((s) => s.trim());
            const typeInfo = JSON.parse(decodeURIComponent(typeInfoStr));

            if (!typeInfo || typeof typeInfo !== 'object') {
              console.log('Invalid typeInfo:', typeInfoStr);
              return infoStr;
            }

            return `${desc}\ntype:${encodeURIComponent(JSON.stringify(typeInfo))}`;
          } catch (error) {
            console.error('Error processing type info:', error);
            return infoStr;
          }
        }),
      ].join('|||');

      modifiedCode = modifiedCode.replace(
        regex,
        (match, spanStart, before, term, after, spanEnd) => {
          const hasError = errors.size > 0;
          return `${spanStart}${before}<span class="tooltip-trigger ${
            hasError ? 'has-error' : ''
          }" data-tooltip="${combinedContent}">${term}</span>${after}${spanEnd}`;
        }
      );
    });

    return `<div class="code-preview">${modifiedCode}</div>`;
  };
}
