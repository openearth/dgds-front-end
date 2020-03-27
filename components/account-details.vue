<template>
  <div class="account-details">
    <h3 class="h4">
      Account Details
    </h3>
    <dl>
      <dt>Name</dt>
      <dd>{{ name }}</dd>
      <dt>Email address</dt>
      <dd>{{ email }}</dd>
      <dt>Phone number</dt>
      <dd>{{ phone }}</dd>
    </dl>
    <UiButton kind="primary" @click="login">
      Log in
    </UiButton>
    <UiButton kind="primary" @click="logout">
      Log out
    </UiButton>
  </div>
</template>

<script>
import auth from '../auth'
import UiButton from './ui-button'

export default {
  components: { UiButton },
  computed: {
    name () {
      return 'Lorem ipsum'
    },
    email () {
      return 'Lorem ipsum'
    },
    phone () {
      return 'Lorem ipsum'
    }
  },
  methods: {
    login () {
      auth.signinRedirect({ state: window.location.href })
    },
    logout () {
      auth.signoutRedirect({ state: '/portal' })
    }
  }
}
</script>

<style>
  .account-details dt {
    font-weight: bold;
    margin-bottom: .5rem;
  }

  .account-details dd {
    margin-left: 0;
    margin-bottom: var(--spacing-small);
  }
</style>
