<template>
  <div />
</template>

<script>
import Oidc from 'oidc-client'

export default {
  name: 'LogoutItem',
  mounted() {
    new Oidc.UserManager()
      .signoutRedirectCallback()
      .then(user => (window.location = '/'))
      .catch(err => console.error(err))
  }
}
</script>
