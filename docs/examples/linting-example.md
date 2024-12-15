---
title: Linting Examples
description: Master code linting practices and configurations. Learn about code style enforcement and quality control automation.
date: 2024-12-01
author: Underwood Inc
tags:
  - JavaScript
  - Linting
  - Code Quality
  - Style Guide
  - Examples
  - Best Practices
image: /web-patterns/images/linting-example-banner.png
---

# Linting Examples

This example shows some common TypeScript/JavaScript linting issues.

## Bad Code Example

::: code-with-tooltips

```typescript
// Example with linting issues
function badExample(x: any) {
  console.log('This uses double quotes');
  const unusedVar = 'this is never used';
  return x + 1;
}

const result = badExample(123);
```

:::

## Good Code Example

::: code-with-tooltips

```typescript
// Properly formatted code
function goodExample(x: number): number {
  // Proper logging with single quotes
  const result = x + 1;
  return result;
}

export const value = goodExample(123);
```

:::

## Common Issues

1. Extra spaces in function declarations
2. Using `any` type
3. Incorrect indentation
4. Double quotes instead of single quotes
5. Unused variables
6. Missing semicolons
7. Console.log usage
8. Inconsistent spacing around operators
