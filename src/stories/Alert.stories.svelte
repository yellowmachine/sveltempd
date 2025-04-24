<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Alert from '$lib/components/Alert.svelte';

    const { Story } = defineMeta({
      title: 'Menu/Alert',
      component: Alert,
      tags: ['autodocs'],
      argTypes: {
        message: {
            control: {
                type: 'text',
            },
        } 
      },
      args: {
        
      }
    });
  </script>
  
  <Story name="Primary" args={{ message: "No se ha podido reproducir la canción" }} />
