<script lang="ts">
	  import type { Song as TSong } from '$lib/messages';
    import SongList from './SongList.svelte';
    import { trpcQueue } from './trpcClients'
    
    export let songs: TSong[];
    export let currentSongId: number | undefined;
    export let elapsed: number | undefined;
    export let total: number | undefined;
  </script>
  
<SongList { trpcQueue } {songs} {currentSongId} {elapsed} {total} />
  