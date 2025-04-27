<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Queue from '$lib/components/Queue.svelte';
    import type { Song } from '$lib/messages';

    const { Story } = defineMeta({
      title: 'Queue/Queue',
      component: Queue,
      tags: ['autodocs'],
    });

    const songs: Song[] = [
      {
        artist: 'Queen',
        title: 'Bohemian Rhapsody',
        id: 1,
        uri: 'music/queen/bohemian_rhapsody.mp3',
        time: '5:55',
      },
      {
        artist: 'The Beatles',
        title: 'Hey Jude',
        id: 2,
        uri: 'music/beatles/hey_jude.mp3',
        time: '7:08',
      },
      {
        artist: 'Nirvana',
        title: 'Smells Like Teen Spirit',
        id: 3,
        uri: 'music/nirvana/smells_like_teen_spirit.mp3',
        time: '5:01',
      },
    ];


</script>
  
<Story name="default" args={ {songs: songs, currentSong: null, elapsed: 0, total: 0 } } /> 

<Story name="playing" args={ {songs: songs, currentSong: 'music/queen/bohemian_rhapsody.mp3', elapsed: 0, total: 0 } } /> 