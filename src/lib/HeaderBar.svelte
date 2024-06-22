<script lang="ts">
  import { searchQuery } from '$lib/stores';
  import { toggleDarkMode } from '$lib/darkMode';
  import LanguageSwitcher from '@src/lib/LanguageSwitcher.svelte';
  import { writable } from 'svelte/store';
  import { AppBar } from '@skeletonlabs/skeleton';
  import * as m from '$lib/paraglide/messages.js';

  let isMenuOpen = writable(false);

  function toggleMenu() {
    isMenuOpen.update(state => !state);
  }
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
  <svelte:fragment slot="lead">
    <div class="mb-3 flex items-center">
      <!-- Hamburger -->
      <button
        type="button"
        on:click={toggleMenu}
        class="variant-ghost-surface btn-icon mt-1"
      >
        <iconify-icon icon="mingcute:menu-fill" width="24" />
      </button>
      <a href="/" class="flex justify-center items-center ml-2" aria-label="SveltyCMS Home">
        <img src="/SveltyCMS_Logo.svg" alt="SveltyCMS Logo" class="w-6 ml-1 mr-2" />
        <strong class="sm:text-lg md:text-xl uppercase relative">Svelty<span class="text-tertiary-500 dark:text-primary-500">CMS</span></strong>
      </a>
    </div>
  </svelte:fragment>

  <div class="hidden md:block"><input type="text" placeholder="Search documentation..." bind:value={$searchQuery} class="input" /></div>

  <svelte:fragment slot="trail">
    <div class="flex justify-center items-center gap-1 md:gap-2">
      <a class="gap-2 btn btn-sm variant-outline-surface rounded-full" href="https://github.com/Rar9/SveltyCMS" target="_blank" rel="noreferrer">
        <iconify-icon icon="mdi:github" width="24"></iconify-icon> <span class="hidden md:block">Github</span>
      </a>
      <a class="gap-2 btn btn-sm variant-outline-surface rounded-full" href="https://sveltycms.com/marketplace">
        <iconify-icon icon="iconamoon:shopping-bag-duotone" width="24"></iconify-icon> <span class="hidden md:block">{m.Marketplace()}</span>
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