---
layout: home

hero:
  name: Async & TypeScript Patterns
  text: Master Modern JavaScript & TypeScript
  tagline: A comprehensive guide to async patterns and TypeScript best practices
  image:
    src: /logo.svg
    alt: Async & TypeScript Patterns
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/Underwood-Inc/async-mastery

features:
  - icon: 🚀
    title: Promise Patterns
    details: Everything you need to know about Promises, from basics to advanced patterns.
  - icon: ⚡
    title: Task Management
    details: Simple ways to handle multiple tasks in series, parallel, or racing.
  - icon: ⏱️
    title: Timer Patterns
    details: Better ways to work with timeouts and intervals in JavaScript.
  - icon: 🔄
    title: Control Flow
    details: Smart patterns for handling events and API calls efficiently.
  - icon: 🛡️
    title: Error Handling
    details: Keep your async code reliable with proper error handling.
  - icon: 📊
    title: Performance
    details: Tips and tricks to make your async code fast and efficient.
  - icon: 🧪
    title: TypeScript Types
    details: Master utility types, type guards, and advanced type patterns.
  - icon: 🧮
    title: Array Operations
    details: Type-safe array manipulations and transformations.
  - icon: 📝
    title: String Patterns
    details: Template literals and type-safe string operations.
  - icon: 💾
    title: State Management
    details: Type-safe state handling and immutable patterns.
  - icon: 🧪
    title: Testing Patterns
    details: Best practices for testing TypeScript code.
  - icon: 📚
    title: Examples
    details: Real-world examples combining async and TypeScript patterns.

footer: OpenRAIL Licensed | Copyright © 2024-present Underwood Inc.
---

# Modern Web Development Patterns

A comprehensive guide to async JavaScript, TypeScript patterns, and modern styling practices. This repository serves as a reference for implementing common patterns and best practices in web development.

## Quick Example

```typescript:preview
// Hover over Promise, Array methods, or the interface properties
interface User {
  id: string; // Hover over 'string' to see type info
  name: string;
  age: number; // Hover over 'number' to see type info
}

// Hover over Promise to see its type definition
const fetchUser = async (id: string): Promise<User> => {
  // Hover over 'map' to see Array method documentation
  const users: User[] = await Promise.all(
    [
      { id: '1', name: 'John', age: 30 },
      { id: '2', name: 'Jane', age: 25 },
    ].map((user) => ({
      ...user,
      age: user.age + 1, // Hover over 'age' to see property info
    }))
  );

  // Hover over 'find' to see Array method documentation
  return (
    users.find((user) => user.id === id) ?? {
      id: '0',
      name: 'Unknown',
      age: 0,
    }
  );
};
```

## Features

- Async JavaScript patterns and best practices
- TypeScript utility types and patterns
- Modern CSS methodologies and patterns
- Comprehensive documentation and examples
- Real-world use cases and implementations

## Getting Started

Visit our [Getting Started Guide](/guide/getting-started) to begin exploring the patterns and implementations.
