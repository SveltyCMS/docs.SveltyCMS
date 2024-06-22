<script lang="ts">
	interface PageTitleProps {
		name: string;
		icon?: string | undefined;
		iconColor?: string | undefined;
		iconSize?: string | undefined;
	}

	export let name: PageTitleProps['name'];
	export let icon: PageTitleProps['icon'];
	export let iconColor: PageTitleProps['iconColor'] = 'text-error-500';
	export let iconSize: PageTitleProps['iconSize'] = '30';
</script>

<div class="flex items-center justify-center mt-4">
	<h1 class="h1 ml-2 flex items-center gap-1 font-bold">
		<!-- Icon -->
		{#if icon}
			<iconify-icon {icon} width={iconSize} class={`mr-1 ${iconColor} sm:mr-2`} />
		{/if}
		<!-- Page Title -->
		{@html name}
	</h1>
</div>
