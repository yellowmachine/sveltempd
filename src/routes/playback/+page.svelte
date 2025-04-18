<script lang="ts">
    import SongInfo from "$lib/components/SongInfo.svelte";
    import { mpdStatus } from "$lib/stores";

</script>

<SongInfo currentSong={mpdStatus.value?.currentSong} />