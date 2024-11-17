---
title: "Shape Overlay Tool"
description: "Comprehensive guide for using and developing the Shape Overlay Tool in SveltyCMS Image Editor"
---

# Shape Overlay Tool Documentation

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

The Shape Overlay Tool is a versatile feature in the SveltyCMS Image Editor that allows you to add, customize, and manipulate various shapes on your images. Whether you're creating infographics, highlighting specific areas, or designing complex visual compositions, this tool provides a wide range of options to enhance your images with geometric elements.

### How to Use

1. **Select the Shape Overlay Tool**: 
   - Click on the Shape Overlay Tool icon in the editor toolbar.

2. **Choose Shape Type**:
   - Select from available shapes:
     - Rectangle
     - Circle
     - Ellipse
     - Triangle
     - Polygon (with customizable number of sides)
     - Star
     - Line
     - Arrow

3. **Add Shape**:
   - Click the "Add Shape" button to place the selected shape on your image.
   - The shape will appear at the center of the canvas initially.

4. **Customize Shape**:
   - Use the properties panel to adjust:
     - Fill Color: Choose solid colors or gradients.
     - Stroke Color: Set the outline color.
     - Stroke Width: Adjust the thickness of the outline.
     - Opacity: Control the transparency of the shape.
   - For specific shapes:
     - Polygon: Adjust the number of sides.
     - Star: Modify inner and outer radius.
     - Arrow: Change arrowhead size.

5. **Position and Transform**:
   - Drag the shape to position it anywhere on the image.
   - Use corner handles to resize the shape.
   - Use the rotation handle to rotate the shape.
   - For polygons and stars, use additional handles to adjust their properties.

6. **Layer Management**:
   - Add multiple shapes by repeating steps 2-5.
   - Use the layer panel to:
     - Select shapes
     - Reorder shapes (bring to front, send to back)
     - Group/ungroup shapes
     - Delete shapes

7. **Apply Changes**:
   - Click "Apply" to confirm the shape overlays.
   - Use "Undo" or "Redo" to step through changes.

### Tips and Best Practices

- **Color Harmony**: Choose shape colors that complement your image and other design elements.
- **Layering**: Use the "Bring to Front" and "Send to Back" options to create depth in your design.
- **Opacity**: Adjust shape opacity to create subtle highlights or overlays without obscuring image details.
- **Combining Shapes**: Use multiple shapes to create more complex designs or icons.
- **Alignment**: Use the alignment tools to perfectly position shapes relative to each other or the image.
- **Consistent Style**: Maintain a consistent style (e.g., rounded corners, stroke width) across shapes for a cohesive look.
- **Highlight Areas**: Use semi-transparent shapes to draw attention to specific parts of your image.
- **Create Frames**: Use shapes with transparent centers to create frames or vignettes for your images.

## Developer Guide

### Architecture Overview

The Shape Overlay Tool is implemented as a modular component within the SveltyCMS Image Editor. It utilizes Svelte for the UI and state management, and Konva.js for canvas manipulation and rendering of the shape overlays.

### Key Components

1. **ShapeOverlay.svelte**: The main component that handles the UI and logic for the Shape Overlay Tool.
2. **KonvaStage**: A wrapper component that integrates Konva.js with Svelte for image and shape rendering.
3. **ShapeLayer**: A component representing individual shape layers.
4. **ShapeStyleControls**: A sub-component for shape customization controls.

### Important Functions

```typescript
function addShape(type: ShapeType): void {
  let shape: Konva.Shape;
  
  switch (type) {
    case 'rectangle':
      shape = new Konva.Rect({
        width: 100,
        height: 50,
        fill: 'red',
        draggable: true,
      });
      break;
    case 'circle':
      shape = new Konva.Circle({
        radius: 50,
        fill: 'blue',
        draggable: true,
      });
      break;
    // ... other shape types
  }
  
  layer.add(shape);
  layer.batchDraw();
  selectShape(shape);
}

function updateSelectedShape(props: Partial<Konva.ShapeConfig>): void {
  if (!selectedShape) return;
  
  Object.entries(props).forEach(([key, value]) => {
    selectedShape[key](value);
  });
  
  layer.batchDraw();
  updateShapeControls(selectedShape);
}

function selectShape(shape: Konva.Shape): void {
  deselectAllShapes();
  shape.draggable(true);
  transformer.nodes([shape]);
  layer.batchDraw();
  selectedShape = shape;
  updateShapeControls(shape);
}
```

