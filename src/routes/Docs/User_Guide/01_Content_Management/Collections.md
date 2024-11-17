---
title: "Content Collections"
description: "Learn how to organize and manage content collections in SveltyCMS"
icon: "mdi:database"
---

# Working with Collections

Collections are the heart of SveltyCMS, allowing you to organize and structure your content. This guide will help you master collection management.

## What is a Collection?

A collection is a container for similar content items. For example:
- Blog posts
- Products
- Team members
- News articles
- Events

Each collection has:
- Fields (content structure)
- Entries (actual content)
- Permissions (access control)
- Settings (behavior configuration)

## Creating Collections

### Step 1: Basic Information

1. Navigate to Collections → Create New
2. Fill in:
   - Name (e.g., "Blog Posts")
   - Handle (automatically generated, e.g., "blog_posts")
   - Description (optional but recommended)
   - Icon (optional, for easy identification)

### Step 2: Field Configuration

Add fields to structure your content:

1. **Common Fields**
   - Text (single line)
   - Rich Text (multi-line with formatting)
   - Number
   - Date/Time
   - Media (images, files)
   - Boolean (yes/no)
   - Select (dropdown)

2. **Advanced Fields**
   - Reference (link to other collections)
   - Array (list of items)
   - Object (grouped fields)
   - Map (location picker)
   - Code (syntax-highlighted code)
   - Color (color picker)

### Step 3: Field Settings

For each field, configure:
- Label
- Required/Optional
- Default value
- Validation rules
- Help text
- Translation settings

## Managing Entries

### Creating Entries

1. Navigate to your collection
2. Click "Create New Entry"
3. Fill in fields
4. Save or publish

### Bulk Operations

- Select multiple entries
- Actions available:
  - Delete
  - Publish/Unpublish
  - Export
  - Change language

### Filtering and Sorting

Use the toolbar to:
- Search entries
- Filter by field values
- Sort by any field
- Change view layout

## Collection Settings

### General Settings

- Slug pattern
- Default sort
- Entry preview
- API access
- Webhooks

### Access Control

Set permissions for:
- Viewing
- Creating
- Editing
- Deleting
- Publishing

### Translation Settings

Configure:
- Available languages
- Required languages
- Translation workflow
- Field translation options

## Best Practices

1. **Planning**
   - Plan your fields carefully
   - Consider future needs
   - Use meaningful field names

2. **Organization**
   - Group related fields
   - Use clear labels
   - Add helpful descriptions

3. **Validation**
   - Set appropriate field rules
   - Use required fields sparingly
   - Configure meaningful error messages

4. **Performance**
   - Limit reference field usage
   - Use appropriate field types
   - Configure image sizes

## Advanced Features

### Virtual Fields

Create fields that:
- Combine other fields
- Auto-calculate values
- Format data

### Hooks

Set up automatic actions:
- Before save
- After publish
- On delete
- Custom triggers

### API Access

Enable and configure:
- GraphQL endpoints
- REST API access
- Custom queries
- Access tokens

## Troubleshooting

Common issues and solutions:
1. **Can't delete collection**
   - Check for references
   - Remove dependencies
   - Clear cache

2. **Field not appearing**
   - Check permissions
   - Verify configuration
   - Clear browser cache

3. **Can't save entries**
   - Validate required fields
   - Check file sizes
   - Verify permissions

## Need Help?

- Check [Field Types Guide](Fields.md)
- Review [Access Control](../03_Administration/Roles.md)
- Visit our [GitHub repository](https://github.com/SveltyCMS/SveltyCMS)
