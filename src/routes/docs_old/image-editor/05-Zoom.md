---
title: "Zoom Tool"
description: "Comprehensive guide for using and developing the Zoom Tool in SveltyCMS Image Editor"
---

# Zoom Tool Documentation

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

The Zoom Tool is an essential feature in the SveltyCMS Image Editor that allows you to magnify and examine parts of your image in detail. Whether you're making precise edits, checking image quality, or simply exploring the finer details of your image, the Zoom Tool provides smooth and intuitive control over image magnification.

### How to Use

1. **Select the Zoom Tool**: 
   - Click on the Zoom Tool icon in the editor toolbar.

2. **Adjust Zoom Level**:
   - Use the slider to increase or decrease zoom level (25% to 400%).
   - Click the "+" and "-" buttons for incremental zoom adjustments.
   - Use the mouse wheel to quickly zoom in and out.

3. **Navigate the Zoomed Image**:
   - Click and drag on the image to pan around when zoomed in.
   - Use the arrow keys for precise panning movements.

4. **Quick Actions**:
   - Double-click anywhere on the image to reset zoom to 100%.
   - Use the "Fit to Screen" button to adjust zoom so the entire image is visible.

5. **View Zoom Information**:
   - The current zoom level is displayed in the bottom-right corner of the image.

### Tips and Best Practices

- **Precision Editing**: Zoom in to 200-400% for pixel-level edits, then zoom out to see the overall effect.
- **Check Image Quality**: Use high zoom levels to inspect image sharpness and artifacts.
- **Keyboard Shortcuts**:
  - Press 'Ctrl +' (Windows) or 'Cmd +' (Mac) to zoom in.
  - Press 'Ctrl -' (Windows) or 'Cmd -' (Mac) to zoom out.
  - Press '0' (zero) to reset zoom to 100%.
- **Consistent Workflow**: Maintain a consistent zoom level when making repetitive edits across an image.
- **Combine with Other Tools**: Use the Zoom Tool in conjunction with other editing tools for precise adjustments.

## Developer Guide

### Architecture Overview

The Zoom Tool is implemented as a modular component within the SveltyCMS Image Editor. It utilizes Svelte for the UI and state management, and Konva.js for canvas manipulation and rendering of the zoomed image.

### Key Components

1. **Zoom.svelte**: The main component that handles the UI and logic for the Zoom Tool.
2. **KonvaStage**: A wrapper component that integrates Konva.js with Svelte for image rendering and scaling.
3. **ZoomControls**: A sub-component that provides the zoom slider and buttons.

### Important Functions

```typescript
function zoom(delta: number): void {
  // Applies zoom to the Konva stage
  const newScale = currentScale + delta;
  konvaStage.scale({ x: newScale, y: newScale });
  konvaStage.batchDraw();
  updateZoomLevel(newScale);
}

function resetZoom(): void {
  // Resets zoom to 100% and centers the image
  konvaStage.scale({ x: 1, y: 1 });
  konvaStage.position({ x: 0, y: 0 });
  konvaStage.batchDraw();
  updateZoomLevel(1);
}

function updateZoomLevel(scale: number): void {
  // Updates the displayed zoom level
  zoomLevel.set(Math.round(scale * 100));
}
```

### Customization and Extension

To enhance the Zoom Tool functionality:

1. Implement a "zoom to selection" feature:
   ```typescript
   function zoomToSelection(selection: { x: number, y: number, width: number, height: number }): void {
     const stage = konvaStage.getStage();
     const scale = Math.min(stage.width() / selection.width, stage.height() / selection.height);
     const centerX = selection.x + selection.width / 2;
     const centerY = selection.y + selection.height / 2;
     
     konvaStage.scale({ x: scale, y: scale });
     konvaStage.position({
       x: (stage.width() / 2) - centerX * scale,
       y: (stage.height() / 2) - centerY * scale
     });
     konvaStage.batchDraw();
     updateZoomLevel(scale);
   }
   ```

2. Add a mini-map for navigation:
   ```svelte
   <script>
   import { onMount } from 'svelte';
   import Konva from 'konva';

   export let mainStage;
   let miniMapStage;

   onMount(() => {
     miniMapStage = new Konva.Stage({
       container: 'mini-map',
       width: 150,
       height: 150
     });
     // ... setup mini-map layers and image
   });

   function updateMiniMap() {
     // Update mini-map view based on main stage position and scale
   }
   </script>

   <div id="mini-map"></div>
   ```

3. Create preset zoom levels:
   ```svelte
   <script>
   const presetZoomLevels = [0.5, 1, 2, 4];
   
   function applyPresetZoom(level) {
     zoom(level - currentScale);
   }
   </script>

   <div class="zoom-presets">
     {#each presetZoomLevels as level}
       <button on:click={() => applyPresetZoom(level)}>{level * 100}%</button>
     {/each}
   </div>
   ```

## Troubleshooting

If you encounter issues with the Zoom Tool, try the following:

- If zooming is sluggish, try reducing the image size or using a more powerful device.
- If the image becomes pixelated at high zoom levels, this is normal behavior and doesn't affect the actual image quality.
- If panning doesn't work when zoomed in, ensure you're clicking and dragging on the image itself.
- If zoom shortcuts aren't working, check that your browser isn't overriding them with its own zoom functionality.

## FAQ

**Q: Does zooming affect the final image quality?**
A: No, zooming is only for viewing and editing. It doesn't affect the final image output quality.

**Q: Is there a maximum zoom level?**
A: The default maximum zoom is 400%, but this can be adjusted in the settings if needed.

**Q: Can I use the Zoom Tool while using other editing tools?**
A: Yes, you can zoom in and out while using most other editing tools for precise adjustments.

**Q: How can I quickly view my entire image after zooming in?**
A: Double-click anywhere on the image to reset the zoom to 100%, or use the "Fit to Screen" button.
