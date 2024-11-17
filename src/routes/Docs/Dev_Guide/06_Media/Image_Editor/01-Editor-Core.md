---
title: "Image Editor - Developer Guide"
description: "Technical documentation for SvelteCMS Image Editor implementation"
---

# Image Editor Developer Guide

Technical documentation for implementing and extending the SvelteCMS Image Editor.

## Architecture Overview

### Directory Structure

```typescript
src/routes/(app)/imageEditor/
├── +page.svelte           # Main editor component
├── +page.server.ts        # Server-side logic
├── Blur.svelte           # Blur tool component
├── Crop.svelte          # Crop tool component
├── Filter.svelte        # Filter effects component
├── FocalPoint.svelte    # Focal point tool
├── Rotate.svelte        # Rotation tool
├── ShapeOverlay.svelte  # Shape overlay tool
├── TextOverlay.svelte   # Text overlay tool
├── Watermark.svelte     # Watermark tool
└── Zoom.svelte          # Zoom tool component
```

### Core Technologies

- **Svelte/SvelteKit**: Frontend framework
- **Konva.js**: Canvas manipulation
- **TypeScript**: Type safety and developer experience
- **WebGL**: Hardware-accelerated rendering (when available)

## Component Architecture

### Main Editor Component

```typescript
// +page.svelte
interface ImageEditor {
  // Core Properties
  imageFile: File | null;
  stage: Konva.Stage;
  layer: Konva.Layer;
  imageNode: Konva.Image;
  
  // State Management
  activeState: string;
  stateHistory: string[];
  currentStateIndex: number;
  
  // UI State
  canUndo: boolean;
  canRedo: boolean;
  isLoading: boolean;
}
```

### Tool Component Template

```typescript
// Template for tool components
interface ToolComponent {
  // Required Props
  stage: Konva.Stage;
  layer: Konva.Layer;
  imageNode: Konva.Image;
  active: boolean;
  
  // Optional Props
  settings?: ToolSettings;
  onUpdate?: (state: any) => void;
  
  // Internal State
  private transformer?: Konva.Transformer;
  private activeShape?: Konva.Shape;
}
```

## Core Functionality

### Image Loading System

```typescript
// Image loading and initialization
async function initializeImage(file: File): Promise<void> {
  const url = URL.createObjectURL(file);
  const image = await loadImage(url);
  
  imageNode = new Konva.Image({
    image,
    width: image.width,
    height: image.height,
    draggable: false
  });
  
  layer.add(imageNode);
  stage.add(layer);
  
  // Clean up
  URL.revokeObjectURL(url);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
```

### State Management

```typescript
// History management
interface EditorState {
  stageConfig: string;
  activeToolState: any;
  timestamp: number;
}

class StateManager {
  private states: EditorState[] = [];
  private currentIndex = -1;
  
  pushState(state: EditorState): void {
    this.states = [
      ...this.states.slice(0, this.currentIndex + 1),
      state
    ];
    this.currentIndex++;
  }
  
  undo(): EditorState | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.states[this.currentIndex];
    }
    return null;
  }
  
  redo(): EditorState | null {
    if (this.currentIndex < this.states.length - 1) {
      this.currentIndex++;
      return this.states[this.currentIndex];
    }
    return null;
  }
}
```

## Tool Implementation Guide

### Creating a New Tool

1. **Create Component File**
```typescript
// NewTool.svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Konva from 'konva';
  
  export let stage: Konva.Stage;
  export let layer: Konva.Layer;
  export let active = false;
  
  let tool: Konva.Shape;
  
  onMount(() => {
    if (active) {
      initializeTool();
    }
  });
  
  onDestroy(() => {
    cleanup();
  });
  
  function initializeTool() {
    // Tool initialization logic
  }
  
  function cleanup() {
    // Cleanup logic
  }
</script>
```

2. **Register Tool**
```typescript
// +page.svelte
import NewTool from './NewTool.svelte';

const tools = {
  // ... existing tools
  newTool: {
    component: NewTool,
    icon: 'tool-icon',
    label: 'New Tool'
  }
};
```

### Tool Integration Best Practices

1. **State Management**
   - Use Svelte stores for tool-specific state
   - Implement undo/redo support
   - Clean up resources on deactivation

2. **Performance**
   - Use layer caching when appropriate
   - Implement debouncing for intensive operations
   - Optimize canvas redraws

3. **Error Handling**
   - Graceful degradation
   - User feedback
   - Error recovery

## Event System

### Custom Events

```typescript
// events.ts
interface EditorEvent {
  type: string;
  payload: any;
}

class EditorEventSystem {
  private listeners: Map<string, Function[]> = new Map();
  
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }
  
  emit(event: string, payload: any): void {
    this.listeners.get(event)?.forEach(callback => {
      callback(payload);
    });
  }
}
```

### Event Usage

```typescript
// Tool implementation
editorEvents.on('tool:activated', (toolName: string) => {
  if (toolName === currentTool) {
    initializeTool();
  }
});

editorEvents.on('image:loaded', (image: HTMLImageElement) => {
  resetToolState();
});
```

## Server Integration

### Image Processing

```typescript
// +page.server.ts
interface ProcessingOptions {
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  maxWidth?: number;
  maxHeight?: number;
}

async function processImage(
  file: File,
  options: ProcessingOptions
): Promise<Blob> {
  // Image processing implementation
}
```

### Save Operations

```typescript
// +page.server.ts
async function saveImage(
  imageData: string,
  metadata: ImageMetadata
): Promise<SaveResult> {
  try {
    const blob = await fetch(imageData).then(r => r.blob());
    const optimizedImage = await processImage(blob, {
      quality: 90,
      format: 'webp'
    });
    
    return await uploadToStorage(optimizedImage, metadata);
  } catch (error) {
    handleError(error);
  }
}
```

## Testing

### Unit Tests

```typescript
// ImageEditor.test.ts
import { render } from '@testing-library/svelte';
import ImageEditor from './ImageEditor.svelte';

describe('ImageEditor', () => {
  test('loads image correctly', async () => {
    const { component } = render(ImageEditor);
    // Test implementation
  });
  
  test('applies tool changes', async () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// editor.test.ts
describe('Editor Integration', () => {
  test('full edit workflow', async () => {
    // Test implementation
  });
});
```

## Performance Optimization

### Canvas Optimization

1. **Layer Management**
   - Use multiple layers for complex operations
   - Cache static layers
   - Implement layer pooling

2. **Render Optimization**
   - Batch shape updates
   - Use requestAnimationFrame
   - Implement dirty region tracking

### Memory Management

1. **Resource Cleanup**
   - Dispose unused Konva nodes
   - Clean up event listeners
   - Release image resources

2. **Cache Management**
   - Implement LRU cache for history
   - Clear unused cache entries
   - Monitor memory usage

## Security Considerations

1. **Input Validation**
   - Validate file types
   - Check file sizes
   - Sanitize metadata

2. **Output Sanitization**
   - Clean metadata
   - Validate export formats
   - Secure file handling

## Next Steps

- [Tool-Specific Documentation](./03-Tool-Development.md)
- [API Reference](./04-API-Reference.md)
- [Testing Guide](./05-Testing-Guide.md)
- [Performance Guide](./06-Performance-Guide.md)
