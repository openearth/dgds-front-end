import loadModule from '../../../lib/load-module'
const modulePath = '../../../middleware/load-location-id.js'

test('dispatch store action when on client', async () => {
  const dispatch = jest.fn()
  const commit = jest.fn()
  const datasetIds = ['foo', 'bar']
  const locationId = 'baz'
  const route = { params: { datasetIds, locationId } }
  const store = { dispatch, commit }

  process.client = true
  const loadLocationId = await loadModule(import(modulePath))

  loadLocationId({ route, store })

  expect(commit).toHaveBeenCalledWith('map/setActiveLocationIds', [locationId])

  expect(dispatch).toHaveBeenCalledWith('map/loadPointDataForLocation', {
    datasetIds,
    locationId,
  })
})

test('dont dispatch store action when datasets are missing', async () => {
  const dispatch = jest.fn()
  const commit = jest.fn()
  const datasetIds = undefined
  const locationId = 'baz'
  const route = { params: { datasetIds, locationId } }
  const store = { dispatch, commit }

  process.client = true
  const loadLocationId = await loadModule(import(modulePath))

  loadLocationId({ route, store })

  expect(dispatch).not.toHaveBeenCalled()
})

test('dont dispatch store action when locationId id missing', async () => {
  const dispatch = jest.fn()
  const commit = jest.fn()
  const datasetIds = ['foo', 'bar']
  const locationId = undefined
  const route = { params: { datasetIds, locationId } }
  const store = { dispatch, commit }

  process.client = true
  const loadLocationId = await loadModule(import(modulePath))

  loadLocationId({ route, store })

  expect(dispatch).not.toHaveBeenCalled()
})

test('dont dispatch store action when not on client', async () => {
  const dispatch = jest.fn()
  const commit = jest.fn()
  const datasetIds = ['foo', 'bar']
  const locationId = 'baz'
  const route = { params: { datasetIds, locationId } }
  const store = { dispatch, commit }

  process.client = false
  const loadLocationId = await loadModule(import(modulePath))

  loadLocationId({ route, store })

  expect(dispatch).not.toHaveBeenCalled()
})
