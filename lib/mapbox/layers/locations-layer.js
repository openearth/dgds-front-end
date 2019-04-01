import layerFactory from '../layer-factory'

export default layerFactory('geojson', {
  id: 'locations',
  type: 'symbol',
  layout: {
    dark: {
      'icon-image': 'icon-waterlevel-dark',
      // 'icon-size': 0.25,
    },
    light: {
      'icon-image': 'icon-waterlevel-light',
      // 'icon-size': 0.25,
    },
  },
  paint: {
    // dark: {
    //   'circle-radius': 5,
    //   'circle-color': '#ff0000',
    // },
    // light: {
    //   'circle-radius': 5,
    //   'circle-color': '#0000ff',
    // },
  },
})
