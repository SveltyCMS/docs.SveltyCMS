<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import MarkdownIt from 'markdown-it';

	export let data: { content: string; path: string };

	const htmlContent = writable<string>('');
	const md = new MarkdownIt();

	onMount(() => {
		htmlContent.set(md.render(data.content));
	});
</script>

<svelte:head>
	<title>{data.path}</title>
	<meta name="description" content="Documentation for {data.path}" />
</svelte:head>

<div class="markdown">
	{@html $htmlContent}
</div>
