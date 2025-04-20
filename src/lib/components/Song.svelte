<script lang="ts">
    export let songId: string;
    export let currentSongId: string;
    export let title: string;
    export let artist: string;
    export let duration: number | undefined;
    export let elapsed: number | undefined; 
  
    // Formatea el tiempo en mm:ss
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
    {#if songId === currentSongId}
      <div class="flex-1 w-full">
        <div class="flex items-center gap-2">
          <span class="text-blue-600 font-bold animate-pulse">●</span>
          <span class="font-semibold text-blue-700">{title}</span>
          <span class="text-xs text-blue-400 ml-2">({artist})</span>
          <span class="ml-auto text-xs text-blue-500">
            {formatTime(elapsed)} / {formatTime(duration)}
          </span>
        </div>
        <!-- Barra de progreso -->
        <div class="w-full h-2 mt-2 bg-blue-100 rounded">
          <div
            class="h-2 bg-blue-500 rounded transition-all"
            style="width: {duration ? Math.min(100, (elapsed || 0) / duration * 100) : 0}%"
          ></div>
        </div>
      </div>
    {:else}
      <!-- Vista normal -->
      <div class="flex-1 flex items-center gap-2">
        <span class="font-medium">{title}</span>
        <span class="text-xs text-gray-400 ml-2">({artist})</span>
        <span class="ml-auto text-xs text-gray-400">{formatTime(duration)}</span>
      </div>
    {/if}
  </div>
  