<script lang="ts">
    import type { Song as TSong } from '$lib/messages';

    import Song from './Song.svelte';
    export let songs: TSong[] = [];
    export let currentSongId: number | undefined;
    export let elapsed: number | undefined; 
    export let total: number | undefined;
  
  </script>
  
  <ul>
    {#each songs as song}
      <li>
        <Song
          songId={song.id}
          currentSongId={currentSongId}
          title={song.title}
          artist={song.artist}
          uri={song.uri}
          {elapsed}
          {total}
        />
      </li>
    {/each}
  </ul>
