<script lang="ts">
    export let data;
    import Library from '$lib/components/Library.svelte';
</script>
  
<Library initialContents={data.rootContents} />