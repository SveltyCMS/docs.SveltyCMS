---
title: "Plugin System"
description: "Working with plugins and extensions in SveltyCMS"
icon: "mdi:puzzle"
---

# Plugin Development Guide

Learn how to extend SveltyCMS functionality through plugins. This guide covers plugin architecture, development workflow, and best practices for creating maintainable plugins.

## Plugin Architecture

### Plugin Structure
```typescript
// plugins/example/index.ts
export interface PluginConfig {
  name: string;
  version: string;
  dependencies?: string[];
  settings?: Record<string, any>;
}

export default {
  name: 'example-plugin',
  version: '1.0.0',
  dependencies: ['@sveltycms/core'],
  settings: {
    enabled: true,
    options: {}
  }
}
```

### Plugin Types
1. Content Types
   - Custom fields
   - Validation rules
   - Display components
   - Input components
   - Preview handlers

2. UI Components
   - Dashboard widgets
   - Navigation items
   - Custom pages
   - Modal dialogs
   - Form elements

3. API Extensions
   - Custom endpoints
   - Middleware
   - Data handlers
   - Cache providers
   - Search providers

## Development Setup

### Project Structure
```
plugins/
  ├── example-plugin/
  │   ├── src/
  │   │   ├── components/
  │   │   ├── api/
  │   │   ├── types/
  │   │   └── index.ts
  │   ├── package.json
  │   └── README.md
```

### Dependencies
```json
{
  "name": "@sveltycms/plugin-example",
  "version": "1.0.0",
  "dependencies": {
    "@sveltycms/core": "^2.0.0",
    "svelte": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
}
```

## Plugin Development

### Component Development
```typescript
// src/components/ExampleWidget.svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import type { WidgetProps } from '@sveltycms/core';

  export let props: WidgetProps;
  
  onMount(() => {
    // Initialize widget
  });
</script>

<div class="example-widget">
  <!-- Widget content -->
</div>

<style>
  .example-widget {
    /* Widget styles */
  }
</style>
```

### API Extensions
```typescript
// src/api/endpoints.ts
import type { APIContext } from '@sveltycms/core';

export const exampleEndpoint = async (ctx: APIContext) => {
  try {
    // Handle request
    return { success: true };
  } catch (error) {
    ctx.throw(500, error.message);
  }
};
```

### Type Extensions
```typescript
// src/types/index.ts
import type { BaseField } from '@sveltycms/core';

export interface ExampleField extends BaseField {
  type: 'example';
  options: {
    // Field specific options
  };
}
```

## Integration

### Plugin Registration
```typescript
// config/plugins.ts
export default {
  plugins: [
    {
      name: 'example-plugin',
      source: '@sveltycms/plugin-example',
      config: {
        enabled: true,
        options: {
          // Plugin specific options
        }
      }
    }
  ]
}
```

### Event Hooks
```typescript
// src/hooks.ts
import type { Hook } from '@sveltycms/core';

export const beforeSave: Hook = async (ctx) => {
  // Pre-save logic
};

export const afterSave: Hook = async (ctx) => {
  // Post-save logic
};
```

## Testing

### Unit Tests
```typescript
// tests/unit/example.test.ts
import { describe, it, expect } from 'vitest';
import ExamplePlugin from '../src';

describe('Example Plugin', () => {
  it('should initialize correctly', () => {
    const plugin = new ExamplePlugin();
    expect(plugin.name).toBe('example-plugin');
  });
});
```

### Integration Tests
```typescript
// tests/integration/api.test.ts
import { describe, it, expect } from 'vitest';
import { createTestContext } from '@sveltycms/testing';

describe('API Integration', () => {
  it('should handle requests correctly', async () => {
    const ctx = await createTestContext();
    const response = await ctx.request('/api/example');
    expect(response.status).toBe(200);
  });
});
```

## Publishing

### Build Process
```json
{
  "scripts": {
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint src",
    "prepublish": "npm run build"
  }
}
```

### Distribution
1. Package Registry
   ```bash
   npm publish --access public
   ```

2. Manual Installation
   ```bash
   npm install --save /path/to/plugin
   ```

## Best Practices

### Code Quality
1. TypeScript Usage
   - Strong typing
   - Interface definitions
   - Type exports
   - Documentation
   - Error handling

2. Performance
   - Lazy loading
   - Bundle size
   - Memory usage
   - Cache usage
   - Async operations

### Security
1. Input Validation
   ```typescript
   import { z } from 'zod';

   const schema = z.object({
     input: z.string().min(1).max(100)
   });

   export const validate = (data: unknown) => {
     return schema.parse(data);
   };
   ```

2. Access Control
   ```typescript
   import { checkPermission } from '@sveltycms/core';

   export const secure = async (ctx: Context) => {
     await checkPermission(ctx, 'example.action');
   };
   ```

## Troubleshooting

### Common Issues
1. **Installation Problems**
   - Check dependencies
   - Verify versions
   - Clear cache
   - Check permissions
   - Review logs

2. **Runtime Errors**
   - Debug mode
   - Error tracking
   - Performance monitoring
   - State management
   - Memory leaks

## Documentation

### README Template
```markdown
# SveltyCMS Example Plugin

## Features
- Feature 1
- Feature 2

## Installation
\`\`\`bash
npm install @sveltycms/plugin-example
\`\`\`

## Configuration
\`\`\`typescript
// config/plugins.ts
export default {
  plugins: [
    {
      name: 'example-plugin',
      // ...configuration
    }
  ]
}
\`\`\`

## Usage
...

## API Reference
...

## Contributing
...

## License
MIT
```

### API Documentation
1. TypeDoc Setup
   ```json
   {
     "scripts": {
       "docs": "typedoc src/index.ts"
     }
   }
   ```

2. JSDoc Comments
   ```typescript
   /**
    * Example plugin main class
    * @class ExamplePlugin
    */
   export class ExamplePlugin {
     /**
      * Initialize plugin
      * @param {PluginConfig} config - Plugin configuration
      */
     constructor(config: PluginConfig) {
       // Implementation
     }
   }
   ```

## Support

### Getting Help
- Check [Developer Guide](../Developer_Guide/index.md)
- Review [API Documentation](../API/index.md)
- Join our [Discord Community](https://discord.gg/sveltycms)
- Open [GitHub Issues](https://github.com/SveltyCMS/SveltyCMS/issues)

### Contributing
- Read [Contributing Guide](../Contributing.md)
- Follow [Code of Conduct](../CODE_OF_CONDUCT.md)
- Submit [Pull Requests](https://github.com/SveltyCMS/SveltyCMS/pulls)
