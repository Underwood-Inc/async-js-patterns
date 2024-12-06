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

```bash
# Create a new WebdriverIO project
npm init wdio@latest
```

## Basic Test Structure

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

## Common Commands

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

## Page Objects

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

## Configuration Example

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

More content coming soon...
