export default function loadLocationId({ route, store }) {
  if (process.client) {
    const { datasetIds, locationId } = route.params
    if (datasetIds && locationId) {
      store.commit('map/setActiveLocationIds', [locationId])
      store.dispatch('map/loadPointDataForLocation', { datasetIds, locationId })
    }
  }
}
