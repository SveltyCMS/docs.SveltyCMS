<!-- 
@file AppBar component with navigation including menu toggle, dark mode, and marketplace link.
@component
**HeaderBar - displays a navigation bar with menu toggle, dark mode, and marketplace link**
This component renders the header with a logo, dark mode toggle, marketplace link, 
GitHub link, and a language switcher. It includes a responsive sidebar menu for mobile screens
-->

<script lang="ts">
	import { get } from 'svelte/store';
	import { screenWidth, ScreenWidth, toggleSidebar, sidebarState } from '$lib/store/sidebarStore'; // Import necessary functions and stores

	// Components
	import { toggleDarkMode } from '$lib/darkMode';
	import LanguageSwitcher from '@src/lib/LanguageSwitcher.svelte';

	// Skeleton
	import { AppBar } from '@skeletonlabs/skeleton';

	// Paraglide JS
	import * as m from '$lib/paraglide/messages.js';

	// Function to toggle the sidebar
	function toggleMenu() {
		const currentState = get(sidebarState);
		const newState = currentState.left === 'full' ? 'hidden' : 'full';
		toggleSidebar('left', newState);
	}
</script>

<div class="border-b dark:border-primary-500 drop-shadow-2xl">
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end" class="bg-white dark:bg-surface-900">
		<svelte:fragment slot="lead">
			<div class="mb-3 flex items-center">
				<!-- Hamburger -->
				{#if $screenWidth === ScreenWidth.Mobile}
					<button type="button" on:click={toggleMenu} class="variant-ghost-surface btn-icon mt-1">
						<iconify-icon icon="mingcute:menu-fill" width="24" />
					</button>
				{/if}
				<a href="/" class="flex justify-center items-center ml-2" aria-label="SveltyCMS Home">
					<img src="/SveltyCMS_Logo.svg" alt="SveltyCMS Logo" class="w-8 ml-1 mr-2" />
					<strong class="sm:text-lg md:text-xl uppercase relative">Svelty<span class="text-primary-500">CMS</span></strong>
				</a>
			</div>
		</svelte:fragment>

		<svelte:fragment slot="trail">
			<div class="flex items-center gap-2 md:gap-3">
				<a class="gap-2 btn btn-sm variant-outline-surface rounded-full" href="https://github.com/Rar9/SveltyCMS" target="_blank" rel="noreferrer">
					<iconify-icon icon="mdi:github" width="24"></iconify-icon>
					<span class="hidden md:block">Github</span>
				</a>
				<a class="hidden sm:flex items-center gap-2 btn btn-sm variant-outline-surface rounded-full" href="https://sveltycms.com/marketplace">
					<iconify-icon icon="iconamoon:shopping-bag-duotone" width="24"></iconify-icon>
					<span class="hidden md:block">{m.Marketplace()}</span>
				</a>

				<LanguageSwitcher />

				<!-- Dark mode -->
				<button
					class="btn-icon variant-outline flex items-center p-2 rounded-full focus:outline-none"
					on:click={toggleDarkMode}
					aria-label="Toggle Dark Mode"
				>
					<iconify-icon icon="mdi:theme-light-dark" width="24"></iconify-icon>
				</button>
			</div>
		</svelte:fragment>
	</AppBar>
</div>
