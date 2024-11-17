---
title: "Shape Overlay Tool Developer Guide"
description: "Technical documentation for implementing and extending the Image Editor Shape Overlay Tool"
---

# Shape Overlay Tool Developer Guide

## Component Overview

The Shape Overlay Tool (`ShapeOverlay.svelte`) is a versatile component that enables users to add, customize, and manage geometric shapes on top of images. It supports multiple shape types, styling options, and layer management capabilities.

### Core Features
- Multiple shape types (rectangle, circle, ellipse)
- Interactive shape manipulation
- Customizable styling (fill, stroke, opacity)
- Layer ordering controls
- Shape selection and deletion
- Drag-and-drop functionality

## Implementation Details

### Component Interface

```typescript
interface Props {
    stage: Konva.Stage;
    layer: Konva.Layer;
    'on:exitShapeOverlay'?: () => void;
}
```

### State Management

```typescript
// Shape configuration state
let shapeType = $state('rectangle');
let fillColor: string = $state('#ffffff');
let strokeColor: string = $state('#000000');
let strokeWidth = $state(2);
let opacity = $state(1);

// Shape management state
let shapes = $state<Konva.Shape[]>([]);
let selectedShape: Konva.Shape | null = $state(null);
```

### Shape Creation

```typescript
function addShape() {
    const commonProps = {
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        opacity: opacity,
        draggable: true
    };

    let shape: Konva.Shape;

    switch (shapeType) {
        case 'rectangle':
            shape = new Konva.Rect({
                x: stage.width() / 2 - 50,
                y: stage.height() / 2 - 25,
                width: 100,
                height: 50,
                ...commonProps
            });
            break;

        case 'circle':
            shape = new Konva.Circle({
                x: stage.width() / 2,
                y: stage.height() / 2,
                radius: 50,
                ...commonProps
            });
            break;

        case 'ellipse':
            shape = new Konva.Ellipse({
                x: stage.width() / 2,
                y: stage.height() / 2,
                radiusX: 75,
                radiusY: 50,
                ...commonProps
            });
            break;

        default:
            shape = new Konva.Rect({
                x: stage.width() / 2 - 50,
                y: stage.height() / 2 - 25,
                width: 100,
                height: 50,
                ...commonProps
            });
    }

    // Add event handlers
    shape.on('click tap', () => selectShape(shape));
    shape.on('dragend', () => layer.draw());

    // Add to layer and state
    layer.add(shape);
    shapes = [...shapes, shape];
    selectShape(shape);
    layer.draw();
}
```

### Shape Selection

```typescript
function selectShape(shape: Konva.Shape | null) {
    // Deselect current shape
    if (selectedShape) {
        selectedShape.strokeEnabled(true);
    }

    // Update selection
    selectedShape = shape;

    if (shape) {
        // Update UI with shape properties
        shape.strokeEnabled(false);
        fillColor = shape.fill() as string;
        strokeColor = shape.stroke() as string;
        strokeWidth = shape.strokeWidth();
        opacity = shape.opacity();
    }

    layer.draw();
}
```

### Shape Updates

```typescript
function updateSelectedShape() {
    if (selectedShape) {
        selectedShape.fill(fillColor);
        selectedShape.stroke(strokeColor);
        selectedShape.strokeWidth(strokeWidth);
        selectedShape.opacity(opacity);
        layer.draw();
    }
}
```

### Layer Management

```typescript
function bringToFront() {
    if (selectedShape) {
        selectedShape.moveToTop();
        layer.draw();
    }
}

function sendToBack() {
    if (selectedShape) {
        selectedShape.moveToBottom();
        layer.draw();
    }
}
```

## Performance Optimization

### 1. Efficient Shape Management

```typescript
function optimizedShapeManagement() {
    // Batch operations
    layer.batchDraw(() => {
        // Add shape
        layer.add(shape);
        
        // Update properties
        shape.setAttrs({
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            opacity: opacity
        });
    });
}
```

### 2. Event Handling

```typescript
function setupOptimizedEvents() {
    // Use event delegation
    stage.on('click tap', (e) => {
        const target = e.target;
        
        if (target === stage) {
            selectShape(null);
        } else if (target instanceof Konva.Shape) {
            selectShape(target);
        }
    });
}
```

## Error Handling

```typescript
function safeShapeOperation(operation: () => void) {
    try {
        if (!stage || !layer) {
            throw new Error('Required elements not initialized');
        }
        
        operation();
    } catch (error) {
        console.error('Shape operation failed:', error);
        // Cleanup if needed
        if (selectedShape) {
            deleteSelectedShape();
        }
    }
}
```

## Testing

```typescript
describe('ShapeOverlayTool', () => {
    let stage: Konva.Stage;
    let layer: Konva.Layer;
    
    beforeEach(() => {
        stage = new Konva.Stage({
            container: 'test-container',
            width: 500,
            height: 500
        });
        layer = new Konva.Layer();
        stage.add(layer);
    });
    
    it('should create shapes correctly', () => {
        // Test implementation
    });
    
    it('should handle shape selection', () => {
        // Test implementation
    });
    
    it('should update shape properties', () => {
        // Test implementation
    });
    
    it('should manage layer ordering', () => {
        // Test implementation
    });
});
```

## Integration Example

```typescript
// In parent component
import ShapeOverlay from './ShapeOverlay.svelte';

function handleShapeOverlayExit() {
    // Update edit history
    imageEditorStore.addEditAction({
        undo: () => {
            // Remove added shapes
        },
        redo: () => {
            // Restore shapes
        }
    });
}

// Template
<ShapeOverlay
    {stage}
    {layer}
    on:exitShapeOverlay={handleShapeOverlayExit}
/>
```

## Best Practices

1. **Shape Management**
   - Use consistent shape creation
   - Handle shape cleanup
   - Maintain shape state

2. **Event Handling**
   - Use event delegation
   - Clean up listeners
   - Handle touch events

3. **Performance**
   - Batch shape operations
   - Optimize redraws
   - Cache static shapes

4. **Error Handling**
   - Validate shape operations
   - Handle edge cases
   - Clean up on errors

5. **State Management**
   - Track shape collections
   - Handle selection state
   - Maintain undo/redo history
