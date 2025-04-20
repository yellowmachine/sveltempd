<script lang="ts">
    import { trpc } from '$lib/trpc/client';
    import { page } from '$app/state';
    import { onDestroy, onMount } from 'svelte';
    
    let { isPlaying, total, elapsed = 0 }: 
        { isPlaying: boolean, total?: number, elapsed?: number } = $props(); 

    let timer: ReturnType<typeof setInterval> | null = null;

    onMount(() => {
        if (isPlaying) {
            timer = setInterval(() => {
                elapsed += 1;
            }, 1000);
        }
    });

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    function onInput(event: Event) {
        const newValue = Number((event.target as HTMLInputElement).value);
        trpc(page).player.seek.mutate({time: newValue});
    }

    
    onDestroy(() => {
        if (timer) clearInterval(timer);
    });
</script>

<label for="player-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    Progreso
  </label>
  <input
    id="player-range"
    type="range"
    min="0"
    max={total}
    step="1"
    bind:value={elapsed}
    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    oninput={onInput}
  />

<div class="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
    <span>{formatTime(elapsed)}</span>
    {#if total}
    <span>{formatTime(total - elapsed)}</span>
    {:else}
    <span>{formatTime(0)}</span>
    {/if}
</div>