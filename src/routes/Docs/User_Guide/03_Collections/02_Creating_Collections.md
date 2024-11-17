---
title: "Creating Collections"
description: "Guide to creating and configuring collections in SvelteCMS"
icon: "mdi:database-plus"
published: true
order: 2
---

# Creating Collections

Learn how to create and configure collections in SvelteCMS.

## Getting Started

### Accessing the Collection Manager

1. Navigate to the Admin Dashboard
2. Click on "Collections" in the sidebar
3. Click the "Create Collection" button

### Basic Collection Setup

1. **Choose Collection Type**
   - Content Collection
   - Media Collection
   - System Collection

2. **Enter Basic Information**
   - Collection Name
   - Description
   - Icon (optional)
   - Category (optional)

## Configuring Fields

### Adding Fields

1. Click "Add Field" button
2. Choose field type:
   - Text
   - Rich Text
   - Number
   - Date
   - Media
   - Reference
   - Custom

### Field Configuration

For each field, configure:

- Field Label
- Field Name (system identifier)
- Description
- Default Value
- Required/Optional
- Validation Rules

### Field Types Guide

#### Text Fields
- Single line text
- Multi-line text
- Rich text editor
- Markdown editor
- HTML editor

#### Number Fields
- Integer
- Decimal
- Currency
- Percentage

#### Date Fields
- Date picker
- Time picker
- DateTime picker
- Date range

#### Media Fields
- Single image
- Image gallery
- File upload
- Video
- Audio

#### Reference Fields
- Single reference
- Multiple references
- Lookup fields

## Collection Settings

### General Settings

1. **URL Settings**
   - URL pattern
   - Slug configuration
   - Custom routing

2. **Versioning**
   - Enable/disable versioning
   - Set version limit
   - Auto-save options

3. **Workflow**
   - Draft state
   - Review process
   - Publication rules

### Access Control

1. **Permissions**
   - View permissions
   - Edit permissions
   - Delete permissions
   - Publish permissions

2. **User Roles**
   - Admin access
   - Editor access
   - Author access
   - Viewer access

### Display Settings

1. **List View**
   - Visible columns
   - Sort options
   - Filter options
   - Batch actions

2. **Detail View**
   - Layout template
   - Field grouping
   - Custom components
   - Preview options

## Using Templates

### Template Selection

1. Choose from available templates:
   - Blog Post
   - Product
   - News Article
   - Media Gallery
   - Custom Template

### Template Customization

1. Modify template fields
2. Adjust settings
3. Save as new template

## Advanced Configuration

### API Settings

1. **API Access**
   - Enable/disable API
   - Authentication
   - Rate limiting
   - CORS settings

### Webhooks

1. **Event Triggers**
   - Create events
   - Update events
   - Delete events
   - Publish events

### Validation Rules

1. **Field Validation**
   - Required fields
   - Format validation
   - Custom validation
   - Cross-field validation

### Indexing

1. **Search Configuration**
   - Searchable fields
   - Index settings
   - Search weights
   - Filter options

## Best Practices

### Naming Conventions
- Use clear, descriptive names
- Follow consistent patterns
- Consider future growth
- Document conventions

### Field Organization
- Group related fields
- Use logical ordering
- Include helpful descriptions
- Consider user experience

### Performance
- Limit number of fields
- Optimize media handling
- Use appropriate field types
- Configure indexing

## Next Steps

1. [Managing Content](./03_Managing_Content.md)
2. [Media Management](./04_Media_Management.md)
3. [Templates](./05_Templates.md)
4. [Advanced Features](./06_Advanced_Features.md)
