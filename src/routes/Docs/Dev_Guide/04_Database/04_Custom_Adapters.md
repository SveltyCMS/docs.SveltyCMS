---
title: "Custom Database Adapters"
description: "Guide for implementing custom database adapters in SvelteCMS"
icon: "mdi:database-cog"
published: true
order: 4
---

# Custom Database Adapters

This guide explains how to implement custom database adapters for SvelteCMS, allowing integration with any database system while maintaining consistent functionality across the CMS.

## Overview

### Adapter Interface

All database adapters must implement the `dbInterface`:

```typescript
interface dbInterface {
    // Connection Management
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    
    // Collection Operations
    getCollectionModels(): Promise<Record<string, CollectionModel>>;
    setupAuthModels(): void;
    setupMediaModels(): void;
    
    // CRUD Operations
    findOne(collection: string, query: object): Promise<any>;
    findMany(collection: string, query: object): Promise<any[]>;
    insertOne(collection: string, doc: object): Promise<any>;
    insertMany(collection: string, docs: object[]): Promise<any[]>;
    updateOne(collection: string, query: object, update: object): Promise<any>;
    updateMany(collection: string, query: object, update: object): Promise<any>;
    deleteOne(collection: string, query: object): Promise<number>;
    deleteMany(collection: string, query: object): Promise<number>;
    countDocuments(collection: string, query?: object): Promise<number>;
}
```

## Implementation Guide

### Basic Structure

```typescript
import { dbInterface } from '../interfaces/dbInterface';
import { CollectionModel } from '../models/CollectionModel';

export class CustomAdapter implements dbInterface {
    private connection: any;
    private models: Record<string, CollectionModel>;
    private config: CustomAdapterConfig;

    constructor(config: CustomAdapterConfig) {
        this.config = config;
        this.models = {};
    }

    async connect(): Promise<void> {
        // Implement connection logic
    }

    async disconnect(): Promise<void> {
        // Implement disconnection logic
    }

    isConnected(): boolean {
        // Implement connection check
        return !!this.connection;
    }
}
```

### Collection Models

```typescript
interface CollectionModel {
    name: string;
    schema: object;
    indexes: Index[];
    validators: Validator[];
}

class CustomCollectionModel implements CollectionModel {
    constructor(
        public name: string,
        public schema: object,
        public indexes: Index[] = [],
        public validators: Validator[] = []
    ) {}

    async validate(doc: any): Promise<boolean> {
        for (const validator of this.validators) {
            if (!await validator(doc)) {
                return false;
            }
        }
        return true;
    }
}
```

### CRUD Operations

```typescript
export class CustomAdapter implements dbInterface {
    // ... other methods ...

    async findOne(collection: string, query: object): Promise<any> {
        try {
            // Implement findOne logic
            const result = await this.executeQuery({
                type: 'findOne',
                collection,
                query
            });
            
            return this.transformResult(result);
        } catch (error) {
            throw new DatabaseError('Failed to find document', error);
        }
    }

    async insertOne(collection: string, doc: object): Promise<any> {
        try {
            // Validate document
            const model = this.models[collection];
            if (!await model.validate(doc)) {
                throw new ValidationError('Document validation failed');
            }

            // Implement insertOne logic
            const result = await this.executeQuery({
                type: 'insertOne',
                collection,
                document: doc
            });
            
            return this.transformResult(result);
        } catch (error) {
            throw new DatabaseError('Failed to insert document', error);
        }
    }
}
```

## Advanced Features

### Query Builder

```typescript
class QueryBuilder {
    private conditions: any[] = [];
    private sorts: any[] = [];
    private skip: number = 0;
    private limit: number = 0;

    where(condition: object): this {
        this.conditions.push(condition);
        return this;
    }

    sort(field: string, direction: 'asc' | 'desc'): this {
        this.sorts.push({ [field]: direction });
        return this;
    }

    skip(count: number): this {
        this.skip = count;
        return this;
    }

    take(count: number): this {
        this.limit = count;
        return this;
    }

    build(): object {
        return {
            conditions: this.conditions,
            sort: this.sorts,
            skip: this.skip,
            limit: this.limit
        };
    }
}
```

### Transactions

```typescript
interface Transaction {
    start(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}

class CustomTransaction implements Transaction {
    constructor(private adapter: CustomAdapter) {}

    async start(): Promise<void> {
        // Implement transaction start
    }

    async commit(): Promise<void> {
        // Implement transaction commit
    }

    async rollback(): Promise<void> {
        // Implement transaction rollback
    }
}

export class CustomAdapter implements dbInterface {
    async withTransaction<T>(
        callback: (transaction: Transaction) => Promise<T>
    ): Promise<T> {
        const transaction = new CustomTransaction(this);
        
        try {
            await transaction.start();
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
```

