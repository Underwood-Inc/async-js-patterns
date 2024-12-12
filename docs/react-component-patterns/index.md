---
title: React Component Patterns
description: Comprehensive guide to building modern, reusable React components following best practices and design patterns
date: 2024-01-01
author: Underwood Inc
tags:
  - React
  - Components
  - UI Design
  - Best Practices
  - TypeScript
---

# React Component Patterns

## Overview

A comprehensive guide to building modern, maintainable React components using best practices, design patterns, and TypeScript. This guide focuses on creating a robust component library that follows DRY principles, composable design, and performance optimization.

## Quick Start

### Basic Component Structure

::: code-with-tooltips

```tsx
import React from 'react';
import type { PropsWithChildren } from 'react';

interface CardProps {
  title: string;
  variant?: 'default' | 'featured';
  className?: string;
}

export const Card = ({
  title,
  variant = 'default',
  className,
  children
}: PropsWithChildren<CardProps>) => {
  return (
    <div
      className={clsx(
        'card',
        `card--${variant}`,
        className
      )}
    >
      <div className="card__header">
        <h3 className="card__title">{title}</h3>
      </div>
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};
```

:::

::: code-with-tooltips

```scss
.card {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 2px solid var(--vp-c-brand);
  overflow: hidden;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &--featured {
    border-color: var(--vp-c-brand-dark);
    background: color.adjust(colors.$purple-light, $lightness: -2%);
  }

  &__header {
    padding: 1rem;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  &__title {
    margin: 0;
    color: var(--vp-c-brand-dark);
  }

  &__content {
    padding: 1rem;
  }
}
```

:::

## Component Categories

Our React component library is organized into the following categories:

### Foundation

- [Typography](./foundation/typography.md) - Text components and styles
- [Colors](./foundation/colors.md) - Color system and themes
- [Spacing](./foundation/spacing.md) - Layout and spacing system
- [Icons](./foundation/icons.md) - Icon system and usage

### Layout

- [Container](./layout/container.md) - Content wrapper components
- [Grid](./layout/grid.md) - Grid system components
- [Stack](./layout/stack.md) - Vertical/horizontal stacking
- [Flex](./layout/flex.md) - Flexbox components

### Form Controls

- [Button](./form/button.md) - Button variants and states
- [Input](./form/input.md) - Text input components
- [Select](./form/select.md) - Dropdown selection
- [Checkbox](./form/checkbox.md) - Checkbox components
- [Radio](./form/radio.md) - Radio button groups
- [Switch](./form/switch.md) - Toggle switches

### Navigation

- [Menu](./navigation/menu.md) - Menu components
- [Tabs](./navigation/tabs.md) - Tab navigation
- [Breadcrumb](./navigation/breadcrumb.md) - Breadcrumb navigation
- [Pagination](./navigation/pagination.md) - Page navigation

### Feedback

- [Alert](/react-component-patterns/feedback/notifications/alert) - Alert messages
- [Toast](/react-component-patterns/feedback/notifications/toast) - Toast notifications
- [Progress](/react-component-patterns/feedback/progress-indicators/progress) - Progress indicators
- [Skeleton](/react-component-patterns/feedback/progress-indicators/skeleton) - Loading states

### Overlay

- [Modal](/react-component-patterns/overlay/modal) - Modal dialogs
- [Drawer](/react-component-patterns/overlay/drawer) - Slide-out panels
- [Popover](/react-component-patterns/overlay/popover) - Contextual overlays
- [Tooltip](/react-component-patterns/overlay/tooltip) - Hover tooltips

### Data Display

- [Table](/react-component-patterns/data/table) - Data tables
- [List](/react-component-patterns/data/list) - List components
- [Card](/react-component-patterns/data/card) - Card layouts
- [Badge](/react-component-patterns/data/badge) - Status badges

## Best Practices

### 1. Component Design

- Follow single responsibility principle
  - Each component should do one thing well
  - Break complex components into smaller, focused ones
  - Example:

::: code-with-tooltips

  ```tsx
  // ❌ Too many responsibilities
  const UserDashboard = () => (
    <div>
      <UserProfile />
      <UserSettings />
      <UserOrders />
      <UserPayments />
    </div>
  );

  // ✅ Single responsibility
  const UserDashboard = () => (
    <DashboardLayout>
      <UserProfileSection />
      <UserSettingsSection />
      <UserOrdersSection />
    </DashboardLayout>
  );
  ```

:::

