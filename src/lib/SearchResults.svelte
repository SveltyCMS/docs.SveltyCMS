<script lang="ts">
	import { searchQuery } from '@src/lib/store/stores';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	let docs = writable([]);

	async function fetchDocs(query: string) {
		const res = await fetch(`/api/docs?search=${encodeURIComponent(query)}`);
		const data = await res.json();
		docs.set(data);
	}

	onMount(() => {
		// Fetch docs initially without any query
		fetchDocs('');

		// Subscribe to searchQuery store and fetch docs on change
		const unsubscribe = searchQuery.subscribe((query) => {
			fetchDocs(query);
		});

		return () => {
			unsubscribe();
		};
	});
</script>

<div class="search-results">
	<ul>
		{#each $docs as doc}
			<li><a href={doc.path}>{doc.title}</a></li>
		{/each}
	</ul>
</div>

<style>
	.search-results {
		margin-top: 20px;
	}
	.search-results ul {
		list-style: none;
		padding: 0;
	}
	.search-results li {
		padding: 10px 0;
	}
	.search-results li a {
		text-decoration: none;
		color: black;
	}
	.search-results li a:hover {
		text-decoration: underline;
	}
</style>
