<template>
  <div class="account-details">
    <h3 class="h4">
      Account Details
    </h3>
    <dl v-if="user" class="account-details__list">
      <dt>Name</dt>
      <dd>{{ name }}</dd>
      <dt>Email address</dt>
      <dd>{{ email }}</dd>
      <dt>Phone number</dt>
      <dd>{{ phone }}</dd>
    </dl>
    <div v-else class="account-details__placeholder">
      <p>Please login to view your account details</p>
    </div>
    <div class="account-details__buttons">
      <UiButton v-if="!user" kind="primary" @click="login">
        Log in
      </UiButton>
      <UiButton v-else kind="primary" @click="logout">
        Log out
      </UiButton>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import auth from '../auth'
import UiButton from './ui-button'

export default {
  components: { UiButton },
  computed: {
    ...mapState('preferences', ['user']),
    name () {
      return this.user.name || '--'
    },
    email () {
      return this.user.email || '--'
    },
    phone () {
      return this.user.phone || '--'
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
  .account-details {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .account-details__list,
  .account-details__placeholder {
    flex: 1 1 auto;
    margin-bottom: 1.5rem;
  }

  .account-details__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .account-details__buttons {
    margin-bottom: 1.5rem;
    text-align: right;
  }

  .account-details dt {
    margin-bottom: .5rem;
    font-weight: bold;
  }

  .account-details dd {
    margin-bottom: var(--spacing-small);
    margin-left: 0;
  }
</style>
