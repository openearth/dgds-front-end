import layerFactory from '../layer-factory'

export default layerFactory('geojson', {
  id: 'locations',
  type: 'circle',
  paint: {
    default: {
      'circle-radius': 5,
      'circle-stroke-width': 2,
      'circle-stroke-opacity': [
        'case',
        ['get', 'active'],
        1,
        ['!', ['get', 'active']],
        0,
        0,
      ],
    },
    dark: {
      'circle-color': '#ff0000',
      'circle-stroke-color': '#ffff00',
    },
    light: {
      'circle-color': '#0000ff',
      'circle-stroke-color': '#ff00ff',
    },
  },
})
