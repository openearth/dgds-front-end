import Vue from 'vue'
import VueTour from 'vue-tour'
import 'vue-tour/dist/vue-tour.css'
export const tourConfig = {
  useKeyboardNavigation: true
}

export const tourSteps = [
  {
    target: '[data-v-step="1"]',
    content: 'Welcome to <strong>Metocean PEZ</strong>!',
    params: {
      placement: 'right'
    }
  },
  {
    target: '[data-v-step="2"]',
    content: '<strong>Map layers</strong> component to turn on/off layers.',
    params: {
      placement: 'left'
    }
  },
  {
    target: '[data-v-step="3"]',
    content: 'Layer with point data.',
    params: {
      placement: 'left'
    }
  },
  {
    target: '[data-v-step="3"]',
    content: 'Click on a location for <strong>time series</strong> and more.',
    params: {
      placement: 'left'
    }
  },
  {
    target: '[data-v-step="5"]',
    content:
      'Expand the accordions to see the available data.',
    params: {
      placement: 'right'
    }
  },
  {
    target: '[data-v-step="6"]',
    content:
      'You can download the current view as a PNG or download data as CSV',
    params: {
      placement: 'right'
    }
  },
  {
    target: '[data-v-step="7"]',
    content: 'Click here for the available Stories.',
    params: {
      placement: 'bottom'
    }
  }
]

Vue.use(VueTour)
