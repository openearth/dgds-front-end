import { state } from '@/store/map/index.js'

test('Initial state', () => {
  const initialState = {
    activeDatasetIds: [],
    activeLocationIds: [],
    activeRasterData: {},
    vectorDataCollection: {},
    activeRasterLayerId: 'el',
    activeFlowmapLayer: {},
    activeTheme: '',
    loadingRasterLayers: false,
    geographicalScope: ''
  }
  expect(state).toEqual(initialState)
})
