---
title: "MongoDB Adapter"
description: "Implementation guide for the MongoDB database adapter"
icon: "simple-icons:mongodb"
published: true
order: 3
---

# MongoDB Adapter

The MongoDB adapter provides native support for MongoDB databases in SvelteCMS, implementing the database interface with MongoDB-specific optimizations and features.

## Configuration

### Connection Settings

```typescript
interface MongoDBConfig {
    uri: string;              // MongoDB connection URI
    dbName: string;          // Database name
    options?: {
        useNewUrlParser: boolean;
        useUnifiedTopology: boolean;
        retryWrites: boolean;
        w: string | number;   // Write concern
    };
}
```

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=sveltecms
MONGODB_USER=admin
MONGODB_PASSWORD=secure_password
```

## Implementation

### Adapter Class

```typescript
import { MongoClient, Db } from 'mongodb';
import { dbInterface } from '../interfaces/dbInterface';

export class MongoDBAdapter implements dbInterface {
    private client: MongoClient;
    private db: Db;
    private models: Record<string, CollectionModel>;

    constructor(config: MongoDBConfig) {
        this.client = new MongoClient(config.uri, config.options);
        this.models = {};
    }

    async connect(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db(config.dbName);
    }

    async disconnect(): Promise<void> {
        await this.client.close();
    }
}
```

### Collection Models

The adapter creates MongoDB collections for each CMS model:

```typescript
async setupCollectionModels(): Promise<void> {
    // Create collections with indexes
    await this.db.createCollection('content');
    await this.db.collection('content').createIndex({ slug: 1 }, { unique: true });
    
    // Setup collection models
    this.models.content = new ContentModel(this.db.collection('content'));
}
```

## Features

### GridFS Integration

Media file storage using GridFS:

```typescript
async storeMedia(file: Buffer, metadata: MediaMetadata): Promise<string> {
    const bucket = new GridFSBucket(this.db);
    const uploadStream = bucket.openUploadStream(metadata.filename, {
        metadata: metadata
    });

    return new Promise((resolve, reject) => {
        uploadStream.end(file, (error) => {
            if (error) reject(error);
            resolve(uploadStream.id.toString());
        });
    });
}
```

### Transactions

Support for multi-document transactions:

```typescript
async createContentWithMedia(content: any, media: Buffer[]): Promise<void> {
    const session = this.client.startSession();
    
    try {
        await session.withTransaction(async () => {
            // Store content
            const contentResult = await this.models.content.create(content);
            
            // Store associated media
            const mediaIds = await Promise.all(
                media.map(file => this.storeMedia(file, {
                    contentId: contentResult._id
                }))
            );
            
            // Update content with media references
            await this.models.content.updateOne(
                { _id: contentResult._id },
                { $set: { mediaIds } }
            );
        });
    } finally {
        await session.endSession();
    }
}
```

### Aggregation Pipelines

Complex queries using MongoDB aggregation:

```typescript
async getContentWithRelations(query: object): Promise<any[]> {
    return this.db.collection('content').aggregate([
        { $match: query },
        {
            $lookup: {
                from: 'media',
                localField: 'mediaIds',
                foreignField: '_id',
                as: 'media'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'authorId',
                foreignField: '_id',
                as: 'author'
            }
        }
    ]).toArray();
}
```

## Performance Optimization

### Indexing Strategy

```typescript
async optimizeIndexes(): Promise<void> {
    // Content collection indexes
    await this.db.collection('content').createIndexes([
        { key: { slug: 1 }, unique: true },
        { key: { publishedAt: -1 } },
        { key: { authorId: 1 } },
        { key: { tags: 1 } }
    ]);

    // Media collection indexes
    await this.db.collection('media').createIndexes([
        { key: { contentId: 1 } },
        { key: { uploadedAt: -1 } }
    ]);
}
```

### Caching

Implementation of MongoDB query caching:

```typescript
class CachedMongoDBAdapter extends MongoDBAdapter {
    private cache: Map<string, any>;
    private ttl: number;

    constructor(config: MongoDBConfig, ttl: number = 3600) {
        super(config);
        this.cache = new Map();
        this.ttl = ttl;
    }

    async findOne(collection: string, query: object): Promise<any> {
        const cacheKey = this.getCacheKey(collection, query);
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const result = await super.findOne(collection, query);
        this.cache.set(cacheKey, result);
        
        return result;
    }
}
```

## Error Handling

### Connection Errors

```typescript
async connect(): Promise<void> {
    try {
        await this.client.connect();
        this.db = this.client.db(config.dbName);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new DatabaseConnectionError(
            'Failed to connect to MongoDB',
            { cause: error }
        );
    }
}
```

### Operation Errors

```typescript
async findOne(collection: string, query: object): Promise<any> {
    try {
        return await this.db.collection(collection).findOne(query);
    } catch (error) {
        console.error('MongoDB operation error:', error);
        throw new DatabaseOperationError(
            'Failed to execute findOne operation',
            { cause: error }
        );
    }
}
```

## Testing

### Unit Tests

```typescript
describe('MongoDBAdapter', () => {
    let adapter: MongoDBAdapter;
    
    beforeAll(async () => {
        adapter = new MongoDBAdapter({
            uri: 'mongodb://localhost:27017',
            dbName: 'test_db'
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
        expect(created).toBeDefined();

        const retrieved = await adapter.findOne('content', { slug: 'test-content' });
        expect(retrieved.title).toBe('Test Content');
    });
});
```

## Migration

### Data Migration

```typescript
async migrateData(sourceUri: string, targetUri: string): Promise<void> {
    const sourceClient = new MongoClient(sourceUri);
    const targetClient = new MongoClient(targetUri);

    try {
        await sourceClient.connect();
        await targetClient.connect();

        const sourceDb = sourceClient.db();
        const targetDb = targetClient.db();

        // Migrate collections
        const collections = await sourceDb.listCollections().toArray();
        
        for (const collection of collections) {
            const data = await sourceDb
                .collection(collection.name)
                .find({})
                .toArray();
            
            if (data.length > 0) {
                await targetDb
                    .collection(collection.name)
                    .insertMany(data);
            }
        }
    } finally {
        await sourceClient.close();
        await targetClient.close();
    }
}
```

## Best Practices

1. **Connection Management**
   - Use connection pooling
   - Implement retry logic
   - Monitor connection health
   - Handle timeouts appropriately

2. **Query Optimization**
   - Use appropriate indexes
   - Implement efficient queries
   - Monitor query performance
   - Use projection to limit fields

3. **Error Handling**
   - Implement proper error classes
   - Log errors appropriately
   - Provide meaningful error messages
   - Handle edge cases

4. **Security**
   - Use authentication
   - Implement access control
   - Sanitize queries
   - Encrypt sensitive data

## Next Steps

1. [Drizzle Adapter](./03_Drizzle_Adapter.md)
2. [Custom Adapters](./04_Custom_Adapters.md)
3. [Advanced Features](./05_Advanced_Features.md)
