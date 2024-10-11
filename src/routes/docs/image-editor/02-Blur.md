---
title: "Blur Tool"
description: "Comprehensive guide for using and developing the Blur Tool in SveltyCMS Image Editor"
---

# Blur Tool Documentation

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

The Blur Tool is a powerful feature in the SveltyCMS Image Editor that allows you to add selective blur effects to your images. This tool is perfect for creating depth of field effects, highlighting specific areas, or adding a creative touch to your photos.

### How to Use

1. **Select the Blur Tool**: 
   - Click on the Blur Tool icon in the editor toolbar.

2. **Choose Blur Shape**:
   - Select from three shape options:
     - Circle: For round blur areas
     - Rectangle: For square or rectangular blur areas
     - Custom: For freeform blur shapes

3. **Adjust Blur Settings**:
   - Use the slider to set the blur amount (1-20)
   - Optionally, adjust the blur radius for more precise control

4. **Apply Blur Effect**:
   - For Circle and Rectangle:
     - Click and drag on the image to create the blur area
     - Release to apply the effect
   - For Custom shape:
     - Click to create anchor points
     - Double-click to close the shape and apply the effect

5. **Fine-tune and Confirm**:
   - Use the handles to resize or reshape the blur area
   - Click "Apply" to confirm the changes, or "Cancel" to discard

### Tips and Best Practices

- **Focal Point Effect**: Use a circular blur around the edges to draw attention to a central subject.
- **Tilt-Shift Effect**: Apply a horizontal rectangle blur to simulate a tilt-shift photography effect.
- **Selective Focus**: Use the custom shape to blur out distracting elements in your image.
- **Layered Blur**: Apply multiple blur areas with different intensities for a more complex effect.
- **Feathering**: Adjust the feather amount to create softer blur edges for a more natural look.
- **Preserve Details**: Use a lower blur amount to maintain some detail in less important areas.
- **Combine with Other Tools**: Use the blur tool in combination with other editing tools for more advanced effects.

## Developer Guide

### Architecture Overview

The Blur Tool is implemented as a modular component within the SveltyCMS Image Editor. It utilizes Svelte for the UI and state management, and Konva.js for canvas manipulation and rendering of the blur effect.

### Key Components

1. **Blur.svelte**: The main component that handles the UI and logic for the Blur Tool.
2. **KonvaStage**: A wrapper component that integrates Konva.js with Svelte for image rendering.
3. **BlurShapeFactory**: A utility class that creates different blur shapes based on user selection.

### Important Functions

```typescript
function applyBlur(imageData: ImageData, blurSettings: BlurSettings): ImageData {
  // Applies the blur effect to the selected area of the image
  const { amount, shape, area } = blurSettings;
  const blurredData = new ImageData(imageData.width, imageData.height);

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      if (isPointInShape(x, y, shape, area)) {
        applyBlurToPixel(imageData, blurredData, x, y, amount);
      } else {
        copyPixel(imageData, blurredData, x, y);
      }
    }
  }

  return blurredData;
}

function updateBlurPreview(shape: Konva.Shape, blurAmount: number): void {
  // Updates the real-time preview of the blur effect
  const blurFilter = new Konva.Blur({
    blurRadius: blurAmount,
  });
  shape.filters([blurFilter]);
  shape.cache();
  shape.getLayer().batchDraw();
}

function createBlurShape(type: ShapeType, points: number[]): Konva.Shape {
  // Creates a Konva shape based on the selected blur shape type
  switch (type) {
    case ShapeType.Circle:
      return new Konva.Circle({ radius: points[2], x: points[0], y: points[1] });
    case ShapeType.Rectangle:
      return new Konva.Rect({ width: points[2], height: points[3], x: points[0], y: points[1] });
    case ShapeType.Custom:
      return new Konva.Line({ points: points, closed: true });
    default:
      throw new Error('Unsupported shape type');
  }
}
```

### Customization and Extension

To add new blur shapes or effects:

1. Extend the `ShapeType` enum in `types.ts`:
   ```typescript
   export enum ShapeType {
     Circle,
     Rectangle,
     Custom,
     Ellipse // New shape type
   }
   ```

2. Implement new shape drawing logic in `BlurShapeFactory`:
   ```typescript
   class BlurShapeFactory {
     // ...existing code...

     static createEllipse(points: number[]): Konva.Ellipse {
       return new Konva.Ellipse({
         radiusX: points[2],
         radiusY: points[3],
         x: points[0],
         y: points[1]
       });
     }
   }
   ```

3. Update the `createBlurShape` function to handle the new shape:
   ```typescript
   function createBlurShape(type: ShapeType, points: number[]): Konva.Shape {
     switch (type) {
       // ...existing cases...
       case ShapeType.Ellipse:
         return BlurShapeFactory.createEllipse(points);
     }
   }
   ```

4. Add UI controls for the new shape in `Blur.svelte`:
   ```svelte
   <select bind:value={selectedShape}>
     <option value={ShapeType.Circle}>Circle</option>
     <option value={ShapeType.Rectangle}>Rectangle</option>
     <option value={ShapeType.Custom}>Custom</option>
     <option value={ShapeType.Ellipse}>Ellipse</option>
   </select>
   ```

5. Implement any necessary changes in the `applyBlur` function to handle the new shape or effect.

## Troubleshooting

If you encounter issues with the Blur Tool, try the following:

- If the blur effect is not visible, check that the blur amount is set high enough.
- For custom shapes, ensure you've closed the shape by double-clicking or connecting the last point to the first.
- If the blur preview is laggy, try reducing the blur amount or the size of the blur area.
- If changes are not applying, check that you've clicked the "Apply" button to confirm the blur effect.

## FAQ

**Q: Can I apply multiple blur effects to the same image?**
A: Yes, you can apply multiple blur effects by creating separate blur areas and applying them individually.

**Q: Is there a limit to the blur amount?**
A: The current maximum blur amount is 20, but this can be adjusted in the settings if needed.

**Q: Can I undo a blur effect after applying it?**
A: Yes, you can use the editor's undo function to revert the last applied blur effect.

**Q: Does the blur tool work with all image formats?**
A: The blur tool works with all image formats supported by the SveltyCMS Image Editor, including JPEG, PNG, and GIF.

