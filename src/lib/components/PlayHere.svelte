<script lang="ts">
    import Confetti from './Confetti.svelte';

    export let onClick: () => void;
    export let disabled = false;

    let confettiActive = false;

    function handleClick() {
      confettiActive = true;
      setTimeout(() => confettiActive = false, 2000);
      onClick();
    }
    
  </script>
  
  <button
    class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-500
           text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition
           focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
    on:click={handleClick}
    {disabled}
    aria-label="Reproducir aquí"
  >
    <span>Play aquí</span>
  </button>
  <Confetti active={confettiActive} />