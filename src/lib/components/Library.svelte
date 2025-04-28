<script lang="ts">
    import { trpc } from '$lib/trpc/client';
    import { page } from '$app/state';
    import PlayHere from './PlayHere.svelte';
	  import type { Song as TSong } from '$lib/messages';
	  import Song from './Song.svelte';
	  import { trpcLibraryClient, trpcQueue } from '../trpcClients';
	  import { createAsync } from '$lib/stores.svelte';
	import ActionButton from './ActionButton.svelte';
  
    export let initialContents: {directories: string[], files: TSong[], 
      currentSong: {uri: string | null, elapsed: number | null, total: number | undefined} | null} = 
      {directories: [], files: [], currentSong: null};
    export let currentFolder = '';
    export let queueUriList: string[] = [];
    
    let history: string[] = [];
    let contents: {directories: string[], files: TSong[]} = initialContents;
  
    async function loadFolder(folder: string) {
      contents = {files: [], directories: []};
      currentFolder = folder;
      const data = await trpcLibraryClient.load(folder);
      contents = data;
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
  
    const mutPlay = createAsync(handlePlayHere);
    const mutEnterFolder = createAsync(enterFolder);
    const mutUpdate = createAsync(update);

    async function handlePlayHere() {
      if (contents.files.length > 0) {
        await trpc(page).player.playHere.mutate({ path: history.join('/') });
      }
    }

    async function play(uri: string){
      await trpcQueue.clear();
      await trpcQueue.add(uri);
      await trpcQueue.play();
    }

    async function update() {
      await trpcLibraryClient.update();
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
        onclick={goBack}
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
      <PlayHere onClick={mutPlay.call} disabled={mutPlay.loading || contents.files.length === 0} />
      <ActionButton mut={mutUpdate} >
        <button class="bg-orange-400 rounded px-4 py-2 hover:bg-orange-200 text-white">Actualizar base de datos</button>
  </ActionButton>
    </div>
  
    {#if mutPlay.loading}
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
          onclick={() => mutEnterFolder.call(dir)}
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
          total={song.time}
          currentSong={initialContents.currentSong}
          {trpcQueue}
        />
      </div>
      {/each}
    </ul>
    
    {/if}
</div>
  
  