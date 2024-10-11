---
title: "Watermark Tool"
description: "Comprehensive guide for using and developing the Watermark Tool in SveltyCMS Image Editor"
---

# Watermark Tool Documentation

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

The Watermark Tool is a versatile feature in the SveltyCMS Image Editor that allows you to add text or image watermarks to your images. This tool is essential for protecting your intellectual property, branding your images, or adding copyright information to your visual content.

### How to Use

1. **Select the Watermark Tool**: 
   - Click on the Watermark Tool icon in the editor toolbar.

2. **Choose Watermark Type**:
   - Select either "Text Watermark" or "Image Watermark" from the options.

3. **Configure Watermark**:
   For Text Watermark:
   - Enter your desired text in the input field.
   - Adjust font settings (style, size, color) using the provided controls.
   
   For Image Watermark:
   - Click "Upload Image" and select an image file to use as a watermark.
   - Supported formats: PNG, JPG, GIF (transparent PNG recommended).

4. **Adjust Watermark Properties**:
   - Use the position controls to place the watermark (e.g., corners, center).
   - Adjust the size slider to scale the watermark.
   - Set the opacity level (0% to 100%) for the desired visibility.

5. **Preview and Apply**:
   - Use the preview window to see how the watermark looks on your image.
   - Click "Apply" to add the watermark to your image.
   - Use "Reset" to remove the watermark and start over.

### Tips and Best Practices

- **Subtle Approach**: Use a semi-transparent watermark (30-50% opacity) for a professional look that doesn't overpower the image.
- **Strategic Placement**: Position the watermark in a corner or along an edge to minimize distraction from the main subject.
- **Consistency**: For branding, use the same watermark style and position across all your images.
- **Text Watermarks**: Choose a font that complements your image style. Sans-serif fonts often work well for modern or clean looks.
- **Image Watermarks**: Use a simple logo or icon with transparent background for best results.
- **Size Matters**: Ensure the watermark is large enough to be visible but not so large that it dominates the image.
- **Consider the Image**: Adjust watermark color and position based on the image content to ensure visibility.

## Developer Guide

### Architecture Overview

The Watermark Tool is implemented as a modular component within the SveltyCMS Image Editor. It utilizes Svelte for the UI and state management, and Konva.js for canvas manipulation and rendering of the watermark.

### Key Components

1. **Watermark.svelte**: The main component that handles the UI and logic for the Watermark Tool.
2. **KonvaStage**: A wrapper component that integrates Konva.js with Svelte for image rendering.
3. **TextWatermark**: A sub-component for handling text watermarks.
4. **ImageWatermark**: A sub-component for handling image watermarks.

### Important Functions

```typescript
function createWatermark(type: 'text' | 'image', options: WatermarkOptions): Konva.Node {
  // Creates the watermark based on user settings
  if (type === 'text') {
    return new Konva.Text({
      text: options.text,
      fontSize: options.fontSize,
      fontFamily: options.fontFamily,
      fill: options.color,
      opacity: options.opacity,
      x: options.x,
      y: options.y,
    });
  } else {
    return new Konva.Image({
      image: options.image,
      width: options.width,
      height: options.height,
      opacity: options.opacity,
      x: options.x,
      y: options.y,
    });
  }
}

function updateWatermark(watermark: Konva.Node, options: Partial<WatermarkOptions>): void {
  // Updates the watermark's appearance and position
  Object.entries(options).forEach(([key, value]) => {
    watermark[key](value);
  });
  watermark.getLayer().batchDraw();
}

function applyWatermark(): void {
  // Applies the watermark to the main image
  const mainLayer = konvaStage.findOne('.mainLayer');
  const watermarkLayer = konvaStage.findOne('.watermarkLayer');
  
  const dataURL = watermarkLayer.toDataURL();
  const mainImage = mainLayer.findOne('Image');
  
  // Merge watermark with main image
  const img = new Image();
  img.onload = () => {
    mainImage.image(img);
    mainLayer.batchDraw();
    watermarkLayer.destroy();
  };
  img.src = dataURL;
}
```

### Customization and Extension

To enhance the Watermark Tool functionality:

1. Add support for SVG watermarks:
   ```typescript
   import Konva from 'konva';

   function createSVGWatermark(svgString: string, options: WatermarkOptions): Promise<Konva.Image> {
     return new Promise((resolve) => {
       const img = new Image();
       img.onload = () => {
         resolve(new Konva.Image({
           image: img,
           width: options.width,
           height: options.height,
           opacity: options.opacity,
           x: options.x,
           y: options.y,
         }));
       };
       img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
     });
   }
   ```

2. Implement a tiling option for repeating watermarks:
   ```typescript
   function createTiledWatermark(watermark: Konva.Node, options: TilingOptions): Konva.Group {
     const { rows, columns, spacing } = options;
     const group = new Konva.Group();
     
     for (let i = 0; i < rows; i++) {
       for (let j = 0; j < columns; j++) {
         const clone = watermark.clone({
           x: j * (watermark.width() + spacing),
           y: i * (watermark.height() + spacing),
         });
         group.add(clone);
       }
     }
     
     return group;
   }
   ```

3. Create presets for common watermark styles and positions:
   ```typescript
   const watermarkPresets = {
     bottomRight: { x: 'right', y: 'bottom', opacity: 0.5 },
     topLeft: { x: 'left', y: 'top', opacity: 0.5 },
     center: { x: 'center', y: 'middle', opacity: 0.3 },
     subtle: { x: 'right', y: 'bottom', opacity: 0.2, fontSize: 14 },
     bold: { x: 'center', y: 'middle', opacity: 0.8, fontSize: 36 },
   };

   function applyWatermarkPreset(preset: keyof typeof watermarkPresets): void {
     const options = watermarkPresets[preset];
     updateWatermark(currentWatermark, options);
   }
   ```

## Troubleshooting

If you encounter issues with the Watermark Tool, try the following:

- If the watermark is not visible, check the opacity settings and ensure it's not set too low.
- For image watermarks, make sure the uploaded file is in a supported format (PNG, JPG, GIF).
- If text watermark appears blurry, try increasing the font size or adjusting the watermark position.
- If the watermark position is off, ensure the main image is fully loaded before applying the watermark.

## FAQ

**Q: Can I use my own custom font for text watermarks?**
A: Currently, the tool uses web-safe fonts. Custom font support may be added in future updates.

**Q: Is there a size limit for image watermarks?**
A: Yes, image watermarks should be under 1MB in size for optimal performance.

**Q: Can I add multiple watermarks to a single image?**
A: The current version supports one watermark at a time. Multiple watermarks could be a future feature.

**Q: Will the watermark be visible if someone screenshots my image?**
A: Yes, the watermark becomes a part of the image and will be visible in screenshots or copies.
