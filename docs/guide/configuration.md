---
title: Configuration Guide
description: Comprehensive configuration guide for Modern Web Development Patterns, including customization options and advanced settings.
head:
  - - meta
    - name: keywords
      content: configuration, settings, customization, JavaScript, TypeScript, web development, async patterns, setup options
  - - meta
    - name: author
      content: Modern Web Development Patterns
  - - meta
    - property: og:title
      content: Configuration Guide | Modern Web Development
  - - meta
    - property: og:description
      content: Learn how to configure and customize Modern Web Development Patterns for your specific needs and requirements.
---

# Configuration Guide

## Code Quality Tools

### 1. ESLint Configuration

```json:preview
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### 2. Prettier Configuration

```json:preview
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 3. Husky Setup

```bash:preview
npm install --save-dev husky lint-staged

# Initialize Husky
npx husky install
```

```json:preview
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --findRelatedTests"
    ]
  }
}
```

```bash:preview
# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Add commit message hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

### 4. Commitlint Configuration

```javascript:preview
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
      ],
    ],
  },
};
```

### 5. Jest Configuration

```javascript:preview
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### 6. GitHub Actions Workflow

```yaml:preview
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: |
          npm run lint
          npm run type-check

      - name: Test
        run: npm test -- --coverage

      - name: Build
        run: npm run build
```

## Development Environment

### VS Code Settings

```json:preview
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "jest.autoRun": "off"
}
```

### VS Code Extensions

```json:preview
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-tslint-plugin",
    "orta.vscode-jest",
    "ZixuanChen.vitest-explorer"
  ]
}
```

## Package Scripts

```json:preview
{
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "prepare": "husky install",
    "docs": "typedoc --out docs/api src/",
    "precommit": "lint-staged"
  }
}
```
