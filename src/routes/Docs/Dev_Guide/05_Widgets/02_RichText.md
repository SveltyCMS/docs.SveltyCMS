---
title: "RichText Widget"
description: "Technical documentation for the RichText widget"
icon: "mdi:text"
published: true
order: 2
---

# RichText Widget

The RichText widget provides a full-featured WYSIWYG editor based on TipTap. This document covers the technical implementation and customization of the RichText widget.

## Architecture

### Core Components

```typescript
interface RichTextConfig {
    // Editor configuration
    placeholder?: string;
    autofocus?: boolean;
    editable?: boolean;
    
    // Toolbar configuration
    toolbar?: string[];
    customButtons?: Record<string, ToolbarButton>;
    
    // Content configuration
    allowedTags?: string[];
    maxLength?: number;
    
    // Image handling
    imageUpload?: {
        endpoint: string;
        maxSize: number;
        allowedTypes: string[];
    };
}

interface ToolbarButton {
    icon: string;
    label: string;
    action: (editor: Editor) => void;
    isActive?: (editor: Editor) => boolean;
}
```

### Extensions

The RichText widget uses TipTap extensions for functionality:

```typescript
// Image resize extension
export const ImageResize = Extension.create({
    name: 'imageResize',
    
    addAttributes() {
        return {
            width: {
                default: '100%',
                renderHTML: (attributes) => ({
                    width: attributes.width,
                }),
            },
            height: {
                default: 'auto',
                renderHTML: (attributes) => ({
                    height: attributes.height,
                }),
            },
        };
    },
    
    addCommands() {
        return {
            setImageSize: (attributes) => ({ tr, dispatch }) => {
                const { selection } = tr;
                const node = tr.doc.nodeAt(selection.from);
                
                if (node && node.type.name === 'image') {
                    tr.setNodeMarkup(selection.from, null, {
                        ...node.attrs,
                        ...attributes,
                    });
                    
                    if (dispatch) {
                        dispatch(tr);
                    }
                    return true;
                }
                return false;
            },
        };
    },
});

// Text style extension
export const TextStyle = Extension.create({
    name: 'textStyle',
    
    addAttributes() {
        return {
            color: {
                default: null,
                renderHTML: (attributes) => ({
                    style: `color: ${attributes.color}`,
                }),
            },
            fontSize: {
                default: null,
                renderHTML: (attributes) => ({
                    style: `font-size: ${attributes.fontSize}`,
                }),
            },
        };
    },
});
```

## Implementation

### Editor Component

```svelte
<!-- RichText.svelte -->
<script lang="ts">
    import { Editor } from '@tiptap/core';
    import StarterKit from '@tiptap/starter-kit';
    import Image from '@tiptap/extension-image';
    import { ImageResize, TextStyle } from './extensions';
    
    export let value: string = '';
    export let config: RichTextConfig;
    export let onChange: (value: string) => void;
    
    let editor: Editor;
    
    onMount(() => {
        editor = new Editor({
            element: document.querySelector('#editor'),
            extensions: [
                StarterKit,
                Image,
                ImageResize,
                TextStyle,
                // Additional extensions
            ],
            content: value,
            onUpdate: ({ editor }) => {
                const html = editor.getHTML();
                onChange(html);
            },
            ...config
        });
        
        return () => {
            editor.destroy();
        };
    });
</script>

<div class="rich-text-editor">
    <div class="toolbar">
        {#each config.toolbar || [] as button}
            <button
                class="toolbar-button"
                class:active={editor?.isActive(button)}
                on:click={() => editor?.chain().focus()[button]().run()}
            >
                <i class="icon {button}-icon"></i>
            </button>
        {/each}
    </div>
    
    <div id="editor"></div>
</div>

<style>
    .rich-text-editor {
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    .toolbar {
        display: flex;
        padding: 8px;
        border-bottom: 1px solid #eee;
    }
    
    .toolbar-button {
        margin: 0 4px;
        padding: 4px 8px;
        background: none;
        border: none;
        cursor: pointer;
    }
    
    .toolbar-button.active {
        background: #eee;
    }
    
    #editor {
        padding: 16px;
    }
</style>
```

### Image Handling

```typescript
// Image upload handler
async function handleImageUpload(
    file: File,
    config: RichTextConfig['imageUpload']
): Promise<string> {
    if (!config) throw new Error('Image upload not configured');
    
    // Validate file
    if (file.size > config.maxSize) {
        throw new Error('File too large');
    }
    
    if (!config.allowedTypes.includes(file.type)) {
        throw new Error('File type not allowed');
    }
    
    // Upload file
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(config.endpoint, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Upload failed');
    }
    
    const { url } = await response.json();
    return url;
}
```

## Events and Callbacks

```typescript
interface RichTextEvents {
    // Content changes
    onChange: (html: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    
    // File handling
    onImageUpload: (file: File) => Promise<string>;
    onImageError: (error: Error) => void;
    
    // Selection
    onSelectionUpdate: (selection: any) => void;
    
    // History
    onUndo: () => void;
    onRedo: () => void;
}
```

## Validation

```typescript
interface ValidationResult {
    valid: boolean;
    errors: string[];
}

function validateContent(
    content: string,
    config: RichTextConfig
): ValidationResult {
    const errors: string[] = [];
    
    // Check length
    if (config.maxLength && content.length > config.maxLength) {
        errors.push(`Content exceeds maximum length of ${config.maxLength}`);
    }
    
    // Check allowed tags
    if (config.allowedTags) {
        const doc = new DOMParser().parseFromString(content, 'text/html');
        const tags = Array.from(doc.getElementsByTagName('*'))
            .map(el => el.tagName.toLowerCase());
            
        const invalidTags = tags.filter(
            tag => !config.allowedTags!.includes(tag)
        );
        
        if (invalidTags.length > 0) {
            errors.push(`Invalid tags found: ${invalidTags.join(', ')}`);
        }
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}
```

## Testing

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import RichText from './RichText.svelte';

describe('RichText', () => {
    it('renders with default configuration', () => {
        const { container } = render(RichText, {
            props: {
                value: '<p>Test content</p>',
                config: {
                    toolbar: ['bold', 'italic', 'link']
                },
                onChange: () => {}
            }
        });
        
        expect(container.querySelector('#editor')).toBeTruthy();
        expect(container.querySelectorAll('.toolbar-button')).toHaveLength(3);
    });
    
    it('handles image uploads', async () => {
        const onImageUpload = jest.fn().mockResolvedValue('image.jpg');
        
        const { container } = render(RichText, {
            props: {
                value: '',
                config: {
                    imageUpload: {
                        endpoint: '/upload',
                        maxSize: 1024 * 1024,
                        allowedTypes: ['image/jpeg', 'image/png']
                    }
                },
                onImageUpload
            }
        });
        
        const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
        await fireEvent.drop(
            container.querySelector('#editor')!,
            { dataTransfer: { files: [file] } }
        );
        
        expect(onImageUpload).toHaveBeenCalledWith(file);
    });
});
```
