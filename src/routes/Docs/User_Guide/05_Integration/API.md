---
title: "Integration Guide"
description: "Integrating SveltyCMS with other systems and services"
icon: "mdi:api"
---

# API Integration Guide

Learn how to integrate with SveltyCMS using our powerful REST and GraphQL APIs. This guide covers authentication, endpoints, and best practices.

## API Overview

### Available APIs
- REST API
- GraphQL API
- Webhooks
- Server Events
- Custom Integrations

## Authentication

### API Keys
1. Generate key
   - Access level
   - Expiration
   - IP restrictions
   - Usage limits

2. Key Management
   - Rotate keys
   - Monitor usage
   - Revoke access
   - Track activity

### OAuth2
1. Setup
   - Register application
   - Configure scopes
   - Set redirect URLs
   - Get credentials

2. Flow Types
   - Authorization Code
   - Client Credentials
   - Password Grant
   - Refresh Token

## REST API

### Endpoints

#### Content
```
GET    /api/v1/content
POST   /api/v1/content
GET    /api/v1/content/:id
PUT    /api/v1/content/:id
DELETE /api/v1/content/:id
```

#### Media
```
GET    /api/v1/media
POST   /api/v1/media
GET    /api/v1/media/:id
PUT    /api/v1/media/:id
DELETE /api/v1/media/:id
```

#### Users
```
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
```

### Request Format
```json
{
  "data": {
    "title": "Example Content",
    "body": "Content body...",
    "status": "draft"
  },
  "meta": {
    "locale": "en",
    "version": "1.0"
  }
}
```

### Response Format
```json
{
  "data": {
    "id": "123",
    "type": "content",
    "attributes": {
      "title": "Example Content",
      "body": "Content body..."
    }
  },
  "meta": {
    "timestamp": "2023-01-01T00:00:00Z"
  }
}
```

## GraphQL API

### Schema
```graphql
type Content {
  id: ID!
  title: String!
  body: String
  status: String
  author: User
  createdAt: DateTime!
  updatedAt: DateTime
}

type Query {
  content(id: ID!): Content
  contents(filter: ContentFilter): [Content]!
}

type Mutation {
  createContent(input: ContentInput!): Content
  updateContent(id: ID!, input: ContentInput!): Content
  deleteContent(id: ID!): Boolean
}
```

### Queries
```graphql
query GetContent {
  content(id: "123") {
    id
    title
    body
    author {
      name
      email
    }
  }
}
```

### Mutations
```graphql
mutation CreateContent {
  createContent(input: {
    title: "New Content"
    body: "Content body..."
    status: "draft"
  }) {
    id
    title
    status
  }
}
```

## Webhooks

### Configuration
1. Endpoint setup
2. Event selection
3. Security settings
4. Retry policy
5. Logging options

### Event Types
- Content changes
- Media updates
- User actions
- System events
- Custom events

### Payload Format
```json
{
  "event": "content.created",
  "timestamp": "2023-01-01T00:00:00Z",
  "data": {
    "id": "123",
    "type": "content",
    "changes": {
      "title": "New Title",
      "status": "published"
    }
  }
}
```

## Rate Limiting

### Limits
- Requests per minute
- Concurrent connections
- Payload size
- Query complexity
- Bandwidth usage

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Error Handling

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Server Error

### Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

## Best Practices

### Performance
1. Use pagination
2. Limit field selection
3. Cache responses
4. Batch requests
5. Monitor usage

### Security
1. Use HTTPS
2. Rotate keys
3. Validate input
4. Rate limit
5. Log access

### Integration
1. Handle errors
2. Implement retry
3. Monitor health
4. Version control
5. Document changes

## Tips and Tricks

1. **Development**
   - Use API playground
   - Test thoroughly
   - Monitor performance
   - Handle errors

2. **Security**
   - Regular key rotation
   - Access monitoring
   - Input validation
   - Error handling

3. **Management**
   - Version control
   - Documentation
   - Change tracking
   - Usage monitoring

## Need Help?

- Check [GraphQL Playground](/graphql)
- Review [API Reference](../13_API_Reference/REST.md)
- Visit our [GitHub repository](https://github.com/SveltyCMS/SveltyCMS)
