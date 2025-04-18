<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Player from '$lib/components/Player.svelte';
    

    const { Story } = defineMeta({
      title: 'Example/Player',
      component: Player,
      tags: ['autodocs'],
      argTypes: {
        volume: { 
            control: 'text' 
        },
        playing: {
            control: 'boolean',
        },
      },
      args: {
        
      }
    });
  </script>
  
  <Story name="Primary" args={{ volume: 75, playing: false }} />
  