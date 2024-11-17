---
title: "API Integration"
description: "Guide to integrating with the SvelteCMS Collection API"
icon: "mdi:api"
published: true
order: 6
---

# API Integration

This guide explains how to integrate with the SvelteCMS Collection API.

## API Overview

### Base Configuration

```typescript
interface APIConfig {
    baseURL: string;
    version: string;
    auth?: {
        type: 'bearer' | 'basic' | 'api-key';
        token?: string;
        key?: string;
    };
    headers?: Record<string, string>;
}
```

### API Client

```typescript
interface APIClient {
    collections: CollectionAPI;
    entries: EntryAPI;
    media: MediaAPI;
    users: UserAPI;
}
```

## Collection API

### Endpoints

```typescript
interface CollectionAPI {
    list(): Promise<Collection[]>;
    get(id: string): Promise<Collection>;
    create(data: CollectionInput): Promise<Collection>;
    update(id: string, data: Partial<CollectionInput>): Promise<Collection>;
    delete(id: string): Promise<void>;
    getSchema(id: string): Promise<CollectionSchema>;
    updateSchema(id: string, schema: Partial<CollectionSchema>): Promise<CollectionSchema>;
}
```

Example usage:

```typescript
// List all collections
const collections = await api.collections.list();

// Create a new collection
const newCollection = await api.collections.create({
    name: 'Products',
    description: 'Product catalog',
    schema: {
        fields: [
            {
                name: 'name',
                type: 'text',
                required: true
            },
            {
                name: 'price',
                type: 'number',
                format: {
                    type: 'currency',
                    precision: 2
                }
            }
        ]
    }
});
```

## Entry API

### CRUD Operations

```typescript
interface EntryAPI {
    list(collection: string, options?: QueryOptions): Promise<EntryList>;
    get(collection: string, id: string): Promise<Entry>;
    create(collection: string, data: EntryInput): Promise<Entry>;
    update(collection: string, id: string, data: Partial<EntryInput>): Promise<Entry>;
    delete(collection: string, id: string): Promise<void>;
    publish(collection: string, id: string): Promise<Entry>;
    unpublish(collection: string, id: string): Promise<Entry>;
}

interface QueryOptions {
    filter?: Record<string, any>;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
    pagination?: {
        page: number;
        limit: number;
    };
    populate?: string[];
}
```

Example usage:

```typescript
// List entries with filtering and pagination
const products = await api.entries.list('products', {
    filter: {
        category: 'electronics',
        price: { $gt: 100 }
    },
    sort: {
        field: 'price',
        order: 'asc'
    },
    pagination: {
        page: 1,
        limit: 20
    }
});

// Create a new entry
const newProduct = await api.entries.create('products', {
    name: 'Smartphone',
    price: 599.99,
    category: 'electronics'
});
```

## Media API

### Media Operations

```typescript
interface MediaAPI {
    upload(file: File, options?: UploadOptions): Promise<MediaAsset>;
    update(id: string, data: Partial<MediaInput>): Promise<MediaAsset>;
    delete(id: string): Promise<void>;
    getUrl(id: string, transform?: TransformOptions): Promise<string>;
}

interface UploadOptions {
    directory?: string;
    filename?: string;
    metadata?: Record<string, any>;
    transform?: TransformOptions;
}

interface TransformOptions {
    width?: number;
    height?: number;
    format?: 'jpeg' | 'png' | 'webp';
    quality?: number;
    fit?: 'cover' | 'contain' | 'fill';
}
```

Example usage:

```typescript
// Upload an image
const image = await api.media.upload(file, {
    directory: 'products',
    transform: {
        width: 800,
        height: 600,
        format: 'webp',
        quality: 80
    }
});

// Get transformed URL
const thumbnailUrl = await api.media.getUrl(image.id, {
    width: 200,
    height: 200,
    fit: 'cover'
});
```

## Authentication

### Authentication Methods

```typescript
interface AuthAPI {
    login(credentials: Credentials): Promise<AuthResponse>;
    logout(): Promise<void>;
    refresh(): Promise<AuthResponse>;
    getToken(): string | null;
}

interface Credentials {
    username: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: User;
    expires: number;
}
```

Example authentication:

```typescript
// Login
const auth = await api.auth.login({
    username: 'admin',
    password: 'password'
});

// Configure client with token
api.setAuth({
    type: 'bearer',
    token: auth.token
});
```

## Webhooks

### Webhook Configuration

```typescript
interface WebhookConfig {
    url: string;
    events: WebhookEvent[];
    secret?: string;
    headers?: Record<string, string>;
    active?: boolean;
}

type WebhookEvent =
    | 'entry.created'
    | 'entry.updated'
    | 'entry.deleted'
    | 'entry.published'
    | 'entry.unpublished'
    | 'media.uploaded'
    | 'media.updated'
    | 'media.deleted';
```

Example webhook setup:

```typescript
// Register webhook
const webhook = await api.webhooks.create({
    url: 'https://api.example.com/webhook',
    events: ['entry.published', 'entry.unpublished'],
    secret: 'webhook-secret',
    active: true
});

// Verify webhook signature
const isValid = verifyWebhookSignature(
    request.headers['x-webhook-signature'],
    request.body,
    webhook.secret
);
```

## Error Handling

### API Errors

```typescript
interface APIError {
    code: string;
    message: string;
    details?: any;
    status: number;
}

class APIErrorHandler {
    static handle(error: APIError) {
        switch (error.code) {
            case 'UNAUTHORIZED':
                // Handle authentication errors
                break;
            case 'FORBIDDEN':
                // Handle permission errors
                break;
            case 'NOT_FOUND':
                // Handle missing resources
                break;
            case 'VALIDATION_ERROR':
                // Handle validation errors
                break;
            default:
                // Handle unknown errors
                break;
        }
    }
}
```

Example error handling:

```typescript
try {
    const entry = await api.entries.create('products', data);
} catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
        // Handle validation errors
        const errors = error.details.errors;
        errors.forEach(err => {
            console.error(`${err.field}: ${err.message}`);
        });
    } else {
        // Handle other errors
        APIErrorHandler.handle(error);
    }
}
```

## Rate Limiting

### Rate Limit Configuration

```typescript
interface RateLimitConfig {
    window: number;    // Time window in seconds
    max: number;       // Maximum requests per window
    delay?: number;    // Delay between requests
}

class RateLimiter {
    constructor(config: RateLimitConfig) {
        this.config = config;
    }

    async acquire(): Promise<void> {
        // Rate limiting logic
    }
}
```

Example rate limiting:

```typescript
const rateLimiter = new RateLimiter({
    window: 60,
    max: 100,
    delay: 50
});

// Use rate limiter with API calls
async function fetchWithRateLimit() {
    await rateLimiter.acquire();
    return api.entries.list('products');
}
```

## Next Steps

1. [Advanced Features](./07_Advanced_Features.md)
2. [Customization](./08_Customization.md)
3. [Best Practices](./09_Best_Practices.md)
4. [Troubleshooting](./10_Troubleshooting.md)
