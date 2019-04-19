import addLayer from '../../../../lib/mapbox/add-layer'
import { getCurrentStyle } from '../../../../lib/mapbox/get-style'
jest.mock('../../../../lib/mapbox/get-style')
getCurrentStyle.mockReturnValue({ id: 'dark' })

test('call mapbox.addLayer with a correct layer', () => {
  const mapbox = {
    addLayer: jest.fn(),
  }

  const layer = {
    foo: 'bar',
    layout: {
      dark: { id: 'dark' },
      light: { id: 'light' },
    },
    paint: {
      dark: { id: 'dark' },
      light: { id: 'light' },
    },
  }

  addLayer(mapbox)(layer)

  expect(mapbox.addLayer).toHaveBeenCalledWith({
    foo: 'bar',
    layout: { id: 'dark' },
    paint: { id: 'dark' },
  })
})

test('call mapbox.addLayer with a correct layer when style cant be found', () => {
  const mapbox = {
    addLayer: jest.fn(),
  }

  const layer = {
    foo: 'bar',
    layout: {
      light: { id: 'light' },
    },
    paint: {
      light: { id: 'light' },
    },
  }

  addLayer(mapbox)(layer)

  expect(mapbox.addLayer).toHaveBeenCalledWith({
    foo: 'bar',
    layout: {},
    paint: {},
  })
})
