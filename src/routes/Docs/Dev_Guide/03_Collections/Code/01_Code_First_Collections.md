# Code-First Collection Creation

This guide explains how to create collections programmatically using TypeScript/JavaScript code in SvelteCMS.

## Overview

Code-first collection creation is recommended when:
- You need precise control over collection structure
- Working with complex data models
- Implementing type safety
- Setting up automated deployments
- Managing collections in version control

## Basic Structure

A code-first collection is defined using TypeScript interfaces and decorators:

```typescript
import { Collection, Field } from '@sveltecms/core';
import { Text, Number, Reference } from '@sveltecms/fields';

@Collection({
  name: 'products',
  label: 'Products',
  description: 'Product catalog items'
})
export class ProductCollection {
  @Field(() => Text, {
    required: true,
    label: 'Product Name',
    description: 'The name of the product'
  })
  name: string;

  @Field(() => Number, {
    required: true,
    label: 'Price',
    min: 0
  })
  price: number;

  @Field(() => Reference, {
    collection: 'categories',
    label: 'Category'
  })
  category: string;
}
```

## Field Types

### Basic Fields

```typescript
// Text Field
@Field(() => Text, {
  required: true,
  minLength: 3,
  maxLength: 100,
  pattern: '^[A-Za-z0-9 ]+$'
})
title: string;

// Number Field
@Field(() => Number, {
  min: 0,
  max: 1000,
  step: 0.01
})
price: number;

// Boolean Field
@Field(() => Boolean, {
  default: false
})
isActive: boolean;

// Date Field
@Field(() => Date, {
  format: 'YYYY-MM-DD'
})
publishDate: Date;
```

### Complex Fields

```typescript
// Rich Text Field
@Field(() => RichText, {
  toolbar: ['bold', 'italic', 'link'],
  maxLength: 5000
})
content: string;

// Media Field
@Field(() => Media, {
  allowedTypes: ['image/jpeg', 'image/png'],
  maxSize: 5000000 // 5MB
})
image: string;

// Reference Field
@Field(() => Reference, {
  collection: 'categories',
  displayField: 'name'
})
category: string;

// Array Field
@Field(() => Array, {
  of: Text,
  minItems: 1,
  maxItems: 5
})
tags: string[];
```

### Custom Fields

```typescript
// Custom Field Definition
@Field(() => CustomField, {
  component: 'MyCustomWidget',
  validate: (value) => {
    if (!value) return 'Value is required';
    return null;
  }
})
customField: any;
```

## Field Options

### Common Options

```typescript
interface FieldOptions {
  label?: string;              // Display label
  description?: string;        // Help text
  required?: boolean;          // Is field required
  unique?: boolean;           // Must be unique
  default?: any;              // Default value
  hidden?: boolean;           // Hide in UI
  readOnly?: boolean;         // Prevent editing
  translated?: boolean;       // Enable translations
  searchable?: boolean;       // Include in search
  validate?: Function;        // Custom validation
  transform?: Function;       // Value transformation
}
```

### Validation Options

```typescript
interface ValidationOptions {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: any) => string | null;
}
```

### UI Options

```typescript
interface UIOptions {
  widget?: string;            // Custom widget
  placeholder?: string;       // Input placeholder
  help?: string;             // Help text
  group?: string;            // Field group
  order?: number;            // Display order
  width?: number;            // Field width
  hidden?: boolean;          // Hide field
  condition?: string;        // Show/hide condition
}
```

## Collection Options

```typescript
interface CollectionOptions {
  name: string;               // Collection name
  label?: string;            // Display label
  description?: string;      // Collection description
  icon?: string;             // Collection icon
  orderBy?: string;          // Default sort field
  orderDirection?: 'asc' | 'desc';
  timestamps?: boolean;      // Add timestamps
  softDelete?: boolean;      // Enable soft delete
  versioning?: boolean;      // Enable versioning
  workflow?: boolean;        // Enable workflow
  api?: {                    // API options
    enabled: boolean;
    endpoints?: string[];
    methods?: string[];
  };
  hooks?: {                  // Collection hooks
    beforeCreate?: Function;
    afterCreate?: Function;
    beforeUpdate?: Function;
    afterUpdate?: Function;
    beforeDelete?: Function;
    afterDelete?: Function;
  };
  permissions?: {            // Access control
    create?: string[];
    read?: string[];
    update?: string[];
    delete?: string[];
  };
}
```

