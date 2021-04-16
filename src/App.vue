<template>
  <v-app>
    <side-menu />
    <v-main>
      <router-view />
      <data-set-controls />
      <map-component />
    </v-main>
  </v-app>
</template>

<script>
import MapComponent from '@/components/MapComponent'
import SideMenu from '@/components/SideMenu'
import DataSetControls from '@/components/DataSetControls'

import auth from '@/components/auth'

import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',

  components: {
    MapComponent,
    SideMenu,
    DataSetControls
  },
  data: () => ({
    //
  }),
  mounted () {
    this.loadDatasets()
    this.getUser()
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
