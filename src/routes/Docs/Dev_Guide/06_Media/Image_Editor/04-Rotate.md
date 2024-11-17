---
title: "Rotate Tool Developer Guide"
description: "Technical documentation for implementing and extending the Image Editor Rotate Tool"
---

# Rotate Tool Developer Guide

## Component Overview

The Rotate Tool (`Rotate.svelte`) is a specialized component that provides precise image rotation capabilities using Konva.js. It features both preset angles and custom rotation with visual grid guidance.

### Core Features
- 90-degree preset rotations (left/right)
- Custom angle rotation (-180° to 180°)
- Visual grid overlay for alignment
- Center-point rotation handling
- Batch rendering optimization

## Implementation Details

### Component Interface

```typescript
interface Props {
    stage: Konva.Stage;
    layer: Konva.Layer;
    imageNode: Konva.Image;
    'on:rotate'?: (data: { angle: number }) => void;
    'on:rotateApplied'?: (data: { angle: number }) => void;
    'on:rotateCancelled'?: () => void;
    'on:rotateReset'?: () => void;
}
```

### State Management

```typescript
let rotationAngle = $state(0);
let gridLayer = $state<Konva.Layer | null>(null);
```

### Grid Layer Implementation

```typescript
function createGridLayer() {
    gridLayer = new Konva.Layer();

    const lineColor = 'rgba(211, 211, 211, 0.7)';
    const width = stage.width();
    const height = stage.height();
    const cellWidth = width / 3;
    const cellHeight = height / 3;

    // Create vertical grid lines
    for (let i = 1; i < 3; i++) {
        const verticalLine = new Konva.Line({
            points: [i * cellWidth, 0, i * cellWidth, height],
            stroke: lineColor,
            strokeWidth: 1
        });
        gridLayer.add(verticalLine);
    }

    // Create horizontal grid lines
    for (let i = 1; i < 3; i++) {
        const horizontalLine = new Konva.Line({
            points: [0, i * cellHeight, width, i * cellHeight],
            stroke: lineColor,
            strokeWidth: 1
        });
        gridLayer.add(horizontalLine);
    }

    stage.add(gridLayer);
    gridLayer.hide();
}
```

### Rotation Handling

```typescript
function centerRotationPoint() {
    const imageWidth = imageNode.width();
    const imageHeight = imageNode.height();

    imageNode.offsetX(imageWidth / 2);
    imageNode.offsetY(imageHeight / 2);

    imageNode.x(stage.width() / 2);
    imageNode.y(stage.height() / 2);
}

function rotateImage() {
    centerRotationPoint();
    imageNode.rotation(rotationAngle);
    layer.batchDraw();
    gridLayer?.show();
    gridLayer?.batchDraw();
    onRotate({ angle: rotationAngle });
}

function rotateLeft() {
    rotationAngle = (rotationAngle - 90) % 360;
    rotateImage();
}

function rotateRight() {
    rotationAngle = (rotationAngle + 90) % 360;
    rotateImage();
}

function rotateCustom() {
    rotateImage();
}
```

### Operation Management

```typescript
function applyRotation() {
    gridLayer?.hide();
    layer.batchDraw();
    onRotateApplied({ angle: rotationAngle });
}

function cancelRotation() {
    resetRotation();
    gridLayer?.hide();
    layer.batchDraw();
    onRotateCancelled();
}

function resetRotation() {
    rotationAngle = 0;
    imageNode.rotation(0);
    gridLayer?.hide();
    layer.batchDraw();
    onRotateReset();
}
```

## Performance Optimization

### 1. Efficient Rendering

```typescript
function optimizedRotation() {
    // Batch multiple operations
    stage.batchDraw(() => {
        centerRotationPoint();
        imageNode.rotation(rotationAngle);
        gridLayer?.show();
    });
}
```

### 2. Memory Management

```typescript
function cleanup() {
    // Remove grid layer
    gridLayer?.destroy();
    gridLayer = null;
    
    // Reset image state
    imageNode.offsetX(0);
    imageNode.offsetY(0);
    imageNode.rotation(0);
    
    // Update stage
    layer.batchDraw();
}
```

## Error Handling

```typescript
function safeRotation() {
    try {
        if (!imageNode || !layer) {
            throw new Error('Required elements not initialized');
        }
        
        if (rotationAngle < -180 || rotationAngle > 180) {
            throw new Error('Invalid rotation angle');
        }
        
        rotateImage();
    } catch (error) {
        console.error('Rotation failed:', error);
        resetRotation();
    }
}
```

## Testing

```typescript
describe('RotateTool', () => {
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
    
    it('should rotate 90 degrees left', () => {
        // Test implementation
    });
    
    it('should rotate to custom angle', () => {
        // Test implementation
    });
    
    it('should maintain center point during rotation', () => {
        // Test implementation
    });
});
```

## Integration Example

```typescript
// In parent component
import Rotate from './Rotate.svelte';

function handleRotateApplied({ angle }) {
    // Update edit history
    imageEditorStore.addEditAction({
        undo: () => {
            // Restore previous rotation
        },
        redo: () => {
            // Reapply rotation
        }
    });
}

// Template
<Rotate
    {stage}
    {layer}
    {imageNode}
    on:rotate={handleRotate}
    on:rotateApplied={handleRotateApplied}
    on:rotateCancelled={handleCancel}
    on:rotateReset={handleReset}
/>
```

## Best Practices

1. **Initialization**
   - Set up grid layer early
   - Configure proper event handlers
   - Initialize with default values

2. **Rotation Handling**
   - Always center rotation point
   - Use batch operations for performance
   - Maintain proper angle bounds

3. **Grid Management**
   - Show grid during rotation only
   - Use semi-transparent lines
   - Clean up on component destroy

4. **Event Handling**
   - Provide all necessary callbacks
   - Handle edge cases gracefully
   - Maintain proper state updates
