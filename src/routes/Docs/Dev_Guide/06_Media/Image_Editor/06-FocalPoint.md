---
title: "Focal Point Tool Developer Guide"
description: "Technical documentation for implementing and extending the Image Editor Focal Point Tool"
---

# Focal Point Tool Developer Guide

## Component Overview

The Focal Point Tool (`FocalPoint.svelte`) is a specialized component that enables users to set and manage a focal point on an image. This tool is particularly useful for image cropping, responsive image display, and determining the most important area of an image.

### Core Features
- Interactive focal point placement
- Drag-and-drop focal point adjustment
- Relative coordinate system (-0.5 to 0.5)
- Visual guides (crosshair and circles)
- Reset and remove functionality

## Implementation Details

### Component Interface

```typescript
interface Props {
    stage: Konva.Stage;
    layer: Konva.Layer;
    imageNode: Konva.Image;
    'on:focalPointChange'?: (point: { x: number; y: number }) => void;
    'on:focalPointRemoved'?: () => void;
}
```

### State Management

```typescript
let focalPoint: Konva.Group | null = $state(null);
let focalPointActive = $state(false);
let relativeX: number = $state(0);
let relativeY: number = $state(0);
```

### Focal Point Creation

```typescript
function createFocalPoint() {
    // Cleanup existing focal point
    if (focalPoint) {
        focalPoint.destroy();
    }

    // Center position calculation
    const imageCenterX = stage.width() / 2;
    const imageCenterY = stage.height() / 2;

    // Create focal point group
    focalPoint = new Konva.Group({
        x: imageCenterX,
        y: imageCenterY,
        draggable: true
    });

    // Create visual elements
    const outerCircle = new Konva.Circle({
        radius: 20,
        stroke: 'white',
        strokeWidth: 2,
        dash: [5, 5]
    });

    const innerCircle = new Konva.Circle({
        radius: 5,
        fill: 'red'
    });

    const crosshairVertical = new Konva.Line({
        points: [0, -15, 0, 15],
        stroke: 'white',
        strokeWidth: 2
    });

    const crosshairHorizontal = new Konva.Line({
        points: [-15, 0, 15, 0],
        stroke: 'white',
        strokeWidth: 2
    });

    // Assemble and render
    focalPoint.add(outerCircle, innerCircle, crosshairVertical, crosshairHorizontal);
    layer.add(focalPoint);
    layer.draw();

    // Initialize state
    updateFocalPoint();
    focalPointActive = true;
}
```

### Event Handling

```typescript
function setupEventListeners() {
    // Stage click handler
    stage.on('click', (e) => {
        if (e.target === stage || e.target === imageNode) {
            if (!focalPointActive || !focalPoint) return;
            
            const position = stage.getPointerPosition();
            if (position && focalPoint) {
                focalPoint.position({
                    x: position.x,
                    y: position.y
                });
                updateFocalPoint();
            }
        }
    });

    // Focal point drag handler
    focalPoint?.on('dragmove', () => {
        updateFocalPoint();
    });

    // Cursor style handlers
    focalPoint?.on('mouseenter', () => {
        document.body.style.cursor = 'move';
    });

    focalPoint?.on('mouseleave', () => {
        document.body.style.cursor = 'default';
    });
}
```

### Position Calculation

```typescript
function updateFocalPoint() {
    if (!focalPoint) return;

    const imageRect = imageNode.getClientRect();
    const focalPointPos = focalPoint.position();

    // Calculate relative position (-0.5 to 0.5)
    relativeX = (focalPointPos.x - imageRect.x) / imageRect.width - 0.5;
    relativeY = (focalPointPos.y - imageRect.y) / imageRect.height - 0.5;

    // Normalize values
    relativeX = Number(relativeX.toFixed(2));
    relativeY = Number(relativeY.toFixed(2));

    // Notify changes
    onFocalPointChange({ x: relativeX, y: relativeY });
    layer.draw();
}
```

## Performance Optimization

### 1. Efficient Rendering

```typescript
function optimizeRendering() {
    // Batch operations
    layer.batchDraw(() => {
        // Update focal point position
        focalPoint?.position({
            x: newX,
            y: newY
        });
        
        // Update relative coordinates
        updateFocalPoint();
    });
}
```

### 2. Event Debouncing

```typescript
function debouncedUpdate() {
    let timeout: number;
    
    return (e: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            updateFocalPoint();
        }, 16); // ~60fps
    };
}
```

## Error Handling

```typescript
function safeFocalPointOperation(operation: () => void) {
    try {
        if (!stage || !layer || !imageNode) {
            throw new Error('Required elements not initialized');
        }
        
        operation();
    } catch (error) {
        console.error('Focal point operation failed:', error);
        resetFocalPoint();
    }
}
```

## Testing

```typescript
describe('FocalPointTool', () => {
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
        
        imageNode = new Konva.Image({
            width: 400,
            height: 300
        });
        layer.add(imageNode);
    });
    
    it('should create focal point at center', () => {
        // Test implementation
    });
    
    it('should update relative coordinates correctly', () => {
        // Test implementation
    });
    
    it('should handle drag events properly', () => {
        // Test implementation
    });
});
```

## Integration Example

```typescript
// In parent component
import FocalPoint from './FocalPoint.svelte';

function handleFocalPointChange(point: { x: number; y: number }) {
    // Update edit history
    imageEditorStore.addEditAction({
        undo: () => {
            // Restore previous focal point
        },
        redo: () => {
            // Reapply focal point
        }
    });
    
    // Update metadata
    imageMetadata.focalPoint = point;
}

// Template
<FocalPoint
    {stage}
    {layer}
    {imageNode}
    on:focalPointChange={handleFocalPointChange}
    on:focalPointRemoved={handleRemove}
/>
```

## Best Practices

1. **Coordinate System**
   - Use relative coordinates (-0.5 to 0.5)
   - Handle coordinate normalization
   - Validate coordinate bounds

2. **Visual Feedback**
   - Provide clear focal point indicators
   - Use appropriate cursor styles
   - Show coordinate values

3. **Performance**
   - Batch render operations
   - Debounce frequent updates
   - Clean up event listeners

4. **Error Handling**
   - Validate component dependencies
   - Handle edge cases
   - Provide fallback behavior

5. **State Management**
   - Track focal point state
   - Handle component lifecycle
   - Clean up resources
