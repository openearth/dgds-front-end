export default function loadLocationId({ route, store }) {
  if (process.client) {
    const { dataSetIds, locationId } = route.params
    if (dataSetIds && locationId) {
      store.commit('map/setActiveLocationIds', [locationId])
      store.dispatch('map/loadPointDataForLocation', { dataSetIds, locationId })
    }
  }
}
