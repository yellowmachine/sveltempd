<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import RandomSpinner from '$lib/components/RandomSpinner.svelte';

    const { Story } = defineMeta({
      title: 'Example/RandomSpinner',
      component: RandomSpinner,
      tags: ['autodocs'],
      argTypes: {
        spinnerName: {
          control: {
            type: 'select',
            options: [
              'BarLoader', 'Chasing', 'Circle', 'DoubleBounce', 'Firework',
              'Jellyfish', 'Jumper', 'Pulse', 'Rainbow', 'RingLoader',
              'ScaleOut', 'Shadow', 'SpinLine', 'Stretch', 'SyncLoader',
              'Wave', 'Square', 'Moon'
            ]
          }
        },
        color: {
          control: {
            type: 'color'
          }
        },
        size: {
          control: {
            type: 'number'
          }
        },
        duration: {
          control: {
            type: 'text'
          }
        },
        unit: {
          control: {
            type: 'text'
          }
        }
      },
      args: {
        
      }
    });
  </script>
  
  <Story name="Random" args={ {} } />
  <Story name="Circle" args={ { spinnerName: "Circle"} } />
  