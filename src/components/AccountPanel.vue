<template>
  <v-navigation-drawer
    class="pl-16"
    permanent
    absolute
    width="40vw"
    color="background"
  >
    <v-container class="account d-flex flex-column">
      <h2 class="h2">
        Account
      </h2>
      <v-btn icon class="close-button" @click="$emit('close-account')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <div class="account-details flex-grow-1 py-3">
        <h3 class="h4 mb-3">
          Account Details
        </h3>
        <dl v-if="user" class="account-details__list">
          <dt><h4>Name</h4></dt>
          <dd class="mb-2">{{ name }}</dd>
          <dt><h4>Email address</h4></dt>
          <dd class="mb-2">{{ email }}</dd>
          <dt><h4>Phone number</h4></dt>
          <dd>{{ phone }}</dd>
        </dl>
        <div v-else class="account-details__placeholder">
          <p>Please login to view your account details</p>
        </div>
      </div>

      <div class="flex-shrink-0">
        <v-btn v-if="!user" @click="login" outlined block>
          Login
        </v-btn>
        <v-btn v-else @click="logout" outlined block>
          Logout
        </v-btn>
      </div>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import auth from '@/components/auth'
import _ from 'lodash'

export default {
  computed: {
    ...mapGetters(['user']),
    name() {
      return _.get(this.user, 'name', '--')
    },
    email() {
      return _.get(this.user, 'email', '--')
    },
    phone() {
      return _.get(this.user, 'phone', '--')
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    login() {
      auth.signinRedirect({ state: window.location.href })
    },
    logout() {
      auth.signoutRedirect({ state: '/portal' })
    }
  }
}
</script>

<style>
.account {
  height: 100%;
}
</style>
