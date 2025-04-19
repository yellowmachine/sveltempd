<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import PlayerButton from '$lib/components/PlayerButton.svelte';
    import Icon from '@iconify/svelte';


    const { Story } = defineMeta({
      title: 'Example/PlayerButton',
      component: PlayerButton,
      tags: ['autodocs'],
      argTypes: {
        
      },
      args: {
        
      }
    });
</script>
  
<Story name="Con icono de anterior">
    <PlayerButton ariaLabel="Anterior">
        <Icon icon="mdi:skip-previous" width="32" height="32" />
    </PlayerButton>
</Story>

<Story name="Con icono de play">
    <PlayerButton ariaLabel="Play">
        <Icon icon="mdi:play" width="32" height="32" />
    </PlayerButton>
</Story>