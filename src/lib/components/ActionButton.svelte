<script lang="ts">
      import { fade } from 'svelte/transition';

    let {action}: {action: () => Promise<void>} = $props();
    let popup: { message: string; type: "success" | "error" } | null = $state(null);
    let timeout: NodeJS.Timeout | null = null;
  
    async function handleClick() {
      try {
        await action();
        showPopup("ok", "success");
      } catch (e) {
        showPopup(e instanceof Error ? e.message : String(e), "error");
      }
    }
  
    function showPopup(message: string, type: "success" | "error") {
      popup = { message, type };
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => (popup = null), 2500);
    }

  </script>
  
  <div class="relative inline-block">
    <span onclick={handleClick}>
      <slot />
    </span>
    <!--<button
      class="bg-white text-gray-600 hover:bg-gray-300 transition px-4 rounded transition"
      onclick={handleClick}
    >
      {text}
    </button>
  -->
  
    {#if popup}
      <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-4 min-w-[100px] px-4 py-2 rounded shadow-lg text-sm font-medium
          {popup.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'}"
        transition:fade
      >
        {popup.message}
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
  