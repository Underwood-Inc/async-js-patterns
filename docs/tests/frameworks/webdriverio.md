---
title: WebdriverIO Guide
description: Guide to using WebdriverIO for modern web automation testing
---

# WebdriverIO Guide

WebdriverIO is a test automation framework that allows you to run tests with over 150 browser and mobile platforms. It's designed to be extendable, flexible, and feature-rich.

## Key Features

- Modern syntax and APIs
- Smart selectors
- Automatic wait strategies
- Mobile testing support
- Parallel test execution
- Real-time reporting
- Custom commands
- Service integration

## Getting Started

::: code-with-tooltips

```bash
# Create a new WebdriverIO project
npm init wdio@latest
```

:::

## Basic Test Structure

::: code-with-tooltips

```javascript
describe('My Login application', () => {
  beforeEach(async () => {
    await browser.url('/login');
  });

  it('should login with valid credentials', async () => {
    await $('#username').setValue('testuser');
    await $('#password').setValue('password123');
    await $('button[type="submit"]').click();

    await expect($('#flash')).toBeExisting();
    await expect($('#flash')).toHaveTextContaining('You logged into');
  });
});
```

:::

## Common Commands

::: code-with-tooltips

```javascript
// Navigation
await browser.url('https://example.com');
await browser.back();
await browser.refresh();

// Element interactions
const element = await $('button');
await element.click();
await element.setValue('some text');
await element.scrollIntoView();

// Assertions
await expect($('.title')).toBeDisplayed();
await expect($('.message')).toHaveText('Success');
await expect($('input')).toHaveValue('test');

// Waiting
await browser.waitUntil(
  async () => {
    const state = await $('.status').getText();
    return state === 'ready';
  },
  {
    timeout: 5000,
    timeoutMsg: 'Status not ready',
  }
);

// Screenshots
await browser.saveScreenshot('./screenshot.png');
```

:::

## Page Objects

::: code-with-tooltips

```javascript
class LoginPage {
  get username() {
    return $('#username');
  }
  get password() {
    return $('#password');
  }
  get submitButton() {
    return $('button[type="submit"]');
  }

  async login(username, password) {
    await this.username.setValue(username);
    await this.password.setValue(password);
    await this.submitButton.click();
  }

  async isLoggedIn() {
    const flash = await $('#flash');
    return flash.isDisplayed();
  }
}

export default new LoginPage();
```

:::

## Configuration Example

::: code-with-tooltips

```javascript
// wdio.conf.js
export const config = {
  specs: ['./test/specs/**/*.js'],
  maxInstances: 10,
  capabilities: [
    {
      browserName: 'chrome',
    },
  ],
  logLevel: 'info',
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
```

:::

## Core Concepts

### Configuration

::: code-with-tooltips

```javascript
// wdio.conf.js
export const config = {
  specs: ['./test/specs/**/*.js'],
  maxInstances: 10,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu'],
      },
    },
  ],
  logLevel: 'info',
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
```

:::

### Element Interactions

::: code-with-tooltips

```javascript
// Basic interactions
await $('#button').click();
await $('input').setValue('text');
await $('.element').scrollIntoView();

// Complex interactions
const elem = await $('.draggable');
await elem.dragAndDrop(await $('.target'));

// Multiple elements
const links = await $$('a');
for (const link of links) {
  console.log(await link.getText());
}
```

:::

### Selectors

::: code-with-tooltips

```javascript
// CSS selectors
await $('#id');
await $('.class');
await $('div.class');

// XPath
await $('//div[@class="example"]');

// Custom selectors
await $('~accessibility-id');
await $('android=UiSelector().text("text")');
await $('ios=predicate=name == "example"');
```

:::

## Advanced Features

### Page Objects

::: code-with-tooltips

```javascript
// pages/login.page.js
class LoginPage {
  get username() {
    return $('#username');
  }
  get password() {
    return $('#password');
  }
  get submit() {
    return $('button[type="submit"]');
  }

  async login(username, password) {
    await this.username.setValue(username);
    await this.password.setValue(password);
    await this.submit.click();
  }

  async getErrorMessage() {
    const error = await $('.error-message');
    return error.getText();
  }
}

export default new LoginPage();

// test/specs/login.spec.js
import LoginPage from '../pages/login.page.js';

describe('Login', () => {
  it('should login with valid credentials', async () => {
    await browser.url('/login');
    await LoginPage.login('user@example.com', 'password');
    await expect(browser).toHaveUrl('/dashboard');
  });
});
```

:::

### Custom Commands

::: code-with-tooltips

