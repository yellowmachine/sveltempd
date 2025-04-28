<script lang="ts">
  	import SongList from './SongList.svelte';
    import type { Song as TSong } from '$lib/messages';
    import { trpcQueue } from '../trpcClients'
    
    let {songs, currentSong, lastLoadedPlaylist="default"}: 
        {songs: TSong[], currentSong: 
          {uri: string | null, elapsed: number | null, total: number | undefined} | null, 
          lastLoadedPlaylist?: string | null } = $props();

    let newPlaylistName: string | null = $state('');

    async function clear() {
        await trpcQueue.clear();
    }

    function play(uri: string){
        const songIndex = songs.findIndex((song) => song.uri === uri);
        if (songIndex) {
            trpcQueue.play(songIndex);
        }
    }

    function saveAsName() {
      return newPlaylistName !== "" ? newPlaylistName: lastLoadedPlaylist;
    }

    function save() {
      trpcQueue.saveAs(saveAsName() || 'default');
    }

</script>

<div>
  <h2 class="text-3xl font-bold text-orange-600">Cola de reproduccion</h2>
  {#if songs.length !== 0}  
  <button
      onclick={clear}
      class="px-5 py-2.5 rounded-md font-semibold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-red-600
            hover:from-red-500 hover:via-orange-600 hover:to-orange-500
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
            transition-colors duration-200 shadow hover:shadow-lg"
    >
        Limpiar
  </button>
  <button class="px-5 py-2.5 rounded-md font-semibold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-red-600
            hover:from-red-500 hover:via-orange-600 hover:to-orange-500
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
            transition-colors duration-200 shadow hover:shadow-lg" 
    onclick={save}>
    Guardar como:
    <input type="text" class="bg-white text-black w-50" bind:value={newPlaylistName} />
  </button>
  {/if}

    <div>
      <SongList {play} {trpcQueue} {songs} {currentSong} />
    </div>
</div>
  