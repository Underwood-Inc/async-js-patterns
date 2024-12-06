---
title: Puppeteer Guide
description: Guide to using Puppeteer for headless Chrome automation and testing
---

# Puppeteer Guide

Puppeteer is a Node.js library that provides a high-level API to control Chrome/Chromium over the DevTools Protocol. It's particularly useful for automated testing, web scraping, and generating screenshots/PDFs.

## Key Features

- Chrome DevTools Protocol support
- Headless browser automation
- Network interception
- Performance monitoring
- PDF generation
- Screenshot capture
- Keyboard/mouse simulation
- Mobile device emulation

## Getting Started

```bash
# Install Puppeteer
npm install puppeteer
```

## Basic Test Structure

```javascript
const puppeteer = require('puppeteer');

describe('Homepage', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('https://example.com');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('title should be correct', async () => {
    const title = await page.title();
    expect(title).toBe('Example Domain');
  });
});
```

## Common Operations

```javascript
// Navigation
await page.goto('https://example.com');
await page.goBack();
await page.reload();

// Selectors and interactions
await page.click('button');
await page.type('input[name="search"]', 'query');
await page.select('select#options', 'value');

// Waiting
await page.waitForSelector('.element');
await page.waitForNavigation();
await page.waitForFunction(() => document.readyState === 'complete');

// Network
await page.setRequestInterception(true);
page.on('request', (request) => {
  if (request.resourceType() === 'image') request.abort();
  else request.continue();
});

// Screenshots and PDF
await page.screenshot({ path: 'screenshot.png' });
await page.pdf({ path: 'page.pdf', format: 'A4' });
```

## Advanced Features

```javascript
// Mobile emulation
await page.emulate(puppeteer.devices['iPhone X']);

// Performance metrics
const metrics = await page.metrics();
const performance = await page.evaluate(() => performance.toJSON());

// Coverage
await Promise.all([
  page.coverage.startJSCoverage(),
  page.coverage.startCSSCoverage(),
]);
await page.goto('https://example.com');
const [jsCoverage, cssCoverage] = await Promise.all([
  page.coverage.stopJSCoverage(),
  page.coverage.stopCSSCoverage(),
]);

// Accessibility
const snapshot = await page.accessibility.snapshot();

// Tracing
await page.tracing.start({ path: 'trace.json' });
await page.goto('https://example.com');
await page.tracing.stop();
```

## Helper Functions Example

```javascript
async function waitForText(page, selector, text) {
  await page.waitForFunction(
    (selector, text) => {
      const element = document.querySelector(selector);
      return element && element.textContent.includes(text);
    },
    {},
    selector,
    text
  );
}

async function getElementText(page, selector) {
  return page.$eval(selector, (el) => el.textContent);
}

async function fillForm(page, formData) {
  for (const [selector, value] of Object.entries(formData)) {
    await page.type(selector, value);
  }
}
```

More content coming soon...