- Make components composable and reusable
  - Use composition over inheritance
  - Implement render props and higher-order components when needed
  - Example:

::: code-with-tooltips

  ```tsx
  // ✅ Composable component
  const Card = ({ header, footer, children, className }) => (
    <div className={clsx('card', className)}>
      {header && <div className="card__header">{header}</div>}
      <div className="card__content">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );

  // Usage
  <Card
    header={<h2>Title</h2>}
    footer={<Button>Action</Button>}
  >
    Content goes here
  </Card>
  ```

:::

- Use TypeScript for type safety
  - Define proper interfaces for props
  - Use generics for flexible components
  - Example:
  -

::: code-with-tooltips

  ```tsx
  interface SelectProps<T> {
    options: T[];
    value: T;
    onChange: (value: T) => void;
    getLabel?: (option: T) => string;
    getValue?: (option: T) => string | number;
  }

  export const Select = <T extends Record<string, any>>({
    options,
    value,
    onChange,
    getLabel = (option) => option.label,
    getValue = (option) => option.value,
  }: SelectProps<T>) => {
    // Implementation
  };
  ```

:::

- Implement proper prop validation
  - Use TypeScript interfaces
  - Add runtime prop validation when needed
  - Document props with JSDoc comments
  - Example:

::: code-with-tooltips

  ```tsx
  interface ButtonProps {
    /** The button's label text */
    label: string;
    /** Optional variant style */
    variant?: 'primary' | 'secondary';
    /** Click handler */
    onClick?: () => void;
    /** Disabled state */
    disabled?: boolean;
  }

  export const Button = ({
    label,
    variant = 'primary',
    onClick,
    disabled = false,
  }: ButtonProps) => {
    // Implementation
  };
  ```

:::

- Handle accessibility (ARIA) properly
  - Use semantic HTML elements
  - Add proper ARIA attributes
  - Support keyboard navigation
  - Example:

::: code-with-tooltips

  ```tsx
  interface TabProps {
    label: string;
    selected?: boolean;
    onClick?: () => void;
  }

  export const Tab = ({ label, selected, onClick }: TabProps) => (
    <button
      role="tab"
      aria-selected={selected}
      aria-controls={`panel-${label}`}
      tabIndex={selected ? 0 : -1}
      onClick={onClick}
    >
      {label}
    </button>
  );
  ```

:::

- Implement pipe patterns for data transformation
  - Create composable transformation functions
  - Use TypeScript for type safety
  - Implement memoization for performance
  - Example:

::: code-with-tooltips

```tsx
// Pipe function type and utility
type PipeFn<T> = (value: T) => T;

const pipe = <T>(...fns: PipeFn<T>[]) => (value: T): T => {
  return fns.reduce((acc, fn) => fn(acc), value);
};

// Example transformation functions
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const truncate = (length: number) => (str: string): string => {
  return str.length > length ? str.slice(0, length) + '...' : str;
};

// React component using pipes
const TextDisplay = ({ text }: { text: string }) => {
  // Memoize the pipe function to prevent recreating on each render
  const transformText = useMemo(() => 
    pipe(
      capitalize,
      truncate(20)
    ),
    []
  );

  return <div>{transformText(text)}</div>;
};

// Custom hook for reusable transformations
const useTextTransform = (text: string, ...transforms: PipeFn<string>[]) => {
  return useMemo(() => pipe(...transforms)(text), [text, ...transforms]);
};

// Usage with hook
const TransformedText = ({ text }: { text: string }) => {
  const transformedText = useTextTransform(
    text,
    capitalize,
    truncate(20)
  );

  return <div>{transformedText}</div>;
};
```

:::

### 2. State Management

- Use appropriate hooks for state
  - Choose the right hook for each use case
  - Avoid redundant state
  - Example:

::: code-with-tooltips

  ```tsx
  // ❌ Redundant state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  // ✅ Derived state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const fullName = useMemo(
    () => `${firstName} ${lastName}`.trim(),
    [firstName, lastName]
  );
  ```

:::

- Implement controlled vs uncontrolled patterns
  - Use controlled components for form elements
  - Provide uncontrolled alternatives when needed
  - Example:

