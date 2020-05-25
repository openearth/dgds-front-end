import { state } from '../../../../../store/preferences/index.js'

test('Initial state', () => {
  const initialState = {
    sidebarAnimating: false,
    sidebarExpanded: false,
    user: null,
  }
  expect(state).toEqual(initialState)
})
