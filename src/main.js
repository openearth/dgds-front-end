import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/vue2mapbox-gl'
import './plugins/vue-tour'
import './plugins/vuelidate'
// import './plugins/vue-gtag'
import VueGtag from 'vue-gtag'

import '@/css/main.css'
import '@/css/typography.css'
import '@/css/markdown.css'
import '@/css/helpers.css'
import '@/css/tour.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

Vue.config.productionTip = false

Vue.use(VueGtag, {
  config: { id: 'UA-9884034-50' }
}, router)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
