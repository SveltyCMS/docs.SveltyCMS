---
title: "Database Initialization and Management"
description: "This document describes the initialization and management process for database connections in SveltyCMS."
---

# Database Initialization and Management

## Introduction
This document describes the initialization and management process for database connections in SveltyCMS, focusing on dynamic adapter loading and error handling.

## Loading Adapters
The system dynamically loads the appropriate database adapter based on the `DB_TYPE` specified in the environment variables.

### Supported Database Types
- MongoDB
- MariaDB

## Connection Retry Logic
Describes the retry logic and delay management for establishing database connections.

## Environment Configurations
Detail the necessary environment variables and their roles in the database setup.

## Error Handling
Explains the error handling strategy during the initialization phase.

## Google OAuth Setup
Optional setup instructions for Google OAuth2, if used.

## Usage
Provides code examples and scenarios where the database initialization is crucial within the application lifecycle.
