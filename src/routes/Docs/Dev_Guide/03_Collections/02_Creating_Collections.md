---
title: "Creating Collections"
description: "Guide to creating and configuring collections in SvelteCMS"
icon: "mdi:database-plus"
published: true
order: 2
---

# Creating Collections

This guide explains how to create and configure collections in SvelteCMS.

## Collection Builder

The Collection Builder provides a visual interface for creating collections:

```typescript
interface CollectionBuilderProps {
    initialSchema?: Schema;
    onSave: (schema: Schema) => Promise<void>;
}
```

### Basic Configuration

1. **Collection Name**: Define a unique identifier
2. **Display Icon**: Choose from available icons
3. **Description**: Add helpful context
4. **Category**: Assign to a category

Example configuration:

```typescript
const blogCollection: Schema = {
    name: 'Blog',
    icon: 'mdi:post',
    description: 'Blog posts and articles',
    category: 'Content',
    fields: []
};
```

### Field Configuration

Add fields to your collection:

```typescript
interface Field {
    name: string;
    type: FieldType;
    label: string;
    description?: string;
    required?: boolean;
    defaultValue?: any;
    validation?: FieldValidation;
    display?: (options: DisplayOptions) => Promise<string>;
}
```

Example fields:

```typescript
const blogFields: Field[] = [
    {
        name: 'title',
        type: 'text',
        label: 'Title',
        required: true,
        validation: {
            minLength: 3,
            maxLength: 100
        }
    },
    {
        name: 'content',
        type: 'richtext',
        label: 'Content',
        description: 'Main article content'
    },
    {
        name: 'publishDate',
        type: 'datetime',
        label: 'Publish Date',
        defaultValue: () => new Date()
    }
];
```

## Collection Categories

### Category Structure

Categories help organize collections:

```typescript
interface CategoryConfig {
    name: string;
    icon?: string;
    collections: Schema[];
    subcategories?: Record<string, CategoryConfig>;
}
```

Example category structure:

```typescript
const contentCategory: CategoryConfig = {
    name: 'Content',
    icon: 'mdi:file-document',
    collections: [blogCollection],
    subcategories: {
        media: {
            name: 'Media',
            icon: 'mdi:image',
            collections: [imageCollection, videoCollection]
        }
    }
};
```

### Category Management

Operations for managing categories:

```typescript
interface CategoryOperations {
    create(config: CategoryConfig): Promise<void>;
    update(id: string, config: CategoryConfig): Promise<void>;
    delete(id: string): Promise<void>;
    moveCollection(collectionId: string, categoryId: string): Promise<void>;
}
```

## Collection Settings

### Basic Settings

Configure collection behavior:

```typescript
interface CollectionSettings {
    slug: {
        pattern: string;
        unique: boolean;
    };
    versioning: {
        enabled: boolean;
        maxVersions?: number;
    };
    workflow: {
        requireApproval: boolean;
        approvalStages?: string[];
    };
}
```

Example settings:

```typescript
const blogSettings: CollectionSettings = {
    slug: {
        pattern: '{{title|lowercase|replace(" ", "-")}}',
        unique: true
    },
    versioning: {
        enabled: true,
        maxVersions: 10
    },
    workflow: {
        requireApproval: true,
        approvalStages: ['review', 'editorial', 'publish']
    }
};
```

### Advanced Settings

Additional configuration options:

```typescript
interface AdvancedSettings {
    indexing: {
        searchable: boolean;
        fields: string[];
    };
    api: {
        enabled: boolean;
        endpoints: string[];
        auth: boolean;
    };
    hooks: {
        beforeCreate?: (data: any) => Promise<any>;
        afterCreate?: (data: any) => Promise<void>;
        beforeUpdate?: (data: any) => Promise<any>;
        afterUpdate?: (data: any) => Promise<void>;
    };
}
```

Example advanced settings:

```typescript
const blogAdvancedSettings: AdvancedSettings = {
    indexing: {
        searchable: true,
        fields: ['title', 'content', 'tags']
    },
    api: {
        enabled: true,
        endpoints: ['list', 'view', 'create', 'update', 'delete'],
        auth: true
    },
    hooks: {
        beforeCreate: async (data) => {
            data.createdAt = new Date();
            return data;
        },
        afterCreate: async (data) => {
            await notifySubscribers(data);
        }
    }
};
```

## Collection Templates

### Template Structure

Define reusable collection templates:

```typescript
interface CollectionTemplate {
    name: string;
    description: string;
    schema: Schema;
    settings: CollectionSettings;
    advanced?: AdvancedSettings;
}
```

Example template:

```typescript
const articleTemplate: CollectionTemplate = {
    name: 'Article',
    description: 'Standard article collection template',
    schema: {
        name: 'articles',
        icon: 'mdi:file-document',
        fields: [
            {
                name: 'title',
                type: 'text',
                label: 'Title',
                required: true
            },
            {
                name: 'content',
                type: 'richtext',
                label: 'Content'
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

## Next Steps

1. [Managing Entries](./03_Managing_Entries.md)
2. [Collection Fields](./04_Collection_Fields.md)
3. [Collection Templates](./05_Collection_Templates.md)
4. [API Integration](./06_API_Integration.md)
