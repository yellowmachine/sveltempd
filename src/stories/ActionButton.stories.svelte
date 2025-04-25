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
  
<Story name="ok" >
  <ActionButton action={async () => {}}>
    <button
      class="bg-white text-gray-600 hover:bg-gray-300 transition px-4 rounded transition"
    >
      is ok!
    </button>
  </ActionButton>
</Story>

<Story name="error">
  <ActionButton action={async () => { throw "error" }}>
    <button
      class="bg-white text-gray-600 hover:bg-gray-300 transition px-4 rounded transition"
    >
      is error!
    </button>
  </ActionButton>
</Story>