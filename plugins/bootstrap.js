import isEmpty from 'lodash/fp/isEmpty'

function loadThemes(store) {
  const themes = store.state.map.themes
  if (isEmpty(themes)) {
    store.dispatch('map/loadDatasets')
  }
}

export default function bootstrap({ store }) {
  loadThemes(store)
}
