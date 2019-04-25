import { state } from '../../../store'

describe('state', () => {
  test('Initial state', () => {
    const initialState = {}
    expect(state()).toEqual(initialState)
  })
})
