<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Song from '$lib/components/Song.svelte';

    const { Story } = defineMeta({
      title: 'Song/Song',
      component: Song,
      tags: ['autodocs'],
      argTypes: {
        
      },
      args: {
        
      }
    });

    const song = {
      artist: "Led Zeppelin",
      title: "Babe, I’m Gonna Leave You",
      uri: "spotify:track:2p8o7pOyU5qxmpxV2IwAzH",
      total: '3:53',
      elapsed: 30
    }
</script>
  
<Story name="Primary" args={{ ...song }} />

<Story name="current song" args={{ ...song, currentSong: {uri: "spotify:track:2p8o7pOyU5qxmpxV2IwAzH",  elapsed: 30, total: 100} }} />
