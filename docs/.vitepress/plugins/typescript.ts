import type MarkdownIt from 'markdown-it';

export function typescriptPlugin(md: MarkdownIt) {
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];
    const lang = token.info.trim();

    // Handle TypeScript code blocks
    if (lang === 'typescript' || lang === 'ts') {
      token.info = 'typescript';
    }

    return fence(...args);
  };
}
