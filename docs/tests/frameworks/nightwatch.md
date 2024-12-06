---
title: Nightwatch Guide
description: Guide to using Nightwatch.js for automated end-to-end testing
---

# Nightwatch Guide

Nightwatch.js is an integrated framework for automated testing of web applications and websites using Node.js. It provides a complete end-to-end testing solution.

## Key Features

- End-to-end testing framework
- Built-in test runner
- Selenium WebDriver integration
- Page Object Model support
- CSS/Xpath selectors
- Cloud testing integration
- Parallel test execution
- Visual regression testing

## Getting Started

```bash
# Install Nightwatch
npm install nightwatch

# Install browser drivers
npm install chromedriver geckodriver
```

## Basic Test Structure

```javascript
describe('Google Demo Test', () => {
  before((browser) => {
    browser.url('https://www.google.com');
  });

  test('search for nightwatch', (browser) => {
    browser
      .waitForElementVisible('body')
      .setValue('input[name=q]', 'nightwatch')
      .click('input[name=btnK]')
      .assert.containsText('#main', 'Nightwatch.js');
  });

  after((browser) => browser.end());
});
```

## Common Commands

```javascript
// Navigation
browser.url('https://example.com');
browser.back();
browser.refresh();

// Element interactions
browser
  .click('#submit')
  .setValue('input[type=text]', 'hello')
  .clearValue('input[type=text]')
  .moveToElement('#menu', 10, 10);

// Assertions
browser.assert
  .visible('#main')
  .assert.containsText('#welcome', 'Hello')
  .assert.valueContains('input', 'text')
  .assert.title('Page Title');

// Waiting
browser
  .waitForElementVisible('#element')
  .waitForElementPresent('#element')
  .waitForElementNotVisible('#loading')
  .pause(1000);
```

## Page Objects

```javascript
module.exports = {
  url: 'https://example.com/login',
  elements: {
    emailInput: {
      selector: 'input[type=email]',
    },
    passwordInput: {
      selector: 'input[type=password]',
    },
    submitButton: {
      selector: 'button[type=submit]',
    },
    errorMessage: {
      selector: '.error-message',
    },
  },
  commands: [
    {
      login(email, password) {
        return this.setValue('@emailInput', email)
          .setValue('@passwordInput', password)
          .click('@submitButton');
      },
      assertErrorMessage(message) {
        return this.assert
          .visible('@errorMessage')
          .assert.containsText('@errorMessage', message);
      },
    },
  ],
};

// Using the page object
test('invalid login shows error', (browser) => {
  const loginPage = browser.page.login();

  loginPage
    .navigate()
    .login('invalid@email.com', 'wrongpass')
    .assertErrorMessage('Invalid credentials');
});
```

## Configuration Example

```javascript
// nightwatch.conf.js
module.exports = {
  src_folders: ['tests'],
  page_objects_path: ['page-objects'],

  webdriver: {
    start_process: true,
    server_path: require('chromedriver').path,
    port: 9515,
  },

  test_settings: {
    default: {
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'tests_output/screenshots',
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless'],
        },
      },
    },

    firefox: {
      webdriver: {
        server_path: require('geckodriver').path,
        port: 4444,
      },
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          acceptInsecureCerts: true,
        },
      },
    },
  },
};
```

More content coming soon...
