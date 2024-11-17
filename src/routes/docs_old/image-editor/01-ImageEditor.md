---
title: "Image Editor"
description: "SveltyCMS Image Editor Documentation"
icon: "mdi:image"
---

# Image Editor Documentation for SveltyCMS

## Table of Contents

1. [User Guide](#user-guide)
   - [Introduction](#introduction)
   - [Getting Started](#getting-started)
   - [Available Tools](#available-tools)
   - [Tips and Tricks](#tips-and-tricks)
2. [Developer Guide](#developer-guide)
   - [Architecture Overview](#architecture-overview)
   - [Main Components](#main-components)
   - [Key Functions](#key-functions)
   - [Extending the Editor](#extending-the-editor)
3. [Troubleshooting](#troubleshooting)
4. [FAQ](#faq)

## User Guide

### Introduction

The Image Editor is a powerful tool integrated into SveltyCMS that allows you to modify and enhance your images with ease. Whether you need to crop, rotate, apply filters, or add text overlays, our Image Editor has you covered.

Key features include:
- Intuitive interface for uploading and editing images
- Wide range of effects and adjustments
- Real-time preview of changes
- Easy saving and exporting of edited images

### Getting Started

1. **Accessing the Editor**: Navigate to the Image Editor section in your SveltyCMS dashboard.
2. **Uploading an Image**: Click the "Upload" button and select an image from your device.
3. **Editing**: Use the toolbar to select different editing tools and apply changes.
4. **Previewing**: All changes are displayed in real-time in the preview area.
5. **Saving**: Once satisfied, click the "Save" button to export your edited image.

### Available Tools

Our Image Editor offers a comprehensive set of tools to meet your image editing needs:

| Tool | Description |
|------|-------------|
| Crop | Adjust the size and shape of your image |
| Rotate | Change the orientation of your image |
| Blur | Add selective blur effects to parts of your image |
| Filters | Apply various color and style filters |
| Text | Add customizable text overlays |
| Shapes | Insert and manipulate shape overlays |
| Zoom | Magnify specific areas of your image |
| Focal Point | Adjust the focus area of your image |
| Watermark | Add a customizable watermark to protect your image |

### Tips and Tricks

- Use the undo/redo functions to easily revert or reapply changes.
- Combine multiple tools for more complex edits (e.g., crop, then apply a filter).
- Experiment with different filter combinations to achieve unique effects.
- Save your work frequently, especially when making significant changes.

## Developer Guide

### Architecture Overview

The Image Editor is built using Svelte for the frontend framework and Konva.js for canvas manipulation. It employs a modular architecture to ensure easy maintenance and extensibility.

### Main Components

1. **ImageEditor.svelte**: The main component that orchestrates all editing functions.
2. **imageEditorStore.ts**: Manages the state of the editor, including undo/redo functionality.
3. **ToolbarComponent.svelte**: Renders the editing toolbar and handles tool selection.
4. **PreviewComponent.svelte**: Displays the real-time preview of the edited image.

### Key Functions

```typescript
function loadImageAndSetupKonva(imageSrc: string) {
  // Loads the image and sets up the Konva stage
  // Implementation details...
}

function applyEdit(editType: string, params: object) {
  // Applies the current edit and saves state for undo/redo
  // Implementation details...
}

function handleSave() {
  // Saves the edited image
  // Implementation details...
}
```

### Extending the Editor

To add a new tool to the Image Editor:

1. Create a new Svelte component for the tool (e.g., `NewTool.svelte`).
2. Add the tool to the toolbar in `ImageEditor.svelte`:

   ```svelte
   <ToolbarComponent tools={[...existingTools, newTool]} />
   ```

3. Implement the tool's logic using Konva.js in your new component.
4. Update `imageEditorStore.ts` if new state management is required:

   ```typescript
   export const newToolState = writable(initialState);
   ```

5. Add any necessary UI controls and event handlers in your new component.

## Troubleshooting

If you encounter issues while using the Image Editor, try the following:

- Clear your browser cache and reload the page.
- Ensure your image is in a supported format (JPEG, PNG, GIF).
- Check your internet connection if changes are not being saved.
- If a specific tool is not working, try refreshing the page and reapplying the edit.

For persistent issues, please contact our support team with details about the problem and steps to reproduce it.

## FAQ

**Q: What image formats are supported?**
A: The Image Editor supports JPEG, PNG, and GIF formats.

**Q: Is there a size limit for uploaded images?**
A: Yes, the maximum file size is 10MB.

**Q: Can I use the Image Editor on mobile devices?**
A: Yes, the editor is fully responsive and works on both desktop and mobile devices.

**Q: How do I report a bug or request a new feature?**
A: Please use our GitHub issue tracker or contact our support team directly.

---

For more information or detailed tutorials, please visit our comprehensive [SveltyCMS Documentation](https://docs.sveltycms.dev).