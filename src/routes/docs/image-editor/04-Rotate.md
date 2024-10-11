---
title: "Rotate Tool"
description: "Comprehensive guide for using and developing the Rotate Tool in SveltyCMS Image Editor"
---

# Rotate Tool Documentation

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

The Rotate Tool is a versatile feature in the SveltyCMS Image Editor that allows you to adjust the orientation of your images. Whether you need to correct a tilted horizon, create a dynamic composition, or simply change the perspective of your image, the Rotate Tool provides precise control over image rotation.

### How to Use

1. **Select the Rotate Tool**: 
   - Click on the Rotate Tool icon in the editor toolbar.

2. **Adjust Rotation**:
   - Use the slider to fine-tune the rotation angle (0° to 360°).
   - Click the quick rotate buttons for instant 90° clockwise or counterclockwise rotations.
   - Drag the circular handle around the image for free-form rotation.

3. **Use Rotation Presets** (Optional):
   - Click preset buttons for common rotation angles (e.g., 45°, 180°).

4. **Align with Grid** (Optional):
   - Toggle the grid overlay to help align your image with straight lines or horizons.

5. **Apply Rotation**:
   - Click "Apply" to confirm the rotation.
   - Or click "Reset" to return the image to its original orientation.

### Tips and Best Practices

- **Precision Rotation**: Hold the Shift key while using the circular handle to snap rotations to 15° increments.
- **Keyboard Shortcuts**: 
  - Use arrow keys for 1° adjustments.
  - Press 'R' to reset the rotation to 0°.
- **Cropping After Rotation**: Consider using the Crop Tool after rotating to remove any blank areas created by the rotation.
- **Straighten Horizon**: Use the grid overlay to align a horizon or vertical lines in your image.
- **Preserve Original**: Always work on a copy of your original image when making significant rotations.

## Developer Guide

### Architecture Overview

The Rotate Tool is implemented as a modular component within the SveltyCMS Image Editor. It utilizes Svelte for the UI and state management, and Konva.js for canvas manipulation and rendering of the rotated image.

### Key Components

1. **Rotate.svelte**: The main component that handles the UI and logic for the Rotate Tool.
2. **KonvaStage**: A wrapper component that integrates Konva.js with Svelte for image rendering.
3. **RotationHandle**: A custom component for the interactive rotation handle.

### Important Functions

```typescript
function rotateImage(angle: number): void {
  // Rotates the image to the specified angle
  // Implementation details...
}

function updateRotationGuide(angle: number): void {
  // Updates the visual guide for rotation
  // Implementation details...
}

function applyRotation(imageData: ImageData, angle: number): ImageData {
  // Applies the rotation to the image data and returns the rotated result
  // Implementation details...
}
```

### Customization and Extension

To enhance the Rotate Tool:

1. Add new preset rotation angles:
   ```svelte
   <button on:click={() => rotateImage(30)}>30°</button>
   <button on:click={() => rotateImage(60)}>60°</button>
   ```

2. Implement a "straighten" feature:
   ```typescript
   async function straightenImage() {
     const lines = await detectLines(imageData);
     const angle = calculateStraighteningAngle(lines);
     rotateImage(angle);
   }
   ```

3. Add keyboard shortcuts:
   ```typescript
   function setupEventListeners() {
     document.addEventListener('keydown', (e) => {
       switch(e.key) {
         case 'ArrowLeft':
           rotateImage(currentAngle - 1);
           break;
         case 'ArrowRight':
           rotateImage(currentAngle + 1);
           break;
         case 'R':
         case 'r':
           resetRotation();
           break;
       }
     });
   }
   ```

4. Implement zoom functionality during rotation:
   ```typescript
   function zoomDuringRotation(scale: number) {
     konvaStage.scale({ x: scale, y: scale });
     konvaStage.batchDraw();
   }
   ```

## Troubleshooting

If you encounter issues with the Rotate Tool, try the following:

- If rotation is sluggish, try reducing the image size or using a more powerful device.
- If the rotated image appears blurry, ensure you're working with a high-resolution original.
- If rotation snapping isn't working, check that you're holding the Shift key while rotating.
- If the rotation guide is not visible, ensure your browser supports canvas rendering.

## FAQ

**Q: Does rotating an image affect its quality?**
A: Minimal rotation (e.g., 90° increments) doesn't affect quality. However, arbitrary angles may cause some pixel interpolation, which can slightly reduce sharpness.

**Q: Can I rotate an image to any angle?**
A: Yes, you can rotate an image to any angle between 0° and 360°.

**Q: Will rotating create transparent areas in my image?**
A: For non-90° rotations, yes. You can use the Crop Tool afterwards to remove these areas if desired.

**Q: Is there a way to automatically straighten my image?**
A: While not currently implemented, an auto-straighten feature based on horizon detection is a possible future enhancement.
