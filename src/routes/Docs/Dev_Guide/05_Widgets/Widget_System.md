# Widget System in SvelteCMS

The widget system is a core feature of SvelteCMS that provides flexible, extensible form controls for collections. This guide explains the widget architecture and how to work with widgets.

## Overview

Widgets are reusable components that:
- Provide form controls for different data types
- Handle data validation and transformation
- Support custom rendering and behavior
- Can be installed from the marketplace
- Are fully customizable and extensible

## Widget Architecture

### Core Concepts

1. **Widget Definition**
   - Component structure
   - Data handling
   - Validation rules
   - UI configuration
   - Event handling

2. **Widget Registry**
   - Widget registration
   - Dependency management
   - Version control
   - Marketplace integration

3. **Widget Context**
   - Form context
   - Collection data
   - Validation state
   - UI state
   - Translations

## Default Widgets

SvelteCMS comes with a set of built-in widgets for common data types:

### Text Input Widgets

1. **TextInput**
   - Single line text
   - Pattern validation
   - Character limits
   - Placeholder support
   - Input masks

2. **TextArea**
   - Multi-line text
   - Auto-resize
   - Character count
   - Max length
   - Line limits

3. **RichText**
   - WYSIWYG editing
   - HTML sanitization
   - Custom toolbars
   - Media integration
   - Format options

### Number Widgets

1. **NumberInput**
   - Integer/decimal
   - Range validation
   - Step control
   - Unit display
   - Format options

2. **Currency**
   - Currency symbols
   - Decimal places
   - Thousand separators
   - Currency conversion
   - Format localization

### Date and Time Widgets

1. **DatePicker**
   - Date selection
   - Range selection
   - Calendar display
   - Format options
   - Timezone support

2. **TimePicker**
   - Time selection
   - 12/24 hour format
   - Minute intervals
   - Timezone handling
   - Range restrictions

### Selection Widgets

1. **Select**
   - Single selection
   - Option groups
   - Search/filter
   - Custom rendering
   - Dynamic options

2. **MultiSelect**
   - Multiple selection
   - Tags interface
   - Option ordering
   - Selection limits
   - Group selection

### Media Widgets

1. **ImageUpload**
   - Image preview
   - Crop/resize
   - Format validation
   - Size limits
   - Alt text

2. **FileUpload**
   - File types
   - Size validation
   - Progress display
   - Multiple files
   - Drag and drop

### Special Widgets

1. **JSON**
   - JSON editing
   - Schema validation
   - Format validation
   - Syntax highlighting
   - Tree view

2. **CodeEditor**
   - Syntax highlighting
   - Line numbers
   - Code completion
   - Error checking
   - Multiple languages

## Creating Custom Widgets

### Widget Structure

```typescript
interface Widget {
    // Core widget definition
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;

    // Component definition
    component: typeof SvelteComponent;
    
    // Schema for widget options
    optionsSchema: JSONSchema7;
    
    // Default configuration
    defaultOptions: WidgetOptions;
    
    // Validation rules
    validationRules: ValidationRule[];
    
    // Data transformation
    transform?: (value: any) => any;
    
    // UI configuration
    ui: {
        icon?: string;
        preview?: typeof SvelteComponent;
        settings?: typeof SvelteComponent;
    };
}

interface WidgetOptions {
    // Common widget options
    label?: string;
    placeholder?: string;
    helpText?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    
    // Widget-specific options
    [key: string]: any;
}

interface ValidationRule {
    type: string;
    message: string;
    validate: (value: any, options?: any) => boolean | Promise<boolean>;
}
```

### Example Widget Implementation

```typescript
// widgets/ColorPicker.ts
import type { Widget } from '@sveltecms/types';
import ColorPickerComponent from './ColorPicker.svelte';
import ColorPickerSettings from './ColorPickerSettings.svelte';

export const ColorPicker: Widget = {
    name: 'color-picker',
    version: '1.0.0',
    description: 'Color selection widget with preview',
    author: 'Your Name',
    license: 'MIT',

    component: ColorPickerComponent,

    optionsSchema: {
        type: 'object',
        properties: {
            format: {
                type: 'string',
                enum: ['hex', 'rgb', 'hsl'],
                default: 'hex'
            },
            allowAlpha: {
                type: 'boolean',
                default: false
            },
            presets: {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        }
    },

    defaultOptions: {
        format: 'hex',
        allowAlpha: false,
        presets: []
    },

    validationRules: [
        {
            type: 'format',
            message: 'Invalid color format',
            validate: (value, format) => {
                switch (format) {
                    case 'hex':
                        return /^#[0-9A-F]{6}$/i.test(value);
                    case 'rgb':
                        return /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/.test(value);
                    default:
                        return true;
                }
            }
        }
    ],

    transform: (value) => {
        // Transform color value if needed
        return value.toLowerCase();
    },

    ui: {
        icon: 'mdi:palette',
        settings: ColorPickerSettings
    }
};
```

