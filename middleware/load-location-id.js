export default function loadLocationId({ route, store }) {
  if (process.client) {
    const { datasetIds, locationId } = route.params
    store.dispatch('map/loadPointDataForLocation', { datasetIds, locationId })
  }
}
