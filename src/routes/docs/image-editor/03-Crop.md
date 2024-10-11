---
title: "Crop Tool"
description: "Comprehensive guide for using and developing the Crop Tool in SveltyCMS Image Editor"
---

# Crop Tool Documentation

## Table of Contents

1. [User Guide](#user-guide)
   - [Introduction](#introduction)
   - [How to Use](#how-to-use)
   - [Tips and Best Practices](#tips-and-best-practices)
2. [Developer Guide](#developer-guide)
   - [Architecture Overview](#architecture-overview)
   - [Key Components](#key-components)
   - [Important Functions](#important-functions)
   - [Customization and Extension](#customization-and-extension)
3. [Troubleshooting](#troubleshooting)
4. [FAQ](#faq)

## User Guide

### Introduction

The Crop Tool is an essential feature in the SveltyCMS Image Editor that allows you to adjust the size, shape, and composition of your images. Whether you need to resize an image for specific dimensions, create a perfect square for social media, or focus on a particular part of an image, the Crop Tool provides flexible options to meet your needs.

### How to Use

1. **Select the Crop Tool**: 
   - Click on the Crop Tool icon in the editor toolbar.

2. **Choose Crop Shape**:
   - Select from three shape options:
     - Rectangle: For standard cropping
     - Square: For perfect 1:1 ratio crops
     - Circular: For round profile pictures or circular frames

3. **Set Aspect Ratio** (Optional):
   - Choose from preset aspect ratios (e.g., 16:9, 4:3, 3:2)
   - Or select "Free" to crop without constraints

4. **Define Crop Area**:
   - Click and drag on the image to create the initial crop area
   - Use the handles on the corners and edges to refine the crop size and position

5. **Fine-tune and Apply**:
   - Adjust the crop area as needed
   - Click "Apply" to crop the image, or "Cancel" to reset

### Tips and Best Practices

- **Rule of Thirds**: Use the grid overlay to align key elements along the grid lines for better composition.
- **Maintain Aspect Ratio**: Hold the Shift key while dragging to maintain the current aspect ratio.
- **Quick Apply**: Double-click inside the crop area to quickly apply the crop.
- **Rotate Before Cropping**: If needed, use the Rotate Tool before cropping to straighten your image.
- **Undo/Redo**: Use the undo and redo buttons if you need to revert or reapply a crop.

## Developer Guide

### Architecture Overview

The Crop Tool is implemented as a modular component within the SveltyCMS Image Editor. It uses Svelte for the UI and state management, and Konva.js for canvas manipulation and rendering of the crop overlay.

### Key Components

1. **Crop.svelte**: The main component that handles the UI and logic for the Crop Tool.
2. **KonvaStage**: A wrapper component that integrates Konva.js with Svelte for image rendering.
3. **CropShape**: An abstract class extended by specific shape implementations (Rectangle, Square, Circle).

### Important Functions

```typescript
function initCropTool(shape: CropShape, aspectRatio: AspectRatio): void {
  // Initializes the crop tool with the selected shape and aspect ratio
  // Implementation details...
}

function applyCrop(image: HTMLImageElement, cropData: CropData): HTMLImageElement {
  // Applies the crop to the image and returns the cropped result
  // Implementation details...
}

function updateCropPreview(shape: Konva.Shape, cropData: CropData): void {
  // Updates the real-time preview of the crop area
  // Implementation details...
}
```

### Customization and Extension

To add new crop shapes or aspect ratios:

1. Extend the `CropShape` enum in `types.ts`:
   ```typescript
   export enum CropShape {
     Rectangle,
     Square,
     Circle,
     NewShape // Add your new shape type here
   }
   ```

2. Create a new class that extends `CropShape`:
   ```typescript
   class NewShapeCrop extends CropShape {
     draw(konvaStage: Konva.Stage, cropData: CropData): Konva.Shape {
       // Implement the logic for drawing your new shape
     }
   }
   ```

3. Update the `initCropTool` function to handle the new shape:
   ```typescript
   function initCropTool(shape: CropShape, aspectRatio: AspectRatio): void {
     switch (shape) {
       // ...existing cases...
       case CropShape.NewShape:
         this.cropShape = new NewShapeCrop();
         break;
     }
     // Rest of the initialization logic...
   }
   ```

4. Add UI controls for the new shape in `Crop.svelte`:
   ```svelte
   <select bind:value={selectedShape}>
     <option value={CropShape.Rectangle}>Rectangle</option>
     <option value={CropShape.Square}>Square</option>
     <option value={CropShape.Circle}>Circle</option>
     <option value={CropShape.NewShape}>New Shape</option>
   </select>
   ```

5. Implement any necessary changes in the `applyCrop` function to handle the new shape.

## Troubleshooting

If you encounter issues with the Crop Tool, try the following:

- Ensure your image is fully loaded before attempting to crop.
- If the crop preview is not updating, try resizing the browser window to trigger a re-render.
- For circular crops, make sure your image dimensions are suitable for creating a perfect circle.
- If you can't apply the crop, check that the crop area is within the image boundaries.

## FAQ

**Q: Can I crop an image to exact pixel dimensions?**
A: Yes, you can enter specific pixel dimensions in the width and height inputs when using the rectangular crop.

**Q: Is it possible to crop multiple areas of an image at once?**
A: Currently, the Crop Tool only supports cropping one area at a time. For multiple crops, you'll need to apply each crop separately.

**Q: Does cropping reduce the image quality?**
A: Cropping itself doesn't reduce image quality, but it does reduce the total number of pixels in your image.

**Q: Can I undo a crop after applying it?**
A: Yes, you can use the editor's undo function to revert the last applied crop. However, it's always a good idea to save a copy of your original image.
