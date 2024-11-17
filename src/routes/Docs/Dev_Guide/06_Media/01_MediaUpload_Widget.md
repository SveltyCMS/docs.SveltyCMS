# Media Upload Widget

SvelteCMS provides a powerful media upload widget that supports images, videos, and remote media with advanced features like watermarking, format conversion, and size optimization.

## Configuration

### Media Upload Settings

```typescript
interface MediaUploadConfig {
    // Upload settings
    upload: {
        maxFileSize: number;        // Maximum file size in bytes
        allowedTypes: string[];     // Allowed MIME types
        maxConcurrent: number;      // Max concurrent uploads
        chunkSize: number;         // Upload chunk size
        storageProvider: string;   // Storage provider configuration
    };
    
    // Image settings
    image: {
        // Format settings
        formats: {
            allowed: string[];      // Allowed formats (jpg, png, webp, etc.)
            preferredFormat: string; // Default output format
            quality: number;        // Output quality (0-100)
            preserveAnimation: boolean; // Keep GIF/APNG animation
        };
        
        // Size settings
        sizes: {
            maxWidth: number;
            maxHeight: number;
            minWidth: number;
            minHeight: number;
            aspectRatio?: number;
            resizeMode: 'contain' | 'cover' | 'fill';
        };
        
        // Watermark settings
        watermark: {
            enabled: boolean;
            image: string;         // Watermark image path
            position: 'center' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
            opacity: number;       // Watermark opacity (0-1)
            margin: number;        // Margin from edges
            scale: number;         // Scale relative to image
            tiled: boolean;        // Repeat watermark
        };
        
        // Optimization
        optimization: {
            compress: boolean;     // Enable compression
            stripMetadata: boolean; // Remove EXIF data
            lazy: boolean;         // Generate sizes on-demand
        };
    };
    
    // Video settings
    video: {
        // Format settings
        formats: {
            allowed: string[];     // Allowed formats
            preferredFormat: string; // Default output format
            quality: string;       // Output quality preset
        };
        
        // Size settings
        sizes: {
            maxWidth: number;
            maxHeight: number;
            maxDuration: number;   // Maximum duration in seconds
            maxBitrate: number;    // Maximum bitrate
        };
        
        // Thumbnail settings
        thumbnail: {
            generate: boolean;     // Generate thumbnail
            time: number;         // Timestamp for thumbnail
            width: number;        // Thumbnail width
            height: number;       // Thumbnail height
        };
    };
    
    // Remote media
    remote: {
        enabled: boolean;         // Allow remote media
        providers: string[];      // Allowed providers (youtube, vimeo, etc.)
        proxy: boolean;          // Proxy remote content
        cache: boolean;          // Cache remote content
        validateUrls: boolean;   // Validate remote URLs
    };
}
```

### Implementation Example

```typescript
// widgets/mediaUpload.ts
export const mediaUploadWidget: Widget = {
    name: 'mediaUpload',
    config: {
        upload: {
            maxFileSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: ['image/*', 'video/*'],
            maxConcurrent: 3,
            chunkSize: 1024 * 1024, // 1MB chunks
            storageProvider: 'local'
        },
        
        image: {
            formats: {
                allowed: ['jpg', 'png', 'webp', 'gif'],
                preferredFormat: 'webp',
                quality: 85,
                preserveAnimation: true
            },
            sizes: {
                maxWidth: 2000,
                maxHeight: 2000,
                minWidth: 100,
                minHeight: 100,
                resizeMode: 'contain'
            },
            watermark: {
                enabled: true,
                image: '/assets/watermark.png',
                position: 'bottomRight',
                opacity: 0.5,
                margin: 20,
                scale: 0.2,
                tiled: false
            },
            optimization: {
                compress: true,
                stripMetadata: true,
                lazy: true
            }
        },
        
        video: {
            formats: {
                allowed: ['mp4', 'webm'],
                preferredFormat: 'mp4',
                quality: 'high'
            },
            sizes: {
                maxWidth: 1920,
                maxHeight: 1080,
                maxDuration: 300,
                maxBitrate: 5000000
            },
            thumbnail: {
                generate: true,
                time: 0,
                width: 640,
                height: 360
            }
        },
        
        remote: {
            enabled: true,
            providers: ['youtube', 'vimeo'],
            proxy: true,
            cache: true,
            validateUrls: true
        }
    }
};
```

