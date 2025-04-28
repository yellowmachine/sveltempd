<script lang="ts">
    import Library from '$lib/components/Library.svelte';
    import { mpdStatus, queue } from "$lib/stores.svelte";
    import { currentSong } from '$lib/stores.svelte';
    let { data } = $props();

    let queueUriList: string[] = $derived(queue.uriList);
    
</script>
  
<Library 
    initialContents={ {...data, currentSong: {uri: data.currentSong, elapsed: currentSong.value.elapsed, total: mpdStatus.value?.time?.total}}} 
    {queueUriList} 
/>