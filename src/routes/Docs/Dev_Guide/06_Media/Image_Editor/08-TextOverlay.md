---
title: "Text Overlay Tool Developer Guide"
description: "Technical documentation for implementing and extending the Image Editor Text Overlay Tool"
---

# Text Overlay Tool Developer Guide

## Component Overview

The Text Overlay Tool (`TextOverlay.svelte`) is a sophisticated component that enables users to add, style, and manipulate text overlays on images. It provides comprehensive text customization options and interactive text manipulation capabilities using Konva.js.

### Core Features
- Multiple text overlay support
- Rich text styling options
- Interactive text manipulation
- Transformer for text scaling
- Drag-and-drop positioning
- Text selection and deletion

## Implementation Details

### Component Interface

```typescript
interface Props {
    stage: Konva.Stage;
    layer: Konva.Layer;
    imageNode: Konva.Image;
    'on:exitTextOverlay'?: () => void;
}
```

### State Management

```typescript
// Text configuration state
let text = $state('');
let fontSize = $state(24);
let textColor = $state('#ffffff');
let fontFamily = $state('Arial');
let textAlign = $state('left');
let fontStyle = $state('normal');
let selectedText: Konva.Text | null = $state(null);
```

### Text Creation

```typescript
function addText() {
    if (!text) return;

    const textNode = new Konva.Text({
        x: imageNode.width() / 2,
        y: imageNode.height() / 2,
        text: text,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: textColor,
        align: textAlign,
        fontStyle: fontStyle,
        draggable: true
    });

    // Handle text scaling
    textNode.on('transform', () => {
        textNode.setAttrs({
            width: textNode.width() * textNode.scaleX(),
            scaleX: 1
        });
    });

    layer.add(textNode);
    layer.draw();
    selectText(textNode);
    text = '';
}
```

### Text Selection

```typescript
function selectText(textNode: Konva.Text) {
    // Deselect previous text
    deselectText();
    
    // Update selection
    selectedText = textNode;
    selectedText.draggable(true);
    
    // Add transformer
    addTransformer(selectedText);
    layer.draw();
}

function deselectText() {
    if (selectedText) {
        selectedText.draggable(false);

        // Remove transformer
        const transformer = stage.findOne('Transformer');
        if (transformer) {
            transformer.destroy();
        }

        layer.draw();
        selectedText = null;
    }
}
```

### Text Transformation

```typescript
function addTransformer(textNode: Konva.Text) {
    const tr = new Konva.Transformer({
        nodes: [textNode],
        enabledAnchors: ['middle-left', 'middle-right'],
        boundBoxFunc: (oldBox, newBox) => {
            // Ensure minimum width
            newBox.width = Math.max(30, newBox.width);
            return newBox;
        }
    });
    layer.add(tr);
}
```

### Text Updates

```typescript
function updateSelectedText() {
    if (selectedText) {
        selectedText.setAttrs({
            fontSize: fontSize,
            fill: textColor,
            fontFamily: fontFamily,
            align: textAlign,
            fontStyle: fontStyle
        });
        layer.draw();
    }
}
```

## Performance Optimization

### 1. Efficient Text Rendering

```typescript
function optimizedTextRendering() {
    // Batch operations
    layer.batchDraw(() => {
        // Create text node
        const textNode = new Konva.Text({
            text: text,
            // ... other properties
        });
        
        // Add to layer
        layer.add(textNode);
        
        // Update properties
        textNode.setAttrs({
            fontSize: fontSize,
            fill: textColor,
            // ... other styles
        });
    });
}
```

### 2. Event Handling

```typescript
function setupOptimizedEvents() {
    // Use event delegation
    stage.on('click', (e) => {
        const target = e.target;
        
        if (target instanceof Konva.Text) {
            selectText(target);
        } else {
            deselectText();
        }
    });
}
```

## Error Handling

```typescript
function safeTextOperation(operation: () => void) {
    try {
        if (!stage || !layer) {
            throw new Error('Required elements not initialized');
        }
        
        operation();
    } catch (error) {
        console.error('Text operation failed:', error);
        // Cleanup if needed
        if (selectedText) {
            deleteSelectedText();
        }
    }
}
```

## Testing

```typescript
describe('TextOverlayTool', () => {
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
    
    it('should create text correctly', () => {
        // Test implementation
    });
    
    it('should handle text selection', () => {
        // Test implementation
    });
    
    it('should update text properties', () => {
        // Test implementation
    });
    
    it('should handle text transformation', () => {
        // Test implementation
    });
});
```

## Integration Example

```typescript
// In parent component
import TextOverlay from './TextOverlay.svelte';

function handleTextOverlayExit() {
    // Update edit history
    imageEditorStore.addEditAction({
        undo: () => {
            // Remove added text
        },
        redo: () => {
            // Restore text
        }
    });
}

// Template
<TextOverlay
    {stage}
    {layer}
    {imageNode}
    on:exitTextOverlay={handleTextOverlayExit}
/>
```

## Best Practices

1. **Text Management**
   - Handle text creation consistently
   - Manage text selection state
   - Clean up text nodes properly
   - Use appropriate text attributes

2. **Event Handling**
   - Use event delegation
   - Clean up event listeners
   - Handle touch events
   - Manage selection state

3. **Performance**
   - Batch text operations
   - Optimize transformations
   - Cache static text
   - Minimize redraws

4. **Error Handling**
   - Validate text operations
   - Handle edge cases
   - Provide fallback behavior
   - Clean up on errors

5. **State Management**
   - Track text nodes
   - Handle selection state
   - Maintain text properties
   - Manage undo/redo history
