<script>
	import { availableLanguageTags, languageTag } from '$paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	/**
	 * @param { import("$paraglide/runtime").AvailableLanguageTag } newLanguage
	 */
	function switchToLanguage(newLanguage) {
		const canonicalPath = i18n.route(get(page).url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}

	/**
	 * @type {Record<import("$paraglide/runtime").AvailableLanguageTag, string>}
	 */
	const labels = {
		en: 'EN',
		de: 'DE'
	};
</script>

<label for="language-switcher" class="sr-only">Select Language</label>
<select
	id="language-switcher"
	aria-label="Language Selector"
	on:change={(e) => switchToLanguage(/** @type {any} */ (e).target.value)}
	class="rounded-full h-10 w-14 border border-black text-white bg-surface-100 dark:bg-surface-700"
>
	{#each availableLanguageTags as langTag}
		<option value={langTag} selected={languageTag() === langTag}>{labels[langTag]}</option>
	{/each}
</select>

<style>
	select {
		padding: 0.5rem;
		font-size: 0.875rem; /* 14px */
	}
	@media (max-width: 640px) {
		select {
			width: 3rem; /* Adjust as necessary */
			padding: 0.25rem;
			font-size: 0.75rem; /* 12px */
		}
	}
</style>
