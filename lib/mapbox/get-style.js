import get from 'lodash/fp/get'
import pipe from 'lodash/fp/pipe'

const styles = [
  { url: 'mapbox://styles/mapbox/dark-v10', name: 'Mapbox Dark', id: 'dark' },
  {
    url: 'mapbox://styles/mapbox/light-v10',
    name: 'Mapbox Light',
    id: 'light',
  },
]

export const getStyle = obj => {
  const entries = Object.entries(obj)
  const style = styles.find(style =>
    entries.map(([key, value]) => style[key] === value).every(value => value),
  )
  return { ...style, get: property => style[property] }
}

export const getCurrentStyle = mapbox => {
  const { name } = mapbox.getStyle()
  return getStyle({ name })
}

export const getUrlFromStyleWhere = pipe([getStyle, get('url')])
export const getNameFromStyleWhere = pipe([getStyle, get('name')])
export const getIdFromStyleWhere = pipe([getStyle, get('id')])
