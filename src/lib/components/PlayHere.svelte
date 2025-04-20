<!-- PlayHereButton.svelte -->
<script lang="ts">
    export let onClick: () => void;
    export let disabled = false;
  </script>
  
  <button
    class="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500
           text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition
           focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
    on:click={onClick}
    {disabled}
    aria-label="Reproducir aquí"
  >
    <!-- Icono Play SVG -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
      viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" fill="none"/>
      <polygon points="10,8 16,12 10,16" fill="currentColor"/>
    </svg>
    <span>Play aquí</span>
  </button>
  