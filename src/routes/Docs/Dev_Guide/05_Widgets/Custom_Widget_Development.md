# Custom Widget Development

This guide explains how to create custom widgets for SvelteCMS.

## Widget Architecture

A widget in SvelteCMS consists of three main parts:

1. Widget Definition
2. Widget Component
3. Widget Configuration

### Widget Definition

```typescript
// widgets/CustomWidget/index.ts
import type { Widget } from '@sveltecms/core';
import CustomWidgetComponent from './CustomWidget.svelte';

export const CustomWidget: Widget = {
    name: 'CustomWidget',
    component: CustomWidgetComponent,
    description: 'A custom widget for specific functionality',
    version: '1.0.0',
    author: 'Your Name',
    options: {
        // Widget-specific options
        customOption1: {
            type: 'string',
            default: 'default value'
        },
        customOption2: {
            type: 'number',
            required: true
        }
    },
    validation: {
        // Custom validation rules
    }
};
```

### Widget Component

```svelte
<!-- widgets/CustomWidget/CustomWidget.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { WidgetProps } from '@sveltecms/core';
    
    export let value: any = null;
    export let options: Record<string, any> = {};
    export let validation: Record<string, any> = {};
    export let error: string | null = null;
    
    const dispatch = createEventDispatcher();
    
    function handleChange(event: Event) {
        const newValue = (event.target as HTMLInputElement).value;
        dispatch('change', {
            value: newValue,
            valid: validateValue(newValue)
        });
    }
    
    function validateValue(val: any): boolean {
        // Custom validation logic
        return true;
    }
</script>

<div class="custom-widget">
    <input
        type="text"
        {value}
        on:change={handleChange}
        class:error={!!error}
    />
    
    {#if error}
        <div class="error-message">{error}</div>
    {/if}
</div>

<style>
    .custom-widget {
        /* Widget styles */
    }
    
    .error {
        border-color: var(--error-color);
    }
    
    .error-message {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
</style>
```

## Registration

### Local Registration

```typescript
// cms.config.ts
import { CustomWidget } from './widgets/CustomWidget';

export default {
    widgets: {
        custom: CustomWidget
    }
};
```

### Marketplace Registration

```typescript
// package.json
{
    "name": "@sveltecms/widget-custom",
    "version": "1.0.0",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "sveltecms": {
        "type": "widget",
        "name": "custom"
    }
}
```

## Testing

### Unit Tests

```typescript
// widgets/CustomWidget/CustomWidget.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import CustomWidget from './CustomWidget.svelte';

describe('CustomWidget', () => {
    it('renders with default value', () => {
        const { getByRole } = render(CustomWidget, {
            props: {
                value: 'test'
            }
        });
        
        const input = getByRole('textbox');
        expect(input.value).toBe('test');
    });
    
    it('emits change event', async () => {
        const { component, getByRole } = render(CustomWidget);
        const input = getByRole('textbox');
        
        let emitted = false;
        component.$on('change', () => {
            emitted = true;
        });
        
        await fireEvent.change(input, { target: { value: 'new value' } });
        expect(emitted).toBe(true);
    });
    
    it('shows error message', () => {
        const { getByText } = render(CustomWidget, {
            props: {
                error: 'Invalid input'
            }
        });
        
        expect(getByText('Invalid input')).toBeInTheDocument();
    });
});
```

### Integration Tests

```typescript
// tests/integration/CustomWidget.test.ts
import { test, expect } from '@playwright/test';

test('CustomWidget in CMS form', async ({ page }) => {
    await page.goto('/admin/content/create');
    
    // Fill widget
    await page.fill('[data-testid="custom-widget"]', 'test value');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify submission
    expect(page.url()).toContain('/admin/content');
});
```

## Advanced Features

### State Management

```typescript
// widgets/CustomWidget/store.ts
import { writable } from 'svelte/store';

export const widgetState = writable({
    value: null,
    valid: true,
    touched: false
});

export function resetState() {
    widgetState.set({
        value: null,
        valid: true,
        touched: false
    });
}
```

### Async Operations

```typescript
// widgets/CustomWidget/async.ts
export async function fetchData(params: any) {
    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            body: JSON.stringify(params)
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
```

### Validation

```typescript
// widgets/CustomWidget/validation.ts
export interface ValidationRule {
    type: string;
    message: string;
    validate: (value: any, options?: any) => boolean | Promise<boolean>;
}

export const validationRules: Record<string, ValidationRule> = {
    required: {
        type: 'required',
        message: 'This field is required',
        validate: (value) => value != null && value !== ''
    },
    custom: {
        type: 'custom',
        message: 'Invalid value',
        validate: async (value, options) => {
            // Custom validation logic
            return true;
        }
    }
};
```

## Styling

### Theme Integration

```typescript
// widgets/CustomWidget/styles.ts
export const theme = {
    variables: {
        '--custom-widget-bg': '#ffffff',
        '--custom-widget-border': '1px solid #ccc',
        '--custom-widget-radius': '4px',
        '--custom-widget-padding': '0.5rem'
    },
    dark: {
        '--custom-widget-bg': '#2d2d2d',
        '--custom-widget-border': '1px solid #444'
    }
};
```

### CSS Modules

```scss
// widgets/CustomWidget/styles.scss
.widget {
    background: var(--custom-widget-bg);
    border: var(--custom-widget-border);
    border-radius: var(--custom-widget-radius);
    padding: var(--custom-widget-padding);
    
    &:focus-within {
        border-color: var(--focus-color);
    }
    
    &.error {
        border-color: var(--error-color);
    }
}
```

## Documentation

### JSDoc Comments

```typescript
/**
 * Custom widget for specific functionality
 * @typedef {Object} CustomWidgetOptions
 * @property {string} [customOption1='default'] - Description of option 1
 * @property {number} customOption2 - Description of option 2
 */
export interface CustomWidgetOptions {
    customOption1?: string;
    customOption2: number;
}

/**
 * Validates widget value
 * @param {any} value - The value to validate
 * @returns {boolean} Whether the value is valid
 */
function validateValue(value: any): boolean {
    // Validation logic
    return true;
}
```

### README

```markdown
# Custom Widget

A custom widget for SvelteCMS that provides specific functionality.

## Installation

```bash
npm install @sveltecms/widget-custom
```

## Usage

```typescript
import { CustomWidget } from '@sveltecms/widget-custom';

// Register widget
cms.registerWidget('custom', CustomWidget);

// Use in collection
{
    fields: {
        customField: {
            type: 'custom',
            options: {
                customOption1: 'value',
                customOption2: 42
            }
        }
    }
}
```

## Options

- `customOption1` (string, optional): Description of option 1
- `customOption2` (number, required): Description of option 2

## Events

- `change`: Emitted when value changes
- `focus`: Emitted on focus
- `blur`: Emitted on blur

## Styling

The widget uses CSS variables for theming. Override these variables to customize the appearance:

```css
:root {
    --custom-widget-bg: #ffffff;
    --custom-widget-border: 1px solid #ccc;
    --custom-widget-radius: 4px;
    --custom-widget-padding: 0.5rem;
}
```

## License

MIT
```