## Advanced Features

### Field Groups

```typescript
@Collection({
  name: 'products',
  groups: [
    {
      name: 'basic',
      label: 'Basic Information',
      order: 1
    },
    {
      name: 'pricing',
      label: 'Pricing Details',
      order: 2
    }
  ]
})
export class ProductCollection {
  @Field(() => Text, {
    group: 'basic'
  })
  name: string;

  @Field(() => Number, {
    group: 'pricing'
  })
  price: number;
}
```

### Conditional Fields

```typescript
@Field(() => Boolean, {
  name: 'hasDiscount'
})
hasDiscount: boolean;

@Field(() => Number, {
  name: 'discountPrice',
  condition: 'hasDiscount === true'
})
discountPrice: number;
```

### Computed Fields

```typescript
@Field(() => Text, {
  compute: (item) => {
    return `${item.firstName} ${item.lastName}`;
  }
})
fullName: string;
```

### Field Transformations

```typescript
@Field(() => Text, {
  transform: {
    input: (value) => value.toLowerCase(),
    output: (value) => value.toUpperCase()
  }
})
code: string;
```

## Best Practices

1. **Type Safety**
   ```typescript
   // Use TypeScript interfaces
   interface Product {
     name: string;
     price: number;
     category: string;
   }

   @Collection({
     name: 'products'
   })
   export class ProductCollection implements Product {
     // Field definitions...
   }
   ```

2. **Field Reusability**
   ```typescript
   // Create reusable field configurations
   const TimestampFields = {
     createdAt: Field(() => Date),
     updatedAt: Field(() => Date)
   };

   @Collection({
     name: 'products'
   })
   export class ProductCollection {
     // Reuse timestamp fields
     @TimestampFields.createdAt
     createdAt: Date;

     @TimestampFields.updatedAt
     updatedAt: Date;
   }
   ```

3. **Validation Rules**
   ```typescript
   // Create reusable validation rules
   const ValidationRules = {
     required: {
       required: true,
       message: 'This field is required'
     },
     email: {
       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
       message: 'Invalid email format'
     }
   };

   @Field(() => Text, ValidationRules.email)
   email: string;
   ```

4. **Documentation**
   ```typescript
   /**
    * Product collection representing items in the catalog
    * @collection Products
    */
   @Collection({
     name: 'products'
   })
   export class ProductCollection {
     /**
      * Unique product identifier
      * @required
      * @unique
      */
     @Field(() => Text)
     sku: string;
   }
   ```

## Collection Registration

```typescript
// Register collections in your app
import { registerCollections } from '@sveltecms/core';
import { ProductCollection } from './collections/ProductCollection';
import { CategoryCollection } from './collections/CategoryCollection';

registerCollections([
  ProductCollection,
  CategoryCollection
]);
```

## Testing Collections

```typescript
// Collection test example
import { test } from 'vitest';
import { ProductCollection } from './ProductCollection';

test('Product collection validation', () => {
  const product = new ProductCollection();
  product.name = 'Test Product';
  product.price = -1;

  const validation = product.validate();
  expect(validation.price).toBeDefined();
  expect(validation.price).toContain('must be greater than 0');
});
```

## Migration Support

```typescript
// Collection migration example
@Collection({
  name: 'products',
  migrations: [
    {
      version: '1.1.0',
      up: async (db) => {
        await db.addField('products', {
          name: 'discount',
          type: 'number'
        });
      },
      down: async (db) => {
        await db.removeField('products', 'discount');
      }
    }
  ]
})
export class ProductCollection {
  // Field definitions...
}
```
