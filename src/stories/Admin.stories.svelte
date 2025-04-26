<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Admin from '$lib/components/Admin.svelte';

    const { Story } = defineMeta({
      title: 'Admin/Form',
      component: Admin,
      tags: ['autodocs']
    });

    const data = {
      global: { latency: 100, setupDone: false },
      server: { ip: '192.168.1.44', username: 'miguel', password: null },
      clients: []
    }
  </script>
  
  <Story name="Primary" args={{ data }}  />
