# Async JavaScript Patterns

This repository contains a comprehensive guide to async JavaScript patterns with
implementations. It serves as both a learning resource and a reference for
implementing various async patterns in JavaScript.

## 📚 Contents

The guide covers:

### Promise Implementations

- Custom Promise implementation
- Promise.all()
- Promise.any()
- Promise.race()
- Promise.allSettled()
- Promise.finally()
- Promise.resolve/reject

### Async Task Patterns

- Tasks in Series
- Tasks in Parallel
- Tasks Racing

### Timer Implementations

- Custom setTimeout
- Custom setInterval
- Clear All Timers

### Advanced Patterns

- Promisifying Callbacks
- Auto-Retry Mechanisms
- API Batch Throttling
- Debouncing
- Throttling
- Memoization

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Underwood-Inc/async-js-patterns.git
cd async-js-patterns
```

1. Install dependencies:

```bash
npm install
```

## 📖 Documentation

Visit our documentation site to explore the implementations and examples:

1. Run the documentation locally:

```bash
npm run docs:dev
```

1. Build the documentation:

```bash
npm run docs:build
```

The documentation is organized into the following sections:

- **Promise Implementations**: Detailed explanations and implementations of
  Promise utilities
- **Async Task Patterns**: Common patterns for handling async tasks
- **Timer Implementations**: Custom timer implementations and utilities
- **Advanced Patterns**: Advanced async patterns for real-world scenarios

## 🧪 Running Tests

Run the test suite to verify implementations:

```bash
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our
[Contributing Guide](docs/CONTRIBUTING.md) for details on:

- Code of Conduct
- Development Process
- Pull Request Process
- Coding Standards

## 🔄 CI/CD

Our repository uses GitHub Actions for continuous integration and deployment. The workflows are documented in [.github/workflows/README.md](.github/workflows/README.md):

- **Documentation Deployment**: Automatically builds and deploys documentation to GitHub Pages
- **Continuous Integration**: Runs tests and linting on pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- JavaScript Promise specification
- MDN Web Docs for async patterns reference
- Contributors and maintainers

## 📬 Contact

For questions and feedback:

- Create an issue in the repository
- Reach out to maintainers through GitHub discussions
