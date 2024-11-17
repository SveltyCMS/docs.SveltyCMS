---
title: "SveltyCMS Tutorials"
description: "Step-by-step guides for common SveltyCMS tasks and features"
icon: "mdi:school"
---

# SveltyCMS Tutorials

Practical, step-by-step tutorials to help you master SveltyCMS features and capabilities.

## Basic Tutorials

### 1. Creating Your First Blog

Learn how to create a fully functional blog with posts, categories, and comments.

```typescript
// content-types/blog-post.ts
export default {
  name: 'blog-post',
  fields: {
    title: {
      type: 'string',
      required: true,
      i18n: true,
      validation: {
        minLength: 5,
        maxLength: 100
      }
    },
    slug: {
      type: 'slug',
      from: 'title',
      unique: true
    },
    excerpt: {
      type: 'text',
      i18n: true,
      validation: {
        maxLength: 200
      }
    },
    content: {
      type: 'richtext',
      i18n: true,
      plugins: ['image', 'link', 'table', 'code']
    },
    featuredImage: {
      type: 'image',
      required: true,
      variants: {
        thumbnail: { width: 300, height: 200, fit: 'cover' },
        banner: { width: 1200, height: 400, fit: 'cover' }
      }
    },
    category: {
      type: 'reference',
      to: 'category',
      required: true
    },
    tags: {
      type: 'array',
      of: { type: 'string' },
      validation: {
        maxItems: 5
      }
    },
    author: {
      type: 'reference',
      to: 'user',
      required: true
    },
    publishDate: {
      type: 'date',
      required: true,
      defaultValue: () => new Date()
    },
    status: {
      type: 'select',
      options: ['draft', 'published', 'archived'],
      defaultValue: 'draft'
    }
  },
  hooks: {
    beforeSave: async (doc) => {
      if (!doc.excerpt && doc.content) {
        // Auto-generate excerpt from content
        doc.excerpt = doc.content.substring(0, 197) + '...';
      }
    }
  },
  access: {
    read: true, // Public read access
    create: ({ user }) => user && user.role === 'editor',
    update: ({ user, doc }) => user && (user.role === 'editor' || doc.author === user.id),
    delete: ({ user }) => user && user.role === 'admin'
  }
}
```

### 2. Building a Portfolio Site

Create a professional portfolio with projects, skills, and contact form.

```typescript
// content-types/project.ts
export default {
  name: 'project',
  fields: {
    title: {
      type: 'string',
      required: true,
      i18n: true
    },
    description: {
      type: 'richtext',
      i18n: true
    },
    images: {
      type: 'array',
      of: {
        type: 'image',
        variants: {
          thumbnail: { width: 400, height: 300 },
          full: { width: 1200, height: 900 }
        }
      },
      validation: {
        minItems: 1,
        maxItems: 10
      }
    },
    technologies: {
      type: 'array',
      of: {
        type: 'reference',
        to: 'technology'
      }
    },
    url: {
      type: 'string',
      validation: {
        pattern: '^https?://'
      }
    },
    featured: {
      type: 'boolean',
      defaultValue: false
    },
    completionDate: {
      type: 'date'
    }
  }
}
```

### 3. Setting Up Multi-language Support

Configure and manage content in multiple languages.

```typescript
// config/i18n.ts
export default {
  defaultLocale: 'en',
  locales: [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' }
  ],
  fallbackLocale: 'en',
  localizedPaths: true, // Generates /de/about, /fr/about etc.
  localizedApi: true,   // Enables locale-specific API endpoints
  seo: {
    hreflang: true,     // Adds hreflang meta tags
    redirectDefaultLang: true
  }
}
```

## Advanced Tutorials

### 1. Custom Field Types

Create custom field types for specific needs.

