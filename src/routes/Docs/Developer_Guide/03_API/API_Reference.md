---
title: API Reference
description: Complete reference for the SveltyCSM API
type: dev
icon: mdi:api
---

# API Reference

Complete documentation of the SveltyCSM API endpoints and usage.

## Authentication

### POST /api/auth/login
Login endpoint for obtaining access token.

### POST /api/auth/refresh
Refresh expired access token.

## Collections

### GET /api/collections
List all collections.

### POST /api/collections
Create new collection.

### GET /api/collections/:id
Get collection by ID.

## Content

### GET /api/content/:collection
List content items in collection.

### POST /api/content/:collection
Create new content item.

### GET /api/content/:collection/:id
Get content item by ID.

## Media

### POST /api/media/upload
Upload media files.

### GET /api/media/list
List uploaded media.

## Error Handling

Standard error responses:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
