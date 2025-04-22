<script lang="ts">
	  import type { Song as TSong } from '$lib/messages';
    import SongList from './SongList.svelte';
    
    export let songs: TSong[];
    export let currentSongId: number | undefined;
    export let elapsed: number | undefined;
    export let total: number | undefined;
  </script>
  
<SongList {songs} {currentSongId} {elapsed} {total} />
  