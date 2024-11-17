# Collection Builder Overview

The Collection Builder is a powerful GUI tool in SvelteCMS that allows you to create, manage, and organize your content collections and their associated categories. This document provides an overview of the collection builder's structure and functionality.

## Collection Categories

Categories help organize collections into logical groups, making them easier to manage and navigate. Categories are defined in `categories.ts` and can be customized to match your content organization needs.

### Default Categories

```typescript
export const defaultCategories = [
    {
        id: 'content',
        label: 'Content',
        icon: 'article',
        description: 'Primary content types like pages, posts, and articles',
        order: 100
    },
    {
        id: 'media',
        label: 'Media',
        icon: 'image',
        description: 'Media-related collections like images, videos, and documents',
        order: 200
    },
    {
        id: 'components',
        label: 'Components',
        icon: 'widgets',
        description: 'Reusable content components and blocks',
        order: 300
    },
    {
        id: 'system',
        label: 'System',
        icon: 'settings',
        description: 'System-level collections and configuration',
        order: 900
    }
];
```

### Custom Categories

To add custom categories, extend the `categories.ts` file:

```typescript
import { CollectionCategory } from '@types';

export const customCategories: CollectionCategory[] = [
    {
        id: 'products',
        label: 'Products',
        icon: 'shopping_bag',
        description: 'Product-related collections',
        order: 150
    },
    {
        id: 'users',
        label: 'Users',
        icon: 'people',
        description: 'User-related collections',
        order: 400
    }
];

// Merge with default categories
export const categories = [...defaultCategories, ...customCategories];
```

## Collection Organization

Collections are organized using a hierarchical structure:

```typescript
interface CollectionOrganization {
    category: string;
    order: number;
    parent?: string;
    children?: string[];
    isHidden?: boolean;
}
```

### Sorting and Ordering

Collections can be sorted within their categories using several methods:

1. **Manual Ordering**
   ```typescript
   interface ManualOrder {
       type: 'manual';
       order: number;
   }
   ```

2. **Alphabetical Ordering**
   ```typescript
   interface AlphabeticalOrder {
       type: 'alphabetical';
       direction: 'asc' | 'desc';
   }
   ```

3. **Custom Field Ordering**
   ```typescript
   interface FieldOrder {
       type: 'field';
       field: string;
       direction: 'asc' | 'desc';
   }
   ```

### Collection Relationships

Collections can be related to each other through:

1. **Parent-Child Relationships**
   ```typescript
   interface ParentChildRelation {
       parent: string;
       childCollections: string[];
       inheritFields?: boolean;
       inheritPermissions?: boolean;
   }
   ```

2. **Reference Relationships**
   ```typescript
   interface ReferenceRelation {
       source: string;
       target: string;
       type: 'oneToOne' | 'oneToMany' | 'manyToMany';
       field: string;
   }
   ```

## Collection Builder Navigation

The Collection Builder interface is organized into several main sections:

1. **Category Sidebar**
   - Lists all available categories
   - Shows collection count per category
   - Allows category filtering and search

2. **Collection List**
   - Displays collections within selected category
   - Supports drag-and-drop reordering
   - Shows collection status and type icons

3. **Action Bar**
   - Create new collection button
   - Bulk actions menu
   - Search and filter options

4. **Collection Editor**
   - Opens when creating or editing a collection
   - Provides access to all collection configuration tabs

## Collection Types

SvelteCMS supports several collection types:

```typescript
type CollectionType = 
    | 'content'    // Regular content collections
    | 'singleton'  // Single-instance collections
    | 'component'  // Reusable component collections
    | 'system'     // System configuration collections
    | 'virtual';   // Virtual collections (computed/aggregated)
```

### Collection Type Features

Each collection type has specific features and limitations:

```typescript
interface CollectionTypeFeatures {
    allowsMultipleEntries: boolean;
    supportsVersioning: boolean;
    supportsWorkflow: boolean;
    allowsNesting: boolean;
    isConfigurable: boolean;
    systemLocked: boolean;
}
```

## Best Practices

1. **Category Organization**
   - Keep categories focused and logical
   - Use clear, descriptive category names
   - Maintain consistent ordering

2. **Collection Naming**
   - Use clear, descriptive names
   - Follow a consistent naming convention
   - Include category prefix if helpful

3. **Relationships**
   - Plan relationships before implementation
   - Document relationship purposes
   - Consider performance implications

4. **Performance**
   - Group related collections in same category
   - Use appropriate collection types
   - Optimize relationship structures
