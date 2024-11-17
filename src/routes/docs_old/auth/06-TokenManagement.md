---
title: "Token Management"
description: "Handles the lifecycle and management of authentication tokens, used for tasks such as password resets and email verification."
---

# Token Management

## Overview

Token Management handles the lifecycle and management of authentication tokens, used for tasks such as password resets and email verification.

## Methods and Their Purposes

- `createToken(data: { userId: string; email: string; expires: number }): Promise<string>`
  - **Purpose**: Creates a new token for a user.
  - **Parameters**: `data` - Object containing user ID, email, and token expiration time.

- `validateToken(token: string, userId: string): Promise<{ success: boolean; message: string }>`
  - **Purpose**: Validates a token.
  - **Parameters**: `token` - The token to validate. `userId` - The ID of the user to whom the token belongs.

- `consumeToken(token: string, userId: string): Promise<{ status: boolean; message: string }>`
  - **Purpose**: Consumes a token, marking it as used.
  - **Parameters**: `token` - The token to consume. `userId` - The ID of the user to whom the token belongs.

- `getAllTokens(): Promise<Token[]>`
  - **Purpose**: Retrieves all tokens from the database.
  - **Parameters**: None.

## Data Structure

### Token

```typescript
export interface Token {
  id: string;           // Unique identifier for the token
  userId: string;       // The ID of the user who owns the token
  token: string;        // The token string
  email?: string;       // Email associated with the token
  expires: Date;        // When the token expires
}
