import { state } from '../../../../../store/map/themes'

test('Initial state', () => {
  const initialState = {}
  expect(state()).toEqual(initialState)
})
