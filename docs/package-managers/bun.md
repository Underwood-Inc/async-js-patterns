---
title: Bun Guide
description: Guide to using Bun as a package manager and JavaScript runtime
---

# Bun Guide

Bun is an all-in-one JavaScript runtime and package manager that focuses on performance. It provides incredibly fast package installation, a built-in bundler, test runner, and Node.js-compatible runtime.

## Installation

```bash
# Using curl (macOS, Linux)
curl -fsSL https://bun.sh/install | bash

# Using Homebrew (macOS)
brew tap oven-sh/bun
brew install bun

# Check installation
bun --version
```

## Key Commands

### Project Initialization

```bash
# Create a new project
bun init

# Create with defaults
bun init -y
```

### Package Installation

```bash
# Install all dependencies
bun install

# Add a package
bun add package-name

# Add as dev dependency
bun add -d package-name

# Add globally
bun add -g package-name

# Add specific version
bun add package-name@version
```

### Package Management

```bash
# Update packages
bun update

# Remove package
bun remove package-name

# List installed packages
bun pm ls

# Check outdated packages
bun outdated
```

### Scripts

```bash
# Run a script
bun run script-name

# Common commands
bun run start
bun run test
bun run build

# Run TypeScript/JavaScript directly
bun index.ts
```

## Configuration

### Bun Configuration File (`bunfig.toml`)

```toml
# Set registry
registry = "https://registry.npmjs.org"

# Set scope registry
[@scope]
registry = "https://custom-registry.com"

# Set install options
install.frozen = true
install.production = false
```

### package.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "bun run index.ts",
    "test": "bun test",
    "build": "bun build ./index.ts --outdir ./dist"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.13"
  }
}
```

## Runtime Features

### HTTP Server

```typescript
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response('Hello World!');
  },
});

console.log(`Listening on http://localhost:${server.port}`);
```

### File Operations

```typescript
// Read file
const file = await Bun.file('file.txt');
const text = await file.text();

// Write file
await Bun.write('output.txt', 'Hello World');

// JSON operations
const json = await Bun.file('data.json').json();
```

### Testing

```typescript
import { expect, test, describe } from 'bun:test';

describe('math', () => {
  test('addition', () => {
    expect(2 + 2).toBe(4);
  });
});
```

## Bundler

Bun includes a built-in bundler:

```bash
# Bundle for production
bun build ./index.ts --outdir ./dist

# Bundle with minification
bun build ./index.ts --minify

# Watch mode
bun build ./index.ts --watch
```

## Best Practices

1. **Project Setup**

   - Use `bun init` for new projects
   - Configure TypeScript properly
   - Utilize built-in bundler
   - Take advantage of native APIs

2. **Performance**

   - Use Bun's native APIs when possible
   - Leverage built-in bundler
   - Use TypeScript for better performance
   - Enable HTTP/2 for servers

3. **Development**

   - Use `bun --watch` for development
   - Leverage hot reloading
   - Use built-in test runner
   - Take advantage of TypeScript support

4. **Deployment**
   - Use production builds
   - Enable minification
   - Configure environment variables
   - Use Docker with Bun base image

## Common Issues and Solutions

### Node.js Compatibility

```typescript
// Use Node.js compatibility mode
process.version; // v18.0.0
process.versions.bun; // actual Bun version
```

### Package Resolution

```bash
# Force reinstall packages
bun install --force

# Clear package cache
bun pm cache rm
```

### TypeScript Setup

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "types": ["bun-types"],
  },
}
```

## Advanced Features

### WebSocket Server

```typescript
const server = Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // upgraded to WebSocket
    }
    return new Response('Upgrade failed', { status: 500 });
  },
  websocket: {
    message(ws, message) {
      ws.send(`Received: ${message}`);
    },
  },
});
```

### Environment Variables

```typescript
// Load .env file
const env = await Bun.file('.env').text();
Bun.env = { ...Bun.env, ...parse(env) };

// Access environment variables
const port = Bun.env.PORT || 3000;
```

### SQLite Integration

```typescript
import { Database } from 'bun:sqlite';

const db = new Database('mydb.sqlite');
const query = db.query('SELECT * FROM users WHERE id = $id');
const user = query.get({ $id: 1 });
```

### Hot Reloading

```typescript
// Enable hot reloading
const server = Bun.serve({
  development: true,
  fetch(req) {
    return new Response('Hello World!');
  },
});
```

More content coming soon...
