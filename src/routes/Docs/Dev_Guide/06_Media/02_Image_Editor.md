# Image Editor

SvelteCMS includes a powerful image editor component that provides advanced editing capabilities for uploaded media.

## Editor Features

### Basic Adjustments

```typescript
interface ImageAdjustments {
    // Basic adjustments
    brightness: number;     // -100 to 100
    contrast: number;      // -100 to 100
    saturation: number;    // -100 to 100
    exposure: number;      // -100 to 100
    temperature: number;   // -100 to 100
    tint: number;         // -100 to 100
    
    // Color adjustments
    vibrance: number;      // -100 to 100
    highlights: number;    // -100 to 100
    shadows: number;       // -100 to 100
    whites: number;       // -100 to 100
    blacks: number;       // -100 to 100
    
    // Advanced adjustments
    clarity: number;       // -100 to 100
    sharpness: number;    // 0 to 100
    noise: number;        // 0 to 100
    vignette: number;     // 0 to 100
}
```

### Filters and Effects

```typescript
interface ImageFilters {
    // Preset filters
    filter: string;       // Filter name
    intensity: number;    // 0 to 100
    
    // Color effects
    grayscale: boolean;
    sepia: boolean;
    invert: boolean;
    
    // Blur effects
    blur: number;        // 0 to 100
    gaussianBlur: number; // 0 to 100
    motionBlur: number;  // 0 to 100
    
    // Artistic effects
    grain: number;       // 0 to 100
    pixelate: number;    // 0 to 100
    posterize: number;   // 2 to 20
}
```

### Transform Operations

```typescript
interface ImageTransform {
    // Basic transforms
    rotate: number;      // Rotation angle in degrees
    flipX: boolean;     // Horizontal flip
    flipY: boolean;     // Vertical flip
    
    // Crop settings
    crop: {
        x: number;      // Crop start X
        y: number;      // Crop start Y
        width: number;  // Crop width
        height: number; // Crop height
        aspect: number; // Aspect ratio
    };
    
    // Resize settings
    resize: {
        width: number;
        height: number;
        mode: 'contain' | 'cover' | 'fill';
    };
}
```

### Drawing Tools

```typescript
interface DrawingTools {
    // Brush settings
    brush: {
        size: number;
        hardness: number;
        opacity: number;
        color: string;
        blend: BlendMode;
    };
    
    // Eraser settings
    eraser: {
        size: number;
        hardness: number;
        opacity: number;
    };
    
    // Shape tools
    shapes: {
        type: 'rectangle' | 'ellipse' | 'line' | 'polygon';
        fill: string;
        stroke: string;
        strokeWidth: number;
    };
}
```

## Editor Component

### Image Editor Implementation

