---
title: "Blur Tool Developer Guide"
description: "Technical documentation for implementing and extending the Image Editor Blur Tool"
---

# Blur Tool Developer Guide

## Component Overview

The Blur Tool (`Blur.svelte`) is a specialized component that implements selective image blurring using Konva.js. It allows users to create and manipulate blur regions with adjustable mosaic strength.

### Core Features
- Region-based blur selection
- Adjustable mosaic strength
- Interactive region transformation
- Real-time preview
- Undo/redo support

## Implementation Details

### Component Interface

```typescript
interface Props {
    stage: Konva.Stage;
    layer: Konva.Layer;
    imageNode: Konva.Image;
    'on:blurReset'?: () => void;
    'on:blurApplied'?: () => void;
}
```

### State Management

```typescript
// Tool-specific state
let mosaicStrength = $state(10);
let blurRegion: Konva.Rect;
let transformer: Konva.Transformer;
let isSelecting = $state(false);
let startPoint = $state<{ x: number; y: number } | null>(null);
let mosaicOverlay: Konva.Image;
```

### Event Handling

```typescript
// Initialize stage event listeners
$effect.root(() => {
    stage.on('mousedown touchstart', handleMouseDown);
    stage.on('mousemove touchmove', handleMouseMove);
    stage.on('mouseup touchend', handleMouseUp);
    stage.container().style.cursor = 'crosshair';

    // Cleanup function
    return () => {
        stage.off('mousedown touchstart');
        stage.off('mousemove touchmove');
        stage.off('mouseup touchend');
    };
});
```

### Region Selection

```typescript
function handleMouseDown(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (blurRegion) return;

    isSelecting = true;
    const pos = stage.getPointerPosition();
    startPoint = pos ? { x: pos.x, y: pos.y } : null;
}

function handleMouseMove(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (!isSelecting || !startPoint) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (!blurRegion) {
        blurRegion = new Konva.Rect({
            x: startPoint.x,
            y: startPoint.y,
            width: pos.x - startPoint.x,
            height: pos.y - startPoint.y,
            stroke: 'white',
            strokeWidth: 1,
            dash: [5, 5],
            draggable: true
        });
        layer.add(blurRegion);
    } else {
        blurRegion.width(pos.x - startPoint.x);
        blurRegion.height(pos.y - startPoint.y);
    }
    layer.batchDraw();
}
```

### Blur Application

```typescript
function applyMosaic() {
    if (!blurRegion) return;

    const scale = imageNode.getAbsoluteScale();
    const region = {
        x: blurRegion.x() / scale.x,
        y: blurRegion.y() / scale.y,
        width: blurRegion.width() / scale.x,
        height: blurRegion.height() / scale.y
    };

    // Create temporary canvas for blur effect
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    
    // Apply mosaic effect
    const tileSize = mosaicStrength;
    for (let y = 0; y < region.height; y += tileSize) {
        for (let x = 0; x < region.width; x += tileSize) {
            const pixelData = tempContext.getImageData(
                region.x + x,
                region.y + y,
                tileSize,
                tileSize
            );
            // Calculate average color
            const avgColor = calculateAverageColor(pixelData);
            // Apply to tile
            tempContext.fillStyle = avgColor;
            tempContext.fillRect(
                region.x + x,
                region.y + y,
                tileSize,
                tileSize
            );
        }
    }
}
```

### Transformation Handling

```typescript
function setupTransformer() {
    transformer = new Konva.Transformer({
        nodes: [blurRegion],
        borderDash: [5, 5],
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
    layer.add(transformer);
}
```

## Performance Optimization

### 1. Efficient Rendering

```typescript
// Use batch drawing for better performance
function updateBlurRegion() {
    if (!blurRegion) return;
    
    // Update region properties
    blurRegion.setAttrs({
        // ... properties
    });
    
    // Batch draw instead of immediate draw
    layer.batchDraw();
}
```

### 2. Memory Management

```typescript
function cleanup() {
    // Remove event listeners
    stage.off('mousedown touchstart');
    stage.off('mousemove touchmove');
    stage.off('mouseup touchend');
    
    // Destroy Konva nodes
    blurRegion?.destroy();
    transformer?.destroy();
    mosaicOverlay?.destroy();
    
    // Clear references
    blurRegion = null;
    transformer = null;
    mosaicOverlay = null;
    
    // Redraw layer
    layer.batchDraw();
}
```

## Error Handling

```typescript
function safelyApplyBlur() {
    try {
        if (!blurRegion || !imageNode) {
            throw new Error('Required elements not initialized');
        }
        
        applyMosaic();
    } catch (error) {
        console.error('Failed to apply blur effect:', error);
        // Cleanup and reset
        cleanup();
        onBlurReset();
    }
}
```

## Testing

```typescript
describe('BlurTool', () => {
    let stage: Konva.Stage;
    let layer: Konva.Layer;
    let imageNode: Konva.Image;
    
    beforeEach(() => {
        // Setup test environment
        stage = new Konva.Stage({
            container: 'test-container',
            width: 500,
            height: 500
        });
        layer = new Konva.Layer();
        stage.add(layer);
        
        // Create test image
        imageNode = new Konva.Image({
            // ... test image properties
        });
        layer.add(imageNode);
    });
    
    it('should create blur region on mouse drag', () => {
        // Test implementation
    });
    
    it('should apply mosaic effect with correct strength', () => {
        // Test implementation
    });
    
    it('should handle region transformation correctly', () => {
        // Test implementation
    });
});
```

## Integration Example

```typescript
// In parent component
import Blur from './Blur.svelte';

function handleBlurApplied() {
    // Update edit history
    imageEditorStore.addEditAction({
        undo: () => {
            // Restore previous image state
        },
        redo: () => {
            // Reapply blur effect
        }
    });
}

// Template
<Blur
    {stage}
    {layer}
    {imageNode}
    on:blurApplied={handleBlurApplied}
    on:blurReset={handleReset}
/>
```

## Best Practices

1. **Region Selection**
   - Validate selection bounds
   - Provide visual feedback
   - Handle edge cases

2. **Effect Application**
   - Use efficient algorithms
   - Cache results when possible
   - Provide progress feedback

3. **User Interaction**
   - Clear cursor feedback
   - Responsive controls
   - Smooth transformations

4. **Error Recovery**
   - Validate inputs
   - Handle edge cases
   - Provide undo capability
