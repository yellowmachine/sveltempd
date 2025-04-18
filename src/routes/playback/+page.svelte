<script lang="ts">
    import SongInfo from "$lib/components/SongInfo.svelte";
    import { currentSong } from "$lib/stores.svelte";

</script>

<SongInfo song={currentSong} />