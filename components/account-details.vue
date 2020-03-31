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
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
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
  }

  .account-details__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
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
