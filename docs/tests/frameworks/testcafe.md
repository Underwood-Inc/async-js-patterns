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

```bash
# Install TestCafe
npm install --save-dev testcafe
```

## Basic Test Structure

```typescript
import { Selector } from 'testcafe';

fixture`Getting Started`.page`https://example.com`;

test('My first test', async (t) => {
  const loginInput = Selector('#login');
  const passwordInput = Selector('#password');
  const submitButton = Selector('button[type=submit]');

  await t
    .typeText(loginInput, 'myLogin')
    .typeText(passwordInput, 'myPassword')
    .click(submitButton)
    .expect(Selector('.account').innerText)
    .contains('Welcome');
});
```

## Common Operations

```typescript
// Navigation
await t.navigateTo('https://example.com');

// Interactions
await t
  .click(Selector('button'))
  .doubleClick(Selector('.item'))
  .rightClick(Selector('.context-menu'))
  .hover(Selector('.dropdown'))
  .typeText(Selector('input'), 'Hello')
  .pressKey('tab')
  .drag(Selector('.item'), 200, 0);

// Assertions
await t
  .expect(Selector('.title').exists)
  .ok()
  .expect(Selector('.count').innerText)
  .eql('5')
  .expect(Selector('.button').hasClass('active'))
  .ok()
  .expect(Selector('.input').value)
  .contains('text');

// Taking screenshots
await t.takeScreenshot('my-screenshot.png');
await t.takeElementScreenshot(Selector('.component'), 'component.png');
```

## Page Object Model

```typescript
class LoginPage {
  emailInput: Selector;
  passwordInput: Selector;
  submitButton: Selector;
  errorMessage: Selector;

  constructor() {
    this.emailInput = Selector('#email');
    this.passwordInput = Selector('#password');
    this.submitButton = Selector('button[type="submit"]');
    this.errorMessage = Selector('.error-message');
  }

  async login(email: string, password: string) {
    await t
      .typeText(this.emailInput, email)
      .typeText(this.passwordInput, password)
      .click(this.submitButton);
  }

  async getErrorMessage() {
    return this.errorMessage.innerText;
  }
}

const loginPage = new LoginPage();

test('Login with invalid credentials', async (t) => {
  await loginPage.login('invalid@email.com', 'wrongpass');
  await t
    .expect(await loginPage.getErrorMessage())
    .contains('Invalid credentials');
});
```

## Configuration Example

```typescript
// .testcaferc.js
module.exports = {
  browsers: ['chrome', 'firefox'],
  src: 'tests/**/*.test.ts',
  screenshots: {
    path: 'screenshots/',
    takeOnFails: true,
    pathPattern: '${DATE}_${TIME}/${BROWSER}/${TEST}.png',
  },
  reporter: [
    'spec',
    {
      name: 'html',
      output: 'reports/report.html',
    },
  ],
  concurrency: 3,
  selectorTimeout: 3000,
  assertionTimeout: 1000,
  pageLoadTimeout: 1000,
  speed: 1,
};
```

More content coming soon...
