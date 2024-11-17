---
title: "Quick Start Guide"
description: "Get up and running with SveltyCMS in minutes"
icon: "mdi:rocket-launch"
---

# Quick Start Guide

Get up and running with SveltyCMS in minutes. This guide will help you install, configure, and create your first content type.

## Prerequisites

- Node.js 22 or later
- MongoDB 8.0 or later
- Basic knowledge of TypeScript and Svelte
- A text editor (VS Code recommended)

## Installation

1. **Create a New Project**
```bash
# Create new project
npm create sveltycms@latest my-cms

# Navigate to project
cd my-cms

# Install dependencies
npm install
```

2. **Start Development Server**
```bash
# Start MongoDB (if not running)
mongod --dbpath=/data/db

# Start development server
npm run dev
```

Your CMS is now running at `http://localhost:3000`!

## First Steps

### 1. Configure Environment

Create `.env` file:
```env
DATABASE_URL=mongodb://localhost:27017/sveltycms
SESSION_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
```

### 2. Create Admin User
```bash
# Create admin user
npx sveltycms user create --email admin@example.com --password your-password --role admin
```

### 3. Create Content Type

Create `content-types/article.ts`:
```typescript
export default {
  name: 'article',
  fields: {
    title: {
      type: 'string',
      required: true,
      i18n: true
    },
    slug: {
      type: 'slug',
      from: 'title'
    },
    content: {
      type: 'richtext',
      i18n: true
    },
    image: {
      type: 'image'
    },
    author: {
      type: 'reference',
      to: 'user'
    },
    tags: {
      type: 'array',
      of: { type: 'string' }
    },
    status: {
      type: 'select',
      options: ['draft', 'published']
    }
  },
  hooks: {
    beforeSave: async (doc) => {
      // Custom logic before saving
    },
    afterSave: async (doc) => {
      // Custom logic after saving
    }
  }
}
```

### 4. Create API Route

Create `routes/api/articles/+server.ts`:
```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { cms } from '$lib/cms';

export const GET: RequestHandler = async ({ url }) => {
  const articles = await cms.content.find('article', {
    status: 'published'
  });
  
  return json(articles);
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const article = await cms.content.create('article', data);
  
  return json(article);
};
```

### 5. Create Frontend Page

Create `routes/articles/+page.svelte`:
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let articles = [];
  
  onMount(async () => {
    const response = await fetch('/api/articles');
    articles = await response.json();
  });
</script>

<h1>Articles</h1>

{#each articles as article}
  <article>
    <h2>{article.title}</h2>
    {#if article.image}
      <img src={article.image.url} alt={article.image.alt} />
    {/if}
    <div class="content">
      {@html article.content}
    </div>
    <footer>
      <span>By {article.author.name}</span>
      <span>Tags: {article.tags.join(', ')}</span>
    </footer>
  </article>
{/each}

<style>
  article {
    margin: 2rem 0;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  footer {
    margin-top: 1rem;
    color: #666;
  }
</style>
```

## Basic Features

### 1. Authentication

Create `routes/login/+page.svelte`:
```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let error = '';
  
  async function login() {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        goto('/admin');
      } else {
        error = 'Invalid credentials';
      }
    } catch (e) {
      error = e.message;
    }
  }
</script>

<form on:submit|preventDefault={login}>
  <h1>Login</h1>
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  <div class="field">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      required
    />
  </div>
  
  <div class="field">
    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      bind:value={password}
      required
    />
  </div>
  
  <button type="submit">Login</button>
</form>

<style>
  form {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .field {
    margin: 1rem 0;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .error {
    color: red;
    margin-bottom: 1rem;
  }
</style>
```

### 2. Media Upload

Create `routes/admin/media/+page.svelte`:
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  
  let files: FileList;
  let uploading = false;
  let progress = 0;
  let media = [];
  
  onMount(async () => {
    const response = await fetch('/api/media');
    media = await response.json();
  });
  
  async function uploadFiles() {
    uploading = true;
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          media = [...media, result];
        }
      } catch (e) {
        console.error('Upload failed:', e);
      }
      
      progress = (Array.from(files).indexOf(file) + 1) / files.length * 100;
    }
    
    uploading = false;
    progress = 0;
  }
</script>

<div class="media-upload">
  <h1>Media Library</h1>
  
  <div class="upload-zone">
    <input
      type="file"
      bind:files
      multiple
      accept="image/*,video/*,application/pdf"
    />
    <button on:click={uploadFiles} disabled={!files || uploading}>
      Upload Files
    </button>
  </div>
  
  {#if uploading}
    <div class="progress">
      <div class="bar" style="width: {progress}%"></div>
    </div>
  {/if}
  
  <div class="media-grid">
    {#each media as item}
      <div class="media-item">
        {#if item.type.startsWith('image')}
          <img src={item.url} alt={item.alt || ''} />
        {:else}
          <div class="file-icon">{item.type}</div>
        {/if}
        <div class="media-info">
          <span>{item.filename}</span>
          <span>{(item.size / 1024).toFixed(1)} KB</span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .media-upload {
    padding: 2rem;
  }
  
  .upload-zone {
    margin: 2rem 0;
    padding: 2rem;
    border: 2px dashed #ddd;
    border-radius: 4px;
    text-align: center;
  }
  
  .progress {
    margin: 1rem 0;
    height: 20px;
    background: #eee;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .bar {
    height: 100%;
    background: #0066cc;
    transition: width 0.3s ease;
  }
  
  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .media-item {
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .media-item img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .file-icon {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
  }
  
  .media-info {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
</style>
```

### 3. Content Editor

Create `routes/admin/content/[type]/+page.svelte`:
```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { Editor } from '@sveltycms/editor';
  
  const type = $page.params.type;
  let content = null;
  let saving = false;
  
  onMount(async () => {
    const response = await fetch(`/api/content/${type}`);
    content = await response.json();
  });
  
  async function saveContent(event) {
    saving = true;
    
    try {
      const response = await fetch(`/api/content/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event.detail)
      });
      
      if (response.ok) {
        content = await response.json();
      }
    } catch (e) {
      console.error('Save failed:', e);
    }
    
    saving = false;
  }
</script>

<div class="content-editor">
  <h1>Edit {type}</h1>
  
  {#if content}
    <Editor
      {type}
      {content}
      on:save={saveContent}
      disabled={saving}
    />
  {/if}
</div>

<style>
  .content-editor {
    padding: 2rem;
  }
</style>
```

## Next Steps

1. **Customize Admin UI**
   - Create custom dashboard
   - Add widgets
   - Style admin interface

2. **Add Features**
   - User management
   - Workflow
   - Comments
   - Search

3. **Optimize**
   - Add caching
   - Configure CDN
   - Set up monitoring

4. **Deploy**
   - Set up production server
   - Configure SSL
   - Set up backups

## Need Help?

- Check [Documentation](../index.md)
- Join [Discord](https://discord.gg/sveltycms)
- Open [Issue](https://github.com/SveltyCMS/SveltyCMS/issues)
- Contact [Support](mailto:support@sveltycms.com)
