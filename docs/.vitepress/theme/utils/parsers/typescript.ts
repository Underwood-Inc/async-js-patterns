import * as ts from 'typescript';
import { debugLog } from '../../markdown/codePreview';
import type { ParserResult, TokenLocation } from './types';

export function parseTypeScript(code: string): ParserResult {
  try {
    debugLog('PARSER', 'Parsing code block:', code);

    // Create an isolated module wrapper for the code
    const wrappedCode = `
      // @ts-nocheck
      (() => { 
        ${code}
      })();
    `;

    const sourceFile = ts.createSourceFile(
      'temp.ts',
      wrappedCode,
      ts.ScriptTarget.Latest,
      true
    );

    const tokens: TokenLocation[] = [];
    const errors: TokenLocation[] = [];
    const validRanges = new Set<string>();

    // Create a program with isolated context
    const program = ts.createProgram({
      rootNames: ['temp.ts'],
      options: {
        noEmit: true,
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.ESNext,
        lib: ['es2022', 'dom', 'dom.iterable'],
        isolatedModules: true, // Enable isolated modules
      },
      host: {
        getSourceFile: (fileName) =>
          fileName === 'temp.ts' ? sourceFile : undefined,
        getDefaultLibFileName: () => 'lib.d.ts',
        writeFile: () => {},
        getCurrentDirectory: () => '/',
        getDirectories: () => [],
        fileExists: (fileName) => fileName === 'temp.ts',
        readFile: () => '',
        getCanonicalFileName: (fileName) => fileName,
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => '\n',
      },
    });

    // Adjust token positions to account for wrapper
    const wrapperOffset = wrappedCode.indexOf(code);

    // Get diagnostics
    const diagnostics = ts.getPreEmitDiagnostics(program);

    debugLog('PARSER', 'Diagnostics:', diagnostics);

    // Process diagnostics into errors, adjusting positions
    diagnostics.forEach((diagnostic) => {
      if (diagnostic.file) {
        const start = diagnostic.start! - wrapperOffset;
        const end = start + diagnostic.length!;
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n'
        );

        // Only add error if it's within the original code bounds
        if (start >= 0 && end <= code.length) {
          errors.push({
            start,
            end,
            type: 'error',
            text: code.slice(start, end),
            error: message,
          });
        }
      }
    });

    // Visit nodes to collect tokens, adjusting positions
    function visit(node: ts.Node) {
      if (ts.isIdentifier(node) || ts.isKeyword(node.kind)) {
        const start = node.getStart(sourceFile) - wrapperOffset;
        const end = node.getEnd() - wrapperOffset;
        const text = node.getText(sourceFile);

        // Only add token if it's within the original code bounds
        if (start >= 0 && end <= code.length) {
          validRanges.add(`${start}-${end}`);
          tokens.push({
            start,
            end,
            type: ts.SyntaxKind[node.kind],
            text,
          });
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    debugLog('PARSER', 'Parsed tokens:', tokens);
    debugLog('PARSER', 'Parsed errors:', errors);

    return {
      tokens,
      errors,
      isValid: errors.length === 0,
      usesFallback: false,
    };
  } catch (error: unknown) {
    console.warn('TypeScript parsing error:', (error as Error).message);
    return {
      tokens: [],
      errors: [
        {
          start: 0,
          end: code.length,
          type: 'error',
          text: code,
          error: (error as Error).message,
        },
      ],
      isValid: false,
      usesFallback: true,
    };
  }
}