### Widget Component Template

```svelte
<!-- ColorPicker.svelte -->
<script lang="ts">
    import { getContext } from 'svelte';
    import type { WidgetContext } from '@sveltecms/types';

    // Get widget context
    const context = getContext<WidgetContext>('widget');
    const { value, options, validation, onChange } = context;

    // Handle color change
    function handleChange(event: CustomEvent) {
        const newValue = event.detail;
        onChange(newValue);
    }
</script>

<div class="color-picker">
    <div class="color-preview" style="background-color: {$value}"></div>
    <input
        type="text"
        bind:value={$value}
        placeholder={options.placeholder}
        disabled={options.disabled}
        on:change={handleChange}
    />
    {#if $validation.error}
        <div class="error">{$validation.message}</div>
    {/if}
</div>

<style>
    .color-picker {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .color-preview {
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .error {
        color: red;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
</style>
```

## Widget Marketplace Integration

### Publishing Widgets

1. **Package Preparation**
   ```json
   {
       "name": "@sveltecms/widget-colorpicker",
       "version": "1.0.0",
       "type": "module",
       "main": "dist/index.js",
       "sveltecms": {
           "widget": {
               "name": "color-picker",
               "displayName": "Color Picker",
               "category": "input",
               "tags": ["color", "input", "design"]
           }
       }
   }
   ```

2. **Documentation Requirements**
   - README.md with usage instructions
   - API documentation
   - Examples and screenshots
   - Configuration options
   - Version history

3. **Quality Guidelines**
   - Test coverage
   - TypeScript support
   - Accessibility compliance
   - Performance benchmarks
   - Security review

### Installation Process

1. **From Marketplace**
   ```bash
   npx sveltecms widget add @sveltecms/widget-colorpicker
   ```

2. **Manual Installation**
   ```bash
   npm install @sveltecms/widget-colorpicker
   ```

3. **Widget Registration**
   ```typescript
   import { registerWidget } from '@sveltecms/core';
   import { ColorPicker } from '@sveltecms/widget-colorpicker';

   registerWidget(ColorPicker);
   ```

## Best Practices

### 1. Widget Design

- Follow SvelteCMS UI guidelines
- Support keyboard navigation
- Implement error states
- Provide loading states
- Use consistent styling

### 2. Validation

- Clear error messages
- Real-time validation
- Custom validation rules
- Cross-field validation
- Async validation

### 3. Performance

- Lazy loading
- Efficient rendering
- Memory management
- Bundle size optimization
- Caching strategies

### 4. Accessibility

- ARIA labels
- Keyboard support
- High contrast support
- Screen reader support
- Focus management

## Testing

### Unit Tests

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker Widget', () => {
    it('should validate hex color format', async () => {
        const widget = render(ColorPicker, {
            props: {
                options: { format: 'hex' }
            }
        });

        const input = widget.getByRole('textbox');
        await fireEvent.input(input, { target: { value: '#FF0000' } });
        expect(widget.validation.error).toBeFalsy();

        await fireEvent.input(input, { target: { value: 'invalid' } });
        expect(widget.validation.error).toBeTruthy();
    });
});
```

### Integration Tests

```typescript
import { test, expect } from '@playwright/test';

test('ColorPicker in collection form', async ({ page }) => {
    await page.goto('/admin/collections/create');
    await page.click('button[data-widget="color-picker"]');
    
    const picker = page.locator('.color-picker');
    await picker.click();
    await picker.fill('#FF0000');
    
    expect(await picker.getAttribute('value')).toBe('#ff0000');
});
```

## Troubleshooting

### Common Issues

1. **Validation Problems**
   - Check validation rules
   - Verify input format
   - Debug transform functions
   - Review error messages

2. **Rendering Issues**
   - Check component mounting
   - Verify context usage
   - Debug style conflicts
   - Review lifecycle hooks

3. **Performance Issues**
   - Profile rendering
   - Check memory usage
   - Optimize updates
   - Review event handlers
