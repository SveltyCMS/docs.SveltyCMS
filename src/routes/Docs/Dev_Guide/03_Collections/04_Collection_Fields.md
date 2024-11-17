---
title: "Collection Fields"
description: "Guide to field types and configuration in SvelteCMS collections"
icon: "mdi:form-textbox"
published: true
order: 4
---

# Collection Fields

This guide explains the available field types and their configuration options in SvelteCMS collections.

## Field Types Overview

### Basic Field Types

```typescript
type BasicFieldType = 
    | 'text'      // Single line text
    | 'textarea'  // Multi-line text
    | 'number'    // Numeric input
    | 'boolean'   // True/false checkbox
    | 'date'      // Date picker
    | 'datetime'  // Date and time picker
    | 'email'     // Email input with validation
    | 'url'       // URL input with validation
    | 'password'  // Password input with masking
    | 'color'     // Color picker
    | 'select'    // Single select dropdown
    | 'multiselect'; // Multi-select dropdown
```

### Rich Content Fields

```typescript
type RichContentFieldType =
    | 'richtext'    // WYSIWYG editor
    | 'markdown'    // Markdown editor
    | 'code'        // Code editor with syntax highlighting
    | 'json'        // JSON editor with validation
    | 'html';       // HTML editor
```

### Media Fields

```typescript
type MediaFieldType =
    | 'image'     // Image upload and preview
    | 'file'      // File upload
    | 'gallery'   // Multiple image upload
    | 'video'     // Video upload and preview
    | 'audio';    // Audio upload and preview
```

### Relationship Fields

```typescript
type RelationshipFieldType =
    | 'reference'      // Single reference to another entry
    | 'references'     // Multiple references to other entries
    | 'lookup'         // Lookup value from referenced entry
    | 'embedded';      // Embedded sub-document
```

## Field Configuration

### Base Field Configuration

All fields share these base properties:

```typescript
interface BaseFieldConfig {
    name: string;           // Field identifier
    type: FieldType;        // Type of field
    label: string;          // Display label
    description?: string;   // Help text
    required?: boolean;     // Is field required?
    unique?: boolean;       // Must value be unique?
    defaultValue?: any;     // Default value
    hidden?: boolean;       // Hide in UI?
    readOnly?: boolean;     // Prevent editing?
    group?: string;         // Group fields together
    order?: number;         // Display order
    conditions?: FieldCondition[]; // Show/hide based on conditions
}
```

### Text Field Configuration

```typescript
interface TextField extends BaseFieldConfig {
    type: 'text' | 'textarea';
    minLength?: number;
    maxLength?: number;
    pattern?: string;       // Regex pattern
    placeholder?: string;
    transform?: 'lowercase' | 'uppercase' | 'capitalize';
}
```

### Number Field Configuration

```typescript
interface NumberField extends BaseFieldConfig {
    type: 'number';
    min?: number;
    max?: number;
    step?: number;
    format?: {
        type: 'decimal' | 'currency' | 'percent';
        precision?: number;
        locale?: string;
    };
}
```

### Select Field Configuration

```typescript
interface SelectField extends BaseFieldConfig {
    type: 'select' | 'multiselect';
    options: {
        value: string | number;
        label: string;
        icon?: string;
    }[];
    allowCustom?: boolean;  // Allow custom values
    source?: {             // Dynamic options
        collection: string;
        valueField: string;
        labelField: string;
    };
}
```

### Rich Content Configuration

```typescript
interface RichTextField extends BaseFieldConfig {
    type: 'richtext' | 'markdown';
    toolbar?: string[];    // Available formatting options
    plugins?: string[];    // Editor plugins
    height?: number;       // Editor height
    mediaLibrary?: {      // Media handling
        enabled: boolean;
        allowedTypes: string[];
    };
}
```

### Media Field Configuration

```typescript
interface MediaField extends BaseFieldConfig {
    type: MediaFieldType;
    allowedTypes?: string[];   // Mime types
    maxSize?: number;          // Max file size in bytes
    dimensions?: {             // Image dimensions
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number;
        maxHeight?: number;
        aspectRatio?: number;
    };
    storage?: {                // Storage config
        provider: string;
        path?: string;
        transformations?: {
            resize?: [number, number];
            format?: string;
            quality?: number;
        }[];
    };
}
```

### Reference Field Configuration

```typescript
interface ReferenceField extends BaseFieldConfig {
    type: 'reference' | 'references';
    collection: string;    // Referenced collection
    displayField: string; // Field to display
    filter?: Record<string, any>; // Filter available entries
    sort?: {              // Sort options
        field: string;
        order: 'asc' | 'desc';
    };
    createNew?: boolean;  // Allow creating new entries
    inline?: boolean;     // Edit inline
}
```

## Field Validation

### Validation Rules

```typescript
interface FieldValidation {
    type: 'required' | 'format' | 'custom';
    message: string;
    validate: (value: any, context: ValidationContext) => Promise<boolean>;
}

interface ValidationContext {
    entry: Entry;
    collection: Collection;
    user: User;
}
```

Example validation:

```typescript
const emailValidation: FieldValidation = {
    type: 'format',
    message: 'Invalid email format',
    validate: async (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
};
```

## Field Display

### Display Options

Configure how fields are displayed:

```typescript
interface FieldDisplay {
    list?: {              // List view display
        visible: boolean;
        width?: number;
        format?: (value: any) => string;
    };
    view?: {              // Detail view display
        component?: string;
        layout?: 'full' | 'half' | 'third';
        format?: (value: any) => string;
    };
    edit?: {              // Edit form display
        component?: string;
        layout?: 'full' | 'half' | 'third';
        help?: string;
    };
}
```

Example display configuration:

```typescript
const titleDisplay: FieldDisplay = {
    list: {
        visible: true,
        width: 200,
        format: (value) => value.toUpperCase()
    },
    view: {
        component: 'HeadingDisplay',
        layout: 'full'
    },
    edit: {
        component: 'TextInput',
        layout: 'full',
        help: 'Enter a descriptive title'
    }
};
```

## Field Groups

Organize fields into groups:

```typescript
interface FieldGroup {
    name: string;
    label: string;
    description?: string;
    icon?: string;
    collapsed?: boolean;
    fields: string[];     // Field names in this group
}
```

Example field groups:

```typescript
const contentGroups: FieldGroup[] = [
    {
        name: 'basic',
        label: 'Basic Information',
        icon: 'mdi:information',
        fields: ['title', 'slug', 'description']
    },
    {
        name: 'content',
        label: 'Main Content',
        icon: 'mdi:text',
        fields: ['body', 'images']
    },
    {
        name: 'meta',
        label: 'Metadata',
        icon: 'mdi:tag',
        collapsed: true,
        fields: ['tags', 'categories', 'seo']
    }
];
```

## Next Steps

1. [Collection Templates](./05_Collection_Templates.md)
2. [API Integration](./06_API_Integration.md)
3. [Advanced Features](./07_Advanced_Features.md)
4. [Customization](./08_Customization.md)
