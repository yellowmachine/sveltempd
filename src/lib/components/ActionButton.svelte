<script lang="ts">
	  import { fade } from 'svelte/transition';
    import type { M } from '$lib/stores.svelte';
	import type { Snippet } from 'svelte';

    let { successMessage="ok!", mut, action, children }: 
        { successMessage?: string, mut?: M, action?: Function, children: Snippet } = $props();
    
    let timeout: NodeJS.Timeout | null = null;
      
    let error: string | null = $state(null);
    const f = action || mut?.mutate || (async () => {});

    async function handleClick(event: Event) {
      if(mut && mut.loading) 
        return;
      try {
        await f(event);
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
      }
    }

    $effect(() => {
      if (mut && mut.ok || error) {
        timeout = setTimeout(() => {
          mut?.clear();
          error = null;
        }, 2500);
      }
    })

    $effect(() => {
      if(mut?.error)
        error = mut?.error;
    })

  </script>
  
  <div class="relative inline-block">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span onclick={handleClick}>
      {@render children()}
    </span>
  
    {#if mut &&mut.ok}
    <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-4 min-w-[100px] px-4 py-2 rounded shadow-lg text-sm font-medium
           bg-green-100 text-green-800 border border-green-300"
        transition:fade
      >
        {successMessage}
      </div>
    {/if}
    {#if error}
    <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-4 min-w-[100px] px-4 py-2 rounded shadow-lg text-sm font-medium
          bg-red-100 text-red-800 border border-red-300"
        transition:fade
      >
      {error}
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
  