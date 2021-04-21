<template>
  <v-app>
    <side-menu @toggle-account="togglePanel('account')" @toggle-about="togglePanel('about')"  />
    <v-main>
      <router-view />
      <about-panel v-if="panel === 'about'" @close-about="panel = false" />
      <account-panel v-if="panel === 'account'" @close-account="panel = false"/>
      <data-set-controls :datasets="datasetsInActiveTheme" />
      <map-component />
      <time-stamp v-show="activeTimestamp !== '' && getActiveRasterLayer"/>
      <v-tour :steps="tourSteps" :options="tourConfig" name="introduction"></v-tour>
      <legal-dialog />
    </v-main>
  </v-app>
</template>

<script>
import MapComponent from '@/components/MapComponent'
import SideMenu from '@/components/SideMenu'
import DataSetControls from '@/components/DataSetControls'
import AboutPanel from '@/components/AboutPanel.vue'
import AccountPanel from '@/components/AccountPanel.vue'
import TimeStamp from '@/components/TimeStamp.vue'
import auth from '@/components/auth'
import LegalDialog from '@/components/LegalDialog.vue'
import { tourConfig, tourSteps } from '@/plugins/vue-tour'

import { mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    MapComponent,
    SideMenu,
    DataSetControls,
    AboutPanel,
    AccountPanel,
    TimeStamp,
    LegalDialog
  },
  data: () => ({
    tourConfig,
    tourSteps,
    panel: false
  }),
  mounted () {
    this.$tours.introduction.start()
    this.loadDatasets()
    this.getUser()
  },
  computed: {
    ...mapGetters(['datasetsInActiveTheme', 'getActiveRasterLayer', 'activeTimestamp'])
  },
  methods: {
    ...mapMutations(['setUser']),
    ...mapActions({ loadDatasets: 'loadDatasets' }),
    getUser () {
      auth
        .getUser()
        .then(user => {
          if (user !== null) {
            this.setUser({ user: user.profile })
          } else {
            this.setUser(null)
          }
        })
        .catch(err => {
          console.log({ err })
        })
    },
    togglePanel (name) {
      if (this.panel === name) {
        this.panel = false
      } else {
        this.panel = name
      }
    }
  }
}
</script>