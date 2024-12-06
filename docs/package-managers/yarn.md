---
title: Yarn Guide
description: Guide to using Yarn package manager
---

# Yarn Guide

Yarn is a fast, reliable, and secure package manager developed by Facebook. It offers improved performance, better dependency resolution, and enhanced security features compared to npm.

## Installation

```bash:preview
# Using npm
npm install -g yarn

# Using Corepack (Node.js 16.10+)
corepack enable
corepack prepare yarn@stable --activate

# Check installation
yarn --version
```

## Key Commands

### Project Initialization

```bash:preview
# Create a new package.json
yarn init

# Create with defaults
yarn init -y
```

### Package Installation

```bash:preview
# Install all dependencies
yarn
# or
yarn install

# Add a package
yarn add package-name

# Add as dev dependency
yarn add --dev package-name

# Add globally
yarn global add package-name

# Add specific version
yarn add package-name@version
```

### Package Management

```bash:preview
# Upgrade packages
yarn upgrade

# Remove package
yarn remove package-name

# List installed packages
yarn list

# Check outdated packages
yarn outdated

# Clean cache
yarn cache clean
```

### Scripts

```bash:preview
# Run a script
yarn run script-name
# or simply
yarn script-name

# Common commands
yarn start
yarn test
yarn build
```

## Configuration

### Yarn Configuration File (`.yarnrc.yml`)

```yaml:preview
# Set registry
npmRegistryServer: 'https://registry.npmjs.org'

# Enable Node_modules linker
nodeLinker: node-modules

# Enable PnP
pnpMode: strict

# Set cache folder
cacheFolder: './.yarn/cache'
```

### package.json

```json:preview
{
  "name": "my-project",
  "version": "1.0.0",
  "packageManager": "yarn@3.6.0",
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

Yarn has excellent support for monorepos through workspaces:

```json:preview
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

### Workspace Commands

```bash:preview
# Install dependencies for all workspaces
yarn install

# Run command in specific workspace
yarn workspace package-name command

# Run command in all workspaces
yarn workspaces foreach run command
```

## Plug'n'Play (PnP)

Yarn's PnP feature improves installation and resolution speed:

```yaml:preview
# .yarnrc.yml
pnpMode: strict

# Enable PnP
nodeLinker: pnp

# Zero-Installs
enableGlobalCache: false
```

### PnP Benefits

- Faster installation
- Guaranteed dependency resolution
- Better security
- Reduced disk usage
- Zero-Installs capability

## Best Practices

1. **Version Control**

   - Commit `.yarnrc.yml`
   - Commit `yarn.lock`
   - Consider committing `.pnp.cjs` for Zero-Installs
   - Use `.gitignore` for `.yarn/cache`

2. **Security**

   - Use `yarn audit` regularly
   - Enable strict mode for PnP
   - Use `yarn policies set-version` for version consistency
   - Regularly update Yarn itself

3. **Performance**

   - Enable PnP when possible
   - Use Zero-Installs for faster CI
   - Leverage workspace features
   - Use `yarn dlx` instead of `npx`

4. **Dependency Management**
   - Use `yarn why` to check dependency usage
   - Regular `yarn upgrade-interactive`
   - Use resolutions for dependency conflicts
   - Consider using constraints for workspaces

## Common Issues and Solutions

### PnP Compatibility

```bash:preview
# Handle packages without PnP support
yarn add package-name --ignore-scripts

# Use node-modules linker if needed
nodeLinker: node-modules
```

### Migration from npm

```bash:preview
# Import npm configuration
yarn import

# Generate yarn.lock from package-lock.json
yarn install
```

### Cache Issues

```bash:preview
# Clear cache
yarn cache clean

# Rebuild module cache
yarn rebuild
```

## Advanced Features

### Constraints

```js:preview
// .yarn/constraints.pro
gen_enforced_dependency(WorkspaceCwd, 'typescript', '4.5.2', DependencyType) :-
  workspace_has_dependency(WorkspaceCwd, 'typescript', _, DependencyType).
```

### Protocols

```yaml:preview
# .yarnrc.yml
packageExtensions:
  'package-name@*':
    dependencies:
      'missing-peer': '^1.0.0'
```

### Custom Commands

```js:preview
// .yarn/plugins/plugin-commands-custom.js
module.exports = {
  commands: {
    custom: {
      description: 'Custom command',
      factory: () => async () => {
        // Command implementation
      },
    },
  },
};
```

More content coming soon...
