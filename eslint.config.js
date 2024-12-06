import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import markdown from 'eslint-plugin-markdown';

const markdownConfig = {
  files: ['**/*.md'],
  plugins: {
    markdown,
  },
  processor: 'markdown/markdown',
};

const typescriptConfig = {
  files: ['**/*.{ts,tsx}', '**/*.md/*.{ts,tsx}'],
  languageOptions: {
    parser: tsparser,
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
  },
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};

const javascriptConfig = {
  files: ['**/*.{js,jsx}', '**/*.md/*.{js,jsx}'],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    // JavaScript specific rules
    'no-var': 'error',
    'prefer-const': 'error',
  },
};

const commonRules = {
  // Error prevention
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'no-debugger': 'warn',

  // Code style
  indent: ['error', 2],
  quotes: ['error', 'single'],
  semi: ['error', 'always'],
  'no-multiple-empty-lines': ['error', { max: 1 }],
  'eol-last': ['error', 'always'],

  // Best practices
  'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  'no-undef': 'error',
};

export default [
  eslint.configs.recommended,
  markdownConfig,
  {
    ...typescriptConfig,
    rules: {
      ...commonRules,
      ...typescriptConfig.rules,
    },
  },
  {
    ...javascriptConfig,
    rules: {
      ...commonRules,
      ...javascriptConfig.rules,
    },
  },
  {
    ignores: [
      'dist/**/*',
      'node_modules/**/*',
      'coverage/**/*',
      'temp/**/*',
      'docs/.vitepress/dist/**/*',
      'docs/.vitepress/dist/assets/**/*',
      'docs/.vitepress/cache/**/*',
      'docs/.vitepress/theme/**/*',
      'docs/.vitepress/**/*.js',
      '*.config.js',
      '.eslintrc.js',
      '**/*.min.js',
      '**/*.bundle.js',
    ],
  },
  prettier,
];
