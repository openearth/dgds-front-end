<template>
  <div />
</template>

<script>
import Oidc from 'oidc-client'

export default {
  name: 'CallbackItem',
  mounted() {
    const store = new Oidc.WebStorageStateStore({ store: window.localStorage })

    new Oidc.UserManager({ userStore: store })
      .signinRedirectCallback()
      .then(user => (window.location = user.state))
      .catch(err => console.error(err))
  }
}
</script>
