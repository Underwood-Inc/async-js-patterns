import { typeDefinitions } from '../typeDefinitions';
import type { CodeParser, ParserResult } from './types';
import { parseTypeScript } from './typescript';

// Define supported languages and their parsers
const parsers: Record<string, CodeParser> = {
  typescript: parseTypeScript,
};

// Enhanced fallback parser that handles type definitions
function defaultParser(code: string): ParserResult {
  const tokens = [];
  const errors = [];

  // Always check for type definitions regardless of language
  for (const [term, info] of Object.entries(typeDefinitions)) {
    const regex = new RegExp(`\\b${term}\\b`, 'g');
    let match;

    while ((match = regex.exec(code)) !== null) {
      tokens.push({
        start: match.index,
        end: match.index + term.length,
        type: 'identifier',
        text: term,
      });
    }
  }

  return {
    tokens,
    errors,
    isValid: true,
    usesFallback: true,
  };
}

export function parseCode(code: string, language: string): ParserResult {
  // First run the default parser to get base tokens
  const defaultResult = defaultParser(code);

  try {
    // Then try language-specific parser if available
    const parser = parsers[language];
    if (parser) {
      const langResult = parser(code);
      return {
        tokens: [...defaultResult.tokens, ...langResult.tokens],
        errors: langResult.errors,
        isValid: langResult.isValid,
        usesFallback: false,
      };
    }
  } catch (error) {
    console.warn(`Language-specific parsing error for ${language}:`, error);
  }

  // Return default result if no language parser or if it failed
  return defaultResult;
}
