---
title: "Authentication Overview"
description: "Guide to understanding and using SvelteCMS authentication features"
icon: "mdi:shield-lock"
published: true
order: 1
---

# Authentication in SvelteCMS

This guide explains how to use SvelteCMS's authentication features to manage users, roles, and permissions.

## Getting Started

### Logging In

1. **Access the Login Page**
   - Navigate to your CMS login page
   - Enter your credentials
   - Use two-factor authentication if enabled

2. **First-Time Login**
   - Change default password
   - Set up security questions
   - Configure two-factor authentication (recommended)

### Session Management

- Sessions automatically expire after inactivity
- Use "Remember Me" for longer sessions
- Manual logout for security
- View active sessions in user settings

## User Management

### Creating Users

1. Navigate to Users section
2. Click "Add New User"
3. Fill in required information:
   - Username
   - Email
   - Password
   - Role assignment

### Managing User Accounts

- Reset passwords
- Enable/disable accounts
- Set account expiration
- Manage email preferences

## Role Management

### Understanding Roles

- **Administrator**: Full system access
- **Editor**: Content management access
- **Author**: Content creation access
- **Viewer**: Read-only access

### Custom Roles

1. Create custom roles
2. Assign specific permissions
3. Set role hierarchies
4. Define access levels

## Security Best Practices

### Password Guidelines

- Use strong passwords
- Regular password changes
- No password sharing
- Secure password storage

### Two-Factor Authentication

1. Enable 2FA in settings
2. Choose authentication method:
   - Authenticator app
   - SMS verification
   - Email codes

### Account Security

- Regular security audits
- Login attempt monitoring
- IP address restrictions
- Session timeout settings

## Troubleshooting

### Common Issues

1. **Login Problems**
   - Check credentials
   - Verify account status
   - Clear browser cache
   - Check network connection

2. **Password Reset**
   - Use "Forgot Password"
   - Follow email instructions
   - Contact administrator if needed

3. **Account Lockout**
   - Wait for timeout
   - Contact administrator
   - Check login attempts

### Security Alerts

- Monitor security notifications
- Review login history
- Check account changes
- Report suspicious activity

## Next Steps

1. [Configure User Roles](./02_Roles.md)
2. [Set Up Permissions](./03_Permissions.md)
3. [Security Settings](./04_Security.md)
