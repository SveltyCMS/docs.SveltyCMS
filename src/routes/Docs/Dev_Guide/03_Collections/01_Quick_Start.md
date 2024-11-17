# Collections Quick Start Guide

Collections are the core content types in SvelteCMS. This guide helps you quickly set up and manage collections.

## Basic Collection Structure

```typescript
// collections/[collection-name].collection.ts
interface Collection {
    name: string;
    slug: string;
    fields: Field[];
    options: CollectionOptions;
    hooks?: CollectionHooks;
    access?: AccessControl;
}
```

## Creating a Collection

### 1. Basic Blog Post Collection

```typescript
// collections/blog.collection.ts
export default {
    name: "Blog Post",
    slug: "blog",
    
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
            unique: true,
            localized: true,
            validation: {
                min: 3,
                max: 100
            }
        },
        {
            name: "slug",
            type: "slug",
            from: "title",
            unique: true
        },
        {
            name: "content",
            type: "richtext",
            required: true,
            localized: true,
            editor: {
                toolbar: ["bold", "italic", "link", "image"]
            }
        },
        {
            name: "featured_image",
            type: "media",
            mediaTypes: ["image/*"],
            required: true
        },
        {
            name: "author",
            type: "reference",
            collection: "users",
            display: "name"
        },
        {
            name: "categories",
            type: "reference",
            collection: "categories",
            multiple: true
        },
        {
            name: "published_at",
            type: "datetime",
            default: "now"
        },
        {
            name: "status",
            type: "select",
            options: ["draft", "published", "archived"],
            default: "draft"
        }
    ],
    
    options: {
        timestamps: true,
        versioning: true,
        drafts: true,
        sort: {
            field: "published_at",
            order: "desc"
        },
        pagination: {
            limit: 10
        }
    },
    
    hooks: {
        beforeCreate: async (data) => {
            // Custom logic before creating a post
        },
        afterCreate: async (data) => {
            // Custom logic after creating a post
        }
    },
    
    access: {
        read: ({user}) => true,
        create: ({user}) => user?.role === "editor" || user?.role === "admin",
        update: ({user, item}) => user?.role === "editor" || user?.role === "admin",
        delete: ({user}) => user?.role === "admin"
    }
};
```

### 2. Product Collection Example

```typescript
// collections/product.collection.ts
export default {
    name: "Product",
    slug: "products",
    
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
            localized: true
        },
        {
            name: "sku",
            type: "text",
            required: true,
            unique: true,
            validation: {
                pattern: "^[A-Z]{2}[0-9]{6}$"
            }
        },
        {
            name: "price",
            type: "number",
            required: true,
            validation: {
                min: 0
            }
        },
        {
            name: "description",
            type: "richtext",
            localized: true
        },
        {
            name: "images",
            type: "media",
            mediaTypes: ["image/*"],
            multiple: true,
            required: true,
            min: 1,
            max: 10
        },
        {
            name: "category",
            type: "reference",
            collection: "categories",
            required: true
        },
        {
            name: "specs",
            type: "group",
            fields: [
                {
                    name: "weight",
                    type: "number",
                    unit: "kg"
                },
                {
                    name: "dimensions",
                    type: "group",
                    fields: [
                        {
                            name: "length",
                            type: "number",
                            unit: "cm"
                        },
                        {
                            name: "width",
                            type: "number",
                            unit: "cm"
                        },
                        {
                            name: "height",
                            type: "number",
                            unit: "cm"
                        }
                    ]
                }
            ]
        },
        {
            name: "variants",
            type: "array",
            fields: [
                {
                    name: "color",
                    type: "text"
                },
                {
                    name: "size",
                    type: "select",
                    options: ["S", "M", "L", "XL"]
                },
                {
                    name: "stock",
                    type: "number",
                    min: 0
                }
            ]
        }
    ],
    
    options: {
        timestamps: true,
        versioning: true,
        sort: {
            field: "name",
            order: "asc"
        }
    }
};
```

## Field Types Reference

### Basic Types

