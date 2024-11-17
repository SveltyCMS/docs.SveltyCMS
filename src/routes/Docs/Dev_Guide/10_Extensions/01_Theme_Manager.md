---
title: "Theme Manager Development"
description: "Technical documentation for implementing and extending the SvelteCMS Theme Manager."
icon: "mdi:palette" 
published: true
---

# Theme Manager Development Guide

## Overview

The Theme Manager is a core component of SvelteCMS that handles theme management, switching, and customization. This documentation covers the technical implementation and extension of the Theme Manager system.

## Core Components

### 1. Theme Store (`themeStore.svelte.ts`)

```typescript
interface ThemeState {
    currentTheme: Theme | null;
    isLoading: boolean;
    error: string | null;
    lastUpdateAttempt: Date | null;
}
```

Key features:
- Reactive theme state management
- Asynchronous theme initialization
- Theme updating with server synchronization
- Error handling for API calls

### 2. Theme Manager (`themeManager.ts`)

```typescript
class ThemeManager {
    private static instance: ThemeManager;
    private currentTheme: Theme;
    private initialized: boolean;
    private db: dbInterface;

    public static getInstance(): ThemeManager;
    public async initialize(db: dbInterface): Promise<void>;
    public getTheme(): Theme;
    public async setTheme(theme: Theme): Promise<void>;
}
```

### 3. Database Adapter Interface

```typescript
interface Theme {
    _id: string;
    name: string;
    path: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface dbInterface {
    getDefaultTheme(): Promise<Theme | null>;
    setDefaultTheme(themeName: string): Promise<void>;
    storeThemes(themes: Theme[]): Promise<void>;
}
```

## Implementation Details

### 1. Theme Initialization

```typescript
async function initialize() {
    state.update((s) => ({ ...s, isLoading: true, error: null }));
    try {
        const theme = await dbAdapter?.getDefaultTheme();
        state.update((s) => ({
            ...s,
            currentTheme: theme ?? null,
            isLoading: false,
            lastUpdateAttempt: new Date()
        }));
        return theme;
    } catch (err) {
        state.update((s) => ({
            ...s,
            error: err instanceof Error ? err.message : 'Failed to initialize theme',
            isLoading: false
        }));
        throw err;
    }
}
```

### 2. Theme Switching

```typescript
async function updateTheme(newTheme: Theme | string) {
    state.update((s) => ({ ...s, isLoading: true, error: null }));
    try {
        const themeToUpdate = typeof newTheme === 'string'
            ? { name: newTheme, _id: '', path: '', isDefault: false, createdAt: new Date(), updatedAt: new Date() }
            : newTheme;

        await dbAdapter?.setDefaultTheme(themeToUpdate.name);
        state.update((s) => ({
            ...s,
            currentTheme: themeToUpdate,
            isLoading: false,
            lastUpdateAttempt: new Date()
        }));
        return themeToUpdate;
    } catch (err) {
        state.update((s) => ({
            ...s,
            error: err instanceof Error ? err.message : 'Failed to update theme',
            isLoading: false
        }));
        throw err;
    }
}
```

### 3. Theme Auto-Refresh

```typescript
function startAutoRefresh(interval = 30 * 60 * 1000) {
    if (refreshInterval) stopAutoRefresh();
    refreshInterval = setInterval(() => {
        const currentState = state();
        if (currentState.lastUpdateAttempt && 
            Date.now() - currentState.lastUpdateAttempt.getTime() > interval) {
            initialize().catch(console.error);
        }
    }, interval);
}
```

## Theme Development

### 1. Theme Structure

```
themes/
├── SveltyCMS/
│   └── SveltyCMSTheme.css
└── custom/
    ├── dark/
    │   └── theme.css
    └── light/
        └── theme.css
```

### 2. Custom Theme Creation

1. Create a new directory in `themes/custom/`
2. Create a `theme.css` file
3. Register the theme in the database

```typescript
const customTheme: Theme = {
    _id: generateId(),
    name: 'custom-theme',
    path: '/themes/custom/theme.css',
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date()
};
```

## Security Considerations

1. Theme Validation
   - Validate theme files before activation
   - Check file permissions
   - Sanitize theme names

2. Access Control
   - Implement role-based access for theme management
   - Restrict theme installation to authorized users
   - Log theme changes

## Error Handling

```typescript
try {
    await themeManager.setTheme(newTheme);
} catch (err) {
    logger.error(`Theme update failed: ${err.message}`);
    // Handle error appropriately
}
```

## Best Practices

1. Theme Development
   - Follow CSS naming conventions
   - Use CSS variables for customization
   - Implement dark mode support
   - Test across browsers

2. Performance
   - Optimize CSS files
   - Implement proper caching
   - Use CSS minification
   - Lazy load theme assets

3. Maintenance
   - Regular theme updates
   - Version control
   - Documentation updates
   - Backup procedures
