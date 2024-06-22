# Database Adapter Interface Documentation

## Overview
The `DatabaseAdapter` interface defines essential methods for database operations within SveltyCMS, ensuring that any database adapter implements these foundational tasks.

## Methods

### connect()
Establishes a connection to the database.

### getCollectionModels()
Retrieves or initializes database collection models.

### setupAuthModels()
Initializes models specific to authentication.

### setupMediaModels()
Initializes models specific to media storage and retrieval.

## Implementation Notes
Implementors of the `DatabaseAdapter` should ensure that all methods return promises where necessary and handle exceptions gracefully to maintain stability across the application.

## Interface Definition
```typescript
export interface DatabaseAdapter {
    connect(): Promise<void>;
    getCollectionModels(): Promise<Record<string, any>>;
    setupAuthModels(): void;
    setupMediaModels(): void;
}