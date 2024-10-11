<script lang="ts">
	export let data: { content: string; frontMatter: { title: string; description: string; icon: string }; path: string };
</script>

<svelte:head>
	<title>{data.frontMatter.title}</title>
	<meta name="description" content={data.frontMatter.description} />
</svelte:head>

<article class="p-2 prose prose-slate xl:prose-lg dark:prose-invert">
	<h1>{data.frontMatter.title}</h1>
	<p class="lead">{data.frontMatter.description}</p>
	{@html data.content}
</article>
