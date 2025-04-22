<script lang="ts">
	  import type { TRPCQueue } from "./trpcClients";

    export let songId: number;
    export let currentSongId: number | undefined;
    export let uri: string;
    export let title: string;
    export let artist: string;
    export let elapsed: number | undefined; 
    export let total: number | undefined;
    export let trpcQueue: TRPCQueue

    let showModal = false;

    async function handlePlay() {
      try{
        await trpcQueue.clear();
        await trpcQueue.add(uri);
        await trpcQueue.play();
      }finally{
        showModal = false;
      }
    }

    async function handleAddToPlaylist() {
      try{
        await trpcQueue.add(uri);
      }finally{
        showModal = false;
      }
    }

    function formatTime(seconds?: number) {
      if (!seconds) return '';
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
    }
  </script>
  
  <div
    class={`flex flex-col sm:flex-row items-center gap-2 p-3 rounded transition-all
      ${songId === currentSongId
        ? 'bg-blue-50 border border-blue-300 shadow-sm'
        : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700'}
    `}
  >
    <!-- Vista destacada si es la canción actual -->
    {#if ''+songId === ''+currentSongId}
      <div class="flex-1 max-w-md">
        <div class="flex items-center gap-2">
          <span class="text-blue-600 font-bold animate-pulse">●</span>
          <span class="font-semibold text-blue-700">{title}</span>
          <span class="text-xs text-blue-400 ml-2">({artist})</span>
          <span class="text-blue-500">
            {formatTime(elapsed)} / {formatTime(total)}
          </span>
        </div>
        <!-- Barra de progreso -->
        <div class="max-w-md h-2 mt-2 bg-blue-100 rounded">
          <div
            class="h-2 bg-blue-500 rounded transition-all"
            style="width: {total ? Math.min(100, (elapsed || 0) / total * 100) : 0}%"
          ></div>
        </div>
      </div>
    {:else}
      <!-- Vista normal -->
      <div class="flex-1 flex items-center gap-2">
        <span class="font-medium">{title}</span>
        <span class="text-xs text-gray-400 ml-2">({artist})</span>
        <span class="ml-auto text-xs text-gray-400">{formatTime(total)}</span>
      </div>
    {/if}
  </div>
  {#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-72">
      <h2 class="text-lg font-semibold mb-4">{title}</h2>
      <div class="flex flex-col gap-3">
        <button
          class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onclick={handlePlay}
        >
          ▶️ Play
        </button>
        <button
          class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onclick={handleAddToPlaylist}
        >
          ➕ Add to Playlist
        </button>
        <button
          class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          onclick={() => showModal = false}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
{/if}