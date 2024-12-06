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

```bash:preview
# Install Playwright
npm init playwright@latest
```

## Basic Test Structure

```typescript:preview
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

```typescript:preview
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

```typescript:preview
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

## Advanced Features

### API Testing

```typescript:preview
test('API endpoints', async ({ request }) => {
  // GET request
  const response = await request.get('/api/users');
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toEqual(
    expect.arrayContaining([expect.objectContaining({ name: 'John' })])
  );

  // POST request with body
  const createResponse = await request.post('/api/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });
  expect(createResponse.status()).toBe(201);
});
```

### Network Interception

```typescript:preview
test('mock API calls', async ({ page }) => {
  // Mock response
  await page.route('/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 1, name: 'Mock User' }]),
    });
  });

  // Mock error response
  await page.route('/api/error', (route) =>
    route.fulfill({
      status: 500,
      body: 'Server Error',
    })
  );

  // Modify request
  await page.route('/api/data', async (route) => {
    const request = route.request();
    const postData = request.postData();
    await route.continue({
      postData: postData?.replace('old', 'new'),
    });
  });
});
```

### Visual Comparison

```typescript:preview
test('visual regression', async ({ page }) => {
  await page.goto('/dashboard');

  // Full page screenshot
  expect(await page.screenshot()).toMatchSnapshot('dashboard.png');

  // Element screenshot
  const logo = page.locator('.logo');
  expect(await logo.screenshot()).toMatchSnapshot('logo.png');

  // With options
  expect(
    await page.screenshot({
      fullPage: true,
      mask: [page.locator('.dynamic-content')],
    })
  ).toMatchSnapshot('masked-page.png');
});
```

## Testing Patterns

### Page Objects

```typescript:preview
// models/LoginPage.ts
class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async getErrorMessage() {
    return this.page.textContent('.error-message');
  }
}

// tests/login.spec.ts
test('successful login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

### Component Testing

```typescript:preview
test('button component', async ({ mount }) => {
  const component = await mount(
    <Button onClick={() => console.log('clicked')}>
      Click me
    </Button>
  )

  await expect(component).toContainText('Click me')
  await component.click()
  await expect(component).toHaveClass(/active/)
})
```

## Mobile Testing

### Device Emulation

```typescript:preview
test('mobile viewport', async ({ browser }) => {
  const pixel5 = playwright.devices['Pixel 5'];
  const context = await browser.newContext({
    ...pixel5,
    locale: 'en-US',
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    permissions: ['geolocation'],
  });
  const page = await context.newPage();

  await page.goto('/mobile');
  await expect(page.locator('.mobile-menu')).toBeVisible();
});
```

### Touch Interactions

```typescript:preview
test('touch gestures', async ({ page }) => {
  // Tap
  await page.tap('.button');

  // Double tap
  await page.dblclick('.zoom-area');

  // Swipe
  await page.locator('.slider').dragTo(page.locator('.target'), {
    sourcePosition: { x: 0, y: 0 },
    targetPosition: { x: 100, y: 0 },
  });
});
```

## Performance Testing

### Metrics Collection

```typescript:preview
test('performance metrics', async ({ page }) => {
  // Enable performance monitoring
  await page.coverage.startJSCoverage();

  const startTime = Date.now();
  await page.goto('/');

  // Get metrics
  const metrics = await page.metrics();
  const timing = await page.evaluate(() =>
    JSON.stringify(window.performance.timing)
  );
  const jsCoverage = await page.coverage.stopJSCoverage();

  // Assertions
  expect(Date.now() - startTime).toBeLessThan(3000);
  expect(metrics.TaskDuration).toBeLessThan(100);
  expect(jsCoverage[0].unusedBytes).toBeLessThan(1024);
});
```

### Resource Monitoring

```typescript:preview
test('resource loading', async ({ page }) => {
  const [request] = await Promise.all([
    page.waitForRequest('**/*.js'),
    page.goto('/'),
  ]);

  const responses = await Promise.all([
    page.waitForResponse('**/*.css'),
    page.click('.load-more'),
  ]);

  expect(request.resourceType()).toBe('script');
  expect(responses[0].status()).toBe(200);
});
```

## Debugging

### Trace Viewer

```typescript:preview
test('record trace', async ({ page }) => {
  // Start tracing
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
  });

  await page.goto('/');
  await page.click('.button');

  // Stop and save trace
  await context.tracing.stop({
    path: 'trace.zip',
  });
});
```

### Debug Mode

```typescript:preview
test('debug test', async ({ page }) => {
  // Launch debugger
  await page.pause();

  // Console output
  page.on('console', (msg) => console.log(msg.text()));

  // Screenshot on failure
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `failure-${testInfo.title}.png` });
    }
  });
});
```

## Best Practices

### 1. Selectors

```typescript:preview
// ❌ Avoid
page.click('.submit-button');
page.fill('#email', 'user@example.com');

// ✅ Prefer
page.getByRole('button', { name: 'Submit' });
page.getByLabel('Email');
page.getByTestId('submit-form');
```

### 2. Waiting

```typescript:preview
// ❌ Avoid
await page.waitForTimeout(1000);

// ✅ Prefer
await expect(page.getByText('Loading')).toBeHidden();
await expect(page.getByRole('alert')).toBeVisible();
await page.waitForResponse('**/api/data');
```

### 3. Assertions

```typescript:preview
// State assertions
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByRole('textbox')).toHaveValue('text');
await expect(page.getByRole('heading')).toContainText('Welcome');

// Multiple assertions
await expect(async () => {
  const count = await page.getByTestId('item').count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(10);
}).toPass();
```

### 4. Error Handling

```typescript:preview
test.beforeEach(async ({ page }) => {
  page.on('pageerror', (exception) => {
    console.error(`Page error: ${exception.message}`);
  });

  page.on('requestfailed', (request) => {
    console.error(`Failed request: ${request.url()}`);
  });
});
```
