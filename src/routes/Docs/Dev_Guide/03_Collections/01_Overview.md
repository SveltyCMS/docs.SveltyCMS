---
title: "Collections Overview"
description: "Understanding SvelteCMS's Collection System"
icon: "mdi:database"
published: true
order: 1
---

# Collections Overview

SvelteCMS's collection system provides a flexible way to manage and organize content. This document provides an overview of the core concepts and components.

## Core Concepts

### Collection Structure

```typescript
interface Schema {
    name: string;
    icon?: string;
    fields: Field[];
    permissions?: Permissions;
}

interface CategoryData {
    id: string;
    name: string;
    icon?: string;
    isCollection?: boolean;
    subcategories?: Record<string, CategoryData>;
    collections?: Schema[];
}
```

Collections in SvelteCMS are organized hierarchically:
- Collections can be grouped into categories and subcategories
- Each collection has a schema defining its fields and permissions
- Collections support nested structures for complex content organization

### Collection States

Collections and their entries support multiple states:

```typescript
const statusMap = {
    deleted: 'deleted',
    published: 'published',
    unpublished: 'unpublished',
    scheduled: 'scheduled',
    cloned: 'cloned',
    testing: 'testing'
};
```

These states help manage the content lifecycle from creation to publication.

## Key Components

### Collection Manager

The CollectionManager handles all collection-related operations:

```typescript
class CollectionManager {
    private static instance: CollectionManager;
    
    // Singleton instance
    static getInstance(): CollectionManager {
        if (!CollectionManager.instance) {
            CollectionManager.instance = new CollectionManager();
        }
        return CollectionManager.instance;
    }
    
    // Collection operations
    async createCollection(schema: Schema): Promise<void>;
    async updateCollection(name: string, schema: Schema): Promise<void>;
    async deleteCollection(name: string): Promise<void>;
    async getCollection(name: string): Promise<Schema>;
}
```

### Entry Management

The system provides comprehensive entry management capabilities:

```typescript
interface EntryOperations {
    create(data: any): Promise<void>;
    update(id: string, data: any): Promise<void>;
    delete(id: string): Promise<void>;
    publish(id: string): Promise<void>;
    unpublish(id: string): Promise<void>;
    clone(id: string): Promise<void>;
}
```

### Collection Categories

Collections can be organized into categories for better content organization:

```typescript
interface Category {
    id: string;
    name: string;
    icon?: string;
    subcategories?: Record<string, CategoryData>;
    collections?: Schema[];
}
```

Features:
- Hierarchical organization with unlimited nesting
- Category-specific permissions and settings
- Flexible content grouping and organization

## User Interface

### Collection List

The collection list provides an overview of all available collections:

```typescript
interface CollectionListProps {
    categories: Record<string, CategoryData>;
    onSelect: (collection: Schema) => void;
}
```

Features:
- Hierarchical navigation
- Search and filtering
- Collection metadata display

### Entry List

The entry list component displays and manages collection entries:

```typescript
interface EntryListProps {
    collection: Schema;
    filters?: Record<string, any>;
    sorting?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    pagination?: {
        page: number;
        limit: number;
    };
}
```

Features:
- Sortable columns
- Customizable filters
- Batch operations
- Pagination support

## Collection Features

### Field Types

Collections support various field types:

- Text (single line, multi-line)
- Numbers (integer, float)
- Dates and times
- Media (images, files)
- References (relationships)
- Custom field types

### Validation

Collections include built-in validation:

```typescript
interface FieldValidation {
    required?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean;
}
```

### Permissions

Fine-grained permission control:

```typescript
interface Permissions {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    publish?: boolean;
}
```

## Next Steps

1. [Creating Collections](./02_Creating_Collections.md)
2. [Managing Entries](./03_Managing_Entries.md)
3. [Collection Fields](./04_Collection_Fields.md)
4. [Permissions & Security](./05_Permissions.md)
