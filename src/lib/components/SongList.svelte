<script lang="ts">
    import type { Song as TSong } from '$lib/messages';
    import Song from './Song.svelte';
	  import type { TRPCQueue } from './trpcClients';

    export let songs: TSong[] = [];
    export let currentSong: string | null;
    export let elapsed: number | undefined; 
    export let total: number | undefined;
    export let trpcQueue: TRPCQueue;
    export let play: (uri: string) => void;
  
  </script>
  
  <ul>
    {#each songs as song}
      <li>
        <Song
          {play}
          {trpcQueue}
          {currentSong}
          title={song.title}
          artist={song.artist}
          uri={song.uri}
          {elapsed}
          {total}
        />
      </li>
    {/each}
  </ul>
