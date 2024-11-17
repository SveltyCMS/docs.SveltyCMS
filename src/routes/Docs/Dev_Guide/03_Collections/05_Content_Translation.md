# Content Translation

SvelteCMS provides a robust system for managing multilingual content through its translation management system. This document outlines how to configure, manage, and work with translated content.

## Translation Configuration

### Collection Translation Settings

```typescript
interface TranslationConfig {
    // Enable/disable translation for this collection
    enabled: boolean;
    
    // Default language for content
    defaultLanguage: string;
    
    // Supported languages
    languages: {
        code: string;        // ISO language code
        name: string;        // Display name
        direction: 'ltr' | 'rtl'; // Text direction
        active: boolean;     // Language availability
    }[];
    
    // Translation behavior
    behavior: {
        fallbackLanguage: string;    // Fallback when translation missing
        autoTranslate: boolean;      // Enable automatic translation
        requireApproval: boolean;    // Require review before publishing
        inheritMetadata: boolean;    // Copy metadata to translations
    };
    
    // Field configuration
    fields: {
        [fieldName: string]: {
            translatable: boolean;   // Whether field can be translated
            copyOnCreate: boolean;   // Copy original value on creation
            validation: any;         // Language-specific validation
        };
    };
}
```

### Implementation Example

```typescript
// collections/blog.ts
export const BlogCollection: Collection = {
    name: 'blog',
    translation: {
        enabled: true,
        defaultLanguage: 'en',
        languages: [
            { code: 'en', name: 'English', direction: 'ltr', active: true },
            { code: 'de', name: 'German', direction: 'ltr', active: true },
            { code: 'ar', name: 'Arabic', direction: 'rtl', active: true }
        ],
        behavior: {
            fallbackLanguage: 'en',
            autoTranslate: false,
            requireApproval: true,
            inheritMetadata: true
        },
        fields: {
            title: {
                translatable: true,
                copyOnCreate: false,
                validation: { required: true }
            },
            content: {
                translatable: true,
                copyOnCreate: false,
                validation: { required: true }
            },
            slug: {
                translatable: true,
                copyOnCreate: true,
                validation: { required: true }
            },
            tags: {
                translatable: false,
                copyOnCreate: true
            }
        }
    }
};
```

## Translation Management

### Translation Status

```typescript
interface TranslationStatus {
    // Status types
    type: 'draft' | 'inProgress' | 'review' | 'published' | 'outdated';
    
    // Translation metadata
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        translator: string;
        reviewer: string;
        publishedAt?: Date;
        originalUpdatedAt: Date;  // For outdated detection
    };
    
    // Completion tracking
    completion: {
        translated: number;     // Number of translated fields
        total: number;         // Total translatable fields
        percentage: number;    // Completion percentage
    };
    
    // Quality metrics
    quality: {
        reviewed: boolean;
        score?: number;
        issues: TranslationIssue[];
    };
}

interface TranslationIssue {
    field: string;
    type: 'missing' | 'outdated' | 'error';
    message: string;
    severity: 'low' | 'medium' | 'high';
}
```

### Translation Workflow

```typescript
// lib/translation/workflow.ts
export class TranslationWorkflow {
    async createTranslation(
        document: Document,
        language: string
    ): Promise<Translation> {
        // Initialize translation
        const translation = await initializeTranslation(document, language);
        
        // Copy non-translatable fields
        await copyNonTranslatableFields(document, translation);
        
        // Set initial status
        translation.status = {
            type: 'draft',
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                translator: getCurrentUser().id,
                originalUpdatedAt: document.updatedAt
            },
            completion: calculateCompletion(translation),
            quality: { reviewed: false, issues: [] }
        };
        
        return translation;
    }
    
    async updateTranslation(
        translation: Translation,
        updates: Partial<Translation>
    ): Promise<Translation> {
        // Apply updates
        const updated = await applyTranslationUpdates(translation, updates);
        
        // Update status
        updated.status.metadata.updatedAt = new Date();
        updated.status.completion = calculateCompletion(updated);
        
        // Check if original content has been updated
        if (isOriginalUpdated(updated)) {
            updated.status.type = 'outdated';
        }
        
        // Validate translation
        const issues = await validateTranslation(updated);
        updated.status.quality.issues = issues;
        
        return updated;
    }
    
    async submitForReview(translation: Translation): Promise<Translation> {
        // Validate translation is complete
        if (!isTranslationComplete(translation)) {
            throw new Error('Translation must be complete before review');
        }
        
        // Update status
        translation.status.type = 'review';
        
        // Notify reviewers
        await notifyReviewers(translation);
        
        return translation;
    }
    
    async publishTranslation(translation: Translation): Promise<Translation> {
        // Validate translation is reviewed
        if (!isTranslationReviewed(translation)) {
            throw new Error('Translation must be reviewed before publishing');
        }
        
        // Update status
        translation.status.type = 'published';
        translation.status.metadata.publishedAt = new Date();
        
        // Update search index
        await updateSearchIndex(translation);
        
        return translation;
    }
}
```

