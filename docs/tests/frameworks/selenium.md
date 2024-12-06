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

```bash:preview
# Install Selenium WebDriver for Node.js
npm install selenium-webdriver

# Install browser drivers
npm install chromedriver geckodriver
```

## Basic Test Structure

```javascript:preview
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

```javascript:preview
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

```javascript:preview
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

## Core Concepts

### WebDriver Setup

```python:preview
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

# Configure Chrome options
chrome_options = Options()
chrome_options.add_argument('--headless')  # Run in headless mode
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

# Initialize WebDriver
service = Service('path/to/chromedriver')
driver = webdriver.Chrome(service=service, options=chrome_options)

# Set implicit wait time
driver.implicitly_wait(10)
```

### Element Location

```python:preview
from selenium.webdriver.common.by import By

# Different locator strategies
driver.find_element(By.ID, 'search')
driver.find_element(By.NAME, 'q')
driver.find_element(By.CLASS_NAME, 'search-input')
driver.find_element(By.CSS_SELECTOR, '#search-form input')
driver.find_element(By.XPATH, "//input[@type='search']")

# Find multiple elements
elements = driver.find_elements(By.TAG_NAME, 'a')
```

### Interactions

```python:preview
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

# Basic interactions
element.click()
element.send_keys('text')
element.clear()
element.submit()

# Complex interactions
actions = ActionChains(driver)
actions.move_to_element(element)
actions.click_and_hold()
actions.drag_and_drop(source, target)
actions.key_down(Keys.CONTROL).click(element).key_up(Keys.CONTROL)
actions.perform()
```

## Advanced Features

### Wait Strategies

```python:preview
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Explicit wait
wait = WebDriverWait(driver, timeout=10)
element = wait.until(
    EC.presence_of_element_located((By.ID, 'myDynamicElement'))
)

# Custom wait condition
def element_has_css_class(locator, css_class):
    def _predicate(driver):
        element = driver.find_element(*locator)
        return css_class in element.get_attribute("class")
    return _predicate

wait.until(element_has_css_class((By.ID, 'myElement'), 'active'))
```

### JavaScript Execution

```python:preview
# Execute JavaScript
driver.execute_script("return document.title;")

# Scroll into view
element = driver.find_element(By.ID, 'bottom')
driver.execute_script("arguments[0].scrollIntoView(true);", element)

# Modify DOM
driver.execute_script("""
    let div = document.createElement('div');
    div.innerHTML = 'New Element';
    document.body.appendChild(div);
""")
```

### Window Management

```python:preview
# Handle multiple windows
main_window = driver.current_window_handle
driver.switch_to.new_window('tab')

# Switch between windows
for handle in driver.window_handles:
    driver.switch_to.window(handle)
    if 'Expected Title' in driver.title:
        break

# Frame handling
driver.switch_to.frame('frame_name')
driver.switch_to.default_content()
```

## Testing Patterns

### Page Object Model

```python:preview
class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.username_input = (By.ID, 'username')
        self.password_input = (By.ID, 'password')
        self.login_button = (By.CSS_SELECTOR, 'button[type="submit"]')

    def login(self, username, password):
        self.driver.find_element(*self.username_input).send_keys(username)
        self.driver.find_element(*self.password_input).send_keys(password)
        self.driver.find_element(*self.login_button).click()
```

### Data-Driven Testing

```python
import pytest
import csv

def read_test_data():
    data = []
    with open('test_data.csv', 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data.append(row)
    return data

@pytest.mark.parametrize('test_data', read_test_data())
def test_login(driver, test_data):
    login_page = LoginPage(driver)
    login_page.login(test_data['username'], test_data['password'])

    if test_data['expected_result'] == 'success':
        assert driver.current_url == '/dashboard'
    else:
        assert login_page.get_error_message() == test_data['error_message']
```

## Advanced Testing

### API Integration

```python
import requests

class TestUserFlow:
    def setup_method(self):
        # Create test data via API
        response = requests.post(
            'https://api.example.com/users',
            json={'name': 'Test User', 'email': 'test@example.com'}
        )
        self.test_user = response.json()

    def test_user_profile(self, driver):
        # Login via UI
        login_page = LoginPage(driver)
        login_page.login(self.test_user['email'], 'password')

        # Verify profile data
        profile_element = driver.find_element(By.CLASS_NAME, 'profile')
        assert self.test_user['name'] in profile_element.text

    def teardown_method(self):
        # Cleanup test data
        requests.delete(f"https://api.example.com/users/{self.test_user['id']}")
```

### Screenshot Capture

```python
import os
from datetime import datetime

def take_screenshot(driver, name):
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    screenshot_dir = 'screenshots'
    if not os.path.exists(screenshot_dir):
        os.makedirs(screenshot_dir)

    filename = f"{screenshot_dir}/{name}_{timestamp}.png"
    driver.save_screenshot(filename)
    return filename

# Usage in test
def test_with_screenshot(driver):
    try:
        # Test steps
        driver.get('https://example.com')
        assert 'Expected Title' in driver.title
    except AssertionError:
        take_screenshot(driver, 'test_failure')
        raise
```

## Best Practices

### 1. Element Location

```python
# ❌ Avoid
driver.find_element(By.CSS_SELECTOR, 'button:nth-child(2)')
driver.find_element(By.XPATH, '//div[contains(@class, "btn")][2]')

# ✅ Prefer
driver.find_element(By.ID, 'submit-button')
driver.find_element(By.NAME, 'email')
driver.find_element(By.CSS_SELECTOR, '[data-testid="submit"]')
```

### 2. Waits

```python
# ❌ Avoid
import time
time.sleep(5)

# ✅ Prefer
wait = WebDriverWait(driver, 10)
wait.until(EC.element_to_be_clickable((By.ID, 'button')))
wait.until(EC.visibility_of_element_located((By.CLASS_NAME, 'modal')))
```

### 3. Error Handling

```python
from selenium.common.exceptions import TimeoutException, NoSuchElementException

try:
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, 'dynamic-content'))
    )
except TimeoutException:
    take_screenshot(driver, 'timeout_error')
    raise
except NoSuchElementException as e:
    logger.error(f"Element not found: {e}")
    raise
```

### 4. Resource Management

```python
class TestBase:
    @classmethod
    def setup_class(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()

    @classmethod
    def teardown_class(cls):
        if cls.driver:
            cls.driver.quit()

    def setup_method(self):
        self.driver.delete_all_cookies()
        self.driver.get(self.base_url)
```
