---
title: "Quick Start Configuration"
description: "Guide to quickly set up and configure a new SvelteCMS installation"
icon: "mdi:cog"
published: true
order: 1
---

# Quick Start Configuration Guide

This guide helps you quickly set up a new SvelteCMS installation with proper configuration.

## Basic Configuration Structure

```typescript
// config/cms.config.ts
interface CMSConfig {
    site: SiteConfig;
    auth: AuthConfig;
    media: MediaConfig;
    database: DatabaseConfig;  
    collections: CollectionConfig[];
    plugins: PluginConfig[];
}
```

## Essential Configuration Files

### 1. Site Configuration

```typescript
// config/site.config.ts
export default {
    name: "My CMS Site",
    description: "A powerful content management system",
    baseUrl: "https://example.com",
    
    // Language settings
    defaultLocale: "en",
    supportedLocales: ["en", "de", "fr"],
    
    // Theme settings
    theme: {
        primary: "#007bff",
        secondary: "#6c757d",
        accent: "#28a745",
        mode: "light"  
    },
    
    // SEO defaults
    meta: {
        title: "My CMS Site",
        description: "Default site description",
        ogImage: "/images/og-default.jpg"
    },
    
    // Navigation
    navigation: {
        dashboard: true,
        media: true,
        users: true,
        settings: true
    }
};
```

### 2. Authentication Configuration

```typescript
// config/auth.config.ts
export default {
    // Session settings
    session: {
        lifetime: "24h",
        renewalThreshold: "1h",
        secure: true
    },
    
    // Authentication providers
    providers: {
        local: {
            enabled: true,
            registration: {
                enabled: true,
                requireApproval: true
            }
        },
        oauth: {
            google: {
                enabled: false,
                clientId: "YOUR_CLIENT_ID",
                clientSecret: "YOUR_CLIENT_SECRET"
            },
            github: {
                enabled: false,
                clientId: "YOUR_CLIENT_ID",
                clientSecret: "YOUR_CLIENT_SECRET"
            }
        }
    },
    
    // Role configuration
    roles: {
        admin: {
            name: "Administrator",
            permissions: ["*"]
        },
        editor: {
            name: "Editor",
            permissions: [
                "content.read",
                "content.create",
                "content.update",
                "media.upload"
            ]
        },
        viewer: {
            name: "Viewer",
            permissions: ["content.read"]
        }
    }
};
```

### 3. Database Configuration

```typescript
// config/database.config.ts
export default {
    type: "mongodb", 
    
    // Connection settings
    connection: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "27017"),
        database: process.env.DB_NAME || "sveltecms",
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    
    // Pool configuration
    pool: {
        min: 1,
        max: 10
    },
    
    // Retry settings
    retry: {
        attempts: 5,
        delay: 1000
    }
};
```

### 4. Media Configuration

```typescript
// config/media.config.ts
export default {
    storage: {
        provider: "local", 
        local: {
            uploadDir: "uploads",
            serveUrl: "/media"
        },
        s3: {
            bucket: "my-cms-bucket",
            region: "us-east-1",
            accessKey: "YOUR_ACCESS_KEY",
            secretKey: "YOUR_SECRET_KEY"
        }
    },
    
    upload: {
        maxFileSize: "10MB",
        allowedTypes: ["image/*", "application/pdf"],
        naming: {
            pattern: "${date}-${slug}-${random}",
            lowercase: true,
            replace: {
                " ": "-",
                "_": "-"
            }
        }
    },
    
    images: {
        processing: {
            quality: 85,
            formats: ["webp", "jpeg"],
            sizes: [
                { width: 2048, name: "large" },
                { width: 1024, name: "medium" },
                { width: 512, name: "small" },
                { width: 256, name: "thumbnail" }
            ]
        },
        defaults: {
            placeholder: "/images/placeholder.jpg",
            fallback: "/images/fallback.jpg"
        }
    }
};
```

### 5. Plugin Configuration

```typescript
// config/plugins.config.ts
export default {
    seo: {
        enabled: true,
        sitemap: true,
        robots: true,
        meta: {
            generator: true,
            viewport: "width=device-width, initial-scale=1"
        }
    },
    
    analytics: {
        enabled: false,
        provider: "google",
        trackingId: "UA-XXXXXXXX-X"
    },
    
    editor: {
        enabled: true,
        toolbar: [
            "bold",
            "italic",
            "link",
            "image",
            "code"
        ],
        plugins: [
            "markdown",
            "table",
            "media"
        ]
    }
};
```

## Quick Start Template

Create a new `cms.config.ts` file in your project:

```typescript
// config/cms.config.ts
import siteConfig from './site.config';
import authConfig from './auth.config';
import mediaConfig from './media.config';
import databaseConfig from './database.config';
import pluginsConfig from './plugins.config';

export default {
    site: siteConfig,
    auth: authConfig,
    media: mediaConfig,
    database: databaseConfig,
    plugins: pluginsConfig,
    
    // Add your collections here
    collections: []
};
```

## Environment Variables

Create a `.env` file in your project root:

```bash
# Site
SITE_URL=http://localhost:3000
SITE_NAME="My CMS Site"

# Database
DATABASE_URL="mongodb://user:password@localhost:27017/cms"

# Auth
JWT_SECRET="your-secret-key"
COOKIE_SECRET="your-cookie-secret"

# Media
UPLOAD_DIR="uploads"
MAX_FILE_SIZE="10MB"

# Optional: External Services
S3_BUCKET=""
S3_REGION=""
S3_ACCESS_KEY=""
S3_SECRET_KEY=""
```

## Quick Start Commands

```bash
# Install dependencies
npm install @sveltecms/core @sveltecms/ui

# Initialize configuration
npx sveltecms init

# Generate types
npx sveltecms generate-types

# Start development server
npm run dev
```

## Configuration Best Practices

1. **Security**:
   - Never commit sensitive data (API keys, passwords)
   - Use environment variables for secrets
   - Enable secure sessions in production
   - Implement proper CORS settings

2. **Performance**:
   - Configure appropriate image sizes
   - Enable caching where possible
   - Optimize media storage settings
   - Use CDN in production

3. **Development**:
   - Use TypeScript for type safety
   - Maintain separate dev/prod configs
   - Document custom configurations
   - Version control your configs

4. **Maintenance**:
   - Regular backups of configuration
   - Monitor resource usage
   - Update dependencies regularly
   - Document all customizations

## Troubleshooting

Common configuration issues and solutions:

1. **Authentication Issues**:
   - Verify JWT_SECRET is set
   - Check provider credentials
   - Confirm CORS settings
   - Validate role permissions

2. **Media Upload Problems**:
   - Check upload directory permissions
   - Verify file size limits
   - Confirm storage provider settings
   - Test media processing config

3. **Database Connectivity**:
   - Validate DATABASE_URL
   - Check connection permissions
   - Verify SSL requirements
   - Test connection timeout

4. **Plugin Errors**:
   - Check plugin compatibility
   - Verify required dependencies
   - Review plugin configuration
   - Check for version conflicts
