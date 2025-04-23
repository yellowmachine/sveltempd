<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Library from '$lib/components/Library.svelte';
    

    const { Story } = defineMeta({
      title: 'Library/Library',
      component: Library,
      tags: ['autodocs'],
      argTypes: {
                
      },
      args: {
        
      }
    });

    const initialContents = {
      directories: [ 'the rolling stones', 'the beatles', 'pink floyd' ],
      currentSong: 'the rolling stones - satisfaction.mp3', 
      files: [] // poner un array de Songs  
    };

</script>
  
<Story name="Biblioteca" args={{ currentFolder: "Depeche mode", initialContents }} /> 