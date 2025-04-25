<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Admin from '$lib/components/Admin.svelte';

    const { Story } = defineMeta({
      title: 'Admin/Form',
      component: Admin,
      tags: ['autodocs']
    });
  </script>
  
  <Story name="Primary"  />
