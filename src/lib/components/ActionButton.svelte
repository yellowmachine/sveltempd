<script lang="ts">
	  import { fade } from 'svelte/transition';
    import type { M } from '$lib/stores.svelte';

    let {action, disabled=false, successMessage="ok", m}: 
        {action: () => Promise<void>, disabled: boolean, 
          successMessage: string, m: M} = $props();
    let timeout: NodeJS.Timeout | null = null;

    let error = $state<string | null>(null);
  
    async function handleClick() {
      if(disabled) return;
      try {
        await action();
      } catch (e) {
        error = e instanceof Error ? e.message : String(e);
      }
    }

    $effect(() => {
      if (m.ok || m.error) {
        timeout = setTimeout(m.clear, 2500);
      }
    })

  </script>
  
  <div class="relative inline-block">
    <span onclick={handleClick}>
      <slot />
    </span>
  
    {#if m.ok}
    <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-4 min-w-[100px] px-4 py-2 rounded shadow-lg text-sm font-medium
           bg-green-100 text-green-800 border border-green-300"
        transition:fade
      >
        {successMessage}
      </div>
    {/if}
    {#if m.error || error}
    <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-4 min-w-[100px] px-4 py-2 rounded shadow-lg text-sm font-medium
          bg-red-100 text-red-800 border border-red-300"
        transition:fade
      >
      {m.error || error}
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
  