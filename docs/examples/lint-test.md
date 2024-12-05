---
title: Linting Test Examples
description: Explore linting test patterns and configurations. Learn about code quality checks and automated testing setups.
date: 2024-01-01
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

```typescript:preview
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

## JavaScript Example with Issues

```javascript:preview
// Using var and missing semicolons
var x = 10;
var y = 20;

function multiply(a, b) {
  console.log('Multiplying numbers');
  return a * b;
}

const result = multiply(x, y);
```

## Good TypeScript Example

```typescript:preview
// Properly formatted code
function add(a: number, b: number): number {
  const result = a + b;
  return result;
}

export const sum = add(1, 2);
```
