import get from 'lodash/fp/get'
import head from 'lodash/fp/head'
import pipe from 'lodash/fp/pipe'
import { filterBy } from '../../lib/utils'

const styles = [
  {
    url: 'mapbox://styles/global-data-viewer/cjtss3jfb05w71fmra13u4qqm',
    name: 'dgds_dark',
    id: 'dark',
  },
  {
    url: 'mapbox://styles/global-data-viewer/cjtslsula05as1fppvrh7n4rv',
    name: 'dgds_light_theme',
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
