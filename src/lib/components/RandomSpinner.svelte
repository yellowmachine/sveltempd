<script lang="ts">
    //import { onMount } from 'svelte';
    import {
      BarLoader, Chasing, Circle, DoubleBounce, Firework, Jellyfish,
      Jumper, Pulse, Rainbow, RingLoader, ScaleOut, Shadow, SpinLine,
      Stretch, SyncLoader, Wave, Square, Moon
    } from 'svelte-loading-spinners';
  
    const spinnerMap = {
      BarLoader, Chasing, Circle, DoubleBounce, Firework, Jellyfish,
      Jumper, Pulse, Rainbow, RingLoader, ScaleOut, Shadow, SpinLine,
      Stretch, SyncLoader, Wave, Square, Moon
    };
  
    // Props
    export let spinnerName: null | keyof typeof spinnerMap = null;
    export let color = null;
    export let size = 60;
    export let duration = '1s';
    export let unit = 'px';
  
    const colors = [
      '#FF3E00', '#1E90FF', '#32CD32', '#FFD700',
      '#8A2BE2', '#FF69B4', '#00CED1', '#FF6347'
    ];
  
    let Spinner = BarLoader;
  
    //onMount(() => {
      if (!spinnerName) {
        const spinnerList = Object.values(spinnerMap);
        Spinner = spinnerList[Math.floor(Math.random() * spinnerList.length)];
      } else if (spinnerMap[spinnerName]) {
        Spinner = spinnerMap[spinnerName];
      }
      color = color || colors[Math.floor(Math.random() * colors.length)];
    //});
  </script>
  
  <svelte:component
    this={Spinner}
    {color}
    {size}
    {duration}
    {unit}
  />
  