## Media Upload Component

### Upload Widget

```svelte
<!-- components/media/MediaUpload.svelte -->
<script lang="ts">
    import { MediaUploader } from '$lib/media/uploader';
    import { MediaGallery } from '$lib/media/gallery';
    import { ImageEditor } from '$lib/media/editor';
    
    export let config: MediaUploadConfig;
    export let value: string | string[] = [];
    export let multiple = false;
    
    let uploader: MediaUploader;
    let showGallery = false;
    let showEditor = false;
    let selectedMedia: Media | null = null;
    
    onMount(() => {
        uploader = new MediaUploader(config);
    });
    
    async function handleFileSelect(files: FileList) {
        const uploads = Array.from(files).map(file => 
            uploader.upload(file)
        );
        
        const results = await Promise.all(uploads);
        value = multiple ? [...value, ...results] : results[0];
    }
    
    async function handleGallerySelect(media: Media[]) {
        value = multiple ? [...value, ...media] : media[0];
        showGallery = false;
    }
    
    async function handleEdit(media: Media) {
        selectedMedia = media;
        showEditor = true;
    }
</script>

<div class="media-upload">
    <!-- Upload area -->
    <div 
        class="upload-area"
        on:dragover|preventDefault
        on:drop|preventDefault={e => handleFileSelect(e.dataTransfer.files)}
    >
        <input 
            type="file" 
            accept={config.upload.allowedTypes.join(',')}
            multiple={multiple}
            on:change={e => handleFileSelect(e.target.files)}
        />
        
        <div class="upload-message">
            Drag files here or click to upload
        </div>
    </div>
    
    <!-- Media preview -->
    {#if value}
        <div class="media-preview">
            {#each (Array.isArray(value) ? value : [value]) as media}
                <div class="media-item">
                    <MediaPreview {media} />
                    
                    <div class="media-actions">
                        <button on:click={() => handleEdit(media)}>
                            Edit
                        </button>
                        <button on:click={() => handleRemove(media)}>
                            Remove
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
    
    <!-- Gallery button -->
    <button on:click={() => showGallery = true}>
        Choose from Gallery
    </button>
    
    <!-- Media gallery modal -->
    {#if showGallery}
        <Modal on:close={() => showGallery = false}>
            <MediaGallery
                {config}
                multiple={multiple}
                on:select={handleGallerySelect}
            />
        </Modal>
    {/if}
    
    <!-- Image editor modal -->
    {#if showEditor && selectedMedia}
        <Modal on:close={() => showEditor = false}>
            <ImageEditor
                media={selectedMedia}
                on:save={handleEditorSave}
                on:cancel={() => showEditor = false}
            />
        </Modal>
    {/if}
</div>

<style>
    .media-upload {
        display: grid;
        gap: 1rem;
    }
    
    .upload-area {
        border: 2px dashed var(--color-border);
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        cursor: pointer;
    }
    
    .media-preview {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .media-item {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .media-actions {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        gap: 0.5rem;
    }
</style>
```

## Media Gallery Integration

### Gallery Component

