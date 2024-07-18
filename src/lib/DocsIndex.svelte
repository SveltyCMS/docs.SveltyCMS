<script lang="ts">
	import { onMount } from 'svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	interface Doc {
		icon: string;
		title: string;
		path: string;
		description: string;
		children?: Doc[];
	}

	let docs: Doc[] = [];
	let query = '';
	let isLoading = false;
	let error = '';
	let searchTimeout: ReturnType<typeof setTimeout>;

	function debounce(func: Function, delay: number) {
		return (...args: any[]) => {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => func(...args), delay);
		};
	}

	const debouncedSearch = debounce(search, 300);

	async function fetchDocs(searchQuery: string = '') {
		isLoading = true;
		error = '';
		try {
			const res = await fetch(`/api/docs?search=${searchQuery}`);
			if (!res.ok) throw new Error('Failed to fetch docs');
			docs = await res.json();
			console.log('Fetched Docs:', docs);
		} catch (err) {
			console.error('Error fetching docs:', err);
			error = 'Failed to load documentation. Please try again later.';
		} finally {
			isLoading = false;
		}
	}

	function search() {
		fetchDocs(query);
	}

	onMount(() => {
		fetchDocs();
	});
</script>

<div class="mb-4">
	<input
		type="text"
		placeholder="Search documentation..."
		bind:value={query}
		on:input={debouncedSearch}
		class="input variant-outlined-primary"
		aria-label="Search documentation"
	/>
</div>

{#if isLoading}
	<p class="p-4 text-gray-600 dark:text-gray-400">Loading documentation...</p>
{:else if error}
	<p class="p-4 text-error-500">{error}</p>
{:else if docs.length > 0}
	<Accordion autocollapse>
		<ol class="list-decimal list-inside">
			{#each docs as doc (doc.path)}
				<AccordionItem>
					<svelte:fragment slot="lead">
						<iconify-icon icon={doc.icon} width="20" class="text-error-500" aria-hidden="true"></iconify-icon>
					</svelte:fragment>
					<svelte:fragment slot="summary">
						<a href={`/docs/${doc.path.replace(/\.md$/, '')}`} class="text-terry-500 dark:text-primary-500 hover:underline">
							{doc.title}
						</a>
					</svelte:fragment>
					<svelte:fragment slot="content">
						{#if doc.children && doc.children.length > 0}
							<ol class="list-decimal list-inside pl-4 mt-2 space-y-1">
								{#each doc.children as subDoc}
									<li>
										<a href={`/docs/${subDoc.path}`} class="text-gray-600 dark:text-gray-400 hover:underline">
											{subDoc.title}
										</a>
									</li>
								{/each}
							</ol>
						{/if}
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</ol>
	</Accordion>
{:else}
	<p class="p-4 text-gray-600 dark:text-gray-400">No documentation available.</p>
{/if}
