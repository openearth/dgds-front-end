import { state } from '../../../../../store/preferences/theme'

test('Initial state', () => {
  const initialState = { active: 'light', available: ['light', 'dark'] }
  expect(state()).toEqual(initialState)
})
