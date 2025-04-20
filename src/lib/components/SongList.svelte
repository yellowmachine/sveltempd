<script lang="ts">
    import Song from './Song.svelte';
    export let songs: any[] = [];
    export let currentSongId: number | undefined;
    export let elapsed: number | undefined; 
  
    function getElapsed(songId: number) {
      return songId === currentSongId ? elapsed : undefined;
    }
  </script>
  
  <ul>
    {#each songs as song}
      <li>
        <Song
          songId={song.id}
          currentSongId={currentSongId}
          title={song.title}
          artist={song.artist}
          duration={song.duration}
          elapsed={getElapsed(song.id)}
          {...song}
        />
      </li>
    {/each}
  </ul>
  