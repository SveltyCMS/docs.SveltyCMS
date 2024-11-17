---
title: "User Management"
description: "Guide to user management in SvelteCMS"
---

# User Management

## User Guide

### Managing Your Account

1. **Profile Management**
   - Access your profile via the top-right menu → Profile
   - Update personal information
   - Change profile picture
   - Modify display preferences

2. **Security Settings**
   - Change password
   - Enable/disable two-factor authentication
   - View login history
   - Manage connected devices

3. **Notification Preferences**
   - Configure email notifications
   - Set up system alerts
   - Customize notification frequency

### Administrator Guide

1. **User Administration**
   - Access: Admin Panel → Users
   - View all users
   - Create new users
   - Modify user roles
   - Disable/Enable accounts

2. **Bulk Operations**
   - Select multiple users
   - Assign roles in bulk
   - Export user data
   - Send bulk notifications

3. **User Monitoring**
   - View active sessions
   - Track user activities
   - Monitor login attempts
   - Review security logs

## Developer Guide

### User Data Structure

```typescript
interface User {
  id: string;
  email: string;
  username?: string;
  password: string; // Hashed
  roles: string[];
  permissions: string[];
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    preferences: UserPreferences;
  };
  security: {
    twoFactorEnabled: boolean;
    lastLogin: Date;
    loginAttempts: number;
  };
  status: 'active' | 'disabled' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}
```

### Database Operations

1. **User Creation**
```typescript
import { createUser } from '@sveltecms/auth/user';

const newUser = await createUser({
  email: 'user@example.com',
  password: 'hashedPassword',
  roles: ['editor'],
  status: 'active'
});
```

2. **User Queries**
```typescript
import { findUsers, findUserById } from '@sveltecms/auth/user';

// Find users by criteria
const users = await findUsers({
  roles: ['editor'],
  status: 'active'
});

// Get specific user
const user = await findUserById('user_id');
```

3. **User Updates**
```typescript
import { updateUser } from '@sveltecms/auth/user';

await updateUser(userId, {
  roles: ['admin', 'editor'],
  security: {
    twoFactorEnabled: true
  }
});
```

### Security Considerations

1. **Password Management**
```typescript
import { hashPassword, verifyPassword } from '@sveltecms/auth/security';

// Hash password before storage
const hashedPassword = await hashPassword(plainPassword);

// Verify password
const isValid = await verifyPassword(plainPassword, hashedPassword);
```

2. **Session Management**
```typescript
import { createSession, invalidateSession } from '@sveltecms/auth/session';

// Create new session
const session = await createSession(user, {
  maxAge: '7d',
  secure: true
});

// Invalidate session
await invalidateSession(sessionId);
```

3. **Role Verification**
```typescript
import { checkUserRole } from '@sveltecms/auth/permissions';

const canAccess = await checkUserRole(user, ['admin', 'editor']);
```

### Event Hooks

```typescript
import { userEvents } from '@sveltecms/auth/events';

// User creation hook
userEvents.on('user.created', async (user) => {
  await sendWelcomeEmail(user.email);
});

// Password change hook
userEvents.on('user.password.changed', async (user) => {
  await sendPasswordChangeNotification(user.email);
});
```

## Next Steps

- [Session Management](./04-SessionManagement.md)
- [Role Management](./05-RoleManagement.md)
- [Permission Management](./07-PermissionManagement.md)
