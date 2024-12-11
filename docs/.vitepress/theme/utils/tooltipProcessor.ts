import { typeColors, typeDefinitions } from './typeDefinitions';
import { parseCode } from './parsers';
import { createParserTooltip } from './tooltips/parserInfo';

interface TooltipData {
  errors: Set<string>;
  info: Set<string>;
}

export function processTooltips(code: string, lang: string) {
  const parseResult = parseCode(code, lang);
  const tooltipMap = new Map<string, TooltipData>();

  // Process errors first
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

  // Process tokens
  parseResult.tokens.forEach((tokenInfo) => {
    if (!tokenInfo?.text) return;
    const term = tokenInfo.text;
    const info = tokenInfo.info || typeDefinitions[term];

    if (!info) return;

    if (!tooltipMap.has(term)) {
      tooltipMap.set(term, { errors: new Set(), info: new Set() });
    }

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
  });

  // Add parser info
  const parserInfo = createParserTooltip(lang);
  const content =
    typeof parserInfo.content === 'object' && !('$' in parserInfo.content)
      ? parserInfo.content
      : { title: '', type: 'info', description: String(parserInfo.content) };

  return { parseResult, tooltipMap, parserInfo: content };
}

export function applyTooltipsToCode(code: string, tooltipMap: Map<string, TooltipData>) {
  let processedCode = code;
  
  tooltipMap.forEach(({ errors, info }, term) => {
    const termPattern = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(<span[^>]*?>)([^<]*?\\b)(${termPattern})\\b([^<]*?)(</span>)`,
      'g'
    );

    const combinedContent = Array.from(info).join('|||');
    processedCode = processedCode.replace(
      regex,
      (match, spanStart, before, term, after, spanEnd) =>
        `${spanStart}${before}<span class="tooltip-trigger" data-tooltip="${encodeURIComponent(combinedContent)}">${term}</span>${after}${spanEnd}`
    );
  });

  return processedCode;
} 