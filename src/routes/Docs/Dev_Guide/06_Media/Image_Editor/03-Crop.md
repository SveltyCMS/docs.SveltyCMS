---
title: "Crop Tool Developer Guide"
description: "Technical documentation for implementing and extending the Image Editor Crop Tool"
---

# Crop Tool Developer Guide

## Component Overview

The Crop Tool (`Crop.svelte`) is a versatile component that enables image cropping functionality using Konva.js. It supports multiple crop shapes and provides an interactive interface for precise cropping operations.

### Core Features
- Multiple crop shapes (rectangle, square, circular)
- Interactive crop region manipulation
- Visual overlay for crop preview
- Aspect ratio constraints
- Responsive to image bounds

## Implementation Details

### Component Interface

```typescript
interface Props {
    stage: Konva.Stage;
    layer: Konva.Layer;
    imageNode: Konva.Image;
    'on:cropApplied'?: () => void;
    'on:cancelCrop'?: () => void;
    'on:cropReset'?: () => void;
}
```

### State Management

```typescript
let cropShape = $state<'rectangle' | 'square' | 'circular'>('rectangle');
let cropTool = $state<Konva.Rect | Konva.Circle | null>(null);
let transformer = $state<Konva.Transformer | null>(null);
let cropOverlay = $state<Konva.Rect | null>(null);
```

### Initialization

```typescript
function initCropTool() {
    // Clear previous instances
    if (cropTool) cropTool.destroy();
    if (transformer) transformer.destroy();
    if (cropOverlay) cropOverlay.destroy();

    const imageWidth = imageNode.width();
    const imageHeight = imageNode.height();
    const size = Math.min(imageWidth, imageHeight) / 4;

    // Create overlay
    cropOverlay = new Konva.Rect({
        x: 0,
        y: 0,
        width: imageWidth,
        height: imageHeight,
        fill: 'rgba(0, 0, 0, 0.5)',
        globalCompositeOperation: 'destination-over',
        listening: false
    });

    // Initialize crop shape
    if (cropShape === 'circular') {
        cropTool = new Konva.Circle({
            x: imageWidth / 2,
            y: imageHeight / 2,
            radius: size / 2,
            stroke: 'white',
            strokeWidth: 3,
            draggable: true,
            name: 'cropTool'
        });
    } else {
        cropTool = new Konva.Rect({
            x: (imageWidth - size) / 2,
            y: (imageHeight - size) / 2,
            width: size,
            height: cropShape === 'square' ? size : size * 0.75,
            stroke: 'white',
            strokeWidth: 3,
            draggable: true,
            name: 'cropTool'
        });
    }
}
```

### Transformer Configuration

```typescript
function setupTransformer() {
    transformer = new Konva.Transformer({
        nodes: [cropTool],
        keepRatio: cropShape !== 'rectangle',
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        anchorStrokeWidth: 2,
        boundBoxFunc: (oldBox, newBox) => {
            // Constrain to image bounds
            const imageRect = imageNode.getClientRect();
            return {
                x: Math.max(imageRect.x, newBox.x),
                y: Math.max(imageRect.y, newBox.y),
                width: Math.min(
                    imageRect.width - (newBox.x - imageRect.x),
                    newBox.width
                ),
                height: Math.min(
                    imageRect.height - (newBox.y - imageRect.y),
                    newBox.height
                )
            };
        }
    });
}
```

### Crop Application

```typescript
function applyCrop() {
    if (!cropTool) return;

    const scale = imageNode.getAbsoluteScale();
    const cropRegion = cropTool.getClientRect();
    
    // Convert to image coordinates
    const crop = {
        x: (cropRegion.x - imageNode.x()) / scale.x,
        y: (cropRegion.y - imageNode.y()) / scale.y,
        width: cropRegion.width / scale.x,
        height: cropRegion.height / scale.y
    };

    // Apply crop to image
    imageNode.crop(crop);
    imageNode.size({
        width: crop.width,
        height: crop.height
    });

    // Cleanup and notify
    cleanup();
    onCropApplied();
}
```

## Performance Optimization

### 1. Efficient Rendering

```typescript
function updateCropRegion() {
    if (!cropTool) return;
    
    // Batch updates
    layer.batchDraw();
}

// Event handling with throttling
function handleTransform() {
    requestAnimationFrame(updateCropRegion);
}
```

### 2. Memory Management

```typescript
function cleanup() {
    // Remove Konva nodes
    cropTool?.destroy();
    transformer?.destroy();
    cropOverlay?.destroy();
    
    // Clear references
    cropTool = null;
    transformer = null;
    cropOverlay = null;
    
    // Update layer
    layer.batchDraw();
}
```

## Error Handling

```typescript
function safeCropOperation() {
    try {
        if (!cropTool || !imageNode) {
            throw new Error('Required elements not initialized');
        }
        
        const cropRegion = cropTool.getClientRect();
        if (cropRegion.width < 1 || cropRegion.height < 1) {
            throw new Error('Invalid crop region size');
        }
        
        applyCrop();
    } catch (error) {
        console.error('Crop operation failed:', error);
        cleanup();
        onCropReset();
    }
}
```

## Testing

```typescript
describe('CropTool', () => {
    let stage: Konva.Stage;
    let layer: Konva.Layer;
    let imageNode: Konva.Image;
    
    beforeEach(() => {
        stage = new Konva.Stage({
            container: 'test-container',
            width: 500,
            height: 500
        });
        layer = new Konva.Layer();
        stage.add(layer);
        
        imageNode = new Konva.Image({
            width: 400,
            height: 300
        });
        layer.add(imageNode);
    });
    
    it('should initialize with default rectangle shape', () => {
        // Test implementation
    });
    
    it('should maintain aspect ratio for square and circular shapes', () => {
        // Test implementation
    });
    
    it('should constrain crop region to image bounds', () => {
        // Test implementation
    });
});
```

## Integration Example

```typescript
// In parent component
import Crop from './Crop.svelte';

function handleCropApplied() {
    // Update edit history
    imageEditorStore.addEditAction({
        undo: () => {
            // Restore previous image state
        },
        redo: () => {
            // Reapply crop
        }
    });
}

// Template
<Crop
    {stage}
    {layer}
    {imageNode}
    on:cropApplied={handleCropApplied}
    on:cancelCrop={handleCancel}
    on:cropReset={handleReset}
/>
```

## Best Practices

1. **Initialization**
   - Clear previous instances before creating new ones
   - Set appropriate initial size based on image dimensions
   - Configure proper event listeners

2. **Shape Handling**
   - Maintain aspect ratio for square and circular shapes
   - Provide smooth transitions between shapes
   - Handle shape-specific constraints

3. **Transformation**
   - Constrain to image bounds
   - Maintain minimum crop size
   - Provide visual feedback

4. **Cleanup**
   - Remove all Konva nodes
   - Clear event listeners
   - Reset state properly
