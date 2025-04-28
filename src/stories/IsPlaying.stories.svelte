<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import IsPlaying from '$lib/components/IsPlaying.svelte';
    
    const { Story } = defineMeta({
      title: 'Player/IsPlaying',
      component: IsPlaying,
      tags: ['autodocs'],
    });
</script>
  
<Story name="Primary" />