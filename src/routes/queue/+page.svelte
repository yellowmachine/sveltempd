<script>
	import Queue from "$lib/components/Queue.svelte";
    import { mpdStatus } from "$lib/stores.svelte";
    import { queue, currentSong } from "$lib/stores.svelte";
    
</script>

<Queue 
    songs={ queue.value } 
    currentSong={ currentSong.value } 
    total={ mpdStatus.value?.time?.total } 
    elapsed={ mpdStatus.value?.time?.elapsed }  
/>