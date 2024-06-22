<script lang="ts">
	import { onMount } from 'svelte';

	// Components
	import { getDocs, searchDocs } from '$lib/docsIndex';
	import type { Doc } from '$lib/docsIndex';
	import PageTitle from '@src/lib/PageTitle.svelte';

	let docs: Doc[] = [];
	let query = '';

	function search() {
		docs = searchDocs(query);
	}

	onMount(() => {
		docs = getDocs();
	});
</script>

<PageTitle name="SveltyCMS Documentation" icon="mdi:book-open-variant" iconColor="text-terry-500 dark:text-primary-500" iconSize="36" />
<enhanced:img src="../lib/images/SveltyCMS.png" alt="SveltyCMS Logo" class="mx-auto max-w-44 mt-4 mb-8" />

<div class="flex flex-col justify-start items-center text-center">
	<p class="text-lg m-2 mb-10">
		Welcome to the SveltyCMS documentation. Here you'll find comprehensive guides and documentation to help you get started with SveltyCMS and make
		the most of its features.
	</p>
	<p class="text-error-500">Documentation Coming Soon !!</p>
	<!-- Search Bar -->
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] max-w-lg">
		<div class="input-group-shim"><iconify-icon icon="material-symbols:search"></iconify-icon></div>
		<input bind:value={query} on:input={search} type="search" placeholder="Search documentation..." class="placeholder:text-primary-500 input" />
		<button class="variant-filled-surface dark:variant-filled-primary">Submit</button>
	</div>

	<!-- Documentation Links -->
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
		{#each docs as doc}
			<a href={`/docs/auth${doc.path}`} class="p-6 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
				<h2 class="text-2xl font-semibold mb-2">{doc.title}</h2>
				<p class="text-gray-600 dark:text-gray-300">{doc.description}</p>
			</a>
		{/each}
	</div>
</div>