```typescript
// Text Field
{
    name: "title",
    type: "text",
    required: true,
    unique: true,
    localized: true,
    validation: {
        min: 3,
        max: 100,
        pattern: "^[A-Za-z]"
    }
}

// Number Field
{
    name: "price",
    type: "number",
    required: true,
    validation: {
        min: 0,
        max: 1000000,
        step: 0.01
    }
}

// Boolean Field
{
    name: "featured",
    type: "boolean",
    default: false
}

// Date Field
{
    name: "published_at",
    type: "datetime",
    default: "now",
    validation: {
        min: "2020-01-01",
        max: "now"
    }
}
```

### Complex Types

```typescript
// Media Field
{
    name: "images",
    type: "media",
    mediaTypes: ["image/*", "video/*"],
    multiple: true,
    min: 1,
    max: 10,
    validation: {
        maxSize: "5MB"
    }
}

// Reference Field
{
    name: "author",
    type: "reference",
    collection: "users",
    display: "name",
    multiple: false,
    required: true
}

// Select Field
{
    name: "status",
    type: "select",
    options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" }
    ],
    default: "draft"
}

// Group Field
{
    name: "address",
    type: "group",
    fields: [
        {
            name: "street",
            type: "text"
        },
        {
            name: "city",
            type: "text"
        },
        {
            name: "country",
            type: "select",
            options: ["US", "UK", "DE"]
        }
    ]
}

// Array Field
{
    name: "tags",
    type: "array",
    of: "text",
    min: 1,
    max: 5
}
```

## Collection Options

```typescript
interface CollectionOptions {
    // Basic options
    timestamps: boolean;
    versioning: boolean;
    drafts: boolean;
    
    // Sorting
    sort: {
        field: string;
        order: "asc" | "desc";
    };
    
    // Pagination
    pagination: {
        limit: number;
    };
    
    // Indexing
    indexes: {
        fields: string[];
        unique?: boolean;
    }[];
    
    // Hooks
    hooks?: {
        beforeCreate?: (data: any) => Promise<any>;
        afterCreate?: (data: any) => Promise<void>;
        beforeUpdate?: (data: any) => Promise<any>;
        afterUpdate?: (data: any) => Promise<void>;
        beforeDelete?: (id: string) => Promise<void>;
        afterDelete?: (id: string) => Promise<void>;
    };
    
    // Access control
    access?: {
        read?: (context: AccessContext) => boolean;
        create?: (context: AccessContext) => boolean;
        update?: (context: AccessContext) => boolean;
        delete?: (context: AccessContext) => boolean;
    };
}
```

## Best Practices

1. **Field Naming**:
   - Use clear, descriptive names
   - Follow consistent naming conventions
   - Use lowercase with underscores
   - Avoid reserved keywords

2. **Validation**:
   - Always validate required fields
   - Set appropriate min/max values
   - Use patterns for formatted fields
   - Validate file uploads

3. **References**:
   - Define clear relationships
   - Use bidirectional references
   - Consider cascade operations
   - Set appropriate constraints

4. **Performance**:
   - Index frequently queried fields
   - Limit array field sizes
   - Optimize media field settings
   - Use appropriate field types

5. **Security**:
   - Implement proper access control
   - Validate user permissions
   - Sanitize user input
   - Handle sensitive data appropriately

## Common Patterns

### 1. SEO Fields

```typescript
const seoFields = [
    {
        name: "meta_title",
        type: "text",
        localized: true,
        validation: {
            max: 60
        }
    },
    {
        name: "meta_description",
        type: "text",
        localized: true,
        validation: {
            max: 160
        }
    },
    {
        name: "og_image",
        type: "media",
        mediaTypes: ["image/*"]
    }
];
```

### 2. Address Fields

```typescript
const addressFields = [
    {
        name: "street",
        type: "text",
        required: true
    },
    {
        name: "city",
        type: "text",
        required: true
    },
    {
        name: "state",
        type: "text"
    },
    {
        name: "postal_code",
        type: "text",
        required: true
    },
    {
        name: "country",
        type: "select",
        options: ["US", "UK", "DE", "FR"],
        required: true
    }
];
```

### 3. Media Gallery Fields

```typescript
const galleryFields = [
    {
        name: "images",
        type: "media",
        mediaTypes: ["image/*"],
        multiple: true,
        min: 1,
        max: 20,
        validation: {
            maxSize: "5MB"
        }
    },
    {
        name: "caption",
        type: "text",
        localized: true
    },
    {
        name: "alt_text",
        type: "text",
        localized: true
    }
];
```
