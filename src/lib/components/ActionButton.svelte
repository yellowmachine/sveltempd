<script lang="ts">
	  import { fade } from 'svelte/transition';
    import type { M } from '$lib/stores.svelte';

    let { successMessage="ok!", mut}: 
        { successMessage?: string, mut: M} = $props();
    let timeout: NodeJS.Timeout | null = null;

    //let error = $state<string | null>(null);
      
    async function handleClick(event: Event) {
      if(mut.loading) return;
      //try {
      await mut.mutate(event);
      //} catch (e) {
      //  error = e instanceof Error ? e.message : String(e);
      //}
    }

    $effect(() => {
      if (mut.ok || mut.error) {
        timeout = setTimeout(mut.clear, 2500);
      }
    })

  </script>
  
  <div class="relative inline-block">
    <span onclick={handleClick}>
      <slot />
    </span>
  
    {#if mut.ok}
    <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-4 min-w-[100px] px-4 py-2 rounded shadow-lg text-sm font-medium
           bg-green-100 text-green-800 border border-green-300"
        transition:fade
      >
        {successMessage}
      </div>
    {/if}
    {#if mut.error}
    <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-4 min-w-[100px] px-4 py-2 rounded shadow-lg text-sm font-medium
          bg-red-100 text-red-800 border border-red-300"
        transition:fade
      >
      {mut.error}
    </div>
    {/if}
  </div>
  
  <style>
    /* Optional: fade transition (if you want) */
    :global(.fade-enter-active), :global(.fade-leave-active) {
      transition: opacity 0.2s;
    }
    :global(.fade-enter-from), :global(.fade-leave-to) {
      opacity: 0;
    }
  </style>
  