### Customization and Extension

To enhance the Shape Overlay Tool functionality:

1. Add support for custom SVG shapes:
   ```typescript
   function addSVGShape(svgPath: string): void {
     const shape = new Konva.Path({
       data: svgPath,
       fill: 'gray',
       draggable: true,
     });
     
     layer.add(shape);
     layer.batchDraw();
     selectShape(shape);
   }
   
   // Usage
   addSVGShape('M10 10 H 90 V 90 H 10 L 10 10');
   ```

2. Implement a freehand drawing tool:
   ```typescript
   let isDrawing = false;
   let freehandLine: Konva.Line;
   
   function startFreehandDrawing(e: Konva.KonvaEventObject<MouseEvent>) {
     isDrawing = true;
     const pos = stage.getPointerPosition();
     freehandLine = new Konva.Line({
       points: [pos.x, pos.y],
       stroke: 'black',
       strokeWidth: 5,
     });
     layer.add(freehandLine);
   }
   
   function drawFreehand(e: Konva.KonvaEventObject<MouseEvent>) {
     if (!isDrawing) return;
     const pos = stage.getPointerPosition();
     const newPoints = freehandLine.points().concat([pos.x, pos.y]);
     freehandLine.points(newPoints);
     layer.batchDraw();
   }
   
   function endFreehandDrawing() {
     isDrawing = false;
   }
   
   // Add event listeners to stage
   stage.on('mousedown touchstart', startFreehandDrawing);
   stage.on('mousemove touchmove', drawFreehand);
   stage.on('mouseup touchend', endFreehandDrawing);
   ```

3. Add shape combination operations:
   ```typescript
   function combineShapes(shapeA: Konva.Shape, shapeB: Konva.Shape, operation: 'union' | 'intersect' | 'subtract'): void {
     const pathA = new Path2D(shapeA.toDataURL());
     const pathB = new Path2D(shapeB.toDataURL());
     
     const canvas = document.createElement('canvas');
     const ctx = canvas.getContext('2d');
     
     switch (operation) {
       case 'union':
         ctx.fill(pathA);
         ctx.fill(pathB);
         break;
       case 'intersect':
         ctx.clip(pathA);
         ctx.fill(pathB);
         break;
       case 'subtract':
         ctx.fill(pathA);
         ctx.globalCompositeOperation = 'destination-out';
         ctx.fill(pathB);
         break;
     }
     
     const combinedShape = new Konva.Image({
       image: canvas,
       draggable: true,
     });
     
     layer.add(combinedShape);
     shapeA.destroy();
     shapeB.destroy();
     layer.batchDraw();
   }
   ```

## Troubleshooting

If you encounter issues with the Shape Overlay Tool, try the following:

- If shapes are not appearing, check that the fill color is different from the background.
- If unable to select or move shapes, ensure you're in the Shape Overlay Tool mode.
- For performance issues with many shapes, try grouping shapes or reducing complex effects.
- If custom SVG shapes are not rendering correctly, verify the SVG path data is valid.

## FAQ

**Q: Is there a limit to how many shapes I can add?**
A: While there's no hard limit, too many shapes may impact performance. We recommend using no more than 50-100 shapes per image for optimal performance.

**Q: Can I create custom shapes beyond the provided options?**
A: The basic tool provides common shapes, but developers can extend functionality to support custom SVG shapes or freehand drawing.

**Q: How can I create perfect circles or squares?**
A: Hold the Shift key while dragging the corner handles to maintain a 1:1 aspect ratio for circles and squares.

**Q: Can I add text inside shapes?**
A: Currently, you need to use the Text Overlay Tool in conjunction with the Shape Overlay Tool to achieve this effect.

