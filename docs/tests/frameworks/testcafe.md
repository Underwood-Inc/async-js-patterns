---
title: TestCafe Guide
description: Guide to using TestCafe for end-to-end web testing
---

# TestCafe Guide

TestCafe is a Node.js tool to automate end-to-end web testing. It's easy to set up, works on all popular environments, and provides powerful features for testing modern web apps.

## Key Features

- No WebDriver or other testing software required
- Cross-browser support
- Concurrent test execution
- Built-in waiting mechanism
- Page object model support
- Mobile device testing
- Smart assertion query mechanism
- Stable tests

## Getting Started

```bash:preview
# Install TestCafe
npm install --save-dev testcafe
```

## Core Concepts

### Test Structure

```typescript:preview
import { Selector, t } from 'testcafe';

fixture('Example Tests')
  .page('https://example.com')
  .beforeEach(async (t) => {
    await t.maximizeWindow();
  });

test('Basic test', async (t) => {
  await t
    .typeText('#email', 'user@example.com')
    .typeText('#password', 'password')
    .click('#submit')
    .expect(Selector('.welcome').exists)
    .ok();
});
```

### Selectors

```typescript:preview
// Basic selectors
const button = Selector('button');
const input = Selector('#email');
const link = Selector('a').withText('Click me');

// Chaining selectors
const listItem = Selector('ul')
  .child('li')
  .nth(2)
  .withAttribute('data-test', 'item');

// Custom selectors
const customSelector = Selector(() => {
  return document.querySelector('.dynamic-class');
});

// React selectors
const reactComponent = Selector('MyComponent').withProps({ active: true });
```

### Actions

```typescript:preview
// Mouse actions
await t
  .click(button)
  .doubleClick(button)
  .rightClick(button)
  .hover(button)
  .drag(element, 200, 0)
  .dragToElement(element, target);

// Keyboard actions
await t
  .pressKey('tab space')
  .pressKey('ctrl+a delete')
  .typeText(input, 'Hello')
  .selectText(input)
  .selectTextAreaContent(textarea);
```

## Advanced Features

### Page Model Pattern

```typescript:preview
class LoginPage {
  private email = Selector('#email');
  private password = Selector('#password');
  private submitButton = Selector('button[type="submit"]');
  private errorMessage = Selector('.error-message');

  constructor() {
    this.email = Selector('#email');
  }

  async login(email: string, password: string) {
    await t
      .typeText(this.email, email)
      .typeText(this.password, password)
      .click(this.submitButton);
  }

  async getErrorMessage() {
    return this.errorMessage.innerText;
  }
}

// Usage
const loginPage = new LoginPage();

test('Login test', async (t) => {
  await loginPage.login('user@example.com', 'password');
  await t.expect(Selector('.dashboard').exists).ok();
});
```

### Request Hooks

```typescript:preview
import { RequestHook, RequestLogger, RequestMock } from 'testcafe';

// Logger
const logger = RequestLogger(/api\/users/, {
  logRequestBody: true,
  logResponseBody: true,
});

// Mock
const mock = RequestMock()
  .onRequestTo(/api\/data/)
  .respond({ data: 'mocked' }, 200, {
    'Content-Type': 'application/json',
  });

// Custom hook
class AuthHook extends RequestHook {
  constructor() {
    super(/api/);
  }

  async onRequest(e) {
    e.requestOptions.headers['Authorization'] = 'Bearer token';
  }

  async onResponse(e) {
    // Handle response
  }
}

fixture('API Tests')
  .page('https://example.com')
  .requestHooks(logger, mock, new AuthHook());
```

### Client Scripts

```typescript:preview
// Inject script
fixture('Client Scripts').page('https://example.com').clientScripts({
  path: './scripts/helper.js',
  module: true,
});

// Inline script
test('with client script', async (t) => {
  await t.eval(() => {
    window.localStorage.setItem('key', 'value');
  });

  const result = await t.eval(() => {
    return document.title;
  });
});
```

## Testing Patterns

### Visual Testing

```typescript:preview
import { takeSnapshot } from 'testcafe-blink-diff';

fixture('Visual Tests').page('https://example.com');

test('visual regression', async (t) => {
  // Full page snapshot
  await takeSnapshot(t, {
    name: 'homepage',
    fullPage: true,
  });

  // Element snapshot
  const element = Selector('.card');
  await takeSnapshot(t, {
    name: 'card',
    element,
  });
});
```

### Mobile Testing

```typescript:preview
fixture('Mobile Tests')
  .page('https://example.com')
  .beforeEach(async (t) => {
    await t.resizeWindow(375, 812); // iPhone X
  });

test('mobile layout', async (t) => {
  // Touch actions
  await t
    .tap(Selector('.button'))
    .doubleTap(Selector('.zoom'))
    .hover(Selector('.menu'));

  // Orientation
  await t.resizeWindowToFitDevice('iphonex', {
    portraitOrientation: true,
  });
});
```

### API Testing

```typescript:preview
import { RequestLogger } from 'testcafe';

const logger = RequestLogger();

fixture('API Integration').page('https://example.com').requestHooks(logger);

test('API calls', async (t) => {
  // Trigger API call
  await t.click('.load-data');
});
```

## Best Practices

### 1. Selector Best Practices

```typescript:preview
// ❌ Avoid
const button = Selector('button').nth(2);
const div = Selector('div.btn');

// ✅ Prefer
const button = Selector('[data-testid="submit"]');
const input = Selector('input').withAttribute('name', 'email');
const heading = Selector('h1').withText('Welcome');
```

### 2. Waiting Strategies

```typescript:preview
// ❌ Avoid
await t.wait(5000);

// ✅ Prefer
await t
  .expect(Selector('.loader').exists)
  .notOk()
  .expect(Selector('.content').exists)
  .ok()
  .expect(Selector('.data').innerText)
  .contains('Loaded');
```

### 3. Error Handling

```typescript:preview
test('with error handling', async (t) => {
  try {
    await t.click('.non-existent');
  } catch (error) {
    // Take screenshot
    await t.takeScreenshot({
      path: `error-${Date.now()}.png`,
      fullPage: true,
    });

    throw error;
  }
});
```

### 4. Test Organization

```typescript:preview
// roles.ts
import { Role } from 'testcafe';

export const adminRole = Role('https://example.com/login', async (t) => {
  await t
    .typeText('#email', 'admin@example.com')
    .typeText('#password', 'admin123')
    .click('#submit');
});

// hooks.ts
export const globalHooks = {
  beforeEach: async (t) => {
    await t.maximizeWindow().setTestSpeed(0.8).setPageLoadTimeout(30000);
  },

  afterEach: async (t) => {
    if (await Selector('.error').exists) {
      await t.takeScreenshot();
    }
  },
};

// test.ts
import { adminRole } from './roles';
import { globalHooks } from './hooks';

fixture('Admin Tests')
  .page('https://example.com')
  .beforeEach(globalHooks.beforeEach)
  .afterEach(globalHooks.afterEach);

test('admin functionality', async (t) => {
  await t.useRole(adminRole).expect(Selector('.admin-panel').exists).ok();
});
```

### 5. Configuration

```typescript:preview
// .testcaferc.json
{
    "browsers": ["chrome:headless", "firefox"],
    "src": "tests/**/*.ts",
    "screenshots": {
        "path": "screenshots/",
        "takeOnFails": true,
        "fullPage": true
    },
    "reporter": {
        "name": "spec",
        "output": "reports/report.html"
    },
    "concurrency": 3,
    "selectorTimeout": 10000,
    "assertionTimeout": 5000,
    "pageLoadTimeout": 30000
}
```
