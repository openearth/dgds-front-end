import { state } from '../../../../../store/preferences/theme'

test('Initial state', () => {
  const initialState = { active: 'dark' }
  expect(state()).toEqual(initialState)
})
