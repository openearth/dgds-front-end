<template>
  <div class="sidebar">
    <navigation-bar
      @toggle-about="toggleAbout"
      @toggle-account="toggleAccount"
      @change-theme="changeTheme"
    />

    <transition name="slide" mode="out-in">
      <ui-tray v-if="aboutOpen" class="about" @on-close="toggleAbout">
        <template v-slot:header>
          <h2 class="h3">
            About
          </h2>
        </template>
        <template v-slot:body>
          <vue-markdown
            class="markdown"
            :watches="['source']"
            :source="aboutText"
            :anchor-attributes="{ target: '_blank' }"
          />
        </template>
      </ui-tray>
    </transition>

    <transition name="slide" mode="out-in">
      <ui-tray v-if="accountOpen" class="account" @on-close="toggleAccount">
        <template v-slot:header>
          <h2 class="h3">
            Account
          </h2>
        </template>
        <template v-slot:body>
          <account-details />
        </template>
        <template v-slot:footer>
          <ui-button v-if="!user" kind="primary" @click="login">
            Login
          </ui-button>
          <ui-button v-else kind="primary" @click="logout">
            Logout
          </ui-button>
        </template>
      </ui-tray>
    </transition>
  </div>
</template>

<script>
  import _ from 'lodash'
  import VueMarkdown from 'vue-markdown'
  import update from 'lodash/fp/update'
  import { mapGetters, mapState } from 'vuex'
  import auth from '../../auth'
  import NavigationBar from '../../components/navigation-bar/navigation-bar'
  import UiButton from '../../components/ui-button'
  import UiTray from '../../components/ui-tray'
  import AccountDetails from '../../components/account-details'

  export default {
    components: {
      AccountDetails,
      NavigationBar,
      UiButton,
      UiTray,
      VueMarkdown,
    },
    data: () => ({
      aboutOpen: false,
      accountOpen: false,
      aboutText: '',
    }),
    computed: {
      ...mapState('preferences', ['user']),
      ...mapGetters('map', ['getActiveTheme']),
    },
    mounted() {
      fetch('/docs/about-text.md')
        .then(res => {
          return res.text()
        })
        .then(response => {
          this.aboutText = response
        })
    },
    methods: {
      login() {
        auth.signinRedirect({ state: window.location.href })
      },
      logout() {
        auth.signoutRedirect({ state: '/portal' })
      },
      changeTheme() {
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
      resetRoute() {
        const { datasetIds } = this.$route.params
        this.$router.push({ name: 'datasetIds', params: { datasetIds } })
      },
      toggleAbout() {
        this.aboutOpen = !this.aboutOpen
        this.accountOpen = false
      },
      toggleAccount() {
        this.accountOpen = !this.accountOpen
        this.aboutOpen = false
      },
      updateRoute(route) {
        const { datasetIds, locationId } = route.params

        if (datasetIds === undefined) {
          this.geometry = {
            type: 'Point',
            coordinates: [],
          }
        }

        if (datasetIds === undefined && locationId !== undefined) {
          route = update('params.locationId', () => undefined, route)
        }

        this.$router.push(route)
      },
    },
  }
</script>

<style>
  .sidebar .ui-tray {
    z-index: 2;
    left: var(--nav-bar-width);
  }

  .default-layout--sidebar-animating .sidebar .ui-tray {
    transition: left 0.35s ease;
  }

  .default-layout--sidebar-expanded .sidebar .ui-tray {
    left: var(--nav-bar-expanded-width);
  }

  .account .ui-tray__footer {
    text-align: right;
  }
</style>
