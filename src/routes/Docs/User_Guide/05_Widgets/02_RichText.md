---
title: "Using the RichText Editor"
description: "Guide to using the RichText editor widget"
icon: "mdi:text"
published: true
order: 2
---

# RichText Editor

The RichText editor provides a powerful way to create and edit formatted content in SvelteCMS. This guide will help you understand and use all its features effectively.

## Features

### Text Formatting

1. **Basic Formatting**
   - Bold (`Ctrl/Cmd + B`)
   - Italic (`Ctrl/Cmd + I`)
   - Underline (`Ctrl/Cmd + U`)
   - Strikethrough
   - Superscript
   - Subscript

2. **Paragraph Styles**
   - Headings (H1-H6)
   - Paragraph
   - Blockquote
   - Code block
   - Lists (ordered and unordered)

3. **Text Alignment**
   - Left
   - Center
   - Right
   - Justify

### Media Integration

1. **Images**
   - Upload from computer
   - Insert from URL
   - Resize and align
   - Add captions
   - Alt text for accessibility

2. **Videos**
   - Embed YouTube videos
   - Embed Vimeo videos
   - Custom video URLs
   - Responsive sizing

### Advanced Features

1. **Tables**
   - Insert and delete tables
   - Add/remove rows and columns
   - Merge cells
   - Cell formatting

2. **Links**
   - Insert URLs
   - Edit link text
   - Open in new tab option
   - Remove links

3. **Code**
   - Inline code
   - Code blocks with syntax highlighting
   - Language selection

## Configuration

### Basic Setup

```json
{
    "type": "richtext",
    "label": "Content",
    "toolbar": [
        "bold",
        "italic",
        "link",
        "bulletList",
        "orderedList"
    ],
    "placeholder": "Start writing your content..."
}
```

### Full Configuration

```json
{
    "type": "richtext",
    "label": "Article Content",
    "description": "Write your article content here",
    "required": true,
    "toolbar": [
        "heading",
        "bold",
        "italic",
        "underline",
        "strike",
        "link",
        "bulletList",
        "orderedList",
        "blockquote",
        "codeBlock",
        "image",
        "video",
        "table"
    ],
    "imageUpload": {
        "maxSize": 5242880, // 5MB
        "allowedTypes": [
            "image/jpeg",
            "image/png",
            "image/gif"
        ]
    },
    "maxLength": 50000,
    "height": "500px"
}
```

## Usage Tips

### Working with Images

1. **Uploading Images**
   - Click the image button in the toolbar
   - Select "Upload" and choose your file
   - Maximum file size: 5MB
   - Supported formats: JPG, PNG, GIF

2. **Image Formatting**
   - Click an image to show the formatting toolbar
   - Resize using the handles
   - Add caption below the image
   - Set alignment (left, center, right)

### Working with Tables

1. **Creating Tables**
   ```
   1. Click the table button
   2. Select number of rows and columns
   3. Click to insert
   ```

2. **Table Operations**
   - Right-click for context menu
   - Add/delete rows and columns
   - Merge/split cells
   - Set cell background color

### Working with Code

1. **Code Blocks**
   - Use the code block button
   - Select language for syntax highlighting
   - Use monospace font for better readability

2. **Inline Code**
   - Select text
   - Click the inline code button
   - Useful for technical terms

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Bold | Ctrl + B | ⌘ + B |
| Italic | Ctrl + I | ⌘ + I |
| Underline | Ctrl + U | ⌘ + U |
| Link | Ctrl + K | ⌘ + K |
| Save | Ctrl + S | ⌘ + S |
| Undo | Ctrl + Z | ⌘ + Z |
| Redo | Ctrl + Shift + Z | ⌘ + Shift + Z |

## Best Practices

1. **Content Organization**
   - Use headings for structure
   - Keep paragraphs concise
   - Use lists for better readability
   - Include relevant images

2. **Formatting**
   - Be consistent with styles
   - Don't overuse formatting
   - Use appropriate heading levels
   - Maintain clean markup

3. **Images**
   - Optimize images before upload
   - Add descriptive alt text
   - Use appropriate image sizes
   - Consider mobile viewers

4. **Tables**
   - Use for tabular data only
   - Keep tables simple
   - Include header rows
   - Consider mobile responsiveness

## Troubleshooting

### Common Issues

1. **Image Upload Fails**
   - Check file size (max 5MB)
   - Verify file format
   - Ensure good internet connection
   - Try compressing the image

2. **Editor Not Loading**
   - Clear browser cache
   - Check console for errors
   - Verify configuration
   - Reload the page

3. **Content Not Saving**
   - Check auto-save status
   - Manual save with Ctrl/Cmd + S
   - Check for validation errors
   - Verify connection status

### Error Messages

| Error | Solution |
|-------|----------|
| "File too large" | Reduce file size below 5MB |
| "Invalid format" | Use supported file types |
| "Content too long" | Reduce content length |
| "Network error" | Check internet connection |

## Examples

### Article Layout

```html
<h1>Article Title</h1>
<p class="lead">Introduction paragraph...</p>

<h2>First Section</h2>
<p>Section content...</p>

<figure>
    <img src="image.jpg" alt="Description">
    <figcaption>Image caption</figcaption>
</figure>

<h2>Second Section</h2>
<ul>
    <li>Point one</li>
    <li>Point two</li>
</ul>
```

### Product Description

```html
<h2>Product Features</h2>
<ul>
    <li><strong>Feature 1:</strong> Description</li>
    <li><strong>Feature 2:</strong> Description</li>
</ul>

<table>
    <tr>
        <th>Specification</th>
        <th>Value</th>
    </tr>
    <tr>
        <td>Size</td>
        <td>10x20x30 cm</td>
    </tr>
</table>
```
