---
title: "Managing Entries"
description: "Guide to managing entries within collections in SvelteCMS"
icon: "mdi:database-edit"
published: true
order: 3
---

# Managing Entries

This guide explains how to manage entries within collections in SvelteCMS.

## Entry Structure

Each entry in a collection follows this structure:

```typescript
interface Entry {
    id: string;
    collectionId: string;
    status: EntryStatus;
    data: Record<string, any>;
    metadata: EntryMetadata;
    version: number;
}

interface EntryMetadata {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    publishedAt?: Date;
    publishedBy?: string;
}

type EntryStatus = 'draft' | 'published' | 'archived' | 'deleted';
```

## Entry Operations

### Creating Entries

Basic entry creation:

```typescript
interface CreateEntryOptions {
    collection: string;
    data: Record<string, any>;
    status?: EntryStatus;
    metadata?: Partial<EntryMetadata>;
}

interface EntryManager {
    create(options: CreateEntryOptions): Promise<Entry>;
}
```

Example usage:

```typescript
const entry = await entryManager.create({
    collection: 'blog',
    data: {
        title: 'New Blog Post',
        content: 'Post content...',
        tags: ['news', 'tech']
    },
    status: 'draft'
});
```

### Updating Entries

Update operations:

```typescript
interface UpdateEntryOptions {
    id: string;
    data?: Record<string, any>;
    status?: EntryStatus;
    metadata?: Partial<EntryMetadata>;
}

interface EntryManager {
    update(options: UpdateEntryOptions): Promise<Entry>;
}
```

Example update:

```typescript
const updated = await entryManager.update({
    id: 'entry123',
    data: {
        title: 'Updated Title',
        content: 'Updated content...'
    },
    status: 'published'
});
```

### Deleting Entries

Deletion options:

```typescript
interface DeleteEntryOptions {
    id: string;
    permanent?: boolean;
}

interface EntryManager {
    delete(options: DeleteEntryOptions): Promise<void>;
}
```

### Entry Versioning

Version management:

```typescript
interface VersionOptions {
    id: string;
    version?: number;
}

interface EntryManager {
    getVersion(options: VersionOptions): Promise<Entry>;
    listVersions(id: string): Promise<Entry[]>;
    revertToVersion(options: VersionOptions): Promise<Entry>;
}
```

## Entry States

### State Transitions

Valid state transitions:

```typescript
const stateTransitions = {
    draft: ['published', 'archived', 'deleted'],
    published: ['draft', 'archived', 'deleted'],
    archived: ['draft', 'deleted'],
    deleted: ['draft']
};
```

### State Management

State change operations:

```typescript
interface StateChangeOptions {
    id: string;
    newStatus: EntryStatus;
    reason?: string;
}

interface EntryManager {
    changeState(options: StateChangeOptions): Promise<Entry>;
}
```

## Entry Validation

### Validation Rules

Define validation rules:

```typescript
interface ValidationRule {
    field: string;
    type: 'required' | 'format' | 'custom';
    validate: (value: any) => Promise<boolean>;
    message: string;
}

interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

interface ValidationError {
    field: string;
    message: string;
}
```

Example validation:

```typescript
const blogValidation: ValidationRule[] = [
    {
        field: 'title',
        type: 'required',
        validate: async (value) => !!value,
        message: 'Title is required'
    },
    {
        field: 'content',
        type: 'format',
        validate: async (value) => value.length >= 100,
        message: 'Content must be at least 100 characters'
    }
];
```

## Entry Search and Filtering

### Search Options

Configure search:

```typescript
interface SearchOptions {
    collection: string;
    query?: string;
    filters?: Record<string, any>;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
    pagination?: {
        page: number;
        limit: number;
    };
}

interface SearchResult {
    entries: Entry[];
    total: number;
    page: number;
    pages: number;
}
```

Example search:

```typescript
const results = await entryManager.search({
    collection: 'blog',
    query: 'technology',
    filters: {
        status: 'published',
        category: 'tech'
    },
    sort: {
        field: 'publishedAt',
        order: 'desc'
    },
    pagination: {
        page: 1,
        limit: 10
    }
});
```

## Entry Relationships

### Relationship Types

Define relationships:

```typescript
interface Relationship {
    type: 'oneToOne' | 'oneToMany' | 'manyToMany';
    collection: string;
    field: string;
    inverse?: string;
}
```

Example relationships:

```typescript
const blogRelationships = {
    author: {
        type: 'oneToOne',
        collection: 'users',
        field: 'authorId'
    },
    categories: {
        type: 'manyToMany',
        collection: 'categories',
        field: 'categoryIds'
    }
};
```

### Managing Relationships

Relationship operations:

```typescript
interface RelationshipManager {
    link(sourceId: string, targetId: string, field: string): Promise<void>;
    unlink(sourceId: string, targetId: string, field: string): Promise<void>;
    getRelated(id: string, field: string): Promise<Entry[]>;
}
```

## Next Steps

1. [Collection Fields](./04_Collection_Fields.md)
2. [Collection Templates](./05_Collection_Templates.md)
3. [API Integration](./06_API_Integration.md)
4. [Advanced Features](./07_Advanced_Features.md)
