<script lang="ts">
    import { trpc } from '$lib/trpc/client';
    import { page } from '$app/state';
    import PlayHere from './PlayHere.svelte';
	  import type { Song as TSong } from '$lib/messages';
	  import Song from './Song.svelte';
	  import { trpcQueue } from './trpcClients';
  
    export let initialContents: {directories: string[], files: TSong[], currentSong: string} = {directories: [], files: [], currentSong: ''};
    export let currentFolder = '';
    export let elapsed: number | undefined;
    export let total: number | undefined;
    export let queueUriList: string[] = [];
    
    let history: string[] = [];
    let loading = false;
    let contents: {directories: string[], files: TSong[]} = initialContents;
  
    async function loadFolder(folder: string) {
      loading = true;
      contents = {files: [], directories: []};
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
        if (contents.files.length > 0) {
          await trpc(page).player.playHere.mutate({ path: history.join('/') });
          //await trpc(page).snapclient.restart.mutate();
        }
      } finally {
        loading = false;
      }
    }

    async function play(uri: string){
      await trpcQueue.clear();
      await trpcQueue.add(uri);
      await trpcQueue.play();
    }

  </script>
  
  <div class="w-full mx-auto p-4">
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
      <PlayHere onClick={handlePlayHere} disabled={loading || contents.files.length === 0} />
    </div>
  
    {#if loading}
      <div class="text-center text-gray-500 py-8">Cargando...</div>
    {:else if contents.directories.length === 0 && contents.files.length === 0}
      <div class="text-center text-gray-400 py-8">Carpeta vacía</div>
    {:else}
    <ul>
      {#each contents.directories as dir}
      <li>
        <button
          class="flex items-center w-full text-left p-2 rounded mt-2
                  bg-orange-100 hover:bg-orange-200 
                  dark:bg-orange-900 dark:hover:bg-orange-800 cursor-pointer
                  transition-colors"
          on:click={() => enterFolder(dir)}
          aria-label={`Abrir carpeta ${dir}`}
        >
          <span>{dir}</span>
        </button>
      </li>
      {/each}
      {#each contents.files as song}
      <div>
        <Song
          {play} 
          title={song.title}
          {queueUriList}
          artist={song.artist}
          uri={song.uri}
          currentSong={initialContents.currentSong}
          {total} 
          {elapsed}
          {trpcQueue}
        />
      </div>
      {/each}
    </ul>
    
    {/if}
</div>
  
  