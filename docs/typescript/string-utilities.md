# String Utilities in TypeScript

This section provides a collection of type-safe string utility functions and patterns for common string operations.

## Overview

String utilities help you manipulate and validate strings in a type-safe manner while maintaining code readability and reusability.

## Basic Utilities

### String Validation

```typescript
function isNonEmpty(str: string): boolean {
  return str.length > 0;
}

function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

function isEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function isURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Usage
console.log(isNonEmpty('hello')); // true
console.log(isAlphanumeric('hello123')); // true
console.log(isEmail('user@example.com')); // true
console.log(isURL('https://example.com')); // true
```

### String Transformation

```typescript
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

// Usage
console.log(capitalize('hello')); // 'Hello'
console.log(camelCase('hello world')); // 'helloWorld'
console.log(kebabCase('helloWorld')); // 'hello-world'
console.log(snakeCase('helloWorld')); // 'hello_world'
```

## Advanced Utilities

### String Templates

```typescript
function template(
  str: string,
  params: Record<string, string | number>
): string {
  return str.replace(/\${(\w+)}/g, (_, key) => String(params[key] ?? ''));
}

function interpolate(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  return strings.reduce(
    (result, str, i) => result + str + (values[i] ?? ''),
    ''
  );
}

// Usage
const greeting = template('Hello, ${name}!', { name: 'John' });
const message = interpolate`Hello, ${'John'}! You have ${2} messages.`;
```

### String Manipulation

```typescript
function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

function wordWrap(str: string, width: number, newline: string = '\n'): string {
  const words = str.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if (currentLine.length + word.length <= width) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join(newline);
}

// Usage
console.log(truncate('Hello, world!', 8)); // 'Hello...'
console.log(wordWrap('Hello world, how are you?', 10));
// Hello world,
// how are
// you?
```

## Real-World Example

```typescript
// String utility class with common operations
class StringUtils {
  // Validation methods
  static isNonEmpty(str: string): boolean {
    return str.length > 0;
  }

  static matches(str: string, pattern: RegExp): boolean {
    return pattern.test(str);
  }

  static isLength(
    str: string,
    options: { min?: number; max?: number }
  ): boolean {
    const length = str.length;
    if (options.min !== undefined && length < options.min) return false;
    if (options.max !== undefined && length > options.max) return false;
    return true;
  }

  // Transformation methods
  static transform(
    str: string,
    options: {
      trim?: boolean;
      lowercase?: boolean;
      uppercase?: boolean;
      capitalize?: boolean;
    }
  ): string {
    let result = str;
    if (options.trim) result = result.trim();
    if (options.lowercase) result = result.toLowerCase();
    if (options.uppercase) result = result.toUpperCase();
    if (options.capitalize) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
  }

  // Case conversion
  static toCamelCase(str: string): string {
    return camelCase(str);
  }

  static toKebabCase(str: string): string {
    return kebabCase(str);
  }

  static toSnakeCase(str: string): string {
    return snakeCase(str);
  }

  // String manipulation
  static truncate(
    str: string,
    options: {
      length: number;
      suffix?: string;
      wordBoundary?: boolean;
    }
  ): string {
    const { length, suffix = '...', wordBoundary = false } = options;

    if (str.length <= length) return str;

    let truncated = str.slice(0, length - suffix.length);
    if (wordBoundary) {
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace > 0) {
        truncated = truncated.slice(0, lastSpace);
      }
    }
    return truncated + suffix;
  }

  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static excerpt(
    str: string,
    options: {
      length: number;
      suffix?: string;
      preserveWords?: boolean;
    }
  ): string {
    const { length, suffix = '...', preserveWords = true } = options;

    if (str.length <= length) return str;

    let truncated = str.slice(0, length - suffix.length);
    if (preserveWords) {
      const match = truncated.match(/^.*[\w,;](?=\s|$)/);
      if (match) {
        truncated = match[0];
      }
    }
    return truncated + suffix;
  }
}

// Usage example
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class StringValidator {
  private rules: Array<(str: string) => string | null> = [];

  minLength(length: number): this {
    this.rules.push((str) =>
      str.length >= length ? null : `Must be at least ${length} characters`
    );
    return this;
  }

  maxLength(length: number): this {
    this.rules.push((str) =>
      str.length <= length ? null : `Must be at most ${length} characters`
    );
    return this;
  }

  matches(pattern: RegExp, message: string): this {
    this.rules.push((str) => (pattern.test(str) ? null : message));
    return this;
  }

  email(): this {
    return this.matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Must be a valid email address'
    );
  }

  url(): this {
    this.rules.push((str) => {
      try {
        new URL(str);
        return null;
      } catch {
        return 'Must be a valid URL';
      }
    });
    return this;
  }

  validate(str: string): ValidationResult {
    const errors = this.rules
      .map((rule) => rule(str))
      .filter((error): error is string => error !== null);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Example usage
const text = 'Hello, World! This is a long text that needs processing.';

// Basic transformations
console.log(
  StringUtils.transform(text, {
    trim: true,
    lowercase: true,
  })
);

// Slugify for URLs
console.log(StringUtils.slugify('Hello, World!')); // 'hello-world'

// Create excerpts
console.log(
  StringUtils.excerpt(text, {
    length: 20,
    preserveWords: true,
  })
);

// Validate strings
const validator = new StringValidator()
  .minLength(8)
  .maxLength(50)
  .matches(/^[a-zA-Z\s]+$/, 'Must contain only letters and spaces');

const validationResult = validator.validate('Hello World');
console.log(validationResult);

// Email validation
const emailValidator = new StringValidator().email();
console.log(emailValidator.validate('user@example.com'));
```

## Best Practices

1. String Manipulation:

   - Use template literals when possible
   - Handle edge cases explicitly
   - Consider Unicode support

2. Performance:

   - Cache regular expressions
   - Minimize string concatenations
   - Use appropriate string methods

3. Validation:
   - Use strict validation rules
   - Provide meaningful error messages
   - Handle special characters

## References

- [TypeScript Handbook - String Manipulation](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [MDN - String Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
