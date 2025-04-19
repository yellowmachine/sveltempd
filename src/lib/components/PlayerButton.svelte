<script lang="ts">
    export let ariaLabel: string = '';
    export let disabled: boolean = false;
    export let onClick: () => void = () => {};
  </script>
  
  <button
    aria-label={ariaLabel}
    disabled={disabled}
    class="h-16 w-16 flex items-center justify-center rounded-md text-black transition
           hover:bg-gray-300 hover:shadow-lg active:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    on:click={onClick}
  >
    <slot />
  </button>
  