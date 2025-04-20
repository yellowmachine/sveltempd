<script>
	import Queue from "$lib/components/Queue.svelte";
    import { mpdStatus } from "$lib/stores.svelte";
    
    let { data } = $props();	
</script>

<Queue songs={ data.queue } currentSongId={ mpdStatus.value?.songid } elapsed={ mpdStatus.value?.elapsed }  />