import Vue from 'vue'
import Vuex from 'vuex'
import preferences from './preferences'
import map from './map'
import stories from './stories'
import editor from './editor'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    map,
    stories,
    editor,
    preferences
  }
})
