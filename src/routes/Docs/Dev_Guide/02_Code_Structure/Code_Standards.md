# SvelteCMS Code Structure and Standards

## Overview

SvelteCMS follows a structured, TypeScript-based architecture with a focus on accessibility, type safety, and modern development practices. The system uses:

- **TypeScript** for type safety and better developer experience
- **TailwindCSS** for utility-first styling
- **Skeleton.dev** for UI components
- **SuperForms** with Valibot for form handling and validation
- **ParaglideJS** for internationalization

## Code Structure

### File Organization

```
SvelteCMS/
├── src/
│   ├── auth/               # Authentication system
│   ├── components/         # Reusable components
│   ├── routes/             # SvelteKit routes
│   ├── stores/             # Svelte stores
│   ├── utils/             # Utility functions
│   ├── paraglide/         # i18n messages
│   └── databases/         # Database adapters
```

### File Header Standards

Each file should include a comprehensive JSDoc header:

```typescript
/**
 * @file Component/Module Name
 * @description Brief description of the file's purpose
 *
 * Features:
 * - Feature 1
 * - Feature 2
 * 
 * Usage:
 * How to use this component/module
 *
 * @example
 * // Example usage code
 */
```

For Svelte components:

```svelte
<!-- 
@file Component Name
@component
**Brief description**

Features:
 - Feature 1
 - Feature 2
 - Feature 3

Props:
 - prop1: Type - Description
 - prop2: Type - Description

Events:
 - event1: EventType - Description
 - event2: EventType - Description
-->
```

### TypeScript Integration

```typescript
// Type definitions
interface ComponentProps {
    title: string;
    description?: string;
    onAction: (id: string) => void;
}

// Component with TypeScript
<script lang="ts">
    import type { ComponentProps } from './types';
    
    const { title, description = '', onAction } = $props<ComponentProps>();
</script>
```

## Form Handling

### SuperForms with Valibot

```typescript
// Form schema definition
import { object, string, email, minLength } from 'valibot';

export const loginFormSchema = object({
    email: string([
        email('Invalid email format')
    ]),
    password: string([
        minLength(8, 'Password must be at least 8 characters')
    ])
});

// Form implementation
<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';
    import { valibot } from 'sveltekit-superforms/adapters';
    
    const { form, errors, enhance } = superForm(data.form, {
        validators: valibot(loginFormSchema),
        resetForm: true
    });
</script>
```

## Styling with TailwindCSS

### Utility Classes

```svelte
<div class="flex min-h-screen bg-white dark:bg-gray-900">
    <nav class="w-64 border-r border-gray-200 dark:border-gray-700">
        <!-- Navigation content -->
    </nav>
    <main class="flex-1 p-8">
        <!-- Main content -->
    </main>
</div>
```

### Custom Components with Skeleton.dev

```svelte
<script lang="ts">
    import { Button, Modal } from '@skeletonlabs/skeleton';
</script>

<Button variant="filled" color="primary">
    Click Me
</Button>

<Modal bind:open>
    <div class="p-4">
        <h2>Modal Title</h2>
        <p>Modal content goes here</p>
    </div>
</Modal>
```

## Accessibility Features

### ARIA Labels and Roles

```svelte
<button
    type="button"
    aria-label="Close modal"
    aria-expanded={isOpen}
    class="btn-icon"
>
    <span class="sr-only">Close</span>
    <Icon name="close" />
</button>
```

### Focus Management

```typescript
// Focus trap for modals
import { focusTrap } from '@utils/accessibility';

let modalElement: HTMLElement;

$: if (isOpen) {
    focusTrap(modalElement);
}
```

## Internationalization

### ParaglideJS Integration

```typescript
// messages/en.ts
export const messages = {
    welcome: 'Welcome to SvelteCMS',
    login: {
        title: 'Sign In',
        emailLabel: 'Email Address',
        passwordLabel: 'Password'
    }
};

// Component usage
<script lang="ts">
    import * as m from '@src/paraglide/messages';
</script>

<h1>{m.welcome()}</h1>
<label>{m.login.emailLabel()}</label>
```

## State Management

### Svelte Stores

```typescript
// stores/auth.ts
import { writable } from 'svelte/store';

export const user = writable<User | null>(null);
export const isAuthenticated = derived(
    user,
    $user => $user !== null
);

// Usage in components
<script lang="ts">
    import { user, isAuthenticated } from '@stores/auth';
</script>

{#if $isAuthenticated}
    <p>Welcome, {$user.name}!</p>
{/if}
```

## Error Handling

### Form Validation

```typescript
// Form error handling
const { form, errors, enhance } = superForm(data.form, {
    onError: ({ result }) => {
        toastStore.trigger({
            message: result.error.message,
            background: 'variant-filled-error'
        });
    }
});
```

### API Error Handling

```typescript
try {
    const response = await fetch('/api/data');
    if (!response.ok) {
        throw new Error('API request failed');
    }
    const data = await response.json();
} catch (err) {
    logger.error('API Error:', err);
    throw error(500, 'Internal server error');
}
```

## Performance Considerations

### Code Splitting

```typescript
// Lazy loading components
const AdminDashboard = lazy(() => import('./AdminDashboard.svelte'));

// Usage
{#if isAdmin}
    <AdminDashboard />
{/if}
```

### Image Optimization

```svelte
<img
    src="/images/logo.webp"
    srcset="/images/logo-300.webp 300w,
            /images/logo-600.webp 600w"
    sizes="(max-width: 600px) 300px, 600px"
    loading="lazy"
    alt="Company Logo"
/>
```

## Testing Standards

```typescript
// Component testing with Vitest
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Component from './Component.svelte';

describe('Component', () => {
    it('renders correctly', () => {
        render(Component, { props: { title: 'Test' } });
        expect(screen.getByText('Test')).toBeTruthy();
    });
});
```

## Development Workflow

1. **TypeScript First**: Always write TypeScript code with proper type definitions
2. **Component Structure**:
   - Clear file headers
   - Logical prop and event definitions
   - Proper accessibility attributes
3. **Styling**:
   - Use TailwindCSS utilities
   - Follow design system guidelines
   - Ensure dark mode support
4. **Form Handling**:
   - Use SuperForms with Valibot
   - Implement proper validation
   - Handle errors gracefully
5. **Testing**:
   - Write unit tests for components
   - Test accessibility features
   - Ensure responsive design
