<script lang="ts">
    import Library from '$lib/components/Library.svelte';
    import { mpdStatus } from "$lib/stores.svelte";
    export let data;

</script>
  
<Library 
    initialContents={data.rootContents} 
    currentSongId={mpdStatus.value?.songid}
    total={ mpdStatus.value?.time?.total } 
    elapsed={ mpdStatus.value?.time?.elapsed }
/>