<script lang="ts">
	function copyToClipboard(text) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				alert('Copied to clipboard');
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<div class="title">
			<h1 class="text-4xl">Revolutionize Your Web Development with Our <span class="text-primary-500">SveltyCMS</span></h1>
			<h2 class="mt-2 text-xl">The ultimate backend dashboard combining the best features from leading Headless CMS platforms.</h2>

			<!-- <pre style="position:relative;"><code class="language-bash">npx create-sveltekit-cms my-project</code> <button class="absolute top-2 right-2" on:click={() => copyToClipboard('npx create-sveltekit-cms my-project\ncd my-project\nnpm install\nnpm run dev')}><i class="fa-regular fa-clipboard"></i></button></pre> -->
		</div>
		<figure>
			<section class="img-bg" />
			<img src="/SveltyCMS.avif" alt="" class="w-60" />
		</figure>

		<!-- Buttons -->
		<div class="flex justify-center space-x-4">
			<a class="btn variant-filled-primary" href="https://github.com/Rar9/SveltyCMS" target="_blank" rel="noreferrer"> Get Started </a>

			<a class="btn variant-filled" href="https://docs.sveltycms.com/" target="_blank" rel="noreferrer"> Launch Documentation </a>
			<a class="btn variant-filled-tertiary" href="https://docs.sveltycms.com/" target="_blank" rel="noreferrer"> Marketplace </a>
		</div>
		<!-- quick start -->

		<button on:click={() => copyToClipboard('git clone https://github.com/Rar9/SveltyCMS\ncd SveltyCMS\nnpm install\nnpm run dev')}>
			<p class="text-xl mb-1 animate-bounce">Quick Start</p>
			<code class="code p-2 rounded-full relative pr-10">
				git clone https://github.com/Rar9/SveltyCMS
				<iconify-icon icon="solar:clipboard-bold-duotone" width="24" class="pl-2 absolute"></iconify-icon>
			</code>
		</button>

		<!-- Cards -->
		<div class="space-y-2">
			<h2 class="text-primary-500 text-4xl">Build apps fast.</h2>
			<p>Get your backend done in minutes instead of weeks. Easily build customizable content API and use them with a modern tech stack.</p>
			<div class="grid grid-cols-2 md:grid-cols-3 gap-6">
				<div class="card border rounded-2xl shadow-xl p-4">
					<header class="card-header">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
							<iconify-icon icon="bi:code-slash" width="24" class="p-2 w-10 h-10 rounded-xl border-error-500 border"></iconify-icon>
							<p class="text-primary-500 text-2xl mb-3">Open Source</p>
						</div>
					</header>
					<section class="">Forever. The entire codebase is available on GitHub and maintained</section>
					<footer></footer>
				</div>

				<div class="card border rounded-2xl shadow-xl p-4">
					<header class="card-header">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
							<iconify-icon icon="ph:upload-bold" width="24" class="p-2 w-10 h-10 rounded-xl border-error-500 border"></iconify-icon>
							<p class="text-primary-500 text-2xl mb-3">Flexible Media Uploading</p>
						</div>
					</header>
					<section class="">Easily upload and manage your media files with our intuitive interface.</section>
					<footer></footer>
				</div>

				<div class="card border rounded-2xl shadow-xl p-4">
					<header class="card-header">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
							<iconify-icon icon="bi:paint-bucket" width="24" class="p-2 w-10 h-10 rounded-xl border-error-500 border"></iconify-icon>
							<p class="text-primary-500 text-2xl mb-3">User-Friendly Icon GUI</p>
						</div>
					</header>
					<section class="">Navigate effortlessly with our easy-to-understand icon-based GUI</section>
					<footer></footer>
				</div>
				<div class="card border rounded-2xl shadow-xl p-4">
					<header class="card-header">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
							<iconify-icon icon="bi:columns-gap" width="24" class="p-2 w-10 h-10 rounded-xl border-error-500 border"></iconify-icon>
							<p class="text-primary-500 text-2xl mb-3">Custom Collections</p>
						</div>
					</header>
					<section class="">Define and display collections and tables with unmatched flexibility.</section>
					<footer></footer>
				</div>

				<div class="card border rounded-2xl shadow-xl p-4">
					<header class="card-header">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
							<iconify-icon icon="bi:shield-shaded" width="24" class="p-2 w-10 h-10 rounded-xl border-error-500 border"></iconify-icon>
							<p class="text-primary-500 text-2xl mb-3">High & Flexible Security</p>
						</div>
					</header>
					<section class="">Secure your data with our robust and customizable security features.</section>
					<footer></footer>
				</div>

				<div class="card border rounded-2xl shadow-xl p-4">
					<header class="card-header">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
							<iconify-icon icon="bi:image-fill" width="24" class="p-2 w-10 h-10 rounded-xl border-error-500 border"></iconify-icon>
							<p class="text-primary-500 text-2xl mb-3">Image Editor</p>
						</div>
					</header>
					<section class="">Edit images on the fly with our integrated image editor.</section>
					<footer></footer>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation:
			pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
			glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
