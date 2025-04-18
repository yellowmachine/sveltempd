<script lang="ts">
    import SongInfo from "$lib/components/SongInfo.svelte";
    import { getCurrentSong } from "$lib/stores.svelte";

    const currentSong = getCurrentSong();

</script>

<SongInfo song={currentSong} />