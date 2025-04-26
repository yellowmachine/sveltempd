<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Setup from '$lib/components/Setup.svelte';

    const { Story } = defineMeta({
      title: 'Admin/Setup',
      component: Setup,
      tags: ['autodocs'],
      
    });

</script>
  
<Story name="Primary" />
