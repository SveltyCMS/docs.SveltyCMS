<script lang="ts">
	import { sidebarState } from '$lib/store/sidebarStore';
	import DocsIndex from '$lib/DocsIndex.svelte';

	// Get the left sidebar state reactively
	$: leftSidebarState = $sidebarState.left;
</script>

<div
	class={`fixed top-18 left-0 h-full bg-slate dark:bg-surface-700 border-r border-primary-500 shadow-lg transform transition-transform duration-300 ease-in-out ${leftSidebarState === 'hidden' ? '-translate-x-full' : 'translate-x-0'} w-64`}
>
	<h2 class="mb-2 text-xl font-bold text-center mt-1 dark:text-white">Documentation Index</h2>
	<!-- Search Index -->
	<div class="px-2"><DocsIndex /></div>
</div>
