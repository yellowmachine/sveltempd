<script lang="ts">
  import SongPopup from "./SongPopup.svelte";
  import type { TRPCQueue } from "../trpcClients";
  import { formatTime } from "$lib/utils";

  export let currentSong: { uri: string | null; elapsed: number | null; total: number | undefined } | null;
  export let queueUriList: string[] = [];
  export let uri: string;
  export let title: string;
  export let artist: string;
  export let total: string;
  export let trpcQueue: TRPCQueue;
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
  class={`cursor-pointer gap-2 p-3 rounded transition-all
      ${uri === currentSong?.uri
        ? 'hover:bg-blue-100 bg-blue-50 border border-blue-300 shadow-sm'
        : 'bg-white hover:bg-brand-100 dark:bg-gray-800 border border-brand-300 dark:hover:bg-gray-700'}
    `}
>
  {#if uri === currentSong?.uri}
    <div class="col-span-full">
      <div class="flex items-center gap-2">
        <span class="text-blue-600 font-bold animate-pulse">●</span>
        <span class={`font-medium ${isInQueue ? 'text-orange-600' : ''}`}>{title}</span>
        <span class="text-xs text-blue-400 ml-2">({artist})</span>
        <span class="text-blue-500">
          {formatTime(currentSong.elapsed)} / {formatTime(currentSong.total)}
        </span>
      </div>
      <div class="h-2 mt-2 bg-blue-100 rounded">
        <div
          class="h-2 bg-blue-500 rounded transition-all"
          style="width: {currentSong.total ? Math.min(100, (currentSong.elapsed || 0) / currentSong.total * 100) : 0}%"
        ></div>
      </div>
    </div>
  {:else}
    <button
      aria-label="cancion"
      onclick={() => showModal = true}
      class="flex items-center justify-between w-full md:w-1/2 max-w-md mx-auto cursor-pointer relative"
    >
      <span class={`font-medium ${isInQueue ? 'text-orange-600' : ''}`}>
        {title}
      </span>
      <span class="text-right">
        <span class="text-xs text-gray-400">
          ({artist})
        </span>
        <span class="text-xs text-gray-400">
          {total}
        </span>  
      </span>
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