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

```bash
# Install Cypress
npm install --save-dev cypress
```

## Basic Test Structure

```javascript
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

```javascript
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

More content coming soon...
