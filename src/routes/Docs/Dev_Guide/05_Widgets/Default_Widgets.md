# Default Widgets

This document provides detailed information about the built-in widgets that come with SvelteCMS.

## Text Widgets

### TextInput

A single-line text input widget for basic text entry.

```typescript
interface TextInputOptions extends WidgetOptions {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    mask?: string;
    placeholder?: string;
    autocomplete?: string;
}
```

Features:
- Pattern validation
- Input masking
- Character limits
- Autocomplete
- Placeholder text

### TextArea

Multi-line text input for longer content.

```typescript
interface TextAreaOptions extends WidgetOptions {
    minLength?: number;
    maxLength?: number;
    rows?: number;
    cols?: number;
    autoResize?: boolean;
    maxRows?: number;
}
```

Features:
- Auto-resize
- Line counting
- Character limits
- Minimum/maximum rows
- Paste handling

### RichText

WYSIWYG editor for formatted text content.

```typescript
interface RichTextOptions extends WidgetOptions {
    toolbar?: string[];
    plugins?: string[];
    height?: number;
    mediaUpload?: boolean;
    formats?: string[];
    sanitize?: boolean;
}
```

Features:
- Formatting toolbar
- Media embedding
- HTML sanitization
- Custom plugins
- Format conversion

## Number Widgets

### NumberInput

Input for numeric values with validation.

```typescript
interface NumberInputOptions extends WidgetOptions {
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    unit?: string;
    format?: string;
}
```

Features:
- Range validation
- Step controls
- Unit display
- Format options
- Precision control

### Currency

Specialized input for monetary values.

```typescript
interface CurrencyOptions extends WidgetOptions {
    currency?: string;
    locale?: string;
    precision?: number;
    allowNegative?: boolean;
    symbolPosition?: 'prefix' | 'suffix';
}
```

Features:
- Currency formatting
- Locale support
- Decimal precision
- Negative values
- Symbol positioning

## Date and Time Widgets

### DatePicker

Calendar-based date selection widget.

```typescript
interface DatePickerOptions extends WidgetOptions {
    format?: string;
    min?: Date | string;
    max?: Date | string;
    firstDayOfWeek?: number;
    locale?: string;
    allowRange?: boolean;
}
```

Features:
- Date range selection
- Format options
- Locale support
- Min/max dates
- Custom calendar display

### TimePicker

Time selection with format options.

```typescript
interface TimePickerOptions extends WidgetOptions {
    format?: '12h' | '24h';
    step?: number;
    min?: string;
    max?: string;
    withSeconds?: boolean;
    timezone?: string;
}
```

Features:
- 12/24 hour format
- Minute intervals
- Time restrictions
- Seconds option
- Timezone support

## Selection Widgets

### Select

Single option selection from a list.

```typescript
interface SelectOptions extends WidgetOptions {
    options: Array<Option>;
    allowSearch?: boolean;
    groupBy?: string;
    customOption?: boolean;
    async?: boolean;
    loadOptions?: (query: string) => Promise<Option[]>;
}

interface Option {
    value: any;
    label: string;
    group?: string;
    disabled?: boolean;
}
```

Features:
- Option grouping
- Search/filter
- Custom options
- Async loading
- Disabled states

### MultiSelect

Multiple option selection with tags.

```typescript
interface MultiSelectOptions extends SelectOptions {
    max?: number;
    delimiter?: string;
    sortable?: boolean;
    chips?: boolean;
    selectAll?: boolean;
}
```

Features:
- Tag interface
- Selection limits
- Sortable selections
- Chip display
- Select all option

## Media Widgets

### ImageUpload

Image upload with preview and editing.

```typescript
interface ImageUploadOptions extends WidgetOptions {
    maxSize?: number;
    formats?: string[];
    crop?: boolean;
    resize?: boolean;
    aspectRatio?: number;
    quality?: number;
    multiple?: boolean;
}
```

Features:
- Image preview
- Crop/resize
- Format validation
- Size limits
- Multiple upload

