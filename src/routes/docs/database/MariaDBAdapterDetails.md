# MariaDB Adapter Details for SveltyCMS

## Overview
The `MariaDBAdapter` class implements the `DatabaseAdapter` interface specifically for interacting with a MariaDB database. This document provides a detailed overview of its functionalities, including connection management, model handling, and utility functions essential for the SveltyCMS.

## Table of Contents
1. [Connection Management](#connection-management)
   - [Connecting to MariaDB](#connecting-to-mariadb)
   - [Connection Pool Configuration](#connection-pool-configuration)
2. [Model Management](#model-management)
   - [Retrieving Collection Models](#retrieving-collection-models)
   - [Setting up Authentication Models](#setting-up-authentication-models)
   - [Setting up Media Models](#setting-up-media-models)
3. [Utility Functions](#utility-functions)
   - [Fetching Recent Collections](#fetching-recent-collections)
   - [Tracking Logged In Users](#tracking-logged-in-users)
   - [Fetching Recent Media](#fetching-recent-media)
4. [Example Usage](#example-usage)
5. [Conclusion](#conclusion)

## Connection Management

### Connecting to MariaDB
The `connect` method establishes a connection using a pool, which manages multiple database connections to improve performance and reliability.

```javascript
async connect(): Promise<void> {
    try {
        await this.pool.getConnection();
        console.log('Successfully connected to the MariaDB database');
    } catch (error) {
        console.error('Connection failed:', error.message);
        throw new Error('Failed to connect to MariaDB.');
    }
}
