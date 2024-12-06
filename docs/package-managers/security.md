---
title: Package Manager Security
description: Security best practices for JavaScript package managers
---

# Package Manager Security

Security is crucial when working with package managers. This guide covers best practices, common vulnerabilities, and strategies to maintain a secure dependency tree.

## Security Auditing

### Running Security Audits

```bash
# npm
npm audit
npm audit fix

# yarn
yarn audit
yarn audit fix

# pnpm
pnpm audit
pnpm audit fix

# bun
bun run security
```

### Audit Configuration

```json
{
  "scripts": {
    "security": "npm audit && snyk test",
    "audit:fix": "npm audit fix",
    "audit:report": "npm audit --json > audit-report.json"
  }
}
```

## Supply Chain Security

### Registry Security

```ini
# .npmrc
registry=https://registry.npmjs.org/
always-auth=true
audit=true
strict-ssl=true
```

### Package Signing

```bash
# Sign your packages
npm publish --sign

# Verify package signatures
npm verify --signatures
```

### Trusted Publishers

```bash
# Add trusted publisher
npm access grant read-write username:package-name

# List trusted publishers
npm access ls-collaborators package-name
```

## Dependency Management

### Version Pinning

```json
{
  "dependencies": {
    "critical-package": "1.2.3",
    "less-critical": "^2.0.0"
  },
  "overrides": {
    "vulnerable-dep": "2.0.0"
  }
}
```

### Lock File Security

```bash
# Verify lock file integrity
npm ci
yarn install --frozen-lockfile
pnpm install --frozen-lockfile

# Update with security fixes
npm audit fix --package-lock-only
yarn upgrade --pattern "vulnerable-*"
```

## Authentication & Authorization

### Registry Authentication

```ini
# .npmrc
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
//registry.company.com/:_authToken=${COMPANY_NPM_TOKEN}
```

### Access Control

```bash
# Scope access
npm access restricted @myorg/package

# Grant access
npm access grant read-only username [@scope/]package

# Revoke access
npm access revoke username [@scope/]package
```

## CI/CD Security

### Environment Variables

```yaml
# GitHub Actions
jobs:
  build:
    env:
      NODE_ENV: production
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    steps:
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
```

### Security Checks

```yaml
# GitLab CI
security:
  script:
    - npm audit
    - snyk test
    - npm run lint
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

## Best Practices

### 1. Dependency Management

- Regularly update dependencies
- Use exact versions for critical packages
- Implement security update automation
- Monitor dependency licenses

### 2. Registry Security

- Use private registries when possible
- Enable two-factor authentication
- Implement package signing
- Use scoped packages

### 3. Access Control

- Implement least privilege access
- Regular access audits
- Rotate access tokens
- Use environment-specific tokens

### 4. Code Security

- Run security linters
- Implement git hooks
- Use lockfile security
- Enable vulnerability scanning

## Security Tools

### Built-in Tools

```bash
# npm audit
npm audit
npm audit fix
npm audit fix --force

# yarn audit
yarn audit
yarn npm audit
yarn audit --groups dependencies

# pnpm audit
pnpm audit
pnpm audit fix
```

### Third-party Tools

```bash
# Snyk
npm install -g snyk
snyk test
snyk monitor

# SonarQube
sonar-scanner

# OWASP Dependency-Check
dependency-check --project "My Project" --scan ./
```

## Common Vulnerabilities

### 1. Malicious Packages

```bash
# Check package reputation
npm view package-name
npm view package-name maintainers

# Verify package contents
npm pack package-name
tar -xzf package-name-*.tgz
```

### 2. Dependency Confusion

```ini
# .npmrc
@company:registry=https://registry.company.com/
always-auth=true
```

### 3. Outdated Dependencies

```bash
# Check outdated packages
npm outdated
npm audit

# Update safely
npm update --depth 1
```

## Security Policies

### package.json

```json
{
  "engines": {
    "node": ">=14.0.0"
  },
  "scripts": {
    "preinstall": "node scripts/security-check.js",
    "prepare": "husky install"
  }
}
```

### .npmrc

```ini
audit=true
fund=false
package-lock=true
save-exact=true
```

## Incident Response

### Security Issue Detection

```bash
# Check for known vulnerabilities
npm audit

# Generate detailed report
npm audit --json > security-report.json

# Fix issues automatically
npm audit fix --force
```

### Rollback Procedures

```bash
# Revert to last known good state
git checkout package-lock.json@{yesterday}
npm ci

# Lock to specific versions
npm install package@1.2.3 --save-exact
```

### Reporting

```bash
# Generate security reports
npm audit --json
npm ls --json
npm outdated --json

# Document incidents
echo "Security incident report" > incident-report.md
```
