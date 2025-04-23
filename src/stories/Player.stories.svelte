<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Player from '$lib/components/Player.svelte';
    import DarkDecorator from './DarkDecorator.svelte';


    const { Story } = defineMeta({
      title: 'Player/Player',
      component: Player,
      tags: ['autodocs'],
      argTypes: {
        volume: { 
            control: 'text' 
        },
        playStatus: {
            control: {
                type: 'select',
                options: ['stop', 'play', 'pause']
            }
        },
      },
      args: {
        
      }
    });
</script>
  
<Story name="Play" args={{ volume: 75, playStatus: 'play'}} />

<Story name="Pause" args={{ volume: 30, playStatus: 'pause'}} />

<Story name="Dark" args={{ volume: 15, playStatus: 'pause' }}>
    <DarkDecorator>
        <Player volume={10} playStatus={'play'} />
    </DarkDecorator>
</Story>