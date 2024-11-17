# Image Editor

The SvelteCMS Image Editor provides a powerful set of tools for optimizing and editing images directly within the CMS. This document covers the editor's features, API, and integration options.

## Core Features

### Editor Configuration

```typescript
interface ImageEditorConfig {
    tools: ImageEditorTools[];
    theme: 'light' | 'dark' | 'auto';
    locale: string;
    maxHistoryStates: number;
    quality: number;
    format: 'original' | 'jpg' | 'png' | 'webp';
    preserveExif: boolean;
    maxDimensions: {
        width: number;
        height: number;
    };
}

interface ImageEditorTools {
    crop: boolean;
    resize: boolean;
    rotate: boolean;
    flip: boolean;
    adjust: boolean;
    filters: boolean;
    text: boolean;
    draw: boolean;
    shapes: boolean;
    watermark: boolean;
}
```

### Basic Operations

```typescript
interface ImageOperations {
    // Basic transformations
    crop: (options: CropOptions) => Promise<void>;
    resize: (dimensions: Dimensions) => Promise<void>;
    rotate: (degrees: number) => Promise<void>;
    flip: (direction: 'horizontal' | 'vertical') => Promise<void>;
    
    // Save and export
    save: (options?: SaveOptions) => Promise<Blob>;
    saveAs: (format: ImageFormat, options?: SaveOptions) => Promise<Blob>;
    
    // History management
    undo: () => void;
    redo: () => void;
    reset: () => void;
}

interface CropOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    aspectRatio?: number;
    lockAspectRatio?: boolean;
}

interface Dimensions {
    width: number;
    height: number;
    maintainAspectRatio?: boolean;
    scaleMethod?: 'fit' | 'fill' | 'stretch';
}
```

## Image Adjustments

### Color and Exposure

```typescript
interface ColorAdjustments {
    brightness: (value: number) => void;  // -100 to 100
    contrast: (value: number) => void;    // -100 to 100
    saturation: (value: number) => void;  // -100 to 100
    exposure: (value: number) => void;    // -100 to 100
    temperature: (value: number) => void; // -100 to 100
    tint: (value: number) => void;       // -100 to 100
    vibrance: (value: number) => void;   // -100 to 100
}

interface TonalAdjustments {
    highlights: (value: number) => void;  // -100 to 100
    shadows: (value: number) => void;     // -100 to 100
    whites: (value: number) => void;      // -100 to 100
    blacks: (value: number) => void;      // -100 to 100
    clarity: (value: number) => void;     // -100 to 100
}
```

### Filters and Effects

```typescript
interface ImageFilters {
    // Preset filters
    applyFilter: (filter: PresetFilter) => void;
    
    // Custom filters
    applyCustomFilter: (matrix: number[]) => void;
    
    // Common effects
    sharpen: (amount: number) => void;
    blur: (radius: number) => void;
    noise: (amount: number) => void;
    grain: (amount: number, size: number) => void;
    vignette: (size: number, strength: number) => void;
}

type PresetFilter = 
    | 'grayscale'
    | 'sepia'
    | 'vintage'
    | 'chrome'
    | 'fade'
    | 'punch'
    | 'dramatic'
    | 'noir';
```

## Advanced Features

### Text and Typography

```typescript
interface TextTool {
    addText: (options: TextOptions) => TextLayer;
    editText: (layerId: string, options: Partial<TextOptions>) => void;
    removeText: (layerId: string) => void;
}

interface TextOptions {
    text: string;
    font: string;
    size: number;
    color: string;
    position: {
        x: number;
        y: number;
    };
    rotation: number;
    opacity: number;
    style: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        letterSpacing?: number;
        lineHeight?: number;
    };
}
```

### Drawing and Shapes

```typescript
interface DrawingTool {
    startDrawing: (options: DrawOptions) => void;
    endDrawing: () => void;
    clear: () => void;
}

interface ShapeTool {
    addShape: (type: ShapeType, options: ShapeOptions) => ShapeLayer;
    editShape: (layerId: string, options: Partial<ShapeOptions>) => void;
    removeShape: (layerId: string) => void;
}

interface DrawOptions {
    tool: 'brush' | 'pencil' | 'eraser';
    color: string;
    size: number;
    opacity: number;
    smoothing: number;
}

type ShapeType = 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'polygon';

interface ShapeOptions {
    type: ShapeType;
    position: Point;
    size: Size;
    style: {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        opacity?: number;
    };
}
```

### Watermarking

```typescript
interface WatermarkTool {
    addWatermark: (options: WatermarkOptions) => WatermarkLayer;
    editWatermark: (layerId: string, options: Partial<WatermarkOptions>) => void;
    removeWatermark: (layerId: string) => void;
}

interface WatermarkOptions {
    type: 'text' | 'image';
    content: string;  // Text content or image URL
    position: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | Point;
    size: number;
    opacity: number;
    rotation: number;
    margin: number;
    tiled: boolean;
}
```

