---
title: "Filter Tool "
description: "Comprehensive guide for using and developing the Filter Tool in SveltyCMS Image Editor"
---

# Filter Tool Documentation

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

The Filter Tool is a powerful feature in the SveltyCMS Image Editor that allows you to apply various color and style filters to your images. Whether you want to enhance the mood, correct color balance, or create artistic effects, the Filter Tool provides a wide range of options to transform your images.

### How to Use

1. **Select the Filter Tool**: 
   - Click on the Filter Tool icon in the editor toolbar.

2. **Choose a Filter**:
   - Browse through the preset filters gallery.
   - Click on a filter thumbnail to see a preview on your image.

3. **Adjust Filter Settings**:
   - Use sliders to fine-tune individual parameters:
     - Brightness (0-200%)
     - Contrast (0-200%)
     - Saturation (-100 to +100)
     - Hue (-180° to +180°)
     - Sharpness (0-100)
   - Toggle special effects:
     - Sepia
     - Grayscale
     - Invert Colors

4. **Custom Adjustments**:
   - Use the "Advanced" tab for more precise control:
     - RGB Channel adjustments
     - Gamma correction
     - Vignette effect

5. **Preview and Apply**:
   - Use the real-time preview to see changes.
   - Click "Apply" to confirm the filter settings.
   - Use "Reset" to revert all changes.

### Tips and Best Practices

- **Start Subtle**: Begin with mild adjustments and gradually increase intensity for natural-looking results.
- **Combine Filters**: Layer multiple adjustments to create unique effects (e.g., increase contrast after applying sepia).
- **Save Custom Presets**: Create and save your favorite filter combinations for quick access in future edits.
- **Consider the Image**: Different filters work better for different types of images (e.g., landscapes vs. portraits).
- **Use Split View**: If available, use the split-view mode to compare filtered and original versions side-by-side.
- **Preserve Originals**: Always work on a copy of your original image when applying strong filters.
- **Color Theory**: Understand basic color theory to make informed decisions about hue and saturation adjustments.

## Developer Guide

### Architecture Overview

The Filter Tool is implemented as a modular component within the SveltyCMS Image Editor. It utilizes Svelte for the UI and state management, and Konva.js for canvas manipulation and rendering of the filtered image.

### Key Components

1. **Filter.svelte**: The main component that handles the UI and logic for the Filter Tool.
2. **KonvaStage**: A wrapper component that integrates Konva.js with Svelte for image rendering.
3. **FilterPresets**: A module containing predefined filter combinations.
4. **FilterSlider**: A reusable component for adjusting individual filter parameters.

### Important Functions

```typescript
function updatePreview(filterSettings: FilterSettings): void {
  // Updates the real-time preview of filter effects
  const image = konvaStage.findOne('Image');
  Object.entries(filterSettings).forEach(([filter, value]) => {
    image.filters([Konva.Filters[filter]]);
    image[filter](value);
  });
  image.getLayer().batchDraw();
}

function applyFilters(filterSettings: FilterSettings): void {
  // Applies the selected filters to the image
  const imageData = getImageData();
  const filteredData = applyFiltersToImageData(imageData, filterSettings);
  updateImageOnCanvas(filteredData);
  saveToHistory(filterSettings);
}

function createCustomFilter(name: string, settings: FilterSettings): void {
  // Creates a new custom filter preset
  customPresets.update(presets => [...presets, { name, settings }]);
  saveCustomPresets();
}
```

### Customization and Extension

To enhance the Filter Tool functionality:

1. Implement advanced filters like curves adjustment:
   ```typescript
   function applyCurvesAdjustment(imageData: ImageData, curves: number[]): ImageData {
     const newData = new Uint8ClampedArray(imageData.data.length);
     for (let i = 0; i < imageData.data.length; i += 4) {
       newData[i] = curves[imageData.data[i]];     // Red
       newData[i+1] = curves[imageData.data[i+1]]; // Green
       newData[i+2] = curves[imageData.data[i+2]]; // Blue
       newData[i+3] = imageData.data[i+3];         // Alpha
     }
     return new ImageData(newData, imageData.width, imageData.height);
   }
   ```

2. Add a masking feature to apply filters to specific areas:
   ```typescript
   function createFilterMask(width: number, height: number): Konva.Layer {
     const maskLayer = new Konva.Layer();
     const mask = new Konva.Rect({
       x: 0,
       y: 0,
       width: width,
       height: height,
       fill: 'black',
     });
     maskLayer.add(mask);
     return maskLayer;
   }

   function applyFilterWithMask(filter: Konva.Filter, maskLayer: Konva.Layer): void {
     const image = konvaStage.findOne('Image');
     image.filters([filter]);
     image.cache();
     image.globalCompositeOperation('source-in');
     image.draw();
   }
   ```

3. Implement a split-view preview:
   ```svelte
   <script>
   import { onMount } from 'svelte';
   import Konva from 'konva';

   let splitView;
   let splitPosition = 50;

   onMount(() => {
     splitView = new Konva.Line({
       points: [stage.width() / 2, 0, stage.width() / 2, stage.height()],
       stroke: 'white',
       strokeWidth: 2,
       draggable: true,
       dragBoundFunc: function(pos) {
         return {
           x: Math.max(0, Math.min(pos.x, stage.width())),
           y: this.getAbsolutePosition().y,
         };
       },
     });
     splitView.on('dragmove', updateSplitView);
     layer.add(splitView);
   });

   function updateSplitView() {
     splitPosition = (splitView.x() / stage.width()) * 100;
     // Update clipping and redraw
   }
   </script>

   <div class="split-view-container">
     <div class="original" style="clip-path: inset(0 {100 - splitPosition}% 0 0);">
       <!-- Original image -->
     </div>
     <div class="filtered" style="clip-path: inset(0 0 0 {splitPosition}%);">
       <!-- Filtered image -->
     </div>
   </div>
   ```

## Troubleshooting

If you encounter issues with the Filter Tool, try the following:

- If filters are not applying, ensure the image is fully loaded and you've clicked the "Apply" button.
- For slow performance, try applying filters to a smaller version of the image first.
- If custom presets are not saving, check your browser's local storage settings.
- If colors appear distorted, reset all filters and apply them one at a time to identify the issue.

## FAQ

**Q: Can I apply multiple filters at once?**
A: Yes, you can combine various adjustments and effects to create complex filters.

**Q: Will applying filters reduce my image quality?**
A: Excessive filtering can degrade image quality. Use moderation and always keep a copy of the original image.

**Q: Can I create my own custom filters?**
A: Yes, you can save combinations of adjustments as custom presets for future use.

**Q: Is there a way to see before and after comparisons?**
A: Use the split-view preview feature to compare the filtered image with the original side-by-side.
