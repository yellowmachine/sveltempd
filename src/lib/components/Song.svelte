<script lang="ts">
	  //import Icon from "@iconify/svelte";
	  import type { TRPCQueue } from "./trpcClients";
    
    export let currentSong: string | null;
    export let queueUriList: string[] = [];
    export let uri: string;
    export let title: string;
    export let artist: string;
    export let elapsed: number | undefined; 
    export let total: number | undefined;
    export let trpcQueue: TRPCQueue

    let showModal = false;

    $: isInQueue = queueUriList.includes(uri);

    async function handlePlay() {
      try{
        await trpcQueue.clear();
        await trpcQueue.add(uri);
        await trpcQueue.play();
      }finally{
        showModal = false;
      }
    }

    async function handleAddToQueue() {
      try{
        await trpcQueue.add(uri);
      }finally{
        showModal = false;
      }
    }

    async function handleRemoveFromQueue() {
      await trpcQueue.remove(uri);
      showModal = false;
    }

    function formatTime(seconds?: number) {
      if (!seconds) return '';
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
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
      {#if showModal}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div aria-label="acciones" onblur={() => showModal = false} onmouseout={(e) => {
          if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) {
            showModal = false;
          }
        }} class="absolute left-0 top-full mt-2 z-50">
          <div class="bg-white rounded-lg shadow-lg p-4 w-40">
            <div class="flex flex-col gap-2">
              <a href="/#"
                class="w-full px-2 py-1 bg-green-300 text-white rounded hover:bg-gray-300 transition"
                onclick={handlePlay}
              >
                play
              </a>
              <a href="/#"
                class="w-full px-2 py-1 bg-gray-300 text-white rounded hover:bg-gray-300 transition"
                onclick={handleAddToQueue}
              >
                add to playlist
              </a>
              <!--
              <Icon icon="mdi:play" width="34" height="34" class="bg-orange-300 text-white" />
                <Icon icon="mdi:plus" width="34" height="34" class="bg-orange-300 text-white" />
                <Icon icon="mdi:minus" width="34" height="34" class="bg-orange-300 text-white" />
            -->
              {#if isInQueue}
              <a href="/#"
                class="w-full px-2 py-1 bg-orange-200 text-white rounded hover:bg-gray-300 transition"
                onclick={handleRemoveFromQueue}
              >
                remove from playlist
              </a>
              {/if}
            </div>
          </div>
        </div>
      {/if}
      </button>
  {/if}
  </div>
  