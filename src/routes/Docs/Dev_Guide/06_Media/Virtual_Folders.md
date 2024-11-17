# Virtual Folders

SvelteCMS uses a virtual folder system to organize and manage media assets. This system provides a flexible and powerful way to structure your media library without being constrained by physical file system limitations.

## Overview

Virtual folders are logical containers that can:
- Organize files by type, project, or purpose
- Create nested hierarchies
- Share files across multiple locations
- Apply permissions at the folder level
- Support dynamic organization through tags and metadata

## Folder Structure

### Folder Types

```typescript
interface VirtualFolder {
    id: string;
    name: string;
    path: string;
    type: FolderType;
    parent?: string;
    children: string[];
    files: string[];
    metadata: FolderMetadata;
    permissions: FolderPermissions;
}

type FolderType = 'regular' | 'smart' | 'collection' | 'shared';

interface FolderMetadata {
    description?: string;
    icon?: string;
    color?: string;
    tags?: string[];
    created: Date;
    modified: Date;
    owner: string;
}
```

### Smart Folders

```typescript
interface SmartFolder extends VirtualFolder {
    type: 'smart';
    rules: SmartFolderRule[];
    updateInterval?: number;
    lastUpdate: Date;
}

interface SmartFolderRule {
    field: string;
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'matches';
    value: string | string[];
    condition: 'and' | 'or';
}
```

### Collection Folders

```typescript
interface CollectionFolder extends VirtualFolder {
    type: 'collection';
    collection: string;
    field: string;
    relationship: 'oneToOne' | 'oneToMany';
}
```

## Folder Management

### Creating Folders

```typescript
interface FolderOperations {
    create: (folder: Partial<VirtualFolder>) => Promise<VirtualFolder>;
    delete: (folderId: string) => Promise<void>;
    move: (folderId: string, newParentId: string) => Promise<VirtualFolder>;
    rename: (folderId: string, newName: string) => Promise<VirtualFolder>;
    update: (folderId: string, updates: Partial<VirtualFolder>) => Promise<VirtualFolder>;
}

// Example usage
const folderOps = new FolderOperations();

// Create a regular folder
await folderOps.create({
    name: 'Project Assets',
    type: 'regular',
    metadata: {
        description: 'Assets for the main project',
        tags: ['project', 'assets']
    }
});

// Create a smart folder
await folderOps.create({
    name: 'Recent Images',
    type: 'smart',
    rules: [{
        field: 'type',
        operator: 'startsWith',
        value: 'image/',
        condition: 'and'
    }, {
        field: 'created',
        operator: 'matches',
        value: 'last-7-days',
        condition: 'and'
    }]
});
```

### Folder Navigation

```typescript
interface FolderNavigation {
    getCurrentFolder: () => VirtualFolder;
    getParent: (folderId: string) => Promise<VirtualFolder>;
    getChildren: (folderId: string) => Promise<VirtualFolder[]>;
    getPath: (folderId: string) => Promise<VirtualFolder[]>;
    search: (query: string) => Promise<VirtualFolder[]>;
}

// Example implementation
class FolderNavigator implements FolderNavigation {
    async getPath(folderId: string): Promise<VirtualFolder[]> {
        const path: VirtualFolder[] = [];
        let current = await this.getFolder(folderId);
        
        while (current) {
            path.unshift(current);
            if (current.parent) {
                current = await this.getFolder(current.parent);
            } else {
                break;
            }
        }
        
        return path;
    }
}
```

## File Management

### Adding Files

```typescript
interface FileOperations {
    addToFolder: (folderId: string, fileIds: string[]) => Promise<void>;
    removeFromFolder: (folderId: string, fileIds: string[]) => Promise<void>;
    moveToFolder: (fileIds: string[], sourceFolderId: string, targetFolderId: string) => Promise<void>;
    copyToFolder: (fileIds: string[], sourceFolderId: string, targetFolderId: string) => Promise<void>;
}

// Example usage
const fileOps = new FileOperations();

// Add files to folder
await fileOps.addToFolder('project-assets', ['file1', 'file2']);

// Move files between folders
await fileOps.moveToFolder(
    ['file1', 'file2'],
    'source-folder',
    'target-folder'
);
```

### File References

```typescript
interface FileReference {
    fileId: string;
    folderId: string;
    reference: 'original' | 'copy' | 'link';
    metadata: {
        addedDate: Date;
        addedBy: string;
        notes?: string;
    };
}

// Example: Get file references
async function getFileLocations(fileId: string): Promise<FileReference[]> {
    return await db.fileReferences.find({ fileId });
}
```

## Permissions

### Folder Permissions

