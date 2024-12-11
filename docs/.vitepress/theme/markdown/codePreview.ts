import type { MarkdownRenderer } from 'vitepress';
import { parseCode } from '../utils/parsers';
import { createParserTooltip } from '../utils/tooltips/parserInfo';
import {
  typeColors,
  typeDefinitions,
  TypeSignature,
} from '../utils/typeDefinitions';

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

function formatTypeSignature(signature: TypeSignature): string {
  const typeParams = signature.typeParameters?.length
    ? `<${signature.typeParameters.join(', ')}>`
    : '';

  const params = signature.parameters
    ?.map((p) => `${p.name}${p.optional ? '?' : ''}: ${p.type}`)
    .join(', ');

  const returnType = signature.returnType ? `: ${signature.returnType}` : '';

  return `${signature.name}${typeParams}(${params})${returnType}`;
}

interface CodePreviewOptions {
  parseOptions?: {
    reviver?: (key: string, value: any) => any;
  };
}

function safeJSONParse(str: string) {
  try {
    // First try direct parse
    return JSON.parse(str);
  } catch (e) {
    try {
      // Handle TypeScript interface/type definitions
      if (str.includes('```typescript')) {
        return {
          type: 'Type Signature',
          color: {
            text: '#666',
            background: 'rgba(102, 102, 102, 0.1)',
          },
          description: str,
        };
      }

      // Sanitize the string
      let sanitized = str
        // Handle single quotes
        .replace(/'/g, '"')
        // Handle newlines in strings
        .replace(/\n/g, '\\n')
        // Handle escaped quotes
        .replace(/\\"/g, '\\\\"')
        // Handle unescaped backslashes
        .replace(/\\/g, '\\\\')
        // Handle function arrows
        .replace(/=>/g, "'=>'")
        // Handle template literals
        .replace(/`/g, '"')
        // Handle special characters in strings
        .replace(/[\u0000-\u001f\u007f-\u009f]/g, '')
        // Handle trailing commas
        .replace(/,\s*([\]}])/g, '$1')
        // Handle code blocks with backticks
        .replace(/```[\s\S]*?```/g, function (match) {
          return JSON.stringify(match);
        });

      return JSON.parse(sanitized);
    } catch (innerError) {
      // Return a default object if all parsing attempts fail
      return {
        type: str,
        color: {
          text: '#666',
          background: 'rgba(102, 102, 102, 0.1)',
        },
        description: 'No description available',
      };
    }
  }
}

function safeJSONStringify(obj: any, options?: CodePreviewOptions) {
  try {
    const stringified = JSON.stringify(obj, options?.parseOptions?.reviver);
    return stringified.replace(/"/g, "'"); // Convert back to single quotes for consistency
  } catch (error) {
    console.warn('JSON stringify error:', error);
    return '{}';
  }
}

export function codePreviewPlugin(
  md: MarkdownRenderer,
  options: CodePreviewOptions = {}
) {
  const originalFence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options, env, self] = args;
    const token = tokens[idx];

    const rawLang = token.info.trim();
    const [lang, ...flags] = rawLang.split(':');
    const isPreview = flags.includes('preview');

    token.info = lang;
    const highlightedCode = originalFence(tokens, idx, options, env, self);

    console.log('isPreview', isPreview, flags);
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
      const info = tokenInfo?.info || typeDefinitions[term];

      if (!info) return;

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
        documentation:
          info.documentation || info.description || 'No description available',
      };

      try {
        const tooltipContent = encodeURIComponent(
          safeJSONStringify(
            {
              type: typeInfo.type,
              color: typeInfo.color,
              description: typeInfo.documentation,
            },
            options
          )
        );

        tooltipMap
          .get(term)!
          .info.add(`info:::${typeInfo.type}\ntype:${tooltipContent}`);

        if (info.signature) {
          const formattedSignature = formatTypeSignature(info.signature);
          const tooltipContent = encodeURIComponent(
            safeJSONStringify(
              {
                type: 'type-signature',
                signature: formattedSignature,
                color: typeColors['type-signature'] || {
                  text: '#4078f2',
                  background: 'rgba(64, 120, 242, 0.1)',
                },
                description: info.description,
              },
              options
            )
          );

          tooltipMap
            .get(term)!
            .info.add(`info:::${formattedSignature}\ntype:${tooltipContent}`);
        }
      } catch (error) {
        console.warn(`Error processing tooltip for term "${term}":`, error);
      }
    });

    // Add parser info tooltip
    const parserInfo = createParserTooltip(lang);
    const content =
      typeof parserInfo.content === 'object' && !('$' in parserInfo.content)
        ? parserInfo.content
        : { title: '', type: 'info', description: String(parserInfo.content) };

    const parserTooltipContent = `info:::${content.title}\ntype:${encodeURIComponent(
      safeJSONStringify({
        type: content.type,
        color: content.color,
        description: content.description.replace(/\n/g, '<br>'),
      })
    )}`;

    // Insert parser info inside the language div, after it opens
    modifiedCode = modifiedCode.replace(
      /(<div class="language-.*?">)/,
      `$1<div class="code-meta">
        <span class="tooltip-trigger" data-tooltip="${parserTooltipContent}">
          ${lang} ℹ️
        </span>
      </div>`
    );

    // Process existing tooltips
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
            const typeInfo = safeJSONParse(decodeURIComponent(typeInfoStr));

            if (!typeInfo || typeof typeInfo !== 'object') {
              console.log('Invalid typeInfo:', typeInfoStr);
              return infoStr;
            }

            return `${desc}\ntype:${encodeURIComponent(safeJSONStringify(typeInfo))}`;
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

    return modifiedCode;
  };
}
