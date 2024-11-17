---
title: "Collection Templates"
description: "Guide to creating and using collection templates in SvelteCMS"
icon: "mdi:file-document-multiple"
published: true
order: 5
---

# Collection Templates

This guide explains how to create and use collection templates in SvelteCMS.

## Template Structure

### Basic Template

```typescript
interface CollectionTemplate {
    name: string;
    description: string;
    icon?: string;
    schema: CollectionSchema;
    settings: CollectionSettings;
    display?: CollectionDisplay;
    hooks?: CollectionHooks;
}
```

### Collection Schema

```typescript
interface CollectionSchema {
    fields: Field[];
    groups?: FieldGroup[];
    validation?: ValidationRule[];
    relationships?: Relationship[];
}
```

## Template Types

### Content Templates

Common content type templates:

```typescript
const articleTemplate: CollectionTemplate = {
    name: 'Article',
    description: 'Standard article content type',
    icon: 'mdi:file-document',
    schema: {
        fields: [
            {
                name: 'title',
                type: 'text',
                label: 'Title',
                required: true
            },
            {
                name: 'slug',
                type: 'text',
                label: 'URL Slug',
                unique: true,
                transform: 'lowercase'
            },
            {
                name: 'content',
                type: 'richtext',
                label: 'Content'
            },
            {
                name: 'featured_image',
                type: 'image',
                label: 'Featured Image'
            },
            {
                name: 'categories',
                type: 'references',
                label: 'Categories',
                collection: 'categories'
            },
            {
                name: 'tags',
                type: 'multiselect',
                label: 'Tags',
                allowCustom: true
            }
        ]
    },
    settings: {
        slug: {
            pattern: '{{title}}',
            unique: true
        },
        versioning: {
            enabled: true
        }
    }
};
```

### Media Templates

Template for media collections:

```typescript
const mediaTemplate: CollectionTemplate = {
    name: 'Media Library',
    description: 'Manage media assets',
    icon: 'mdi:image',
    schema: {
        fields: [
            {
                name: 'title',
                type: 'text',
                label: 'Title'
            },
            {
                name: 'asset',
                type: 'file',
                label: 'Media Asset',
                allowedTypes: ['image/*', 'video/*', 'audio/*'],
                maxSize: 10485760, // 10MB
                storage: {
                    provider: 'local',
                    transformations: [
                        {
                            resize: [800, 600],
                            quality: 80
                        }
                    ]
                }
            },
            {
                name: 'alt',
                type: 'text',
                label: 'Alt Text'
            },
            {
                name: 'caption',
                type: 'textarea',
                label: 'Caption'
            }
        ]
    }
};
```

### User Templates

Template for user management:

```typescript
const userTemplate: CollectionTemplate = {
    name: 'Users',
    description: 'User management',
    icon: 'mdi:account',
    schema: {
        fields: [
            {
                name: 'username',
                type: 'text',
                label: 'Username',
                required: true,
                unique: true
            },
            {
                name: 'email',
                type: 'email',
                label: 'Email',
                required: true,
                unique: true
            },
            {
                name: 'password',
                type: 'password',
                label: 'Password',
                required: true
            },
            {
                name: 'role',
                type: 'select',
                label: 'Role',
                options: [
                    { value: 'admin', label: 'Administrator' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'author', label: 'Author' }
                ]
            }
        ],
        validation: [
            {
                field: 'email',
                type: 'format',
                message: 'Invalid email format'
            }
        ]
    },
    hooks: {
        beforeCreate: async (data) => {
            data.password = await hashPassword(data.password);
            return data;
        }
    }
};
```

## Template Features

### Display Configuration

```typescript
interface CollectionDisplay {
    list: {
        columns: {
            field: string;
            width?: number;
            sortable?: boolean;
            format?: (value: any) => string;
        }[];
        filters?: {
            field: string;
            type: 'select' | 'text' | 'date';
            options?: any[];
        }[];
        actions?: {
            name: string;
            icon: string;
            handler: (entry: Entry) => Promise<void>;
        }[];
    };
    view: {
        layout: 'default' | 'custom';
        sections?: {
            name: string;
            fields: string[];
            collapsed?: boolean;
        }[];
    };
}
```

Example display config:

```typescript
const articleDisplay: CollectionDisplay = {
    list: {
        columns: [
            {
                field: 'title',
                width: 300,
                sortable: true
            },
            {
                field: 'categories',
                width: 200,
                format: (value) => value.join(', ')
            },
            {
                field: 'publishedAt',
                width: 150,
                sortable: true,
                format: (value) => formatDate(value)
            }
        ],
        filters: [
            {
                field: 'categories',
                type: 'select'
            },
            {
                field: 'publishedAt',
                type: 'date'
            }
        ],
        actions: [
            {
                name: 'preview',
                icon: 'mdi:eye',
                handler: async (entry) => {
                    // Preview logic
                }
            }
        ]
    },
    view: {
        layout: 'custom',
        sections: [
            {
                name: 'Content',
                fields: ['title', 'content']
            },
            {
                name: 'Media',
                fields: ['featured_image']
            },
            {
                name: 'Metadata',
                fields: ['categories', 'tags'],
                collapsed: true
            }
        ]
    }
};
```

### Template Hooks

```typescript
interface CollectionHooks {
    beforeCreate?: (data: any) => Promise<any>;
    afterCreate?: (entry: Entry) => Promise<void>;
    beforeUpdate?: (data: any, original: Entry) => Promise<any>;
    afterUpdate?: (entry: Entry) => Promise<void>;
    beforeDelete?: (entry: Entry) => Promise<void>;
    afterDelete?: (entry: Entry) => Promise<void>;
}
```

Example hooks:

```typescript
const articleHooks: CollectionHooks = {
    beforeCreate: async (data) => {
        data.createdAt = new Date();
        data.slug = generateSlug(data.title);
        return data;
    },
    afterCreate: async (entry) => {
        await indexForSearch(entry);
        await notifySubscribers(entry);
    },
    beforeUpdate: async (data, original) => {
        data.updatedAt = new Date();
        if (data.title !== original.title) {
            data.slug = generateSlug(data.title);
        }
        return data;
    }
};
```

## Using Templates

### Creating Collections from Templates

```typescript
interface TemplateManager {
    createCollection(template: CollectionTemplate, options?: any): Promise<Collection>;
    updateTemplate(name: string, template: Partial<CollectionTemplate>): Promise<void>;
    deleteTemplate(name: string): Promise<void>;
    listTemplates(): Promise<CollectionTemplate[]>;
}
```

Example usage:

```typescript
// Create a new blog collection from the article template
const blog = await templateManager.createCollection(articleTemplate, {
    name: 'Blog',
    description: 'Company blog posts'
});

// Create a media library
const mediaLibrary = await templateManager.createCollection(mediaTemplate, {
    storage: {
        provider: 's3',
        bucket: 'media-assets'
    }
});
```

## Next Steps

1. [API Integration](./06_API_Integration.md)
2. [Advanced Features](./07_Advanced_Features.md)
3. [Customization](./08_Customization.md)
4. [Best Practices](./09_Best_Practices.md)
