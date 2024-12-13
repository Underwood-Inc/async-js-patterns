---
title: TypeScript Mapped Types Guide
description: Master mapped types in TypeScript. Learn about type transformations, property modifications, and advanced type mapping patterns.
date: 2024-12-01
author: Underwood Inc
tags:
  - TypeScript
  - Mapped Types
  - Type System
  - Type Transformations
  - Advanced Types
  - Type Manipulation
image: /web-patterns/images/mapped-types-banner.png
---

# Mapped Types in TypeScript

This section explores TypeScript's mapped types and their applications in type transformations.

## Overview

Mapped types allow you to create new types based on existing ones by transforming their properties in a consistent way.

## Basic Mapped Types

### Property Modifiers

```typescript:preview
interface User {
  id: string;
  name: string;
  email: string;
}

// Make all properties optional
type PartialUser = {
  [P in keyof User]?: User[P];
};

// Make all properties readonly
type ReadonlyUser = {
  readonly [P in keyof User]: User[P];
};

// Make all properties nullable
type NullableUser = {
  [P in keyof User]: User[P] | null;
};
```

### Generic Mapped Types

```typescript:preview
// Generic partial type
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Generic readonly type
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Generic nullable type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
```

## Advanced Patterns

### Property Remapping

```typescript:preview
// Add prefix to property names
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

// Example usage
interface Config {
  host: string;
  port: number;
}

type PrefixedConfig = Prefixed<Config, 'app'>;
// Result:
// {
//   appHost: string;
//   appPort: number;
// }

// Filter properties by value type
type PickByValueType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K];
};

interface Form {
  name: string;
  age: number;
  isActive: boolean;
  tags: string[];
}

type StringProps = PickByValueType<Form, string>;
// Result:
// {
//   name: string;
// }
```

### Conditional Type Mapping

```typescript:preview
// Map types based on conditions
type ConditionalMap<T> = {
  [K in keyof T]: T[K] extends Function
    ? T[K]
    : T[K] extends object
      ? Readonly<T[K]>
      : T[K];
};

interface ApiConfig {
  endpoint: string;
  timeout: number;
  retryCount: number;
  onSuccess: () => void;
  onError: (error: Error) => void;
  options: {
    headers: Record<string, string>;
    params: Record<string, string>;
  };
}

type SafeApiConfig = ConditionalMap<ApiConfig>;
// Result: All non-function object properties are readonly
```

## Real-World Example

```typescript:preview
// Domain types
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
}

// Validation rules type
type ValidationRules<T> = {
  [K in keyof T]: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    validate?: (value: T[K]) => boolean;
    message?: string;
  };
};

// Form field type
type FormField<T> = {
  [K in keyof T]: {
    value: T[K];
    error?: string;
    touched: boolean;
    dirty: boolean;
  };
};

// Implementation
class FormManager<T extends object> {
  private fields: FormField<T>;
  private rules: ValidationRules<T>;
  private initialValues: T;

  constructor(initialValues: T, rules: ValidationRules<T>) {
    this.initialValues = initialValues;
    this.rules = rules;
    this.fields = this.initializeFields(initialValues);
  }

  private initializeFields(values: T): FormField<T> {
    const fields = {} as FormField<T>;

    for (const key in values) {
      fields[key] = {
        value: values[key],
        touched: false,
        dirty: false,
      };
    }

    return fields;
  }

  setValue<K extends keyof T>(field: K, value: T[K]): void {
    this.fields[field] = {
      ...this.fields[field],
      value,
      dirty: value !== this.initialValues[field],
    };

    this.validateField(field);
  }

  private validateField<K extends keyof T>(field: K): void {
    const rules = this.rules[field];
    const value = this.fields[field].value;

    if (!rules) return;

    if (rules.required && !value) {
      this.fields[field].error = rules.message || 'Field is required';
      return;
    }

    if (
      typeof value === 'number' &&
      rules.min !== undefined &&
      value < rules.min
    ) {
      this.fields[field].error =
        rules.message || `Value must be at least ${rules.min}`;
      return;
    }

    if (
      typeof value === 'number' &&
      rules.max !== undefined &&
      value > rules.max
    ) {
      this.fields[field].error =
        rules.message || `Value must be at most ${rules.max}`;
      return;
    }

    if (
      typeof value === 'string' &&
      rules.pattern &&
      !rules.pattern.test(value)
    ) {
      this.fields[field].error =
        rules.message || 'Value does not match pattern';
      return;
    }

    if (rules.validate && !rules.validate(value)) {
      this.fields[field].error = rules.message || 'Validation failed';
      return;
    }

    delete this.fields[field].error;
  }

  getFieldState<K extends keyof T>(field: K): FormField<T>[K] {
    return this.fields[field];
  }

  isValid(): boolean {
    return Object.values(this.fields).every((field) => !field.error);
  }

  isDirty(): boolean {
    return Object.values(this.fields).some((field) => field.dirty);
  }

  reset(): void {
    this.fields = this.initializeFields(this.initialValues);
  }
}

// Usage example
const productRules: ValidationRules<Product> = {
  id: {
    required: true,
    pattern: /^PRD-\d+$/,
    message: 'Invalid product ID format',
  },
  name: {
    required: true,
    validate: (value) => value.length >= 3,
    message: 'Name must be at least 3 characters',
  },
  price: {
    required: true,
    min: 0,
    message: 'Price must be positive',
  },
  stock: {
    required: true,
    min: 0,
    message: 'Stock must be positive',
  },
  category: {
    required: true,
  },
};

const form = new FormManager<Product>(
  {
    id: '',
    name: '',
    price: 0,
    stock: 0,
    category: '',
  },
  productRules
);

// Update values
form.setValue('name', 'Product 1');
form.setValue('price', -1); // Will set error

// Check state
console.log(form.getFieldState('price'));
// {
//   value: -1,
//   error: 'Price must be positive',
//   touched: false,
//   dirty: true
// }

console.log(form.isValid()); // false
console.log(form.isDirty()); // true
```

## Best Practices

1. Type Mapping:

   - Use built-in mapped types when possible
   - Create reusable generic mapped types
   - Document complex type transformations

2. Property Remapping:

   - Use template literal types for naming
   - Consider type inference implications
   - Handle edge cases explicitly

3. Performance:
   - Avoid deeply nested mapped types
   - Cache complex type computations
   - Use type aliases for readability

## References

- [TypeScript Handbook - Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [TypeScript Deep Dive - Advanced Types](https://basarat.gitbook.io/typescript/type-system/advanced-types)