::: code-with-tooltips

  ```tsx
  interface InputProps {
    // Controlled mode
    value?: string;
    onChange?: (value: string) => void;
    // Uncontrolled mode
    defaultValue?: string;
    onSubmit?: (value: string) => void;
  }

  export const Input = ({
    value,
    onChange,
    defaultValue,
    onSubmit,
  }: InputProps) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (isControlled) {
        onChange?.(newValue);
      } else {
        setInternalValue(newValue);
      }
    };

    return (
      <input
        value={isControlled ? value : internalValue}
        onChange={handleChange}
        onBlur={() => !isControlled && onSubmit?.(internalValue)}
      />
    );
  };
  ```

:::

- Handle side effects properly
  - Use useEffect for side effects
  - Clean up effects when needed
  - Handle async operations safely
  - Example:

::: code-with-tooltips

  ```tsx
  const UserProfile = ({ userId }: { userId: string }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      let mounted = true;

      async function fetchUser() {
        try {
          const data = await api.getUser(userId);
          if (mounted) {
            setUser(data);
          }
        } catch (err) {
          if (mounted) {
            setError(err as Error);
          }
        }
      }

      fetchUser();
      return () => { mounted = false; };
    }, [userId]);

    if (error) return <ErrorDisplay error={error} />;
    if (!user) return <LoadingSpinner />;
    return <UserDisplay user={user} />;
  };
  ```

:::

- Manage component lifecycle
  - Initialize state properly
  - Handle updates efficiently
  - Clean up resources
  - Example:

::: code-with-tooltips

  ```tsx
  const DataViewer = ({ source }: { source: string }) => {
    const [data, setData] = useState<Data[]>([]);
    const subscription = useRef<Subscription | null>(null);

    useEffect(() => {
      // Initialize
      subscription.current = dataService
        .subscribe(source, setData);

      // Cleanup
      return () => {
        subscription.current?.unsubscribe();
        subscription.current = null;
      };
    }, [source]);

    // Rest of the component
  };
  ```

:::

### 3. Performance

- Implement proper memoization
  - Use useMemo for expensive computations
  - Use useCallback for function stability
  - Memoize components with React.memo when needed
  - Example:

::: code-with-tooltips

  ```tsx
  const ExpensiveComponent = ({ data, onAction }: Props) => {
    // Memoize expensive computation
    const processedData = useMemo(() => {
      return data.map(item => expensiveTransform(item));
    }, [data]);

    // Memoize callback
    const handleAction = useCallback((id: string) => {
      onAction(id);
    }, [onAction]);

    return (
      <div>
        {processedData.map(item => (
          <Item 
            key={item.id}
            data={item}
            onAction={handleAction}
          />
        ))}
      </div>
    );
  };

  // Memoize component
  export default React.memo(ExpensiveComponent);
  ```

:::

- Use lazy loading when appropriate
  - Split code into chunks
  - Load components on demand
  - Handle loading states
  - Example:

::: code-with-tooltips

  ```tsx
  const LazyComponent = lazy(() => import('./HeavyComponent'));

  const App = () => {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent />
      </Suspense>
    );
  };
  ```

:::

- Optimize re-renders
  - Use proper dependency arrays
  - Avoid inline object creation
  - Implement shouldComponentUpdate or React.memo
  - Example:

::: code-with-tooltips

  ```tsx
  // ❌ Causes re-renders
  const Component = ({ data }) => (
    <Child 
      config={{ foo: 'bar' }}  // New object each render
      onAction={() => {}}      // New function each render
    />
  );

  // ✅ Optimized
  const Component = ({ data }) => {
    const config = useMemo(() => ({ foo: 'bar' }), []);
    const handleAction = useCallback(() => {
      // handle action
    }, []);

    return (
      <Child 
        config={config}
        onAction={handleAction}
      />
    );
  };
  ```

:::

- Handle large lists efficiently
  - Use virtualization for long lists
  - Implement pagination or infinite scroll
  - Batch updates when possible
  - Example:

::: code-with-tooltips

  ```tsx
  import { VirtualList } from '@virtual-list/react';

  const EfficientList = ({ items }: { items: Item[] }) => {
    const renderItem = useCallback(({ index, style }) => (
      <div style={style}>
        <ListItem data={items[index]} />
      </div>
    ), [items]);

    return (
      <VirtualList
        height={400}
        itemCount={items.length}
        itemSize={50}
        width="100%"
        renderItem={renderItem}
      />
    );
  };
  ```

:::

- Implement proper error boundaries
  - Catch and handle render errors
  - Provide fallback UI
  - Log errors appropriately
  - Example:

