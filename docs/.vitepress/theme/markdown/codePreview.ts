import type { MarkdownRenderer } from 'vitepress';
import { parseCode } from '../utils/parsers';
import { createParserTooltip } from '../utils/tooltips/parserInfo';
import {
  typeColors,
  typeDefinitions,
  TypeSignature,
} from '../utils/typeDefinitions';
import { processTooltips, applyTooltipsToCode } from '../utils/tooltipProcessor';
import { logger, enableLogCategory, enableLogLevel, type LogCategory } from '../utils/logger';
import container from 'markdown-it-container';

// FILE USED DURING BUILD TIME, NOT DEV TIME

// Debug control state
let debugLoggingEnabled = true;

// Configure logging - enable what we need for debugging
enableLogCategory('tooltip', true);     // Enable tooltip processing logs
enableLogCategory('markdown', true);    // Enable markdown processing logs
enableLogCategory('dev', true);         // Enable general development logs
enableLogCategory('performance', true); // Enable performance metrics

// Enable all log levels in development
enableLogLevel('debug', true);
enableLogLevel('info', true);
enableLogLevel('warn', true);
enableLogLevel('error', true);

// Function to toggle debug logging
export function toggleDebugLogging(enable: boolean) {
  debugLoggingEnabled = enable;
  logger.enable(enable);
  logger.info('system', `Debug logging ${enable ? 'enabled' : 'disabled'}`);
}

// Debug types
const DEBUG = {
  TOKENS: true,
  ERRORS: true,
  REGEX: true,
  HTML: true,
  PARSER: true,
  TOOLTIP_PROCESSING: true,
  ERROR: true,
  SKIPPING: true,
  SETUP: true,
} as const;

// Enhanced debug logging utility
export function debugLog(type: keyof typeof DEBUG, data: any) {
  if (!debugLoggingEnabled || !DEBUG[type]) return;

  // Route to appropriate section based on type
  let category: LogCategory;
  switch (type) {
    case 'TOOLTIP_PROCESSING':
      category = 'tooltip';
      break;
    case 'SETUP':
    case 'SKIPPING':
      category = 'build';
      break;
    case 'ERROR':
      category = 'system';
      break;
    default:
      category = 'dev';
  }

  // Log with appropriate level and category
  if (typeof data === 'string') {
    logger.debug(category, data);
  } else if (data instanceof Error) {
    logger.error(category, data.message, { error: data });
  } else if (Array.isArray(data)) {
    logger.debug(category, `${type} Array:`, { length: data.length, items: data });
  } else if (typeof data === 'object') {
    logger.debug(category, `${type} Object:`, data);
  } else {
    logger.debug(category, `${type}:`, { value: data });
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
    logger.warn('dev', 'JSON stringify error:', { error });
    return '{}';
  }
}

function isInTooltipContainer(element: Element): boolean {
  logger.debug('tooltip', 'Checking tooltip container', {
    element: element.tagName,
    classes: element.classList.toString()
  });

  // Check if element is directly in a tooltip container
  if (element.classList.contains('tooltip-container')) {
    logger.debug('tooltip', 'Found tooltip container', {
      element: element.tagName,
      classes: element.classList.toString()
    });
    return true;
  }

  // Check parent elements
  let parent = element.parentElement;
  while (parent) {
    if (parent.classList.contains('tooltip-container')) {
      logger.debug('tooltip', 'Found tooltip container in parent', {
        element: parent.tagName,
        classes: parent.classList.toString()
      });
      return true;
    }
    parent = parent.parentElement;
  }

  logger.debug('tooltip', 'No tooltip container found');
  return false;
}

// Add cache interface and cache map at the top of the file
interface TooltipCacheEntry {
  hash: string;
  highlightedCode: string;
  tooltipMap: Map<string, any>;
  parserInfo: any;
  timestamp: number;
}

const tooltipCache = new Map<string, TooltipCacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

// Add hash function to generate unique keys for code blocks
function generateHash(code: string, lang: string): string {
  let str = code + lang;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Add cache cleanup function
function cleanupCache() {
  const now = Date.now();
  for (const [key, entry] of tooltipCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      tooltipCache.delete(key);
    }
  }
}

// Modify the codePreviewPlugin to use caching
export function codePreviewPlugin(
  md: MarkdownRenderer,
  options: CodePreviewOptions = {}
) {
  toggleDebugLogging(true);

  // Register the container with proper render functions
  md.use(container, 'code-with-tooltips', {
    validate: function(params: string) {
      return params.trim() === 'code-with-tooltips';
    },
    render: function(tokens: any[], idx: number) {
      if (tokens[idx].nesting === 1) {
        // opening tag
        return '<div class="code-with-tooltips vp-code-group">\n';
      } else {
        // closing tag
        return '</div>\n';
      }
    }
  });

  const originalFence = md.renderer.rules.fence!;

  // Clean up cache periodically
  setInterval(cleanupCache, CACHE_TTL);

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options, env, self] = args;
    const token = tokens[idx];
    const filePath = env.path || 'unknown';

    // Check if we're inside a code-with-tooltips container
    const shouldProcessTooltips = tokens[idx].type === 'fence' && 
      tokens.some((t, i) => i < idx && 
        t.type === 'container_code-with-tooltips_open');

    if (!shouldProcessTooltips) {
      logger.debug('dev', 'Not in tooltip container', {
        file: filePath,
        tokenType: token.type
      });
      return originalFence(tokens, idx, options, env, self);
    }

    try {
      const highlightedCode = originalFence(tokens, idx, options, env, self);

      logger.debug('dev', 'Processing tooltips', {
        file: filePath,
        tokenType: token.type,
        inContainer: true,
        tokenMap: token.map,
        content: token.content.slice(0, 100) + '...'
      });

      // Process tooltips
      const { parseResult, tooltipMap, parserInfo } = processTooltips(token.content, token.info);

      logger.debug('dev', 'Tooltip processing results', {
        parseResult,
        tooltipCount: tooltipMap.size,
        parserInfo
      });

      let modifiedCode = highlightedCode;

      // Add tooltips and other features
      if (tooltipMap.size > 0) {
        modifiedCode = applyTooltipsToCode(modifiedCode, tooltipMap);
        logger.debug('dev', 'Applied tooltips to code', {
          tooltipCount: tooltipMap.size,
          modifiedCodePreview: modifiedCode.slice(0, 100) + '...'
        });
      }

      return `<div class="code-block-wrapper vp-code" data-code-tooltips="true"><div class="code-block-content">${modifiedCode}</div></div>`;

    } catch (error: unknown) {
      logger.error('dev', 'Failed to process code block', {
        file: filePath,
        line: token.map?.[0],
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : String(error),
        token: {
          type: token.type,
          map: token.map,
          contentPreview: token.content.slice(0, 100) + '...'
        }
      });
      return originalFence(tokens, idx, options, env, self);
    }
  };
}
