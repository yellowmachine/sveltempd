<script>
	import Playlist from "$lib/components/Playlist.svelte";
    import { mpdStatus, playlist } from "$lib/stores.svelte";
    
    let { data } = $props();	

    playlist.update(data.playlist)

</script>

<Playlist 
    songs={ playlist.value } 
    currentSongId={ mpdStatus.value?.songid } 
    elapsed={ mpdStatus.value?.time?.elapsed }  
    total={ mpdStatus.value?.time?.total }
/>