```svelte
<!-- components/media/ImageEditor.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { ImageProcessor } from '$lib/media/processor';
    import type { Media } from '$lib/types';
    
    export let media: Media;
    
    const dispatch = createEventDispatcher();
    const processor = new ImageProcessor();
    
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let history: ImageState[] = [];
    let currentState = 0;
    
    // Editor state
    let adjustments: ImageAdjustments = defaultAdjustments();
    let filters: ImageFilters = defaultFilters();
    let transform: ImageTransform = defaultTransform();
    let drawing: DrawingTools = defaultDrawingTools();
    
    onMount(async () => {
        // Initialize canvas
        ctx = canvas.getContext('2d');
        
        // Load image
        await loadImage(media.url);
        
        // Initialize history
        saveState();
    });
    
    async function loadImage(url: string) {
        const image = new Image();
        image.src = url;
        await image.decode();
        
        // Set canvas size
        canvas.width = image.width;
        canvas.height = image.height;
        
        // Draw image
        ctx.drawImage(image, 0, 0);
    }
    
    function saveState() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        history = [...history.slice(0, currentState + 1), imageData];
        currentState = history.length - 1;
    }
    
    function undo() {
        if (currentState > 0) {
            currentState--;
            ctx.putImageData(history[currentState], 0, 0);
        }
    }
    
    function redo() {
        if (currentState < history.length - 1) {
            currentState++;
            ctx.putImageData(history[currentState], 0, 0);
        }
    }
    
    async function applyAdjustments() {
        // Apply image adjustments
        await processor.applyAdjustments(canvas, adjustments);
        saveState();
    }
    
    async function applyFilter(filter: string) {
        // Apply selected filter
        await processor.applyFilter(canvas, filter, filters.intensity);
        saveState();
    }
    
    async function applyTransform() {
        // Apply transformation
        await processor.applyTransform(canvas, transform);
        saveState();
    }
    
    async function handleSave() {
        // Get final image data
        const blob = await new Promise<Blob>(resolve => {
            canvas.toBlob(blob => resolve(blob), 'image/png');
        });
        
        // Create new media object
        const updated = await createMedia(blob, {
            ...media,
            processed: true
        });
        
        dispatch('save', updated);
    }
</script>

<div class="image-editor">
    <!-- Toolbar -->
    <div class="toolbar">
        <button on:click={undo} disabled={currentState === 0}>
            Undo
        </button>
        <button on:click={redo} disabled={currentState === history.length - 1}>
            Redo
        </button>
        
        <div class="spacer"></div>
        
        <button on:click={handleSave}>Save</button>
        <button on:click={() => dispatch('cancel')}>Cancel</button>
    </div>
    
    <!-- Editor layout -->
    <div class="editor-layout">
        <!-- Canvas area -->
        <div class="canvas-area">
            <canvas 
                bind:this={canvas}
                on:mousedown={handleDrawStart}
                on:mousemove={handleDrawMove}
                on:mouseup={handleDrawEnd}
            ></canvas>
        </div>
        
        <!-- Control panels -->
        <div class="controls">
            <!-- Adjustment panel -->
            <div class="panel">
                <h3>Adjustments</h3>
                {#each Object.entries(adjustments) as [name, value]}
                    <label>
                        {name}
                        <input 
                            type="range"
                            min="-100"
                            max="100"
                            bind:value
                            on:change={applyAdjustments}
                        />
                    </label>
                {/each}
            </div>
            
            <!-- Filters panel -->
            <div class="panel">
                <h3>Filters</h3>
                <div class="filter-grid">
                    {#each availableFilters as filter}
                        <button
                            class:active={filters.filter === filter}
                            on:click={() => applyFilter(filter)}
                        >
                            {filter}
                        </button>
                    {/each}
                </div>
            </div>
            
            <!-- Transform panel -->
            <div class="panel">
                <h3>Transform</h3>
                <button on:click={() => transform.rotate -= 90}>
                    Rotate Left
                </button>
                <button on:click={() => transform.rotate += 90}>
                    Rotate Right
                </button>
                <button on:click={() => transform.flipX = !transform.flipX}>
                    Flip Horizontal
                </button>
                <button on:click={() => transform.flipY = !transform.flipY}>
                    Flip Vertical
                </button>
            </div>
            
            <!-- Drawing panel -->
            <div class="panel">
                <h3>Drawing</h3>
                <label>
                    Brush Size
                    <input 
                        type="range"
                        min="1"
                        max="100"
                        bind:value={drawing.brush.size}
                    />
                </label>
                <label>
                    Color
                    <input 
                        type="color"
                        bind:value={drawing.brush.color}
                    />
                </label>
            </div>
        </div>
    </div>
</div>

<style>
    .image-editor {
        display: grid;
        grid-template-rows: auto 1fr;
        height: 100%;
        background: var(--color-surface-dark);
    }
    
    .toolbar {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
    }
    
    .editor-layout {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
        padding: 1rem;
        overflow: hidden;
    }
    
    .canvas-area {
        overflow: auto;
        background: var(--color-surface-darker);
        border-radius: 4px;
    }
    
    .controls {
        width: 300px;
        display: grid;
        gap: 1rem;
        overflow-y: auto;
    }
    
    .panel {
        background: var(--color-surface);
        border-radius: 4px;
        padding: 1rem;
    }
    
    .filter-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 0.5rem;
    }
</style>
```

## Integration with Media Upload

### Editor Launch

```typescript
// components/media/MediaUpload.svelte
async function handleEdit(media: Media) {
    selectedMedia = media;
    showEditor = true;
}

async function handleEditorSave(event: CustomEvent<Media>) {
    const updated = event.detail;
    
    // Update media in list
    value = Array.isArray(value)
        ? value.map(m => m.id === updated.id ? updated : m)
        : updated;
    
    showEditor = false;
}
```

## Export Options

### Export Configuration

```typescript
interface ExportConfig {
    // Format settings
    format: 'png' | 'jpeg' | 'webp';
    quality: number;        // 0 to 100
    
    // Size settings
    maxWidth?: number;
    maxHeight?: number;
    preserveAspectRatio: boolean;
    
    // Output settings
    stripMetadata: boolean;
    optimizeOutput: boolean;
    
    // Additional options
    watermark?: {
        enabled: boolean;
        image: string;
        position: string;
        opacity: number;
    };
    
    // Processing
    processingOptions: {
        workers: number;
        batch: boolean;
        priority: number;
    };
}
```

## Best Practices

1. **Performance**:
   - Use WebGL for processing when available
   - Implement efficient undo/redo
   - Optimize canvas operations
   - Use web workers for processing

2. **User Experience**:
   - Provide real-time previews
   - Implement smooth interactions
   - Show processing progress
   - Support keyboard shortcuts

3. **Image Quality**:
   - Preserve image quality
   - Handle color spaces correctly
   - Support high DPI displays
   - Optimize output formats

4. **Memory Management**:
   - Limit history stack size
   - Clean up resources properly
   - Handle large images efficiently
   - Implement progressive loading

5. **Integration**:
   - Seamless media library integration
   - Support batch processing
   - Enable preset management
   - Provide export options
