<template>
  <div class="sidebar">
    <navigation-bar
      @toggle-about="toggleAbout"
      @toggle-account="toggleAccount"
      @change-theme="changeTheme"
    />

    <transition name="slide" mode="out-in">
      <UiTray v-if="aboutOpen" @on-close="toggleAbout">
        <template v-slot:header>
          <h2 class="h3">
            About
          </h2>
        </template>
        <template v-slot:body>
          <VueMarkdown
            class="markdown"
            :source="aboutText"
          />
        </template>
      </UiTray>
    </transition>

    <transition name="slide" mode="out-in">
      <UiTray v-if="accountOpen" @on-close="toggleAccount">
        <template v-slot:header>
          <h2 class="h3">
            Account
          </h2>
        </template>
        <template v-slot:body>
          <AccountDetails />
        </template>
      </UiTray>
    </transition>
  </div>
</template>

<script>
import _ from 'lodash'
import VueMarkdown from 'vue-markdown'
import update from 'lodash/fp/update'
import { mapGetters } from 'vuex'
import NavigationBar from '../../components/navigation-bar/navigation-bar'
import UiTray from '../../components/ui-tray'
import AccountDetails from '../../components/account-details'
import aboutText from '~/assets/docs/about-text.md'

export default {
  components: {
    AccountDetails,
    NavigationBar,
    UiTray,
    VueMarkdown
  },
  data: () => ({
    aboutOpen: false,
    accountOpen: false,
    aboutText: aboutText.html
  }),
  computed: {
    ...mapGetters('map', ['getActiveTheme'])
  },
  methods: {
    changeTheme () {
      let newparams
      let oldIdsArray = []
      const newRouteObject = this.$route
      const oldIds = newRouteObject.params.datasetIds
      const datasets = this.getActiveTheme.datasets

      if (oldIds) {
        oldIdsArray = oldIds.split(',')
      }

      // When new theme is chosen update the route with the datasets within this theme
      const newIds = _.intersection(oldIdsArray, datasets)

      if (newIds.length > 0) {
        newparams = newIds.join(',')
      }
      newRouteObject.params.datasetIds = newparams
      this.updateRoute(newRouteObject)
    },
    resetRoute () {
      const { datasetIds } = this.$route.params
      this.$router.push({ name: 'datasetIds', params: { datasetIds } })
    },
    toggleAbout () {
      this.aboutOpen = !this.aboutOpen
      this.accountOpen = false
    },
    toggleAccount () {
      this.accountOpen = !this.accountOpen
      this.aboutOpen = false
    },
    updateRoute (route) {
      const { datasetIds, locationId } = route.params

      if (datasetIds === undefined) {
        this.geometry = {
          type: 'Point',
          coordinates: []
        }
      }

      if (datasetIds === undefined && locationId !== undefined) {
        route = update('params.locationId', () => undefined, route)
      }

      this.$router.push(route)
    }
  }
}
</script>

<style>
  .sidebar .ui-tray {
    left: var(--nav-bar-width);
  }

  .default-layout--sidebar-animating .sidebar .ui-tray {
     transition: left .35s ease;
  }

  .default-layout--sidebar-expanded .sidebar .ui-tray {
    left: var(--nav-bar-expanded-width);
  }
</style>
