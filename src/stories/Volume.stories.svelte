<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Volume from '$lib/components/Volume.svelte';

    const { Story } = defineMeta({
      title: 'Player/Volume',
      component: Volume,
      tags: ['autodocs']
    });
</script>
  
<Story name="Primary" args={{ volume: 75 }} />