::: code-with-tooltips

  ```tsx
  class ErrorBoundary extends React.Component<Props, State> {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      logError(error, info);
    }

    render() {
      if (this.state.hasError) {
        return <ErrorFallback error={this.state.error} />;
      }

      return this.props.children;
    }
  }
  ```

:::

### 4. Styling

- Use CSS-in-JS or CSS Modules for component-specific styles
  - Provides better encapsulation and scoping
  - Enables dynamic styling based on props
  - Eliminates naming conflicts
  - Allows for dead code elimination
  - Provides TypeScript support and type safety
  - Example:

::: code-with-tooltips

  ```tsx
  // Using CSS Modules
  import styles from './Card.module.css';
  
  export const Card = ({ featured }) => (
    <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <h2 className={styles.title}>Title</h2>
    </div>
  );

  // Using CSS-in-JS (styled-components)
  const CardWrapper = styled.div<{ featured?: boolean }>`
    background: ${props => props.featured ? 'yellow' : 'white'};
    padding: var(--space-md);
    border-radius: var(--radius-md);
  `;
  ```

:::

- Follow BEM methodology for global styles
  - Provides clear structure for larger stylesheets
  - Makes CSS more maintainable and scalable
  - Helps prevent style conflicts in global styles
  - Example:

::: code-with-tooltips

  ```scss
  .card {
    &__header { /* Block Element */ }
    &--featured { /* Block Modifier */ }
  }
  ```

:::

- Implement responsive design using modern CSS
  - Use CSS Grid and Flexbox for layouts
  - Implement Container Queries for component-level responsiveness
  - Use modern units (rem, ch, dvh) for better scaling
  - Example:

::: code-with-tooltips

  ```scss
  .layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-md);
    
    @container (min-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  ```

:::

- Support theming and customization
  - Use CSS Custom Properties for theme values
  - Implement dark mode using CSS variables
  - Provide component-level style customization
  - Example:

::: code-with-tooltips

  ```scss
  :root {
    --color-primary: #646cff;
    --color-text: #213547;
  }

  .dark {
    --color-primary: #747bff;
    --color-text: #ffffff;
  }
  ```

:::

### 5. Testing

- Write unit tests for components
  - Test component rendering
  - Test user interactions
  - Test state changes
  - Example:

::: code-with-tooltips

  ```tsx
  import { render, screen, fireEvent } from '@testing-library/react';

  describe('Button', () => {
    it('renders with correct label', () => {
      render(<Button label="Click me" />);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button label="Click me" onClick={handleClick} />);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports disabled state', () => {
      render(<Button label="Click me" disabled />);
      expect(screen.getByText('Click me')).toBeDisabled();
    });
  });
  ```

:::

- Implement integration tests
  - Test component interactions
  - Test data flow
  - Test side effects
  - Example:

::: code-with-tooltips

  ```tsx
  describe('UserProfile', () => {
    it('loads and displays user data', async () => {
      // Mock API response
      mockApi.getUser.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      });

      render(<UserProfile userId="1" />);
      
      // Test loading state
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      
      // Test loaded state
      await screen.findByText('John Doe');
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('handles error states', async () => {
      // Mock API error
      mockApi.getUser.mockRejectedValue(new Error('Failed to load'));

      render(<UserProfile userId="1" />);
      
      await screen.findByText('Error: Failed to load');
      expect(screen.queryByTestId('user-data')).not.toBeInTheDocument();
    });
  });
  ```

:::

- Use proper testing utilities
  - Use React Testing Library
  - Implement custom test hooks
  - Set up proper test environment
  - Example:

::: code-with-tooltips

  ```tsx
  // Custom test hook
  const renderWithProviders = (
    ui: React.ReactElement,
    {
      initialState = {},
      store = configureStore({ reducer, initialState }),
      ...renderOptions
    } = {}
  ) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </Provider>
    );

    return {
      store,
      ...render(ui, { wrapper: Wrapper, ...renderOptions })
    };
  };

  // Usage in tests
  it('renders with providers', () => {
    renderWithProviders(<MyComponent />, {
      initialState: { theme: 'dark' }
    });
  });
  ```

:::

- Test accessibility features
  - Test keyboard navigation
  - Verify ARIA attributes
  - Check screen reader compatibility
  - Example:

