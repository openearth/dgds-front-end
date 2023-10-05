<template>
  <v-app>
    <v-app-bar app height="57px" clipped-left color="background" flat>
      <v-spacer />
      <v-stepper class="stepper pa-0" flat non-linear elevation="0">
        <v-stepper-header class="stepper-header" flat>
          <v-stepper-step
            :color="storiesStepColor"
            complete
            editable
            edit-icon="mdi-account-details"
            step="1"
            class="stepper-icon py-0"
            @click="goToStories"
          >
            Stories
          </v-stepper-step>
          <v-divider />
          <v-stepper-step
            class="py-0"
            :color="dataStepColor"
            complete
            editable
            edit-icon="mdi-database"
            step="2"
            @click="goToData"
          >
            Data layers
          </v-stepper-step>
        </v-stepper-header>
      </v-stepper>
      <v-spacer />
    </v-app-bar>
    <side-menu
      @toggle-tour="$tours.introduction.start()"
      @toggle-account="togglePanel('account')"
      @toggle-about="togglePanel('about')"
    />
    <v-main app>
      <router-view />
      <about-panel v-if="panel === 'about'" @close-about="panel = false" />
      <account-panel
        v-if="panel === 'account'"
        @close-account="panel = false"
      />
      <legal-dialog />
    </v-main>
  </v-app>
</template>

<script>
import SideMenu from '@/components/SideMenu'
import AboutPanel from '@/components/AboutPanel.vue'
import AccountPanel from '@/components/AccountPanel.vue'
import auth from '@/components/auth'
import LegalDialog from '@/components/LegalDialog.vue'

import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    SideMenu,
    AboutPanel,
    AccountPanel,
    LegalDialog
  },
  data: () => ({
    panel: false,
    page: 2
  }),
  mounted() {
    this.getUser()
    this.loadDatasets()
  },
  computed: {
    storiesStepColor() {
      const { path } = this.$route
      return path.includes('stories') ? 'blueDeltares' : 'transparent'
    },
    dataStepColor() {
      const { path } = this.$route
      return path.includes('data') ? 'blueDeltares' : 'transparent'
    }
  },
  methods: {
    ...mapActions({ loadDatasets: 'loadDatasets' }),
    ...mapMutations(['setUser']),
    getUser() {
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
    togglePanel(name) {
      if (this.panel === name) {
        this.panel = false
      } else {
        this.panel = name
      }
    },
    goToStories() {
      this.$router.push({ name: 'stories' })
    },
    goToData() {
      this.$router.push({ name: 'data' })
    }
  }
}
</script>
<style lang="css" scoped>
.stepper {
  width: 400px;
  height: 57px;
  box-shadow: 0px 0px 0px;
}

.stepper-header {
  background-color: var(--v-background-base);
  padding: 0px 0px 16px 2px;
}
</style>
