---
title: pnpm Guide
description: Guide to using pnpm (Performant npm) package manager
---

# pnpm Guide

pnpm is a fast, disk space efficient package manager that creates a non-flat node_modules directory. It uses hard links and symlinks to save disk space and boost installation speed.

## Installation

```bash:preview
# Using npm
npm install -g pnpm

# Using Curl (Unix)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Using PowerShell (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Check installation
pnpm --version
```

## Key Commands

### Project Initialization

```bash:preview
# Create a new package.json
pnpm init

# Create with defaults
pnpm init -y
```

### Package Installation

```bash:preview
# Install all dependencies
pnpm install

# Add a package
pnpm add package-name

# Add as dev dependency
pnpm add -D package-name

# Add globally
pnpm add -g package-name

# Add specific version
pnpm add package-name@version
```

### Package Management

```bash:preview
# Update packages
pnpm update

# Remove package
pnpm remove package-name

# List installed packages
pnpm list

# Check outdated packages
pnpm outdated

# Run security audit
pnpm audit
```

### Scripts

```bash:preview
# Run a script
pnpm run script-name
# or simply
pnpm script-name

# Common commands
pnpm start
pnpm test
pnpm build
```

## Configuration

### pnpm Configuration File (`.npmrc`)

```ini:preview
# Set registry
registry=https://registry.npmjs.org/

# Use strict-peer-dependencies
strict-peer-dependencies=true

# Enable workspace features
node-linker=hoisted

# Set store directory
store-dir=.pnpm-store
```

### package.json

```json:preview
{
  "name": "my-project",
  "version": "1.0.0",
  "packageManager": "pnpm@8.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "build": "webpack"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "jest": "^27.0.0"
  }
}
```

## Workspaces

pnpm has excellent monorepo support through workspaces:

```yaml:preview
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

### Workspace Commands

```bash:preview
# Install dependencies for all workspaces
pnpm install

# Run command in specific workspace
pnpm --filter package-name run command

# Run command in all workspaces
pnpm -r run command

# Run command in parallel
pnpm -r --parallel run command
```

## Store & Linking

pnpm uses a unique approach to manage dependencies:

### Content-addressable Store

```bash:preview
# Location of global store
~/.pnpm-store/

# Project-specific store
node_modules/.pnpm/
```

### Hard Links

- Each version of a package is saved only once on disk
- Multiple projects share the same package versions
- Significant disk space savings

## Best Practices

1. **Version Control**

   - Commit `pnpm-lock.yaml`
   - Use `.gitignore` for `node_modules`
   - Consider committing `.npmrc`
   - Specify `packageManager` in package.json

2. **Security**

   - Use `pnpm audit` regularly
   - Enable strict-peer-dependencies
   - Use official registry
   - Keep pnpm updated

3. **Performance**

   - Use workspace features for monorepos
   - Enable hoisting when needed
   - Leverage parallel execution
   - Use store-dir for CI caching

4. **Dependency Management**
   - Regular dependency updates
   - Use overrides for resolution conflicts
   - Check for peer dependency issues
   - Use `pnpm why` for dependency analysis

## Common Issues and Solutions

### Store Issues

```bash:preview
# Clear store
pnpm store prune

# Verify store
pnpm store verify

# Remove unused packages
pnpm store prune
```

### Dependency Resolution

```bash:preview
# Force resolution
pnpm add package-name --force

# Clean install
pnpm install --force
```

### Migration from npm/Yarn

```bash:preview
# Import package-lock.json/yarn.lock
pnpm import

# Generate pnpm-lock.yaml
pnpm install
```

## Advanced Features

### Filtering

```bash:preview
# Run in packages that depend on another
pnpm --filter ...package-name command

# Run in packages updated since main
pnpm --filter "[main]" command

# Run in specific packages
pnpm --filter "package-a...package-b" command
```

### Hooks

```json:preview
{
  "pnpm": {
    "hooks": {
      "readPackage": "hooks/readPackage.js"
    }
  }
}
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

More content coming soon...
