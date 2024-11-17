---
title: "API Integration"
description: "Guide to integrating with SvelteCMS collections via API"
icon: "mdi:api"
published: true
order: 8
---

# API Integration

Learn how to integrate your applications with SvelteCMS collections using our comprehensive API.

## API Overview

### Architecture

1. **API Design**
   - RESTful endpoints
   - GraphQL interface
   - WebSocket support
   - API versioning

2. **Core Concepts**
   - Authentication
   - Rate limiting
   - Response formats
   - Error handling

## REST API

### Authentication

1. **Authentication Methods**
   ```javascript
   // API Key Authentication
   headers: {
     'Authorization': 'Bearer YOUR_API_KEY'
   }

   // OAuth2 Authentication
   headers: {
     'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
   }
   ```

2. **Token Management**
   ```javascript
   // Refresh Token
   POST /api/v1/auth/refresh
   {
     "refresh_token": "YOUR_REFRESH_TOKEN"
   }
   ```

### Collection Operations

1. **List Collections**
   ```javascript
   // Get all collections
   GET /api/v1/collections

   // Filter collections
   GET /api/v1/collections?type=content&status=published
   ```

2. **CRUD Operations**
   ```javascript
   // Create collection
   POST /api/v1/collections
   {
     "name": "blog_posts",
     "fields": [...]
   }

   // Read collection
   GET /api/v1/collections/{collection_id}

   // Update collection
   PUT /api/v1/collections/{collection_id}
   {
     "fields": [...]
   }

   // Delete collection
   DELETE /api/v1/collections/{collection_id}
   ```

### Entry Management

1. **Entry Operations**
   ```javascript
   // Create entry
   POST /api/v1/collections/{collection_id}/entries
   {
     "title": "New Post",
     "content": "..."
   }

   // List entries
   GET /api/v1/collections/{collection_id}/entries

   // Get single entry
   GET /api/v1/collections/{collection_id}/entries/{entry_id}

   // Update entry
   PUT /api/v1/collections/{collection_id}/entries/{entry_id}
   {
     "title": "Updated Post"
   }

   // Delete entry
   DELETE /api/v1/collections/{collection_id}/entries/{entry_id}
   ```

2. **Bulk Operations**
   ```javascript
   // Bulk create
   POST /api/v1/collections/{collection_id}/entries/bulk
   {
     "entries": [...]
   }

   // Bulk update
   PUT /api/v1/collections/{collection_id}/entries/bulk
   {
     "entries": [...]
   }

   // Bulk delete
   DELETE /api/v1/collections/{collection_id}/entries/bulk
   {
     "entry_ids": [...]
   }
   ```

## GraphQL API

### Schema

1. **Type Definitions**
   ```graphql
   type Collection {
     id: ID!
     name: String!
     fields: [Field!]!
     entries: [Entry!]!
   }

   type Entry {
     id: ID!
     collection: Collection!
     fields: JSON!
     created_at: DateTime!
     updated_at: DateTime!
   }
   ```

2. **Queries**
   ```graphql
   # Get collections
   query Collections {
     collections {
       id
       name
       fields {
         name
         type
       }
     }
   }

   # Get entries
   query Entries($collection_id: ID!) {
     entries(collection_id: $collection_id) {
       id
       fields
     }
   }
   ```

3. **Mutations**
   ```graphql
   # Create entry
   mutation CreateEntry($collection_id: ID!, $data: JSON!) {
     createEntry(collection_id: $collection_id, data: $data) {
       id
       fields
     }
   }

   # Update entry
   mutation UpdateEntry($entry_id: ID!, $data: JSON!) {
     updateEntry(entry_id: $entry_id, data: $data) {
       id
       fields
     }
   }
   ```

## Webhooks

### Configuration

1. **Event Setup**
   ```javascript
   // Register webhook
   POST /api/v1/webhooks
   {
     "url": "https://your-app.com/webhook",
     "events": ["entry.created", "entry.updated"],
     "collections": ["blog_posts"]
   }
   ```

2. **Event Handling**
   ```javascript
   // Example webhook payload
   {
     "event": "entry.created",
     "collection": "blog_posts",
     "entry": {
       "id": "123",
       "fields": {...}
     }
   }
   ```

## API Features

### Filtering

1. **Query Parameters**
   ```javascript
   // Filter by field
   GET /api/v1/collections/{collection_id}/entries?title=Welcome

   // Complex filters
   GET /api/v1/collections/{collection_id}/entries?
     status=published&
     created_at[gt]=2023-01-01
   ```

2. **Search**
   ```javascript
   // Full-text search
   GET /api/v1/collections/{collection_id}/entries/search?
     q=search+term

   // Advanced search
   POST /api/v1/collections/{collection_id}/entries/search
   {
     "query": {
       "must": [...],
       "should": [...]
     }
   }
   ```

### Pagination

1. **Offset Pagination**
   ```javascript
   GET /api/v1/collections/{collection_id}/entries?
     limit=10&
     offset=20
   ```

2. **Cursor Pagination**
   ```javascript
   GET /api/v1/collections/{collection_id}/entries?
     limit=10&
     cursor=YOUR_CURSOR
   ```

## Best Practices

### Performance

1. **Optimization**
   - Use field selection
   - Implement caching
   - Batch requests
   - Compress responses

2. **Rate Limiting**
   - Monitor usage
   - Handle limits
   - Implement retry
   - Cache responses

### Security

1. **Authentication**
   - Secure keys
   - Rotate tokens
   - Use HTTPS
   - Validate requests

2. **Data Protection**
   - Validate input
   - Sanitize output
   - Log access
   - Handle errors

## Error Handling

### Response Codes

1. **HTTP Status**
   ```javascript
   200: Success
   201: Created
   400: Bad Request
   401: Unauthorized
   403: Forbidden
   404: Not Found
   429: Too Many Requests
   500: Server Error
   ```

2. **Error Format**
   ```javascript
   {
     "error": {
       "code": "INVALID_INPUT",
       "message": "Invalid field value",
       "details": {...}
     }
   }
   ```

## Next Steps

1. [Best Practices](./09_Best_Practices.md)
2. [Developer Guide](../Dev_Guide/03_Collections/01_Overview.md)
3. [Community Resources](./10_Community_Resources.md)
4. [API Reference](../API_Reference/01_Overview.md)
