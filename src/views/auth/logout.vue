<template>
  <div />
</template>

<script>
import Oidc from 'oidc-client'

export default {
  mounted () {
    new Oidc.UserManager()
      .signoutRedirectCallback()
      .then(user => (window.location = '/'))
      .catch(err => console.error(err))
  }
}
</script>
