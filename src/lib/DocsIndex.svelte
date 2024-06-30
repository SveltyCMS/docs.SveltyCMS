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

	async function fetchDocs(searchQuery: string = '') {
		const res = await fetch(`/api/docs?search=${searchQuery}`);
		docs = await res.json();
		console.log('Fetched Docs:', docs);
	}

	function search() {
		fetchDocs(query);
	}

	// Load the documentation when the component mounts
	onMount(() => {
		fetchDocs();
	});
</script>

<div class="mb-4">
	<input type="text" placeholder="Search documentation..." bind:value={query} on:input={search} class="input" />
</div>

{#if docs.length > 0}
	<Accordion autocollapse>
		{#each docs as doc (doc.path)}
			<AccordionItem>
				<svelte:fragment slot="lead">
					<iconify-icon icon={doc.icon} width="20" class="text-error-500"></iconify-icon>
				</svelte:fragment>
				<svelte:fragment slot="summary">
					<a href={`/docs/${doc.path}`} class="text-terry-500 dark:text-primary-500 hover:underline">
						{doc.title}
					</a>
				</svelte:fragment>
				<svelte:fragment slot="content">
					{#if doc.children && doc.children.length > 0}
						<ul class="pl-4 mt-2 space-y-1">
							{#each doc.children as subDoc}
								<li>
									<a href={`/docs/${subDoc.path}`} class="text-gray-600 dark:text-gray-400 hover:underline">
										{subDoc.title}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</svelte:fragment>
			</AccordionItem>
		{/each}
	</Accordion>
{:else}
	<p class="p-4 text-gray-600 dark:text-gray-400">No documentation available.</p>
{/if}
