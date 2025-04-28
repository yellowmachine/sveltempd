<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import PlayHere from '$lib/components/PlayHere.svelte';
    

    const { Story } = defineMeta({
      title: 'Player/PlayHere',
      component: PlayHere,
      tags: ['autodocs'],
      argTypes: {
        
      },
      args: {
        
      }
    });
</script>
  
<Story name="Primary" />