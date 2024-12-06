---
title: Dependency Management
description: Best practices for managing dependencies in JavaScript projects
---

# Dependency Management

Effective dependency management is crucial for maintaining healthy JavaScript projects. This guide covers best practices and strategies for managing project dependencies.

## Understanding Dependencies

### Types of Dependencies

- **dependencies**: Required for production runtime
- **devDependencies**: Only needed for development
- **peerDependencies**: Required by the consuming project
- **optionalDependencies**: Optional enhancements
- **bundledDependencies**: Bundled with the package

### Version Ranges

```json:preview
{
  "dependencies": {
    "exact": "1.0.0", // Exact version
    "patch": "~1.0.0", // Patch updates only (1.0.x)
    "minor": "^1.0.0", // Minor updates (1.x.x)
    "any": "*", // Any version
    "range": ">=1.0.0", // Version range
    "latest": "latest" // Latest version (avoid in production)
  }
}
```

## Version Control

### Lock Files

- `package-lock.json` (npm)
- `yarn.lock` (Yarn)
- `pnpm-lock.yaml` (pnpm)
- `bun.lockb` (Bun)

```bash:preview
# Always commit lock files
git add package-lock.json
git commit -m "Update dependencies"
```

### Updating Dependencies

```bash:preview
# Check outdated packages
npm outdated
yarn outdated
pnpm outdated

# Update within version constraints
npm update
yarn upgrade
pnpm update

# Update to latest versions
npm update --latest
yarn upgrade --latest
pnpm update --latest
```

## Security

### Auditing Dependencies

```bash:preview
# Run security audit
npm audit
yarn audit
pnpm audit

# Fix security issues
npm audit fix
yarn audit fix
pnpm audit fix
```

### Version Pinning

```json:preview
{
  "dependencies": {
    "critical-package": "1.2.3", // Pinned version
    "flexible-package": "^2.0.0" // Allows minor updates
  }
}
```

## Optimization Strategies

### Dependency Analysis

```bash:preview
# Analyze dependencies
npm ls
yarn why package-name
pnpm why package-name

# Find duplicate packages
npm dedupe
yarn dedupe
pnpm dedupe
```

### Bundle Size Optimization

```bash:preview
# Analyze bundle size
npm install -g source-map-explorer
source-map-explorer dist/bundle.js

# Use bundle analyzers
webpack-bundle-analyzer
rollup-plugin-visualizer
vite-bundle-visualizer
```

## Monorepo Management

### Workspace Configuration

```json:preview
// package.json
{
  "workspaces": ["packages/*"]
}
```

### Shared Dependencies

```json:preview
// packages/shared/package.json
{
  "name": "@myorg/shared",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "^4.17.21"
  }
}

// packages/app/package.json
{
  "name": "@myorg/app",
  "dependencies": {
    "@myorg/shared": "workspace:*"
  }
}
```

## Best Practices

### 1. Version Control

- Always commit lock files
- Use consistent versioning strategy
- Document dependency decisions
- Review dependency updates

### 2. Security

- Regular security audits
- Pin critical dependencies
- Use trusted sources
- Keep dependencies updated

### 3. Performance

- Regular dependency cleanup
- Use appropriate dependency types
- Optimize bundle size
- Consider tree-shaking

### 4. Development Workflow

- Document dependency changes
- Use consistent update strategy
- Test after updates
- Review breaking changes

## Common Patterns

### Peer Dependencies

```json:preview
{
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0"
  }
}
```

### Optional Dependencies

```json:preview
{
  "optionalDependencies": {
    "image-optimizer": "^2.0.0"
  }
}
```

### Development Tools

```json:preview
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

## Troubleshooting

### Common Issues

1. **Version Conflicts**

```bash:preview
# Clear dependency cache
npm cache clean --force
yarn cache clean
pnpm store prune

# Fresh install
rm -rf node_modules
npm install
```

2. **Peer Dependency Issues**

```bash:preview
# Install peer dependencies
npm install --legacy-peer-deps
yarn install --ignore-peer-dependencies
```

3. **Hoisting Problems**

```bash:preview
# Flatten dependency tree
npm dedupe
yarn dedupe
pnpm dedupe
```

### Resolution Strategies

#### npm

```json:preview
{
  "overrides": {
    "dependency-name": "1.2.3"
  }
}
```

#### Yarn

```json:preview
{
  "resolutions": {
    "dependency-name": "1.2.3"
  }
}
```

#### pnpm

```json:preview
{
  "pnpm": {
    "overrides": {
      "dependency-name": "1.2.3"
    }
  }
}
```
