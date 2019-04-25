import { state } from '../../../../../store/map/index.js'

test('Initial state', () => {
  const initialState = { activeDatasetIds: [], activeLocationIds: [] }
  expect(state()).toEqual(initialState)
})
