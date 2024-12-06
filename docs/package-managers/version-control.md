---
title: Version Control
description: Best practices for version control with package managers
---

# Version Control

Proper version control practices for package managers are essential for maintaining consistent and reproducible builds across team members and deployment environments.

## Lock Files

### Purpose and Importance

Lock files ensure dependency tree consistency across different environments by:

- Pinning exact versions
- Recording dependency tree structure
- Storing integrity checksums
- Tracking resolution details

### Lock Files by Package Manager

```bash
# npm
package-lock.json

# Yarn
yarn.lock

# pnpm
pnpm-lock.yaml

# Bun
bun.lockb
```

## Git Configuration

### .gitignore

```gitignore
# Dependencies
node_modules/
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# Package manager specific
.npm
.pnpm-store/
.bun

# Cache
.cache
.eslintcache
.stylelintcache

# Environment
.env
.env.local
.env.*.local

# Build output
dist/
build/
```

### What to Commit

```bash
# Always commit
package.json
package-lock.json
yarn.lock
pnpm-lock.yaml
bun.lockb
.npmrc
.yarnrc.yml
pnpm-workspace.yaml

# Never commit
node_modules/
.env
```

## Version Control Strategies

### Semantic Versioning

```json
{
  "version": "MAJOR.MINOR.PATCH",
  "dependencies": {
    "exact": "1.2.3",
    "patch": "~1.2.3",
    "minor": "^1.2.3",
    "range": ">=1.2.3"
  }
}
```

### Version Constraints

```json
{
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "packageManager": "pnpm@7.0.0"
}
```

## Monorepo Strategies

### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - '!**/test/**'
```

```json
// package.json (Yarn/npm)
{
  "workspaces": ["packages/*", "apps/*"]
}
```

### Version Management

```json
{
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "version": "changeset version",
    "publish": "changeset publish"
  }
}
```

## CI/CD Integration

### Cache Configuration

#### GitHub Actions

```yaml
- uses: actions/cache@v3
  with:
    path: |
      **/node_modules
      ~/.npm
      ~/.pnpm-store
      .yarn/cache
    key: ${{ runner.os }}-modules-${{ hashFiles('**/package-lock.json') }}
```

#### GitLab CI

```yaml
cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
    - .npm/
    - .pnpm-store/
    - .yarn/cache/
```

### Clean Installs

```bash
# npm
npm ci

# yarn
yarn install --frozen-lockfile

# pnpm
pnpm install --frozen-lockfile

# bun
bun install --frozen-lockfile
```

## Best Practices

### 1. Lock File Management

- Always commit lock files
- Use clean installs in CI
- Update lock files deliberately
- Review lock file changes

### 2. Dependency Updates

- Schedule regular updates
- Review changes systematically
- Test thoroughly
- Document breaking changes

### 3. Version Control Workflow

- Use consistent package manager
- Enforce engine constraints
- Document setup requirements
- Maintain clean dependency tree

### 4. Security

- Audit dependencies regularly
- Review lock file changes
- Use trusted registries
- Implement security policies

## Common Workflows

### Package Updates

```bash
# 1. Create branch
git checkout -b update-dependencies

# 2. Update dependencies
npm update
git add package.json package-lock.json

# 3. Test changes
npm test

# 4. Commit changes
git commit -m "chore: update dependencies"

# 5. Create PR
git push origin update-dependencies
```

### Breaking Changes

```bash
# 1. Document changes
git checkout -b breaking-change

# 2. Update package
npm install package-name@latest

# 3. Update code for breaking changes
git add .

# 4. Commit with conventional commit
git commit -m "feat!: upgrade package-name to v2"

# 5. Create PR with breaking change note
git push origin breaking-change
```

## Troubleshooting

### Lock File Conflicts

```bash
# Reset lock file
rm package-lock.json
npm install

# Force update
npm install --force
```

### Workspace Issues

```bash
# Clean install
rm -rf node_modules
npm install

# Reset workspace
npm run clean
npm install
```

### Cache Problems

```bash
# Clear all caches
npm cache clean --force
yarn cache clean
pnpm store prune
```
