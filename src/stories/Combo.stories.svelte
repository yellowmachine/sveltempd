<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Combo from '$lib/components/Combo.svelte'


    const { Story } = defineMeta({
      title: 'Utils/Combo',
      component: Combo,
      tags: ['autodocs'],
      argTypes: {
        
      },
      args: {
        options: [
            {
                title: 'Rock',
                description: 'Música enérgica y guitarras eléctricas',
                value: 'rock',
            },
            {
                title: 'Pop',
                description: 'Éxitos populares y melodías pegadizas',
                value: 'pop',
            },
            {
                title: 'Jazz',
                description: 'Improvisación y ritmos sofisticados',
                value: 'jazz',
            },
            ],
            selected: 'rock',
            onSelect: () => {
            // Esto será reemplazado por la acción de Storybook
            },
      }
    });
</script>
  
<Story name="Primary" />