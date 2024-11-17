---
title: "Drizzle Adapter"
description: "Implementation guide for the Drizzle SQL database adapter"
icon: "simple-icons:postgresql"
published: true
order: 3
---

# Drizzle Adapter

The Drizzle adapter provides SQL database support for SvelteCMS, implementing the database interface with SQL-specific optimizations and features. It supports PostgreSQL, MySQL, and SQLite.

## Configuration

### Connection Settings

```typescript
interface DrizzleConfig {
    type: 'postgres' | 'mysql' | 'sqlite';
    connection: {
        host?: string;
        port?: number;
        database: string;
        username?: string;
        password?: string;
        filename?: string;  // For SQLite
    };
    pool?: {
        min: number;
        max: number;
    };
}
```

### Environment Variables

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sveltecms
DB_USER=admin
DB_PASSWORD=secure_password
```

## Implementation

### Schema Definition

```typescript
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Content table
export const content = pgTable('content', {
    id: serial('id').primaryKey(),
    slug: text('slug').unique().notNull(),
    title: text('title').notNull(),
    content: text('content'),
    authorId: integer('author_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

// Media table
export const media = pgTable('media', {
    id: serial('id').primaryKey(),
    filename: text('filename').notNull(),
    path: text('path').notNull(),
    mimeType: text('mime_type'),
    size: integer('size'),
    contentId: integer('content_id').references(() => content.id),
    uploadedAt: timestamp('uploaded_at').defaultNow()
});

// Relations
export const contentRelations = relations(content, ({ many, one }) => ({
    author: one(users, {
        fields: [content.authorId],
        references: [users.id]
    }),
    media: many(media)
}));
```

### Adapter Class

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { dbInterface } from '../interfaces/dbInterface';

export class DrizzleAdapter implements dbInterface {
    private pool: Pool;
    private db: ReturnType<typeof drizzle>;
    private models: Record<string, any>;

    constructor(config: DrizzleConfig) {
        this.pool = new Pool({
            host: config.connection.host,
            port: config.connection.port,
            database: config.connection.database,
            user: config.connection.username,
            password: config.connection.password,
            max: config.pool?.max || 20
        });
        this.db = drizzle(this.pool);
    }

    async connect(): Promise<void> {
        // Test connection
        await this.pool.query('SELECT 1');
        
        // Run migrations
        await migrate(this.db, { migrationsFolder: './drizzle' });
    }

    async disconnect(): Promise<void> {
        await this.pool.end();
    }
}
```

## Features

### Query Builder

```typescript
async findOne(collection: string, query: object): Promise<any> {
    const table = this.getTableForCollection(collection);
    
    return await this.db
        .select()
        .from(table)
        .where(this.buildWhereClause(query))
        .limit(1)
        .execute();
}

async findMany(collection: string, query: object): Promise<any[]> {
    const table = this.getTableForCollection(collection);
    
    return await this.db
        .select()
        .from(table)
        .where(this.buildWhereClause(query))
        .execute();
}
```

### Transactions

```typescript
async createContentWithMedia(content: any, mediaFiles: any[]): Promise<void> {
    return await this.db.transaction(async (tx) => {
        // Insert content
        const [contentResult] = await tx
            .insert(content)
            .values(content)
            .returning();

        // Insert media files
        const mediaValues = mediaFiles.map(file => ({
            filename: file.name,
            path: file.path,
            contentId: contentResult.id
        }));

        await tx.insert(media).values(mediaValues);

        return contentResult;
    });
}
```

### Migrations

```typescript
import { migrate } from 'drizzle-orm/node-postgres/migrator';

// Migration file: 0000_create_content.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const content = pgTable('content', {
    id: serial('id').primaryKey(),
    slug: text('slug').unique().notNull(),
    title: text('title').notNull(),
    content: text('content'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});

// Run migrations
async function runMigrations() {
    await migrate(db, { migrationsFolder: './drizzle' });
}
```

## Performance Optimization

### Connection Pooling

```typescript
class PooledDrizzleAdapter extends DrizzleAdapter {
    constructor(config: DrizzleConfig) {
        super({
            ...config,
            pool: {
                min: 2,
                max: 10
            }
        });
    }

    async getConnection() {
        return await this.pool.connect();
    }

    async releaseConnection(client: PoolClient) {
        client.release();
    }
}
```

### Query Optimization

```typescript
async optimizeQueries(): Promise<void> {
    // Create indexes
    await this.db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_content_slug ON content (slug);
        CREATE INDEX IF NOT EXISTS idx_content_author ON content (author_id);
        CREATE INDEX IF NOT EXISTS idx_media_content ON media (content_id);
    `);

    // Analyze tables
    await this.db.execute(sql`
        ANALYZE content;
        ANALYZE media;
    `);
}
```

## Error Handling

### Database Errors

```typescript
class DatabaseError extends Error {
    constructor(message: string, public cause?: Error) {
        super(message);
        this.name = 'DatabaseError';
    }
}

async executeQuery(query: any): Promise<any> {
    try {
        return await this.db.execute(query);
    } catch (error) {
        if (error.code === '23505') {
            throw new DatabaseError('Duplicate key violation', error);
        }
        if (error.code === '23503') {
            throw new DatabaseError('Foreign key violation', error);
        }
        throw new DatabaseError('Database operation failed', error);
    }
}
```

## Testing

### Integration Tests

```typescript
import { describe, test, beforeAll, afterAll } from 'vitest';
import { DrizzleAdapter } from './drizzle-adapter';

describe('DrizzleAdapter', () => {
    let adapter: DrizzleAdapter;

    beforeAll(async () => {
        adapter = new DrizzleAdapter({
            type: 'postgres',
            connection: {
                host: 'localhost',
                port: 5432,
                database: 'test_db',
                username: 'test_user',
                password: 'test_password'
            }
        });
        await adapter.connect();
    });

    afterAll(async () => {
        await adapter.disconnect();
    });

    test('should create and retrieve content', async () => {
        const content = {
            title: 'Test Content',
            slug: 'test-content'
        };

        const created = await adapter.insertOne('content', content);
        expect(created.id).toBeDefined();

        const retrieved = await adapter.findOne('content', { slug: 'test-content' });
        expect(retrieved.title).toBe('Test Content');
    });
});
```

## Best Practices

1. **Connection Management**
   - Use connection pooling
   - Implement proper connection cleanup
   - Monitor pool health
   - Handle connection timeouts

2. **Query Optimization**
   - Use prepared statements
   - Implement efficient indexes
   - Monitor query performance
   - Use appropriate transaction isolation levels

3. **Data Integrity**
   - Use foreign key constraints
   - Implement proper validation
   - Handle concurrent updates
   - Maintain data consistency

4. **Security**
   - Use parameterized queries
   - Implement access control
   - Encrypt sensitive data
   - Regular security audits

## Migration from MongoDB

### Data Migration Strategy

```typescript
async migrateFromMongoDB(mongoUri: string): Promise<void> {
    const mongoClient = new MongoClient(mongoUri);
    
    try {
        await mongoClient.connect();
        const mongoDb = mongoClient.db();

        // Migrate content
        const contents = await mongoDb
            .collection('content')
            .find({})
            .toArray();

        await this.db.transaction(async (tx) => {
            for (const content of contents) {
                const { _id, ...contentData } = content;
                await tx.insert(this.content).values({
                    ...contentData,
                    mongoId: _id.toString()
                });
            }
        });

        // Migrate media
        const mediaFiles = await mongoDb
            .collection('media')
            .find({})
            .toArray();

        await this.db.transaction(async (tx) => {
            for (const media of mediaFiles) {
                const { _id, ...mediaData } = media;
                await tx.insert(this.media).values({
                    ...mediaData,
                    mongoId: _id.toString()
                });
            }
        });
    } finally {
        await mongoClient.close();
    }
}
```

## Next Steps

1. [Custom Adapters](./04_Custom_Adapters.md)
2. [Advanced Features](./05_Advanced_Features.md)
3. [Performance Tuning](./06_Performance_Tuning.md)
