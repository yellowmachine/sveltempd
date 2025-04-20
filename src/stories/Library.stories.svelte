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

    const initialContents = [
      { directory: 'the rolling stones' },
      { file: 'the rolling stones - satisfaction.mp3', duration: 200 },
      { directory: 'the beatles' },
      { file: 'the beatles - hey jude.mp3', duration: 300 },
      { file: 'the beatles - let it be.mp3', duration: 240 },
      { directory: 'pink floyd' },
      { file: 'pink floyd - time.mp3', duration: 400 },
      { file: 'pink floyd - comfortably numb.mp3', duration: 500 }
    ];
</script>
  
<Story name="Biblioteca" args={{ currentFolder: "Depeche mode", initialContents }} /> 