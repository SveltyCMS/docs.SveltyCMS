# User Management

## Overview

User Management is responsible for creating, managing, and removing user accounts. This includes handling user attributes and ensuring data integrity within the system.

## Methods and Their Purposes

- `createUser(userData: Partial<User>): Promise<User>`
  - **Purpose**: Creates a new user in the database.
  - **Parameters**: `userData` - Partial user data required for creating a user.

- `updateUserAttributes(userId: string, attributes: Partial<User>): Promise<void>`
  - **Purpose**: Updates attributes of an existing user.
  - **Parameters**: `userId` - The ID of the user to update. `attributes` - Partial user attributes to update.

- `deleteUser(userId: string): Promise<void>`
  - **Purpose**: Deletes a user from the database.
  - **Parameters**: `userId` - The ID of the user to delete.

- `getUserById(userId: string): Promise<User | null>`
  - **Purpose**: Retrieves a user by their ID.
  - **Parameters**: `userId` - The ID of the user to retrieve.

- `getUserByEmail(email: string): Promise<User | null>`
  - **Purpose**: Retrieves a user by their email.
  - **Parameters**: `email` - The email of the user to retrieve.

- `getAllUsers(): Promise<User[]>`
  - **Purpose**: Retrieves all users from the database.
  - **Parameters**: None.

- `getUserCount(): Promise<number>`
  - **Purpose**: Retrieves the total count of users in the database.
  - **Parameters**: None.

## Data Structure

### User

```typescript
export interface User {
  id: string;               // Unique identifier for the user
  email: string;            // Email address of the user
  password?: string;        // Hashed password of the user
  role: string;             // Role of the user (e.g., admin, developer, editor, user)
  username?: string;        // Username of the user
  avatar?: string;          // URL of the user's avatar image
  lastAuthMethod?: string;  // The last authentication method used by the user
  lastActiveAt?: Date;      // The last time the user was active
  expiresAt?: Date;         // When the reset token expires
  is_registered?: boolean;  // Indicates if the user has completed registration
  blocked?: boolean;        // Indicates if the user is blocked
  resetRequestedAt?: string; // The last time the user requested a password reset
  resetToken?: string;      // Token for resetting the user's password
  failedAttempts: number;   // Tracks the number of consecutive failed login attempts
  lockoutUntil?: Date | null; // Time until which the user is locked out of their account
  is2FAEnabled?: boolean;   // Indicates if two-factor authentication is enabled
  permissions?: Permission[]; // User-specific permissions
}