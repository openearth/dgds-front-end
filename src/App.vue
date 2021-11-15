<template>
  <v-app>
    <side-menu @toggle-tour="$tours.introduction.start()" @toggle-account="togglePanel('account')" @toggle-about="togglePanel('about')"  />
    <v-main>
      <router-view />
      <about-panel v-if="panel === 'about'" @close-about="panel = false" />
      <account-panel v-if="panel === 'account'" @close-account="panel = false"/>
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

import { mapMutations } from 'vuex'

export default {
  name: 'App',
  components: {
    SideMenu,
    AboutPanel,
    AccountPanel,
    LegalDialog
  },
  data: () => ({
    panel: false
  }),
  mounted () {
    this.getUser()
  },
  methods: {
    ...mapMutations(['setUser']),
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
