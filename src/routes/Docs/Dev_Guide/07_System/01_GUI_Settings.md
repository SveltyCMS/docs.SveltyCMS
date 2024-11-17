# GUI System Settings

The SvelteCMS GUI System Settings provide a comprehensive interface for managing the CMS's behavior, appearance, and functionality. This document details the various configuration options and their effects on the system.

## General Settings

### Site Configuration

```typescript
interface SiteConfig {
    name: string;
    description?: string;
    url: string;
    language: string;
    timezone: string;
    favicon?: string;
    logo?: {
        light: string;
        dark: string;
    };
    meta: {
        title: string;
        description?: string;
        keywords?: string[];
        robots?: string;
    };
}
```

### Theme Settings

```typescript
interface ThemeSettings {
    mode: 'light' | 'dark' | 'system';
    primaryColor: string;
    accentColor: string;
    customCss?: string;
    fonts: {
        heading: string;
        body: string;
        code: string;
    };
    layout: {
        sidebar: {
            position: 'left' | 'right';
            collapsed: boolean;
            width: number;
        };
        topbar: {
            fixed: boolean;
            height: number;
        };
    };
}
```

## User Interface

### Dashboard Configuration

```typescript
interface DashboardConfig {
    layout: 'grid' | 'list';
    widgets: DashboardWidget[];
    defaultView: string;
    refreshInterval?: number;
}

interface DashboardWidget {
    type: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    config: Record<string, any>;
    permissions?: {
        roles: string[];
        users: string[];
    };
}
```

### Navigation Settings

```typescript
interface NavigationConfig {
    mainMenu: MenuItem[];
    quickActions: QuickAction[];
    shortcuts: Shortcut[];
    search: {
        enabled: boolean;
        includedCollections: string[];
        searchFields: string[];
    };
}

interface MenuItem {
    label: string;
    icon?: string;
    link?: string;
    children?: MenuItem[];
    permissions?: string[];
    order?: number;
}
```

## System Behavior

### Cache Management

```typescript
interface CacheConfig {
    enabled: boolean;
    driver: 'memory' | 'redis' | 'filesystem';
    prefix: string;
    ttl: number;
    invalidation: {
        onUpdate: boolean;
        onDelete: boolean;
        patterns: string[];
    };
    storage: {
        path?: string;
        redis?: {
            host: string;
            port: number;
            password?: string;
        };
    };
}
```

### Media Settings

```typescript
interface MediaConfig {
    storage: {
        provider: 'local' | 's3' | 'cloudinary';
        config: Record<string, any>;
    };
    uploads: {
        maxSize: number;
        allowedTypes: string[];
        path: string;
        naming: 'original' | 'hash' | 'timestamp';
    };
    transformations: {
        presets: ImagePreset[];
        quality: number;
        format: 'original' | 'jpg' | 'png' | 'webp';
    };
}

interface ImagePreset {
    name: string;
    width: number;
    height: number;
    fit: 'cover' | 'contain' | 'fill';
    position?: string;
    background?: string;
}
```

## Security Settings

### Authentication

```typescript
interface AuthConfig {
    providers: {
        local: {
            enabled: boolean;
            passwordPolicy: {
                minLength: number;
                requireNumbers: boolean;
                requireSymbols: boolean;
                requireUppercase: boolean;
            };
        };
        oauth: OAuthProvider[];
    };
    session: {
        lifetime: number;
        rememberMe: boolean;
        singleSession: boolean;
    };
    twoFactor: {
        enabled: boolean;
        methods: ('email' | 'authenticator')[];
        enforced: boolean;
    };
}
```

### API Configuration

```typescript
interface ApiConfig {
    enabled: boolean;
    prefix: string;
    version: string;
    cors: {
        enabled: boolean;
        origins: string[];
        methods: string[];
        headers: string[];
    };
    authentication: {
        type: 'jwt' | 'apiKey';
        tokens: {
            lifetime: number;
            refreshEnabled: boolean;
        };
    };
    rateLimit: {
        enabled: boolean;
        requests: number;
        period: number;
    };
}
```

## Change Management

### Version Control

```typescript
interface VersionControl {
    enabled: boolean;
    storage: {
        type: 'database' | 'git';
        config: Record<string, any>;
    };
    retention: {
        maxVersions: number;
        keepDays: number;
    };
    compare: {
        enabled: boolean;
        diffTool: string;
    };
}
```

### Backup Settings

```typescript
interface BackupConfig {
    enabled: boolean;
    schedule: string;
    retention: {
        copies: number;
        days: number;
    };
    storage: {
        type: 'local' | 's3';
        path: string;
        compress: boolean;
    };
    include: {
        database: boolean;
        media: boolean;
        configurations: boolean;
    };
}
```

## System Events

### Event Handling

```typescript
interface EventConfig {
    logging: {
        enabled: boolean;
        level: 'error' | 'warn' | 'info' | 'debug';
        retention: number;
    };
    notifications: {
        enabled: boolean;
        channels: ('email' | 'slack' | 'webhook')[];
        events: {
            [eventType: string]: {
                enabled: boolean;
                recipients: string[];
            };
        };
    };
}
```

### Webhooks

```typescript
interface WebhookConfig {
    endpoints: WebhookEndpoint[];
    retry: {
        attempts: number;
        delay: number;
    };
    security: {
        signatureKey?: string;
        allowedIPs?: string[];
    };
}

interface WebhookEndpoint {
    url: string;
    events: string[];
    headers?: Record<string, string>;
    method: 'POST' | 'PUT';
    timeout: number;
}
```

## Performance Optimization

### System Optimization

```typescript
interface OptimizationConfig {
    caching: {
        queryCache: boolean;
        staticCache: boolean;
        browserCache: boolean;
    };
    compression: {
        enabled: boolean;
        level: number;
        types: string[];
    };
    database: {
        poolSize: number;
        timeout: number;
        slowQueryLog: boolean;
    };
    assets: {
        minify: boolean;
        combine: boolean;
        cdn?: string;
    };
}
```

### Monitoring

```typescript
interface MonitoringConfig {
    enabled: boolean;
    metrics: {
        performance: boolean;
        errors: boolean;
        usage: boolean;
    };
    alerts: {
        enabled: boolean;
        thresholds: {
            cpu: number;
            memory: number;
            storage: number;
        };
        notifications: string[];
    };
}
```

## Change Behavior

### System Updates

```typescript
interface UpdateConfig {
    autoCheck: boolean;
    autoInstall: boolean;
    channel: 'stable' | 'beta';
    schedule: string;
    notifications: {
        available: boolean;
        installed: boolean;
        failed: boolean;
    };
}
```

### Change Propagation

```typescript
interface ChangePropagation {
    mode: 'immediate' | 'scheduled' | 'manual';
    validation: {
        validateBeforeApply: boolean;
        rollbackOnError: boolean;
    };
    notifications: {
        beforeChange: boolean;
        afterChange: boolean;
        onError: boolean;
    };
    locks: {
        enabled: boolean;
        timeout: number;
        scope: 'global' | 'collection' | 'entry';
    };
}
```

## Maintenance Mode

```typescript
interface MaintenanceMode {
    enabled: boolean;
    message: string;
    allowedIPs: string[];
    bypassKey?: string;
    schedule?: {
        start: string;
        end: string;
        recurring: boolean;
    };
    access: {
        roles: string[];
        users: string[];
    };
}
```
