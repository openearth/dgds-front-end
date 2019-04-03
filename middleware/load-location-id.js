export default function loadLocationId({ route, store }) {
  if (process.client) {
    const { dataSetIds, locationId } = route.params
    store.dispatch('map/loadPointDataForLocation', { dataSetIds, locationId })
  }
}
