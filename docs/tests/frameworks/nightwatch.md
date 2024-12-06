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

```bash:preview
# Install Nightwatch
npm install nightwatch

# Install browser drivers
npm install chromedriver geckodriver
```

## Core Concepts

### Configuration

```javascript:preview
// nightwatch.conf.js
module.exports = {
  src_folders: ['tests'],
  webdriver: {
    start_process: true,
    server_path: require('chromedriver').path,
    port: 9515,
  },
  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless', '--no-sandbox'],
        },
      },
    },
  },
};
```

### Basic Test Structure

```javascript:preview
module.exports = {
  'Basic test': (browser) => {
    browser
      .url('https://example.com')
      .waitForElementVisible('body')
      .assert.titleContains('Example')
      .end();
  },
};
```

### Element Commands

```javascript:preview
module.exports = {
  'Element interactions': (browser) => {
    // Basic interactions
    browser
      .click('#button')
      .setValue('input[type=text]', 'Hello')
      .clearValue('input[type=text]')
      .submitForm('#form');

    // Complex interactions
    browser
      .moveToElement('#menu', 10, 10)
      .mouseButtonClick('left')
      .doubleClick('#item')
      .dragAndDrop('#source', '#target');
  },
};
```

## Advanced Features

### Page Objects

```javascript:preview
// pages/login.js
const commands = {
  login(email, password) {
    return this.setValue('@email', email)
      .setValue('@password', password)
      .click('@submit');
  },

  assertError() {
    return this.assert.visible('@errorMessage');
  },
};

module.exports = {
  url: '/login',
  commands: [commands],
  elements: {
    email: {
      selector: '#email',
    },
    password: {
      selector: '#password',
    },
    submit: {
      selector: 'button[type=submit]',
    },
    errorMessage: {
      selector: '.error-message',
    },
  },
};

// tests/login.js
module.exports = {
  'Login test': (browser) => {
    const login = browser.page.login();

    login
      .navigate()
      .login('user@example.com', 'password')
      .assert.urlContains('/dashboard');
  },
};
```

### Custom Commands

```javascript:preview
// commands/customWait.js
module.exports = class CustomWait {
  async command(selector, callback) {
    await this.api.waitForElementVisible(selector);
    if (callback) {
      callback.call(this);
    }
    return this;
  }
};

// Usage
module.exports = {
  'Custom command test': (browser) => {
    browser.customWait('#element', function () {
      console.log('Element is visible');
    });
  },
};
```

### Assertions

```javascript:preview
module.exports = {
  'Assertion examples': (browser) => {
    // Element assertions
    browser.assert
      .visible('#element')
      .assert.elementPresent('.item')
      .assert.containsText('#message', 'Success')
      .assert.attributeContains('#link', 'href', 'example.com')
      .assert.cssProperty('#button', 'color', 'rgb(255, 0, 0)');

    // Value assertions
    browser.assert
      .value('input[type=text]', 'Expected value')
      .assert.valueContains('input[type=text]', 'partial')
      .assert.urlContains('/dashboard')
      .assert.title('Dashboard');

    // Custom assertions
    browser.expect.element('#count').text.to.equal('5');
    browser.expect.element('#status').to.be.enabled;
    browser.expect.element('#form').to.be.an('form');
  },
};
```

## Testing Patterns

### Visual Regression

```javascript:preview
module.exports = {
  'Visual regression': (browser) => {
    browser.saveScreenshot('tests/screenshots/baseline.png');

    // Compare with baseline
    browser.assert.screenshotEquals(
      'tests/screenshots/baseline.png',
      'tests/screenshots/current.png',
      'Homepage should match baseline'
    );

    // Element screenshot
    browser.saveElementScreenshot('#component', 'component.png');
  },
};
```

### API Testing

```javascript:preview
const axios = require('axios');

module.exports = {
  'API integration': async (browser) => {
    // Create test data
    const response = await axios.post('https://api.example.com/users', {
      name: 'Test User',
      email: 'test@example.com',
    });

    // Verify in UI
    browser
      .url(`/users/${response.data.id}`)
      .waitForElementVisible('.user-profile')
      .assert.containsText('.user-name', 'Test User');

    // Cleanup
    await axios.delete(`https://api.example.com/users/${response.data.id}`);
  },
};
```

### Mobile Testing

```javascript:preview
module.exports = {
  'Mobile tests': (browser) => {
    // Set mobile viewport
    browser.resizeWindow(375, 812);

    // Touch actions
    browser
      .touchMove('#slider', 100, 0)
      .touchDown('#button')
      .touchUp('#button');
  },
};
```

## Best Practices

### 1. Element Selection

```javascript:preview
module.exports = {
  'Selector best practices': (browser) => {
    // ❌ Avoid
    browser.click('button:nth-child(2)');
    browser.click('div.btn-class');

    // ✅ Prefer
    browser.click('[data-testid="submit"]');
    browser.click('#login-button');
    browser.click('button[aria-label="Submit"]');
  },
};
```

### 2. Waiting Strategies

```javascript:preview
module.exports = {
  'Wait strategies': (browser) => {
    // ❌ Avoid
    browser.pause(5000);

    // ✅ Prefer
    browser
      .waitForElementVisible('#element')
      .waitForElementNotPresent('.loader')
      .waitUntil(() => {
        return browser.expect.element('#status').text.to.contain('Ready');
      });
  },
};
```

### 3. Error Handling

```javascript:preview
module.exports = {
  beforeEach: (browser) => {
    browser.windowMaximize();
  },

  afterEach: (browser, done) => {
    if (browser.currentTest.results.failed > 0) {
      browser
        .saveScreenshot(`tests/screenshots/error-${Date.now()}.png`)
        .end(done);
    } else {
      browser.end(done);
    }
  },

  'Error handling': (browser) => {
    try {
      browser.click('#non-existent');
    } catch (error) {
      console.error('Test failed:', error);
      browser.saveScreenshot('error.png');
      throw error;
    }
  },
};
```

### 4. Test Organization

```javascript:preview
// globals.js
module.exports = {
  beforeEach: (browser) => {
    browser.windowMaximize().deleteCookies().url('https://example.com');
  },

  afterEach: (browser) => {
    browser.end();
  },
};

// test-groups/admin.js
module.exports = {
  '@tags': ['admin', 'smoke'],

  before: (browser) => {
    // Admin setup
    browser.page.login().login('admin@example.com', 'admin123');
  },

  'Admin dashboard': (browser) => {
    browser.assert
      .visible('#admin-panel')
      .assert.containsText('#user-count', '5');
  },
};
```

### 5. Configuration Best Practices

```javascript:preview
// nightwatch.conf.js
const chromedriver = require('chromedriver');
const geckodriver = require('geckodriver');

module.exports = {
  src_folders: ['tests'],
  page_objects_path: ['pages'],
  custom_commands_path: ['commands'],
  custom_assertions_path: ['assertions'],
  globals_path: 'globals.js',

  webdriver: {
    start_process: true,
    server_path: chromedriver.path,
    port: 9515,
  },

  test_settings: {
    default: {
      screenshots: {
        enabled: true,
        on_failure: true,
        path: 'tests/screenshots',
      },
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless'],
        },
        javascriptEnabled: true,
        acceptSslCerts: true,
      },
    },

    firefox: {
      webdriver: {
        server_path: geckodriver.path,
        port: 4444,
      },
      desiredCapabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: ['-headless'],
        },
      },
    },
  },
};
```
