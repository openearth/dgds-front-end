import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import getColors from '@/lib/styling/colors'

import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)
const colors = getColors('dark')
console.log(colors)
export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
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
