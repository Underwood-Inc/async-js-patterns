---
title: Monorepo Management
description: Guide to managing monorepos with JavaScript package managers
---

# Monorepo Management

Monorepos allow you to manage multiple packages in a single repository. This guide covers best practices and tools for managing JavaScript monorepos effectively.

## Workspace Setup

### npm Workspaces

```json:preview
// package.json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"]
}
```

### Yarn Workspaces

```yaml:preview
# .yarnrc.yml
nodeLinker: node-modules
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-workspace-tools.cjs
    spec: '@yarnpkg/plugin-workspace-tools'
```

### pnpm Workspaces

```yaml:preview
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

## Project Structure

```bash:preview
monorepo/
├── package.json
├── packages/
│   ├── shared/
│   │   ├── package.json
│   │   └── src/
│   └── utils/
│       ├── package.json
│       └── src/
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   └─ src/
│   └── api/
│       ├── package.json
│       └── src/
└── tools/
    └── scripts/
```

## Package Management

### Local Dependencies

```json:preview
// packages/web/package.json
{
  "name": "@myorg/web",
  "dependencies": {
    "@myorg/shared": "workspace:*",
    "@myorg/utils": "workspace:^1.0.0"
  }
}
```

### Installation Commands

```bash:preview
# npm
npm install
npm install --workspace=web
npm install lodash --workspace=web

# yarn
yarn install
yarn workspace web add lodash
yarn workspaces foreach install

# pnpm
pnpm install
pnpm --filter web install
pnpm --filter web add lodash
```

## Script Execution

### Running Scripts

```bash:preview
# npm
npm run test --workspaces
npm run build --workspace=web

# yarn
yarn workspaces foreach run test
yarn workspace web run build

# pnpm
pnpm -r run test
pnpm --filter web run build
```

### Parallel Execution

```bash:preview
# npm
npm run test --workspaces --parallel

# yarn
yarn workspaces foreach -p run test

# pnpm
pnpm -r --parallel run test
```

## Version Management

### Independent Versions

```json:preview
// lerna.json
{
  "version": "independent",
  "packages": ["packages/*"],
  "command": {
    "version": {
      "allowBranch": "main"
    }
  }
}
```

### Fixed Versions

```json:preview
// lerna.json
{
  "version": "1.0.0",
  "packages": ["packages/*"],
  "command": {
    "version": {
      "conventionalCommits": true
    }
  }
}
```

## Build Systems

### Turborepo

```json:preview
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

### Nx

```json:preview
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test"]
      }
    }
  }
}
```

## Dependencies Management

### Shared Dependencies

```json:preview
// package.json (root)
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

### Dependency Hoisting

```json:preview
// .npmrc
hoist=true
shamefully-hoist=true

// .yarnrc.yml
nodeLinker: node-modules
```

## Development Workflow

### Git Hooks

```json:preview
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "**/*.{js,ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

### Task Running

```json:preview
// package.json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  }
}
```

## CI/CD Integration

### GitHub Actions

```yaml:preview
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions/cache@v3
        with:
          path: |
            node_modules
            */*/node_modules
          key: ${{ runner.os }}-modules-${{ hashFiles('**/package-lock.json') }}
      - run: npm ci
      - run: npm test --workspaces
```

### CircleCI

```yaml:preview
version: 2.1
jobs:
  build:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - restore_cache:
          keys:
            - deps-{{ checksum "package-lock.json" }}
      - run: npm ci
      - save_cache:
          key: deps-{{ checksum "package-lock.json" }}
          paths:
            - node_modules
      - run: npm test --workspaces
```

## Best Practices

### 1. Project Organization

- Use consistent package structure
- Share configuration files
- Implement clear dependency boundaries
- Maintain documentation

### 2. Dependency Management

- Use workspace protocols
- Implement hoisting strategy
- Share common dependencies
- Regular dependency updates

### 3. Build Process

- Implement incremental builds
- Use build caching
- Optimize CI/CD pipeline
- Maintain clean artifacts

### 4. Development Experience

- Consistent tooling
- Shared configurations
- Clear documentation
- Efficient local development

## Common Patterns

### Shared Configurations

```json:preview
// packages/tsconfig/base.json
{
  "compilerOptions": {
    "target": "es2019",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true
  }
}

// packages/web/tsconfig.json
{
  "extends": "@myorg/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### Package Aliases

```json:preview
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@myorg/*": ["packages/*/src"]
    }
  }
}
```

### Shared ESLint Config

```javascript:preview
// packages/eslint-config/index.js
module.exports = {
  extends: ['airbnb', 'prettier'],
  rules: {
    // shared rules
  },
};
```
