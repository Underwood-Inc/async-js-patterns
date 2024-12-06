---
title: Cypress Guide
description: Guide to using Cypress for end-to-end testing
---

# Cypress Guide

Cypress is a next-generation front-end testing tool built for the modern web. It enables fast, easy and reliable testing for anything that runs in a browser.

## Key Features

- Real-time reloads
- Automatic waiting
- Time travel debugging
- Network traffic control
- Screenshots and videos
- Cross-browser testing
- Interactive test runner
- Flake detection

## Getting Started

```bash:preview
# Install Cypress
npm install --save-dev cypress
```

## Basic Test Structure

```javascript:preview
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('successfully logs in with valid credentials', () => {
    cy.get('[data-cy="username"]').type('testuser');
    cy.get('[data-cy="password"]').type('password123');
    cy.get('[data-cy="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="welcome-message"]').should(
      'contain',
      'Welcome, Test User'
    );
  });
});
```

## Common Commands

```javascript:preview
// Navigation
cy.visit('/about');
cy.go('back');
cy.reload();

// Interacting with elements
cy.get('.button').click();
cy.get('input').type('Hello');
cy.get('select').select('option1');

// Assertions
cy.get('.title').should('exist');
cy.get('.count').should('have.text', '5');
cy.get('.disabled').should('be.disabled');

// Network requests
cy.intercept('GET', '/api/users', { fixture: 'users.json' });
cy.request('POST', '/api/data', { name: 'test' });

// Custom commands
Cypress.Commands.add('login', (email, password) => {
  cy.get('[data-cy="email"]').type(email);
  cy.get('[data-cy="password"]').type(password);
  cy.get('[data-cy="submit"]').click();
});
```

## Advanced Features

### Custom Commands

```javascript:preview
// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-cy="email"]').type(email);
  cy.get('[data-cy="password"]').type(password);
  cy.get('[data-cy="submit"]').click();
});

// Usage in tests
cy.login('user@example.com', 'password123');
```

### Fixtures

```javascript:preview
// cypress/fixtures/user.json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}

// Usage in tests
cy.fixture('user').then((user) => {
  cy.get('[data-cy="name"]').type(user.name)
  cy.get('[data-cy="email"]').type(user.email)
})
```

### Network Interception

```javascript:preview
// Mock API response
cy.intercept('GET', '/api/users', {
  statusCode: 200,
  body: { users: [] },
}).as('getUsers');

// Wait for request
cy.wait('@getUsers');

// Modify response
cy.intercept('GET', '/api/users', (req) => {
  req.reply((res) => {
    res.body.users = [...res.body.users, { id: 999, name: 'Test User' }];
    return res;
  });
});

// Force error response
cy.intercept('POST', '/api/users', {
  statusCode: 500,
  body: { error: 'Server error' },
});
```

## Testing Patterns

### Page Objects

```javascript:preview
// cypress/support/pages/login.page.js
class LoginPage {
  visit() {
    cy.visit('/login');
  }

  getEmailInput() {
    return cy.get('[data-cy="email"]');
  }

  getPasswordInput() {
    return cy.get('[data-cy="password"]');
  }

  getSubmitButton() {
    return cy.get('[data-cy="submit"]');
  }

  login(email, password) {
    this.getEmailInput().type(email);
    this.getPasswordInput().type(password);
    this.getSubmitButton().click();
  }
}

export default new LoginPage();

// Usage in tests
import LoginPage from '../support/pages/login.page';

it('should login successfully', () => {
  LoginPage.visit();
  LoginPage.login('user@example.com', 'password123');
  cy.url().should('include', '/dashboard');
});
```

### API Testing

```javascript:preview
describe('API Tests', () => {
  it('creates a new user', () => {
    cy.request('POST', '/api/users', {
      name: 'John Doe',
      email: 'john@example.com',
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
    });
  });

  it('handles errors correctly', () => {
    cy.request({
      method: 'POST',
      url: '/api/users',
      body: { name: '' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });
});
```

## Configuration

### cypress.config.js

```javascript:preview
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 5000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
  env: {
    apiUrl: 'http://localhost:3001',
    coverage: false,
  },
});
```

### Environment Variables

```javascript:preview
// cypress.env.json
{
  "auth_token": "secret-token",
  "api_key": "12345"
}

// Usage in tests
cy.visit(`${Cypress.env('apiUrl')}/users`)
```

## Best Practices

### 1. Selectors

```javascript:preview
// ❌ Avoid
cy.get('.submit-button');
cy.get('#login-form');
cy.get('button').contains('Submit');

// ✅ Prefer
cy.get('[data-cy="submit-button"]');
cy.get('[data-cy="login-form"]');
cy.get('[data-cy="submit"]');
```

### 2. Waiting

```javascript:preview
// ❌ Avoid
cy.wait(5000);

// ✅ Prefer
cy.get('[data-cy="element"]').should('be.visible');
cy.get('[data-cy="element"]').should('exist');
cy.intercept('/api/data').as('getData');
cy.wait('@getData');
```

### 3. Assertions

```javascript:preview
// Element state
cy.get('[data-cy="button"]')
  .should('be.visible')
  .and('not.be.disabled')
  .and('have.text', 'Submit');

// Multiple assertions
cy.get('[data-cy="user"]').should(($el) => {
  expect($el).to.have.length(3);
  expect($el.first()).to.contain('John');
  expect($el.last()).to.contain('Jane');
});
```

## Testing Strategies

### Visual Testing

```javascript:preview
describe('Visual Tests', () => {
  it('matches homepage screenshot', () => {
    cy.visit('/');
    cy.matchImageSnapshot('homepage');
  });

  it('matches mobile layout', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.matchImageSnapshot('homepage-mobile');
  });
});
```

### Component Testing

```javascript:preview
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    cy.mount(<Button>Click me</Button>);
    cy.get('button').should('have.text', 'Click me');
  });

  it('handles click events', () => {
    const onClick = cy.stub().as('onClick');
    cy.mount(<Button onClick={onClick}>Click me</Button>);
    cy.get('button').click();
    cy.get('@onClick').should('have.been.called');
  });
});
```

## Performance Testing

### Measuring Performance

```javascript:preview
cy.window().then((win) => {
  const performance = win.performance;
  const navigation = performance.getEntriesByType('navigation')[0];

  expect(navigation.domContentLoadedEventEnd).to.be.lessThan(2000);
  expect(navigation.loadEventEnd).to.be.lessThan(5000);
});
```

### Resource Loading

```javascript:preview
cy.window().then((win) => {
  const resources = win.performance.getEntriesByType('resource');

  // Check image sizes
  const images = resources.filter((r) => r.initiatorType === 'img');
  images.forEach((img) => {
    expect(img.transferSize).to.be.lessThan(500000);
  });

  // Check total page weight
  const totalSize = resources.reduce((sum, r) => sum + r.transferSize, 0);
  expect(totalSize).to.be.lessThan(5000000);
});
```

## Debugging

### Console Output

```javascript:preview
cy.get('[data-cy="element"]').then(($el) => {
  console.log('Element:', $el);
});

// Debug command
cy.debug();

// Pause execution
cy.pause();
```

### Screenshots and Videos

```javascript:preview
// Take screenshot
cy.screenshot('error-state');

// Screenshot specific element
cy.get('[data-cy="modal"]').screenshot('modal');

// Configure video recording
module.exports = defineConfig({
  e2e: {
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
  },
});
```
