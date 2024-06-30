<script lang="ts">
	import { onMount } from 'svelte';
	import PageTitle from '$lib/PageTitle.svelte';

	interface Doc {
		title: string;
		path: string;
		description: string;
		children?: Doc[];
	}

	let docs: Doc[] = [];
	let query = '';

	async function fetchDocs(searchQuery: string = '') {
		const res = await fetch(`/api/docs?search=${searchQuery}`);
		docs = await res.json();
		console.log('Fetched Docs:', docs);
	}

	function search() {
		fetchDocs(query);
	}

	onMount(() => {
		fetchDocs();
	});
</script>

<PageTitle name="SveltyCMS Documentation" icon="mdi:book-open-variant" iconColor="text-terry-500 dark:text-primary-500" iconSize="36" />
<enhanced:img src="../lib/images/SveltyCMS.png" alt="SveltyCMS Logo" class="mx-auto max-w-44 mt-4 mb-8" />

<div class="flex flex-col justify-start items-center text-center">
	<p class="text-lg m-2 mb-10">
		Welcome to the SveltyCMS documentation. Here you'll find comprehensive guides and documentation to help you get started with SveltyCMS and make
		the most of its features.
	</p>
</div>
