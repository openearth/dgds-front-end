import Vue from 'vue'
import VueTour from 'vue-tour'

export const tourConfig = {
  useKeyboardNavigation: true,
}

export const tourSteps = [
  {
    target: '[data-v-step="1"]',
    content: 'Welcome to BlueEarth Data!',
    params: {
      placement: 'right',
    },
  },
  {
    target: '[data-v-step="2"]',
    content: 'BlueEarth Data is organized by theme.',
    params: {
      placement: 'right',
    },
  },
  {
    target: '[data-v-step="3"]',
    content: 'Datasets for each theme are listed here.',
    params: {
      placement: 'left',
    },
  },
  {
    target: '[data-v-step="4"]',
    content: 'Toggle spatial maps and time series for each dataset.',
    params: {
      placement: 'bottom',
    },
  },
  {
    target: '[data-v-step="5"]',
    content: 'Click on a data point on the map to see more details.',
    params: {
      placement: 'bottom',
    },
  },
  {
    target: '[data-v-step="6"]',
    content: 'You can download data if you are registered and logged in.',
    params: {
      placement: 'right',
    },
  },
  {
    target: '[data-v-step="6"]',
    content: 'Have fun!',
    params: {
      placement: 'right',
    },
  },
]

Vue.use(VueTour)
