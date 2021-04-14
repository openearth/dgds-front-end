import Vue from 'vue'
import Vuex from 'vuex'
import preferences from './preferences'
import theme from './preferences/theme.js'
import map from './map'
import datasets from './map/datasets.js'
import themes from './map/themes.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    map,
    preferences,
    theme,
    datasets,
    themes
  }
})
