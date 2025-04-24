<script lang="ts">
	import Playlist from "$lib/components/Playlist.svelte";

    let { data } = $props();

</script>

<Playlist playlist={ data }/>