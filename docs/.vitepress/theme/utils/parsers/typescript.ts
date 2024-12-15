import * as ts from 'typescript';
import { typeColors, typeDefinitions } from '../typeDefinitions';
import type { ParserResult, TokenLocation } from './types';

interface DetailedTypeInfo {
  kind: string;
  name: string;
  typeParameters?: string;
  members?: string[];
  extends?: string[];
  implements?: string[];
  modifiers?: string[];
}

function getTypeParameters(
  node: ts.InterfaceDeclaration | ts.ClassDeclaration | ts.MethodDeclaration
): string | undefined {
  if (!node.typeParameters?.length) return undefined;
  return `<${node.typeParameters.map((tp) => tp.getText()).join(', ')}>`;
}

function getDetailedTypeInfo(
  node: ts.Node,
  identifier: ts.Identifier
): DetailedTypeInfo | undefined {
  const parent = node.parent;

  if (ts.isInterfaceDeclaration(parent)) {
    const members = parent.members.map((member) => {
      if (ts.isPropertySignature(member)) {
        const optional = member.questionToken ? '?' : '';
        return `${member.name.getText()}${optional}: ${member.type?.getText() || 'any'}`;
      }
      if (ts.isMethodSignature(member)) {
        return member.getText();
      }
      return member.getText();
    });

    return {
      kind: 'interface',
      name: parent.name.getText(),
      typeParameters: getTypeParameters(parent),
      members,
      extends: parent.heritageClauses
        ?.find((h) => h.token === ts.SyntaxKind.ExtendsKeyword)
        ?.types.map((t) => t.getText()),
      modifiers: parent.modifiers?.map((m) => m.getText()) || [],
    };
  }

  return undefined;
}

function formatTypeSignature(info: DetailedTypeInfo): string {
  const modifiers = info.modifiers?.length
    ? `${info.modifiers.join(' ')} `
    : '';
  const typeParams = info.typeParameters ? ` ${info.typeParameters}` : '';
  const extendsClause = info.extends?.length
    ? ` extends ${info.extends.join(', ')}`
    : '';
  const implementsClause = info.implements?.length
    ? ` implements ${info.implements.join(', ')}`
    : '';

  let signature = `${modifiers}${info.kind} ${info.name}${typeParams}${extendsClause}${implementsClause}`;

  if (info.members?.length) {
    signature += ` {\n  ${info.members.join(';\n  ')}\n}`;
  }

  return signature;
}

function handleVariableDeclaration(
  node: ts.Node,
  varDecl: ts.VariableDeclaration
): string {
  const modifiers = getTypeModifiers(varDecl.parent);
  if (varDecl.type) {
    return `(${modifiers.join(' ')} variable) ${node.getText()}: ${varDecl.type.getText()}`;
  } else if (varDecl.initializer) {
    const initializerType = ts.isObjectLiteralExpression(varDecl.initializer)
      ? '{ ' +
        varDecl.initializer.properties.map((p) => p.getText()).join('; ') +
        ' }'
      : varDecl.initializer.getText();
    return `(${modifiers.join(' ')} variable) ${node.getText()}: ${initializerType}`;
  }
  return '';
}

function handleParameter(
  node: ts.Node,
  param: ts.ParameterDeclaration
): string {
  const isOptional = param.questionToken ? '?' : '';
  const defaultValue = param.initializer
    ? ` = ${param.initializer.getText()}`
    : '';
  return `(parameter) ${node.getText()}${isOptional}: ${param.type?.getText() || 'any'}${defaultValue}`;
}

function handlePropertyDeclaration(
  node: ts.Node,
  prop: ts.PropertyDeclaration
): string {
  const modifiers = getTypeModifiers(prop);
  const isOptional = prop.questionToken ? '?' : '';
  return `(${modifiers.join(' ')} property) ${node.getText()}${isOptional}: ${prop.type?.getText() || 'any'}`;
}

function getTypeModifiers(node: ts.Node): string[] {
  const modifiers: string[] = [];
  if (ts.canHaveModifiers(node)) {
    const nodeModifiers = ts.getModifiers(node);
    if (nodeModifiers) {
      nodeModifiers.forEach((modifier) => {
        modifiers.push(modifier.getText());
      });
    }
  }
  return modifiers;
}

function getImplementsClause(node: ts.ClassDeclaration): string {
  if (!node.heritageClauses) return '';
  const implementsClause = node.heritageClauses.find(
    (clause) => clause.token === ts.SyntaxKind.ImplementsKeyword
  );
  return implementsClause
    ? ` implements ${implementsClause.types.map((t) => t.getText()).join(', ')}`
    : '';
}

function getExtendsClause(
  node: ts.ClassDeclaration | ts.InterfaceDeclaration
): string {
  if (!node.heritageClauses) return '';
  const extendsClause = node.heritageClauses.find(
    (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword
  );
  return extendsClause
    ? ` extends ${extendsClause.types.map((t) => t.getText()).join(', ')}`
    : '';
}

function processIdentifierInfo(node: ts.Node, tokens: TokenLocation[]) {
  const predefinedInfo = typeDefinitions[node.getText()];
  if (predefinedInfo) {
    const typeInfo = predefinedInfo.type || '';
    const documentation = predefinedInfo.description;
    const color = predefinedInfo.color;
    tokens.push({
      start: node.getStart(),
      end: node.getEnd(),
      type: 'identifier',
      text: node.getText(),
      info: { type: typeInfo, documentation, color },
    });
  } else {
    const typeInfo = handleNodeParent(node);
    if (typeInfo) {
      tokens.push({
        start: node.getStart(),
        end: node.getEnd(),
        type: 'identifier',
        text: node.getText(),
        info: { type: typeInfo },
      });
    }
  }
}

function visit(node: ts.Node, tokens: TokenLocation[]) {
  if (ts.isIdentifier(node)) {
    const detailedInfo = getDetailedTypeInfo(node, node);
    if (detailedInfo) {
      const formattedSignature = formatTypeSignature(detailedInfo);
      tokens.push({
        start: node.getStart(),
        end: node.getEnd(),
        type: 'identifier',
        text: node.getText(),
        info: {
          type: 'Type Signature',
          documentation: `\`\`\`typescript\n${formattedSignature}\n\`\`\``,
          color: typeColors?.['type-signature'] || {
            text: '#4078f2',
            background: 'rgba(64, 120, 242, 0.1)',
          },
        },
      });
      return;
    }
    processIdentifierInfo(node, tokens);
  }
  ts.forEachChild(node, (n) => visit(n, tokens));
}

function handleNodeParent(node: ts.Node): string {
  if (ts.isVariableDeclaration(node.parent)) {
    return handleVariableDeclaration(node, node.parent);
  } else if (ts.isParameter(node.parent)) {
    return handleParameter(node, node.parent);
  } else if (ts.isPropertyDeclaration(node.parent)) {
    return handlePropertyDeclaration(node, node.parent);
  }
  return '';
}

export function parseTypeScript(
  code: string,
  options: { jsx?: boolean } = {}
): ParserResult {
  const tokens: TokenLocation[] = [];
  const errors: string[] = [];

  const sourceFile = ts.createSourceFile(
    'file.tsx',
    code,
    ts.ScriptTarget.Latest,
    true,
    options.jsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  try {
    visit(sourceFile, tokens);
  } catch (error) {
    console.warn('Error during TypeScript parsing:', error);
    errors.push(String(error));
  }

  return {
    tokens,
    errors,
    isValid: errors.length === 0,
    usesFallback: false,
  };
}
