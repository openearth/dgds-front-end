import Vue from 'vue'
import vuelidate from '~/plugins/vuelidate'

describe('Vualidate plugin', () => {
  test('installed plugins should not be empty', () => {
    expect(Vue._installedPlugins.length).toBeGreaterThan(0)
  })
})
