import loadModule from '../../../lib/load-module'
const modulePath = '../../../middleware/load-dataset-ids.js'

test('dispatch store action when on client', async () => {
  const dispatch = jest.fn()
  const datasetIds = ['foo', 'bar']
  const route = { params: { datasetIds } }
  const store = { dispatch }

  process.client = true
  const loadDatasetIds = await loadModule(import(modulePath))

  loadDatasetIds({ route, store })

  expect(dispatch).toHaveBeenCalledWith('map/storeActiveDatasets', datasetIds)
})

test('dont dispatch store action when datasets are missing', async () => {
  const dispatch = jest.fn()
  const datasetIds = undefined
  const route = { params: { datasetIds } }
  const store = { dispatch }

  process.client = true
  const loadDatasetIds = await loadModule(import(modulePath))

  loadDatasetIds({ route, store })

  expect(dispatch).not.toHaveBeenCalled()
})

test('dont dispatch store action when not on client', async () => {
  const dispatch = jest.fn()
  const datasetIds = ['foo', 'bar']
  const route = { params: { datasetIds } }
  const store = { dispatch }

  process.client = false
  const loadDatasetIds = await loadModule(import(modulePath))

  loadDatasetIds({ route, store })

  expect(dispatch).not.toHaveBeenCalled()
})
