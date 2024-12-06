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

```bash:preview
# Install Puppeteer
npm install puppeteer
```

## Basic Test Structure

```javascript:preview
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

```javascript:preview
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

## Core Concepts

### Browser Setup

```javascript:preview
const puppeteer = require('puppeteer');

// Launch browser
const browser = await puppeteer.launch({
  headless: 'new',
  defaultViewport: { width: 1920, height: 1080 },
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

// Create new page
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

// Enable request interception
await page.setRequestInterception(true);
```

### Navigation

```javascript:preview
// Basic navigation
await page.goto('https://example.com', {
  waitUntil: 'networkidle0',
  timeout: 30000,
});

// Wait for navigation
await Promise.all([page.waitForNavigation(), page.click('a.link')]);

// History navigation
await page.goBack();
await page.goForward();
await page.reload();
```

### Element Selection

```javascript:preview
// Selectors
const button = await page.$('.button');
const buttons = await page.$$('.button');
const input = await page.$('#search');

// Evaluate in page context
const text = await page.$eval('.content', (el) => el.textContent);
const texts = await page.$$eval('.item', (els) =>
  els.map((el) => el.textContent)
);

// Wait for elements
await page.waitForSelector('.dynamic-content');
await page.waitForXPath('//button[contains(text(), "Submit")]');
```

## Advanced Features

### Page Interactions

```javascript:preview
// Mouse events
await page.mouse.move(100, 200);
await page.mouse.down();
await page.mouse.up();
await page.mouse.click(100, 200);

// Keyboard events
await page.keyboard.type('Hello World');
await page.keyboard.press('Enter');
await page.keyboard.down('Control');
await page.keyboard.press('A');
await page.keyboard.up('Control');

// File upload
const input = await page.$('input[type="file"]');
await input.uploadFile('path/to/file.jpg');
```

### Network Monitoring

```javascript:preview
// Monitor requests
page.on('request', (request) => {
  console.log(`Request: ${request.url()}`);
  request.continue();
});

// Monitor responses
page.on('response', (response) => {
  console.log(`Response: ${response.url()}: ${response.status()}`);
});

// Mock responses
page.on('request', (request) => {
  if (request.url().endsWith('/api/data')) {
    request.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: 'mocked' }),
    });
  } else {
    request.continue();
  }
});
```

### JavaScript Execution

```javascript:preview
// Execute in page context
const dimensions = await page.evaluate(() => {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    devicePixelRatio: window.devicePixelRatio,
  };
});

// Expose function to page
await page.exposeFunction('md5', (text) =>
  crypto.createHash('md5').update(text).digest('hex')
);

// Add script tag
await page.addScriptTag({
  url: 'https://code.jquery.com/jquery-3.6.0.min.js',
});
```

## Testing Patterns

### Screenshot Capture

```javascript:preview
// Full page screenshot
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true,
});

// Element screenshot
const element = await page.$('.card');
await element.screenshot({
  path: 'element.png',
});

// PDF generation
await page.pdf({
  path: 'page.pdf',
  format: 'A4',
  printBackground: true,
});
```

### Performance Monitoring

```javascript:preview
// Enable CPU and memory profiling
const client = await page.target().createCDPSession();
await client.send('Performance.enable');
```

## Advanced Testing

### Mobile Emulation

```javascript:preview
// Emulate device
const iPhone = puppeteer.devices['iPhone 12'];
await page.emulate(iPhone);

// Set geolocation
await page.setGeolocation({
  latitude: 51.5074,
  longitude: -0.1278,
});

// Emulate network conditions
await page.emulateNetworkConditions({
  offline: false,
  latency: 100,
  download: (1000 * 1024) / 8,
  upload: (500 * 1024) / 8,
});
```

### Visual Testing

```javascript:preview
const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

describe('Visual regression', () => {
  it('should match screenshot', async () => {
    await page.goto('/');

    // Compare full page
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();

    // Compare element
    const logo = await page.$('.logo');
    const logoImage = await logo.screenshot();
    expect(logoImage).toMatchImageSnapshot({
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
    });
  });
});
```

### API Testing

```javascript:preview
describe('API integration', () => {
  it('should intercept API calls', async () => {
    // Mock API response
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('/api')) {
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      } else {
        request.continue();
      }
    });

    // Verify UI updates
    await page.goto('/');
    await page.waitForSelector('.success-message');
  });
});
```

## Best Practices

### 1. Element Selection

```javascript:preview
// ❌ Avoid
await page.$('.button:nth-child(2)');
await page.$('div.btn');

// ✅ Prefer
await page.$('[data-testid="submit"]');
await page.$('#login-button');
await page.$('button[aria-label="Submit"]');
```

### 2. Waiting Strategies

```javascript:preview
// ❌ Avoid
await page.waitFor(5000);

// ✅ Prefer
await page.waitForSelector('.content');
await page.waitForFunction(
  'document.querySelector(".dynamic").textContent.includes("loaded")'
);
await page.waitForNavigation({
  waitUntil: 'networkidle0',
});
```

### 3. Error Handling

```javascript:preview
try {
  await page.click('.non-existent');
} catch (error) {
  // Take screenshot
  await page.screenshot({
    path: `error-${Date.now()}.png`,
  });

  // Log error details
  console.error({
    message: error.message,
    stack: error.stack,
    url: page.url(),
  });

  throw error;
}
```

### 4. Resource Management

```javascript:preview
let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultTimeout(10000);
  await page.setDefaultNavigationTimeout(20000);
});

afterEach(async () => {
  await page.close();
});

afterAll(async () => {
  await browser.close();
});
```
