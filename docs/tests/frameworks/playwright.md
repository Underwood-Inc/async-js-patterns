---
title: Playwright Guide
description: Guide to using Playwright for end-to-end testing
---

# Playwright Guide

Playwright is a powerful testing framework by Microsoft that enables reliable end-to-end testing for modern web apps. It supports multiple browser engines including Chromium, Firefox, and WebKit.

## Key Features

- Cross-browser support
- Auto-wait capabilities
- Network interception
- Mobile device emulation
- Test parallelization
- Visual comparisons
- API testing support
- Codegen tool

## Getting Started

```bash
# Install Playwright
npm init playwright@latest
```

## Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('authentication flows', () => {
  test('successful login', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="username"]', 'testuser');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('.welcome')).toContainText('Welcome back');
  });
});
```

## Common Actions

```typescript
// Navigation
await page.goto('https://example.com');
await page.goBack();
await page.reload();

// Interactions
await page.click('button');
await page.fill('input', 'text');
await page.selectOption('select', 'option1');

// Assertions
await expect(page).toHaveTitle(/My Website/);
await expect(page.locator('.count')).toHaveText('5');
await expect(page.locator('button')).toBeEnabled();

// Network
await page.route('**/api/users', (route) => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ users: [] }),
  });
});

// Screenshots
await page.screenshot({ path: 'screenshot.png' });
```

## Test Configuration

```typescript
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
};

export default config;
```

More content coming soon...
