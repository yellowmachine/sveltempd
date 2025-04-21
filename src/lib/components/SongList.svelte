<script lang="ts">
    import Song from './Song.svelte';
    export let songs: any[] = [];
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
          {elapsed}
          {total}
          {...song}
        />
      </li>
    {/each}
  </ul>