### Event System

```typescript
type DatabaseEvent = 'beforeInsert' | 'afterInsert' | 'beforeUpdate' | 'afterUpdate';

interface DatabaseEventHandler {
    (event: DatabaseEvent, data: any): Promise<void>;
}

class EventManager {
    private handlers: Map<DatabaseEvent, DatabaseEventHandler[]> = new Map();

    on(event: DatabaseEvent, handler: DatabaseEventHandler): void {
        const handlers = this.handlers.get(event) || [];
        handlers.push(handler);
        this.handlers.set(event, handlers);
    }

    async emit(event: DatabaseEvent, data: any): Promise<void> {
        const handlers = this.handlers.get(event) || [];
        await Promise.all(handlers.map(handler => handler(event, data)));
    }
}

export class CustomAdapter implements dbInterface {
    private events: EventManager = new EventManager();

    async insertOne(collection: string, doc: object): Promise<any> {
        await this.events.emit('beforeInsert', { collection, doc });
        const result = await this.executeInsert(collection, doc);
        await this.events.emit('afterInsert', { collection, doc, result });
        return result;
    }
}
```

## Error Handling

### Custom Error Classes

```typescript
class DatabaseError extends Error {
    constructor(message: string, public cause?: Error) {
        super(message);
        this.name = 'DatabaseError';
    }
}

class ValidationError extends Error {
    constructor(message: string, public errors?: object) {
        super(message);
        this.name = 'ValidationError';
    }
}

class ConnectionError extends DatabaseError {
    constructor(message: string, public cause?: Error) {
        super(message, cause);
        this.name = 'ConnectionError';
    }
}
```

### Error Handling Strategy

```typescript
export class CustomAdapter implements dbInterface {
    private async handleError(error: any): Promise<never> {
        if (error instanceof ValidationError) {
            throw error;
        }

        if (this.isConnectionError(error)) {
            throw new ConnectionError(
                'Database connection failed',
                error
            );
        }

        if (this.isConstraintError(error)) {
            throw new DatabaseError(
                'Constraint violation',
                error
            );
        }

        throw new DatabaseError(
            'Unexpected database error',
            error
        );
    }

    private isConnectionError(error: any): boolean {
        // Implement connection error detection
        return false;
    }

    private isConstraintError(error: any): boolean {
        // Implement constraint error detection
        return false;
    }
}
```

## Testing

### Unit Tests

```typescript
import { describe, test, beforeEach, afterEach } from 'vitest';
import { CustomAdapter } from './custom-adapter';

describe('CustomAdapter', () => {
    let adapter: CustomAdapter;

    beforeEach(async () => {
        adapter = new CustomAdapter({
            // Test configuration
        });
        await adapter.connect();
    });

    afterEach(async () => {
        await adapter.disconnect();
    });

    test('should implement CRUD operations', async () => {
        // Test document
        const doc = {
            title: 'Test Document',
            content: 'Test Content'
        };

        // Insert
        const inserted = await adapter.insertOne('test', doc);
        expect(inserted.id).toBeDefined();

        // Find
        const found = await adapter.findOne('test', { id: inserted.id });
        expect(found.title).toBe(doc.title);

        // Update
        const updated = await adapter.updateOne(
            'test',
            { id: inserted.id },
            { title: 'Updated Title' }
        );
        expect(updated.title).toBe('Updated Title');

        // Delete
        const deleted = await adapter.deleteOne('test', { id: inserted.id });
        expect(deleted).toBe(1);
    });
});
```

## Best Practices

1. **Error Handling**
   - Implement custom error classes
   - Provide detailed error messages
   - Handle all edge cases
   - Log errors appropriately

2. **Performance**
   - Implement connection pooling
   - Use efficient queries
   - Cache when appropriate
   - Monitor performance

3. **Security**
   - Validate input
   - Sanitize queries
   - Use parameterized queries
   - Implement access control

4. **Maintainability**
   - Follow consistent coding style
   - Document all methods
   - Write comprehensive tests
   - Use TypeScript for type safety

## Next Steps

1. [Advanced Features](./05_Advanced_Features.md)
2. [Performance Tuning](./06_Performance_Tuning.md)
3. [Security Best Practices](./07_Security.md)
