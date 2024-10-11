---
title: "Focal Point Tool"
description: "Comprehensive guide for using and developing the Focal Point Tool in SveltyCMS Image Editor"
---

# Focal Point Tool Documentation

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

The Focal Point Tool is a powerful feature in the SveltyCMS Image Editor that allows you to adjust the focus area of your image. This tool is particularly useful for creating depth-of-field effects, emphasizing specific parts of an image, or guiding the viewer's attention to key elements in your composition.

### How to Use

1. **Select the Focal Point Tool**: 
   - Click on the Focal Point Tool icon in the editor toolbar.

2. **Set the Focal Point**:
   - Click anywhere on the image to set the initial focal point.
   - Drag the focal point marker to fine-tune its position.

3. **Adjust the Effect**:
   - Use the slider to control the strength of the focal point effect (0% to 100%).
   - A higher percentage creates a more pronounced depth-of-field effect.

4. **Fine-tune Settings** (if available):
   - Adjust the size of the focal area using the "Radius" slider.
   - Modify the blur intensity for out-of-focus areas.

5. **Apply the Effect**:
   - Click "Apply" to confirm and render the focal point effect.
   - Or click "Reset" to remove the focal point and start over.

### Tips and Best Practices

- **Rule of Thirds**: Use the rule of thirds grid overlay to place your focal point at intersections for balanced compositions.
- **Subject Placement**: Set the focal point on the main subject or area of interest in your image.
- **Subtle Effects**: For natural-looking results, start with a low effect strength and gradually increase as needed.
- **Multiple Subjects**: If your image has multiple subjects, experiment with placing the focal point between them.
- **Combine with Other Tools**: Use the Focal Point Tool in conjunction with other editing tools for more complex effects.
- **Preview Modes**: If available, use different preview modes (e.g., split-screen, before/after) to assess the effect.

## Developer Guide

### Architecture Overview

The Focal Point Tool is implemented as a modular component within the SveltyCMS Image Editor. It utilizes Svelte for the UI and state management, and Konva.js for canvas manipulation and rendering of the focal point effect.

### Key Components

1. **FocalPoint.svelte**: The main component that handles the UI and logic for the Focal Point Tool.
2. **KonvaStage**: A wrapper component that integrates Konva.js with Svelte for image rendering.
3. **FocalPointMarker**: A custom component for the interactive focal point marker.

### Important Functions

```typescript
function updateFocalPoint(x: number, y: number): void {
  // Updates the position of the focal point
  focalPointPosition.set({ x, y });
  updateEffectPreview();
}

function applyFocalPoint(): void {
  // Applies the focal point effect to the image
  const imageData = getImageData();
  const effect = calculateFocalPointEffect(imageData, focalPointPosition.get(), effectStrength.get());
  applyEffectToImage(effect);
  updateCanvas();
}

function updateEffectPreview(): void {
  // Updates the real-time preview of the focal point effect
  const previewLayer = konvaStage.findOne('.previewLayer');
  previewLayer.clear();
  drawFocalPointEffect(previewLayer);
  previewLayer.batchDraw();
}
```

### Customization and Extension

To enhance the Focal Point Tool functionality:

1. Implement multiple focal points:
   ```typescript
   let focalPoints = writable([]);

   function addFocalPoint(x: number, y: number): void {
     focalPoints.update(points => [...points, { x, y, strength: 50 }]);
     updateEffectPreview();
   }

   function removeFocalPoint(index: number): void {
     focalPoints.update(points => points.filter((_, i) => i !== index));
     updateEffectPreview();
   }
   ```

2. Add shape options for the focal area:
   ```typescript
   enum FocalShape {
     Circle,
     Ellipse,
     CustomPath
   }

   function setFocalShape(shape: FocalShape): void {
     focalShape.set(shape);
     updateEffectPreview();
   }

   function drawFocalPointEffect(layer: Konva.Layer): void {
     const shape = focalShape.get();
     switch (shape) {
       case FocalShape.Circle:
         drawCircularFocalPoint(layer);
         break;
       case FocalShape.Ellipse:
         drawEllipticalFocalPoint(layer);
         break;
       case FocalShape.CustomPath:
         drawCustomPathFocalPoint(layer);
         break;
     }
   }
   ```

3. Create a gradient falloff for the focus effect:
   ```typescript
   function createGradientFalloff(context: CanvasRenderingContext2D, x: number, y: number, radius: number): void {
     const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
     gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
     gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
     context.fillStyle = gradient;
     context.fillRect(0, 0, context.canvas.width, context.canvas.height);
   }
   ```

## Troubleshooting

If you encounter issues with the Focal Point Tool, try the following:

- If the effect is not visible, check that the effect strength is set above 0%.
- If the focal point marker is not responding, ensure you're clicking directly on the marker to move it.
- If the effect looks unnatural, try reducing the effect strength or adjusting the radius of the focal area.
- If the tool is sluggish, consider reducing the image size or using a more powerful device.

## FAQ

**Q: Can I have multiple focal points in one image?**
A: The current implementation supports one focal point, but multiple focal points could be added as a future enhancement.

**Q: Does the Focal Point Tool actually change the focus of my camera shot?**
A: No, it simulates a depth-of-field effect. It cannot change the actual focus of the original photograph.

**Q: Can I adjust the shape of the focal area?**
A: Currently, the focal area is circular. Custom shapes could be implemented as a future feature.

**Q: Will applying a focal point effect reduce my image quality?**
A: The effect may slightly blur parts of the image, but it doesn't reduce the overall image resolution or quality.
