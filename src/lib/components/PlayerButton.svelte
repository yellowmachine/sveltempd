<script lang="ts">
    export let ariaLabel: string = '';
    export let disabled: boolean = false;
    export let onClick: () => void = () => {};
  </script>
  
  <button
    aria-label={ariaLabel}
    disabled={disabled}
    class="h-16 w-16 flex items-center justify-center rounded-md transition bg-white text-orange-500 dark:bg-orange-500 dark:text-white
           hover:bg-orange-300 hover:shadow-lg active:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    onclick={onClick}
  >
    <slot />
  </button>
  