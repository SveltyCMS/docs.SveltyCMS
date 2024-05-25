import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [paraglide({ project: './project.inlang', outdir: './src/lib/paraglide' }),sveltekit(), purgeCss(),paraglide({
		project: './project.inlang', // Path to your inlang project
		outdir: './src/paraglide' // Where you want the generated files to be placed
	})]
});