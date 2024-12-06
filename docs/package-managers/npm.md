---
title: npm Guide
description: Guide to using npm (Node Package Manager)
---

# npm Guide

npm (Node Package Manager) is the default package manager for Node.js and the world's largest software registry. It's installed automatically with Node.js and provides a robust foundation for managing JavaScript packages.

## Installation

npm comes bundled with Node.js:

```bash:preview
# Check if npm is installed
npm -v

# Update npm to latest version
npm install -g npm@latest
```

## Key Commands

### Project Initialization

```bash:preview
# Create a new package.json
npm init

# Create with defaults
npm init -y
```

### Package Installation

```bash:preview
# Install all dependencies
npm install

# Install a package
npm install package-name

# Install as dev dependency
npm install --save-dev package-name

# Install globally
npm install -g package-name

# Install specific version
npm install package-name@version
```

### Package Management

```bash:preview
# Update packages
npm update

# Remove package
npm uninstall package-name

# List installed packages
npm list

# List outdated packages
npm outdated

# Run security audit
npm audit

# Fix security issues
npm audit fix
```

### Scripts

```bash:preview
# Run a script defined in package.json
npm run script-name

# Common built-in scripts
npm start
npm test
npm build
```

## Configuration

### npm Configuration File (`.npmrc`)

```ini:preview
# Set default registry
registry=https://registry.npmjs.org/

# Set authentication token
//registry.npmjs.org/:_authToken=${NPM_TOKEN}

# Set default save prefix
save-prefix=~

# Enable package-lock
package-lock=true
```

### package.json

```json:preview
{
  "name": "my-project",
  "version": "1.0.0",
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

npm supports workspaces for monorepo management:

```json:preview
{
  "name": "my-monorepo",
  "workspaces": ["packages/*"]
}
```

### Workspace Commands

```bash:preview
# Install dependencies for all workspaces
npm install

# Run command in specific workspace
npm run test --workspace=package-name

# Run command in all workspaces
npm run test --workspaces
```

## Best Practices

1. **Version Control**

   - Always commit `package.json` and `package-lock.json`
   - Use `.npmignore` to exclude unnecessary files
   - Use `save-exact` for critical dependencies

2. **Security**

   - Regularly run `npm audit`
   - Use `npm ci` in CI/CD pipelines
   - Keep npm and Node.js updated
   - Use official registry or trusted sources

3. **Performance**

   - Use `npm ci` for clean installs
   - Leverage caching in CI/CD
   - Use `--production` flag in production
   - Clean cache periodically with `npm cache clean`

4. **Dependency Management**
   - Review dependencies regularly
   - Use `npm outdated` to check updates
   - Consider using `npm-check` for updates
   - Be cautious with `npm update`

## Common Issues and Solutions

### EACCES Permission Errors

```bash:preview
# Fix permissions globally
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

### Package Lock Conflicts

```bash:preview
# Regenerate package-lock.json
rm package-lock.json
npm install
```

### Cache Issues

```bash:preview
# Clear npm cache
npm cache clean --force

# Verify cache
npm cache verify
```

## Advanced Features

### npm Scripts with Arguments

```json:preview
{
  "scripts": {
    "start": "node server.js",
    "start:dev": "NODE_ENV=development npm run start",
    "start:prod": "NODE_ENV=production npm run start"
  }
}
```

### Custom Registry Configuration

```bash:preview
# Set custom registry
npm config set registry https://custom-registry.com

# Use registry for specific scope
npm config set @myorg:registry https://custom-registry.com
```

### Publishing Packages

```bash:preview
# Login to npm
npm login

# Publish package
npm publish

# Publish scoped package
npm publish --access public
```

More content coming soon...
