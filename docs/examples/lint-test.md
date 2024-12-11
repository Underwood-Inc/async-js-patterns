---
title: Linting Test Examples
description: Explore linting test patterns and configurations. Learn about code quality checks and automated testing setups.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Linting
  - Testing
  - Code Quality
  - Examples
  - Best Practices
image: /web-patterns/images/lint-test-banner.png
---

# Linting Test Examples

## TypeScript Example with Issues

::: code-with-tooltips

```typescript
// Extra spaces and missing types
function add(a, b) {
  console.log('Adding numbers');
  const unused = 'this is never used';
  return a + b;
}

const result = add(1, 2);

// Using any type
function processData(data: any) {
  const items = data.map((item) => item * 2);
  return items;
}
```

:::

## JavaScript Example with Issues

::: code-with-tooltips

```javascript
// Using var and missing semicolons
var x = 10;
var y = 20;

function multiply(a, b) {
  console.log('Multiplying numbers');
  return a * b;
}

const result = multiply(x, y);
```

:::

## Good TypeScript Example

::: code-with-tooltips

```typescript
// Properly formatted code
function add(a: number, b: number): number {
  const result = a + b;
  return result;
}

export const sum = add(1, 2);
```

:::
