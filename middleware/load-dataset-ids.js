export default function loadDatasetIds({ route, store }) {
  if (process.client) {
    const { datasetIds } = route.params
    if (datasetIds) {
      store.dispatch('map/storeActiveDatasets', datasetIds)
    }
  }
}
