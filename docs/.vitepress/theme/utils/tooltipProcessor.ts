import { typeColors, typeScriptKeywords, primitiveTypes, builtInObjects } from './typeDefinitions';
import { parseCode } from './parsers';
import { createParserTooltip } from './tooltips/parserInfo';

interface TooltipData {
  errors: Set<string>;
  info: Set<string>;
}

// Helper to get type info from all type definition sources
function getTypeInfo(term: string) {
  return (
    typeScriptKeywords[term] ||
    primitiveTypes[term] ||
    builtInObjects[term]
  );
}

// Helper to colorize type signature parts
function colorizeTypeSignature(signature: string): string {
  // If it's a function signature, format it specially
  if (signature.includes('=>')) {
    return formatFunctionSignature(signature);
  }

  return signature
    // Colorize keywords
    .replace(
      /\b(interface|type|extends|implements|readonly|public|private|protected)\b/g,
      `<span style="color: ${typeColors.keyword.text}">$1</span>`
    )
    // Colorize primitive types
    .replace(
      /\b(string|number|boolean|void|null|undefined|any|never|object)\b/g,
      `<span style="color: ${typeColors.primitive.text}">$1</span>`
    )
    // Colorize built-in types
    .replace(
      /\b(Array|Promise|Date|RegExp|Map|Set|PropsWithChildren)\b/g,
      `<span style="color: ${typeColors['built-in'].text}">$1</span>`
    )
    // Colorize type parameters
    .replace(
      /<([^>]+)>/g,
      `<span style="color: ${typeColors['type-signature'].text}">&lt;$1&gt;</span>`
    )
    // Colorize property names
    .replace(
      /(\w+)(?=\s*[?:])/g,
      `<span style="color: #d19a66">$1</span>`
    );
}

// Helper to format function signatures
function formatFunctionSignature(signature: string): string {
  // Split into parts
  const parts = signature.match(/^(.+?)\s*=>\s*(.+)$/);
  if (!parts) return colorizeTypeSignature(signature);

  const [_, params, returnType] = parts;

  // Format parameters
  const formattedParams = params
    .replace(/[{}]/g, '')
    .split(',')
    .map(param => {
      const [name, type] = param.split(':').map(s => s.trim());
      return `  ${colorizeParam(name)}: ${colorizeTypeSignature(type)}`;
    })
    .join(',\n');

  // Format the whole signature
  return `({\n${formattedParams}\n}) => ${colorizeTypeSignature(returnType)}`;
}

// Helper to colorize parameter names
function colorizeParam(param: string): string {
  // Handle default values
  const parts = param.split('=').map(p => p.trim());
  if (parts.length > 1) {
    return `<span style="color: #d19a66">${parts[0]}</span> = <span style="color: #98c379">'${parts[1].replace(/['"]/g, '')}'</span>`;
  }
  return `<span style="color: #d19a66">${param}</span>`;
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
    
    // Skip variable signature tokens entirely
    if (tokenInfo.text.startsWith('( variable)') || 
        tokenInfo.info?.type === 'variable' || 
        tokenInfo.info?.signature?.startsWith('( variable)')) {
      return;
    }

    const term = tokenInfo.text;
    
    // Get type info from our definitions
    const typeInfo = getTypeInfo(term);
    const info = tokenInfo.info || typeInfo;

    if (!info) return;

    // Skip if this is a variable signature
    if (info.type === 'variable' || 
        (info.signature && typeof info.signature === 'string' && info.signature.includes('( variable)'))) {
      return;
    }

    if (!tooltipMap.has(term)) {
      tooltipMap.set(term, { errors: new Set(), info: new Set() });
    }

    let description = info.description || info.documentation || `Identifier: ${term}`;
    
    // If there's a type signature, colorize it
    if (info.signature) {
      description = `${description}\n\n\`\`\`typescript\n${colorizeTypeSignature(JSON.stringify(info.signature, null, 2))}\n\`\`\``;
    }

    const tooltipContent = encodeURIComponent(
      JSON.stringify({
        type: info.type || 'identifier',
        description,
        color: info.color || typeColors[info.type as keyof typeof typeColors] || {
          text: '#666',
          background: 'rgba(102, 102, 102, 0.1)',
        },
      })
    );

    tooltipMap
      .get(term)!
      .info.add(`info:::${info.type}\ntype:${tooltipContent}`);
  });

  return { parseResult, tooltipMap, parserInfo: createParserTooltip(lang) };
}

export function applyTooltipsToCode(code: string, tooltipMap: Map<string, TooltipData>) {
  let processedCode = code;
  
  tooltipMap.forEach(({ errors, info }, term) => {
    // Skip if the term is a variable signature
    if (term.includes('( variable)')) {
      return;
    }

    const termPattern = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(<span[^>]*?>)([^<]*?\\b)(${termPattern})\\b([^<]*?)(</span>)`,
      'g'
    );

    const combinedContent = Array.from(info).join('|||');
    
    // Skip if the content includes variable signature
    if (combinedContent.includes('( variable)')) {
      return;
    }

    processedCode = processedCode.replace(
      regex,
      (match, spanStart, before, term, after, spanEnd) =>
        `${spanStart}${before}<span class="tooltip-trigger" data-tooltip="${encodeURIComponent(combinedContent)}">${term}</span>${after}${spanEnd}`
    );
  });

  return processedCode;
} 