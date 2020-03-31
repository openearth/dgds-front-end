import { getters } from '../../../../../store/map/themes.js'

describe('knownDatasetIds', () => {
  test('returns array of known dataset ids', () => {
    const state = {
      themes: {
        theme1: {},
      },
    }
    const result = getters.getThemes(state.themes)
    expect(result).toEqual({ theme1: {} })
  })
})
