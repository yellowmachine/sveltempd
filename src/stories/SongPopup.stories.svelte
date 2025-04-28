<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import SongPopup from '$lib/components/SongPopup.svelte';
	

    const { Story } = defineMeta({
      title: 'Song/SongPopup',
      component: SongPopup,
      tags: ['autodocs'],
      argTypes: {
        
      },
      args: {
        
      }
    });
</script>
  
<Story name="Primary" args={{ showModal: true }} />

<Story name="is in queue" args={{ showModal: true, isInQueue: true }} />
