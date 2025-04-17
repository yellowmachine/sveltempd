<script lang="ts">
    import SongInfo from "$lib/components/SongInfo.svelte";
    import { mpdState } from "$lib/stores";

</script>

<SongInfo currentSong={mpdState.value?.currentSong} />