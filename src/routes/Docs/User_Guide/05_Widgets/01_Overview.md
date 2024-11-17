---
title: "Using Widgets"
description: "Guide to using widgets in SvelteCMS"
icon: "mdi:puzzle"
published: true
order: 1
---

# Using Widgets in SvelteCMS

Widgets are interactive form components that help you create and edit content in SvelteCMS. This guide will help you understand and use the available widgets effectively.

## Available Widgets

### Basic Input Widgets

1. **Text Input**
   - Purpose: Single-line text input
   - Use cases: Titles, names, short descriptions
   - Options:
     - Placeholder text
     - Maximum length
     - Pattern validation

2. **Number**
   - Purpose: Numeric input with validation
   - Features:
     - Min/max values
     - Step size
     - Format options
   - Example:
     ```json
     {
         "type": "number",
         "label": "Price",
         "min": 0,
         "max": 1000000,
         "step": 0.01,
         "prefix": "$"
     }
     ```

3. **Checkbox**
   - Purpose: Boolean values or multiple selections
   - Options:
     - Single checkbox
     - Checkbox group
     - Custom labels
   - Example:
     ```json
     {
         "type": "checkbox",
         "label": "Features",
         "options": [
             "WiFi",
             "Parking",
             "Pool"
         ]
     }
     ```

4. **DateTime**
   - Purpose: Date and time selection
   - Features:
     - Date picker
     - Time picker
     - Range selection
   - Example:
     ```json
     {
         "type": "datetime",
         "label": "Event Date",
         "format": "YYYY-MM-DD HH:mm",
         "min": "2024-01-01",
         "max": "2024-12-31"
     }
     ```

5. **DateRange**
   - Purpose: Select date periods
   - Features:
     - Start/end date selection
     - Preset ranges
     - Custom range validation
   - Example:
     ```json
     {
         "type": "daterange",
         "label": "Booking Period",
         "presets": [
             "This Week",
             "This Month",
             "Custom"
         ]
     }
     ```

6. **Rating**
   - Purpose: Numeric rating input
   - Features:
     - Custom scale (1-5, 1-10)
     - Custom icons
     - Half ratings
   - Example:
     ```json
     {
         "type": "rating",
         "label": "Product Rating",
         "max": 5,
         "allowHalf": true,
         "icon": "star"
     }
     ```

7. **ColorPicker**
   - Purpose: Color selection
   - Features:
     - RGB/HEX formats
     - Opacity support
     - Color presets
   - Example:
     ```json
     {
         "type": "colorpicker",
         "label": "Theme Color",
         "format": "hex",
         "presets": [
             "#FF0000",
             "#00FF00",
             "#0000FF"
         ]
     }
     ```

### Rich Content Widgets

1. **RichText Editor**
   - Purpose: Advanced text editing
   - Features:
     - Formatting tools
     - Image insertion
     - Tables
     - Links
   - Example:
     ```json
     {
         "type": "richtext",
         "label": "Article Content",
         "toolbar": [
             "bold",
             "italic",
             "link",
             "image"
         ]
     }
     ```

2. **RemoteVideo**
   - Purpose: Embed video content
   - Supported platforms:
     - YouTube
     - Vimeo
     - Custom URLs
   - Example:
     ```json
     {
         "type": "remotevideo",
         "label": "Tutorial Video",
         "platforms": [
             "youtube",
             "vimeo"
         ]
     }
     ```

3. **SEO**
   - Purpose: Search engine optimization
   - Features:
     - Meta title
     - Meta description
     - Keywords
     - Preview
   - Example:
     ```json
     {
         "type": "seo",
         "label": "SEO Settings",
         "features": [
             "title",
             "description",
             "keywords",
             "preview"
         ]
     }
     ```

## Widget Configuration

### Common Options

All widgets support these basic configuration options:

```json
{
    "type": "widget-type",
    "label": "Field Label",
    "description": "Help text for the field",
    "required": true,
    "disabled": false,
    "className": "custom-class",
    "defaultValue": "default"
}
```

### Validation

Widgets support various validation rules:

1. **Required Fields**
   ```json
   {
       "type": "text",
       "required": true,
       "validateMessage": "This field is required"
   }
   ```

2. **Pattern Matching**
   ```json
   {
       "type": "text",
       "pattern": "^[A-Za-z0-9]+$",
       "validateMessage": "Only alphanumeric characters allowed"
   }
   ```

3. **Custom Validation**
   ```json
   {
       "type": "number",
       "min": 0,
       "max": 100,
       "validateMessage": "Value must be between 0 and 100"
   }
   ```

## Best Practices

1. **Field Labels**
   - Use clear, descriptive labels
   - Include units where applicable
   - Provide helpful descriptions

2. **Validation**
   - Set appropriate validation rules
   - Provide clear error messages
   - Use appropriate widget types

3. **Default Values**
   - Set sensible defaults
   - Consider user experience
   - Document default behavior

4. **Accessibility**
   - Use proper labels
   - Provide keyboard navigation
   - Include help text

## Troubleshooting

Common issues and solutions:

1. **Widget Not Rendering**
   - Check widget type spelling
   - Verify configuration format
   - Check console for errors

2. **Validation Issues**
   - Verify validation rules
   - Check data types
   - Test edge cases

3. **Performance Problems**
   - Minimize complex widgets
   - Use lazy loading
   - Optimize configurations
