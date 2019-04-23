import { getters } from '../../../../../store/preferences/theme'
import getColors from '../../../../../lib/styling/colors'
jest.mock('../../../../../lib/styling/colors')

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
