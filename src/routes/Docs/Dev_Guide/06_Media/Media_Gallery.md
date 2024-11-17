# Media Gallery

The SvelteCMS Media Gallery provides a powerful system for managing and organizing digital assets. This document covers the media gallery interface, features, and best practices.

## Overview

The media gallery is a centralized hub for managing all media assets within your CMS, supporting various file types including:

- Images (jpg, png, gif, webp, svg)
- Documents (pdf, doc, docx, xls, xlsx)
- Audio (mp3, wav, ogg)
- Video (mp4, webm, mov)
- Archives (zip, rar, 7z)

## Gallery Interface

### Main Components

```typescript
interface MediaGalleryProps {
    view: 'grid' | 'list';
    sortBy: 'name' | 'date' | 'size' | 'type';
    filterBy: {
        type?: string[];
        tags?: string[];
        date?: DateRange;
        size?: SizeRange;
    };
    selection: 'single' | 'multiple';
    onSelect: (files: MediaFile[]) => void;
}
```

### File Information

```typescript
interface MediaFile {
    id: string;
    name: string;
    path: string;
    type: string;
    size: number;
    created: Date;
    modified: Date;
    metadata: {
        width?: number;
        height?: number;
        duration?: number;
        format?: string;
        encoding?: string;
    };
    thumbnailUrl: string;
    previewUrl: string;
    downloadUrl: string;
    tags: string[];
    folder: string;
    permissions: MediaPermissions;
}
```

## Features

### File Operations

```typescript
interface MediaOperations {
    upload: (files: File[]) => Promise<MediaFile[]>;
    delete: (files: MediaFile[]) => Promise<void>;
    move: (files: MediaFile[], targetFolder: string) => Promise<void>;
    copy: (files: MediaFile[], targetFolder: string) => Promise<MediaFile[]>;
    rename: (file: MediaFile, newName: string) => Promise<MediaFile>;
    tag: (files: MediaFile[], tags: string[]) => Promise<void>;
}
```

### Batch Operations

```typescript
interface BatchOperations {
    selectAll: () => void;
    deselectAll: () => void;
    invertSelection: () => void;
    batchDelete: (files: MediaFile[]) => Promise<void>;
    batchMove: (files: MediaFile[], targetFolder: string) => Promise<void>;
    batchTag: (files: MediaFile[], tags: string[]) => Promise<void>;
}
```

### Search and Filter

```typescript
interface MediaSearch {
    query: string;
    filters: {
        type?: string[];
        tags?: string[];
        dateRange?: {
            start: Date;
            end: Date;
        };
        sizeRange?: {
            min: number;
            max: number;
        };
    };
    sort: {
        field: 'name' | 'date' | 'size' | 'type';
        direction: 'asc' | 'desc';
    };
}
```

### Image Editing

```typescript
interface ImageEditor {
    crop: (file: MediaFile, options: CropOptions) => Promise<MediaFile>;
    resize: (file: MediaFile, dimensions: Dimensions) => Promise<MediaFile>;
    rotate: (file: MediaFile, degrees: number) => Promise<MediaFile>;
    flip: (file: MediaFile, direction: 'horizontal' | 'vertical') => Promise<MediaFile>;
    adjust: (file: MediaFile, adjustments: ImageAdjustments) => Promise<MediaFile>;
}

interface ImageAdjustments {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    exposure?: number;
    sharpness?: number;
}
```

## Usage Examples

### Basic Gallery Implementation

```svelte
<script lang="ts">
    import { MediaGallery } from '@sveltecms/media';
    
    let selectedFiles: MediaFile[] = [];
    
    function handleSelect(files: MediaFile[]) {
        selectedFiles = files;
    }
</script>

<MediaGallery
    view="grid"
    sortBy="date"
    filterBy={{
        type: ['image/*', 'video/*']
    }}
    selection="multiple"
    onSelect={handleSelect}
/>
```

### Custom Gallery Actions

```svelte
<script lang="ts">
    import { MediaGallery, mediaStore } from '@sveltecms/media';
    
    async function handleUpload(event: Event) {
        const files = (event.target as HTMLInputElement).files;
        if (files) {
            await mediaStore.upload(Array.from(files));
        }
    }
    
    async function handleDelete(files: MediaFile[]) {
        if (confirm(`Delete ${files.length} files?`)) {
            await mediaStore.delete(files);
        }
    }
</script>

<div class="gallery-container">
    <div class="gallery-actions">
        <input
            type="file"
            multiple
            on:change={handleUpload}
        />
        <button
            on:click={() => handleDelete(selectedFiles)}
            disabled={!selectedFiles.length}
        >
            Delete Selected
        </button>
    </div>
    
    <MediaGallery
        view="grid"
        selection="multiple"
        onSelect={(files) => selectedFiles = files}
    />
</div>
```