::: code-with-tooltips

  ```tsx
  describe('Navigation', () => {
    it('supports keyboard navigation', () => {
      render(<Navigation />);
      
      const firstLink = screen.getByRole('link', { name: 'Home' });
      const secondLink = screen.getByRole('link', { name: 'About' });
      
      // Focus first link
      firstLink.focus();
      expect(document.activeElement).toBe(firstLink);
      
      // Press Tab
      userEvent.tab();
      expect(document.activeElement).toBe(secondLink);
    });

    it('has correct ARIA attributes', () => {
      render(<Navigation />);
      
      const menu = screen.getByRole('navigation');
      expect(menu).toHaveAttribute('aria-label', 'Main');
      
      const expandButton = screen.getByRole('button', { name: 'Menu' });
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
  ```

:::

### 6. Documentation

- Document component API
  - Use TypeScript interfaces for prop documentation
  - Add JSDoc comments for detailed descriptions
  - Include usage examples
  - Example:

::: code-with-tooltips

  ```tsx
  /**
   * Button component that follows design system specifications.
   * Supports multiple variants and sizes with proper accessibility attributes.
   *
   * @example
   * ```tsx
   * <Button
   *   variant="primary"
   *   size="medium"
   *   onClick={() => console.log('clicked')}
   * >
   *   Click Me
   * </Button>
   * ```
   */
  interface ButtonProps {
    /** Content to be rendered inside the button */
    children: React.ReactNode;
    /** Visual variant of the button */
    variant?: 'primary' | 'secondary' | 'text';
    /** Size variant of the button */
    size?: 'small' | 'medium' | 'large';
    /** Handler called when the button is clicked */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Whether the button is in a disabled state */
    disabled?: boolean;
    /** Additional CSS classes to apply */
    className?: string;
  }

  export const Button = ({ 
    children,
    variant = 'primary',
    size = 'medium',
    onClick,
    disabled = false,
    className,
  }: ButtonProps) => {
    // Implementation
  };
  ```

:::

- Create component stories
  - Document different component states
  - Show interactive examples
  - Include edge cases
  - Example:

  ::: code-with-tooltips

  ```tsx
  // Button.stories.tsx
  import type { Meta, StoryObj } from '@storybook/react';
  import { Button } from './Button';

  const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['primary', 'secondary', 'text'],
      },
      size: {
        control: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
  };

  export default meta;
  type Story = StoryObj<typeof Button>;

  export const Primary: Story = {
    args: {
      children: 'Primary Button',
      variant: 'primary',
    },
  };

  export const Secondary: Story = {
    args: {
      children: 'Secondary Button',
      variant: 'secondary',
    },
  };

  export const Disabled: Story = {
    args: {
      children: 'Disabled Button',
      disabled: true,
    },
  };
  ```

:::

- Maintain a changelog
  - Document breaking changes
  - Track feature additions
  - Note bug fixes
  - Example:

  ::: code-with-tooltips

  ```markdown
  # Changelog

  ## [2.0.0] - 2024-03-15
  ### Breaking Changes
  - Changed Button API to use `variant` instead of `type`
  - Removed deprecated `size` values

  ### Added
  - New `text` variant for Button
  - Support for custom icons

  ### Fixed
  - Button click area extending beyond visible bounds
  - Focus state not visible in dark mode
  ```

- Include migration guides
  - Document breaking changes in detail
  - Provide code migration examples
  - Include automated codemods when possible
  - Example:

  ```tsx
  // Migration Guide
  /**
   * # Migrating to v2.0
   * 
   * ## Button Component Changes
   * 
   * ### Before (v1.x)
   * ```tsx
   * <Button type="primary" size="m">
   *   Click Me
   * </Button>
   * ```
   * 
   * ### After (v2.0)
   * ```tsx
   * <Button variant="primary" size="medium">
   *   Click Me
   * </Button>
   * ```
   * 
   * ## Automated Migration
   * Run the codemod:
   * ```bash
   * npx @mylib/codemods button-v2
   * ```
   */
  ```

:::

## Component Template

Use this template when creating new components:

::: code-with-tooltips

```tsx
import React from 'react';
import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

export interface ComponentProps {
  /** Component description */
  label: string;
  /** Optional variant */
  variant?: 'default' | 'alternate';
  /** Additional class names */
  className?: string;
}

export const Component = ({
  label,
  variant = 'default',
  className,
  children
}: PropsWithChildren<ComponentProps>) => {
  return (
    <div
      className={clsx(
        'component',
        `component--${variant}`,
        className
      )}
      role="region"
      aria-label={label}
    >
      <div className="component__header">
        {label}
      </div>
      <div className="component__content">
        {children}
      </div>
    </div>
  );
};

Component.displayName = 'Component';
```

:::
