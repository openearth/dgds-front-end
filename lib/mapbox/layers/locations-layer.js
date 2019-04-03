import layerFactory from '../layer-factory'

export default layerFactory('geojson', {
  id: 'locations',
  type: 'circle',
  paint: {
    default: {
      'circle-radius': 8,

      // prettier-ignore
      'circle-stroke-width': [
        'case',
        ['get', 'active'], 8,
        4
      ]
    },
    dark: {
      // prettier-ignore
      'circle-color': [
        'case',
        ['get', 'active'], '#ffffff',
        '#ff33dd'
      ],

      // prettier-ignore
      'circle-stroke-color': [
        'case',
        ['get', 'active'], '#66bbdc',
        '#000000',
      ],

      // prettier-ignore
      'circle-stroke-opacity': [
        'case',
        ['get', 'active'], 1,
        0.2,
      ]
    },
    light: {
      // prettier-ignore
      'circle-color': [
        'case',
        ['get', 'active'], '#ffffff',
        '#cc28b0'
      ],

      // prettier-ignore
      'circle-stroke-color': [
        'case',
        ['get', 'active'], '#66bbdc',
        '#ffffff',
      ],

      // prettier-ignore
      'circle-stroke-opacity': [
        'case',
        ['get', 'active'], 1,
        0.6
      ]
    },
  },
})
