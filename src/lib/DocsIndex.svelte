<!--
@file src/lib/DocsIndex.svelte
@component
**DocsIndex - displays a list of documentation items fetched from the API**
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { Accordion, AccordionItem, TabGroup, Tab } from '@skeletonlabs/skeleton';

	interface Doc {
		icon: string;
		title: string;
		path: string;
		description: string;
		published?: boolean;
		type?: 'user' | 'dev';
		section?: string;
		order?: number;
	}

	let docs: Doc[] = [];
	let userDocs: Doc[] = [];
	let devDocs: Doc[] = [];
	let query = '';
	let isLoading = false;
	let error = '';
	let searchTimeout: ReturnType<typeof setTimeout>;
	let activeTab = 0;

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
			const [userRes, devRes] = await Promise.all([
				fetch(`/api/docs?search=${searchQuery}&type=user`),
				fetch(`/api/docs?search=${searchQuery}&type=dev`)
			]);

			if (!userRes.ok || !devRes.ok) throw new Error('Failed to fetch docs');
			
			userDocs = await userRes.json();
			devDocs = await devRes.json();
			docs = activeTab === 0 ? userDocs : devDocs;
		} catch (err) {
			console.error('Error fetching docs:', err);
			error = 'Failed to load documentation';
		} finally {
			isLoading = false;
		}
	}

	function search() {
		fetchDocs(query);
	}

	function handleTabChange(event: CustomEvent<number>) {
		activeTab = event.detail;
		docs = activeTab === 0 ? userDocs : devDocs;
	}

	function groupBySection(docs: Doc[]): { section: string; docs: Doc[] }[] {
		const sections = new Map<string, Doc[]>();
		
		docs.forEach(doc => {
			const section = doc.section || 'Other';
			if (!sections.has(section)) {
				sections.set(section, []);
			}
			sections.get(section)?.push(doc);
		});

		return Array.from(sections.entries())
			.map(([section, docs]) => ({ section, docs }))
			.sort((a, b) => a.section.localeCompare(b.section));
	}

	onMount(() => {
		fetchDocs();
	});
</script>

<div class="docs-index flex flex-col h-full">
	<div class="sticky top-0 z-10 bg-surface-100-800-token">
		<div class="p-4 border-b border-surface-500/30">
			<input
				type="text"
				placeholder="Search documentation..."
				bind:value={query}
				on:input={debouncedSearch}
				class="input variant-outlined-primary w-full"
			/>
		</div>

		<div class="border-b border-surface-500/30">
			<TabGroup justify="justify-start" active="variant-filled-primary" hover="hover:variant-soft-primary">
				<Tab bind:group={activeTab} name="tab1" value={0} on:click={() => handleTabChange({ detail: 0 })}>
					<span class="flex items-center gap-2">
						<iconify-icon icon="mdi:account" width="20" />
						User Guide
					</span>
				</Tab>
				<Tab bind:group={activeTab} name="tab2" value={1} on:click={() => handleTabChange({ detail: 1 })}>
					<span class="flex items-center gap-2">
						<iconify-icon icon="mdi:code-braces" width="20" />
						Developer Guide
					</span>
				</Tab>
			</TabGroup>
		</div>
	</div>

	<div class="flex-1 overflow-y-auto">
		{#if isLoading}
			<p class="p-4">Loading documentation...</p>
		{:else if error}
			<p class="p-4 text-error-500">{error}</p>
		{:else if docs.length > 0}
			<Accordion class="!border-none">
				{#each groupBySection(docs) as { section, docs }}
					<AccordionItem class="!border-none">
						<svelte:fragment slot="lead">
							<iconify-icon icon="mdi:folder" width="20" class="text-primary-500" />
						</svelte:fragment>
						<svelte:fragment slot="summary">{section}</svelte:fragment>
						<svelte:fragment slot="content">
							<div class="space-y-2">
								{#each docs as doc}
									<div class="flex items-center gap-2 py-1 pl-4">
										<iconify-icon icon={doc.icon} width="20" class="text-error-500" aria-hidden="true" />
										<a href="/Docs/{doc.path}" class="text-terry-500 dark:text-primary-500 hover:underline">
											{doc.title}
										</a>
									</div>
								{/each}
							</div>
						</svelte:fragment>
					</AccordionItem>
				{/each}
			</Accordion>
		{:else}
			<p class="p-4">No documentation available.</p>
		{/if}
	</div>
</div>

<style>
	.docs-index {
		height: 100vh;
		max-height: 100vh;
	}

	/* Make the search and tabs sticky at the top */
	.sticky {
		position: sticky;
		top: 0;
		z-index: 10;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.overflow-y-auto::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.overflow-y-auto {
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
	}

	/* Remove default accordion borders */
	:global(.docs-index .accordion-item) {
		border: none !important;
	}

	:global(.docs-index .accordion) {
		border: none !important;
	}
</style>
