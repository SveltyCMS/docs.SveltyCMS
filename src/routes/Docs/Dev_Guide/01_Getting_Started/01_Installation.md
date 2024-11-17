---
title: "Developer Installation Guide"
description: "Comprehensive guide for developers to install and set up SvelteCMS development environment"
icon: "mdi:code-braces"
published: true
order: 1
---

# Developer Installation Guide

This guide covers the technical setup of SvelteCMS for development purposes.

## System Requirements

### Required Software
- Node.js (v18+ recommended)
- MongoDB (v5.0+)
- Git
- Your preferred code editor (VS Code recommended)

### Optional Tools
- Docker for containerization
- pnpm or bun for faster package management
- MongoDB Compass for database management

## Development Setup

### 1. Clone and Setup

```bash
# Clone with full git history
git clone --depth=1 https://github.com/SveltyCMS/SveltyCMS.git
cd SvelteCMS

# Install dependencies
npm install
```

### 2. Environment Configuration

Create necessary configuration files:

```typescript
// config/private.ts
export default {
    database: {
        uri: 'mongodb://localhost:27017/sveltecms',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },
    auth: {
        secret: 'your-dev-secret-key',
        tokenExpiry: '24h'
    }
}

// config/public.ts
export default {
    site: {
        name: 'SvelteCMS Dev',
        url: 'http://localhost:5173'
    },
    features: {
        registration: true,
        emailVerification: false
    }
}
```

## Project Structure

```
SvelteCMS/
├── src/                  # Source code
│   ├── lib/             # Core library code
│   │   ├── server/      # Server-side code
│   │   ├── client/      # Client-side code
│   │   └── shared/      # Shared utilities
│   ├── routes/          # SvelteKit routes
│   └── app.d.ts         # TypeScript declarations
├── static/              # Static assets
├── tests/               # Test files
└── scripts/             # Build/deployment scripts
```

## Development Workflow

### Starting Development Server

```bash
# Start in development mode
npm run dev

# Start with specific host/port
npm run dev -- --host --port 3000
```

### Hot Module Replacement (HMR)

SvelteCMS uses Vite's HMR system:
- Components auto-refresh
- State is preserved
- Fast rebuild times

### Type Checking

```bash
# Run type checks
npm run check

# Watch mode
npm run check:watch
```

## Build System

### Development Build

```bash
# Build for development
npm run build:dev

# With type checking
npm run build:check
```

### Production Build

```bash
# Optimized production build
npm run build

# Preview production build
npm run preview
```

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- auth

# Watch mode
npm run test:watch
```

## Advanced Configuration

### Custom Plugins

Create plugins in `src/lib/plugins/`:

```typescript
// src/lib/plugins/example.ts
import type { Plugin } from '$lib/types'

export default {
    name: 'example',
    hooks: {
        beforeInit: async (cms) => {
            // Plugin initialization
        }
    }
} satisfies Plugin
```

### Database Configuration

Advanced MongoDB settings:

```typescript
// config/private.ts
export default {
    database: {
        uri: process.env.MONGODB_URI,
        options: {
            replicaSet: 'rs0',
            readPreference: 'secondaryPreferred',
            maxPoolSize: 10,
            minPoolSize: 5
        }
    }
}
```

## Troubleshooting Development

### Common Issues

1. **TypeScript Errors**
   ```bash
   # Clear TypeScript cache
   rm -rf node_modules/.cache/typescript/
   ```

2. **HMR Issues**
   ```bash
   # Clear Vite cache
   rm -rf node_modules/.vite/
   ```

3. **Database Connection**
   ```bash
   # Check MongoDB status
   mongosh --eval "db.serverStatus()"
   ```

### Debug Mode

Enable debug logging:

```typescript
// src/lib/server/logger.ts
const debug = true;
```

## Next Steps

1. [Architecture Overview](../02_Architecture/01_Overview.md)
2. [Contributing Guidelines](../03_Contributing/01_Guidelines.md)
3. [API Documentation](../04_API/01_Overview.md)
