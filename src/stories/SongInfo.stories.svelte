<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import SongInfo from '$lib/components/SongInfo.svelte';
    

    const { Story } = defineMeta({
      title: 'Example/SongInfo',
      component: SongInfo,
      tags: ['autodocs'],
      argTypes: {
        song: { 
            control: {
                type: 'object',
                properties: {
                    title: { control: 'text' },
                    artist: { control: 'text' }
                }
            },
        } 
      },
      args: {
        
      }
    });
  </script>
  
  <Story name="Led Zeppelin" args={{ song: {artist: "Led Zeppelin", title: "Babe, I’m Gonna Leave You"} }} />
  <Story name="Empty" args={{ song: {artist: "", title: ""} }} />
  