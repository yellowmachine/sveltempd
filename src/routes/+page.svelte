<script>
	import Queue from "$lib/components/Queue.svelte";
    import { mpdStatus } from "$lib/stores.svelte";
    import { queue } from "$lib/stores.svelte";
    
    let { data } = $props();
    
    //queue.update(data.queue); //no deberia hacer esto sino invalidar al layout pues es este quien obtiene esa info

</script>

<Queue 
    songs={ queue.value } 
    currentSong={ data.queue.currentSong } 
    total={mpdStatus.value?.time?.total} 
    elapsed={mpdStatus.value?.time?.elapsed}  
/>