```typescript
interface FolderPermissions {
    owner: string;
    group?: string;
    access: {
        read: boolean;
        write: boolean;
        delete: boolean;
        share: boolean;
    };
    inheritance: boolean;
}

// Example: Check permissions
function canAccessFolder(folder: VirtualFolder, user: User): boolean {
    if (folder.permissions.owner === user.id) return true;
    if (folder.permissions.group && user.groups.includes(folder.permissions.group)) {
        return folder.permissions.access.read;
    }
    return false;
}
```

### Inherited Permissions

```typescript
interface InheritedPermissions {
    getEffectivePermissions: (folderId: string, userId: string) => Promise<FolderPermissions>;
    propagatePermissions: (folderId: string, permissions: FolderPermissions) => Promise<void>;
}

// Example: Get effective permissions
async function getEffectivePermissions(
    folder: VirtualFolder,
    user: User
): Promise<FolderPermissions> {
    if (!folder.permissions.inheritance) {
        return folder.permissions;
    }
    
    const parent = await getParentFolder(folder.id);
    if (!parent) {
        return folder.permissions;
    }
    
    const parentPermissions = await getEffectivePermissions(parent, user);
    return mergePermissions(folder.permissions, parentPermissions);
}
```

## Events

### Folder Events

```typescript
interface FolderEvents {
    created: CustomEvent<VirtualFolder>;
    deleted: CustomEvent<string>;
    moved: CustomEvent<{folder: VirtualFolder, oldParent: string}>;
    renamed: CustomEvent<{folder: VirtualFolder, oldName: string}>;
    updated: CustomEvent<VirtualFolder>;
}

// Example: Event handling
folderStore.addEventListener('created', (event: CustomEvent<VirtualFolder>) => {
    console.log('New folder created:', event.detail);
    refreshFolderTree();
});
```

### File Events

```typescript
interface FolderFileEvents {
    fileAdded: CustomEvent<{file: MediaFile, folder: VirtualFolder}>;
    fileRemoved: CustomEvent<{fileId: string, folder: VirtualFolder}>;
    fileMoved: CustomEvent<{
        file: MediaFile,
        sourceFolder: VirtualFolder,
        targetFolder: VirtualFolder
    }>;
}
```

## UI Components

### Folder Tree

```svelte
<script lang="ts">
    import { FolderTree } from '@sveltecms/media';
    
    let selectedFolder: VirtualFolder | null = null;
    
    function handleFolderSelect(folder: VirtualFolder) {
        selectedFolder = folder;
    }
</script>

<FolderTree
    root="root-folder-id"
    expanded={true}
    onSelect={handleFolderSelect}
/>

<style>
    :global(.folder-tree) {
        --tree-indent: 1.5rem;
        --tree-line-color: #ddd;
        --tree-item-height: 2rem;
        --tree-icon-size: 1rem;
    }
</style>
```

### Folder Actions

```svelte
<script lang="ts">
    import { FolderActions } from '@sveltecms/media';
    import type { VirtualFolder } from '@sveltecms/media';
    
    export let folder: VirtualFolder;
    
    async function handleAction(action: string) {
        switch (action) {
            case 'rename':
                const newName = prompt('Enter new name:', folder.name);
                if (newName) {
                    await folderOps.rename(folder.id, newName);
                }
                break;
            case 'delete':
                if (confirm('Delete folder?')) {
                    await folderOps.delete(folder.id);
                }
                break;
        }
    }
</script>

<FolderActions
    {folder}
    onAction={handleAction}
/>
```

## Drag and Drop

### Folder Drop Zones

```typescript
interface DropZoneOptions {
    accept: string[];
    multiple: boolean;
    onDrop: (files: File[]) => void;
    onFolderDrop: (folders: FileSystemDirectoryEntry[]) => void;
}

// Example usage
const dropZone = new DropZone({
    accept: ['image/*', 'video/*'],
    multiple: true,
    onDrop: async (files) => {
        await fileOps.addToFolder(currentFolder.id, files);
    },
    onFolderDrop: async (folders) => {
        for (const folder of folders) {
            await importFolderStructure(folder);
        }
    }
});
```

### Drag Operations

```typescript
interface DragOperations {
    canDrop: (source: VirtualFolder | MediaFile, target: VirtualFolder) => boolean;
    handleDrop: (source: VirtualFolder | MediaFile, target: VirtualFolder) => Promise<void>;
}

// Example implementation
const dragOps: DragOperations = {
    canDrop(source, target) {
        if (source instanceof VirtualFolder) {
            return !isDescendant(target, source);
        }
        return true;
    },
    
    async handleDrop(source, target) {
        if (source instanceof VirtualFolder) {
            await folderOps.move(source.id, target.id);
        } else {
            await fileOps.moveToFolder([source.id], source.folder, target.id);
        }
    }
};
```
