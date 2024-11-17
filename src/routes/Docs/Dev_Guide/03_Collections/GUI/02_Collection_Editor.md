# Collection Editor

The Collection Editor is the primary interface for creating and modifying collections in SvelteCMS. This document details the various tabs and configuration options available in the Collection Editor.

## General Tab

The General tab contains basic collection settings and metadata.

```typescript
interface CollectionGeneral {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    category: string;
    type: CollectionType;
    isPublic: boolean;
    isSearchable: boolean;
    isVersioned: boolean;
}
```

### Collection Identification

```typescript
interface CollectionIdentification {
    // Required fields
    name: string;         // Display name
    slug: string;         // URL-friendly identifier
    
    // Optional fields
    description?: string; // Collection description
    icon?: string;       // Material icon identifier
    color?: string;      // Theme color for UI
}
```

### Collection Settings

```typescript
interface CollectionSettings {
    // Content settings
    allowDrafts: boolean;
    requireApproval: boolean;
    maxEntries?: number;
    
    // Display settings
    defaultView: 'grid' | 'list' | 'table';
    itemsPerPage: number;
    
    // System settings
    enableApi: boolean;
    enableWebhooks: boolean;
    enableCache: boolean;
}
```

## Fields Tab

The Fields tab is where you define the structure of your collection's content.

### Field Types

```typescript
type FieldType =
    | 'text'
    | 'richtext'
    | 'number'
    | 'boolean'
    | 'date'
    | 'media'
    | 'reference'
    | 'component'
    | 'array'
    | 'object';
```

### Field Configuration

```typescript
interface FieldConfig {
    name: string;
    type: FieldType;
    label: string;
    description?: string;
    required: boolean;
    unique: boolean;
    defaultValue?: any;
    
    // Validation
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: string;
    };
    
    // UI Configuration
    ui?: {
        widget?: string;
        hint?: string;
        placeholder?: string;
        group?: string;
    };
}
```

### Field Groups

```typescript
interface FieldGroup {
    name: string;
    label: string;
    description?: string;
    icon?: string;
    collapsed?: boolean;
    fields: string[];
}
```

## Permissions Tab

The Permissions tab manages access control for the collection.

### Role-Based Access Control

```typescript
interface CollectionPermissions {
    roles: {
        [roleId: string]: RolePermissions;
    };
    users: {
        [userId: string]: UserPermissions;
    };
    public: PublicPermissions;
}

interface RolePermissions {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    publish: boolean;
    manage: boolean;
}
```

### Field-Level Permissions

```typescript
interface FieldPermissions {
    field: string;
    roles: {
        [roleId: string]: {
            read: boolean;
            write: boolean;
        };
    };
}
```

### Conditional Permissions

```typescript
interface ConditionalPermission {
    condition: {
        field: string;
        operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
        value: any;
    };
    permissions: RolePermissions;
}
```

## Ordering Tab

The Ordering tab configures how entries in the collection are sorted and ordered.

### Default Ordering

```typescript
interface CollectionOrdering {
    defaultSort: {
        field: string;
        direction: 'asc' | 'desc';
    };
    allowUserSort: boolean;
    sortableFields: string[];
}
```

### Manual Ordering

```typescript
interface ManualOrdering {
    enabled: boolean;
    dragAndDrop: boolean;
    orderField: string;
    groupBy?: string;
}
```

### Tree Ordering

```typescript
interface TreeOrdering {
    enabled: boolean;
    parentField: string;
    orderField: string;
    maxDepth?: number;
}
```

## Workflow Tab

The Workflow tab defines content lifecycle and approval processes.

### Workflow States

```typescript
interface WorkflowState {
    id: string;
    label: string;
    color: string;
    description?: string;
    allowedTransitions: string[];
    requiredRoles?: string[];
}
```

### Workflow Configuration

```typescript
interface WorkflowConfig {
    enabled: boolean;
    states: WorkflowState[];
    defaultState: string;
    requireApproval: boolean;
    notifyOnTransition: boolean;
    allowedApprovers: string[];
}
```

## API Tab

The API tab configures how the collection interacts with external services.

### API Settings

```typescript
interface ApiSettings {
    enabled: boolean;
    endpoints: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
        search: boolean;
    };
    authentication: {
        required: boolean;
        methods: ('token' | 'oauth' | 'apiKey')[];
    };
    rateLimit?: {
        requests: number;
        period: number;
    };
}
```

### Webhooks

```typescript
interface WebhookConfig {
    url: string;
    events: ('create' | 'update' | 'delete' | 'publish')[];
    headers?: Record<string, string>;
    secret?: string;
    retries: number;
}
```

## Advanced Tab

The Advanced tab provides access to specialized collection settings.

### Indexing and Search

```typescript
interface SearchConfig {
    enabled: boolean;
    fields: string[];
    weights: Record<string, number>;
    analyzer?: string;
    highlightFields?: string[];
}
```

### Caching

```typescript
interface CacheConfig {
    enabled: boolean;
    ttl: number;
    strategy: 'memory' | 'redis' | 'filesystem';
    invalidationRules: {
        onUpdate: boolean;
        onDelete: boolean;
        custom?: string[];
    };
}
```

### Custom Code

```typescript
interface CustomCode {
    hooks: {
        beforeCreate?: string;
        afterCreate?: string;
        beforeUpdate?: string;
        afterUpdate?: string;
        beforeDelete?: string;
        afterDelete?: string;
    };
    computed: Record<string, string>;
    methods: Record<string, string>;
}
```
