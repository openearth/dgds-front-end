import { state } from '../../../../../store/map/index.js'

test('Initial state', () => {
  const initialState = {
    activeDatasetIds: [],
    activeLocationIds: [],
    activeRasterLayerId: '',
    activeTheme: {},
    collapsedDatasets: [],
    loadingRasterLayers: false,
  }
  expect(state()).toEqual(initialState)
})
