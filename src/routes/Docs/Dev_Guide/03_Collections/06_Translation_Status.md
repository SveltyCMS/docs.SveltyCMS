# Translation Status Management

SvelteCMS provides comprehensive tools for managing and monitoring the status of translated content. This document outlines the translation status system and its implementation.

## Status Types

### Translation States

```typescript
type TranslationState = {
    // Basic status information
    status: 'draft' | 'inProgress' | 'review' | 'published' | 'outdated';
    
    // Language information
    sourceLanguage: string;
    targetLanguage: string;
    
    // Progress tracking
    progress: {
        translatedFields: number;
        totalFields: number;
        completionPercentage: number;
        remainingFields: string[];
    };
    
    // Quality metrics
    quality: {
        reviewed: boolean;
        score?: number;
        lastReviewDate?: Date;
        reviewer?: string;
        issues: TranslationIssue[];
    };
    
    // Timestamps
    timestamps: {
        created: Date;
        lastModified: Date;
        published?: Date;
        lastReviewed?: Date;
        originalLastModified: Date;
    };
    
    // Workflow
    workflow: {
        currentStep: string;
        nextStep: string;
        assignee?: string;
        dueDate?: Date;
        priority: 'low' | 'medium' | 'high';
    };
};
```

## Status Tracking

### Status Manager

```typescript
// lib/translation/status.ts
export class TranslationStatusManager {
    async getStatus(translationId: string): Promise<TranslationState> {
        const translation = await getTranslation(translationId);
        const original = await getOriginalDocument(translation.documentId);
        
        return {
            status: calculateStatus(translation, original),
            sourceLanguage: original.language,
            targetLanguage: translation.language,
            progress: calculateProgress(translation),
            quality: await assessQuality(translation),
            timestamps: getTimestamps(translation),
            workflow: await getWorkflowState(translation)
        };
    }
    
    async updateStatus(
        translationId: string,
        updates: Partial<TranslationState>
    ): Promise<TranslationState> {
        // Validate status update
        validateStatusUpdate(updates);
        
        // Apply updates
        const updated = await applyStatusUpdates(translationId, updates);
        
        // Trigger notifications
        await notifyStatusChange(updated);
        
        return updated;
    }
    
    async calculateProgress(translation: Translation): Promise<Progress> {
        const fields = getTranslatableFields(translation);
        const translated = countTranslatedFields(translation);
        
        return {
            translatedFields: translated,
            totalFields: fields.length,
            completionPercentage: (translated / fields.length) * 100,
            remainingFields: fields.filter(f => !isFieldTranslated(translation, f))
        };
    }
    
    async assessQuality(translation: Translation): Promise<Quality> {
        const issues = await validateTranslation(translation);
        const score = calculateQualityScore(translation, issues);
        
        return {
            reviewed: isReviewed(translation),
            score,
            issues,
            lastReviewDate: translation.lastReviewDate,
            reviewer: translation.reviewer
        };
    }
}
```

## Status Monitoring

### Status Dashboard

```svelte
<!-- components/translation/StatusDashboard.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { TranslationStatusManager } from '$lib/translation/status';
    
    export let collectionId: string;
    
    let translations: Translation[] = [];
    let stats: TranslationStats;
    
    const statusManager = new TranslationStatusManager();
    
    onMount(async () => {
        translations = await loadTranslations(collectionId);
        stats = calculateStats(translations);
    });
    
    function calculateStats(translations: Translation[]): TranslationStats {
        return {
            total: translations.length,
            byStatus: groupByStatus(translations),
            byLanguage: groupByLanguage(translations),
            completionRate: calculateCompletionRate(translations),
            qualityMetrics: calculateQualityMetrics(translations)
        };
    }
</script>

<div class="status-dashboard">
    <!-- Summary statistics -->
    <div class="summary">
        <div class="stat">
            <h3>Total Translations</h3>
            <p>{stats.total}</p>
        </div>
        
        <div class="stat">
            <h3>Completion Rate</h3>
            <p>{stats.completionRate}%</p>
        </div>
        
        <div class="stat">
            <h3>Average Quality</h3>
            <p>{stats.qualityMetrics.averageScore}</p>
        </div>
    </div>
    
    <!-- Status breakdown -->
    <div class="status-breakdown">
        <h3>Translation Status</h3>
        <StatusChart data={stats.byStatus} />
    </div>
    
    <!-- Language breakdown -->
    <div class="language-breakdown">
        <h3>Languages</h3>
        <LanguageChart data={stats.byLanguage} />
    </div>
    
    <!-- Translation list -->
    <div class="translation-list">
        <h3>Recent Translations</h3>
        <TranslationList {translations} />
    </div>
</div>

<style>
    .status-dashboard {
        display: grid;
        gap: 2rem;
        padding: 1rem;
    }
    
    .summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .stat {
        padding: 1rem;
        background: var(--color-surface);
        border-radius: 8px;
        box-shadow: var(--shadow-sm);
    }
</style>
```

### Status Notifications

```typescript
// lib/translation/notifications.ts
export class TranslationNotificationService {
    async notifyStatusChange(
        translation: Translation,
        oldStatus: TranslationState,
        newStatus: TranslationState
    ): Promise<void> {
        // Determine notification type
        const type = determineNotificationType(oldStatus, newStatus);
        
        // Get notification recipients
        const recipients = await getNotificationRecipients(translation, type);
        
        // Create notification
        const notification = createNotification({
            type,
            translation,
            oldStatus,
            newStatus,
            timestamp: new Date()
        });
        
        // Send notifications
        await sendNotifications(notification, recipients);
    }
    
    async subscribeToUpdates(
        userId: string,
        filters: NotificationFilters
    ): Promise<Subscription> {
        // Create subscription
        const subscription = await createSubscription(userId, filters);
        
        // Set up real-time updates
        await setupRealtimeUpdates(subscription);
        
        return subscription;
    }
}
```

## Status Reports

### Report Generation

```typescript
// lib/translation/reports.ts
export class TranslationReportGenerator {
    async generateStatusReport(
        collectionId: string,
        options: ReportOptions
    ): Promise<TranslationReport> {
        // Gather translation data
        const translations = await loadTranslations(collectionId);
        
        // Calculate metrics
        const metrics = calculateMetrics(translations);
        
        // Generate insights
        const insights = analyzeTranslations(translations, metrics);
        
        // Create report
        return {
            collection: collectionId,
            timestamp: new Date(),
            metrics,
            insights,
            recommendations: generateRecommendations(insights)
        };
    }
    
    async exportReport(
        report: TranslationReport,
        format: 'pdf' | 'csv' | 'json'
    ): Promise<Buffer> {
        // Format report
        const formatted = formatReport(report, format);
        
        // Generate export
        return await generateExport(formatted, format);
    }
}
```

## Best Practices

### Status Management

1. **Regular Monitoring**:
   - Track translation progress
   - Monitor quality metrics
   - Review status changes
   - Set up alerts

2. **Workflow Optimization**:
   - Define clear status transitions
   - Automate status updates
   - Set up approval processes
   - Track deadlines

3. **Quality Control**:
   - Implement quality checks
   - Track review status
   - Monitor error rates
   - Set quality thresholds

4. **Reporting**:
   - Generate regular reports
   - Track key metrics
   - Analyze trends
   - Share insights

5. **Communication**:
   - Set up notifications
   - Keep stakeholders informed
   - Document status changes
   - Provide clear updates
