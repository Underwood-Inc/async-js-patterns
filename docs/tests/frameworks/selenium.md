---
title: Selenium Guide
description: Guide to using Selenium WebDriver for browser automation and testing
---

# Selenium Guide

Selenium WebDriver is a widely-used tool for browser automation that enables you to control browser behavior programmatically and run automated tests across different browsers.

## Key Features

- Multi-browser support
- Multiple programming language bindings
- Extensive browser manipulation capabilities
- Support for complex user interactions
- Headless browser testing
- Screenshot capture
- Page object model support
- Wait strategies

## Getting Started

```bash
# Install Selenium WebDriver for Node.js
npm install selenium-webdriver

# Install browser drivers
npm install chromedriver geckodriver
```

## Basic Test Structure

```javascript
const { Builder, By, Key, until } = require('selenium-webdriver');

describe('Search functionality', function () {
  let driver;

  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterEach(async function () {
    await driver.quit();
  });

  it('should search and find results', async function () {
    await driver.get('https://example.com');

    await driver.findElement(By.name('q')).sendKeys('selenium', Key.RETURN);

    await driver.wait(until.elementLocated(By.css('.results')));
    const results = await driver.findElements(By.css('.result-item'));

    expect(results.length).toBeGreaterThan(0);
  });
});
```

## Common Operations

```javascript
// Navigation
await driver.get('https://example.com');
await driver.navigate().back();
await driver.navigate().refresh();

// Finding elements
const element = await driver.findElement(By.id('search'));
const elements = await driver.findElements(By.css('.item'));
const link = await driver.findElement(By.linkText('Click here'));

// Interactions
await element.click();
await element.sendKeys('text to type');
await element.clear();
await element.submit();

// Waits
await driver.wait(until.elementLocated(By.id('results')), 5000);
await driver.wait(until.elementIsVisible(element), 5000);
await driver.wait(until.titleIs('Page Title'), 5000);

// JavaScript execution
await driver.executeScript('return document.title;');
await driver.executeAsyncScript('window.setTimeout(arguments[0], 500);');
```

## Page Object Model Example

```javascript
class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.usernameInput = By.id('username');
    this.passwordInput = By.id('password');
    this.loginButton = By.css('button[type="submit"]');
  }

  async login(username, password) {
    await this.driver.findElement(this.usernameInput).sendKeys(username);
    await this.driver.findElement(this.passwordInput).sendKeys(password);
    await this.driver.findElement(this.loginButton).click();

    await this.driver.wait(
      until.urlContains('/dashboard'),
      5000,
      'Dashboard page did not load'
    );
  }
}
```

More content coming soon...
