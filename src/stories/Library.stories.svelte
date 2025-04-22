<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Library from '$lib/components/Library.svelte';
    

    const { Story } = defineMeta({
      title: 'Example/Library',
      component: Library,
      tags: ['autodocs'],
      argTypes: {
                
      },
      args: {
        
      }
    });

    const initialContents = {
      directories: [ 'the rolling stones', 'the beatles', 'pink floyd' ],
      files: [ 'the rolling stones - satisfaction.mp3', 'the beatles - hey jude.mp3', 'the beatles - let it be.mp3', 'pink floyd - time.mp3', 'pink floyd - comfortably numb.mp3' ],
    };

</script>
  
<Story name="Biblioteca" args={{ currentFolder: "Depeche mode", initialContents }} /> 