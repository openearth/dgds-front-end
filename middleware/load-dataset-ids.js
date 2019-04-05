export default function loadDatasetIds({ route, store }) {
  if (process.client) {
    const { dataSetIds } = route.params
    if (dataSetIds) {
      store.dispatch('map/loadLocationsInDatasets', dataSetIds)
    }
  }
}
