<script lang="ts">
  import type { Song as TSong } from '$lib/messages';
  import Song from './Song.svelte';
  import type { TRPCQueue } from '../trpcClients';

  export let songs: TSong[] = [];
  export let currentSong: { uri: string | null; elapsed: number | null; total: number | undefined } | null;
  export let trpcQueue: TRPCQueue;
  export let play: (uri: string) => void;
</script>

<ul class="mt-4">
  {#each songs as song}
    <li class="mb-4">
      <Song
        {play}
        {trpcQueue}
        {currentSong}
        title={song.title}
        artist={song.artist}
        uri={song.uri}
        total={song.time}
      />
    </li>
  {/each}
</ul>

<style>
  
</style>