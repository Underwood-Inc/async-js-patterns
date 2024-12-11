---
title: Migrating from npm to Yarn
description: Guide to migrating your project from npm to Yarn
---

# Migrating from npm to Yarn

This guide covers the process of migrating your project from npm to Yarn, including command mappings, configuration changes, and best practices.

## Prerequisites

1. Install Yarn:

::: code-with-tooltips

```bash
# Using npm
npm install -g yarn

# Using Corepack (Node.js 16.10+)
corepack enable
corepack prepare yarn@stable --activate
```

:::

2. Verify installation:

::: code-with-tooltips

```bash
yarn --version
```

:::

## Migration Steps

### 1. Generate yarn.lock

::: code-with-tooltips

```bash
# Remove npm's lock file
rm package-lock.json

# Generate yarn.lock
yarn
```

:::

### 2. Update CI Configuration

#### GitHub Actions

::: code-with-tooltips

```yaml
# Before (npm)
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
  - run: npm ci
  - run: npm test

# After (yarn)
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
  - run: yarn install --frozen-lockfile
  - run: yarn test
```

:::

### 3. Update Scripts

#### package.json

::: code-with-tooltips

```json
{
  "scripts": {
    // Before (npm)
    "start": "npm run build && node dist/index.js",
    "dev": "npm run build -- --watch",

    // After (yarn)
    "start": "yarn build && node dist/index.js",
    "dev": "yarn build --watch"
  }
}
```

:::

## Command Mapping

### Basic Commands

| npm                                | Yarn                       |
| ---------------------------------- | -------------------------- |
| `npm install`                      | `yarn` or `yarn install`   |
| `npm install [package]`            | `yarn add [package]`       |
| `npm install --save-dev [package]` | `yarn add --dev [package]` |
| `npm uninstall [package]`          | `yarn remove [package]`    |
| `npm run [script]`                 | `yarn [script]`            |
| `npm test`                         | `yarn test`                |
| `npm run build`                    | `yarn build`               |

### Advanced Commands

| npm            | Yarn                             |
| -------------- | -------------------------------- |
| `npm ci`       | `yarn install --frozen-lockfile` |
| `npm audit`    | `yarn audit`                     |
| `npm outdated` | `yarn outdated`                  |
| `npm version`  | `yarn version`                   |
| `npm publish`  | `yarn publish`                   |

## Configuration Changes

### 1. Package Manager Settings

::: code-with-tooltips

```json
// package.json
{
  "packageManager": "yarn@3.6.0"
}
```

:::

### 2. Yarn Configuration

::: code-with-tooltips

```yaml
# .yarnrc.yml
nodeLinker: node-modules
enableGlobalCache: true

npmRegistryServer: 'https://registry.npmjs.org'
```

:::

### 3. Git Configuration

::: code-with-tooltips

```plaintext
# .gitignore
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# Zero-installs
.pnp.*
```

:::

## Workspace Migration

### 1. Update Workspace Configuration

::: code-with-tooltips

```json
// Before (npm)
{
  "workspaces": [
    "packages/*"
  ]
}

// After (yarn)
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

:::

### 2. Update Workspace Commands

::: code-with-tooltips

```bash
# Before (npm)
npm install --workspace=package-name
npm run test --workspaces

# After (yarn)
yarn workspace package-name install
yarn workspaces foreach run test
```

:::

## Best Practices

### 1. Lock File Management

- Always commit `yarn.lock`
- Use `yarn install --frozen-lockfile` in CI
- Regularly update dependencies
- Review lock file changes

### 2. Dependency Management

- Use `yarn why` to check dependency usage
- Regular `yarn upgrade-interactive`
- Use resolutions for conflicts
- Maintain clean dependency tree

### 3. Performance

- Enable Plug'n'Play when possible
- Use Zero-Installs for faster CI
- Leverage workspace features
- Use `yarn dlx` instead of `npx`

### 4. Security

- Regular `yarn audit`
- Use trusted sources
- Review dependency changes
- Keep Yarn updated

## Common Issues

### 1. Peer Dependencies

::: code-with-tooltips

```bash
# Handle peer dependency warnings
yarn install --ignore-peer-dependencies
```

:::

### 2. Node Version

::: code-with-tooltips

```json
// package.json
{
  "engines": {
    "node": ">=14.0.0"
  }
}
```

:::

### 3. Script Execution

::: code-with-tooltips

```bash
# Run scripts with arguments
yarn build --watch

# Run multiple scripts
yarn build && yarn test
```

:::

## Rollback Plan

If migration issues occur:

::: code-with-tooltips

```bash
# 1. Remove Yarn files
rm yarn.lock
rm -rf .yarn
rm -rf node_modules

# 2. Restore npm
npm install

# 3. Verify package-lock.json
git checkout package-lock.json
npm ci
```

:::

## Verification Steps

::: code-with-tooltips

```bash
# 1. Clean install
rm -rf node_modules
yarn install

# 2. Run tests
yarn test

# 3. Build project
yarn build

# 4. Check dependencies
yarn list

# 5. Check for issues
yarn audit
```

:::
