import { state } from '../../../../../store/map/datasets'

test('Initial state', () => {
  const initialState = {}
  expect(state()).toEqual(initialState)
})
