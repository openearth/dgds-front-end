import { getters } from '@/store/map/themes.js'

describe('getThemes', () => {
  test('returns array of themes', () => {
    const state = {
      themes: [
        {
          theme1: 'foo'
        }
      ]
    }
    const result = getters.getThemes(state.themes)
    expect(result).toEqual([{ theme1: 'foo' }])
  })
})
