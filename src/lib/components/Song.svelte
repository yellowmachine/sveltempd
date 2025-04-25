<script lang="ts">

  import SongPopup from "./SongPopup.svelte";
    import type { TRPCQueue } from "../trpcClients";
    import { formatTime } from "$lib/utils";
    
    export let currentSong: string | null;
    export let queueUriList: string[] = [];
    export let uri: string;
    export let title: string;
    export let artist: string;
    export let elapsed: number | undefined; 
    export let total: number | undefined;
    export let trpcQueue: TRPCQueue
    export let play: (uri: string) => void;

    let showModal = false;

    $: isInQueue = queueUriList.includes(uri);

    async function handlePlay() {
      await play(uri);
    }

    async function handleAddToQueue() {
        await trpcQueue.add(uri);
    }

    async function handleRemoveFromQueue() {
      await trpcQueue.remove(uri);
    }

</script>

<div
    class={`mt-2 w-full cursor-pointer inline-flex flex-col sm:flex-row items-center gap-2 p-3 rounded transition-all
      ${uri === currentSong
        ? 'hover:bg-blue-100 bg-blue-50 border border-blue-300 shadow-sm'
        : 'bg-white hover:bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:hover:bg-gray-700'}
    `}
  >
    <!-- Vista destacada si es la canción actual -->
    {#if uri === currentSong}
    <div>
      <div class="flex items-center gap-2">
        <span class="text-blue-600 font-bold animate-pulse">●</span>
        <span class={`font-medium ${isInQueue ? 'text-orange-600' : ''}`}>{title}</span>
        <span class="text-xs text-blue-400 ml-2">({artist})</span>
        <span class="text-blue-500">
          {formatTime(elapsed)} / {formatTime(total)}
        </span>
      </div>
      <!-- Barra de progreso -->
      <div class="h-2 mt-2 bg-blue-100 rounded">
        <div
          class="h-2 bg-blue-500 rounded transition-all"
          style="width: {total ? Math.min(100, (elapsed || 0) / total * 100) : 0}%"
        ></div>
      </div>
    </div>
  {:else}
    <!-- Vista normal -->
    <button aria-label="cancion" onclick={() => showModal = true} class="relative flex items-center gap-2">
      
      <span class={`font-medium ${isInQueue ? 'text-orange-600' : ''}`}>{title}</span>
      <span class="text-xs text-gray-400 ml-2">({artist})</span>
      <span class="ml-auto text-xs text-gray-400">{formatTime(total)}</span>
      <SongPopup
        {handlePlay}
        {handleAddToQueue}
        {handleRemoveFromQueue}
        {isInQueue}
        bind:showModal
      />  
    </button>
  {/if}
  </div>
  