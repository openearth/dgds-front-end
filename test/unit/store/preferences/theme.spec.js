import { mutations, getters, state } from '../../../../store/preferences/theme'
import getColors from '../../../../lib/styling/colors'
jest.mock('../../../../lib/styling/colors')

describe('state', () => {
  test('Initial state', () => {
    const initialState = { active: 'light', available: ['light', 'dark'] }
    expect(state()).toEqual(initialState)
  })
})

describe('mutations', () => {
  describe('setActive', () => {
    test('sets active property', () => {
      const state = { active: 'light' }
      const setActive = mutations.setActive.bind({
        $setCustomProperties: jest.fn(),
      })
      setActive(state, 'dark')
      expect(state.active).toBe('dark')
    })
    test('sets active property', () => {
      const state = { active: 'light' }
      const $setCustomProperties = jest.fn()
      const setActive = mutations.setActive.bind({
        $setCustomProperties,
      })
      setActive(state, 'dark')
      expect($setCustomProperties).toHaveBeenCalledWith('dark')
    })
  })
})

describe('getters', () => {
  describe('colors', () => {
    test('calls getColors with active property', () => {
      const state = {
        active: 'foo',
      }
      getters.colors(state)
      expect(getColors).toHaveBeenCalledWith(state.active)
    })
  })
})
