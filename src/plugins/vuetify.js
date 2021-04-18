import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import getColors from '@/lib/styling/colors'

Vue.use(Vuetify)
const colors = getColors('dark')
console.log(colors)
export default new Vuetify({
  customVariables: ['@/assets/variables.scss'],
  treeShake: true,
  theme: {
    options: {
      customProperties: true
    },
    dark: true,
    themes: {
      dark: colors
    }
  }
})
