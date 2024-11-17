---
title: "Permission Management"
description: "Comprehensive management of permissions assignable to roles, including how permissions are defined, modified, and deleted."
---

# Permission Management

## Overview

Details the comprehensive management of permissions which are assignable to roles, outlining how permissions are defined, modified, and deleted within the system.

## Features

### Define Permissions

How permissions are structured and defined, focusing on the actions they control and the contexts in which they apply.

### Update Permissions

Procedures for modifying existing permissions to adapt to evolving system requirements or policy changes.

### Remove Permissions

Guidelines for safely removing permissions, ensuring no adverse effects on system functionality or security.

## Database Schema

### Permissions Table

| Column Name   | Data Type | Description                                 |
|---------------|-----------|---------------------------------------------|
| id            | INT       | Primary key, auto-increments                |
| name          | VARCHAR   | Name of the permission (e.g., 'create')     |
| description   | TEXT      | Description of what the permission allows   |
| context_id    | VARCHAR   | ID of the context (global, collection, etc.)|
| context_type  | VARCHAR   | Type of context (e.g., 'collection', 'widget') |

### Role_Permissions Table

| Column Name   | Data Type | Description                         |
|---------------|-----------|-------------------------------------|
| role_id       | INT       | Foreign key to Roles table          |
| permission_id | INT       | Foreign key to Permissions table    |

This junction table manages the many-to-many relationship between roles and permissions, enabling complex permission assignments across different roles.
