import { state } from '@/store/map/index.js'

test('Initial state', () => {
  const initialState = {
    activeDatasetIds: [],
    activeLocationIds: [],
    activeRasterData: {},
    vectorDataCollection: {},
    activeRasterLayerId: '',
    activeFlowmapLayer: {},
    activeTheme: '',
    loadingRasterLayers: false,
    geographicalScope: '',
    activeVectorDataIds: 'mo',
    activeSummary: []
  }
  expect(state).toEqual(initialState)
})
