<script lang="ts">
	export let data: { content: string; frontMatter: { title: string; description: string; icon: string }; path: string };
</script>

<svelte:head>
	<title>{data.frontMatter?.title || 'Documentation'}</title>
	<meta name="description" content={data.frontMatter?.description || ''} />
</svelte:head>

<article class="p-2 prose prose-slate xl:prose-lg dark:prose-invert max-w-none">
	{#if data.frontMatter?.title}
		<h1 class="mb-4">{data.frontMatter.title}</h1>
	{/if}
	{#if data.frontMatter?.description}
		<p class="lead text-lg mb-8">{data.frontMatter.description}</p>
	{/if}
	{@html data.content}
</article>

<style>
	:global(.prose) {
		max-width: none;
	}
	
	:global(.prose h1) {
		margin-bottom: 1rem;
	}

	:global(.prose .lead) {
		font-size: 1.25rem;
		margin-bottom: 2rem;
		color: var(--color-primary-500);
	}

	:global(.prose pre) {
		background-color: rgb(30 41 59 / 0.8);
		padding: 1rem;
		border-radius: 0.5rem;
		margin: 1.5rem 0;
	}

	:global(.prose code) {
		color: #e2e8f0;
	}
</style>
