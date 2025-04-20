<script>
	import Playlist from "$lib/components/Playlist.svelte";
    import { mpdStatus } from "$lib/stores.svelte";
    
    let { data } = $props();	
</script>

<Playlist songs={ data.playlist } currentSongId={ mpdStatus.value?.songid } elapsed={ mpdStatus.value?.elapsed }  />