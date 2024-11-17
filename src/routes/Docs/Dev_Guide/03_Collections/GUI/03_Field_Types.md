# Field Types

This document details all available field types in SvelteCMS and their configuration options.

## Basic Field Types

### Text Fields

```typescript
interface TextField {
    type: 'text';
    multiline?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: 'email' | 'url' | 'slug' | 'phone';
    transform?: 'lowercase' | 'uppercase' | 'capitalize';
}
```

### Rich Text Fields

```typescript
interface RichTextField {
    type: 'richtext';
    toolbar: {
        basic: boolean;
        formatting: boolean;
        lists: boolean;
        links: boolean;
        media: boolean;
        tables: boolean;
        code: boolean;
    };
    plugins?: string[];
    allowHtml: boolean;
    maxLength?: number;
}
```

### Number Fields

```typescript
interface NumberField {
    type: 'number';
    subtype: 'integer' | 'float' | 'currency';
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    currency?: string;
    format?: {
        locale: string;
        notation: 'standard' | 'scientific' | 'engineering' | 'compact';
    };
}
```

### Boolean Fields

```typescript
interface BooleanField {
    type: 'boolean';
    style: 'checkbox' | 'switch' | 'radio';
    labelTrue?: string;
    labelFalse?: string;
    defaultValue: boolean;
}
```

## Date and Time Fields

### Date Fields

```typescript
interface DateField {
    type: 'date';
    includeTime: boolean;
    timeFormat: '12h' | '24h';
    timezone: string;
    min?: string;
    max?: string;
    disabledDates?: string[];
    disabledDays?: number[];
}
```

### DateTime Range Fields

```typescript
interface DateRangeField {
    type: 'daterange';
    includeTime: boolean;
    minDuration?: string;
    maxDuration?: string;
    allowOverlap: boolean;
}
```

## Media Fields

### Image Fields

```typescript
interface ImageField {
    type: 'image';
    allowMultiple: boolean;
    maxFiles?: number;
    acceptedTypes: string[];
    maxSize: number;
    dimensions?: {
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        aspectRatio?: number;
    };
    transformations?: {
        resize?: {
            width: number;
            height: number;
            fit: 'cover' | 'contain' | 'fill';
        };
        quality?: number;
        format?: 'jpg' | 'png' | 'webp';
    };
}
```

### File Fields

```typescript
interface FileField {
    type: 'file';
    allowMultiple: boolean;
    maxFiles?: number;
    acceptedTypes: string[];
    maxSize: number;
    storage?: {
        provider: 'local' | 's3' | 'cloudinary';
        path?: string;
        access?: 'public' | 'private';
    };
}
```

## Reference Fields

### Single Reference

```typescript
interface SingleReferenceField {
    type: 'reference';
    collection: string;
    displayField: string;
    searchFields?: string[];
    filters?: {
        field: string;
        operator: string;
        value: any;
    }[];
    createNew?: boolean;
    inline?: boolean;
}
```

### Multiple Reference

```typescript
interface MultipleReferenceField {
    type: 'references';
    collection: string;
    displayField: string;
    searchFields?: string[];
    minItems?: number;
    maxItems?: number;
    unique: boolean;
    sortable: boolean;
    createNew?: boolean;
}
```

## Component Fields

### Single Component

```typescript
interface ComponentField {
    type: 'component';
    component: string;
    allowedComponents?: string[];
    defaultComponent?: string;
    inline?: boolean;
}
```

### Component List

```typescript
interface ComponentListField {
    type: 'componentList';
    allowedComponents: string[];
    minItems?: number;
    maxItems?: number;
    sortable: boolean;
    layout?: 'grid' | 'list' | 'tabs';
}
```

## Complex Fields

### Array Fields

```typescript
interface ArrayField {
    type: 'array';
    of: FieldConfig;
    minItems?: number;
    maxItems?: number;
    unique: boolean;
    sortable: boolean;
    layout?: 'grid' | 'list' | 'table';
    defaultValue?: any[];
}
```

### Object Fields

```typescript
interface ObjectField {
    type: 'object';
    fields: Record<string, FieldConfig>;
    collapsed?: boolean;
    layout?: 'grid' | 'tabs';
    defaultValue?: Record<string, any>;
}
```

## Special Fields

### Computed Fields

```typescript
interface ComputedField {
    type: 'computed';
    formula: string;
    dependencies: string[];
    cacheResult: boolean;
    updateTrigger: 'onChange' | 'onSave';
}
```

### Virtual Fields

```typescript
interface VirtualField {
    type: 'virtual';
    resolver: string;
    args?: Record<string, any>;
    cacheResult: boolean;
    ttl?: number;
}
```

### JSON Fields

```typescript
interface JsonField {
    type: 'json';
    schema?: object;
    defaultValue?: any;
    editor: 'code' | 'tree' | 'form';
}
```

## Field UI Configuration

### Common UI Options

```typescript
interface FieldUiConfig {
    widget?: string;
    label?: string;
    description?: string;
    placeholder?: string;
    hint?: string;
    icon?: string;
    group?: string;
    width?: 'full' | 'half' | 'third' | number;
    hidden?: boolean;
    disabled?: boolean;
    conditions?: {
        field: string;
        operator: string;
        value: any;
        action: 'show' | 'hide' | 'enable' | 'disable';
    }[];
}
```

### Field Validation

```typescript
interface FieldValidation {
    required?: boolean;
    unique?: boolean;
    custom?: string;
    messages?: {
        required?: string;
        pattern?: string;
        min?: string;
        max?: string;
        custom?: string;
    };
}
```

### Field Permissions

```typescript
interface FieldPermissions {
    roles: {
        [roleId: string]: {
            read: boolean;
            write: boolean;
        };
    };
    condition?: {
        field: string;
        operator: string;
        value: any;
    };
}
```
