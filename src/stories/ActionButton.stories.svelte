<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import ActionButton from '$lib/components/ActionButton.svelte';
	import { createMutation } from '$lib/stores.svelte';
	import { m } from '$lib/paraglide/messages';

    const { Story } = defineMeta({
      title: 'Button/ActionButton',
      component: ActionButton,
      tags: ['autodocs'],
      
    });

    const mok = createMutation(() => {});
    const merror = createMutation(() => { throw "error" });
</script>
  
<Story name="ok" >
  <ActionButton m={mok} action={mok.mutate} successMessage="ok" disabled={false} >
    <button
      class="bg-white text-gray-600 hover:bg-gray-300 transition px-4 rounded transition"
    >
      is ok!
    </button>
  </ActionButton>
</Story>

<Story name="error">
  <ActionButton m={merror} action={merror.mutate} successMessage="ok" disabled={false}>
    <button
      class="bg-white text-gray-600 hover:bg-gray-300 transition px-4 rounded transition"
    >
      is error!
    </button>
  </ActionButton>
</Story>