<script lang="ts">
    import confetti from 'canvas-confetti';
  
    export let active = false;
  
    // Cuando active cambia a true, lanzamos confeti
    $: if (active) {
      launchConfetti();
    }
  
    function launchConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  </script>
  
  <!-- No necesita renderizar nada visible -->
  