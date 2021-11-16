<template>
  <v-app>
    <v-app-bar
        app
        height="57px"
        clipped-left
        color="background"
      >
        <v-spacer/>
        <v-stepper
          alt-labels
          class="stepper"
          width="20%"
          height="100%"
          flat
        >
          <v-stepper-header>
            <v-stepper-step
              color="stepperActive"
              complete
              editable
              edit-icon="mdi-account-details"
              step="1"
              class="stepper-icon"
            >
              Stories
            </v-stepper-step>
            <v-divider />
            <v-stepper-step
              color="quite"
              complete
              editable
              edit-icon="mdi-database"
              step="2"
            >
              Data layers
            </v-stepper-step>
          </v-stepper-header>
        </v-stepper>
        <v-spacer/>
      </v-app-bar>
      <side-menu v-if="page===2" @toggle-tour="$tours.introduction.start()" @toggle-account="togglePanel('account')" @toggle-about="togglePanel('about')"  />
      <v-main app>
        <v-stepper
          v-model="page"
          flat
          class="pa-0"
        >
          <v-stepper-items>
            <v-stepper-content step="1">
              <p>STORIES</p>
            </v-stepper-content>
            <v-stepper-content step="2" class="pa-0">
              <v-card
              class="pa-0"
              height="92vh"
              >
                <router-view />
                <about-panel v-if="panel === 'about'" @close-about="panel = false" />
                <account-panel v-if="panel === 'account'" @close-account="panel = false"/>
                <data-set-controls :datasets="datasetsInActiveTheme" />
                <map-component />
                <time-stamp v-show="validTimestamp && getActiveRasterLayer"/>
                <v-tour :steps="tourSteps" :options="tourConfig" name="introduction"></v-tour>
                <legal-dialog />
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
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
import * as Cookies from 'tiny-cookie'

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
    panel: false,
    page: 1
  }),
  mounted () {
    this.showTour()
    this.loadDatasets()
    this.getUser()
  },
  computed: {
    ...mapGetters(['datasetsInActiveTheme', 'getActiveRasterLayer', 'activeTimestamp']),
    validTimestamp () {
      return ![null, '', 'Invalid date'].includes(this.activeTimestamp)
    }
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
    },
    showTour (hideTour = Cookies.get('hideTour')) {
      if (!hideTour) {
        this.$tours.introduction.start()
        Cookies.set('hideTour', false)
      }
    }
  }
}
</script>
<style lang="css" scoped>
  .theme--dark.v-sheet {
    background-color: var(--v-background-base);
}
 .v-icon.notranslate.mdi.mdi-database.theme--dark {
    border-style: solid;
    border-width: thin;
    border-radius: 50%;
    border-color: var(--v-primary-base);
}

</style>