```typescript
// fields/rating.ts
import type { Field } from '@sveltycms/core';

export const RatingField: Field = {
  name: 'rating',
  component: 'RatingInput.svelte',
  validate: (value) => {
    if (typeof value !== 'number') return 'Must be a number';
    if (value < 1 || value > 5) return 'Must be between 1 and 5';
    return true;
  },
  format: (value) => Math.round(value * 2) / 2, // Round to nearest 0.5
  defaultValue: 3
};

// RatingInput.svelte
<script lang="ts">
  export let value = 3;
  export let onChange: (value: number) => void;
  
  const stars = [1, 2, 3, 4, 5];
  
  function handleClick(rating: number) {
    onChange(rating);
  }
</script>

<div class="rating">
  {#each stars as star}
    <button
      class="star"
      class:active={star <= value}
      on:click={() => handleClick(star)}
    >
      ★
    </button>
  {/each}
</div>

<style>
  .rating {
    display: flex;
    gap: 0.25rem;
  }
  
  .star {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #ddd;
  }
  
  .star.active {
    color: #ffd700;
  }
</style>
```

### 2. Custom Widgets

Build dashboard widgets for monitoring and quick actions.

```typescript
// widgets/ContentStats.svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { cms } from '$lib/cms';
  
  let stats = {
    posts: 0,
    drafts: 0,
    published: 0,
    comments: 0
  };
  
  onMount(async () => {
    const [posts, comments] = await Promise.all([
      cms.content.count('post'),
      cms.content.count('comment')
    ]);
    
    const drafts = await cms.content.count('post', {
      status: 'draft'
    });
    
    stats = {
      posts,
      drafts,
      published: posts - drafts,
      comments
    };
  });
</script>

<div class="stats-widget">
  <h3>Content Statistics</h3>
  
  <div class="stats-grid">
    <div class="stat">
      <span class="value">{stats.posts}</span>
      <span class="label">Total Posts</span>
    </div>
    
    <div class="stat">
      <span class="value">{stats.published}</span>
      <span class="label">Published</span>
    </div>
    
    <div class="stat">
      <span class="value">{stats.drafts}</span>
      <span class="label">Drafts</span>
    </div>
    
    <div class="stat">
      <span class="value">{stats.comments}</span>
      <span class="label">Comments</span>
    </div>
  </div>
</div>

<style>
  .stats-widget {
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .stat {
    text-align: center;
  }
  
  .value {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: #0066cc;
  }
  
  .label {
    font-size: 0.875rem;
    color: #666;
  }
</style>
```

### 3. API Integration

Integrate SveltyCMS with external services.

```typescript
// hooks/sendgrid.ts
import { cms } from '@sveltycms/core';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Add hook to contact form submissions
cms.hooks.add('contact.afterCreate', async (doc) => {
  await sgMail.send({
    to: 'admin@example.com',
    from: 'noreply@example.com',
    subject: `New Contact: ${doc.subject}`,
    text: `
      Name: ${doc.name}
      Email: ${doc.email}
      Message: ${doc.message}
    `
  });
});

// Add hook to new user registrations
cms.hooks.add('user.afterCreate', async (user) => {
  await sgMail.send({
    to: user.email,
    from: 'welcome@example.com',
    templateId: 'd-welcome-template',
    dynamicTemplateData: {
      name: user.name,
      loginUrl: `https://example.com/login`
    }
  });
});
```

## Best Practices

1. **Content Modeling**
   - Keep content types focused and specific
   - Use references for related content
   - Plan for internationalization from the start
   - Add validation rules early

2. **Performance**
   - Use image variants appropriately
   - Implement caching strategies
   - Lazy load related content
   - Monitor API response times

3. **Security**
   - Define granular access controls
   - Validate user input
   - Use environment variables for secrets
   - Implement rate limiting

4. **Development Workflow**
   - Use TypeScript for type safety
   - Write tests for custom components
   - Document API changes
   - Follow semantic versioning

## Next Steps

- Explore [Advanced Features](../Advanced_Features/index.md)
- Check [API Reference](../API/index.md)
- Join our [Discord Community](https://discord.gg/sveltycms)
- Contribute to [GitHub](https://github.com/SveltyCMS/SveltyCMS)
