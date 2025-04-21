<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Menu from '$lib/components/Menu.svelte';
  
    const { Story } = defineMeta({
      title: 'Example/Menu',
      component: Menu,
      parameters: {
        viewport: {
          defaultViewport: 'desktop',
        },
      },
    });
  </script>
  
  <Story name="Desktop" />
  
  <Story
    name="Mobile"
    parameters={{
      viewport: {
        defaultViewport: 'mobile',
      },
    }}
  >
    <div style="width: 375px; margin: 0 auto;">
        <Menu />
    </div>
  </Story>