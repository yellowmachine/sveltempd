import type { Preview } from '@storybook/svelte'
import '../src/app.css';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';


const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
        ...INITIAL_VIEWPORTS,
        defaultViewport: 'responsive',
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;