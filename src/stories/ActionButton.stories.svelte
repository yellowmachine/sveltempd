<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import ActionButton from '$lib/components/ActionButton.svelte';

    const { Story } = defineMeta({
      title: 'Button/ActionButton',
      component: ActionButton,
      tags: ['autodocs'],
      argTypes: {
        
      },
      args: {
        
      }
    });
</script>
  
<Story name="ok" args={{ text: "is ok!", action: async () => {} }} />

<Story name="error" args={{ text: "is error!", action: async () => { throw "error" } }} />