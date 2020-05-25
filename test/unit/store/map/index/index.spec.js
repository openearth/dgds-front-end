import { state } from '../../../../../store/map/index.js'

test('Initial state', () => {
  const initialState = {
    activeDatasetIds: [],
    activeLocationIds: [],
    activeRasterLayerId: '',
    activeTheme: {},
    collapsedDatasets: [],
    loadingRasterLayers: false,
    geographicalScope: '',
  }
  expect(state).toEqual(initialState)
})
