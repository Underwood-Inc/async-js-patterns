---
title: Migrating from Yarn to pnpm
description: Guide to migrating your project from Yarn to pnpm
---

# Migrating from Yarn to pnpm

This guide covers the process of migrating your project from Yarn to pnpm, including command mappings, configuration changes, and best practices.

## Prerequisites

1. Install pnpm:

```bash:preview
# Using npm
npm install -g pnpm

# Using curl (Unix)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Using PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

2. Verify installation:

```bash:preview
pnpm --version
```

## Migration Steps

### 1. Generate pnpm-lock.yaml

```bash:preview
# Remove Yarn's lock file
rm yarn.lock

# Import Yarn configuration (optional)
pnpm import

# Generate pnpm-lock.yaml
pnpm install
```

### 2. Update CI Configuration

#### GitHub Actions

```yaml:preview
# Before (Yarn)
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
  - run: yarn install --frozen-lockfile
  - run: yarn test

# After (pnpm)
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
  - uses: pnpm/action-setup@v2
    with:
      version: 8
  - run: pnpm install --frozen-lockfile
  - run: pnpm test
```

### 3. Update Scripts

#### package.json

```json:preview
{
  "scripts": {
    // Before (Yarn)
    "start": "yarn build && node dist/index.js",
    "dev": "yarn build --watch",

    // After (pnpm)
    "start": "pnpm run build && node dist/index.js",
    "dev": "pnpm run build --watch"
  }
}
```

## Command Mapping

### Basic Commands

| Yarn                     | pnpm                    |
| ------------------------ | ----------------------- |
| `yarn` or `yarn install` | `pnpm install`          |
| `yarn add [package]`     | `pnpm add [package]`    |
| `yarn add -D [package]`  | `pnpm add -D [package]` |
| `yarn remove [package]`  | `pnpm remove [package]` |
| `yarn [script]`          | `pnpm [script]`         |
| `yarn test`              | `pnpm test`             |
| `yarn build`             | `pnpm build`            |

### Advanced Commands

| Yarn                              | pnpm                             |
| --------------------------------- | -------------------------------- |
| `yarn install --frozen-lockfile`  | `pnpm install --frozen-lockfile` |
| `yarn audit`                      | `pnpm audit`                     |
| `yarn outdated`                   | `pnpm outdated`                  |
| `yarn why [package]`              | `pnpm why [package]`             |
| `yarn workspace [name] [command]` | `pnpm --filter [name] [command]` |

## Configuration Changes

### 1. Package Manager Settings

```json:preview
// package.json
{
  "packageManager": "pnpm@8.0.0"
}
```

### 2. Workspace Configuration

```yaml:preview
# Before (.yarnrc.yml)
nodeLinker: node-modules
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-workspace-tools.cjs

# After (pnpm-workspace.yaml)
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

### 3. pnpm Configuration

```ini:preview
# .npmrc
strict-peer-dependencies=true
auto-install-peers=true
shamefully-hoist=true

registry=https://registry.npmjs.org/
```

### 4. Git Configuration

```gitignore:preview
# .gitignore
node_modules
.pnpm-store/
.pnpm-debug.log

# Remove Yarn-specific entries
.yarn/*
.pnp.*
```

## Workspace Migration

### 1. Update Dependencies

```json:preview
// Before (Yarn workspace protocol)
{
  "dependencies": {
    "@myorg/shared": "workspace:*"
  }
}

// After (pnpm workspace protocol)
{
  "dependencies": {
    "@myorg/shared": "workspace:*"
  }
}
```

### 2. Update Commands

```bash:preview
# Before (Yarn)
yarn workspace package-name add lodash
yarn workspaces foreach run test

# After (pnpm)
pnpm --filter package-name add lodash
pnpm -r run test
```

## Feature Comparison

### Plug'n'Play to pnpm Store

- Yarn PnP: Direct module resolution
- pnpm: Content-addressable store
- Both: Efficient disk usage
- Migration: May need hoisting

### Workspace Features

```bash:preview
# Yarn parallel execution
yarn workspaces foreach -p run test

# pnpm parallel execution
pnpm -r --parallel run test

# Yarn filtering
yarn workspace package-name build

# pnpm filtering
pnpm --filter package-name build
```

## Best Practices

### 1. Migration Process

- Migrate one project at a time
- Test thoroughly
- Update CI/CD pipelines
- Document changes

### 2. Store Management

- Regular maintenance
- CI caching strategy
- Store verification
- Clean unused packages

### 3. Dependency Management

- Review peer dependencies
- Check hoisting requirements
- Update scripts
- Verify workspaces

### 4. Performance

- Enable hoisting if needed
- Use parallel commands
- Leverage workspace features
- Maintain clean store

## Common Issues

### 1. Module Resolution

```ini:preview
# .npmrc
node-linker=hoisted
shamefully-hoist=true
```

### 2. Workspace Protocol

```json:preview
{
  "dependencies": {
    // Both Yarn and pnpm support workspace:*
    "@myorg/shared": "workspace:*"
  }
}
```

### 3. Peer Dependencies

```bash:preview
# Handle peer dependencies
pnpm install --no-strict-peer-dependencies
```

## Rollback Plan

If migration issues occur:

```bash:preview
# 1. Remove pnpm files
rm pnpm-lock.yaml
rm -rf node_modules
rm -rf .pnpm-store

# 2. Restore Yarn
yarn install

# 3. Verify yarn.lock
git checkout yarn.lock
yarn install --frozen-lockfile
```

## Verification Steps

```bash:preview
# 1. Clean install
rm -rf node_modules
pnpm install

# 2. Run tests
pnpm test

# 3. Build project
pnpm build

# 4. Check workspaces
pnpm -r exec pwd

# 5. Verify dependencies
pnpm why important-package
```
