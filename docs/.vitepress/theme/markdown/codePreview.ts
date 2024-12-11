import type { MarkdownRenderer } from 'vitepress';
import { parseCode } from '../utils/parsers';
import { createParserTooltip } from '../utils/tooltips/parserInfo';
import {
  typeColors,
  typeDefinitions,
  TypeSignature,
} from '../utils/typeDefinitions';
import { processTooltips, applyTooltipsToCode } from '../utils/tooltipProcessor';

// FILE USED DURING BUILD TIME, NOT DEV TIME

// Debug control state
let debugLoggingEnabled = true;

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
  toggleDebugLogging(true);
  const originalFence = md.renderer.rules.fence!;

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options, env, self] = args;
    const token = tokens[idx];
    const filePath = env.path || 'unknown';

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
      return originalFence(tokens, idx, options, env, self);
    }
  };
}

function isInTooltipContainer(tokens: Token[], idx: number): boolean {
  return tokens.some(
    (t, i) => i < idx && t.type === 'container_code-with-tooltips_open'
  );
}
