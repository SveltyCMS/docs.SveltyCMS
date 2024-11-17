---
title: "SQL Database Adapters"
description: "Implementation guide for SQL database adapters including MariaDB and Drizzle"
icon: "simple-icons:mysql"
published: true
order: 2
---

# SQL Database Adapters

SvelteCMS provides robust support for SQL databases through two primary adapters: MariaDB and Drizzle. This document covers the implementation details, features, and best practices for both adapters.

## MariaDB Adapter

### Configuration

#### Connection Settings

```typescript
interface MariaDBConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    connectionLimit?: number;
}
```

#### Environment Variables

```env
MARIADB_HOST=localhost
MARIADB_PORT=3306
MARIADB_DATABASE=sveltecms
MARIADB_USER=admin
MARIADB_PASSWORD=secure_password
MARIADB_CONNECTION_LIMIT=10
```

### Implementation

#### Connection Pool Management

```typescript
import { createPool, Pool } from 'mariadb';
import { dbInterface } from '../interfaces/dbInterface';

export class MariaDBAdapter implements dbInterface {
    private pool: Pool;
    private models: Record<string, any>;

    constructor(config: MariaDBConfig) {
        this.pool = createPool({
            host: config.host,
            port: config.port,
            database: config.database,
            user: config.user,
            password: config.password,
            connectionLimit: config.connectionLimit || 5
        });
        this.models = {};
    }

    async connect(): Promise<void> {
        try {
            await this.pool.getConnection();
            console.log('Successfully connected to MariaDB');
        } catch (error) {
            console.error('MariaDB connection failed:', error.message);
            throw new Error('Failed to connect to MariaDB');
        }
    }
}
```

#### Schema Management

```typescript
async setupCollectionModels(): Promise<void> {
    const conn = await this.pool.getConnection();
    try {
        // Create content table
        await conn.query(`
            CREATE TABLE IF NOT EXISTS content (
                id VARCHAR(36) PRIMARY KEY,
                slug VARCHAR(255) UNIQUE,
                title TEXT,
                content JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create indexes
        await conn.query('CREATE INDEX idx_content_slug ON content(slug)');
        
    } finally {
        conn.release();
    }
}
```

### Features

#### Transaction Support

```typescript
async createContentWithMedia(content: any, media: Buffer[]): Promise<void> {
    const conn = await this.pool.getConnection();
    try {
        await conn.beginTransaction();

        // Insert content
        const contentResult = await conn.query(
            'INSERT INTO content (id, slug, title, content) VALUES (?, ?, ?, ?)',
            [content.id, content.slug, content.title, JSON.stringify(content.data)]
        );

        // Store media files
        for (const file of media) {
            await conn.query(
                'INSERT INTO media (content_id, data, metadata) VALUES (?, ?, ?)',
                [contentResult.insertId, file, JSON.stringify({ contentId: contentResult.insertId })]
            );
        }

        await conn.commit();
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}
```

## Drizzle Adapter

### Configuration

```typescript
interface DrizzleConfig {
    connectionString: string;
    schema?: string;
    poolSize?: number;
}
```

### Implementation

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { dbInterface } from '../interfaces/dbInterface';

export class DrizzleAdapter implements dbInterface {
    private pool: Pool;
    private db: ReturnType<typeof drizzle>;
    private models: Record<string, any>;

    constructor(config: DrizzleConfig) {
        this.pool = new Pool({
            connectionString: config.connectionString,
            max: config.poolSize || 10
        });
        this.db = drizzle(this.pool);
    }
}
```

### Schema Definition

```typescript
import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const content = pgTable('content', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').unique().notNull(),
    title: text('title').notNull(),
    content: jsonb('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
});
```

### Migration Support

```typescript
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async setupDatabase(): Promise<void> {
    try {
        await migrate(this.db, {
            migrationsFolder: './drizzle/migrations'
        });
        console.log('Migrations completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}
```

## Performance Optimization

### Connection Pooling

Both adapters implement connection pooling for optimal performance:

```typescript
// MariaDB pooling configuration
const pool = createPool({
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true
});

// Drizzle pooling configuration
const pool = new Pool({
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});
```

### Query Optimization

```typescript
// Prepared statements in MariaDB
const stmt = await conn.prepare(
    'SELECT * FROM content WHERE slug = ? AND status = ?'
);

// Query building in Drizzle
const result = await db.select()
    .from(content)
    .where(eq(content.slug, slug))
    .limit(1);
```

## Security Considerations

### Input Validation

Both adapters implement thorough input validation:

```typescript
// MariaDB parameter binding
const result = await conn.query(
    'SELECT * FROM content WHERE id = ?',
    [sanitizeInput(id)]
);

// Drizzle type-safe queries
const result = await db.select()
    .from(content)
    .where(eq(content.id, validateUUID(id)));
```

### Connection Security

```typescript
// MariaDB SSL configuration
const pool = createPool({
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('/path/to/ca.pem')
    }
});

// Drizzle SSL configuration
const pool = new Pool({
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('/path/to/ca.pem')
    }
});
```

## Best Practices

1. **Connection Management**
   - Always use connection pooling
   - Implement proper error handling
   - Release connections after use
   - Monitor pool metrics

2. **Query Optimization**
   - Use prepared statements
   - Implement proper indexing
   - Optimize complex queries
   - Use transactions when needed

3. **Security**
   - Validate all inputs
   - Use parameterized queries
   - Implement proper access control
   - Regular security audits

4. **Maintenance**
   - Regular backups
   - Index optimization
   - Query performance monitoring
   - Regular updates
