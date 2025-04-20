<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Menu from '$lib/components/Menu.svelte';

    const { Story } = defineMeta({
      title: 'Example/Menu',
      component: Menu,
      tags: ['autodocs'],
      argTypes: {
        
      },
      args: {
        
      }
    });
</script>
  
<Story name="Desktop"  />

<Story name="Mobile">
    <div class="w-[375px] mx-auto">
        <Menu />
    </div>
</Story>

