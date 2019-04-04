import entries from 'lodash/entries'
import identity from 'lodash/identity'
import toLower from 'lodash/toLower'
import getColors from '../lib/styling/colors'

export default function customProperties({ store }, inject) {
  const setCustomProperties = theme => {
    const colors = getColors(theme)
    entries(colors)
      .map(([_key, value]) => {
        const [, ...parts] = /([a-z]+)([A-Za-z]+)?(\d+)?/.exec(_key)
        const key = parts
          .filter(identity)
          .map(toLower)
          .join('-')
        return [key, value]
      })
      .forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value)
      })
  }
  inject('setCustomProperties', setCustomProperties)
  setCustomProperties(store.state.preferences.theme.active)
}
