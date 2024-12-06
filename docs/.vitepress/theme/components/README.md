# CodePreview Component Documentation

## Overview

The CodePreview system consists of two main parts:

1. `CodePreview.vue` - A Vue component that renders an interactive Monaco editor
2. `codePreview.ts` - A markdown plugin that transforms code blocks into CodePreview components

## Usage

### In Markdown Files

To use the interactive code preview, add the `:preview` suffix to your code block's language:

````markdown:preview
```typescript:preview
// Your TypeScript code here
interface User {
  id: string;  // Hover over 'string'
  name: string;
}

const user: User = {  // Hover over 'User'
  id: "1",
  name: "John"
};
```
````

```javascript:preview
// Your JavaScript code here
```

````

### Component Features

The CodePreview component supports:
- Syntax highlighting
- Type information and hover tooltips
- IntelliSense suggestions
- Multiple file views (optional)

### Configuration

#### Basic Usage
```vue:preview
<CodePreview
  :code="yourCode"
  language="typescript"
/>
````

#### With Multiple Files

```vue:preview
<CodePreview
  :code="mainCode"
  :files="[
    { name: 'main.ts', content: mainCode, language: 'typescript' },
    { name: 'utils.ts', content: utilsCode, language: 'typescript' },
  ]"
  :showFileTree="true"
/>
```

## Implementation Details

### 1. Markdown Plugin (`codePreview.ts`)

The plugin transforms markdown code blocks with the `:preview` suffix into CodePreview component instances. Example:

````typescript:preview
// Input markdown
```ts:preview
const x: number = 42;
````

// Transformed to
<CodePreview
  code="const x: number = 42;"
  language="TypeScript"
/>

````

### 2. Component Setup

The CodePreview component:
1. Initializes Monaco editor with TypeScript support
2. Loads type definitions (Web APIs, DOM, Promise, gRPC)
3. Configures editor features (hover, suggestions, etc.)

## Troubleshooting

If hover tooltips or IntelliSense aren't working:
1. Ensure code blocks use the `:preview` suffix
2. Check that the language is specified correctly
3. Verify the code is valid TypeScript/JavaScript

## Example

```markdown:preview
# My Documentation

Here's an interactive code example:

```typescript:preview
interface User {
  id: string;
  name: string;
}

const user: User = {
  id: "1",
  name: "John"
};
````
