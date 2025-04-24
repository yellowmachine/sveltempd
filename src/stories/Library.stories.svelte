<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Library from '$lib/components/Library.svelte';
    import type { Song } from '$lib/messages';

    const { Story } = defineMeta({
      title: 'Library/Library',
      component: Library,
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

    const initialContents = {
      directories: [ 'the rolling stones', 'the beatles', 'pink floyd' ],
      currentSong: 'music/beatles/hey_jude.mp3', 
      files: songs  
    };

</script>
  
<Story name="Biblioteca" args={{ queueUriList: ['music/beatles/hey_jude.mp3', 'music/nirvana/smells_like_teen_spirit.mp3'], currentFolder: "Depeche mode", initialContents }} /> 