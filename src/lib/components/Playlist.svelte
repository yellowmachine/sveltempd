<script lang="ts">
    import SongList from './SongList.svelte';
    // Supón que tienes las props o el store adecuado:
    export let songs: any[];
    export let currentSongId: number | undefined;
    export let elapsed: number | undefined;
  </script>
  
<SongList {songs} {currentSongId} {elapsed} />
  