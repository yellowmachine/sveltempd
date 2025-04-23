<script lang="ts">
    import { trpc } from '$lib/trpc/client';
    import { page } from '$app/state';

    let { isPlaying, total = 0, elapsed = 0 } = $props();

    let currentElapsed = $state(elapsed);
    let timer: ReturnType<typeof setInterval> | null = null;

    // Sincroniza currentElapsed si cambia elapsed desde fuera
    $effect(() => {
        currentElapsed = elapsed;
    });

    // Controla el timer según isPlaying
    $effect(() => {
        if (isPlaying) {
            if (timer) clearInterval(timer);
            timer = setInterval(() => {
                currentElapsed += 1;
                if (currentElapsed >= total && timer) clearInterval(timer);
            }, 1000);
        } else {
            if (timer) clearInterval(timer);
            timer = null;
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    });

    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function onInput(event: Event) {
        currentElapsed = Number((event.target as HTMLInputElement).value);
    }

    async function onChange(event: Event) {
        const newValue = Number((event.target as HTMLInputElement).value);
        await trpc(page).player.seek.mutate({ time: newValue });
        currentElapsed = newValue;
    }
</script>

<div class="max-w-md">
    
    <input
        id="player-range"
        type="range"
        min="0"
        max={total}
        step="1"
        bind:value={currentElapsed}
        class="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer dark:bg-orange-500"
        oninput={onInput}
        onchange={onChange}
    />

    <div class="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
        <span>{formatTime(currentElapsed)} / {formatTime(total ?? 0)}</span>
        {#if total}
        <span>{formatTime((total ?? 0) - currentElapsed)}</span>
        {/if}
    </div>
</div>
