import Vue from 'vue'

describe('Vualidate plugin', () => {
  test('installed plugins should not be empty', () => {
    expect(Vue._installedPlugins.length).toBeGreaterThan(0)
  })
})
