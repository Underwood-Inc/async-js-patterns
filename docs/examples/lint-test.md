# Lint Test

## TypeScript Example with Issues

```typescript
// Extra spaces and missing types
function add(a, b) {
  console.log('Adding numbers');
  const unused = 'this is never used';
  return a + b;
}

const result = add(1, 2);

// Using any type
function processData(data: any) {
  const items = data.map((item) => item * 2);
  return items;
}
```

## JavaScript Example with Issues

```javascript
// Using var and missing semicolons
var x = 10;
var y = 20;

function multiply(a, b) {
  console.log('Multiplying numbers');
  return a * b;
}

const result = multiply(x, y);
```

## Good TypeScript Example

```typescript
// Properly formatted code
function add(a: number, b: number): number {
  const result = a + b;
  return result;
}

export const sum = add(1, 2);
```
