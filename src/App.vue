<template>
  <v-app>
    <side-menu @toggle-account="account = !account" @toggle-about="about = !about"  />
    <v-main>
      <router-view />
      <about-panel v-if="about" />
      <account-panel v-if="account" />
      <data-set-controls
        :datasets="datasetsInActiveTheme"
      />
      <map-component />
    </v-main>
  </v-app>
</template>

<script>
import MapComponent from '@/components/MapComponent'
import SideMenu from '@/components/SideMenu'
import DataSetControls from '@/components/DataSetControls'
import AboutPanel from '@/components/AboutPanel.vue'
import AccountPanel from '@/components/AccountPanel.vue'
import auth from '@/components/auth'

import { mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    MapComponent,
    SideMenu,
    DataSetControls,
    AboutPanel,
    AccountPanel
  },
  data: () => ({
    account: false,
    about: false
  }),
  mounted () {
    this.loadDatasets()
    this.getUser()
  },
  computed: {
    ...mapGetters(['datasetsInActiveTheme'])
  },
  methods: {
    ...mapMutations(['setUser']),
    ...mapActions({ loadDatasets: 'loadDatasets' }),
    getUser () {
      console.log('get user')
      auth
        .getUser()
        .then(user => {
          if (user !== null) {
            this.setUser(user.profile)
          } else {
            this.setUser(null)
          }
        })
        .catch(err => {
          console.log({ err })
        })
    }
  }
}
</script>
