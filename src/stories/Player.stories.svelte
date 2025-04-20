<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Player from '$lib/components/Player.svelte';
    import DarkDecorator from './DarkDecorator.svelte';


    const { Story } = defineMeta({
      title: 'Example/Player',
      component: Player,
      tags: ['autodocs'],
      argTypes: {
        volume: { 
            control: 'text' 
        },
        isPlaying: {
            control: 'boolean',
        },
      },
      args: {
        
      }
    });
</script>
  
<Story name="Primary" args={{ volume: 75, isPlaying: false }} />

<Story name="Dark" args={{ volume: 75, isPlaying: false }}>
    <DarkDecorator>
        <Player volume={10} isPlaying={true} />
    </DarkDecorator>
</Story>