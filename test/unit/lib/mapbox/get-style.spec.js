import {
  getStyle,
  getCurrentStyle,
  getUrlFromStyleWhere,
  getNameFromStyleWhere,
  getIdFromStyleWhere,
} from '../../../../lib/mapbox/get-style'

const darkStyle = {
  url: 'mapbox://styles/global-data-viewer/cjtss3jfb05w71fmra13u4qqm',
  name: 'dgds_dark',
  id: 'dark',
}
const lightStyle = {
  url: 'mapbox://styles/global-data-viewer/cjtslsula05as1fppvrh7n4rv',
  name: 'dgds_light_theme',
  id: 'light',
}

describe('getStyle', () => {
  test('provides dark style when id is provided', () => {
    const query = { id: 'dark' }
    const style = getStyle(query)
    expect(style).toEqual(darkStyle)
  })

  test('provides dark style when name is provided', () => {
    const query = { name: 'Mapbox Dark' }
    const style = getStyle(query)
    expect(style).toEqual(darkStyle)
  })

  test('provides dark style when url is provided', () => {
    const query = { url: 'mapbox://styles/mapbox/dark-v10' }
    const style = getStyle(query)
    expect(style).toEqual(darkStyle)
  })

  test('provides light style when id is provided', () => {
    const query = { id: 'light' }
    const style = getStyle(query)
    expect(style).toEqual(lightStyle)
  })

  test('provides light style when name is provided', () => {
    const query = { name: 'Mapbox Light' }
    const style = getStyle(query)
    expect(style).toEqual(lightStyle)
  })

  test('provides light style when url is provided', () => {
    const query = { url: 'mapbox://styles/mapbox/light-v10' }
    const style = getStyle(query)
    expect(style).toEqual(lightStyle)
  })

  test('return undefined when style can not be found', () => {
    const result = getStyle({ id: 'foo' })
    expect(result).toBe(undefined)
  })
})

describe('getCurrentStyle', () => {
  test('returns current style based on mapboxs style name', () => {
    const mapbox = {
      getStyle: () => ({
        name: 'Mapbox Light',
      }),
    }
    const style = getCurrentStyle(mapbox)
    expect(style).toEqual(lightStyle)
  })
})

describe('getUrlFromStyleWhere', () => {
  test('returns the value of the url property from the matched style', () => {
    const result = getUrlFromStyleWhere({ id: 'dark' })
    expect(result).toBe(darkStyle.url)
  })
  test('return undefined when the matched style can not be found', () => {
    const result = getUrlFromStyleWhere({ id: 'foo' })
    expect(result).toBe(undefined)
  })
})

describe('getNameFromStyleWhere', () => {
  test('returns the value of the name property from the matched style', () => {
    const result = getNameFromStyleWhere({ id: 'dark' })
    expect(result).toBe(darkStyle.name)
  })
  test('return undefined when the matched style can not be found', () => {
    const result = getNameFromStyleWhere({ id: 'foo' })
    expect(result).toBe(undefined)
  })
})

describe('getIdFromStyleWhere', () => {
  test('returns the value of the id property from the matched style', () => {
    const result = getIdFromStyleWhere({ id: 'dark' })
    expect(result).toBe(darkStyle.id)
  })
  test('return undefined when the matched style can not be found', () => {
    const result = getIdFromStyleWhere({ id: 'foo' })
    expect(result).toBe(undefined)
  })
})