## Optimization

### Image Compression

```typescript
interface CompressionOptions {
    quality: number;       // 0 to 100
    format: ImageFormat;
    progressive: boolean;
    optimizeSizeOnly: boolean;
    maxFileSize?: number;  // in bytes
}

interface OptimizationResult {
    blob: Blob;
    size: number;
    compressionRatio: number;
    quality: number;
    format: ImageFormat;
}

// Example usage
async function optimizeImage(file: File, options: CompressionOptions): Promise<OptimizationResult> {
    const editor = new ImageEditor();
    await editor.loadImage(file);
    
    const result = await editor.optimize(options);
    return result;
}
```

### Batch Processing

```typescript
interface BatchProcessor {
    addTask: (task: ImageTask) => void;
    processAll: () => Promise<BatchResult[]>;
    cancel: () => void;
}

interface ImageTask {
    file: File;
    operations: ImageOperation[];
    output: OutputOptions;
}

interface BatchResult {
    file: File;
    success: boolean;
    result?: Blob;
    error?: Error;
    processingTime: number;
}
```

## Integration

### Editor Component

```svelte
<script lang="ts">
    import { ImageEditor } from '@sveltecms/media';
    
    export let file: File;
    export let config: ImageEditorConfig;
    
    let editor: ImageEditor;
    
    async function handleSave() {
        try {
            const result = await editor.save({
                format: 'webp',
                quality: 85
            });
            
            // Handle the edited image
            await uploadEditedImage(result);
        } catch (error) {
            console.error('Failed to save edited image:', error);
        }
    }
</script>

<ImageEditor
    bind:this={editor}
    {file}
    {config}
    on:save={handleSave}
/>
```

### Toolbar Customization

```typescript
interface ToolbarConfig {
    layout: 'horizontal' | 'vertical';
    position: 'top' | 'bottom' | 'left' | 'right';
    tools: ToolConfig[];
    groups: ToolGroup[];
}

interface ToolConfig {
    name: string;
    icon: string;
    action: () => void;
    tooltip?: string;
    shortcut?: string;
    group?: string;
}

interface ToolGroup {
    name: string;
    label: string;
    expanded?: boolean;
}
```

## Events

### Editor Events

```typescript
interface EditorEvents {
    load: CustomEvent<void>;
    save: CustomEvent<Blob>;
    change: CustomEvent<ChangeEvent>;
    error: CustomEvent<ErrorEvent>;
    undo: CustomEvent<void>;
    redo: CustomEvent<void>;
}

interface ChangeEvent {
    type: string;
    data: any;
    timestamp: number;
}

interface ErrorEvent {
    type: string;
    message: string;
    details?: any;
}
```

## Performance

### Memory Management

```typescript
interface MemoryOptions {
    maxHistoryStates: number;
    disposePreviousStates: boolean;
    maxCanvasSize: number;
    useOffscreenCanvas: boolean;
}

// Example implementation
class MemoryManager {
    private historyStates: ImageState[] = [];
    
    cleanup() {
        // Remove excess history states
        while (this.historyStates.length > this.maxHistoryStates) {
            const state = this.historyStates.shift();
            state.dispose();
        }
    }
    
    dispose() {
        // Clean up all resources
        this.historyStates.forEach(state => state.dispose());
        this.historyStates = [];
    }
}
```

### WebAssembly Integration

```typescript
interface WasmOptions {
    enabled: boolean;
    path: string;
    features: WasmFeature[];
}

type WasmFeature = 
    | 'resize'
    | 'filters'
    | 'compression'
    | 'colorAdjustments';

// Example usage
const editor = new ImageEditor({
    wasm: {
        enabled: true,
        path: '/wasm/image-editor.wasm',
        features: ['resize', 'compression']
    }
});
```

## Error Handling

```typescript
class ImageEditorError extends Error {
    constructor(
        message: string,
        public code: ErrorCode,
        public details?: any
    ) {
        super(message);
    }
}

enum ErrorCode {
    LOAD_FAILED = 'LOAD_FAILED',
    SAVE_FAILED = 'SAVE_FAILED',
    INVALID_OPERATION = 'INVALID_OPERATION',
    MEMORY_ERROR = 'MEMORY_ERROR',
    WASM_ERROR = 'WASM_ERROR'
}

function handleEditorError(error: ImageEditorError) {
    switch (error.code) {
        case ErrorCode.LOAD_FAILED:
            notify.error('Failed to load image');
            break;
        case ErrorCode.SAVE_FAILED:
            notify.error('Failed to save image');
            break;
        // Handle other error types
    }
}
```
