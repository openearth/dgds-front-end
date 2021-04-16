import { state } from '@/store/map/index.js'

test('Initial state', () => {
  const initialState = {
    activeDatasetIds: [],
    activeLocationIds: [],
    activeRasterLayerId: '',
    activeTheme: {},
    collapsedDatasets: [],
    defaultRasterLayerId: '',
    loadingRasterLayers: false,
    geographicalScope: ''
  }
  expect(state).toEqual(initialState)
})
