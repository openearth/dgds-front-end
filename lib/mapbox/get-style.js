import get from 'lodash/fp/get'
import head from 'lodash/fp/head'
import pipe from 'lodash/fp/pipe'
import { filterBy } from '../../lib/utils'

const styles = [
  { url: 'mapbox://styles/mapbox/dark-v10', name: 'Mapbox Dark', id: 'dark' },
  {
    url: 'mapbox://styles/mapbox/light-v10',
    name: 'Mapbox Light',
    id: 'light',
  },
]

/**
 * Get the style based on p
 * @param {Object} obj Query object
 */
// prettier-ignore
export const getStyle = obj =>
  pipe([
    filterBy(obj),
    head
  ])(styles)

export const getCurrentStyle = mapbox => {
  const { name } = mapbox.getStyle()
  return getStyle({ name })
}

export const getUrlFromStyleWhere = pipe([getStyle, get('url')])
export const getNameFromStyleWhere = pipe([getStyle, get('name')])
export const getIdFromStyleWhere = pipe([getStyle, get('id')])
