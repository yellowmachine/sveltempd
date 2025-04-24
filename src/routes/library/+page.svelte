<script lang="ts">
    import Library from '$lib/components/Library.svelte';
    import { mpdStatus, queue } from "$lib/stores.svelte";
    let { data } = $props();

    let queueUriList: string[] = $derived(queue.uriList);
    
</script>
  
<Library 
    initialContents={data} 
    total={ mpdStatus.value?.time?.total } 
    elapsed={ mpdStatus.value?.time?.elapsed }
    {queueUriList}
/>