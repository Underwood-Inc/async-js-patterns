# Immutable State in TypeScript

This section explores patterns and best practices for implementing immutable state in TypeScript applications.

## Overview

Immutable state is a fundamental concept in modern application development that helps prevent bugs and makes state changes more predictable and traceable.

## Core Concepts

### 1. Readonly Types

```typescript:preview
// Basic readonly type
type ReadonlyUser = Readonly<User>;

// Deep readonly type
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface Config {
  server: {
    port: number;
    host: string;
  };
  database: {
    url: string;
  };
}

type ImmutableConfig = DeepReadonly<Config>;
```

### 2. Immutable Collections

```typescript:preview
class ImmutableList<T> {
  private readonly items: ReadonlyArray<T>;

  constructor(items: T[] = []) {
    this.items = Object.freeze([...items]);
  }

  add(item: T): ImmutableList<T> {
    return new ImmutableList([...this.items, item]);
  }

  remove(predicate: (item: T) => boolean): ImmutableList<T> {
    return new ImmutableList(this.items.filter((item) => !predicate(item)));
  }

  map<U>(fn: (item: T) => U): ImmutableList<U> {
    return new ImmutableList(this.items.map(fn));
  }

  filter(predicate: (item: T) => boolean): ImmutableList<T> {
    return new ImmutableList(this.items.filter(predicate));
  }

  toArray(): ReadonlyArray<T> {
    return this.items;
  }
}
```

## Advanced Patterns

### 1. Immutable State Updates

```typescript:preview
class ImmutableStore<T extends object> {
  private readonly state: DeepReadonly<T>;

  constructor(initialState: T) {
    this.state = Object.freeze(initialState) as DeepReadonly<T>;
  }

  getState(): DeepReadonly<T> {
    return this.state;
  }

  update(updater: (state: T) => T): ImmutableStore<T> {
    return new ImmutableStore(updater({ ...(this.state as T) }));
  }

  updatePath<K extends keyof T>(
    path: (string | number)[],
    value: any
  ): ImmutableStore<T> {
    return this.update((state) => {
      const newState = { ...state };
      let current: any = newState;

      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newState;
    });
  }
}
```

### 2. Immutable Records

```typescript:preview
class Record<T extends object> {
  private readonly data: DeepReadonly<T>;

  constructor(data: T) {
    this.data = Object.freeze(data) as DeepReadonly<T>;
  }

  with(partial: Partial<T>): Record<T> {
    return new Record({ ...(this.data as T), ...partial });
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.data[key];
  }

  toObject(): DeepReadonly<T> {
    return this.data;
  }
}
```

## Real-World Example

```typescript:preview
// Domain types
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface ShoppingCart {
  items: CartItem[];
  total: number;
}

// Immutable shopping cart implementation
class ImmutableCart {
  private readonly store: ImmutableStore<ShoppingCart>;
  private readonly products: ImmutableList<Product>;

  constructor(products: Product[]) {
    this.store = new ImmutableStore<ShoppingCart>({
      items: [],
      total: 0,
    });
    this.products = new ImmutableList(products);
  }

  addItem(productId: string, quantity: number): ImmutableCart {
    const product = this.products.toArray().find((p) => p.id === productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const newCart = new ImmutableCart(this.products.toArray());
    newCart.store = this.store.update((cart) => {
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      const newItems = existingItem
        ? cart.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...cart.items, { productId, quantity }];

      return {
        items: newItems,
        total: newItems.reduce((sum, item) => {
          const product = this.products
            .toArray()
            .find((p) => p.id === item.productId);
          return sum + (product?.price ?? 0) * item.quantity;
        }, 0),
      };
    });

    return newCart;
  }

  removeItem(productId: string): ImmutableCart {
    const newCart = new ImmutableCart(this.products.toArray());
    newCart.store = this.store.update((cart) => ({
      items: cart.items.filter((item) => item.productId !== productId),
      total: cart.items
        .filter((item) => item.productId !== productId)
        .reduce((sum, item) => {
          const product = this.products
            .toArray()
            .find((p) => p.id === item.productId);
          return sum + (product?.price ?? 0) * item.quantity;
        }, 0),
    }));

    return newCart;
  }

  getCart(): DeepReadonly<ShoppingCart> {
    return this.store.getState();
  }
}

// Usage
const products: Product[] = [
  { id: '1', name: 'Book', price: 10, stock: 5 },
  { id: '2', name: 'Pen', price: 2, stock: 10 },
];

let cart = new ImmutableCart(products);

// Add items
cart = cart.addItem('1', 2); // Add 2 books
cart = cart.addItem('2', 3); // Add 3 pens

console.log(cart.getCart());
// {
//   items: [
//     { productId: '1', quantity: 2 },
//     { productId: '2', quantity: 3 }
//   ],
//   total: 26
// }

// Remove an item
cart = cart.removeItem('1');

console.log(cart.getCart());
// {
//   items: [
//     { productId: '2', quantity: 3 }
//   ],
//   total: 6
// }
```

## Best Practices

1. Immutability Patterns:

   - Use TypeScript's readonly modifiers
   - Implement deep immutability
   - Return new instances on updates

2. Performance Considerations:

   - Use structural sharing
   - Implement memoization
   - Consider using Immutable.js for large datasets

3. Type Safety:
   - Leverage TypeScript's type system
   - Use const assertions
   - Implement proper type guards

## References

- [TypeScript Handbook - Readonly Types](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)
- [TypeScript Deep Dive - Immutability](https://basarat.gitbook.io/typescript/future-javascript/immutable)
