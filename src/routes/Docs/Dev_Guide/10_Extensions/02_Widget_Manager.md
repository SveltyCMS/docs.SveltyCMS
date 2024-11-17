---
title: "Widget Manager Development"
description: "Technical documentation for implementing and extending the SvelteCMS Widget Manager"
icon: "mdi:widgets"
published: true
---

# Widget Manager Development Guide

## Overview

The Widget Manager is a core component of SvelteCMS that handles dynamic content blocks, custom components, and interactive elements. This documentation covers the technical implementation and extension of the Widget system.

## Core Components

### 1. Widget Store (`widgetStore.svelte.ts`)

```typescript
interface WidgetState {
    widgets: Widget[];
    activeWidgets: Map<string, Widget>;
    isLoading: boolean;
    error: string | null;
}

interface Widget {
    _id: string;
    name: string;
    type: string;
    config: WidgetConfig;
    content: any;
    position: number;
    isActive: boolean;
}
```

### 2. Widget Manager (`widgetManager.ts`)

```typescript
class WidgetManager {
    private static instance: WidgetManager;
    private widgets: Map<string, Widget>;
    private db: dbInterface;

    public static getInstance(): WidgetManager;
    public async initialize(db: dbInterface): Promise<void>;
    public registerWidget(widget: Widget): void;
    public unregisterWidget(widgetId: string): void;
    public getWidget(widgetId: string): Widget | undefined;
}
```

### 3. Widget Interface

```typescript
interface WidgetConfig {
    template: string;
    styles: string;
    props: Record<string, any>;
    events: Record<string, Function>;
}

interface WidgetProps {
    id: string;
    type: string;
    data: any;
    config: WidgetConfig;
}
```

## Implementation Details

### 1. Widget Registration

```typescript
async function registerWidget(widget: Widget) {
    try {
        // Validate widget
        if (!isValidWidget(widget)) {
            throw new Error('Invalid widget configuration');
        }

        // Register with store
        state.update(s => ({
            ...s,
            widgets: [...s.widgets, widget],
            activeWidgets: s.activeWidgets.set(widget._id, widget)
        }));

        // Initialize widget
        await initializeWidget(widget);
        
        return widget;
    } catch (err) {
        handleError(err);
        throw err;
    }
}
```

### 2. Widget Lifecycle

```typescript
async function initializeWidget(widget: Widget) {
    // Load dependencies
    await loadDependencies(widget.config.dependencies);

    // Mount component
    const target = document.getElementById(widget.mountPoint);
    if (!target) throw new Error(`Mount point ${widget.mountPoint} not found`);

    // Create component instance
    const instance = new widget.component({
        target,
        props: widget.config.props
    });

    // Register events
    Object.entries(widget.config.events).forEach(([event, handler]) => {
        instance.$on(event, handler);
    });

    return instance;
}
```

### 3. Widget Updates

```typescript
async function updateWidget(widgetId: string, updates: Partial<Widget>) {
    state.update(s => {
        const widget = s.activeWidgets.get(widgetId);
        if (!widget) throw new Error(`Widget ${widgetId} not found`);

        const updatedWidget = {
            ...widget,
            ...updates,
            updatedAt: new Date()
        };

        return {
            ...s,
            widgets: s.widgets.map(w => w._id === widgetId ? updatedWidget : w),
            activeWidgets: s.activeWidgets.set(widgetId, updatedWidget)
        };
    });
}
```

## Widget Development

### 1. Creating Custom Widgets

```typescript
// MyCustomWidget.svelte
<script lang="ts">
    export let config: WidgetConfig;
    export let data: any;

    // Widget logic here
</script>

<style>
    /* Widget styles here */
</style>

<div class="my-custom-widget">
    <!-- Widget template here -->
</div>
```

### 2. Widget Registration

```typescript
const myWidget: Widget = {
    _id: generateId(),
    name: 'My Custom Widget',
    type: 'custom',
    config: {
        template: './MyCustomWidget.svelte',
        styles: './styles.css',
        props: {
            // Default props
        },
        events: {
            // Event handlers
        }
    },
    position: 0,
    isActive: true
};

widgetManager.registerWidget(myWidget);
```

## Security Considerations

### 1. Input Validation

```typescript
function validateWidgetInput(input: any): boolean {
    // Implement input validation
    if (!input || typeof input !== 'object') return false;
    if (!input.type || typeof input.type !== 'string') return false;
    // Additional validation
    return true;
}
```

### 2. Sanitization

```typescript
function sanitizeWidgetContent(content: any): any {
    // Implement content sanitization
    if (typeof content === 'string') {
        return DOMPurify.sanitize(content);
    }
    // Handle other content types
    return content;
}
```

## Performance Optimization

### 1. Lazy Loading

```typescript
async function lazyLoadWidget(widget: Widget) {
    const component = await import(widget.config.template);
    const styles = await import(widget.config.styles);
    
    // Initialize after load
    return { component, styles };
}
```

### 2. Caching

```typescript
class WidgetCache {
    private cache: Map<string, Widget>;
    private maxAge: number;

    constructor(maxAge = 3600000) {
        this.cache = new Map();
        this.maxAge = maxAge;
    }

    set(key: string, widget: Widget): void {
        this.cache.set(key, {
            ...widget,
            cachedAt: Date.now()
        });
    }

    get(key: string): Widget | undefined {
        const cached = this.cache.get(key);
        if (!cached) return undefined;
        
        if (Date.now() - cached.cachedAt > this.maxAge) {
            this.cache.delete(key);
            return undefined;
        }
        
        return cached;
    }
}
```

## Testing

### 1. Unit Tests

```typescript
describe('Widget Manager', () => {
    it('should register widget', async () => {
        const widget = createTestWidget();
        await widgetManager.registerWidget(widget);
        expect(widgetManager.getWidget(widget._id)).toBeDefined();
    });

    it('should handle widget updates', async () => {
        const widget = createTestWidget();
        const updates = { name: 'Updated Name' };
        await widgetManager.updateWidget(widget._id, updates);
        const updated = widgetManager.getWidget(widget._id);
        expect(updated.name).toBe(updates.name);
    });
});
```

### 2. Integration Tests

```typescript
describe('Widget Integration', () => {
    it('should render widget correctly', async () => {
        const widget = createTestWidget();
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        await renderWidget(widget, container);
        expect(container.innerHTML).toContain(widget.name);
    });
});
```

## Best Practices

1. Widget Development
   - Follow component lifecycle
   - Implement proper cleanup
   - Handle errors gracefully
   - Document API and events

2. Performance
   - Lazy load when possible
   - Implement caching
   - Optimize renders
   - Bundle efficiently

3. Maintenance
   - Version widgets
   - Track dependencies
   - Monitor performance
   - Regular updates
