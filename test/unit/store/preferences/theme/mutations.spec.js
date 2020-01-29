import { mutations } from '../../../../../store/preferences/theme'

describe('mutations', () => {
  describe('setActive', () => {
    test('sets active property', () => {
      const state = { active: 'light' }
      const setActive = mutations.setActive.bind({
        $setCustomProperties: jest.fn()
      })
      setActive(state, 'dark')
      expect(state.active).toBe('dark')
    })
    test('call $setCustomProperties', () => {
      const state = { active: 'light' }
      const $setCustomProperties = jest.fn()
      const setActive = mutations.setActive.bind({
        $setCustomProperties
      })
      setActive(state, 'dark')
      expect($setCustomProperties).toHaveBeenCalledWith('dark')
    })
  })
})
