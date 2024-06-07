<script lang="ts">
	import { page } from '$app/stores';

	// Your selected Skeleton theme:
	import '../app.postcss';

	// Paraglide JS
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import LanguageSwitcher from '@src/lib/LanguageSwitcher.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { onMount } from 'svelte';
	// Icons from https://icon-sets.iconify.design/
	import 'iconify-icon';

	// Skeleton
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	function toggleDarkMode() {
		if (document.documentElement.classList.contains('dark')) {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		} else {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		}
	}

	onMount(() => {
		if (localStorage.getItem('theme') === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});

	// Default SEO for all pages
	const SeoTitle = `SveltyCMS Documentation - Get Started and Learn More`;
	const SeoDescription = `Access the SveltyCMS Documentation to get started and learn more about the features and capabilities of SveltyCMS. Find guides, tutorials, and comprehensive references to help you make the most of your SveltyCMS experience.`;
</script>

<svelte:head>
	<!--Basic SEO-->
	<title>{SeoTitle}</title>
	<meta name="description" content={SeoDescription} />

	<!-- Open Graph -->
	<meta property="og:title" content={SeoTitle} />
	<meta property="og:description" content={SeoDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/SveltyCMS.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content={$page.url.origin} />

	<!-- Open Graph : Twitter-->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={SeoTitle} />
	<meta name="twitter:description" content={SeoDescription} />
	<meta name="twitter:image" content="/SveltyCMS.png" />
	<meta property="twitter:domain" content={$page.url.origin} />
	<meta property="twitter:url" content={$page.url.href} />
</svelte:head>
<ParaglideJS {i18n}>
	<!-- App Shell -->
	<AppShell>
		<svelte:fragment slot="header">
			<!-- App Bar -->
			<AppBar>
				<svelte:fragment slot="lead">
					<a href="/" class="flex justify-center items-center">
						<img src="/SveltyCMS_Logo.svg" alt="SveltyCMS Logo" class="w-10 mr-4" />
						<strong class="text-xl uppercase"
							><p class="text-primary-500">Docs</p>
							SveltyCMS</strong
						></a
					>
				</svelte:fragment>

				<svelte:fragment slot="trail">
					<div class="flex justify-center items-center gap-1 md:gap-2">
						<a class="gap-2 btn btn-sm variant-outline-surface rounded-full" href="https://github.com/Rar9/SveltyCMS" target="_blank" rel="noreferrer"
							><iconify-icon icon="mdi:github" width="24"></iconify-icon> <span class="hidden md:block">Github</span>
						</a>
						<a class="gap-2 btn btn-sm variant-outline-surface rounded-full" href="https://sveltycms.com/marketplace"
							><iconify-icon icon="iconamoon:shopping-bag-duotone" width="24"></iconify-icon> <span class="hidden md:block">{m.Marketplace()}</span>
						</a>

						<!-- dark mode -->
						<button class="bton-icon variant-outline flex items-center p-2 rounded-full focus:outline-none" on:click={toggleDarkMode}>
							<iconify-icon icon="mdi:theme-light-dark" width="24"></iconify-icon>
						</button>

						<LanguageSwitcher />
					</div>
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>

		<!-- Page Route Content -->
		<slot />
	</AppShell>
</ParaglideJS>
