---
title: "Filter Tool Developer Guide"
description: "Technical documentation for implementing and extending the Image Editor Filter Tool"
---

# Filter Tool Developer Guide

## Component Overview

The Filter Tool (`Filter.svelte`) is a powerful component that provides comprehensive image filtering capabilities using Konva.js. It supports multiple filter types including brightness, contrast, saturation, hue, blur, and special effects like sepia, invert, and grayscale.

### Core Features
- Multiple filter types support
- Real-time filter preview
- Batch filter application
- Filter value normalization
- Performance-optimized rendering

## Implementation Details

### Component Interface

```typescript
interface Props {
    stage: Konva.Stage;
    layer: Konva.Layer;
    imageNode: Konva.Image;
    'on:filter'?: (data: { filterType: string; value: number | boolean }) => void;
    'on:resetFilters'?: () => void;
    'on:exitFilters'?: () => void;
}
```

### State Management

```typescript
interface Filters {
    brightness: number;
    contrast: number;
    saturation: number;
    hue: number;
    blur: number;
    sepia: boolean;
    invert: boolean;
    grayscale: boolean;
    [key: string]: number | boolean;
}

let filters: Filters = $state({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
    sepia: false,
    invert: false,
    grayscale: false
});
```

### Filter Application

```typescript
function applyFilter(filterType: string, value: number | boolean) {
    filters[filterType] = value;

    // Apply filters to the image node
    const activeFilters: ((imageData: ImageData) => void)[] = [];

    if (filters.brightness !== 0) {
        activeFilters.push(Konva.Filters.Brighten);
        imageNode.brightness(filters.brightness);
    }

    if (filters.contrast !== 0) {
        activeFilters.push(Konva.Filters.Contrast);
        imageNode.contrast(filters.contrast);
    }

    if (filters.saturation !== 0) {
        activeFilters.push(Konva.Filters.HSL);
        imageNode.saturation(filters.saturation);
    }

    if (filters.hue !== 0) {
        activeFilters.push(Konva.Filters.HSL);
        imageNode.hue(filters.hue);
    }

    if (filters.blur > 0) {
        activeFilters.push(Konva.Filters.Blur);
        imageNode.blurRadius(filters.blur);
    }

    // Apply special effects
    if (filters.sepia) activeFilters.push(Konva.Filters.Sepia);
    if (filters.invert) activeFilters.push(Konva.Filters.Invert);
    if (filters.grayscale) activeFilters.push(Konva.Filters.Grayscale);

    imageNode.filters(activeFilters);
    layer.batchDraw();
}
```

### Filter Reset

```typescript
function resetFilters() {
    // Reset filter values
    filters = {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        hue: 0,
        blur: 0,
        sepia: false,
        invert: false,
        grayscale: false
    };

    // Clear image filters
    imageNode.filters([]);
    imageNode.brightness(0);
    imageNode.contrast(0);
    imageNode.saturation(0);
    imageNode.hue(0);
    imageNode.blurRadius(0);
    
    // Update display
    layer.batchDraw();
}
```

### Value Formatting

```typescript
function formatValue(value: number, suffix: string = ''): string {
    return `${value.toFixed(2)}${suffix}`;
}
```

## Performance Optimization

### 1. Efficient Filter Application

```typescript
function optimizedFilterApplication() {
    // Batch filter operations
    stage.batchDraw(() => {
        // Apply all active filters at once
        const activeFilters = [];
        
        // Add only necessary filters
        Object.entries(filters).forEach(([type, value]) => {
            if (value !== 0 && value !== false) {
                activeFilters.push(getFilterForType(type));
            }
        });
        
        // Set filters in one operation
        imageNode.filters(activeFilters);
    });
}
```

### 2. Memory Management

```typescript
function cleanup() {
    // Remove all filters
    imageNode.filters([]);
    
    // Reset filter values
    resetFilters();
    
    // Clear cache
    imageNode.clearCache();
    
    // Update display
    layer.batchDraw();
}
```

## Error Handling

```typescript
function safeFilterApplication(filterType: string, value: number | boolean) {
    try {
        if (!imageNode || !layer) {
            throw new Error('Required elements not initialized');
        }
        
        // Validate filter type
        if (!Object.keys(filters).includes(filterType)) {
            throw new Error(`Invalid filter type: ${filterType}`);
        }
        
        // Validate filter value
        if (!isValidFilterValue(filterType, value)) {
            throw new Error(`Invalid value for filter: ${filterType}`);
        }
        
        applyFilter(filterType, value);
    } catch (error) {
        console.error('Filter application failed:', error);
        resetFilters();
    }
}
```

## Testing

```typescript
describe('FilterTool', () => {
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
    
    it('should apply brightness filter correctly', () => {
        // Test implementation
    });
    
    it('should handle multiple active filters', () => {
        // Test implementation
    });
    
    it('should reset filters properly', () => {
        // Test implementation
    });
});
```

## Integration Example

```typescript
// In parent component
import Filter from './Filter.svelte';

function handleFilterApplied(data: { filterType: string; value: number | boolean }) {
    // Update edit history
    imageEditorStore.addEditAction({
        undo: () => {
            // Restore previous filter state
        },
        redo: () => {
            // Reapply filter
        }
    });
}

// Template
<Filter
    {stage}
    {layer}
    {imageNode}
    on:filter={handleFilterApplied}
    on:resetFilters={handleReset}
    on:exitFilters={handleExit}
/>
```

## Best Practices

1. **Filter Application**
   - Apply filters in correct order
   - Use batch operations for performance
   - Cache filter results when possible

2. **Value Management**
   - Validate filter values
   - Normalize input ranges
   - Provide proper value formatting

3. **Performance**
   - Minimize filter reapplication
   - Use efficient filter combinations
   - Clear cache when needed

4. **Error Handling**
   - Validate all inputs
   - Provide fallback values
   - Handle filter conflicts
