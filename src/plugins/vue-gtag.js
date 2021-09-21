import Vue from 'vue'
import VueGtag from 'vue-gtag'

Vue.use(VueGtag, {
  config: { id: 'UA-9884034-50', anonymize_ip: true }
})
