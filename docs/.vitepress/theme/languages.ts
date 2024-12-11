import type { LanguageInput } from 'shiki';
import { getHighlighter } from 'shiki';

// Define all languages we want to support
export const languages: LanguageInput[] = [
  'typescript',
  'javascript',
  'json',
  'bash',
  'sh',
  'shell',
  'plaintext',
  'text',
  'yaml',
  'markdown',
  'md',
  'html',
  'css',
  'scss',
  'sass',
  'less',
  'vue',
  'jsx',
  'tsx',
];

// Pre-load languages
export async function preloadLanguages() {
  const highlighter = await getHighlighter({
    themes: ['vitesse-dark'],
    langs: languages,
  });
  return highlighter;
}