### FileUpload

General file upload widget.

```typescript
interface FileUploadOptions extends WidgetOptions {
    maxSize?: number;
    accept?: string[];
    multiple?: boolean;
    directory?: boolean;
    maxFiles?: number;
    autoUpload?: boolean;
}
```

Features:
- File type validation
- Progress display
- Multiple files
- Directory upload
- Auto upload

## Special Widgets

### JSON

JSON data editor with validation.

```typescript
interface JSONOptions extends WidgetOptions {
    schema?: JSONSchema7;
    format?: boolean;
    height?: number;
    collapsible?: boolean;
    mode?: 'tree' | 'code' | 'form';
}
```

Features:
- Schema validation
- Format validation
- Tree view
- Code view
- Form view

### CodeEditor

Code editing with syntax highlighting.

```typescript
interface CodeEditorOptions extends WidgetOptions {
    language?: string;
    theme?: string;
    lineNumbers?: boolean;
    minimap?: boolean;
    autoComplete?: boolean;
    lint?: boolean;
}
```

Features:
- Syntax highlighting
- Multiple languages
- Line numbers
- Code completion
- Error checking

## Validation

### Common Validation Rules

```typescript
interface ValidationRules {
    required?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => boolean | Promise<boolean>;
}
```

### Example Validation Implementation

```typescript
const validation = {
    required: {
        type: 'required',
        message: 'This field is required',
        validate: (value) => value != null && value !== ''
    },
    pattern: {
        type: 'pattern',
        message: 'Invalid format',
        validate: (value, pattern) => new RegExp(pattern).test(value)
    },
    range: {
        type: 'range',
        message: 'Value out of range',
        validate: (value, { min, max }) => {
            const num = Number(value);
            return num >= min && num <= max;
        }
    }
};
```

## Styling

### Default Theme Variables

```css
:root {
    /* Input styles */
    --input-height: 2.5rem;
    --input-padding: 0.5rem;
    --input-border: 1px solid #ccc;
    --input-radius: 4px;
    
    /* Focus states */
    --focus-color: #007bff;
    --focus-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    
    /* Error states */
    --error-color: #dc3545;
    --error-border: 1px solid #dc3545;
    
    /* Typography */
    --font-family: system-ui, -apple-system, sans-serif;
    --font-size: 1rem;
    --line-height: 1.5;
}
```

### Customization Example

```typescript
// widgets/CustomInput.ts
export const customStyles = {
    input: `
        height: var(--input-height);
        padding: var(--input-padding);
        border: var(--input-border);
        border-radius: var(--input-radius);
        font-family: var(--font-family);
        font-size: var(--font-size);
        line-height: var(--line-height);
        
        &:focus {
            border-color: var(--focus-color);
            box-shadow: var(--focus-shadow);
        }
        
        &.error {
            border: var(--error-border);
        }
    `
};
```

## Event Handling

### Common Events

```typescript
interface WidgetEvents {
    change: CustomEvent<any>;
    focus: FocusEvent;
    blur: FocusEvent;
    input: InputEvent;
    error: CustomEvent<ValidationError>;
    clear: CustomEvent<void>;
}
```

### Event Implementation

```typescript
// Inside widget component
function handleChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    dispatch('change', {
        value,
        valid: validate(value),
        touched: true
    });
}
```

## Accessibility

### ARIA Attributes

```typescript
interface AriaAttributes {
    role?: string;
    label?: string;
    description?: string;
    errorMessage?: string;
    required?: boolean;
    invalid?: boolean;
}
```

### Implementation Example

```svelte
<div class="widget">
    <label
        id="{id}-label"
        for={id}
    >
        {label}
    </label>
    <input
        {id}
        aria-labelledby="{id}-label"
        aria-describedby="{id}-description"
        aria-required={required}
        aria-invalid={!!error}
        {...props}
    />
    {#if error}
        <div
            id="{id}-error"
            class="error"
            role="alert"
        >
            {error}
        </div>
    {/if}
</div>
```
