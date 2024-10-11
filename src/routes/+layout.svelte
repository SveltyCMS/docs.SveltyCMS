<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { sidebarState } from '$lib/store/sidebarStore';

	// Your selected Skeleton theme:
	import '../app.postcss';

	// Icons from https://icon-sets.iconify.design/
	import 'iconify-icon';

	// Components
	import Footer from '$lib/Footer.svelte';
	import LeftSideBar from '$lib/LeftSideBar.svelte';
	import HeaderBar from '$lib/HeaderBar.svelte';

	// Paraglide JS
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';

	// Skeleton
	import { AppShell } from '@skeletonlabs/skeleton';

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

	import { initializeDarkMode } from '$lib/darkMode';

	onMount(() => {
		initializeDarkMode();
	});

	// Default SEO for all pages
	const SeoTitle = `SveltyCMS Documentation - Get Started and Learn More`;
	const SeoDescription = `Access the SveltyCMS Documentation to get started and learn more about the features and capabilities of SveltyCMS. Find guides, tutorials, and comprehensive references to help you make the most of your SveltyCMS experience.`;

	$: leftSidebarState = $sidebarState.left;
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
	<AppShell class="w-fullbg-white dark:bg-surface-900">
		<svelte:fragment slot="header">
			<HeaderBar />
		</svelte:fragment>

		<!-- Sidebar -->
		<LeftSideBar />

		<!-- Page Route Content -->
		<div
			class={`overflow-y-auto transition-transform duration-300 ease-in-out bg-white dark:bg-surface-900 ${leftSidebarState !== 'hidden' ? 'ml-64' : 'ml-0'}`}
		>
			<slot />
		</div>

		<svelte:fragment slot="footer">
			<div class={`bg-white dark:bg-surface-900 ${leftSidebarState !== 'hidden' ? 'ml-64' : 'ml-0'}`}>
				<!-- Footer -->
				<Footer />
			</div>
		</svelte:fragment>
	</AppShell>
</ParaglideJS>