```svelte
<!-- components/media/MediaGallery.svelte -->
<script lang="ts">
    import { MediaService } from '$lib/media/service';
    import type { Media } from '$lib/types';
    
    export let config: MediaUploadConfig;
    export let multiple = false;
    
    let media: Media[] = [];
    let selected: Set<string> = new Set();
    let loading = true;
    let error: string | null = null;
    
    const mediaService = new MediaService(config);
    
    onMount(async () => {
        try {
            media = await mediaService.list();
            loading = false;
        } catch (e) {
            error = e.message;
            loading = false;
        }
    });
    
    function handleSelect(mediaItem: Media) {
        if (multiple) {
            if (selected.has(mediaItem.id)) {
                selected.delete(mediaItem.id);
            } else {
                selected.add(mediaItem.id);
            }
        } else {
            dispatch('select', [mediaItem]);
        }
    }
    
    function handleConfirm() {
        const selectedMedia = media.filter(m => 
            selected.has(m.id)
        );
        dispatch('select', selectedMedia);
    }
</script>

<div class="media-gallery">
    <!-- Gallery toolbar -->
    <div class="toolbar">
        <input 
            type="text" 
            placeholder="Search media..."
            bind:value={searchQuery}
        />
        
        <select bind:value={filterType}>
            <option value="all">All Media</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="remote">Remote Media</option>
        </select>
    </div>
    
    <!-- Media grid -->
    {#if loading}
        <div class="loading">Loading media...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else}
        <div class="media-grid">
            {#each media as item}
                <div 
                    class="media-item"
                    class:selected={selected.has(item.id)}
                    on:click={() => handleSelect(item)}
                >
                    <MediaPreview media={item} />
                    <div class="media-info">
                        <div class="name">{item.name}</div>
                        <div class="size">{formatSize(item.size)}</div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
    
    <!-- Selection actions -->
    {#if multiple && selected.size > 0}
        <div class="actions">
            <button on:click={handleConfirm}>
                Select {selected.size} items
            </button>
        </div>
    {/if}
</div>

<style>
    .media-gallery {
        display: grid;
        gap: 1rem;
        height: 100%;
    }
    
    .toolbar {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
    }
    
    .media-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
        padding: 1rem;
        overflow-y: auto;
    }
    
    .media-item {
        cursor: pointer;
        border-radius: 4px;
        overflow: hidden;
        border: 2px solid transparent;
    }
    
    .media-item.selected {
        border-color: var(--color-primary);
    }
    
    .media-info {
        padding: 0.5rem;
        background: var(--color-surface);
    }
</style>
```

## Image Editor Integration

The media upload widget integrates with the image editor component for advanced image editing capabilities. See [Image Editor Documentation](./02_Image_Editor.md) for details on:

- Basic adjustments (brightness, contrast, saturation)
- Filters and effects
- Cropping and rotation
- Text and overlays
- Drawing tools
- Export options

## Authentication and Authorization

### Media Access Control

```typescript
// lib/media/auth.ts
export class MediaAccessControl {
    async checkAccess(
        user: User,
        media: Media,
        action: 'read' | 'write' | 'delete'
    ): Promise<boolean> {
        // Check user permissions
        const hasPermission = await checkPermission(user, `media.${action}`);
        if (!hasPermission) return false;
        
        // Check media ownership
        if (media.ownerId === user.id) return true;
        
        // Check shared access
        const sharedAccess = await getSharedAccess(media, user);
        if (sharedAccess?.[action]) return true;
        
        // Check public access
        if (action === 'read' && media.public) return true;
        
        return false;
    }
    
    async setAccess(
        media: Media,
        access: MediaAccess
    ): Promise<void> {
        // Validate access settings
        validateAccess(access);
        
        // Update access settings
        await updateMediaAccess(media.id, access);
        
        // Log access change
        await logAccessChange(media, access);
    }
}
```

## Best Practices

1. **Upload Configuration**:
   - Set appropriate file size limits
   - Configure allowed formats
   - Enable optimization features
   - Configure watermarking

2. **Performance**:
   - Use chunked uploads
   - Enable lazy processing
   - Configure caching
   - Optimize storage

3. **Security**:
   - Validate file types
   - Scan for malware
   - Control access permissions
   - Protect private media

4. **User Experience**:
   - Show upload progress
   - Provide preview capabilities
   - Enable drag-and-drop
   - Support bulk operations

5. **Media Management**:
   - Organize media effectively
   - Enable easy searching
   - Provide filtering options
   - Support batch operations
