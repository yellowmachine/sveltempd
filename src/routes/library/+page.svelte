<script lang="ts">
    export let data: { rootContents: any[] };
    import Library from '$lib/components/Library.svelte';
</script>
  
<Library initialContents={data.rootContents} />