```javascript
// Custom browser command
browser.addCommand('getUrlAndTitle', async function () {
  return {
    url: await this.getUrl(),
    title: await this.getTitle(),
  };
});

// Custom element command
browser.addCommand(
  'waitAndClick',
  async function () {
    await this.waitForDisplayed();
    await this.click();
  },
  true
);

// Usage
const result = await browser.getUrlAndTitle();
await $('#button').waitAndClick();
```

:::

### Service Integration

::: code-with-tooltips

```javascript
// wdio.conf.js
import allure from '@wdio/allure-reporter';

export const config = {
  // ...
  services: [
    ['selenium-standalone'],
    ['devtools'],
    [
      'image-comparison',
      {
        baselineFolder: './tests/baseline',
        formatImageName: '{tag}-{width}x{height}',
        screenshotPath: './tests/screenshots',
      },
    ],
  ],
  reporters: [
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
};
```

:::

## Testing Patterns

### Visual Regression

::: code-with-tooltips

```javascript
describe('Visual regression', () => {
  it('should match homepage screenshot', async () => {
    await browser.url('/');

    // Compare full page
    await expect(await browser.checkFullPageScreen('homepage')).toEqual(0);

    // Compare element
    await expect(await browser.checkElement(await $('.logo'), 'logo')).toEqual(
      0
    );
  });
});
```

:::

### API Testing

::: code-with-tooltips

```javascript
describe('API integration', () => {
  it('should create user via API', async () => {
    const response = await browser.call(async () => {
      return fetch('https://api.example.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
        }),
      }).then((res) => res.json());
    });

    expect(response.id).toBeDefined();

    // Verify in UI
    await browser.url(`/users/${response.id}`);
    await expect($('.user-name')).toHaveText('Test User');
  });
});
```

:::

### Mobile Testing

::: code-with-tooltips

```javascript
describe('Mobile app', () => {
  it('should handle touch gestures', async () => {
    // Tap
    await $('~button').touchAction('tap');

    // Swipe
    const elem = await $('~slider');
    await elem.touchAction([
      { action: 'press', x: 200, y: 200 },
      { action: 'moveTo', x: 400, y: 200 },
      'release',
    ]);

    // Scroll
    await $('~content').touchAction([
      { action: 'press', x: 200, y: 500 },
      { action: 'wait', ms: 100 },
      { action: 'moveTo', x: 200, y: 100 },
      'release',
    ]);
  });
});
```

:::

## Performance Testing

### Metrics Collection

::: code-with-tooltips

```javascript
describe('Performance', () => {
  it('should measure page load metrics', async () => {
    // Enable performance monitoring
    await browser.enablePerformanceAudits();

    // Load page
    await browser.url('/');

    // Get metrics
    const metrics = await browser.getMetrics();
    expect(metrics.firstContentfulPaint).toBeLessThan(1000);

    // Get performance score
    const score = await browser.getPerformanceScore();
    expect(score).toBeGreaterThan(0.9);
  });
});
```

:::

### Network Interception

::: code-with-tooltips

```javascript
describe('Network', () => {
  it('should mock API responses', async () => {
    // Mock response
    await browser.mock('**/api/users', {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ id: 1, name: 'Mock User' }]),
    });

    // Mock error
    await browser.mock('**/api/error', {
      statusCode: 500,
      body: 'Server Error',
    });

    // Verify mocked response
    await browser.url('/users');
    await expect($('.user-name')).toHaveText('Mock User');
  });
});
```

:::

## Best Practices

### 1. Selectors

::: code-with-tooltips

```javascript
// ❌ Avoid
await $('button:nth-child(2)');
await $('div.btn-class');

// ✅ Prefer
await $('#submit-button');
await $('[data-testid="submit"]');
await $('~accessibility-id');
```

:::

### 2. Waits

::: code-with-tooltips

```javascript
// ❌ Avoid
await browser.pause(5000);

// ✅ Prefer
await $('#element').waitForDisplayed();
await $('#element').waitForClickable();
await expect($('#element')).toBePresent();
```

:::

### 3. Error Handling

::: code-with-tooltips

```javascript
describe('Error handling', () => {
  it('should handle test failures', async () => {
    try {
      await $('#non-existent').click();
    } catch (error) {
      // Take screenshot
      await browser.saveScreenshot(`./screenshots/error-${Date.now()}.png`);
      throw error;
    }
  });
});
```

:::

### 4. Test Organization

::: code-with-tooltips

```javascript
// hooks.js
export const config = {
  before: async () => {
    // Global setup
    await browser.setWindowSize(1920, 1080);
  },

  beforeEach: async () => {
    // Test setup
    await browser.deleteCookies();
    await browser.url('/');
  },

  afterEach: async function () {
    // Cleanup after each test
    if (this.currentTest.state === 'failed') {
      await browser.saveScreenshot(
        `./screenshots/${this.currentTest.title}.png`
      );
    }
  },
};
```

:::
