import Vue from 'vue'
import VueTour from 'vue-tour'
import 'vue-tour/dist/vue-tour.css'
export const tourConfig = {
  useKeyboardNavigation: true
}

export const tourSteps = [
  {
    target: '[data-v-step="1"]',
    content: 'Welcome to <strong>BlueEarth Data</strong>!',
    params: {
      placement: 'right'
    }
  },
  {
    target: '[data-v-step="2"]',
    content: 'BlueEarth Data is organized by <strong>theme</strong>.',
    params: {
      placement: 'right'
    }
  },
  {
    target: '[data-v-step="3"]',
    content: '<strong>Datasets</strong> for each theme are listed here.',
    params: {
      placement: 'left'
    }
  },
  {
    target: '[data-v-step="4"]',
    content:
      'Toggle <strong>spatial maps</strong> and <strong>time series</strong> for each dataset.',
    params: {
      placement: 'bottom'
    }
  },
  {
    target: '[data-v-step="5"]',
    content:
      'Click on a <strong>data point</strong> on the map to see more details.',
    params: {
      placement: 'bottom'
    }
  },
  {
    target: '[data-v-step="6"]',
    content:
      'You can download data if you are <strong>registered</strong> and <strong>logged in</strong>.',
    params: {
      placement: 'right'
    }
  },
  {
    target: '[data-v-step="6"]',
    content: 'Have fun!',
    params: {
      placement: 'right'
    }
  }
]

Vue.use(VueTour)
