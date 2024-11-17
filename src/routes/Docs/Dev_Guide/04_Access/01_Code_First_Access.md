# Code-First Access Control

This guide explains how to implement access control programmatically in SvelteCMS using TypeScript/JavaScript.

## Role Definition

### Basic Role Structure

```typescript
interface Role {
    name: string;
    label: string;
    description?: string;
    permissions: Permission[];
    inherits?: string[];  // Names of roles to inherit from
    priority?: number;    // Higher priority roles override lower ones
}
```

### Creating Roles

```typescript
// roles/AdminRole.ts
import { Role, Permission } from '@sveltecms/types';

export const AdminRole: Role = {
    name: 'admin',
    label: 'Administrator',
    description: 'Full system access',
    permissions: ['*'],  // Wildcard for all permissions
    priority: 100
};

// roles/EditorRole.ts
export const EditorRole: Role = {
    name: 'editor',
    label: 'Content Editor',
    description: 'Can manage content',
    permissions: [
        'content.create',
        'content.read',
        'content.update',
        'content.delete',
        'media.upload',
        'media.manage'
    ],
    priority: 50
};

// roles/AuthorRole.ts
export const AuthorRole: Role = {
    name: 'author',
    label: 'Content Author',
    description: 'Can create and edit own content',
    permissions: [
        'content.create',
        'content.read',
        'content.update.own',
        'media.upload'
    ],
    priority: 25
};
```

### Role Registration

```typescript
// config/roles.ts
import { registerRole } from '@sveltecms/core';
import { AdminRole, EditorRole, AuthorRole } from '../roles';

export function registerRoles() {
    registerRole(AdminRole);
    registerRole(EditorRole);
    registerRole(AuthorRole);
}
```

## Permission System

### Permission Types

```typescript
type Permission = string | PermissionObject;

interface PermissionObject {
    action: string;
    resource: string;
    conditions?: PermissionCondition[];
    fields?: string[];
}

interface PermissionCondition {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'nin';
    value: any;
}
```

### Custom Permission Rules

```typescript
// permissions/ContentPermissions.ts
import { definePermission } from '@sveltecms/core';

export const ContentPermissions = {
    create: definePermission({
        action: 'create',
        resource: 'content',
        conditions: []
    }),

    updateOwn: definePermission({
        action: 'update',
        resource: 'content',
        conditions: [
            {
                field: 'author',
                operator: 'eq',
                value: (context) => context.user.id
            }
        ]
    }),

    publish: definePermission({
        action: 'publish',
        resource: 'content',
        conditions: [
            {
                field: 'status',
                operator: 'in',
                value: ['draft', 'review']
            }
        ]
    })
};
```

## User Management

### User Interface

```typescript
interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    metadata?: Record<string, any>;
    active: boolean;
    lastLogin?: Date;
}
```

### User Creation

```typescript
// users/UserService.ts
import { createUser, assignRole } from '@sveltecms/core';

export async function createEditorUser(userData: Partial<User>) {
    const user = await createUser({
        ...userData,
        roles: ['editor'],
        active: true
    });

    // Additional role assignment if needed
    await assignRole(user.id, 'media_manager');

    return user;
}
```

## Authentication

### JWT Configuration

```typescript
// config/auth.ts
import { configureAuth } from '@sveltecms/core';

export function setupAuth() {
    configureAuth({
        jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d',
            refreshToken: {
                enabled: true,
                expiresIn: '7d'
            }
        },
        passwordPolicy: {
            minLength: 8,
            requireNumbers: true,
            requireSpecialChars: true
        }
    });
}
```

### Custom Authentication Provider

```typescript
// auth/CustomAuthProvider.ts
import { AuthProvider } from '@sveltecms/core';

export class CustomAuthProvider implements AuthProvider {
    async authenticate(credentials: any): Promise<User> {
        // Custom authentication logic
        const user = await validateCredentials(credentials);
        return user;
    }

    async validateToken(token: string): Promise<User> {
        // Custom token validation
        const user = await validateToken(token);
        return user;
    }
}
```

## Access Control Implementation

### Middleware

```typescript
// middleware/authMiddleware.ts
import { createAuthMiddleware } from '@sveltecms/core';

export const authMiddleware = createAuthMiddleware({
    exclude: ['/public', '/api/auth/login'],
    roleRequired: {
        '/admin/*': ['admin'],
        '/api/content/*': ['editor', 'author']
    }
});
```

### Route Guards

```typescript
// routes/adminRoutes.ts
import { requirePermission } from '@sveltecms/core';

export const adminRoutes = {
    '/admin/users': {
        get: [
            requirePermission('user.list'),
            listUsers
        ],
        post: [
            requirePermission('user.create'),
            createUser
        ]
    },
    '/admin/content/:id': {
        put: [
            requirePermission('content.update'),
            updateContent
        ],
        delete: [
            requirePermission('content.delete'),
            deleteContent
        ]
    }
};
```

### Field-Level Access Control

```typescript
// collections/BlogPost.ts
import { defineCollection, defineField } from '@sveltecms/core';

export const BlogPost = defineCollection({
    name: 'blog_post',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            required: true,
            permissions: {
                read: ['*'],
                write: ['editor', 'author']
            }
        }),
        defineField({
            name: 'status',
            type: 'string',
            permissions: {
                read: ['*'],
                write: ['editor']
            }
        }),
        defineField({
            name: 'sensitive_data',
            type: 'object',
            permissions: {
                read: ['admin'],
                write: ['admin']
            }
        })
    ]
});
```

## Testing

### Permission Tests

```typescript
// tests/permissions.test.ts
import { describe, it, expect } from 'vitest';
import { checkPermission } from '@sveltecms/core';

describe('Permission System', () => {
    it('should grant admin access to all resources', async () => {
        const adminUser = { id: '1', roles: ['admin'] };
        const result = await checkPermission(adminUser, 'content.create');
        expect(result).toBe(true);
    });

    it('should restrict author to own content', async () => {
        const authorUser = { id: '2', roles: ['author'] };
        const ownContent = { id: '1', author: '2' };
        const otherContent = { id: '2', author: '3' };

        expect(await checkPermission(
            authorUser, 
            'content.update', 
            ownContent
        )).toBe(true);

        expect(await checkPermission(
            authorUser, 
            'content.update', 
            otherContent
        )).toBe(false);
    });
});
```

## Best Practices

### 1. Role Organization

- Keep roles focused and specific
- Use role inheritance for shared permissions
- Document role purposes and relationships
- Regular audit of role assignments
- Test role combinations

### 2. Permission Design

- Use granular permissions
- Implement permission caching
- Regular security audits
- Document permission changes
- Test permission combinations

### 3. Security

- Use environment variables for secrets
- Implement rate limiting
- Enable audit logging
- Regular security reviews
- Monitor access patterns

### 4. Performance

- Cache permission checks
- Optimize role hierarchy
- Use efficient data structures
- Monitor authentication performance
- Profile access control impact

## Troubleshooting

### Common Issues

1. **Permission Denied Unexpectedly**
   - Check role inheritance
   - Verify permission syntax
   - Review condition logic
   - Check user role assignment

2. **Authentication Failures**
   - Verify token configuration
   - Check credential format
   - Review error handling
   - Monitor token expiration

3. **Performance Problems**
   - Enable permission caching
   - Optimize role hierarchy
   - Review middleware order
   - Check database queries
