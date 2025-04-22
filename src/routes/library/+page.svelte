<script lang="ts">
    import Library from '$lib/components/Library.svelte';
    import { mpdStatus } from "$lib/stores.svelte";
    export let data;

</script>
  
<Library 
    initialContents={data} 
    total={ mpdStatus.value?.time?.total } 
    elapsed={ mpdStatus.value?.time?.elapsed }
/>