## Events

### Gallery Events

```typescript
interface GalleryEvents {
    select: CustomEvent<MediaFile[]>;
    upload: CustomEvent<MediaFile[]>;
    delete: CustomEvent<MediaFile[]>;
    move: CustomEvent<{files: MediaFile[], targetFolder: string}>;
    rename: CustomEvent<{file: MediaFile, newName: string}>;
    tag: CustomEvent<{files: MediaFile[], tags: string[]}>;
}
```

### File Events

```typescript
interface FileEvents {
    click: MouseEvent;
    dblclick: MouseEvent;
    contextmenu: MouseEvent;
    dragstart: DragEvent;
    dragend: DragEvent;
    drop: DragEvent;
}
```

## Styling

### CSS Variables

```css
:root {
    /* Gallery Layout */
    --gallery-padding: 1rem;
    --gallery-gap: 1rem;
    --gallery-columns: 4;
    
    /* Thumbnail Sizes */
    --thumbnail-width: 150px;
    --thumbnail-height: 150px;
    
    /* Colors */
    --gallery-bg: #ffffff;
    --thumbnail-bg: #f5f5f5;
    --selected-color: #007bff;
    --hover-color: rgba(0, 123, 255, 0.1);
    
    /* Typography */
    --filename-font-size: 0.875rem;
    --metadata-font-size: 0.75rem;
}
```

### Custom Styling

```scss
.media-gallery {
    display: grid;
    grid-template-columns: repeat(var(--gallery-columns), 1fr);
    gap: var(--gallery-gap);
    padding: var(--gallery-padding);
    background: var(--gallery-bg);
    
    .media-item {
        position: relative;
        aspect-ratio: 1;
        background: var(--thumbnail-bg);
        border-radius: 4px;
        overflow: hidden;
        
        &.selected {
            outline: 2px solid var(--selected-color);
        }
        
        &:hover {
            background: var(--hover-color);
        }
        
        .thumbnail {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .filename {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0.5rem;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: var(--filename-font-size);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Space | Toggle selection |
| Ctrl + A | Select all |
| Ctrl + D | Deselect all |
| Delete | Delete selected |
| F2 | Rename selected |
| Ctrl + C | Copy selected |
| Ctrl + X | Cut selected |
| Ctrl + V | Paste |
| Ctrl + F | Focus search |
| Esc | Clear selection |

## Performance Optimization

### Lazy Loading

```typescript
interface LazyLoadOptions {
    threshold: number;
    rootMargin: string;
    placeholder: string;
    errorPlaceholder: string;
}

const defaultOptions: LazyLoadOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    placeholder: '/assets/placeholder.svg',
    errorPlaceholder: '/assets/error.svg'
};
```

### Virtual Scrolling

```typescript
interface VirtualScrollOptions {
    itemHeight: number;
    overscan: number;
    threshold: number;
}

const defaultOptions: VirtualScrollOptions = {
    itemHeight: 150,
    overscan: 5,
    threshold: 250
};
```

## Error Handling

### Upload Errors

```typescript
interface UploadError {
    type: 'size' | 'type' | 'permission' | 'network';
    message: string;
    file: File;
    details?: any;
}

function handleUploadError(error: UploadError) {
    switch (error.type) {
        case 'size':
            notify.error(`File ${error.file.name} exceeds size limit`);
            break;
        case 'type':
            notify.error(`File type not allowed: ${error.file.type}`);
            break;
        case 'permission':
            notify.error('Permission denied');
            break;
        case 'network':
            notify.error('Network error, please try again');
            break;
    }
}
```

### File Operation Errors

```typescript
interface FileOperationError {
    type: 'delete' | 'move' | 'copy' | 'rename';
    message: string;
    files: MediaFile[];
    details?: any;
}

function handleFileError(error: FileOperationError) {
    notify.error(`Failed to ${error.type} files: ${error.message}`);
    console.error('File operation error:', error);
}
```

## Accessibility

### ARIA Attributes

```typescript
interface MediaGalleryA11y {
    role: 'grid';
    'aria-multiselectable': boolean;
    'aria-label': string;
    'aria-description'?: string;
}

interface MediaItemA11y {
    role: 'gridcell';
    'aria-selected': boolean;
    'aria-label': string;
    'aria-describedby': string;
}
```

### Keyboard Navigation

```typescript
interface KeyboardNavigation {
    enabled: boolean;
    focusable: boolean;
    selectOnFocus: boolean;
    wrap: boolean;
}

const defaultNavigation: KeyboardNavigation = {
    enabled: true,
    focusable: true,
    selectOnFocus: false,
    wrap: true
};
```
