# Widget Marketplace

The SvelteCMS Widget Marketplace is a central hub for discovering, sharing, and managing widgets. This guide covers how to publish, install, and manage widgets through the marketplace.

## Publishing Widgets

### Package Structure

```
widget-package/
├── src/
│   ├── index.ts
│   ├── Widget.svelte
│   ├── styles.scss
│   └── types.ts
├── tests/
│   └── Widget.test.ts
├── package.json
├── README.md
└── tsconfig.json
```

### Package Configuration

```json
{
    "name": "@sveltecms/widget-custom",
    "version": "1.0.0",
    "description": "Custom widget for SvelteCMS",
    "author": "Your Name",
    "license": "MIT",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "sveltecms": {
        "type": "widget",
        "name": "custom",
        "displayName": "Custom Widget",
        "description": "A custom widget for SvelteCMS",
        "tags": ["form", "input", "custom"],
        "version": "1.0.0",
        "compatibility": {
            "sveltecms": "^1.0.0"
        }
    },
    "scripts": {
        "build": "svelte-kit build",
        "test": "vitest",
        "lint": "eslint src",
        "prepublishOnly": "npm run build"
    },
    "peerDependencies": {
        "@sveltecms/core": "^1.0.0",
        "svelte": "^4.0.0"
    },
    "devDependencies": {
        "@sveltejs/kit": "^1.0.0",
        "@testing-library/svelte": "^4.0.0",
        "typescript": "^5.0.0",
        "vitest": "^0.34.0"
    }
}
```

### Publishing Process

1. Prepare Package
```bash
# Build package
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

2. Submit to Marketplace
```bash
# Login to SvelteCMS registry
npm login --registry=https://registry.sveltecms.org

# Publish package
npm publish --access public
```

## Installing Widgets

### Through Admin UI

1. Navigate to Admin > Widgets > Marketplace
2. Search for desired widget
3. Click "Install"
4. Configure widget settings

### Through CLI

```bash
# Install widget package
npm install @sveltecms/widget-custom

# Update CMS configuration
npx sveltecms widget add @sveltecms/widget-custom
```

### Manual Installation

```typescript
// cms.config.ts
import { CustomWidget } from '@sveltecms/widget-custom';

export default {
    widgets: {
        custom: CustomWidget
    }
};
```

## Widget Management

### Version Control

```json
{
    "dependencies": {
        "@sveltecms/widget-custom": "^1.0.0"
    },
    "resolutions": {
        "@sveltecms/widget-custom": "1.0.5"
    }
}
```

### Updates

```bash
# Check for updates
npm outdated

# Update specific widget
npm update @sveltecms/widget-custom

# Update all widgets
npm update
```

### Security

```typescript
// cms.config.ts
export default {
    widgets: {
        custom: {
            // Enable security features
            sanitize: true,
            validateInput: true,
            maxUploadSize: '5MB',
            allowedDomains: ['trusted-domain.com']
        }
    }
};
```

## Widget Discovery

### Search

The marketplace supports various search parameters:

- Keywords
- Categories
- Tags
- Author
- Compatibility
- Rating
- Downloads

### Filtering

```typescript
// Example search parameters
const searchParams = {
    query: 'form input',
    tags: ['form', 'validation'],
    compatibility: '^1.0.0',
    minRating: 4,
    sort: 'downloads'
};
```

## Widget Reviews

### Rating System

Widgets are rated on:

- Code quality
- Documentation
- Maintainability
- Performance
- Security

### Review Guidelines

1. Test thoroughly
2. Provide constructive feedback
3. Include use cases
4. Report issues
5. Suggest improvements

## Widget Updates

### Version Management

```typescript
// widget/version.ts
export const version = {
    current: '1.0.0',
    compatibility: {
        min: '1.0.0',
        max: '2.0.0'
    },
    changelog: [
        {
            version: '1.0.0',
            changes: [
                'Initial release'
            ]
        }
    ]
};
```

### Migration Guide

```typescript
// widget/migrations.ts
export const migrations = {
    '1.0.0': {
        up: async (config: any) => {
            // Migration logic
        },
        down: async (config: any) => {
            // Rollback logic
        }
    }
};
```

## Widget Analytics

### Usage Tracking

```typescript
// widget/analytics.ts
export const analytics = {
    track: (event: string, data: any) => {
        // Track widget usage
    },
    metrics: {
        usage: () => {
            // Usage statistics
        },
        performance: () => {
            // Performance metrics
        }
    }
};
```

### Performance Monitoring

```typescript
// widget/monitoring.ts
export const monitoring = {
    measure: (operation: string) => {
        const start = performance.now();
        return () => {
            const duration = performance.now() - start;
            // Log performance data
        };
    }
};
```

## Best Practices

### Documentation

1. Clear installation instructions
2. Comprehensive API documentation
3. Usage examples
4. Configuration options
5. Troubleshooting guide

### Testing

1. Unit tests
2. Integration tests
3. Performance tests
4. Security tests
5. Browser compatibility tests

### Security

1. Input validation
2. Output sanitization
3. Access control
4. Rate limiting
5. Error handling

### Performance

1. Lazy loading
2. Code splitting
3. Bundle optimization
4. Caching strategies
5. Resource optimization

## Support

### Community

1. GitHub Issues
2. Discord channel
3. Stack Overflow tags
4. Community forums
5. Documentation wiki

### Commercial

1. Priority support
2. Custom development
3. Training sessions
4. Consulting services
5. SLA agreements
