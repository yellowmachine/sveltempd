<script lang="ts">
    import { trpc } from '$lib/trpc/client';
    import { page } from '$app/state';
    import PlayHere from './PlayHere.svelte';
  
    export let initialContents: Array<any> = [];
    export let currentFolder = ''; // Raíz
    
    let history: string[] = [];
    let loading = false;
    let contents: Array<any> = initialContents;

      function getSongFiles() {
        return contents.filter(item => item.file).map(item => item.file);
      }

    function formatDuration(seconds?: number) {
      if (!seconds) return '';
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min}:${sec.toString().padStart(2, '0')}`;
    }
  
    async function loadFolder(folder: string) {
      loading = true;
      contents = [];
      currentFolder = folder;
      const data = await trpc(page).library.getFolderContent.query({path: folder});
      contents = data;
      loading = false;
    }
  
    function enterFolder(subfolder: string) {
      history.push(currentFolder);
      loadFolder(currentFolder ? `${currentFolder}/${subfolder}` : subfolder);
    }
  
    function goBack() {
      if (history.length > 0) {
        const prev = history.pop();
        loadFolder(prev || '');
      }
    }
  
    async function handlePlayHere() {
      loading = true;
      try {
        const files = getSongFiles();
        if (files.length > 0) {
          await trpc(page).player.playHere.mutate({ files });
        }
      } finally {
        loading = false;
      }
    }

  </script>
  
  <div class="max-w-xl mx-auto p-4">
    <div class="flex items-center gap-2 mb-4">
      {#if currentFolder !== ""}
      <button
        class="flex items-center text-left p-2 rounded 
                     bg-orange-100 hover:bg-orange-200 
                     dark:bg-orange-900 dark:hover:bg-orange-800
                     transition-colors"
        on:click={goBack}
        disabled={history.length === 0}
        aria-label="Volver"
      >
        [..]
      </button>
      {/if}
      <span class="flex items-center p-2 rounded 
                   bg-gray-50 
                   dark:bg-gray-800
                   truncate">{currentFolder || 'Biblioteca'}</span>
      <PlayHere onClick={handlePlayHere} disabled={loading || getSongFiles().length === 0} />
    </div>
  
    {#if loading}
      <div class="text-center text-gray-500 py-8">Cargando...</div>
    {:else if contents.length === 0}
      <div class="text-center text-gray-400 py-8">Carpeta vacía</div>
    {:else}
    <ul>
      {#each contents as item}
        {#if item.directory}
          <li>
            <button
              class="flex items-center w-full text-left p-2 rounded 
                     bg-orange-100 hover:bg-orange-200 
                     dark:bg-orange-900 dark:hover:bg-orange-800
                     transition-colors"
              on:click={() => enterFolder(item.directory)}
              aria-label={`Abrir carpeta ${item.directory}`}
            >
              <span>{item.directory}</span>
            </button>
          </li>
        {:else if item.file}
          <li 
            class="flex items-center p-2 rounded 
                   bg-gray-50 hover:bg-gray-100 
                   dark:bg-gray-800 dark:hover:bg-gray-700
                   transition-colors"
          >
            <span class="flex-1 truncate">{item.file.split('/').pop()}</span>
            <span class="ml-2 text-xs text-gray-400">{formatDuration(item.duration)}</span>
          </li>
        {/if}
      {/each}
    </ul>
    
    {/if}
</div>
  
  