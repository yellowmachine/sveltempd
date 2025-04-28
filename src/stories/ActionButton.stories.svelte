<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import ActionButton from '$lib/components/ActionButton.svelte';
	  import { createAsync } from '$lib/stores.svelte';

    const { Story } = defineMeta({
      title: 'Button/ActionButton',
      component: ActionButton,
      tags: ['autodocs'],
      
    });

    const mok = createAsync(() => {});
    const merror = createAsync(() => { throw "error" });
</script>
  
<Story name="ok" >
  <ActionButton mut={mok} >
    <button
      class="bg-white text-gray-600 hover:bg-gray-300 transition px-4 rounded transition"
    >
      is ok!
    </button>
  </ActionButton>
</Story>

<Story name="error">
  <ActionButton mut={merror} >
    <button
      class="bg-white text-gray-600 hover:bg-gray-300 transition px-4 rounded transition"
    >
      is error!
    </button>
  </ActionButton>
</Story>