import Vue from 'vue'
import diff from '../lib/diff-object'

let map
const styles = {
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/mapbox/light-v10',
}

Vue.directive('mapbox', {
  async bind(container, { value }) {
    const MapboxGLModule = await import('mapbox-gl')
    const mapboxgl = MapboxGLModule.default

    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

    map = new mapboxgl.Map({
      container,
      style: styles.dark,
    })

    map.addControl(new mapboxgl.NavigationControl())
  },

  update(container, { value: newValue, oldValue }) {
    const valueDiff = diff(newValue, oldValue)
    if (valueDiff === undefined) return

    Object.entries(valueDiff).forEach(([key, value]) => {
      switch (key) {
        case 'style':
          map.setStyle(styles[value])
      }
    })
  },
})
