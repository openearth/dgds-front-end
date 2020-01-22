import { state } from '../../../../../store/map/index.js'

test('Initial state', () => {
  const initialState = {
    activeDatasetIds: [],
    activeLocationIds: [],
    activeRasterLayerId: '',
    activeTheme: {},
    collapsedDatasets: []
  }
  expect(state()).toEqual(initialState)
})