## Translation API

### REST Endpoints

```typescript
// routes/api/translations/[id]/+server.ts
export const GET: RequestHandler = async ({ params }) => {
    const translation = await getTranslation(params.id);
    return json(translation);
};

export const PUT: RequestHandler = async ({ params, request }) => {
    const updates = await request.json();
    const translation = await updateTranslation(params.id, updates);
    return json(translation);
};

export const POST: RequestHandler = async ({ params, request }) => {
    const { language } = await request.json();
    const translation = await createTranslation(params.id, language);
    return json(translation);
};
```

### GraphQL Schema

```graphql
type Translation {
    id: ID!
    language: String!
    document: Document!
    fields: JSONObject!
    status: TranslationStatus!
    metadata: TranslationMetadata!
}

type TranslationStatus {
    type: TranslationStatusType!
    metadata: TranslationStatusMetadata!
    completion: TranslationCompletion!
    quality: TranslationQuality!
}

enum TranslationStatusType {
    DRAFT
    IN_PROGRESS
    REVIEW
    PUBLISHED
    OUTDATED
}

type TranslationMetadata {
    createdAt: DateTime!
    updatedAt: DateTime!
    translator: User!
    reviewer: User
    publishedAt: DateTime
    originalUpdatedAt: DateTime!
}

type TranslationCompletion {
    translated: Int!
    total: Int!
    percentage: Float!
}

type TranslationQuality {
    reviewed: Boolean!
    score: Float
    issues: [TranslationIssue!]!
}

type TranslationIssue {
    field: String!
    type: TranslationIssueType!
    message: String!
    severity: TranslationIssueSeverity!
}

enum TranslationIssueType {
    MISSING
    OUTDATED
    ERROR
}

enum TranslationIssueSeverity {
    LOW
    MEDIUM
    HIGH
}
```

## Translation UI Components

### Translation Manager

```svelte
<!-- components/translation/TranslationManager.svelte -->
<script lang="ts">
    import { createTranslation, updateTranslation } from '$lib/translation';
    import type { Document, Translation } from '$lib/types';
    
    export let document: Document;
    
    let translations: Translation[] = [];
    let selectedLanguage: string | null = null;
    
    async function handleCreateTranslation() {
        if (!selectedLanguage) return;
        
        const translation = await createTranslation(document.id, selectedLanguage);
        translations = [...translations, translation];
    }
    
    async function handleUpdateTranslation(translation: Translation) {
        const updated = await updateTranslation(translation.id, translation);
        translations = translations.map(t => 
            t.id === updated.id ? updated : t
        );
    }
</script>

<div class="translation-manager">
    <!-- Language selector -->
    <select bind:value={selectedLanguage}>
        {#each availableLanguages as language}
            <option value={language.code}>{language.name}</option>
        {/each}
    </select>
    
    <button on:click={handleCreateTranslation}>
        Create Translation
    </button>
    
    <!-- Translation list -->
    <div class="translations">
        {#each translations as translation}
            <TranslationCard
                {translation}
                on:update={handleUpdateTranslation}
            />
        {/each}
    </div>
</div>
```

### Translation Status Badge

```svelte
<!-- components/translation/TranslationStatus.svelte -->
<script lang="ts">
    import type { TranslationStatus } from '$lib/types';
    
    export let status: TranslationStatus;
    
    $: statusClass = `status-${status.type}`;
    $: statusText = getStatusText(status);
    $: statusIcon = getStatusIcon(status);
</script>

<div class="translation-status {statusClass}">
    <span class="icon">{statusIcon}</span>
    <span class="text">{statusText}</span>
    
    {#if status.completion}
        <div class="completion">
            {status.completion.percentage}%
        </div>
    {/if}
    
    {#if status.quality.issues.length > 0}
        <div class="issues">
            {status.quality.issues.length} issues
        </div>
    {/if}
</div>

<style>
    .translation-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
    }
    
    .status-draft { background: var(--color-gray-100); }
    .status-inProgress { background: var(--color-blue-100); }
    .status-review { background: var(--color-yellow-100); }
    .status-published { background: var(--color-green-100); }
    .status-outdated { background: var(--color-red-100); }
</style>
```

## Best Practices

1. **Translation Workflow**:
   - Establish clear translation processes
   - Define review requirements
   - Set up quality checks
   - Monitor translation status

2. **Content Management**:
   - Keep translations synchronized
   - Track content changes
   - Maintain version history
   - Handle outdated translations

3. **User Experience**:
   - Provide clear language indicators
   - Show translation progress
   - Display quality metrics
   - Enable easy language switching

4. **Performance**:
   - Optimize translation loading
   - Cache translated content
   - Lazy load translations
   - Monitor resource usage

5. **Quality Assurance**:
   - Implement validation rules
   - Set up review processes
   - Track translation metrics
   - Monitor translation quality
