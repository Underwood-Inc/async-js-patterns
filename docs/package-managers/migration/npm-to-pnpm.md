---
title: Migrating from npm to pnpm
description: Guide to migrating your project from npm to pnpm
---

# Migrating from npm to pnpm

This guide covers the process of migrating your project from npm to pnpm, including command mappings, configuration changes, and best practices.

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
# Remove npm's lock file
rm package-lock.json

# Generate pnpm-lock.yaml
pnpm install
```

### 2. Update CI Configuration

#### GitHub Actions

```yaml:preview
# Before (npm)
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
  - run: npm ci
  - run: npm test

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
    // Before (npm)
    "start": "npm run build && node dist/index.js",
    "dev": "npm run build -- --watch",

    // After (pnpm)
    "start": "pnpm run build && node dist/index.js",
    "dev": "pnpm run build --watch"
  }
}
```

## Command Mapping

### Basic Commands

| npm                                | pnpm                    |
| ---------------------------------- | ----------------------- |
| `npm install`                      | `pnpm install`          |
| `npm install [package]`            | `pnpm add [package]`    |
| `npm install --save-dev [package]` | `pnpm add -D [package]` |
| `npm uninstall [package]`          | `pnpm remove [package]` |
| `npm run [script]`                 | `pnpm [script]`         |
| `npm test`                         | `pnpm test`             |
| `npm run build`                    | `pnpm build`            |

### Advanced Commands

| npm            | pnpm                             |
| -------------- | -------------------------------- |
| `npm ci`       | `pnpm install --frozen-lockfile` |
| `npm audit`    | `pnpm audit`                     |
| `npm outdated` | `pnpm outdated`                  |
| `npm version`  | `pnpm version`                   |
| `npm publish`  | `pnpm publish`                   |

## Configuration Changes

### 1. Package Manager Settings

```json:preview
// package.json
{
  "packageManager": "pnpm@8.0.0"
}
```

### 2. pnpm Configuration

```ini:preview
# .npmrc
strict-peer-dependencies=true
auto-install-peers=true
shamefully-hoist=true

registry=https://registry.npmjs.org/
```

### 3. Git Configuration

```gitignore:preview
# .gitignore
node_modules
.pnpm-store/
.pnpm-debug.log
```

## Workspace Migration

### 1. Update Workspace Configuration

```yaml:preview
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

### 2. Update Workspace Commands

```bash:preview
# Before (npm)
npm install --workspace=package-name
npm run test --workspaces

# After (pnpm)
pnpm --filter package-name install
pnpm -r run test
```

## Store & Linking

### Understanding pnpm's Store

```bash:preview
# Global store location
~/.pnpm-store/

# Project store
node_modules/.pnpm/
```

### Hard Links

- Each version of a package is saved once on disk
- Multiple projects share the same package versions
- Significant disk space savings

## Best Practices

### 1. Store Management

- Regular store maintenance
- Use store path for CI caching
- Verify store integrity
- Clean unused packages

### 2. Dependency Management

- Use strict peer dependencies
- Regular dependency updates
- Check for hoisting issues
- Use overrides when needed

### 3. Performance

- Enable hoisting when needed
- Use parallel commands
- Leverage workspace features
- Maintain clean store

### 4. Security

- Regular security audits
- Use trusted sources
- Review dependency changes
- Keep pnpm updated

## Common Issues

### 1. Hoisting Problems

```ini:preview
# .npmrc
shamefully-hoist=true
node-linker=hoisted
```

### 2. Peer Dependencies

```bash:preview
# Handle peer dependencies
pnpm install --no-strict-peer-dependencies
```

### 3. Store Issues

```bash:preview
# Verify store
pnpm store verify

# Clean store
pnpm store prune
```

## Rollback Plan

If migration issues occur:

```bash:preview
# 1. Remove pnpm files
rm pnpm-lock.yaml
rm -rf node_modules
rm -rf .pnpm-store

# 2. Restore npm
npm install

# 3. Verify package-lock.json
git checkout package-lock.json
npm ci
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

# 4. Check dependencies
pnpm list

# 5. Check for issues
pnpm audit
```

## Advanced Features

### Filtering in Monorepos

```bash:preview
# Run in packages that depend on another
pnpm --filter ...package-name command

# Run in packages updated since main
pnpm --filter "[main]" command

# Run in specific packages
pnpm --filter "package-a...package-b" command
```

### Custom Configs

```js:preview
// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Modify package here
      return pkg;
    },
  },
};
```

### Publishing

```bash:preview
# Publish package
pnpm publish

# Publish with custom tag
pnpm publish --tag beta

# Publish workspace packages
pnpm -r publish
```
